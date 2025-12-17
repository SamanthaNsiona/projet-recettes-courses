import { useState, useEffect } from 'react';
import { setCookie, getCookie } from '../utils/cookies';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur a déjà donné son consentement
    const consent = getCookie('cookieConsent');
    if (!consent) {
      // Attendre 1 seconde avant d'afficher pour une meilleure UX
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    setCookie('cookieConsent', 'accepted', 365); // 1 an
    setShowBanner(false);
    console.log('✅ Cookies acceptés');
  };

  const declineCookies = () => {
    setCookie('cookieConsent', 'declined', 365); // 1 an
    setShowBanner(false);
    console.log('❌ Cookies refusés');
  };

  if (!showBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#2c3e50',
      color: 'white',
      padding: '1.5rem',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem'
    }}>
      <div style={{ flex: 1, minWidth: '300px' }}>
        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
          🍪 Ce site utilise des cookies essentiels pour son fonctionnement. 
          En continuant, vous acceptez notre{' '}
          <a href="/cookies" style={{ color: '#3498db', textDecoration: 'underline' }}>
            politique de cookies
          </a>.
        </p>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={acceptCookies}
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            padding: '0.7rem 1.5rem',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
        >
          Accepter
        </button>
        
        <button
          onClick={declineCookies}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: '2px solid white',
            padding: '0.7rem 1.5rem',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            transition: 'all 0.3s'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = 'white';
            e.target.style.color = '#2c3e50';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = 'white';
          }}
        >
          Refuser
        </button>
      </div>
    </div>
  );
}
