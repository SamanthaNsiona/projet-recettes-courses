const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getItems = async (req, res) => {
  try {
    const listId = parseInt(req.params.listId);

    const items = await prisma.shoppingItem.findMany({
      where: { listId }
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const { name, quantity, unit, checked } = req.body;

    const item = await prisma.shoppingItem.update({
      where: { id: itemId },
      data: { name, quantity, unit, checked }
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);

    await prisma.shoppingItem.delete({
      where: { id: itemId }
    });

    res.json({ message: "Item supprimé" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Ajouter tous les ingrédients d'une recette à une liste
const addRecipeToList = async (req, res) => {
  try {
    const listId = parseInt(req.params.listId);
    const { recipeId } = req.body;

    // Récupérer les ingrédients de la recette
    const recipe = await prisma.recipe.findUnique({
      where: { id: parseInt(recipeId) },
      include: { ingredientsList: true }
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recette introuvable" });
    }

    // Récupérer les items existants dans la liste
    const existingItems = await prisma.shoppingItem.findMany({
      where: { listId }
    });

    const itemsToAdd = [];
    const itemsToUpdate = [];

    // Regrouper les doublons automatiquement
    for (const ing of recipe.ingredientsList) {
      const existing = existingItems.find(item => 
        item.name.toLowerCase() === ing.name.toLowerCase()
      );

      if (existing && existing.quantity && ing.quantity) {
        // Additionner les quantités si l'item existe déjà
        itemsToUpdate.push({
          id: existing.id,
          quantity: existing.quantity + ing.quantity
        });
      } else if (!existing) {
        // Créer un nouvel item
        itemsToAdd.push({
          listId,
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit
        });
      }
    }

    // Créer les nouveaux items
    const created = await Promise.all(
      itemsToAdd.map(data => prisma.shoppingItem.create({ data }))
    );

    // Mettre à jour les quantités des items existants
    const updated = await Promise.all(
      itemsToUpdate.map(item => 
        prisma.shoppingItem.update({
          where: { id: item.id },
          data: { quantity: item.quantity }
        })
      )
    );

    res.status(201).json({ 
      message: `${created.length} ajoutés, ${updated.length} mis à jour`,
      created,
      updated
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getItems, addItem, updateItem, deleteItem, addRecipeToList };
