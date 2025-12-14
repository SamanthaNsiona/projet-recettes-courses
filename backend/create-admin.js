const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = "myrecipes@gmail.com";
    const password = "admin123"; // Changez ce mot de passe !
    const name = "Administrateur MyRecipes";

    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.user.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      console.log("❌ Un admin avec cet email existe déjà");
      return;
    }

    // Créer l'admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "ADMIN"
      }
    });

    console.log("✅ Administrateur créé avec succès !");
    console.log("📧 Email:", email);
    console.log("🔒 Mot de passe:", password);
    console.log("\n⚠️  IMPORTANT: Changez ce mot de passe après la première connexion !");
  } catch (error) {
    console.error("❌ Erreur:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
