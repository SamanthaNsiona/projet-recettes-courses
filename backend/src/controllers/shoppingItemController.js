const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getItems = async (req, res) => {
  try {
    const listId = parseInt(req.params.listId);

    const items = await prisma.shoppingItem.findMany({
      where: { listId }
    });

    res.json(items);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const addItem = async (req, res) => {
  try {
    const listId = parseInt(req.params.listId);
    const { name, quantity, unit } = req.body;

    const item = await prisma.shoppingItem.create({
      data: { listId, name, quantity, unit }
    });

    res.status(201).json(item);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const updateItem = async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const { name, quantity, unit } = req.body;

    const item = await prisma.shoppingItem.update({
      where: { id: itemId },
      data: { name, quantity, unit }
    });

    res.json(item);
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);

    await prisma.shoppingItem.delete({
      where: { id: itemId }
    });

    res.json({ message: "Item supprimé" });
  } catch {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

module.exports = { getItems, addItem, updateItem, deleteItem };
