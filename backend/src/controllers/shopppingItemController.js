import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getItems = async (req, res) => {
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

export const addItem = async (req, res) => {
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

export const updateItem = async (req, res) => {
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

export const deleteItem = async (req, res) => {
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
