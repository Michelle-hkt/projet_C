import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Customer from "../models/customer.model.js";
import Wallet from "../models/wallet.model.js";
import Role from "../models/role.model.js";
import Agent from "../models/agent.model.js";
import { generateToken } from "../utils/jwt.util.js";

const saltRounds = 10;

export const registerService = async (userData) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    whatsappNumber,
    sponsorshipCode,
  } = userData;

  const existingUser = await User.findOne({ email }).populate("role");
  if (existingUser) {
    if (existingUser.role.name === "agent") {
      throw new Error(
        "Cet email est déjà associé à un compte agent. Vous ne pouvez pas créer un compte client avec le même email. Si vous souhaitez utiliser les fonctionnalités client, veuillez contacter l'administrateur."
      );
    } else if (existingUser.role.name === "customer") {
      throw new Error(
        "Vous avez déjà un compte client avec cet email. Veuillez vous connecter."
      );
    } else {
      throw new Error("Cet email est déjà utilisé par un autre compte.");
    }
  }

  const customerRole = await Role.findOne({ name: "customer" });
  if (!customerRole) {
    throw new Error("Le rôle customer n'existe pas");
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: customerRole._id,
    isActive: true,
  });

  const newWallet = await Wallet.create({
    userId: newUser._id,
    balance: 0,
  });

  // Vérifier le code de parrainage si fourni
  let sponsoringAgentId = null;
  if (sponsorshipCode) {
    const sponsoringAgent = await Agent.findOne({
      sponsorshipCode,
      isValide: true,
    });
    if (sponsoringAgent) {
      sponsoringAgentId = sponsoringAgent._id;
    }
  }

  const newCustomer = await Customer.create({
    userId: newUser._id,
    contact: {
      phoneNumber,
      whatsappNumber: whatsappNumber || "",
    },
    preferenceKey: [],
    walletId: newWallet._id,
    sponsoredBy: sponsoringAgentId,
  });

  const token = generateToken(newUser._id);

  return {
    token,
    user: {
      id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      role: customerRole.name,
      isActive: newUser.isActive,
      phoneNumber: phoneNumber,
    },
    customer: {
      id: newCustomer._id,
      phoneNumber: newCustomer.contact.phoneNumber,
      whatsappNumber: newCustomer.contact.whatsappNumber,
    },
    wallet: {
      id: newWallet._id,
      balance: newWallet.balance,
    },
  };
};

export const loginService = async (userInfos) => {
  const { email, password } = userInfos;

  const user = await User.findOne({ email }).populate("role");
  if (!user) {
    throw new Error("Email ou mot de passe incorrect");
  }

  if (!user.isActive) {
    throw new Error("Compte a été désactivé");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Email ou mot de passe incorrect");
  }

  let phoneNumber = "";
  let address = "";

  if (user.role.name === "agent") {
    const agent = await Agent.findOne({ userId: user._id });

    if (!agent) {
      throw new Error("Profil agent introuvable");
    }

    if (!agent.isValide) {
      throw new Error(
        "Votre compte agent est en attente de validation par un administrateur. Vous ne pouvez pas vous connecter pour le moment."
      );
    }

    phoneNumber = agent.phoneNumber || "";
  } else if (user.role.name === "customer") {
    const customer = await Customer.findOne({ userId: user._id });
    if (customer) {
      phoneNumber = customer.contact.phoneNumber || "";
      address = customer.address || "";
    }
  }

  const token = generateToken(user._id);

  return {
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role.name,
      isActive: user.isActive,
      phoneNumber: phoneNumber,
      address: address,
    },
  };
};
