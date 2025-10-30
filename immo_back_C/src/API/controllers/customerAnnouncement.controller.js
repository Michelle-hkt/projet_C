import Announcement from "../models/announcement.model.js";
import Wallet from "../models/wallet.model.js";
import WalletTransaction from "../models/walletTransaction.model.js";
import Customer from "../models/customer.model.js";
import Notification from "../models/notification.model.js";
import Agent from "../models/agent.model.js";
import {
  assignAgentsToAnnouncement,
  calculateCommission,
} from "../services/agentAssignment.service.js";

const ANNOUNCEMENT_COST = 1000; // Frais de publication
const VIRTUAL_TOUR_COST = 1500; // Frais de visite virtuelle

const createMyAnnouncement = async (req, res) => {
  const userId = req.auth.userId;

  try {
    // Étape 1 : Vérifier le customer
    const customer = await Customer.findOne({ userId });
    if (!customer) {
      return res.status(404).json({ message: "Customer introuvable" });
    }

    // Étape 2 : Vérifier le wallet
    const wallet = await Wallet.findById(customer.walletId);
    if (!wallet) {
      return res.status(404).json({ message: "Wallet introuvable" });
    }

    // Étape 3 : Calculer la commission selon le type de bien
    const commission = calculateCommission(req.body.status, req.body.price);

    // Étape 4 : Calculer le coût total
    const hasVirtualTour =
      req.body.virtualTour?.photo360 !== null &&
      req.body.virtualTour?.photo360 !== undefined;
    const virtualTourCost = hasVirtualTour ? VIRTUAL_TOUR_COST : 0;
    const totalCost = ANNOUNCEMENT_COST + commission + virtualTourCost;

    // Vérifier le solde
    if (wallet.balance < totalCost) {
      return res.status(400).json({
        message: "Solde insuffisant pour publier cette annonce",
        required: totalCost,
        current: wallet.balance,
      });
    }

    // Étape 5 : Assigner automatiquement 3 agents selon la localisation
    const assignedAgentIds = await assignAgentsToAnnouncement(
      req.body.district
    );

    // Étape 6 : Débiter le wallet
    wallet.balance -= totalCost;
    await wallet.save();

    // Étape 7 : Créer la transaction
    const transaction = new WalletTransaction({
      wallet: wallet._id,
      serviceType: "Publication annonce",
      transactionType: "payment",
      amount: totalCost,
      description: `Publication de l'annonce: ${req.body.title} (Publication: ${ANNOUNCEMENT_COST}, Commission: ${commission}, Visite virtuelle: ${virtualTourCost})`,
    });
    await transaction.save();

    // Étape 8 : Créer l'annonce avec la commission et les agents assignés (publiée directement)
    const announcement = new Announcement({
      ...req.body,
      user: userId,
      isValid: true,
      publicationDate: new Date(),
      commission: commission,
      assignedAgents: assignedAgentIds,
    });

    const savedAnnouncement = await announcement.save();

    // Étape 9 : Notifier les agents assignés
    if (assignedAgentIds.length > 0) {
      const agents = await Agent.find({
        _id: { $in: assignedAgentIds },
      }).populate("userId", "firstName lastName");

      agents.forEach((agent) => {
        Notification.create({
          user: agent.userId._id,
          title: "Nouvelle annonce assignée",
          message: `Une nouvelle annonce "${req.body.title}" vous a été assignée dans la région de ${req.body.district}`,
          action: "visite",
          announcement: savedAnnouncement._id,
          emailSent: false,
        });
      });

      // Étape 9 : Notifier le customer créateur avec les détails des agents assignés
      const agentsDetails = agents
        .map(
          (agent, index) =>
            `\n\nAgent ${index + 1}:\n- Nom: ${agent.userId.firstName} ${
              agent.userId.lastName
            }\n- Photo: ${agent.cipImage || "Non disponible"}\n- Description: ${
              agent.description || "Aucune description"
            }`
        )
        .join("");

      await Notification.create({
        user: userId,
        title: "Agents assignés à votre annonce",
        message: `Votre annonce "${req.body.title}" a été créée avec succès ! Voici les agents qui vous accompagneront :${agentsDetails}`,
        action: "visite",
        announcement: savedAnnouncement._id,
        emailSent: false,
      });
    }

    res.status(201).json({
      message: "Annonce créée avec succès",
      data: savedAnnouncement,
      assignedAgents: assignedAgentIds.length,
      commission: commission,
    });
  } catch (error) {
    console.error("Erreur création annonce:", error.message);
    res.status(500).json({
      message: "Erreur lors de la création de l'annonce",
      error: error.message,
    });
  }
};

const getMyAnnouncements = (req, res) => {
  const userId = req.auth.userId;

  Announcement.find({ user: userId })
    .select("-virtualTour.photo360") // Exclure seulement la photo360
    .slice("gallery", 1) // Ne prendre que la première image de la galerie
    .sort({ createdAt: -1 })
    .then((announcements) => res.status(200).json(announcements))
    .catch((error) => res.status(500).json(error));
};

const updateMyAnnouncement = (req, res) => {
  const userId = req.auth.userId;
  const { id } = req.params;

  Announcement.findOne({ _id: id, user: userId })
    .then((announcement) => {
      if (!announcement) {
        return res.status(404).json({
          message: "Annonce introuvable ",
        });
      }

      Announcement.updateOne(
        { _id: id },
        {
          _id: id,
          ...req.body,
        }
      )
        .then(() =>
          res.status(200).json({ message: "Annonce modifiée avec succès" })
        )
        .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(500).json(error));
};

const deleteMyAnnouncement = (req, res) => {
  const userId = req.auth.userId;
  const { id } = req.params;

  Announcement.findOne({ _id: id, user: userId })
    .then((announcement) => {
      if (!announcement) {
        return res.status(404).json({
          message: "Annonce introuvable ou vous n'êtes pas le propriétaire",
        });
      }

      Announcement.deleteOne({ _id: id })
        .then(() =>
          res.status(200).json({ message: "Annonce supprimée avec succès" })
        )
        .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(500).json(error));
};

export default {
  createMyAnnouncement,
  getMyAnnouncements,
  updateMyAnnouncement,
  deleteMyAnnouncement,
};
