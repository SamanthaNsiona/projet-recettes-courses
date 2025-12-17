const express = require("express");
const { getLists, createList, updateList, deleteList } = require("../controllers/shoppingListController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getLists);
router.post("/", protect, createList);
router.put("/:id", protect, updateList);
router.delete("/:id", protect, deleteList);

module.exports = router;

