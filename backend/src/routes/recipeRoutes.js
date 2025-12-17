const { Router } = require("express");
const {
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
} = require("../controllers/recipeController");
const { protect } = require("../middleware/authMiddleware");

const router = Router();

router.get("/public", protect, getPublicRecipes); //  Voir toutes les recettes publiques (DOIT ÊTRE AVANT /:id)
router.get("/favorites", protect, getFavorites);  //  Voir mes favoris (DOIT ÊTRE AVANT /:id)
router.post("/", protect, createRecipe);         //  Créer une recette
router.get("/", protect, getRecipes);            //  Voir mes recettes
router.get("/:id", protect, getRecipeById);      //  Voir une recette
router.put("/:id", protect, updateRecipe);       //  Modifier
router.delete("/:id", protect, deleteRecipe);    //  Supprimer
router.delete("/ingredient/:id", protect, deleteIngredient); //  Supprimer un ingrédient
router.post("/:id/favorite", protect, addFavorite);    //  Ajouter aux favoris
router.delete("/:id/favorite", protect, removeFavorite); //  Retirer des favoris

module.exports = router;

