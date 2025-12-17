const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//  1. Récupérer toutes les recettes (admin uniquement)
const getAllRecipes = async (req, res) => {
  try {
    console.log(' GET /api/admin/recipes appelé par:', req.user?.email);
    const recipes = await prisma.recipe.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true, role: true }
        },
        ingredientsList: true
      },
      orderBy: { createdAt: 'desc' }
    });
    console.log(' Recettes trouvées:', recipes.length);
    res.json(recipes);
  } catch (error) {
    console.error(' ERREUR getAllRecipes:', error);
    console.error(' Message:', error.message);
    console.error(' Stack:', error.stack);
    res.status(500).json({ error: error.message });
  }
};

//  2. Récupérer tous les utilisateurs (admin uniquement)
const getAllUsers = async (req, res) => {
  try {
    console.log(' GET /api/admin/users appelé par:', req.user?.email);
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        _count: {
          select: {
            recipes: true,
            lists: true
          }
        }
      },
      orderBy: { id: 'desc' }
    });
    console.log(' Utilisateurs trouvés:', users.length);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  3. Récupérer toutes les listes de courses (admin uniquement)
const getAllLists = async (req, res) => {
  try {
    console.log(' GET /api/admin/lists appelé par:', req.user?.email);
    const lists = await prisma.shoppingList.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true }
        },
        items: true
      },
      orderBy: { id: 'desc' }
    });
    console.log(' Listes trouvées:', lists.length);
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  4. Supprimer une recette (admin uniquement)
const deleteRecipe = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const recipe = await prisma.recipe.findUnique({ where: { id } });
    if (!recipe) {
      return res.status(404).json({ message: "Recette introuvable" });
    }

    await prisma.recipe.delete({ where: { id } });
    res.json({ message: "Recette supprimée par l'administrateur" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  5. Supprimer un utilisateur (admin uniquement)
const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Empêcher la suppression de son propre compte
    if (id === req.user.id) {
      return res.status(400).json({ message: "Vous ne pouvez pas supprimer votre propre compte" });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    await prisma.user.delete({ where: { id } });
    res.json({ message: "Utilisateur supprimé par l'administrateur" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  6. Changer le rôle d'un utilisateur (admin uniquement)
const updateUserRole = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: "Rôle invalide. Utilisez 'USER' ou 'ADMIN'" });
    }

    // Empêcher de modifier son propre rôle
    if (id === req.user.id) {
      return res.status(400).json({ message: "Vous ne pouvez pas modifier votre propre rôle" });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });

    res.json({ message: "Rôle mis à jour", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  7. Obtenir les statistiques globales (admin uniquement)
const getStats = async (req, res) => {
  try {
    console.log(' GET /api/admin/stats appelé');
    console.log('User:', req.user);
    
    const [totalUsers, totalRecipes, totalLists, totalPublicRecipes] = await Promise.all([
      prisma.user.count(),
      prisma.recipe.count(),
      prisma.shoppingList.count(),
      prisma.recipe.count({ where: { isPublic: true } })
    ]);

    const stats = {
      totalUsers,
      totalRecipes,
      totalLists,
      totalPublicRecipes,
      totalPrivateRecipes: totalRecipes - totalPublicRecipes
    };
    
    console.log(' Stats calculées:', stats);
    res.json(stats);
  } catch (error) {
    console.error(' Erreur getStats:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllRecipes,
  getAllUsers,
  getAllLists,
  deleteRecipe,
  deleteUser,
  updateUserRole,
  getStats
};

