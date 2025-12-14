require('dotenv').config();
const prisma = require('./src/utils/prismaClient');

async function checkAdmin() {
  try {
    console.log('🔍 Recherche des comptes ADMIN...\n');
    
    const admins = await prisma.user.findMany({
      where: {
        role: 'ADMIN'
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    if (admins.length === 0) {
      console.log('❌ Aucun compte ADMIN trouvé');
    } else {
      console.log(`✅ ${admins.length} compte(s) ADMIN trouvé(s):\n`);
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.name}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   ID: ${admin.id}`);
        console.log(`   Role: ${admin.role}\n`);
      });
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkAdmin();
