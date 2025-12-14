import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HCaptchaComponent from '../components/HCaptchaComponent';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('📝 Tentative d\'inscription');
    console.log('🎫 Token captcha:', captchaToken ? '✅ OUI' : '❌ NON');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (!captchaToken) {
      setError('Veuillez compléter la vérification hCaptcha');
      return;
    }

    setLoading(true);

    try {
      console.log('📤 Envoi inscription au serveur');
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        captchaToken: captchaToken,
      });
      console.log('✅ Inscription réussie !');
      navigate('/recipes');
    } catch (err) {
      console.error('❌ Erreur inscription:', err.response?.data?.message);
      setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box auth-container">
        <h2 className="title-main auth-title">
          INSCRIPTION
        </h2>
        
        {error && (
          <div className="message-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-input-wrapper">
            <label className="form-label">
              Nom
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="auth-input"
              required
            />
          </div>

          <div className="auth-input-wrapper">
            <label className="form-label auth-label">
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
              minLength={6}
            />
          </div>

          <div className="auth-input-wrapper">
            <label className="form-label auth-label">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="auth-input"
              required
              minLength={6}
            />
          </div>

          <div className="auth-captcha-wrapper">
            <HCaptchaComponent 
              onVerify={setCaptchaToken}
              onError={() => setCaptchaToken(null)}
            />
          </div>

          <div className="flex justify-center auth-submit-wrapper">
            <button
              type="submit"
              disabled={loading || !captchaToken}
              className="auth-button btn-primary"
            >
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </button>
          </div>
        </form>

        <p className="auth-footer-text">
          <span>Déjà un compte?</span>
          <Link to="/login" className="auth-link">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
