import Agent from "../models/agent.model.js";

export const isAdmin = (req, res, next) => {
  if (req.auth.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Accès refusé. Cette action est réservée aux administrateurs.",
    });
  }

  next();
};

export const isAgent = (req, res, next) => {
  if (req.auth.role !== "agent") {
    return res.status(403).json({
      success: false,
      message: "Accès refusé. Cette action est réservée aux agents.",
    });
  }

  next();
};

export const isValidAgent = async (req, res, next) => {
  try {
    const userId = req.auth.userId;

    const agent = await Agent.findOne({ userId });

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Profil agent introuvable.",
      });
    }

    if (!agent.isValide) {
      return res.status(403).json({
        success: false,
        message:
          "Accès refusé. Votre compte agent est en attente de validation par un administrateur.",
      });
    }

    req.agent = {
      id: agent._id,
      phoneNumber: agent.phoneNumber,
      isValide: agent.isValide,
    };

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la vérification du statut de l'agent",
    });
  }
};

export const isCustomer = (req, res, next) => {
  if (req.auth.role !== "customer") {
    return res.status(403).json({
      success: false,
      message: "Accès refusé. Cette action est réservée aux clients.",
    });
  }

  next();
};

export const isCustomerOrAdmin = (req, res, next) => {
  if (req.auth.role !== "customer" && req.auth.role !== "admin") {
    return res.status(403).json({
      success: false,
      message:
        "Accès refusé. Cette action est réservée aux clients et aux administrateurs.",
    });
  }

  next();
};
