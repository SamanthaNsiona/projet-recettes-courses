const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getLists = async (req, res) => {
  try {
    const lists = await prisma.shoppingList.findMany({
      include: { items: true }
    });
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createList = async (req, res) => {
  try {
    const { title, userId } = req.body;

    const list = await prisma.shoppingList.create({
      data: { title, userId }
    });

    res.status(201).json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateList = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title } = req.body;

    const list = await prisma.shoppingList.update({
      where: { id },
      data: { title }
    });

    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteList = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    await prisma.shoppingList.delete({ where: { id } });

    res.json({ message: "Liste supprimée" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getLists, createList, updateList, deleteList };
