import jwt from "jsonwebtoken";

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.TOKEN_SECRET, {
    expiresIn: "7d",
    algorithm: "HS256",
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.TOKEN_SECRET);
};
