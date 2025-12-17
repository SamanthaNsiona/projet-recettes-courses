const express = require("express");
const {
  getItems,
  addItem,
  updateItem,
  deleteItem,
  addRecipeToList
} = require("../controllers/shoppingItemController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:listId", protect, getItems);
router.post("/:listId", protect, addItem);
router.post("/:listId/recipe", protect, addRecipeToList);
router.put("/:itemId", protect, updateItem);
router.delete("/:itemId", protect, deleteItem);

module.exports = router;

