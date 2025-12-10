import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      navigate('/recipes');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
      <div className="max-w-md flex flex-col auth-container">
        <h2 className="title-main text-2xl text-center text-neutral-800 auth-title">
          INSCRIPTION
        </h2>
        
        {error && (
          <div className="border-l-2 border-neutral-900 bg-neutral-100 px-6 py-4 mb-8 text-sm text-neutral-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 flex flex-col items-center">
          <div className="auth-input-wrapper">
            <label className="block text-body text-xs uppercase text-neutral-600 mb-3">
              Nom
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="auth-input transition-colors"
              required
            />
          </div>

          <div className="auth-input-wrapper">
            <label className="block text-body text-xs uppercase text-neutral-600 mb-3 auth-label">
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
              minLength={6}
            />
          </div>

          <div className="auth-input-wrapper">
            <label className="block text-body text-xs uppercase text-neutral-600 mb-3 auth-label">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="auth-input transition-colors"
              required
              minLength={6}
            />
          </div>

          <div className="flex justify-center auth-submit-wrapper">
            <button
              type="submit"
              disabled={loading}
              className="auth-button"
            >
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </div>
        </form>

        <p className="text-center mt-12 text-xs tracking-wider text-neutral-500 uppercase flex justify-center auth-footer">
          <span>Déjà un compte?</span>
          <Link to="/login" className="text-neutral-900 auth-link">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
