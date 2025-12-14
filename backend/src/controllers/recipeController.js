const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 📌 0. Créer une recette
const createRecipe = async (req, res) => {
  try {
    const { title, description, isPublic, ingredients } = req.body;
    console.log('🚀 Body reçu:', JSON.stringify(req.body, null, 2));
    console.log('🚀 User:', req.user);
    console.log('🚀 Création de recette:', { title, description, isPublic, ingredients });
    
    // Préparer les données des ingrédients
    const ingredientsData = ingredients && ingredients.length > 0 
      ? ingredients.map(ing => ({
          name: ing.name,
          quantity: ing.quantity ? parseFloat(ing.quantity) : null,
          unit: ing.unit || null
        }))
      : [];

    console.log('🧹 Ingrédients formatés:', JSON.stringify(ingredientsData, null, 2));
    
    const recipe = await prisma.recipe.create({
      data: {
        title,
        description: description || '',
        ingredients: '', // Champ String requis par le schéma
        steps: '', // Champ String requis par le schéma
        isPublic: isPublic !== undefined ? isPublic : false,
        userId: req.user.id,
        ingredientsList: {
          create: ingredientsData
        }
      },
      include: { 
        ingredientsList: true,
        user: {
          select: { name: true, email: true }
        }
      }
    });
    
    console.log('✅ Recette créée:', recipe);
    
    // Formater la réponse pour le frontend
    const formattedRecipe = {
      ...recipe,
      ingredients: recipe.ingredientsList
    };
    
    res.status(201).json({ message: "Recette créée", recipe: formattedRecipe });
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error);
    console.error('📋 Stack trace:', error.stack);
    res.status(500).json({ error: error.message, details: error.stack });
  }
};

// 📌 1. Récupérer TOUTES les recettes publiques (pour la page "Recettes")
const getPublicRecipes = async (req, res) => {
  try {
    const recipes = await prisma.recipe.findMany({
      where: { isPublic: true },
      include: {
        user: {
          select: { name: true, email: true }
        },
        ingredientsList: true
      },
      orderBy: { id: 'desc' }
    });
    // Renommer ingredientsList en ingredients pour le frontend
    const formattedRecipes = recipes.map(recipe => ({
      ...recipe,
      ingredients: recipe.ingredientsList
    }));
    res.json(formattedRecipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 2. Récupérer les recettes de l'utilisateur connecté (pour la page "Mes Recettes")
const getRecipes = async (req, res) => {
  try {
    const recipes = await prisma.recipe.findMany({
      where: { userId: req.user.id },
      include: {
        user: {
          select: { name: true, email: true }
        },
        ingredientsList: true
      },
      orderBy: { id: 'desc' }
    });
    // Renommer ingredientsList en ingredients pour le frontend
    const formattedRecipes = recipes.map(recipe => ({
      ...recipe,
      ingredients: recipe.ingredientsList
    }));
    res.json(formattedRecipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 2. Récupérer UNE recette
const getRecipeById = async (req, res) => {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!recipe || recipe.userId !== req.user.id)
      return res.status(404).json({ message: "Recette introuvable" });

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 3. Modifier une recette
const updateRecipe = async (req, res) => {
  try {
    const { title, description, isPublic, ingredients } = req.body;
    const recipeId = parseInt(req.params.id);

    console.log('🔄 Mise à jour recette:', { recipeId, title, ingredients });

    // Supprimer les anciens ingrédients
    await prisma.ingredient.deleteMany({
      where: { recipeId }
    });

    // Préparer les données des ingrédients
    const ingredientsData = ingredients && ingredients.length > 0 
      ? ingredients.map(ing => ({
          name: ing.name,
          quantity: ing.quantity ? parseFloat(ing.quantity) : null,
          unit: ing.unit || null
        }))
      : [];

    // Mettre à jour la recette avec les nouveaux ingrédients
    const recipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        title,
        description: description || '',
        isPublic,
        ingredientsList: {
          create: ingredientsData
        }
      },
      include: { 
        ingredientsList: true,
        user: {
          select: { name: true, email: true }
        }
      }
    });
    
    console.log('✅ Recette mise à jour:', recipe);
    
    // Renommer ingredientsList en ingredients pour le frontend
    const formattedRecipe = {
      ...recipe,
      ingredients: recipe.ingredientsList
    };
    
    res.json({ message: "Recette mise à jour", recipe: formattedRecipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 4. Supprimer une recette
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!recipe || recipe.userId !== req.user.id) {
      return res.status(404).json({ message: "Recette introuvable ❌" });
    }

    await prisma.recipe.delete({ where: { id: recipe.id } });

    res.json({ message: "Recette supprimée 🔥" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 5. Supprimer un ingrédient
const deleteIngredient = async (req, res) => {
  try {
    const ingredientId = parseInt(req.params.id);
    
    // Vérifier que l'ingrédient appartient à une recette de l'utilisateur
    const ingredient = await prisma.ingredient.findUnique({
      where: { id: ingredientId },
      include: { recipe: true }
    });

    if (!ingredient || ingredient.recipe.userId !== req.user.id) {
      return res.status(404).json({ message: "Ingrédient introuvable" });
    }

    await prisma.ingredient.delete({ where: { id: ingredientId } });
    res.json({ message: "Ingrédient supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 6. Ajouter une recette aux favoris
const addFavorite = async (req, res) => {
  try {
    const recipeId = parseInt(req.params.id);
    const userId = req.user.id;

    const favorite = await prisma.favorite.create({
      data: { userId, recipeId }
    });

    res.status(201).json({ message: "Ajouté aux favoris", favorite });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ message: "Déjà dans les favoris" });
    }
    res.status(500).json({ error: error.message });
  }
};

// 📌 7. Retirer une recette des favoris
const removeFavorite = async (req, res) => {
  try {
    const recipeId = parseInt(req.params.id);
    const userId = req.user.id;

    await prisma.favorite.deleteMany({
      where: { userId, recipeId }
    });

    res.json({ message: "Retiré des favoris" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 8. Récupérer les favoris de l'utilisateur
const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: {
        recipe: {
          include: {
            user: { select: { name: true, email: true } },
            ingredientsList: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const formattedFavorites = favorites.map(fav => ({
      ...fav.recipe,
      ingredients: fav.recipe.ingredientsList,
      isFavorite: true
    }));

    res.json(formattedFavorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { 
  createRecipe, 
  getPublicRecipes, 
  getRecipes, 
  getRecipeById, 
  updateRecipe, 
  deleteRecipe, 
  deleteIngredient,
  addFavorite,
  removeFavorite,
  getFavorites
};

