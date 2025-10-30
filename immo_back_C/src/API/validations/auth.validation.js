import joi from "joi";

export const registerValidation = joi.object({
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

  whatsappNumber: joi.string().min(8).optional().allow(""),
});

export const loginValidation = joi.object({
  email: joi
    .string()
    .email({ minDomainSegments: 2, tlds: { allow: false } })
    .required()
    .messages({
      "string.empty": "L'email est obligatoire",
      "string.email": "L'email doit être valide",
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
      "string.empty": "Le mot de passe est obligatoire",
    }),
});
