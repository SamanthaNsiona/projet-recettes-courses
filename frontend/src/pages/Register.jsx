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
      <div className="max-w-md flex flex-col" style={{ padding: '40px 30px', border: '1px solid #9ca3af', backgroundColor: '#acacac02' }}>
        <h2 className="title-main text-2xl text-center text-neutral-800" style={{ marginBottom: '50px' }}>
          INSCRIPTION
        </h2>
        
        {error && (
          <div className="border-l-2 border-neutral-900 bg-neutral-100 px-6 py-4 mb-8 text-sm text-neutral-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 flex flex-col items-center">
          <div className="w-80">
            <label className="block text-body text-xs uppercase text-neutral-600 mb-3">
              Nom
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-0 py-3 border-0 border-b border-neutral-300 bg-transparent focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900"
              required
              style={{ width: '320px' }}
            />
          </div>

          <div className="w-80">
            <label className="block text-body text-xs uppercase text-neutral-600 mb-3" style={{ paddingTop: '10px' }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-0 py-3 border-0 border-b border-neutral-300 bg-transparent focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900"
              required
              style={{ width: '320px' }}
            />
          </div>

          <div className="w-80">
            <label className="block text-body text-xs uppercase text-neutral-600 mb-3" style={{ paddingTop: '10px' }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="px-0 py-3 border-0 border-b border-neutral-300 bg-transparent focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900"
              required
              minLength={6}
              style={{ width: '320px' }}
            />
          </div>

          <div className="w-80">
            <label className="block text-body text-xs uppercase text-neutral-600 mb-3" style={{ paddingTop: '10px' }}>
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="px-0 py-3 border-0 border-b border-neutral-300 bg-transparent focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900"
              required
              minLength={6}
              style={{ width: '320px' }}
            />
          </div>

          <div className="flex justify-center" style={{ marginTop: '30px' }}>
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-400/30 text-neutral-900 text-sm uppercase hover:bg-gray-400/50 disabled:opacity-50 transition-colors duration-300"
              style={{ fontFamily: 'Arial, sans-serif', padding: '10px 25px', border: '1px solid #d1d5db', color: '#434547ff' }}
            >
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </div>
        </form>

        <p className="text-center mt-12 text-xs tracking-wider text-neutral-500 uppercase flex justify-center" style={{ marginTop: '20px', gap: '10px' }}>
          <span>Déjà un compte?</span>
          <Link to="/login" className="text-neutral-900 hover:opacity-60 transition-opacity no-underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
