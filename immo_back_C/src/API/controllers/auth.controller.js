import { registerService, loginService } from "../services/auth.service.js";

const register = async (req, res) => {
  try {
    const result = await registerService(req.body);

    res.status(201).json({
      success: true,
      message: "Inscription réussie",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await loginService(req.body);

    res.status(200).json({
      success: true,
      message: "Connexion réussie",
      data: result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Déconnexion réussie",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default { register, login, logout };
