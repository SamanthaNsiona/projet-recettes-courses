const { Router } = require("express");
const {
  createRecipe,
  getPublicRecipes,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  deleteIngredient
} = require("../controllers/recipeController");
const ingredientRoutes = require("./ingredientRoutes");
const { protect } = require("../middleware/authMiddleware");

const router = Router();

router.get("/public", protect, getPublicRecipes); //  Voir toutes les recettes publiques (DOIT ÊTRE AVANT /:id)
router.post("/", protect, createRecipe);         //  Créer une recette
router.get("/", protect, getRecipes);            //  Voir mes recettes
router.get("/:id", protect, getRecipeById);      //  Voir une recette
router.put("/:id", protect, updateRecipe);       //  Modifier
router.delete("/:id", protect, deleteRecipe);    //  Supprimer
router.delete("/ingredient/:id", protect, deleteIngredient); //  Supprimer un ingrédient

// Routes des ingrédients imbriquées
router.use("/:recipeId/ingredients", ingredientRoutes);

module.exports = router;
