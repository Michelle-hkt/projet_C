import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Agent from "../models/agent.model.js";
import Role from "../models/role.model.js";
import Notification from "../models/notification.model.js";
import Wallet from "../models/wallet.model.js";

const saltRounds = 10;

export const registerAgentService = async (agentData) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    address,
    description,
    profileImage,
    cipImage,
  } = agentData;

  const existingUser = await User.findOne({ email }).populate("role");
  if (existingUser) {
    if (existingUser.role.name === "customer") {
      throw new Error(
        "Cet email est déjà associé à un compte client. Vous ne pouvez pas créer un compte agent avec le même email. Veuillez utiliser une autre adresse email."
      );
    } else if (existingUser.role.name === "agent") {
      throw new Error(
        "Vous avez déjà un compte agent avec cet email. Vous ne pouvez pas vous inscrire à nouveau."
      );
    } else {
      throw new Error("Cet email est déjà utilisé par un autre compte.");
    }
  }

  const agentRole = await Role.findOne({ name: "agent" });
  if (!agentRole) {
    throw new Error("Le rôle agent n'existe pas");
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: agentRole._id,
    isActive: false,
  });

  const newWallet = await Wallet.create({
    userId: newUser._id,
    balance: 0,
  });

  const newAgent = await Agent.create({
    userId: newUser._id,
    phoneNumber,
    address,
    description,
    profileImage,
    cipImage,
    isValide: false,
    walletId: newWallet._id,
  });

  return {
    user: {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: agentRole.name,
      isActive: newUser.isActive,
    },
    agent: {
      id: newAgent._id,
      phoneNumber: newAgent.phoneNumber,
      isValide: newAgent.isValide,
    },
    wallet: {
      id: newWallet._id,
      balance: newWallet.balance,
    },
    message:
      "Inscription réussie. Votre compte est en attente de validation par un administrateur. Vous pourrez vous connecter une fois votre compte validé.",
  };
};

export const validateAgentService = async (agentId) => {
  const agent = await Agent.findById(agentId).populate("userId");

  if (!agent) {
    throw new Error("Agent introuvable");
  }

  if (agent.isValide) {
    throw new Error("Agent déjà validé");
  }

  agent.isValide = true;
  await agent.save();

  const user = await User.findById(agent.userId._id);
  user.isActive = true;
  await user.save();

  await Notification.create({
    user: user._id,
    title: "Compte agent validé",
    message: `Félicitations ${user.firstName} ! Votre compte agent a été validé par l'administrateur. Vous pouvez maintenant vous connecter et utiliser toutes les fonctionnalités agent.`,
    action: "validation_compte",
    emailSent: false,
  });

  return {
    agent,
    user,
    message:
      "Agent validé avec succès. Une notification a été envoyée à l'utilisateur.",
  };
};

export const rejectAgentService = async (agentId) => {
  const agent = await Agent.findById(agentId).populate("userId");

  if (!agent) {
    throw new Error("Agent introuvable");
  }

  if (agent.isValide) {
    throw new Error(
      "Impossible de rejeter un agent déjà validé. Veuillez d'abord l'invalider."
    );
  }

  const user = agent.userId;

  await Notification.create({
    user: user._id,
    title: "Inscription agent rejetée",
    message: `Bonjour ${user.firstName}, nous sommes désolés de vous informer que votre demande d'inscription en tant qu'agent a été rejetée par l'administrateur. Pour plus d'informations, veuillez nous contacter.`,
    action: "validation_compte",
    emailSent: false,
  });

  await Agent.findByIdAndDelete(agentId);
  await User.findByIdAndDelete(user._id);

  return {
    message: `Inscription de l'agent ${user.firstName} ${user.lastName} rejetée et supprimée avec succès. Une notification a été envoyée à l'utilisateur.`,
    deletedAgent: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  };
};
