// src/components/BotProtection.js
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { navigate } from 'gatsby';

// Create context for bot protection
const BotProtectionContext = createContext(null);

// Custom hook for bot detection
const useBotDetection = () => {
  const [isBot, setIsBot] = useState(false);
  const mouseMovements = useRef(0);
  const lastClickTime = useRef(0);
  const clickIntervals = useRef([]);
  const pageLoadTime = useRef(Date.now());
  const firstInteractionTime = useRef(null);

  useEffect(() => {
    // Check for common bot characteristics
    const suspicious = {
      hasWebdriver: navigator?.webdriver,
      hasLanguages: !navigator?.languages,
      hasWebGL: !window?.WebGLRenderingContext,
    };

    const suspiciousCount = Object.values(suspicious).filter(Boolean).length;
    if (suspiciousCount >= 2) {
      setIsBot(true);
      return;
    }

    // Track first interaction time
    const handleFirstInteraction = () => {
      if (!firstInteractionTime.current) {
        firstInteractionTime.current = Date.now() - pageLoadTime.current;
      }
    };

    // Track mouse movements
    const handleMouseMove = () => {
      mouseMovements.current += 1;
      handleFirstInteraction();
    };

    // Track click patterns
    const handleClick = () => {
      handleFirstInteraction();
      const currentTime = Date.now();
      if (lastClickTime.current !== 0) {
        const interval = currentTime - lastClickTime.current;
        clickIntervals.current.push(interval);

        if (clickIntervals.current.length > 3) {
          const isConsistent = checkClickConsistency(clickIntervals.current);
          if (isConsistent) {
            setIsBot(true);
          }
        }
      }
      lastClickTime.current = currentTime;
    };

    // Track scroll events
    const handleScroll = () => {
      handleFirstInteraction();
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return {
    isBot,
    mouseMovements: mouseMovements.current,
    timeOnPage: () => Date.now() - pageLoadTime.current,
    firstInteractionTime: firstInteractionTime.current,
  };
};

// Custom hook for Turnstile
const useTurnstile = (mode = 'managed') => {
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const [token, setToken] = useState(null);
  const widgetId = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // Load Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => setTurnstileLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      if (widgetId.current) {
        window.turnstile?.remove(widgetId.current);
      }
    };
  }, []);

  useEffect(() => {
    if (turnstileLoaded && containerRef.current) {
      // const siteKey = process.env.GATSBY_TURNSTILE_SITE_KEY;
      const siteKey = '0x4AAAAAAAzd4svib0aVD74y';
      
      const commonOptions = {
        sitekey: siteKey,
        callback: (token) => setToken(token),
        'refresh-expired': 'auto',
        'retry': 'auto',
      };

      switch (mode) {
        case 'invisible':
          widgetId.current = window.turnstile.render(containerRef.current, {
            ...commonOptions,
            appearance: 'invisible',
          });
          break;
        case 'managed':
          widgetId.current = window.turnstile.render(containerRef.current, {
            ...commonOptions,
            theme: 'light',
          });
          break;
        // Interactive mode doesn't render immediately
      }
    }
  }, [turnstileLoaded, mode]);

  const executeTurnstile = useCallback(async () => {
    if (!turnstileLoaded) return null;

    if (mode === 'invisible' || mode === 'interactive') {
      return new Promise((resolve) => {
        window.turnstile.ready(() => {
          window.turnstile.invoke({
            // sitekey: process.env.GATSBY_TURNSTILE_SITE_KEY,
            sitekey: '0x4AAAAAAAzd4svib0aVD74y',
            callback: (token) => {
              setToken(token);
              resolve(token);
            },
          });
        });
      });
    }
    return token; // For managed mode, return existing token
  }, [turnstileLoaded, mode, token]);

  const resetTurnstile = useCallback(() => {
    if (widgetId.current) {
      window.turnstile.reset(widgetId.current);
      setToken(null);
    }
  }, []);

  return { containerRef, token, executeTurnstile, resetTurnstile };
};

