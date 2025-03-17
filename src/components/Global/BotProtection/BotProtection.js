// src/components/BotProtection.js
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { navigate } from 'gatsby';
import './index.scss';

// Create context for bot protection
const BotProtectionContext = createContext(null);

// Custom hook for bot detection with improved reliability
const useBotDetection = () => {
  const [isBot, setIsBot] = useState(false);
  const mouseMovements = useRef(0);
  const lastClickTime = useRef(0);
  const clickIntervals = useRef([]);
  const pageLoadTime = useRef(Date.now());
  const firstInteractionTime = useRef(null);
  const detectionComplete = useRef(false);

  useEffect(() => {
    // Wait for browser to fully initialize before running detection
    const initTimeout = setTimeout(() => {
      // Basic browser feature detection (more reliable)
      try {
        const suspicious = {
          hasWebdriver: navigator?.webdriver === true,
          noLanguages: !navigator?.languages || navigator.languages.length === 0,
          hasNoCanvas: !window?.HTMLCanvasElement,
        };
        
        const suspiciousCount = Object.values(suspicious).filter(Boolean).length;
        if (suspiciousCount >= 2) {
          setIsBot(true);
        }
        detectionComplete.current = true;
      } catch (err) {
        console.error("Detection error:", err);
        // On error, don't flag as bot to prevent false positives
        detectionComplete.current = true;
      }
    }, 500); // Give browser time to initialize properly

    return () => clearTimeout(initTimeout);
  }, []);

  useEffect(() => {
    // Track first interaction time
    const handleFirstInteraction = () => {
      if (!firstInteractionTime.current) {
        firstInteractionTime.current = Date.now() - pageLoadTime.current;
      }
    };

    // Track mouse movements with debounce to avoid performance issues
    let moveTimer;
    const handleMouseMove = () => {
      clearTimeout(moveTimer);
      moveTimer = setTimeout(() => {
        mouseMovements.current += 1;
        handleFirstInteraction();
      }, 50);
    };

    // Track click patterns
    const handleClick = () => {
      handleFirstInteraction();
      const currentTime = Date.now();
      if (lastClickTime.current !== 0) {
        const interval = currentTime - lastClickTime.current;
        clickIntervals.current.push(interval);
      }
      lastClickTime.current = currentTime;
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      clearTimeout(moveTimer);
    };
  }, []);

  // Create a stable API to return
  return useCallback(() => ({
    isBot,
    isDetectionComplete: detectionComplete.current,
    mouseMovements: mouseMovements.current,
    timeOnPage: Date.now() - pageLoadTime.current,
    firstInteractionTime: firstInteractionTime.current,
  }), [isBot]);
};

