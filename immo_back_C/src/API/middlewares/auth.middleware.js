import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const auth = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    token = req.headers.authorization.split(" ")[1];

    const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userId = decodeToken.userId;

    const user = await User.findById(userId).populate("role");
    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Compte désactivé" });
    }

    req.auth = {
      userId: user._id,
      email: user.email,
      role: user.role.name,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

export default auth;
