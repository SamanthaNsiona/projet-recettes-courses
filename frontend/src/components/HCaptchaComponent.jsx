import { useRef } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';

const HCaptchaComponent = ({ onVerify, onError }) => {
  const captchaRef = useRef(null);

  const handleVerify = (token) => {
    onVerify(token);
  };

  const handleError = (err) => {
    console.error('hCaptcha Error:', err);
    if (onError) onError(err);
  };

  const handleExpire = () => {
    console.warn('hCaptcha Token Expired');
    onVerify(null);
  };

  return (
    <div className="captcha-container">
      <HCaptcha
        ref={captchaRef}
        sitekey="10000000-ffff-ffff-ffff-000000000001"
        onVerify={handleVerify}
        onError={handleError}
        onExpire={handleExpire}
        theme="light"
      />
    </div>
  );
};

export default HCaptchaComponent;
