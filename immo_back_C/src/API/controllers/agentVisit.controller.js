import Visit from "../models/visit.model.js";
import Notification from "../models/notification.model.js";
import Announcement from "../models/announcement.model.js";
import User from "../models/user.model.js";
import Customer from "../models/customer.model.js";
import { distributeOnSiteVisitCommission } from "../services/commission.service.js";

// Voir toutes les demandes de visite en attente
const getPendingVisits = (req, res) => {
  Visit.find({ status: "en_attente" })
    .populate("userId", "firstName lastName email")
    .populate({
      path: "announcementId",
      select: "title location price images",
      populate: {
        path: "user",
        select: "firstName lastName email",
      },
    })
    .sort({ createdAt: -1 })
    .then((visits) => {
      res.status(200).json({
        success: true,
        count: visits.length,
        message:
          visits.length > 0
            ? `${visits.length} demande(s) de visite en attente`
            : "Aucune demande de visite en attente",
        data: visits,
      });
    })
    .catch((error) =>
      res.status(500).json({ success: false, message: error.message })
    );
};

// Voir toutes les visites acceptées par l'agent
const getMyAcceptedVisits = (req, res) => {
  const agentUserId = req.auth.userId;

  Visit.find({ agentId: agentUserId, status: "accepter" })
    .populate("userId", "firstName lastName email")
    .populate({
      path: "announcementId",
      select: "title location price images",
      populate: {
        path: "user",
        select: "firstName lastName email",
      },
    })
    .sort({ createdAt: -1 })
    .then((visits) => {
      res.status(200).json({
        success: true,
        count: visits.length,
        data: visits,
      });
    })
    .catch((error) =>
      res.status(500).json({ success: false, message: error.message })
    );
};

// Voir toutes les visites confirmées par l'agent
const getMyConfirmedVisits = (req, res) => {
  const agentUserId = req.auth.userId;

  Visit.find({ agentId: agentUserId, status: "confirmer" })
    .populate("userId", "firstName lastName email")
    .populate({
      path: "announcementId",
      select: "title location price images",
      populate: {
        path: "user",
        select: "firstName lastName email",
      },
    })
    .sort({ visitDate: 1 })
    .then((visits) => {
      res.status(200).json({
        success: true,
        count: visits.length,
        data: visits,
      });
    })
    .catch((error) =>
      res.status(500).json({ success: false, message: error.message })
    );
};

