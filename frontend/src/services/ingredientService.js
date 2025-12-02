import api from './api';

export const ingredientService = {
  getAll: async (recipeId) => {
    const response = await api.get(`/recipes/${recipeId}/ingredients`);
    return response.data;
  },

  create: async (recipeId, data) => {
    const response = await api.post(`/recipes/${recipeId}/ingredients`, data);
    return response.data;
  },

  update: async (recipeId, ingredientId, data) => {
    const response = await api.put(`/recipes/${recipeId}/ingredients/${ingredientId}`, data);
    return response.data;
  },

  delete: async (recipeId, ingredientId) => {
    const response = await api.delete(`/recipes/${recipeId}/ingredients/${ingredientId}`);
    return response.data;
  }
};
