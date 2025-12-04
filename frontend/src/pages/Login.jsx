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
      setError(err.response?.data?.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
      <div className="max-w-md flex flex-col" style={{ padding: '45px 35px', border: '1px solid #d1d5db', backgroundColor: '#acacac02' }}>
        <h2 className="title-main text-2xl text-center text-neutral-800" style={{ marginBottom: '50px' }}>
          CONNEXION
        </h2>
        
        {error && (
          <div className="border-l-2 border-neutral-900 bg-neutral-100 px-12 py-16 mb-8 text-sm text-neutral-700">
            {error}
          </div>    
        )}

        <form onSubmit={handleSubmit} className="space-y-8 flex flex-col items-center">
          <div className="w-80">
            <label className="block text-body text-xs uppercase text-neutral-600 mb-3">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-0 py-3 border-0 border-b border-neutral-300 bg-transparent focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900"
              required style={{ paddingBottom: '5px' }}
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
              className="w-full px-0 py-3 border-0 border-b border-neutral-300 bg-transparent focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900"
              required style={{ paddingBottom: '5px' }}
            />
          </div>

          <div className="flex flex-col items-center gap-4" style={{ marginTop: '30px' }}>
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-400/30 text-neutral-900 text-sm uppercase hover:bg-gray-400/50 disabled:opacity-50 transition-colors duration-300"
              style={{ fontFamily: 'Arial, sans-serif', padding: '10px 25px', border: '1px solid #d1d5db', color: '#434547ff' }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
            
            <Link 
              to="/forgot-password" 
              className="text-xs text-neutral-600 hover:text-neutral-900 transition-opacity no-underline flex items-center gap-2"
              style={{ marginTop: '12px' }}
            >
              Mot de passe oublié ?
            </Link>
          </div>
        </form>

        <p className="text-center mt-12 text-xs tracking-wider text-neutral-500 uppercase flex justify-center" style={{gap: '2px' }}>
          <span>Pas encore de compte?</span>
          <Link to="/register" className="text-neutral-900 hover:opacity-60 transition-opacity no-underline">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