// Accepter une demande de visite
const acceptVisit = async (req, res) => {
  const { visitId } = req.params;
  const agentUserId = req.auth.userId;

  try {
    const visit = await Visit.findById(visitId)
      .populate("userId", "firstName lastName email")
      .populate("announcementId", "title location user");

    if (!visit) {
      return res.status(404).json({
        success: false,
        message: "Demande de visite introuvable",
      });
    }

    if (visit.status !== "en_attente") {
      return res.status(400).json({
        success: false,
        message: `Cette demande a déjà été ${
          visit.status === "accepter" ? "acceptée" : visit.status
        }`,
      });
    }

    // Récupérer le customer avec les infos de parrainage
    const customer = await Customer.findOne({ userId: visit.userId._id })
      .populate("userId", "firstName lastName email")
      .populate("sponsoredBy");

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer introuvable",
      });
    }

    // L'agent accepte la demande
    visit.status = "accepter";
    visit.agentId = agentUserId;
    visit.sponsorshipAgentId = customer.sponsoredBy || null;

    const updatedVisit = await visit.save();

    // Distribuer les commissions
    const agentUser = await User.findById(agentUserId);
    await distributeOnSiteVisitCommission(visit, customer, agentUser);

    // Marquer la commission comme payée
    visit.commissionPaid = true;
    await visit.save();

    // Récupérer les informations du propriétaire de l'annonce
    const owner = await User.findById(updatedVisit.announcementId.user);

    // Créer une notification pour le customer
    await Notification.create({
      user: visit.userId._id,
      title: "Demande de visite acceptée",
      message: `Votre demande de visite pour "${updatedVisit.announcementId.title}" a été prise en charge par un agent. Vous serez contacté prochainement pour confirmer la date et l'heure.`,
      action: "visite",
      announcement: updatedVisit.announcementId._id,
      emailSent: false,
    });

    // Retourner les informations complètes
    res.status(200).json({
      success: true,
      message:
        "Demande acceptée avec succès. Le customer a été notifié et les commissions ont été distribuées.",
      data: {
        visit: updatedVisit,
        customerInfo: {
          firstName: visit.userId.firstName,
          lastName: visit.userId.lastName,
          email: visit.userId.email,
          phoneNumber: customer.contact.phoneNumber || null,
          whatsappNumber: customer.contact.whatsappNumber || null,
        },
        propertyOwnerInfo: {
          firstName: owner.firstName,
          lastName: owner.lastName,
          email: owner.email,
        },
      },
    });
  } catch (error) {
    console.error("Erreur acceptation visite:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Confirmer une visite avec date, heure et lieu
const confirmVisit = (req, res) => {
  const { visitId } = req.params;
  const { visitDate, visitTime, meetingPlace } = req.body;
  const agentUserId = req.auth.userId;

  Visit.findById(visitId)
    .populate("userId", "firstName lastName email")
    .populate("announcementId", "title location")
    .then((visit) => {
      if (!visit) {
        return res.status(404).json({
          success: false,
          message: "Visite introuvable",
        });
      }

      if (visit.agentId.toString() !== agentUserId.toString()) {
        return res.status(403).json({
          success: false,
          message:
            "Vous ne pouvez confirmer que les visites que vous avez acceptées",
        });
      }

      if (visit.status !== "accepter") {
        return res.status(400).json({
          success: false,
          message: "Cette visite ne peut pas être confirmée",
        });
      }

      // Mettre à jour les informations de la visite
      visit.status = "confirmer";
      visit.visitDate = visitDate;
      visit.visitTime = visitTime;
      visit.meetingPlace = meetingPlace;

      visit
        .save()
        .then((updatedVisit) => {
          // Formater la date pour le message
          const dateObj = new Date(visitDate);
          const formattedDate = dateObj.toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          // Créer une notification pour le customer avec toutes les infos
          Notification.create({
            user: visit.userId._id,
            title: "Visite confirmée",
            message: `Votre visite pour "${updatedVisit.announcementId.title}" est confirmée !\n\nDate : ${formattedDate}\nHeure : ${visitTime}\nLieu de rencontre : ${meetingPlace}\n\nSoyez à l'heure !`,
            action: "visite",
            announcement: updatedVisit.announcementId._id,
            emailSent: false,
          })
            .then(() => {
              res.status(200).json({
                success: true,
                message:
                  "Visite confirmée avec succès. Le customer a été notifié avec tous les détails.",
                data: updatedVisit,
              });
            })
            .catch((error) =>
              res.status(500).json({ success: false, message: error.message })
            );
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.message })
        );
    })
    .catch((error) =>
      res.status(500).json({ success: false, message: error.message })
    );
};

// Annuler une visite
const cancelVisit = (req, res) => {
  const { visitId } = req.params;
  const { reason } = req.body;
  const agentUserId = req.auth.userId;

  Visit.findById(visitId)
    .populate("userId", "firstName lastName email")
    .populate("announcementId", "title")
    .then((visit) => {
      if (!visit) {
        return res.status(404).json({
          success: false,
          message: "Visite introuvable",
        });
      }

      if (visit.agentId.toString() !== agentUserId.toString()) {
        return res.status(403).json({
          success: false,
          message:
            "Vous ne pouvez annuler que les visites que vous avez acceptées",
        });
      }

      visit.status = "annuler";

      visit
        .save()
        .then((updatedVisit) => {
          // Notifier le customer
          Notification.create({
            user: visit.userId._id,
            title: "Visite annulée",
            message: `Votre visite pour "${
              updatedVisit.announcementId.title
            }" a été annulée par l'agent.${
              reason ? ` Raison : ${reason}` : ""
            }`,
            action: "visite",
            announcement: updatedVisit.announcementId._id,
            emailSent: false,
          })
            .then(() => {
              res.status(200).json({
                success: true,
                message: "Visite annulée. Le customer a été notifié.",
                data: updatedVisit,
              });
            })
            .catch((error) =>
              res.status(500).json({ success: false, message: error.message })
            );
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.message })
        );
    })
    .catch((error) =>
      res.status(500).json({ success: false, message: error.message })
    );
};

export default {
  getPendingVisits,
  getMyAcceptedVisits,
  getMyConfirmedVisits,
  acceptVisit,
  confirmVisit,
  cancelVisit,
};
