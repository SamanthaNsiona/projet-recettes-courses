// Utilitaires pour gérer les cookies

/**
 * Définir un cookie
 * @param {string} name - Nom du cookie
 * @param {string} value - Valeur du cookie
 * @param {number} days - Durée de vie en jours
 */
export const setCookie = (name, value, days = 7) => {
  const maxAge = days * 24 * 60 * 60; // Convertir jours en secondes
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Strict`;
};

/**
 * Obtenir un cookie
 * @param {string} name - Nom du cookie
 * @returns {string|null} - Valeur du cookie ou null
 */
export const getCookie = (name) => {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
};

/**
 * Supprimer un cookie
 * @param {string} name - Nom du cookie
 */
export const deleteCookie = (name) => {
  document.cookie = `${name}=; max-age=0; path=/`;
};

/**
 * Vérifier si un cookie existe
 * @param {string} name - Nom du cookie
 * @returns {boolean}
 */
export const hasCookie = (name) => {
  return getCookie(name) !== null;
};

/**
 * Obtenir tous les cookies
 * @returns {Object} - Objet avec tous les cookies
 */
export const getAllCookies = () => {
  const cookies = {};
  document.cookie.split('; ').forEach(cookie => {
    const [name, value] = cookie.split('=');
    if (name) {
      cookies[name] = decodeURIComponent(value);
    }
  });
  return cookies;
};
