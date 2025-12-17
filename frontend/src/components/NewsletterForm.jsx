import { useState } from 'react';
import { setCookie, getCookie } from '../utils/cookies';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(''); // '', 'success', 'error', 'already'

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Vérifier si déjà inscrit
    const alreadySubscribed = getCookie('newsletter_email');
    if (alreadySubscribed) {
      setStatus('already');
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setStatus('error');
      return;
    }

    // Enregistrer dans un cookie (durée 1 an)
    setCookie('newsletter_email', email, 365);
    
    // TODO: Envoyer l'email au backend
    console.log('Inscription newsletter:', email);
    
    setStatus('success');
    setEmail('');
    
    // Réinitialiser après 3 secondes
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem', color: '#ffffffff' }}>
        Newsletter
      </h3>
      <p style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#d1d1d1' }}>
        Recevez nos meilleures recettes chaque semaine !
      </p>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="email"
            placeholder="Votre email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              flex: 1,
              padding: '0.6rem',
              borderRadius: '5px',
              border: '1px solid #ffffffa6',
              backgroundColor: '#ffffffff',
              color: 'white',
              fontSize: '0.85rem'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.6rem 1rem',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: '#585858ff',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: '500'
            }}
          >
            S'inscrire
          </button>
        </div>
        
        {status === 'success' && (
          <p style={{ fontSize: '0.8rem', color: '#2ecc71', margin: '0.5rem 0 0 0' }}>
            ✓ Inscription réussie !
          </p>
        )}
        {status === 'error' && (
          <p style={{ fontSize: '0.8rem', color: '#e74c3c', margin: '0.5rem 0 0 0' }}>
            ✗ Email invalide
          </p>
        )}
        {status === 'already' && (
          <p style={{ fontSize: '0.8rem', color: '#f39c12', margin: '0.5rem 0 0 0' }}>
            ⚠ Déjà inscrit !
          </p>
        )}
      </form>
    </div>
  );
}
