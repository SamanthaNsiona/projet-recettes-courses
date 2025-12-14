const { Router } = require("express");
const {
  getAllRecipes,
  getAllUsers,
  getAllLists,
  deleteRecipe,
  deleteUser,
  updateUserRole,
  getStats
} = require("../controllers/adminController");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = Router();

// Toutes les routes admin nécessitent l'authentification ET le rôle ADMIN
router.get("/stats", protect, isAdmin, getStats);           // Statistiques globales
router.get("/recipes", protect, isAdmin, getAllRecipes);     // Toutes les recettes
router.get("/users", protect, isAdmin, getAllUsers);         // Tous les utilisateurs
router.get("/lists", protect, isAdmin, getAllLists);         // Toutes les listes
router.delete("/recipes/:id", protect, isAdmin, deleteRecipe); // Supprimer une recette
router.delete("/users/:id", protect, isAdmin, deleteUser);   // Supprimer un utilisateur
router.put("/users/:id/role", protect, isAdmin, updateUserRole); // Changer le rôle

module.exports = router;
