const { Router } = require("express");
const {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe
} = require("../controllers/recipeController");
const ingredientRoutes = require("./ingredientRoutes");
const { protect } = require("../middleware/authMiddleware");

const router = Router();

router.post("/", protect, createRecipe);      // 🟢 Créer une recette
router.get("/", protect, getRecipes);         // 🔍 Voir mes recettes
router.get("/:id", protect, getRecipeById);   // 🧪 Voir une recette
router.put("/:id", protect, updateRecipe);    // ✏️ Modifier
router.delete("/:id", protect, deleteRecipe); // ❌ Supprimer

// Routes des ingrédients imbriquées
router.use("/:recipeId/ingredients", ingredientRoutes);

module.exports = router;
