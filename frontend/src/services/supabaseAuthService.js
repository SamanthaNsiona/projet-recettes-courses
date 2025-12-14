// Service d'authentification utilisant l'API backend (Prisma/Node.js)
// Les données sont stockées dans PostgreSQL Supabase

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const authService = {
  // S'inscrire avec email, password, name et captcha token
  async signup(email, password, name, captchaToken) {
    if (!captchaToken) {
      throw new Error('Captcha token is required');
    }
    
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, captchaToken }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }
    return await response.json();
  },

  // Se connecter
  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }
    
    const data = await response.json();
    // Stocker le token JWT
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  },

  // Se déconnecter
  logout() {
    localStorage.removeItem('authToken');
  },

  // Récupérer l'utilisateur actuel
  async getCurrentUser() {
    const token = localStorage.getItem('authToken');
    if (!token) return null;
    
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (!response.ok) {
        localStorage.removeItem('authToken');
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Réinitialiser le mot de passe (demander reset link)
  async forgotPassword(email) {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Forgot password failed');
    }
    return await response.json();
  },

  // Mettre à jour le mot de passe avec le token de reset
  async resetPassword(token, newPassword) {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Reset password failed');
    }
    return await response.json();
  },

  // Obtenir le token stocké
  getToken() {
    return localStorage.getItem('authToken');
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },
};
