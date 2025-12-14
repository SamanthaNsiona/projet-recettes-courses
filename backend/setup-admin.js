require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createOrUpdateAdmin() {
  try {
    const email = 'myrecipesdev@gmail.com';
    const password = 'Admin123!'; // Mot de passe par défaut
    const name = 'Admin MyRecipes';

    console.log('🔍 Recherche du compte:', email);

    // Vérifier si le compte existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('✅ Compte trouvé, mise à jour du rôle en ADMIN...');
      
      const updatedUser = await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' }
      });

      console.log('\n✅ Compte mis à jour avec succès!');
      console.log('📧 Email:', updatedUser.email);
      console.log('👤 Nom:', updatedUser.name);
      console.log('🔑 Rôle:', updatedUser.role);
      console.log('\n⚠️  Utilisez le mot de passe actuel du compte pour vous connecter');
    } else {
      console.log('❌ Compte non trouvé, création d\'un nouveau compte admin...');
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'ADMIN'
        }
      });

      console.log('\n✅ Compte admin créé avec succès!');
      console.log('📧 Email:', newUser.email);
      console.log('👤 Nom:', newUser.name);
      console.log('🔑 Mot de passe:', password);
      console.log('🛡️  Rôle:', newUser.role);
      console.log('\n⚠️  IMPORTANT: Changez le mot de passe après la première connexion!');
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

createOrUpdateAdmin();
