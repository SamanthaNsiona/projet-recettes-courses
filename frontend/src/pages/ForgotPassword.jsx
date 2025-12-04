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
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-6">
      <div className="max-w-md flex flex-col" style={{ padding: '45px 35px', border: '1px solid #d1d5db', backgroundColor: '#acacac02' }}>
        <h2 className="title-main text-2xl text-center text-neutral-800" style={{ marginBottom: '50px' }}>
          REINITIALISER VOTRE MOT DE PASSE
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
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {loading ? 'Envoi...' : 'Réinitialiser'}
            </button>
          </div>
        </form>

        <p className="text-center mt-12 text-xs tracking-wider text-neutral-500 uppercase flex justify-center" style={{ marginTop: '20px', gap: '10px' }}>
          <Link to="/login" className="text-neutral-900 hover:opacity-60 transition-opacity no-underline">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
