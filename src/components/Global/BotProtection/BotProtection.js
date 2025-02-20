import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { navigate } from 'gatsby';
import './index.scss';

const BotProtectionContext = createContext(null);

// Custom hook for reCAPTCHA
const useReCAPTCHA = () => {
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=' + process.env.GATSBY_RECAPTCHA_SITE_KEY;
    script.async = true;
    script.defer = true;
    script.onload = () => setRecaptchaLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const executeRecaptcha = useCallback(async () => {
    if (!recaptchaLoaded) return null;

    return new Promise((resolve) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(process.env.GATSBY_RECAPTCHA_SITE_KEY, { action: 'submit' }).then(resolve);
      });
    });
  }, [recaptchaLoaded]);

  return { executeRecaptcha };
};

// Provider component that will wrap your page
export const BotProtectionProvider = ({ children }) => {
  const { executeRecaptcha } = useReCAPTCHA();

  return (
    <BotProtectionContext.Provider value={{ executeRecaptcha }}>
      <div>
        <p>
          Deze website wordt beschermd tegen spam door reCAPTCHA, dus het Google{' '}
          <a href="https://policies.google.com/privacy">privacybeleid</a> en{' '}
          <a href="https://policies.google.com/terms">voorwaarden</a> zijn van toepassing.
        </p>
        {children}
      </div>
    </BotProtectionContext.Provider>
  );
};

export const ProtectedLink = ({ to, children, className = '' }) => {
  const { executeRecaptcha } = useContext(BotProtectionContext);

  if (!executeRecaptcha) {
    throw new Error('ProtectedLink must be used within a BotProtectionProvider');
  }

  const handleClick = async (e) => {
    e.preventDefault();
    await executeRecaptcha();
    navigate(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

// Optional: Loading indicator component
export const BotProtectionStatus = () => {
  const context = useContext(BotProtectionContext);

  if (!context) {
    return null;
  }

  return null;
};
