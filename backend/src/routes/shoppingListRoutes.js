const express = require("express");
const { getLists, createList, updateList, deleteList } = require("../controllers/shoppingListController");

const router = express.Router();

router.get("/", getLists);
router.post("/", createList);
router.put("/:id", updateList);
router.delete("/:id", deleteList);

module.exports = router;
