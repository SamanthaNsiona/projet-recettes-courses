const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRecipes() {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });
    
    console.log('\n📋 Total recettes:', recipes.length);
    
    if (recipes.length === 0) {
      console.log('❌ Aucune recette dans la base de données\n');
    } else {
      console.log('\n🍽️ Liste des recettes:');
      recipes.forEach((r, i) => {
        console.log(`${i + 1}. "${r.title}" - ${r.isPublic ? '🌍 Public' : '🔒 Privé'} - Par: ${r.user.name}`);
      });
      console.log('');
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkRecipes();
