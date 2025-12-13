const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addIngredients() {
  try {
    // Récupérer toutes les recettes
    const recipes = await prisma.recipe.findMany({
      include: { ingredients: true }
    });

    console.log('\nAjout des ingrédients aux recettes...\n');

    for (const recipe of recipes) {
      if (recipe.ingredients.length === 0) {
        console.log(`Recette: "${recipe.title}" - Pas d'ingrédients`);
        
        // Ajouter des ingrédients selon la recette
        let ingredientsToAdd = [];
        
        if (recipe.title.toLowerCase().includes('salade')) {
          ingredientsToAdd = [
            { name: 'Laitue', quantity: 1, unit: 'pièce' },
            { name: 'Tomates', quantity: 2, unit: 'pièces' },
            { name: 'Concombre', quantity: 0.5, unit: 'pièce' },
            { name: 'Huile d\'olive', quantity: 2, unit: 'cuillères à soupe' },
            { name: 'Vinaigre balsamique', quantity: 1, unit: 'cuillère à soupe' }
          ];
        } else if (recipe.title.toLowerCase().includes('taco')) {
          ingredientsToAdd = [
            { name: 'Tortillas', quantity: 4, unit: 'pièces' },
            { name: 'Viande hachée', quantity: 300, unit: 'g' },
            { name: 'Tomates', quantity: 2, unit: 'pièces' },
            { name: 'Laitue', quantity: 100, unit: 'g' },
            { name: 'Fromage râpé', quantity: 100, unit: 'g' },
            { name: 'Crème fraîche', quantity: 3, unit: 'cuillères à soupe' }
          ];
        } else if (recipe.title.toLowerCase().includes('pâtes') || recipe.title.toLowerCase().includes('carbonara')) {
          ingredientsToAdd = [
            { name: 'Pâtes', quantity: 400, unit: 'g' },
            { name: 'Lardons', quantity: 200, unit: 'g' },
            { name: 'Œufs', quantity: 4, unit: 'pièces' },
            { name: 'Parmesan râpé', quantity: 100, unit: 'g' },
            { name: 'Poivre noir', quantity: 1, unit: 'pincée' }
          ];
        }

        if (ingredientsToAdd.length > 0) {
          for (const ing of ingredientsToAdd) {
            await prisma.ingredient.create({
              data: {
                name: ing.name,
                quantity: ing.quantity,
                unit: ing.unit,
                recipeId: recipe.id
              }
            });
          }
          console.log(` ${ingredientsToAdd.length} ingrédients ajoutés`);
        }
      } else {
        console.log(`Recette: "${recipe.title}" - ${recipe.ingredients.length} ingrédients déjà présents`);
      }
    }

    console.log('\nTerminé!\n');
    
    // Afficher le résultat
    const recipesWithIngredients = await prisma.recipe.findMany({
      include: { 
        ingredients: true,
        user: { select: { name: true } }
      }
    });

    console.log('Résultat final:\n');
    for (const recipe of recipesWithIngredients) {
      console.log(`\n${recipe.title} (par ${recipe.user.name})`);
      if (recipe.ingredients.length > 0) {
        recipe.ingredients.forEach(ing => {
          console.log(`   - ${ing.quantity} ${ing.unit} ${ing.name}`);
        });
      } else {
        console.log('Pas d\'ingrédients');
      }
    }

  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addIngredients();
