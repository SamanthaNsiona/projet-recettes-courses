import api from './api';

export const contactService = {
  // Envoyer un message de contact
  sendMessage: async (subject, message) => {
    const response = await api.post('/contact', { subject, message });
    return response.data;
  },
};