// Improved Turnstile hook with better error handling
const useTurnstile = (mode = 'managed') => {
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const [token, setToken] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const widgetId = useRef(null);
  const containerRef = useRef(null);
  const attempts = useRef(0);

  // Load Turnstile script
  useEffect(() => {
    // Check if script is already loaded
    if (document.querySelector('script[src*="turnstile"]')) {
      setTurnstileLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setTurnstileLoaded(true);
      setLoadError(null);
    };
    
    script.onerror = (err) => {
      console.error('Failed to load Turnstile:', err);
      setLoadError('Failed to load security verification');
    };
    
    document.body.appendChild(script);

    return () => {
      // Only remove if we added it
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Initialize Turnstile when ready
  useEffect(() => {
    // Ensure container, turnstile loaded, and window.turnstile exists
    if (!turnstileLoaded || !containerRef.current || !window.turnstile) {
      return;
    }

    // Clear any existing widget
    if (widgetId.current) {
      try {
        window.turnstile.remove(widgetId.current);
      } catch (err) {
        console.warn('Failed to remove Turnstile widget:', err);
      }
    }

    const siteKey = process.env.GATSBY_TURNSTILE_SITE_KEY;
    if (!siteKey) {
      console.error('Missing Turnstile site key');
      setLoadError('Security configuration error');
      return;
    }
    
    try {
      const commonOptions = {
        sitekey: siteKey,
        callback: (returnedToken) => {
          setToken(returnedToken);
          attempts.current = 0; // Reset attempts on success
        },
        'expired-callback': () => {
          console.log('Turnstile token expired');
          setToken(null);
        },
        'error-callback': (error) => {
          console.error('Turnstile error:', error);
          setToken(null);
        },
      };

      // Use different options based on mode
      if (mode === 'invisible') {
        widgetId.current = window.turnstile.render(containerRef.current, {
          ...commonOptions,
          appearance: 'invisible',
          execution: 'execute',
        });
      } else if (mode === 'managed') {
        widgetId.current = window.turnstile.render(containerRef.current, {
          ...commonOptions,
          theme: 'light',
        });
      }
    } catch (err) {
      console.error('Failed to render Turnstile:', err);
      setLoadError(`Security verification error: ${err.message}`);
    }
  }, [turnstileLoaded, mode]);

  const executeTurnstile = useCallback(async () => {
    attempts.current += 1;
    
    // If we already have a token, return it
    if (token) return token;
    
    // Prevent too many consecutive attempts
    if (attempts.current > 3) {
      throw new Error('Too many verification attempts. Please reload the page.');
    }

    // Check if Turnstile is loaded
    if (!window.turnstile) {
      throw new Error('Security verification not loaded');
    }

    return new Promise((resolve, reject) => {
      let timeoutId;
      
      try {
        // Execute or reset based on mode
        if (mode === 'invisible' || mode === 'interactive') {
          window.turnstile.execute(widgetId.current, {
            callback: (newToken) => {
              clearTimeout(timeoutId);
              setToken(newToken);
              resolve(newToken);
            },
            'error-callback': (error) => {
              clearTimeout(timeoutId);
              reject(new Error(`Verification failed: ${error}`));
            }
          });
        } else {
          // For managed mode, we need to wait for user interaction
          window.turnstile.reset(widgetId.current);
          
          // Setup watcher for token
          const checkToken = () => {
            if (token) {
              clearTimeout(timeoutId);
              resolve(token);
            } else {
              timeoutId = setTimeout(checkToken, 500);
            }
          };
          checkToken();
        }
        
        // Set a timeout to prevent hanging
        timeoutId = setTimeout(() => {
          reject(new Error('Verification timed out'));
        }, 30000);
      } catch (err) {
        clearTimeout(timeoutId);
        reject(new Error(`Verification error: ${err.message}`));
      }
    });
  }, [token, mode]);

  const resetTurnstile = useCallback(() => {
    if (widgetId.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetId.current);
        setToken(null);
      } catch (err) {
        console.warn('Failed to reset Turnstile:', err);
      }
    }
  }, []);

  return { 
    containerRef, 
    token, 
    executeTurnstile, 
    resetTurnstile, 
    turnstileLoaded,
    loadError 
  };
};

// Provider component with improved reliability
export const BotProtectionProvider = ({ 
  children, 
  turnstileMode = 'invisible',
  onVerificationComplete,
  sessionDuration = 30  // Minutes the verification remains valid
}) => {
  const [verificationState, setVerificationState] = useState({
    isVerified: false,
    isLoading: false,
    error: null,
    lastVerified: null,
    buttonClicked: null
  });

  const setButtonClicked = (value) => {
    setVerificationState(prev => ({
      ...prev,
      buttonClicked: value
    }));
  };
  
  const getBotInfo = useBotDetection();
  const { 
    containerRef, 
    token, 
    executeTurnstile, 
    resetTurnstile,
    loadError
  } = useTurnstile(turnstileMode);

  // Initialize from session storage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const storedVerification = JSON.parse(sessionStorage.getItem('botVerification'));
      
      if (storedVerification && typeof storedVerification === 'object') {
        const { isVerified, lastVerified } = storedVerification;
        
        // Check if verification is still valid (not expired)
        if (isVerified && lastVerified) {
          const now = Date.now();
          const expiresAt = lastVerified + (sessionDuration * 60 * 1000);
          
          if (now < expiresAt) {
            setVerificationState(prev => ({
              ...prev,
              isVerified: true,
              lastVerified
            }));
            return;
          }
        }
      }
    } catch (err) {
      console.warn('Failed to restore verification state:', err);
    }
  }, [sessionDuration]);

  // Save to session storage when verification state changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (verificationState.isVerified) {
      const storeValue = {
        isVerified: true,
        lastVerified: verificationState.lastVerified || Date.now()
      };
      sessionStorage.setItem('botVerification', JSON.stringify(storeValue));
    }
  }, [verificationState.isVerified, verificationState.lastVerified]);

  // If Turnstile has a load error, show it
  useEffect(() => {
    if (loadError) {
      setVerificationState(prev => ({
        ...prev,
        error: loadError
      }));
    }
  }, [loadError]);

  const verifyHuman = async () => {
    // Return true immediately if already verified
    if (verificationState.isVerified) return true;
    
    setVerificationState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      // Get current bot detection info
      const botInfo = getBotInfo();
      
      // Skip further checks if detected as bot
      if (botInfo.isBot) {
        throw new Error('Access denied - suspicious behavior detected');
      }

      // Wait for detection to complete
      if (!botInfo.isDetectionComplete) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Execute Turnstile verification
      const turnstileToken = turnstileMode === 'managed' 
        ? token 
        : await executeTurnstile();

      if (!turnstileToken) {
        throw new Error('Please complete the security check');
      }

      // Call the Netlify function with added retry logic
      let response;
      let retries = 0;
      const maxRetries = 2;
      
      while (retries <= maxRetries) {
        try {
          response = await fetch('/.netlify/functions/verify-human', {
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
                mouseMovements: botInfo.mouseMovements,
                timeOnPage: botInfo.timeOnPage,
                firstInteractionTime: botInfo.firstInteractionTime,
              },
              turnstileToken,
            }),
          });
          
          // If successful, break the retry loop
          if (response.ok) break;
          
          // If server error, retry
          if (response.status >= 500) {
            retries++;
            await new Promise(r => setTimeout(r, 1000 * retries));
          } else {
            // Client errors shouldn't be retried
            break;
          }
        } catch (err) {
          // Network errors should be retried
          retries++;
          if (retries > maxRetries) throw err;
          await new Promise(r => setTimeout(r, 1000 * retries));
        }
      }

      // Process the response
      if (!response || !response.ok) {
        const data = response ? await response.json() : { error: 'Network error' };
        throw new Error(data.error || 'Verification failed');
      }
      
      // Success path
      const now = Date.now();
      setVerificationState({
        isVerified: true,
        isLoading: false,
        error: null,
        lastVerified: now,
        buttonClicked: null
      });
      
      onVerificationComplete?.(true);
      return true;
    } catch (error) {
      console.error('Verification failed:', error);
      
      setVerificationState({
        isVerified: false,
        isLoading: false,
        error: error.message,
        lastVerified: null,
        buttonClicked: verificationState.buttonClicked
      });
      
      resetTurnstile();
      onVerificationComplete?.(false, error.message);
      return false;
    }
  };

  const contextValue = {
    ...verificationState,
    verifyHuman,
    setButtonClicked,
    resetVerification: () => {
      setVerificationState({
        isVerified: false,
        isLoading: false,
        error: null,
        lastVerified: null,
        buttonClicked: null
      });
      resetTurnstile();
      sessionStorage.removeItem('botVerification');
    }
  };

  return (
    <BotProtectionContext.Provider value={contextValue}>
      <div className="space-y-4">
        {/* Turnstile container */}
        {!verificationState.isVerified && turnstileMode === 'managed' && (
          <div ref={containerRef} className="turnstile-container my-4" style={{ display: 'none' }} />
        )}
        {!verificationState.isVerified && turnstileMode === 'invisible' && (
          <div ref={containerRef} style={{ display: 'none' }} />
        )}
        
        {/* Error message */}
        {verificationState.error && !verificationState.isLoading && (
          // <div className="text-red-500 p-2 text-sm" role="alert">
          //   {verificationState.error}
          // </div>
          <div className="text-red d-none" role="alert">
            {verificationState.error}
          </div>
        )}
        
        {/* Loading indicator when first verifying */}
        {verificationState.isLoading && !verificationState.isVerified && (
          <div className="text-blue-600 p-2 text-sm">
            Verifying your browser...
          </div>
        )}
        
        {children}
      </div>
    </BotProtectionContext.Provider>
  );
};

// Simplified Protected Link component
export const ProtectedLink = ({ to, children, className = '', onClick }) => {
  const context = useContext(BotProtectionContext);
  const [isNavigating, setIsNavigating] = useState(false);

  if (!context) {
    throw new Error('ProtectedLink must be used within a BotProtectionProvider');
  }

  const { isVerified, isLoading, verifyHuman, buttonClicked, setButtonClicked } = context;

  const handleClick = async (e) => {
    e.preventDefault();
    
    // Execute custom onClick if provided
    if (onClick) {
      onClick(e);
      // If preventDefault() was called in the onClick handler, respect it
      if (e.defaultPrevented) return;
    }
    
    setIsNavigating(true);

    try {
      const verified = await verifyHuman();
      if (verified) {
        navigate(to);
      } else {
        setButtonClicked(to);
        // console.log('buttonClicked', buttonClicked);
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
      {(isNavigating) && !isVerified && (
        <span className="inline-block ml-2 text-gray-600 text-sm">
          Verifying...
        </span>
      )}
    </a>
  );
};

// Status indicator component
export const BotProtectionStatus = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(true);
  const context = useContext(BotProtectionContext);

  if (!context) {
    return null;
  }

  const { isVerified, isLoading, error, resetVerification, buttonClicked } = context;

  if (!isVerified && !isLoading && !error) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 bg-white rounded-lg z-50 ${className}`}>
      {isVerified && (
        <div className="text-green-600 flex items-center d-none">
          <span className="mr-2 text-green-600">✓ geverifieerd</span>
          {/* <button 
            onClick={resetVerification}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Reset
          </button> */}
        </div>
      )}
      {isLoading && (
        <div className="text-blue-600 d-none">Verifiëren...</div>
      )}
      {error && (
        <div className={`popup-overlay ${isOpen ? 'popup-active' : ''}`}>
          <div className="popup-content">
            <span className="popup-close" onClick={() => setIsOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
                <circle cx="15" cy="15" r="14" stroke="black" stroke-width="2"/>
                <path d="M22 9.41L20.59 8L15 13.59L9.41 8L8 9.41L13.59 15L8 20.59L9.41 22L15 16.41L20.59 22L22 20.59L16.41 15L22 9.41Z" fill="black"/>
              </svg>
            </span>
            <div className='verification-error my-4'>
                <ProtectedLink to={buttonClicked} className="custom-btn custom-btn-primary w-100 mb-4">
                Open WhatsApp
                </ProtectedLink>
                {isLoading && (
                  <div className="text-blue-600">Verifiëren...</div>
                )}
                {/*error*/}Gaat er iets mis? Stuur een mailtje naar<br />
                <a href="mailto:service@milieudefensie.nl" target="_blank" rel="noopener">doemee@milieudefensie.nl</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};