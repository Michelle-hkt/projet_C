import Wallet from "../models/wallet.model.js";
import WalletTransaction from "../models/walletTransaction.model.js";
import Agent from "../models/agent.model.js";
import Customer from "../models/customer.model.js";
import Notification from "../models/notification.model.js";

// Pourcentages de commission
const PLATFORM_COMMISSION_RATE = 0.7; // 70% pour la plateforme
const SPONSORSHIP_AGENT_COMMISSION_RATE = 0.3; // 30% pour l'agent parrain

// Montants des commissions pour chaque service
const VIRTUAL_VISIT_COMMISSION = 2000; // Commission totale pour visite virtuelle
const ON_SITE_VISIT_COMMISSION = 1000; // Commission totale pour visite sur site

/**
 * Distribue les commissions pour une visite sur site acceptée par un agent
 * @param {Object} visit - La visite acceptée
 * @param {Object} customer - Le customer qui a demandé la visite
 * @param {Object} acceptingAgent - L'agent qui accepte la visite
 * @returns {Promise<Object>} - Détails de la distribution
 */
export const distributeOnSiteVisitCommission = async (
  visit,
  customer,
  acceptingAgent
) => {
  try {
    const totalCommission = ON_SITE_VISIT_COMMISSION;

    // Vérifier si le customer a un agent parrain
    const sponsorshipAgent = customer.sponsoredBy
      ? await Agent.findById(customer.sponsoredBy).populate("userId walletId")
      : null;

    // Cas 1 : Le customer a été parrainé
    if (sponsorshipAgent) {
      // Distribution : 70% plateforme, 30% agent parrain
      const platformShare = Math.round(
        totalCommission * PLATFORM_COMMISSION_RATE
      );
      const sponsorshipShare = Math.round(
        totalCommission * SPONSORSHIP_AGENT_COMMISSION_RATE
      );

      // Créditer l'agent parrain
      const sponsorshipWallet = sponsorshipAgent.walletId;
      sponsorshipWallet.balance += sponsorshipShare;
      await sponsorshipWallet.save();

      await WalletTransaction.create({
        wallet: sponsorshipWallet._id,
        serviceType: "Commission parrainage",
        transactionType: "deposit",
        amount: sponsorshipShare,
        description: `Commission de parrainage pour visite sur site (${customer.userId.firstName} ${customer.userId.lastName})`,
      });

      // Notifier l'agent parrain
      await Notification.create({
        user: sponsorshipAgent.userId._id,
        title: "Commission de parrainage reçue",
        message: `Vous avez reçu ${sponsorshipShare} immo de commission pour le parrainage de ${customer.userId.firstName} ${customer.userId.lastName}`,
        action: "paiement",
        emailSent: false,
      });

      return {
        success: true,
        distribution: {
          platform: platformShare,
          sponsorshipAgent: sponsorshipShare,
        },
      };
    }
    // Cas 2 : Pas de parrain
    else {
      // Distribution : 100% plateforme
      const platformShare = totalCommission;

      return {
        success: true,
        distribution: {
          platform: platformShare,
        },
      };
    }
  } catch (error) {
    console.error("Erreur lors de la distribution des commissions:", error);
    throw new Error(
      "Impossible de distribuer les commissions: " + error.message
    );
  }
};

/**
 * Distribue les commissions pour une visite virtuelle
 * @param {Object} customer - Le customer qui a payé
 * @returns {Promise<Object>} - Détails de la distribution
 */
export const distributeVirtualVisitCommission = async (customer) => {
  try {
    const totalCommission = VIRTUAL_VISIT_COMMISSION;

    // Vérifier si le customer a un agent parrain
    const sponsorshipAgent = customer.sponsoredBy
      ? await Agent.findById(customer.sponsoredBy).populate("userId walletId")
      : null;

    if (sponsorshipAgent) {
      // Distribution : 70% plateforme, 30% agent parrain
      const platformShare = Math.round(
        totalCommission * PLATFORM_COMMISSION_RATE
      );
      const sponsorshipShare = Math.round(
        totalCommission * SPONSORSHIP_AGENT_COMMISSION_RATE
      );

      // Créditer l'agent parrain
      const sponsorshipWallet = sponsorshipAgent.walletId;
      sponsorshipWallet.balance += sponsorshipShare;
      await sponsorshipWallet.save();

      await WalletTransaction.create({
        wallet: sponsorshipWallet._id,
        serviceType: "Commission parrainage visite virtuelle",
        transactionType: "deposit",
        amount: sponsorshipShare,
        description: `Commission de parrainage pour visite virtuelle`,
      });

      // Notifier l'agent parrain
      await Notification.create({
        user: sponsorshipAgent.userId._id,
        title: "Commission de parrainage reçue",
        message: `Vous avez reçu ${sponsorshipShare} immo de commission pour une visite virtuelle de votre filleul`,
        action: "paiement",
        emailSent: false,
      });

      return {
        success: true,
        distribution: {
          platform: platformShare,
          sponsorshipAgent: sponsorshipShare,
        },
      };
    } else {
      // Pas de parrain : 100% pour la plateforme
      return {
        success: true,
        distribution: {
          platform: totalCommission,
        },
      };
    }
  } catch (error) {
    console.error(
      "Erreur lors de la distribution des commissions visite virtuelle:",
      error
    );
    throw new Error(
      "Impossible de distribuer les commissions: " + error.message
    );
  }
};
