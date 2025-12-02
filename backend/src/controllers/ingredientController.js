const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 📌 1. Ajouter un ingrédient à une recette
const addIngredient = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { name, unit, quantity } = req.body;

    // Vérifier que la recette existe et appartient à l'utilisateur
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(recipeId) }
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }

    if (recipe.userId !== req.user.id) {
      return res.status(403).json({ message: "Vous n'avez pas accès à cette recette" });
    }

    // Validation
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Le nom de l'ingrédient est requis" });
    }

    const ingredient = await prisma.ingredient.create({
      data: {
        name: name.trim(),
        unit: unit || null,
        quantity: quantity ? parseFloat(quantity) : null,
        recipeId: parseInt(recipeId)
      }
    });

    res.status(201).json({ message: "Ingrédient ajouté", ingredient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 2. Récupérer tous les ingrédients d'une recette
const getIngredients = async (req, res) => {
  try {
    const { recipeId } = req.params;

    // Vérifier que la recette existe et appartient à l'utilisateur
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(recipeId) }
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recette non trouvée" });
    }

    if (recipe.userId !== req.user.id) {
      return res.status(403).json({ message: "Vous n'avez pas accès à cette recette" });
    }

    const ingredients = await prisma.ingredient.findMany({
      where: { recipeId: parseInt(recipeId) }
    });

    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 3. Récupérer UN ingrédient
const getIngredientById = async (req, res) => {
  try {
    const { recipeId, ingredientId } = req.params;

    const ingredient = await prisma.ingredient.findUnique({
      where: { id: parseInt(ingredientId) },
      include: { recipe: true }
    });

    if (!ingredient) {
      return res.status(404).json({ message: "Ingrédient non trouvé" });
    }

    // Vérifier que l'utilisateur possède la recette
    if (ingredient.recipe.userId !== req.user.id) {
      return res.status(403).json({ message: "Vous n'avez pas accès à cet ingrédient" });
    }

    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 4. Modifier un ingrédient
const updateIngredient = async (req, res) => {
  try {
    const { recipeId, ingredientId } = req.params;
    const { name, unit, quantity } = req.body;

    const ingredient = await prisma.ingredient.findUnique({
      where: { id: parseInt(ingredientId) },
      include: { recipe: true }
    });

    if (!ingredient) {
      return res.status(404).json({ message: "Ingrédient non trouvé" });
    }

    // Vérifier que l'utilisateur possède la recette
    if (ingredient.recipe.userId !== req.user.id) {
      return res.status(403).json({ message: "Vous n'avez pas accès à cet ingrédient" });
    }

    // Validation
    if (name && name.trim() === "") {
      return res.status(400).json({ message: "Le nom de l'ingrédient ne peut pas être vide" });
    }

    const updatedIngredient = await prisma.ingredient.update({
      where: { id: parseInt(ingredientId) },
      data: {
        name: name ? name.trim() : ingredient.name,
        unit: unit !== undefined ? unit : ingredient.unit,
        quantity: quantity !== undefined ? (quantity ? parseFloat(quantity) : null) : ingredient.quantity
      }
    });

    res.json({ message: "Ingrédient mis à jour", ingredient: updatedIngredient });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 📌 5. Supprimer un ingrédient
const deleteIngredient = async (req, res) => {
  try {
    const { recipeId, ingredientId } = req.params;

    const ingredient = await prisma.ingredient.findUnique({
      where: { id: parseInt(ingredientId) },
      include: { recipe: true }
    });

    if (!ingredient) {
      return res.status(404).json({ message: "Ingrédient non trouvé" });
    }

    // Vérifier que l'utilisateur possède la recette
    if (ingredient.recipe.userId !== req.user.id) {
      return res.status(403).json({ message: "Vous n'avez pas accès à cet ingrédient" });
    }

    await prisma.ingredient.delete({
      where: { id: parseInt(ingredientId) }
    });

    res.json({ message: "Ingrédient supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addIngredient,
  getIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient
};
