const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function changePassword() {
  try {
    const email = await question("📧 Email de l'admin: ");
    const newPassword = await question("🔐 Nouveau mot de passe: ");
    const confirmPassword = await question("🔐 Confirmer le mot de passe: ");

    if (newPassword !== confirmPassword) {
      console.log("❌ Les mots de passe ne correspondent pas !");
      rl.close();
      return;
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.log("❌ Utilisateur non trouvé !");
      rl.close();
      return;
    }

    // Hasher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    console.log("✅ Mot de passe changé avec succès !");
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  } finally {
    await prisma.$disconnect();
    rl.close();
  }
}

changePassword();
