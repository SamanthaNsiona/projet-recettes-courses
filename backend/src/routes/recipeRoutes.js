import { Router } from "express";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe
} from "../controllers/recipeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, createRecipe);      // 🟢 Créer une recette
router.get("/", protect, getRecipes);         // 🔍 Voir mes recettes
router.get("/:id", protect, getRecipeById);   // 🧪 Voir une recette
router.put("/:id", protect, updateRecipe);    // ✏️ Modifier
router.delete("/:id", protect, deleteRecipe); // ❌ Supprimer

export default router;
