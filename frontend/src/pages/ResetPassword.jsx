import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la réinitialisation');
      }

      setMessage('Mot de passe réinitialisé avec succès');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-box auth-container">
          <p className="auth-error-text">Token manquant ou invalide</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-box auth-container">
        <h2 className="title-main auth-title">
          NOUVEAU MOT DE PASSE
        </h2>
        
        {error && (
          <div className="message-error">
            {error}
          </div>    
        )}

        {message && (
          <div style={{ 
            borderLeft: '2px solid #16a34a', 
            backgroundColor: '#f0fdf4', 
            padding: '1rem 1.5rem', 
            marginBottom: '2rem', 
            fontSize: '0.875rem', 
            color: '#15803d' 
          }}>
            {message}
          </div>    
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-wrapper">
            <label className="form-label">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
          </div>

          <div className="auth-input-wrapper">
            <label className="form-label auth-label">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Réinitialisation...' : 'Réinitialiser'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
