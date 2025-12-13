import { useState, useEffect } from 'react';

const SimpleCaptcha = ({ onVerify }) => {
  const [captchaQuestion, setCaptchaQuestion] = useState({ num1: 0, num2: 0, answer: 0 });
  const [userAnswer, setUserAnswer] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  // Générer une nouvelle question de captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let answer;
    let questionText;
    
    switch(operation) {
      case '+': {
        answer = num1 + num2;
        questionText = `${num1} + ${num2}`;
        break;
      }
      case '-': {
        // S'assurer que le résultat est positif
        const larger = Math.max(num1, num2);
        const smaller = Math.min(num1, num2);
        answer = larger - smaller;
        questionText = `${larger} - ${smaller}`;
        break;
      }
      case '*': {
        answer = num1 * num2;
        questionText = `${num1} × ${num2}`;
        break;
      }
      default: {
        answer = num1 + num2;
        questionText = `${num1} + ${num2}`;
      }
    }
    
    setCaptchaQuestion({ questionText, answer });
    setUserAnswer('');
    setIsVerified(false);
    setError('');
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      generateCaptcha();
    }, 0);
    
    return () => clearTimeout(timer);
  }, []);

  const handleVerify = () => {
    const userNum = parseInt(userAnswer);
    
    if (isNaN(userNum)) {
      setError('Veuillez entrer un nombre valide');
      setIsVerified(false);
      onVerify(null);
      return;
    }
    
    if (userNum === captchaQuestion.answer) {
      setIsVerified(true);
      setError('');
      // Générer un token simple (utilisé pour vérification backend)
      const token = btoa(JSON.stringify({ answer: captchaQuestion.answer, timestamp: Date.now() }));
      onVerify(token);
    } else {
      setIsVerified(false);
      setError('Réponse incorrecte. Veuillez réessayer.');
      onVerify(null);
      // Générer une nouvelle question après une mauvaise réponse
      setTimeout(() => {
        generateCaptcha();
      }, 1500);
    }
  };

  const handleChange = (e) => {
    setUserAnswer(e.target.value);
    setError('');
    setIsVerified(false);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Vérification anti-robot 🤖
      </label>
      <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1">
            <div className="bg-white border-2 border-blue-500 rounded-lg p-3 text-center">
              <span className="text-2xl font-bold text-blue-600 select-none">
                {captchaQuestion.questionText} = ?
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={generateCaptcha}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            title="Générer une nouvelle question"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={userAnswer}
            onChange={handleChange}
            onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
            placeholder="Votre réponse"
            className={`flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              isVerified 
                ? 'border-green-500 focus:ring-green-500' 
                : error 
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
            disabled={isVerified}
          />
          <button
            type="button"
            onClick={handleVerify}
            disabled={isVerified || !userAnswer}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isVerified
                ? 'bg-green-500 text-white cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed'
            }`}
          >
            {isVerified ? '✓ Vérifié' : 'Vérifier'}
          </button>
        </div>
        
        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        
        {isVerified && (
          <p className="mt-2 text-sm text-green-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Captcha vérifié avec succès !
          </p>
        )}
      </div>
    </div>
  );
};

export default SimpleCaptcha;