// Provider component that will wrap your page
export const BotProtectionProvider = ({ 
  children, 
  turnstileMode = 'managed',
  onVerificationComplete 
}) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isBot, mouseMovements, timeOnPage, firstInteractionTime } = useBotDetection();
  const { containerRef, token, executeTurnstile, resetTurnstile } = useTurnstile(turnstileMode);

  const verifyHuman = async () => {
    if (isVerified) return true;
    if (isBot) {
      setError('Access denied - suspicious behavior detected');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Execute Turnstile verification
      const turnstileToken = turnstileMode === 'managed' 
        ? token 
        : await executeTurnstile();

      if (!turnstileToken) {
        throw new Error('Please complete the security check');
      }

      // Call the Netlify function
      const response = await fetch('/.netlify/functions/verify-human', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientData: {
            userAgent: navigator.userAgent,
            languages: navigator.languages,
            platform: navigator.platform,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            mouseMovements,
            timeOnPage: timeOnPage(),
            firstInteractionTime,
          },
          turnstileToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      setIsVerified(true);
      onVerificationComplete?.(true);
      return true;
    } catch (error) {
      console.error('Verification failed:', error);
      setError(error.message);
      resetTurnstile();
      onVerificationComplete?.(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    isVerified,
    isLoading,
    error,
    verifyHuman,
  };

  return (
    <BotProtectionContext.Provider value={contextValue}>
      <div className="space-y-4">
        {/* Turnstile container */}
        {!isVerified && turnstileMode === 'managed' && (
          <div ref={containerRef} className="turnstile-container" />
        )}
        {!isVerified && turnstileMode === 'invisible' && (
          <div ref={containerRef} style={{ display: 'none' }} />
        )}
        
        {/* Error message */}
        {error && (
          <div className="text-red-500 mt-2 text-sm" role="alert">
            {error} - Please, contact us at <a href="mailto:service@milieudefensie.nl" target="_blank" rel="noopener">service@milieudefensie.nl</a>
          </div>
        )}
        
        {children}
      </div>
    </BotProtectionContext.Provider>
  );
};

// Helper functions
const checkClickConsistency = (intervals) => {
  const mean = intervals.reduce((a, b) => a + b) / intervals.length;
  const variance = intervals.reduce((sum, interval) => {
    return sum + Math.pow(interval - mean, 2);
  }, 0) / intervals.length;
  return variance < 50; // Suspiciously consistent if true
};

// Main Protected Link component
export const ProtectedLink = ({ to, children, className = '' }) => {
  const context = useContext(BotProtectionContext);
  const [isNavigating, setIsNavigating] = useState(false);

  if (!context) {
    throw new Error('ProtectedLink must be used within a BotProtectionProvider');
  }

  const { isVerified, isLoading, verifyHuman } = context;

  const handleClick = async (e) => {
    e.preventDefault();
    setIsNavigating(true);

    try {
      const verified = await verifyHuman();
      if (verified) {
        navigate(to);
      }
    } finally {
      setIsNavigating(false);
    }
  };

  return (
    <a
      href={to}
      onClick={handleClick}
      className={`${className} ${(isLoading || isNavigating) ? 'opacity-50 cursor-wait' : ''}`}
      aria-disabled={isLoading || isNavigating}
    >
      {children}
      {(isLoading || isNavigating) && (
        <span className="inline-block ml-2 text-gray-600">
          {isVerified ? 'Navigating...' : 'Verifying...'}
        </span>
      )}
    </a>
  );
};

// Optional: Loading indicator component
export const BotProtectionStatus = () => {
  const context = useContext(BotProtectionContext);

  if (!context) {
    return null;
  }

  const { isVerified, isLoading, error } = context;

  if (!isVerified && !isLoading && !error) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white shadow-lg rounded-lg">
      {isVerified && (
        <div className="text-green-600">✓ Verified</div>
      )}
      {isLoading && (
        <div className="text-blue-600">Verifying...</div>
      )}
      {error && (
        <div className="text-red-600">{error}</div>
      )}
    </div>
  );
};