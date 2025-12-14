const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.nddqnlzxqmwzdvkuwfzg:shZmEtTRVQK8ut9N@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
    }
  }
});

async function createAdmin() {
  try {
    const email = 'myrecipesdev@gmail.com';
    const password = 'Admin123!';
    const name = 'Admin';

    console.log('🔍 Vérification si le compte existe...');

    // Supprimer le compte s'il existe déjà
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      console.log('⚠️  Compte existant trouvé, suppression...');
      await prisma.user.delete({
        where: { email }
      });
    }

    console.log('🔐 Création du nouveau compte admin...');
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'ADMIN'
      }
    });

    console.log('\n✅ Compte admin créé avec succès!');
    console.log('================================');
    console.log('📧 Email:', admin.email);
    console.log('👤 Nom:', admin.name);
    console.log('🔑 Mot de passe:', password);
    console.log('🛡️  Rôle:', admin.role);
    console.log('================================\n');

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

createAdmin();
