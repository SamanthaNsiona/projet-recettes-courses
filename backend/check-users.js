const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany();
    console.log('\n📋 Total utilisateurs:', users.length);
    
    if (users.length === 0) {
      console.log('❌ Aucun utilisateur dans la base de données\n');
    } else {
      console.log('\n👥 Liste des utilisateurs:');
      users.forEach((u, i) => {
        console.log(`${i + 1}. Email: ${u.email} | Name: ${u.name}`);
      });
      
      const searchEmail = 'myrecipesdev@gmail.com';
      const found = users.find(u => u.email.toLowerCase() === searchEmail.toLowerCase());
      console.log(`\n🔍 Recherche de "${searchEmail}": ${found ? '✅ TROUVÉ' : '❌ NON TROUVÉ'}`);
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
