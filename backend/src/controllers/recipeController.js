const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 📌 0. Créer une recette
const createRecipe = async (req, res) => {
  try {
<<<<<<< HEAD
    const { title, description, isPublic } = req.body;

    // Validation
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Le titre de la recette est requis" });
    }

    const recipe = await prisma.recipe.create({
      data: {
        title: title.trim(),
        description: description ? description.trim() : null,
        isPublic: isPublic || false,
        userId: req.user.id // 🔒 Lien avec l'utilisateur connecté
=======
    const { title, description, isPublic, ingredients } = req.body;
    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        isPublic: isPublic !== undefined ? isPublic : true,
        userId: req.user.id,
        ingredients: {
          create: ingredients || []
        }
>>>>>>> main
      },
      include: { ingredients: true }
    });
    res.status(201).json({ message: "Recette créée", recipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
        ingredients: true
      },
      orderBy: { id: 'desc' }
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 2. Récupérer les recettes de l'utilisateur connecté (pour la page "Mes Recettes")
const getRecipes = async (req, res) => {
  try {
    const recipes = await prisma.recipe.findMany({
      where: { userId: req.user.id },
<<<<<<< HEAD
      include: { ingredients: true }
=======
      include: {
        user: {
          select: { name: true, email: true }
        },
        ingredients: true
      },
      orderBy: { id: 'desc' }
>>>>>>> main
    });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 2. Récupérer UNE recette
const getRecipeById = async (req, res) => {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { ingredients: true }
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
<<<<<<< HEAD
    const { title, description, isPublic } = req.body;
    
    // Vérifier que la recette existe et appartient à l'utilisateur
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(req.params.id) }
=======
    const { title, description, isPublic, ingredients } = req.body;
    const recipeId = parseInt(req.params.id);

    // Supprimer les anciens ingrédients
    await prisma.ingredient.deleteMany({
      where: { recipeId }
    });

    // Mettre à jour la recette avec les nouveaux ingrédients
    const recipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: {
        title,
        description,
        isPublic,
        ingredients: {
          create: ingredients || []
        }
      },
      include: { ingredients: true }
>>>>>>> main
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }

    if (recipe.userId !== req.user.id) {
      return res.status(403).json({ message: "Vous n'avez pas accès à cette recette" });
    }

    // Validation
    if (title && title.trim() === "") {
      return res.status(400).json({ message: "Le titre de la recette ne peut pas être vide" });
    }

    const updatedRecipe = await prisma.recipe.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title: title ? title.trim() : recipe.title,
        description: description !== undefined ? (description ? description.trim() : null) : recipe.description,
        isPublic: isPublic !== undefined ? isPublic : recipe.isPublic
      },
      include: { ingredients: true }
    });
    res.json({ message: "Recette mise à jour", recipe: updatedRecipe });
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

    if (!recipe) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }

    if (recipe.userId !== req.user.id) {
      return res.status(403).json({ message: "Vous n'avez pas accès à cette recette" });
    }

    // Supprimer d'abord les ingrédients
    await prisma.ingredient.deleteMany({
      where: { recipeId: recipe.id }
    });

    // Puis supprimer la recette
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

module.exports = { createRecipe, getPublicRecipes, getRecipes, getRecipeById, updateRecipe, deleteRecipe, deleteIngredient };

