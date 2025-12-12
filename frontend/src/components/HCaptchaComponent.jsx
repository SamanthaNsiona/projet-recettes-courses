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
    <div className="mb-4 flex justify-center">
      <HCaptcha
        ref={captchaRef}
        sitekey="62a61d34-96aa-4c9e-8bec-c930c832fc86"
        onVerify={handleVerify}
        onError={handleError}
        onExpire={handleExpire}
        theme="light"
      />
    </div>
  );
};

export default HCaptchaComponent;
