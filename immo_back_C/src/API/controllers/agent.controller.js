import Agent from "../models/agent.model.js";
import Wallet from "../models/wallet.model.js";
import Payment from "../models/payment.model.js";
import Notification from "../models/notification.model.js";
import Announcement from "../models/announcement.model.js";
import Customer from "../models/customer.model.js";
import WalletTransaction from "../models/walletTransaction.model.js";
import {
  registerAgentService,
  validateAgentService,
  rejectAgentService,
} from "../services/agent.service.js";

const registerAgent = async (req, res) => {
  try {
    const result = await registerAgentService(req.body);

    res.status(201).json({
      success: true,
      message: result.message,
      data: {
        user: result.user,
        agent: result.agent,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyProfile = (req, res) => {
  const userId = req.auth.userId;

  Agent.findOne({ userId })
    .populate("userId", "firstName lastName email isActive")
    .then((agent) => {
      if (!agent) {
        return res.status(404).json({ message: "Profil agent introuvable" });
      }

      res.status(200).json({
        success: true,
        data: {
          id: agent._id,
          user: agent.userId,
          phoneNumber: agent.phoneNumber,
          isValide: agent.isValide,
          createdAt: agent.createdAt,
          updatedAt: agent.updatedAt,
        },
      });
    })
    .catch((error) =>
      res.status(500).json({ success: false, message: error.message })
    );
};

const validateAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const result = await validateAgentService(agentId);

    res.status(200).json({
      success: true,
      message: result.message,
      data: {
        agent: result.agent,
        user: {
          id: result.user._id,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          isActive: result.user.isActive,
        },
      },
    });
  } catch (error) {
    const statusCode = error.message.includes("introuvable") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const result = await rejectAgentService(agentId);

    res.status(200).json({
      success: true,
      message: result.message,
      data: result.deletedAgent,
    });
  } catch (error) {
    const statusCode = error.message.includes("introuvable") ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

const invalidateAgent = (req, res) => {
  const { agentId } = req.params;

  Agent.findById(agentId)
    .then((agent) => {
      if (!agent) {
        return res.status(404).json({ message: "Agent introuvable" });
      }

      if (!agent.isValide) {
        return res.status(400).json({ message: "Agent déjà invalidé" });
      }

      agent.isValide = false;

      agent
        .save()
        .then((updatedAgent) =>
          res.status(200).json({
            success: true,
            message: "Agent invalidé avec succès",
            data: updatedAgent,
          })
        )
        .catch((error) =>
          res.status(500).json({ success: false, message: error.message })
        );
    })
    .catch((error) =>
      res.status(500).json({ success: false, message: error.message })
    );
};

const getAllAgents = (req, res) => {
  Agent.find()
    .populate("userId", "firstName lastName email isActive")
    .sort({ createdAt: -1 })
    .then((agents) =>
      res.status(200).json({
        success: true,
        count: agents.length,
        data: agents,
      })
    )
    .catch((error) =>
      res.status(500).json({ success: false, message: error.message })
    );
};

const getPendingAgents = (req, res) => {
  Agent.find({ isValide: false })
    .populate("userId", "firstName lastName email isActive createdAt")
    .sort({ createdAt: -1 })
    .then((agents) =>
      res.status(200).json({
        success: true,
        count: agents.length,
        message:
          agents.length > 0
            ? `${agents.length} inscription(s) en attente de validation`
            : "Aucune inscription en attente",
        data: agents,
      })
    )
    .catch((error) =>
      res.status(500).json({ success: false, message: error.message })
    );
};

const getValidatedAgents = (req, res) => {
  Agent.find({ isValide: true })
    .populate("userId", "firstName lastName email isActive")
    .sort({ createdAt: -1 })
    .then((agents) =>
      res.status(200).json({
        success: true,
        count: agents.length,
        data: agents,
      })
    )
    .catch((error) =>
      res.status(500).json({ success: false, message: error.message })
    );
};

// CONSULTER LE SOLDE DU WALLET AGENT
const getMyWalletBalance = (req, res) => {
  const userId = req.auth.userId;

  Agent.findOne({ userId })
    .populate("walletId")
    .then((agent) => {
      if (!agent) {
        return res.status(404).json({ message: "Agent introuvable" });
      }

      if (!agent.walletId) {
        return res.status(404).json({ message: "Wallet introuvable" });
      }

      res.status(200).json({
        success: true,
        data: {
          balance: agent.walletId.balance,
          currency: "immo",
        },
      });
    })
    .catch((error) =>
      res.status(500).json({ success: false, message: error.message })
    );
};

// DEMANDER UN RETRAIT VIA L'AGRÉGATEUR
const requestWithdrawal = (req, res) => {
  const userId = req.auth.userId;
  const { amount, paymentMethod, phoneNumber } = req.body;

  Agent.findOne({ userId })
    .populate("walletId")
    .then((agent) => {
      if (!agent) {
        return res.status(404).json({ message: "Agent introuvable" });
      }

      if (!agent.walletId) {
        return res.status(404).json({ message: "Wallet introuvable" });
      }

      const wallet = agent.walletId;

      // Vérifier le solde
      if (wallet.balance < amount) {
        return res.status(400).json({
          success: false,
          message: "Solde insuffisant pour ce retrait",
          required: amount,
          current: wallet.balance,
        });
      }

      // Vérifier montant minimum de retrait (par exemple 1000 immo)
      if (amount < 1000) {
        return res.status(400).json({
          success: false,
          message: "Le montant minimum de retrait est de 1000 immo",
        });
      }

      // Débiter le wallet
      wallet.balance -= amount;

      wallet
        .save()
        .then(() => {
          // Créer l'entrée Payment (transaction wallet ↔ agrégateur)
          const payment = new Payment({
            wallet: wallet._id,
            actualAmount: Number(amount),
            amountPaid: Number(amount),
            paymentMethod: paymentMethod,
            transactionId: `RETRAIT_${Date.now()}`, // Sera remplacé par l'ID de l'agrégateur
            status: "pending", // En attente de traitement par l'agrégateur
            paymentDate: new Date(),
          });

          payment
            .save()
            .then((savedPayment) => {
              // Créer une notification
              Notification.create({
                user: userId,
                title: "Demande de retrait enregistrée",
                message: `Votre demande de retrait de ${amount} immo via ${paymentMethod} a été enregistrée. Le traitement prendra quelques minutes.`,
                action: "paiement",
                emailSent: false,
              });

              res.status(200).json({
                success: true,
                message:
                  "Demande de retrait enregistrée. Votre argent sera transféré sous peu.",
                data: {
                  newBalance: wallet.balance,
                  withdrawalAmount: amount,
                  paymentMethod: savedPayment.paymentMethod,
                  status: savedPayment.status,
                },
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

// CONSULTER LES ANNONCES ASSIGNÉES À L'AGENT
const getMyAssignedAnnouncements = (req, res) => {
  const userId = req.auth.userId;

  Agent.findOne({ userId })
    .then((agent) => {
      if (!agent) {
        return res.status(404).json({ message: "Agent introuvable" });
      }

      // Trouver toutes les annonces où cet agent est dans assignedAgents
      Announcement.find({ assignedAgents: agent._id })
        .populate("user", "firstName lastName email")
        .populate("propertyType", "name")
        .sort({ createdAt: -1 })
        .then((announcements) => {
          res.status(200).json({
            success: true,
            count: announcements.length,
            message:
              announcements.length > 0
                ? `Vous avez ${announcements.length} annonce(s) assignée(s)`
                : "Aucune annonce assignée pour le moment",
            data: announcements,
          });
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.message })
        );
    })
    .catch((error) =>
      res.status(500).json({ success: false, message: error.message })
    );
};

// GÉNÉRER LE LIEN DE PARRAINAGE DE L'AGENT
const generateSponsorshipLink = (req, res) => {
  const userId = req.auth.userId;

  Agent.findOne({ userId })
    .populate("userId", "firstName lastName")
    .then((agent) => {
      if (!agent) {
        return res.status(404).json({ message: "Agent introuvable" });
      }

      if (!agent.isValide) {
        return res.status(400).json({
          message:
            "Votre compte doit être validé pour générer un lien de parrainage",
        });
      }

      if (!agent.sponsorshipCode) {
        return res.status(500).json({
          message:
            "Code de parrainage introuvable. Veuillez contacter l'administrateur.",
        });
      }

      // Générer le lien (à adapter selon l'URL du frontend)
      const sponsorshipLink = `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/register?ref=${agent.sponsorshipCode}`;

      res.status(200).json({
        success: true,
        data: {
          sponsorshipCode: agent.sponsorshipCode,
          sponsorshipLink: sponsorshipLink,
          agentName: `${agent.userId.firstName} ${agent.userId.lastName}`,
        },
      });
    })
    .catch((error) =>
      res.status(500).json({ success: false, message: error.message })
    );
};

// CONSULTER LES CLIENTS PARRAINÉS PAR L'AGENT
const getMySponsoredCustomers = (req, res) => {
  const userId = req.auth.userId;

  Agent.findOne({ userId })
    .then((agent) => {
      if (!agent) {
        return res.status(404).json({ message: "Agent introuvable" });
      }

      // Trouver tous les customers qui ont cet agent comme sponsoredBy
      Customer.find({ sponsoredBy: agent._id })
        .populate("userId", "firstName lastName email createdAt")
        .sort({ createdAt: -1 })
        .then((sponsoredCustomers) => {
          res.status(200).json({
            success: true,
            count: sponsoredCustomers.length,
            message:
              sponsoredCustomers.length > 0
                ? `Vous avez parrainé ${sponsoredCustomers.length} client(s)`
                : "Vous n'avez parrainé aucun client pour le moment",
            data: sponsoredCustomers.map((ref) => ({
              customerId: ref._id,
              firstName: ref.userId.firstName,
              lastName: ref.userId.lastName,
              email: ref.userId.email,
              registeredAt: ref.userId.createdAt,
            })),
          });
        })
        .catch((error) =>
          res.status(500).json({ success: false, message: error.message })
        );
    })
    .catch((error) =>
      res.status(500).json({ success: false, message: error.message })
    );
};

// CONSULTER L'HISTORIQUE DES COMMISSIONS DE L'AGENT
const getMyCommissions = (req, res) => {
  const userId = req.auth.userId;

  Agent.findOne({ userId })
    .then((agent) => {
      if (!agent) {
        return res.status(404).json({ message: "Agent introuvable" });
      }

      if (!agent.walletId) {
        return res.status(404).json({ message: "Wallet introuvable" });
      }

      // Récupérer toutes les transactions de type "deposit" liées aux commissions
      WalletTransaction.find({
        wallet: agent.walletId,
        transactionType: "deposit",
        serviceType: {
          $in: [
            "Commission parrainage",
            "Commission visite",
            "Commission parrainage visite virtuelle",
          ],
        },
      })
        .sort({ createdAt: -1 })
        .then((transactions) => {
          // Calculer le total des commissions
          const totalCommissions = transactions.reduce(
            (sum, t) => sum + t.amount,
            0
          );

          res.status(200).json({
            success: true,
            count: transactions.length,
            totalCommissions: totalCommissions,
            data: transactions,
          });
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
  registerAgent,
  getMyProfile,
  validateAgent,
  rejectAgent,
  invalidateAgent,
  getAllAgents,
  getPendingAgents,
  getValidatedAgents,
  getMyWalletBalance,
  requestWithdrawal,
  getMyAssignedAnnouncements,
  generateSponsorshipLink,
  getMySponsoredCustomers,
  getMyCommissions,
};
