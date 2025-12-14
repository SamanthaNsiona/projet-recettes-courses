import { useState } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import { contactService } from '../services/contactService';

export default function Contact() {
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setStatus('');
    
    console.log('==============================================');
    console.log('📤 ENVOI MESSAGE DE CONTACT');
    console.log('==============================================');
    console.log('Subject:', formData.subject);
    console.log('Message:', formData.message);
    
    try {
      console.log('🔄 Appel API en cours...');
      const response = await contactService.sendMessage(formData.subject, formData.message);
      console.log('✅ Réponse reçue:', response);
      setStatus(response.message || 'Message envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.');
      setFormData({ subject: '', message: '' });
    } catch (err) {
      console.error('❌ ERREUR lors de l\'envoi');
      console.error('Error object:', err);
      console.error('Response:', err.response);
      console.error('Status:', err.response?.status);
      console.error('Data:', err.response?.data);
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setLoading(false);
      console.log('==============================================');
      setTimeout(() => {
        setStatus('');
        setError('');
      }, 5000);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title-icon">
        <EnvelopeIcon className="page-icon" />
        NOUS CONTACTER
      </h1>

      <div className="contact-container">
        <div className="contact-info">
          <h2 className="section-title">
            <EnvelopeIcon className="section-icon" />
            Service Client
          </h2>
          <p style={{ 
            color: '#737373', 
            fontSize: '0.875rem', 
            marginBottom: '1.5rem',
            lineHeight: '1.6'
          }}>
            Une question ? Un problème ? Notre équipe est là pour vous aider.
            Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
          </p>
        </div>

        {status && (
          <div style={{ 
            borderLeft: '2px solid #16a34a', 
            backgroundColor: '#f0fdf4', 
            padding: '1rem 1.5rem', 
            marginBottom: '2rem', 
            fontSize: '0.875rem', 
            color: '#15803d' 
          }}>
            {status}
          </div>
        )}

        {error && (
          <div style={{ 
            borderLeft: '2px solid #dc2626', 
            backgroundColor: '#fef2f2', 
            padding: '1rem 1.5rem', 
            marginBottom: '2rem', 
            fontSize: '0.875rem', 
            color: '#dc2626' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="subject" className="form-label">Objet</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Ex: Problème avec mes recettes"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              className="form-input"
              rows="8"
              placeholder="Décrivez votre problème ou votre question..."
              required
              style={{ resize: 'vertical', minHeight: '150px' }}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Envoi en cours...' : 'Envoyer le message'}
          </button>
        </form>
      </div>
    </div>
  );
}
