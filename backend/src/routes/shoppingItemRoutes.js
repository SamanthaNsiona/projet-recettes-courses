import express from "express";
import {
  getItems,
  addItem,
  updateItem,
  deleteItem,
} from "../controllers/shoppingItemController.js";

const router = express.Router();

router.get("/:listId", getItems);
router.post("/:listId", addItem);
router.put("/:itemId", updateItem);
router.delete("/:itemId", deleteItem);

export default router;
