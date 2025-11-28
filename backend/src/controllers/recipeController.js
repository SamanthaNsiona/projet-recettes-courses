const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 📌 0. Créer une recette
const createRecipe = async (req, res) => {
  try {
    const { title, description, isPublic } = req.body;
    const recipe = await prisma.recipe.create({
      data: {
        title,
        description,
        isPublic: isPublic || false,
        userId: req.user.id // 🔒 Lien avec l'utilisateur connecté
      },
    });
    res.status(201).json({ message: "Recette créée", recipe });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 1. Récupérer les recettes de l'utilisateur connecté
const getRecipes = async (req, res) => {
  try {
    const recipes = await prisma.recipe.findMany({
      where: { userId: req.user.id }
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
    const { title, description, isPublic } = req.body;
    const recipe = await prisma.recipe.update({
      where: { id: parseInt(req.params.id) },
      data: { title, description, isPublic }
    });
    res.json({ message: "Recette mise à jour", recipe });
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

module.exports = { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe };

