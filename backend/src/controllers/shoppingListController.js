const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getLists = async (req, res) => {
  try {
    const lists = await prisma.shoppingList.findMany({
      where: { userId: req.user.id },
      include: { items: true }
    });
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createList = async (req, res) => {
  try {
    const { title } = req.body;
    console.log('📝 Création liste:', { title, userId: req.user.id });

    const list = await prisma.shoppingList.create({
      data: { 
        title, 
        userId: req.user.id 
      }
    });

    console.log('✅ Liste créée:', list);
    res.status(201).json(list);
  } catch (error) {
    console.error('❌ Erreur création liste:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateList = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title } = req.body;

    // Vérifier que la liste appartient à l'utilisateur
    const existingList = await prisma.shoppingList.findUnique({
      where: { id }
    });

    if (!existingList || existingList.userId !== req.user.id) {
      return res.status(404).json({ message: "Liste introuvable" });
    }

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

    // Vérifier que la liste appartient à l'utilisateur
    const existingList = await prisma.shoppingList.findUnique({
      where: { id }
    });

    if (!existingList || existingList.userId !== req.user.id) {
      return res.status(404).json({ message: "Liste introuvable" });
    }

    await prisma.shoppingList.delete({ where: { id } });

    res.json({ message: "Liste supprimée" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getLists, createList, updateList, deleteList };
