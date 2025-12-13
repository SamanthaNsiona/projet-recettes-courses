import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.message || 'Un email de réinitialisation a été envoyé à votre adresse.');
      setEmail(''); // Vider le champ email après succès
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.response?.data?.message || err.message || 'Erreur lors de l\'envoi de l\'email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box auth-container">
        <h2 className="title-main text-center auth-title">
          REINITIALISER VOTRE MOT DE PASSE
        </h2>
        
        {error && (
          <div className="message-error">
            {error}
          </div>    
        )}

        {message && (
          <div className="message-success">
            {message}
          </div>    
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-wrapper">
            <label className="form-label">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />
          </div>

          <div className="flex justify-center auth-submit-wrapper">
            <button
              type="submit"
              disabled={loading}
              className="auth-button btn-primary"
            >
              {loading ? 'Envoi...' : 'Réinitialiser'}
            </button>
          </div>
        </form>

        <p className="auth-footer-text">
          <Link to="/login" className="auth-link">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
