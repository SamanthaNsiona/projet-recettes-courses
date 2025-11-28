// src/controllers/shoppingListController.js
const prisma = require("../utils/prismaClient"); // si tu utilises Prisma

// Récupérer toutes les listes de courses d'un utilisateur
const getShoppingLists = async (req, res) => {
  try {
    const lists = await prisma.shoppingList.findMany({
      where: { userId: req.user.id }
    });
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Créer une nouvelle liste de courses
const createShoppingList = async (req, res) => {
  const { title } = req.body;
  try {
    const newList = await prisma.shoppingList.create({
      data: {
        title,
        userId: req.user.id
      }
    });
    res.status(201).json(newList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mettre à jour une liste
const updateShoppingList = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const updatedList = await prisma.shoppingList.update({
      where: { id: Number(id) },
      data: { title }
    });
    res.json(updatedList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Supprimer une liste
const deleteShoppingList = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.shoppingList.delete({ where: { id: Number(id) } });
    res.json({ message: "Liste supprimée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getShoppingLists, createShoppingList, updateShoppingList, deleteShoppingList };
