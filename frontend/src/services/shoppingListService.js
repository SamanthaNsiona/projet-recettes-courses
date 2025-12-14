import api from './api';

export const shoppingListService = {
  // Récupérer toutes les listes
  getAll: async () => {
    const response = await api.get('/shopping-lists');
    return response.data;
  },

  // Créer une liste
  create: async (listData) => {
    const response = await api.post('/shopping-lists', listData);
    return response.data;
  },

  // Mettre à jour une liste
  update: async (id, listData) => {
    const response = await api.put(`/shopping-lists/${id}`, listData);
    return response.data;
  },

  // Supprimer une liste
  delete: async (id) => {
    const response = await api.delete(`/shopping-lists/${id}`);
    return response.data;
  },

  // Récupérer les items d'une liste
  getItems: async (listId) => {
    const response = await api.get(`/shopping-items/${listId}`);
    return response.data;
  },

  // Ajouter un item à une liste
  addItem: async (listId, itemData) => {
    const response = await api.post(`/shopping-items/${listId}`, itemData);
    return response.data;
  },

  // Mettre à jour un item
  updateItem: async (itemId, itemData) => {
    const response = await api.put(`/shopping-items/${itemId}`, itemData);
    return response.data;
  },

  // Supprimer un item
  deleteItem: async (itemId) => {
    const response = await api.delete(`/shopping-items/${itemId}`);
    return response.data;
  },

  // Ajouter une recette entière à la liste
  addRecipeToList: async (listId, recipeId) => {
    const response = await api.post(`/shopping-items/${listId}/recipe`, { recipeId });
    return response.data;
  },
};
