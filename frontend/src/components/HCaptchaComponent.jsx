import { useRef, useEffect, useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const HCaptchaComponent = ({ onVerify, onError }) => {
  const captchaRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('✅ HCaptchaComponent monté');
    console.log('🔑 Site Key: 10000000-ffff-ffff-ffff-000000000001');
    
    // Vérifier que hCaptcha est chargé
    const checkHCaptchaLoaded = () => {
      if (typeof window !== 'undefined' && window.hcaptcha) {
        console.log('✅ hCaptcha API est prêt');
        setIsReady(true);
      } else {
        console.warn('⏳ Attente du chargement de hCaptcha...');
        setTimeout(checkHCaptchaLoaded, 100);
      }
    };
    
    checkHCaptchaLoaded();
  }, []);

  const handleVerify = (token) => {
    console.log('🎫 Token hCaptcha reçu:', token ? token.substring(0, 30) + '...' : 'null');
    onVerify(token);
  };

  const handleError = (err) => {
    console.error('❌ hCaptcha Error:', err);
    if (onError) onError(err);
  };

  const handleExpire = () => {
    console.warn('⚠️ hCaptcha Token Expired');
    onVerify(null);
  };

  return (
    <div className="captcha-container">
      {isReady && (
        <HCaptcha
          ref={captchaRef}
          sitekey="10000000-ffff-ffff-ffff-000000000001"
          onVerify={handleVerify}
          onError={handleError}
          onExpire={handleExpire}
          theme="light"
          endpoint="https://hcaptcha.com"
        />
      )}
    </div>
  );
};

export default HCaptchaComponent;
