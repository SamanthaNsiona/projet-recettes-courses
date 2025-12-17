import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const adminService = {
  // Statistiques globales
  getStats: async () => {
    console.log('SERVICE: Appel getStats vers', `${API_URL}/admin/stats`);
    try {
      const response = await axios.get(`${API_URL}/admin/stats`, {
        headers: getAuthHeader()
      });
      console.log('SERVICE: Stats reçues', response.data);
      return response.data;
    } catch (error) {
      console.error('SERVICE: Erreur getStats', error);
      throw error;
    }
  },

  // Gestion des utilisateurs
  getAllUsers: async () => {
    console.log('SERVICE: Appel getAllUsers vers', `${API_URL}/admin/users`);
    try {
      const response = await axios.get(`${API_URL}/admin/users`, {
        headers: getAuthHeader()
      });
      console.log('SERVICE: Users reçus', response.data);
      return response.data;
    } catch (error) {
      console.error('SERVICE: Erreur getAllUsers', error);
      throw error;
    }
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
    console.log('SERVICE: Appel getAllRecipes vers', `${API_URL}/admin/recipes`);
    try {
      const response = await axios.get(`${API_URL}/admin/recipes`, {
        headers: getAuthHeader()
      });
      console.log('SERVICE: Recipes reçues', response.data);
      return response.data;
    } catch (error) {
      console.error('SERVICE: Erreur getAllRecipes', error);
      throw error;
    }
  },

  deleteRecipe: async (recipeId) => {
    const response = await axios.delete(`${API_URL}/admin/recipes/${recipeId}`, {
      headers: getAuthHeader()
    });
    return response.data;
  },

  // Gestion des listes de courses
  getAllLists: async () => {
    console.log('SERVICE: Appel getAllLists vers', `${API_URL}/admin/lists`);
    try {
      const response = await axios.get(`${API_URL}/admin/lists`, {
        headers: getAuthHeader()
      });
      console.log('SERVICE: Lists reçues', response.data);
      return response.data;
    } catch (error) {
      console.error('SERVICE: Erreur getAllLists', error);
      throw error;
    }
  },

  // Gestion de la messagerie
  getMessages: async () => {
    console.log('SERVICE: Appel getMessages vers', `${API_URL}/contact/messages`);
    try {
      const response = await axios.get(`${API_URL}/contact/messages`, {
        headers: getAuthHeader()
      });
      console.log('SERVICE: Messages reçus', response.data);
      return response.data;
    } catch (error) {
      console.error('SERVICE: Erreur getMessages', error);
      throw error;
    }
  }
};
