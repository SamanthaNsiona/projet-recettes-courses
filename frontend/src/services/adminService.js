import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminService = {
  // Statistiques globales
  getStats: async () => {
    const response = await axios.get(`${API_URL}/admin/stats`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Gestion des utilisateurs
  getAllUsers: async () => {
    const response = await axios.get(`${API_URL}/admin/users`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await axios.delete(`${API_URL}/admin/users/${userId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  updateUserRole: async (userId, role) => {
    const response = await axios.put(`${API_URL}/admin/users/${userId}/role`, 
      { role },
      { headers: getAuthHeader() }
    );
    return response.data;
  },

  // Gestion des recettes
  getAllRecipes: async () => {
    const response = await axios.get(`${API_URL}/admin/recipes`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  deleteRecipe: async (recipeId) => {
    const response = await axios.delete(`${API_URL}/admin/recipes/${recipeId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Gestion des listes de courses
  getAllLists: async () => {
    const response = await axios.get(`${API_URL}/admin/lists`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
};
