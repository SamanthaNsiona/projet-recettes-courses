import api from './api';

export const recipeService = {
  // Récupérer toutes les recettes
  getAll: async () => {
    const response = await api.get('/recipes');
    return response.data;
  },

  // Récupérer une recette par ID
  getById: async (id) => {
    const response = await api.get(`/recipes/${id}`);
    return response.data;
  },

  // Créer une recette
  create: async (recipeData) => {
    const response = await api.post('/recipes', recipeData);
    return response.data;
  },

  // Mettre à jour une recette
  update: async (id, recipeData) => {
    const response = await api.put(`/recipes/${id}`, recipeData);
    return response.data;
  },

  // Supprimer une recette
  delete: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },
};
