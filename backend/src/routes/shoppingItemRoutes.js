const express = require("express");
const {
  getItems,
  addItem,
  updateItem,
  deleteItem,
} = require("../controllers/shoppingItemController");

const router = express.Router();

router.get("/:listId", getItems);
router.post("/:listId", addItem);
router.put("/:itemId", updateItem);
router.delete("/:itemId", deleteItem);

module.exports = router;
