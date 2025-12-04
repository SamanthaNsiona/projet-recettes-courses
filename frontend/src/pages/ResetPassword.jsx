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
        <div className="max-w-md flex flex-col" style={{ padding: '40px 30px', border: '1px solid #d1d5db', backgroundColor: '#acacac02' }}>
          <p className="text-center text-neutral-700">Token manquant ou invalide</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
      <div className="max-w-md flex flex-col" style={{ padding: '40px 30px', border: '1px solid #d1d5db', backgroundColor: '#acacac02' }}>
        <h2 className="title-main text-2xl text-center text-neutral-800" style={{ marginBottom: '50px' }}>
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
          <div className="w-80">
            <label className="block text-body text-xs uppercase text-neutral-600 mb-3">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-0 py-3 border-0 border-b border-neutral-300 bg-transparent focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900"
              required
              style={{ paddingBottom: '5px' }}
            />
          </div>

          <div className="w-80">
            <label className="block text-body text-xs uppercase text-neutral-600 mb-3" style={{ paddingTop: '10px' }}>
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-0 py-3 border-0 border-b border-neutral-300 bg-transparent focus:outline-none focus:border-neutral-900 transition-colors text-neutral-900"
              required
              style={{ paddingBottom: '5px' }}
            />
          </div>

          <div className="flex justify-center" style={{ marginTop: '50px' }}>
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-400/30 text-neutral-900 text-sm uppercase hover:bg-gray-400/50 disabled:opacity-50 transition-colors duration-300"
              style={{ fontFamily: 'Arial, sans-serif', padding: '10px 25px', border: '1px solid #d1d5db', color: '#434547ff' }}
            >
              {loading ? 'Réinitialisation...' : 'Réinitialiser'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
