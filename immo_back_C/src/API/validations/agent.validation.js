import joi from "joi";

export const registerAgentValidation = joi.object({
  firstName: joi.string().min(4).max(50).required().messages({
    "string.base": "Le prénom doit être une chaîne de caractères.",
    "string.empty": "Le prénom est obligatoire",
    "string.min": "Le prénom doit contenir au moins 4 caractères",
    "string.max": "Le prénom ne peut pas dépasser 50 caractères",
  }),

  lastName: joi.string().min(4).max(50).required().messages({
    "string.base": "Le nom doit être une chaîne de caractères.",
    "string.empty": "Le nom est obligatoire",
    "string.min": "Le nom doit contenir au moins 2 caractères",
    "string.max": "Le nom ne peut pas dépasser 50 caractères",
  }),

  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "L'email est obligatoire",
    }),

  password: joi
    .string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_])[A-Za-z\\d\\W_]{8,30}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Mot de passe d'au moins 8 caractères contenant au moins une minuscule, une majuscule, un chiffre et un caractère spécial",
      "string.empty": "Le mot de passe est obligatoire",
      "string.min": "Le mot de passe doit contenir au moins 8 caractères",
    }),

  phoneNumber: joi.string().min(10).required().messages({
    "string.empty": "Le numéro de téléphone est obligatoire",
    "string.min": "Le numéro de téléphone doit contenir au moins 10 caractères",
  }),

  address: joi.string().min(5).max(200).required().messages({
    "string.empty": "L'adresse est obligatoire",
    "string.min": "L'adresse doit contenir au moins 5 caractères",
    "string.max": "L'adresse ne peut pas dépasser 200 caractères",
  }),

  description: joi.string().min(20).max(500).required().messages({
    "string.empty": "La description est obligatoire",
    "string.min": "La description doit contenir au moins 20 caractères",
    "string.max": "La description ne peut pas dépasser 500 caractères",
  }),

  profileImage: joi.string().required().messages({
    "string.empty": "La photo de profil est obligatoire",
  }),

  cipImage: joi.string().required().messages({
    "string.empty": "L'image CIP est obligatoire",
  }),
});
