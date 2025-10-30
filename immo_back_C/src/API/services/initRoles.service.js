import Role from "../models/role.model.js";

const DEFAULT_ROLES = [
  {
    name: "customer",
    description:
      "Utilisateur standard qui s'inscrit directement sur la plateforme",
  },
  {
    name: "agent",
    description:
      "Utilisateur dont la candidature a été validée par l'administrateur",
  },
  {
    name: "admin",
    description:
      "Utilisateur avec tous les droits et privilèges d'administration",
  },
];

const initializeRoles = async () => {
  try {
    console.log("Vérification des rôles dans la base de données...");

    for (const roleItem of DEFAULT_ROLES) {
      const existingRole = await Role.findOne({ name: roleItem.name });

      if (existingRole) {
        console.log(`   ✓ Le rôle "${roleItem.name}" existe déjà`);
      } else {
        const newRole = new Role({
          name: roleItem.name,
        });

        await newRole.save();

        console.log(`Rôle "${roleItem.name}" créé avec succès`);
      }
    }

    console.log("Initialisation des rôles terminée avec succès\n");
  } catch (error) {
    console.error("Erreur lors de l'initialisation des rôles :", error.message);

    throw new Error(`Échec de l'initialisation des rôles : ${error.message}`);
  }
};

export default initializeRoles;
