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
      
      // Gérer le rate limiting (statut 429)
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
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
      <div className="max-w-md flex flex-col auth-container">
        <h2 className="title-main text-2xl text-center text-neutral-800 auth-title">
          CONNEXION
        </h2>
        
        {error && (
          <div className="border-l-2 border-neutral-900 bg-neutral-100 px-12 py-16 mb-8 text-sm text-neutral-700">
            {error}
          </div>    
        )}

        <form onSubmit={handleSubmit} className="space-y-8 flex flex-col items-center">
          <div className="auth-input-wrapper">
            <label className="block text-body text-xs uppercase text-neutral-600 mb-3">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="auth-input transition-colors"
              required
            />
          </div>

          <div className="auth-input-wrapper">
            <label className="block text-body text-xs uppercase text-neutral-600 mb-3 auth-label">
              Mot de passe
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="auth-input transition-colors"
              required
            />
          </div>

          <div className="flex flex-col items-center gap-4 auth-submit-wrapper">
            <button
              type="submit"
              disabled={loading}
              className="auth-button disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
            
            <Link 
              to="/forgot-password" 
              className="text-xs text-neutral-600 hover:text-neutral-900 transition-opacity auth-link flex items-center gap-2"
              style={{ marginTop: '12px' }}
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </form>

        <p className="text-center mt-12 text-xs tracking-wider text-neutral-500 uppercase flex justify-center" style={{gap: '2px' }}>
          <span>Pas encore de compte?</span>
          <Link to="/register" className="text-neutral-900 auth-link">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
