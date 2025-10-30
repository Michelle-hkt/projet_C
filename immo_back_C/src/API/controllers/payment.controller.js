import Wallet from "../models/wallet.model.js";
import WalletTransaction from "../models/walletTransaction.model.js";
import Customer from "../models/customer.model.js";
import Announcement from "../models/announcement.model.js";
import Payment from "../models/payment.model.js";
import Visit from "../models/visit.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import Agent from "../models/agent.model.js";
import { distributeVirtualVisitCommission } from "../services/commission.service.js";

const VIRTUAL_VISIT_PRICE = 1500;
const ON_SITE_VISIT_PRICE = 1000;
const CREATE_VIRTUAL_TOUR_PRICE = 3000;
const PUBLISH_ANNOUNCEMENT_PRICE = 1000;

const payForVirtualVisit = (req, res) => {
  const { announcementId } = req.body;
  const userId = req.auth.userId;
  const userRole = req.auth.role;

  // Admin accède gratuitement
  if (userRole === "admin") {
    return Announcement.findById(announcementId)
      .then((announcement) => {
        if (!announcement) {
          return res.status(404).json({ message: "Annonce introuvable" });
        }

        if (
          !announcement.virtualTour?.visitUrl ||
          announcement.virtualTour.visitUrl === "N/A"
        ) {
          return res.status(400).json({
            message: "Cette annonce n'a pas de visite virtuelle disponible",
          });
        }

        return res.status(200).json({
          message: "Accès gratuit pour administrateur",
          visitUrl: announcement.virtualTour.visitUrl,
          photo360: announcement.virtualTour.photo360,
        });
      })
      .catch((error) => res.status(500).json(error));
  }

  // Étape 1 : Récupérer l'annonce
  Announcement.findById(announcementId)
    .then((announcement) => {
      // Vérifier que l'annonce existe
      if (!announcement) {
        return res.status(404).json({ message: "Annonce introuvable" });
      }

      // Étape 2 : Vérifier d'abord si la visite virtuelle existe
      if (
        !announcement.virtualTour?.visitUrl ||
        announcement.virtualTour.visitUrl === "N/A"
      ) {
        return res.status(400).json({
          message: "Cette annonce n'a pas de visite virtuelle disponible",
        });
      }

      // Étape 3 : Vérifier si l'utilisateur est le créateur de l'annonce
      // Si c'est son annonce, il accède gratuitement
      if (announcement.user.toString() === userId.toString()) {
        // Accès gratuit pour le propriétaire
        return res.status(200).json({
          message: "Accès gratuit à votre visite virtuelle",
          visitUrl: announcement.virtualTour.visitUrl,
          photo360: announcement.virtualTour.photo360,
        });
      }

      Customer.findOne({ userId })
        .then((customer) => {
          if (!customer) {
            return res.status(404).json({ message: "Customer introuvable" });
          }

          Wallet.findById(customer.walletId)
            .then((wallet) => {
              if (!wallet) {
                return res.status(404).json({ message: "Wallet introuvable" });
              }

              // Vérifier le solde
              if (wallet.balance < VIRTUAL_VISIT_PRICE) {
                return res.status(400).json({
                  message:
                    "Solde insuffisant pour accéder à la visite virtuelle",
                  required: VIRTUAL_VISIT_PRICE,
                  current: wallet.balance,
                });
              }

              // Débiter le wallet
              wallet.balance -= VIRTUAL_VISIT_PRICE;
              wallet
                .save()
                .then(() => {
                  // Créer la transaction dans l'historique
                  const transaction = new WalletTransaction({
                    wallet: wallet._id,
                    serviceType: "Faire la Visite virtuelle",
                    transactionType: "payment",
                    amount: VIRTUAL_VISIT_PRICE,
                    description: `Accès visite virtuelle: ${announcement.title}`,
                  });

                  transaction
                    .save()
                    .then(async () => {
                      // Distribuer les commissions pour la visite virtuelle
                      try {
                        await distributeVirtualVisitCommission(customer);
                      } catch (commissionError) {
                        console.error(
                          "Erreur distribution commission visite virtuelle:",
                          commissionError
                        );
                        // On continue même si la commission échoue
                      }

                      // Retourner l'URL de la visite virtuelle
                      res.status(200).json({
                        message: "Paiement effectué avec succès",
                        visitUrl: announcement.virtualTour.visitUrl,
                        photo360: announcement.virtualTour.photo360,
                      });
                    })
                    .catch((error) => res.status(500).json(error));
                })
                .catch((error) => res.status(500).json(error));
            })
            .catch((error) => res.status(500).json(error));
        })
        .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(500).json(error));
};

const payForOnSiteVisit = (req, res) => {
  const { announcementId } = req.body;
  const userId = req.auth.userId;
  const userRole = req.auth.role;

  // Admin : création de visite gratuite
  if (userRole === "admin") {
    return Announcement.findById(announcementId)
      .then((announcement) => {
        if (!announcement) {
          return res.status(404).json({ message: "Annonce introuvable" });
        }

        // Créer la demande de visite sans paiement
        const visit = new Visit({
          userId: userId,
          announcementId: announcementId,
          status: "en_attente",
          agentId: null,
        });

        return visit
          .save()
          .then((savedVisit) => {
            // Récupérer UNIQUEMENT les agents assignés à cette annonce
            const assignedAgentIds = announcement.assignedAgents || [];

            if (assignedAgentIds.length === 0) {
              return res.status(200).json({
                success: true,
                message:
                  "Demande de visite créée (admin). Aucun agent assigné à cette annonce pour le moment.",
              });
            }

            return Agent.find({ _id: { $in: assignedAgentIds } })
              .populate("userId")
              .then((agents) => {
                // Envoyer une notification uniquement aux agents assignés
                agents.forEach((agent) => {
                  Notification.create({
                    user: agent.userId._id,
                    title: "Nouvelle demande de visite sur site",
                    message: `Une demande de visite a été faite pour "${announcement.title}" (annonce qui vous est assignée)`,
                    action: "visite",
                    announcement: announcement._id,
                    emailSent: false,
                  });
                });

                // Répondre à l'admin
                res.status(200).json({
                  success: true,
                  message: `Demande de visite créée gratuitement (admin). ${agents.length} agent(s) notifié(s).`,
                });
              });
          })
          .catch((error) => res.status(500).json(error));
      })
      .catch((error) => res.status(500).json(error));
  }

  // Vérifier que l'annonce existe
  Announcement.findById(announcementId)
    .then((announcement) => {
      if (!announcement) {
        return res.status(404).json({ message: "Annonce introuvable" });
      }

      // Trouver le customer et son wallet
      Customer.findOne({ userId })
        .then((customer) => {
          if (!customer) {
            return res.status(404).json({ message: "Customer introuvable" });
          }

          Wallet.findById(customer.walletId)
            .then((wallet) => {
              if (!wallet) {
                return res.status(404).json({ message: "Wallet introuvable" });
              }

              // Vérifier le solde
              if (wallet.balance < ON_SITE_VISIT_PRICE) {
                return res.status(400).json({
                  message:
                    "Solde insuffisant pour réserver une visite sur site",
                  required: ON_SITE_VISIT_PRICE,
                  current: wallet.balance,
                });
              }

              // retirer l'argent necessaire du  wallet
              wallet.balance -= ON_SITE_VISIT_PRICE;
              wallet
                .save()
                .then(() => {
                  //  Créer la transaction
                  const transaction = new WalletTransaction({
                    wallet: wallet._id,
                    serviceType: "visite sur site",
                    transactionType: "payment",
                    amount: ON_SITE_VISIT_PRICE,
                    description: `Demande de visite sur site: ${announcement.title} `,
                  });

                  transaction
                    .save()
                    .then(() => {
                      //  Créer la demande de visite avec status "en_attente"
                      const visit = new Visit({
                        userId: userId,
                        announcementId: announcementId,
                        status: "en_attente",
                        agentId: null,
                      });

                      visit
                        .save()
                        .then((savedVisit) => {
                          // Récupérer UNIQUEMENT les agents assignés à cette annonce
                          const assignedAgentIds =
                            announcement.assignedAgents || [];

                          if (assignedAgentIds.length === 0) {
                            return res.status(200).json({
                              message:
                                "Demande envoyée. Aucun agent disponible pour cette annonce actuellement.",
                            });
                          }

                          Agent.find({ _id: { $in: assignedAgentIds } })
                            .populate("userId")
                            .then((agents) => {
                              // Envoyer une notification uniquement aux agents assignés
                              agents.forEach((agent) => {
                                Notification.create({
                                  user: agent.userId._id,
                                  title: "Nouvelle demande de visite sur site",
                                  message: `Une demande de visite a été faite pour "${announcement.title}" (annonce qui vous est assignée)`,
                                  action: "visite",
                                  announcement: announcement._id,
                                  emailSent: false,
                                });
                              });

                              // Répondre au customer
                              res.status(200).json({
                                message: `Demande envoyée. ${agents.length} agent(s) ont été notifiés. En attente de confirmation.`,
                              });
                            })
                            .catch((error) => res.status(500).json(error));
                        })
                        .catch((error) => res.status(500).json(error));
                    })
                    .catch((error) => res.status(500).json(error));
                })
                .catch((error) => res.status(500).json(error));
            })
            .catch((error) => res.status(500).json(error));
        })
        .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(500).json(error));
};

const payForCreateVirtualTour = (req, res) => {
  const { announcementId } = req.body;
  const userId = req.auth.userId;
  const userRole = req.auth.role;

  // Admin : création gratuite
  if (userRole === "admin") {
    return Announcement.findOne({ _id: announcementId })
      .then((announcement) => {
        if (!announcement) {
          return res.status(404).json({
            message: "Annonce introuvable",
          });
        }

        // La visite virtuelle sera créée par l'API externe
        return res.status(200).json({
          success: true,
          message:
            "Demande de création de visite virtuelle acceptée gratuitement (admin). Visite virtuelle disponible dans un instant.",
        });
      })
      .catch((error) => res.status(500).json(error));
  }

  Customer.findOne({ userId })
    .then((customer) => {
      if (!customer) {
        return res.status(404).json({ message: "Customer introuvable" });
      }

      Wallet.findById(customer.walletId)
        .then((wallet) => {
          if (!wallet) {
            return res.status(404).json({ message: "Wallet introuvable" });
          }

          if (wallet.balance < CREATE_VIRTUAL_TOUR_PRICE) {
            return res.status(400).json({
              message: "Solde insuffisant pour créer une visite virtuelle",
            });
          }

          Announcement.findOne({ _id: announcementId, user: userId })
            .then((announcement) => {
              if (!announcement) {
                return res.status(404).json({
                  message: "Annonce introuvable ",
                });
              }

              wallet.balance -= CREATE_VIRTUAL_TOUR_PRICE;
              wallet
                .save()
                .then(() => {
                  const transaction = new WalletTransaction({
                    wallet: wallet._id,
                    serviceType: "Création de visite virtuelle",
                    transactionType: "payment",
                    amount: CREATE_VIRTUAL_TOUR_PRICE,
                    description: `Création de visite virtuelle pour l'annonce : ${announcement.title}`,
                  });

                  transaction
                    .save()
                    .then(() => {
                      // La visite virtuelle sera créée par l'API externe
                      // L'URL sera ajoutée à l'annonce plus tard
                      res.status(200).json({
                        message:
                          "Paiement effectué. Visite virtuelle disponible dans un instant",
                      });
                    })
                    .catch((error) => res.status(500).json(error));
                })
                .catch((error) => res.status(500).json(error));
            })
            .catch((error) => res.status(500).json(error));
        })
        .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(500).json(error));
};

/*  RECHARGE DU WALLET  */

const rechargeWallet = (req, res) => {
  const { amount, paymentMethod, amountPaid } = req.body;
  const userId = req.auth.userId;
  const userRole = req.auth.role;

  // Admin n'a pas de wallet
  if (userRole === "admin") {
    return res.status(403).json({
      success: false,
      message:
        "Les administrateurs n'ont pas de wallet. Toutes vos actions sont gratuites.",
    });
  }

  Customer.findOne({ userId })
    .then((customer) => {
      if (!customer) {
        return res.status(404).json({ message: "Customer introuvable" });
      }

      Wallet.findById(customer.walletId)
        .then((wallet) => {
          if (!wallet) {
            return res.status(404).json({ message: "Wallet introuvable" });
          }

          // Créer l'entrée Payment (transaction wallet ↔ agrégateur)
          const payment = new Payment({
            wallet: wallet._id,
            actualAmount: Number(amount),
            amountPaid: Number(amountPaid), // Simulé, sera le montant reçu de l'agrégateur
            paymentMethod: paymentMethod,
            transactionId: `T_ID-${Date.now()}`, // Sera remplacé par l'ID de l'agrégateur
            status: "completed", // Simulé pour l'instant
            paymentDate: new Date(),
          });

          payment
            .save()
            .then((savedPayment) => {
              // Créditer le wallet avec le montant payé
              wallet.balance += Number(amount);
              wallet
                .save()
                .then(() => {
                  res.status(200).json({
                    message: "Wallet rechargé avec succès",
                    newBalance: wallet.balance,
                    paymentMethod: savedPayment.paymentMethod,
                  });
                })
                .catch((error) => res.status(500).json(error));
            })
            .catch((error) => res.status(500).json(error));
        })
        .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(500).json(error));
};

// CONSULTER LE SOLDE DU WALLET

const getWalletBalance = (req, res) => {
  const userId = req.auth.userId;
  const userRole = req.auth.role;

  // Admin n'a pas de wallet
  if (userRole === "admin") {
    return res.status(200).json({
      success: true,
      message:
        "Les administrateurs n'ont pas de wallet. Toutes vos actions sont gratuites.",
      balance: "Illimité",
    });
  }

  Customer.findOne({ userId })
    .then((customer) => {
      if (!customer) {
        return res.status(404).json({ message: "Customer introuvable" });
      }

      Wallet.findById(customer.walletId)
        .then((wallet) => {
          if (!wallet) {
            return res.status(404).json({ message: "Wallet introuvable" });
          }

          res.status(200).json({
            balance: wallet.balance,
          });
        })
        .catch((error) => res.status(500).json(error));
    })
    .catch((error) => res.status(500).json(error));
};

// PAYER POUR PUBLIER UNE ANNONCE

const payForPublishAnnouncement = (req, res) => {
  const userId = req.auth.userId;
  const userRole = req.auth.role;

  // Admin : publication gratuite
  if (userRole === "admin") {
    return res.status(200).json({
      success: true,
      message: "Publication gratuite pour les administrateurs.",
      data: {
        balance: "Illimité",
        amountPaid: 0,
      },
    });
  }

  Customer.findOne({ userId })
    .then((customer) => {
      if (!customer) {
        return res.status(404).json({ message: "Customer introuvable" });
      }

      Wallet.findById(customer.walletId)
        .then((wallet) => {
          if (!wallet) {
            return res.status(404).json({ message: "Wallet introuvable" });
          }

          if (wallet.balance < PUBLISH_ANNOUNCEMENT_PRICE) {
            return res.status(400).json({
              message: "Solde insuffisant pour publier une annonce",
              required: PUBLISH_ANNOUNCEMENT_PRICE,
              current: wallet.balance,
            });
          }

          // Débiter le wallet
          wallet.balance -= PUBLISH_ANNOUNCEMENT_PRICE;
          wallet
            .save()
            .then(() => {
              // Créer la transaction dans l'historique
              const transaction = new WalletTransaction({
                wallet: wallet._id,
                serviceType: "Publication d'annonce",
                transactionType: "payment",
                amount: PUBLISH_ANNOUNCEMENT_PRICE,
                description: "Frais de publication d'une annonce",
              });

              transaction
                .save()
                .then(() => {
                  // Créer une notification
                  Notification.create({
                    user: userId,
                    title: "Paiement confirmé",
                    message: `Votre paiement de ${PUBLISH_ANNOUNCEMENT_PRICE} immo pour la publication d'annonce a été confirmé. Vous pouvez maintenant créer votre annonce.`,
                    action: "paiement",
                    emailSent: false,
                  });

                  res.status(200).json({
                    success: true,
                    message:
                      "Paiement effectué avec succès. Vous pouvez maintenant publier votre annonce.",
                    data: {
                      newBalance: wallet.balance,
                      amountPaid: PUBLISH_ANNOUNCEMENT_PRICE,
                    },
                  });
                })
                .catch((error) =>
                  res
                    .status(500)
                    .json({ success: false, message: error.message })
                );
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
  payForVirtualVisit,
  payForOnSiteVisit,
  payForCreateVirtualTour,
  rechargeWallet,
  getWalletBalance,
  payForPublishAnnouncement,
};
