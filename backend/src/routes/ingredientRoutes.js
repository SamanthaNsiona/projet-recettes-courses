const { Router } = require("express");
const {
  addIngredient,
  getIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient
} = require("../controllers/ingredientController");
const { protect } = require("../middleware/authMiddleware");

const router = Router({ mergeParams: true });

router.post("/", protect, addIngredient);           // ➕ Ajouter un ingrédient
router.get("/", protect, getIngredients);           // 📋 Voir tous les ingrédients
router.get("/:ingredientId", protect, getIngredientById); // 🔍 Voir un ingrédient
router.put("/:ingredientId", protect, updateIngredient);  // ✏️ Modifier
router.delete("/:ingredientId", protect, deleteIngredient); // ❌ Supprimer

module.exports = router;
