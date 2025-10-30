import dotenv from "dotenv";
dotenv.config();
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "./src/API/models/user.model.js";
import Role from "./src/API/models/role.model.js";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

const createAdmin = async () => {
  try {
    console.log("\n🔐 CRÉATION D'UN COMPTE ADMINISTRATEUR");
    console.log("=====================================\n");

    // Connexion à la base de données
    const DB_URI = process.env.DB_URI || "mongodb://localhost:27017";
    const DB_NAME = process.env.DB_NAME || "immo_platform";

    console.log(`📡 Connexion à MongoDB : ${DB_URI}/${DB_NAME}...`);
    await mongoose.connect(`${DB_URI}/${DB_NAME}`);
    console.log("✅ Connecté à la base de données\n");

    // Vérifier que le rôle admin existe
    const adminRole = await Role.findOne({ name: "admin" });
    if (!adminRole) {
      console.error(
        "❌ ERREUR : Le rôle 'admin' n'existe pas dans la base de données."
      );
      console.log(
        "💡 Assurez-vous que les rôles ont été initialisés (démarrez le serveur une fois)."
      );
      process.exit(1);
    }
    console.log("✅ Rôle admin trouvé\n");

    // Demander les informations de l'admin
    const firstName = await question("👤 Prénom de l'admin : ");
    const lastName = await question("👤 Nom de l'admin : ");
    const email = await question("📧 Email de l'admin : ");
    const password = await question("🔑 Mot de passe (min 8 caractères) : ");

    // Validation basique
    if (!firstName || !lastName || !email || !password) {
      console.error("\n❌ ERREUR : Tous les champs sont obligatoires.");
      process.exit(1);
    }

    if (password.length < 8) {
      console.error(
        "\n❌ ERREUR : Le mot de passe doit contenir au moins 8 caractères."
      );
      process.exit(1);
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error(
        `\n❌ ERREUR : Un utilisateur avec l'email "${email}" existe déjà.`
      );
      process.exit(1);
    }

    // Hasher le mot de passe
    console.log("\n🔒 Hashage du mot de passe...");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'admin
    console.log("👑 Création du compte administrateur...");
    const admin = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: adminRole._id,
      isActive: true,
    });

    console.log("\n✅ ✅ ✅ COMPTE ADMIN CRÉÉ AVEC SUCCÈS ! ✅ ✅ ✅\n");
    console.log("📋 Détails du compte :");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`   ID       : ${admin._id}`);
    console.log(`   Prénom   : ${admin.firstName}`);
    console.log(`   Nom      : ${admin.lastName}`);
    console.log(`   Email    : ${admin.email}`);
    console.log(`   Rôle     : admin`);
    console.log(`   Actif    : ${admin.isActive ? "Oui" : "Non"}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    console.log(
      "🎉 Vous pouvez maintenant vous connecter avec ces identifiants !\n"
    );
    console.log("📝 Test de connexion dans Postman :");
    console.log("   POST http://localhost:3000/api/v1/auth/login");
    console.log("   Body (JSON) :");
    console.log("   {");
    console.log(`     "email": "${email}",`);
    console.log(`     "password": "${password}"`);
    console.log("   }\n");
  } catch (error) {
    console.error("\n❌ ERREUR lors de la création de l'admin :");
    console.error(error.message);
    process.exit(1);
  } finally {
    rl.close();
    await mongoose.connection.close();
    console.log("🔌 Déconnecté de la base de données");
    process.exit(0);
  }
};

// Gestion de l'interruption (Ctrl+C)
process.on("SIGINT", async () => {
  console.log("\n\n⚠️  Création annulée par l'utilisateur");
  rl.close();
  await mongoose.connection.close();
  process.exit(0);
});

// Exécuter le script
createAdmin();
