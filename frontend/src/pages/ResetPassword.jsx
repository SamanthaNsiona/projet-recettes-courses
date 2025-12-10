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
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
        <div className="max-w-md flex flex-col auth-container">
          <p className="text-center text-neutral-700">Token manquant ou invalide</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
      <div className="max-w-md flex flex-col auth-container">
        <h2 className="title-main text-2xl text-center text-neutral-800 auth-title">
          NOUVEAU MOT DE PASSE
        </h2>
        
        {error && (
          <div className="border-l-2 border-neutral-900 bg-neutral-100 px-6 py-4 mb-8 text-sm text-neutral-700">
            {error}
          </div>    
        )}

        {message && (
          <div className="border-l-2 border-green-600 bg-green-50 px-6 py-4 mb-8 text-sm text-green-700">
            {message}
          </div>    
        )}

        <form onSubmit={handleSubmit} className="space-y-8 flex flex-col items-center">
          <div className="auth-input-wrapper">
            <label className="block text-body text-xs uppercase text-neutral-600 mb-3">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input transition-colors"
              required
            />
          </div>

          <div className="auth-input-wrapper">
            <label className="block text-body text-xs uppercase text-neutral-600 mb-3 auth-label">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="auth-input transition-colors"
              required
            />
          </div>

          <div className="flex justify-center auth-submit-wrapper">
            <button
              type="submit"
              disabled={loading}
              className="auth-button"
            >
              {loading ? 'Réinitialisation...' : 'Réinitialiser'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
