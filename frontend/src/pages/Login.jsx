import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/recipes');
    } catch (err) {
      console.log('Erreur complète:', err);
      console.log('Réponse:', err.response);
      
      if (err.response?.status === 429) {
        setError(err.response?.data?.error || 'Trop de tentatives. Veuillez réessayer plus tard.');
      } else {
        const errorMessage = err.response?.data?.message || 'Email ou mot de passe incorrect';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box auth-container">
        <h2 className="title-main text-center auth-title">
          CONNEXION
        </h2>
        
        {error && (
          <div className="message-error">
            {error}
          </div>    
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-wrapper">
            <label className="form-label">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="auth-input"
              required
            />
          </div>

          <div className="auth-input-wrapper">
            <label className="form-label auth-label">
              Mot de passe
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="auth-input"
              required
            />
          </div>

          <div className="auth-submit-wrapper">
            <button
              type="submit"
              disabled={loading}
              className="auth-button btn-primary"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
            
            <Link to="/forgot-password" className="auth-forgot-link">
              Mot de passe oublié ?
            </Link>
          </div>
        </form>

        <p className="auth-footer-text">
          <span>Pas encore de compte?</span>
          <Link to="/register" className="auth-link">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
