import React, { useEffect, useState, useCallback, useMemo, useRef, Suspense, lazy } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const ConfettiExplosion = lazy(() => import('react-confetti-explosion'));
const SignalModal = lazy(() => import('../../Global/SignalModal/signal-modal'));

// Types
interface SignalGroup {
  internalName: string;
  url: string;
}

interface TextLabels {
  header: string;
  input: string;
  search: string;
  shareText: string;
  foundStep1: {
    title: string;
    subtitle: string;
    text: string;
    button: string;
  };
  foundStep2: {
    title: string;
    text: string;
    blockTitle: string;
    shareText: string;
    signalUrl?: string;
    wpUrl?: string;
    extraContent?: {
      text: string;
      button: string;
      url: string;
    };
  };
  notFoundStep1: {
    title: string;
    text: string;
    button: string;
    secondaryButton: string;
  };
  notFoundStep2: {
    text: string;
    bottomText: string;
  };
  notFoundStep3: {
    title: string;
    text: string;
    blockTitle: string;
    shareText: string;
    signalUrl?: string;
    wpUrl?: string;
    extraContent?: {
      text: string;
      button: string;
      url: string;
    };
  };
}

interface TravelTogetherProps {
  slug: string;
  othersSignalGroups: SignalGroup[];
  textLabels: TextLabels;
  icon: 'train' | 'cart';
}

interface State {
  city: string;
  currentCity: string;
  signalLink: string;
  email: string;
  searchMade: boolean;
  signalGroupExists: SignalGroup | null;
  activeStep: number;
  showConfetti: boolean;
  confettiKey: number;
  showSignalPopup: boolean;
  stepsWithConfetti: Set<number>;
}

interface LoadingState {
  initial: boolean;
  search: boolean;
  submit: boolean;
}

interface ErrorState {
  validation: {
    email?: string;
    signalLink?: string;
  };
  submit: string | null;
}

interface LocationState {
  city: string;
  loading: boolean;
  error: Error | null;
}

type ConfettiIntensity = 'subtle' | 'normal' | 'celebration';

// Constants
const CONFETTI_CONFIG: Record<ConfettiIntensity, { force: number; duration: number; count: number; size: number }> = {
  subtle: { force: 0.9, duration: 2000, count: 180, size: 16 },
  normal: { force: 0.9, duration: 2000, count: 180, size: 16 },
  celebration: { force: 0.9, duration: 2000, count: 300, size: 16 },
};

const CONFETTI_COLORS = [
  '#ff6b6b',
  '#4ecdc4',
  '#45b7d1',
  '#96ceb4',
  '#ffeaa7',
  '#dda0dd',
  '#98d8c8',
  '#f9ca24',
  '#6c5ce7',
  '#a29bfe',
  '#fd79a8',
  '#fdcb6e',
  '#00b894',
  '#e17055',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEBOUNCE_DELAY = 300;

// Custom hooks
const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const useGeolocation = (): LocationState => {
  const [location, setLocation] = useState<LocationState>({
    city: 'Utrecht',
    loading: true,
    error: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/', { signal: controller.signal });
        const data = await response.json();
        const city = data.city === 'The Hague' ? 'Den Haag' : data.city;
        setLocation({ city, loading: false, error: null });
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Geolocation error:', error);
          setLocation({ city: 'Utrecht', loading: false, error: error as Error });
        }
      }
    };

    fetchLocation();
    return () => controller.abort();
  }, []);

  return location;
};

// Utility functions
const normalize = (str: string | undefined): string => str?.trim().toLowerCase() || '';

const validateForm = (signalLink: string, email: string): ErrorState['validation'] => {
  const errors: ErrorState['validation'] = {};

  if (!signalLink) errors.signalLink = 'Signal link is verplicht';
  if (!email) errors.email = 'E-mail is verplicht';
  else if (!EMAIL_REGEX.test(email)) errors.email = 'Ongeldig e-mailadres';

  return errors;
};

// Sub-components
const LoadingSpinner: React.FC = () => (
  <div className="loading-spinner" aria-label="Loading">
    <div className="spinner" />
  </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="error-message" role="alert" aria-live="polite">
    {message}
  </div>
);

interface CitySuggestionsProps {
  suggestions: string[];
  onSelect: (city: string) => void;
  show: boolean;
}

const CitySuggestions: React.FC<CitySuggestionsProps> = ({ suggestions, onSelect, show }) => {
  if (!show || suggestions.length === 0) return null;

  return (
    <ul className="city-suggestions" role="listbox">
      {suggestions.map((suggestion, index) => (
        <li
          key={`${suggestion}-${index}`}
          className="city-suggestion-item"
          role="option"
          tabIndex={0}
          onClick={() => onSelect(suggestion)}
          onKeyDown={(e) => e.key === 'Enter' && onSelect(suggestion)}
          onMouseDown={(e) => e.preventDefault()}
        >
          {suggestion}
        </li>
      ))}
    </ul>
  );
};

interface StepHeaderProps {
  stepNumber: number;
  title: string;
  isActive: boolean;
  onClick: () => void;
  isClickable?: boolean;
}

const StepHeader: React.FC<StepHeaderProps> = ({ stepNumber, title, isActive, onClick, isClickable = true }) => (
  <div
    className={`header ${!isClickable ? 'non-clickable' : ''}`}
    onClick={isClickable ? onClick : undefined}
    style={{ cursor: isClickable ? 'pointer' : 'default' }}
    role="button"
    tabIndex={isClickable ? 0 : -1}
    aria-expanded={isActive}
    onKeyDown={(e) => isClickable && e.key === 'Enter' && onClick()}
  >
    <div>
      <span className="step-number">{stepNumber}</span>
    </div>
    <div>
      <span className="step-title">{title}</span>
    </div>
  </div>
);

interface ShareSectionProps {
  shareMessage: string;
  onSignalShare: () => void;
  blockTitle?: string;
}

const ShareSection: React.FC<ShareSectionProps> = ({ shareMessage, onSignalShare, blockTitle }) => {
  const whatsappLink = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;

  return (
    <div className="share-content">
      <div className="share-title">{blockTitle || 'Nodig meer mensen uit:'}</div>
      <div className="share-description">{shareMessage}</div>
      <div className="share-buttons">
        <button onClick={onSignalShare} aria-label="Deel op Signal">
          <SignalIcon />
          Deel op Signal
        </button>
        <a href={whatsappLink} rel="noopener noreferrer" target="_blank" aria-label="Deel op WhatsApp">
          <WPIcon />
          Deel op WhatsApp
        </a>
      </div>
    </div>
  );
};

// Icon Components
const TrainIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="1.5em" height="1.5em" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12 2c-4 0-8 .5-8 4v9.5A3.5 3.5 0 0 0 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19a3.5 3.5 0 0 0 3.5-3.5V6c0-3.5-3.58-4-8-4M7.5 17A1.5 1.5 0 0 1 6 15.5A1.5 1.5 0 0 1 7.5 14A1.5 1.5 0 0 1 9 15.5A1.5 1.5 0 0 1 7.5 17m3.5-7H6V6h5zm2 0V6h5v4zm3.5 7a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5"
    />
  </svg>
);

const ShoppingCartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="8" cy="21" r="1" />
    <circle cx="19" cy="21" r="1" />
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
  </svg>
);

const WPIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="1.5em" height="1.5em" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23c-1.48 0-2.93-.39-4.19-1.15l-.3-.17l-3.12.82l.83-3.04l-.2-.32a8.2 8.2 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31c-.22.25-.87.86-.87 2.07c0 1.22.89 2.39 1 2.56c.14.17 1.76 2.67 4.25 3.73c.59.27 1.05.42 1.41.53c.59.19 1.13.16 1.56.1c.48-.07 1.46-.6 1.67-1.18s.21-1.07.15-1.18c-.07-.1-.23-.16-.48-.27c-.25-.14-1.47-.74-1.69-.82c-.23-.08-.37-.12-.56.12c-.16.25-.64.81-.78.97c-.15.17-.29.19-.53.07c-.26-.13-1.06-.39-2-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.12-.24-.01-.39.11-.5c.11-.11.27-.29.37-.44c.13-.14.17-.25.25-.41c.08-.17.04-.31-.02-.43c-.06-.11-.56-1.35-.77-1.84c-.2-.48-.4-.42-.56-.43c-.14 0-.3-.01-.47-.01"
    />
  </svg>
);

const SignalIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="1.5em" height="1.5em" aria-hidden="true">
    <path fill="currentColor" d="m21 12l-7-7v4C7 10 4 15 3 20c2.5-3.5 6-5.1 11-5.1V19z" />
  </svg>
);

// Main component
const TravelTogether: React.FC<TravelTogetherProps> = ({ slug, othersSignalGroups = [], textLabels, icon }) => {
  const [state, setState] = useState<State>({
    city: 'Utrecht',
    currentCity: 'Utrecht',
    signalLink: '',
    email: '',
    searchMade: false,
    signalGroupExists: null,
    activeStep: 1,
    showConfetti: false,
    confettiKey: 0,
    showSignalPopup: false,
    stepsWithConfetti: new Set(), // Iniciar vacío para permitir confetti en el primer paso
  });

  const [loading, setLoading] = useState<LoadingState>({
    initial: true,
    search: false,
    submit: false,
  });

  const [errors, setErrors] = useState<ErrorState>({
    validation: {},
    submit: null,
  });

  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const confettiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { city: geoCity, loading: geoLoading } = useGeolocation();
  const debouncedCity = useDebounce(state.currentCity, DEBOUNCE_DELAY);

  const windowDimensions = useMemo(
    () => ({
      width: typeof window !== 'undefined' ? window.innerWidth : 2520,
      height: typeof window !== 'undefined' ? window.innerHeight : 1880,
    }),
    []
  );

  useEffect(() => {
    if (!geoLoading && geoCity) {
      // Set city without triggering suggestions
      setState((prev) => ({ ...prev, currentCity: geoCity }));
      handleSearchSignalGroup(geoCity, true); // Pasar true para indicar que es carga inicial
      setLoading((prev) => ({ ...prev, initial: false }));
    }
  }, [geoCity, geoLoading]);

  useEffect(() => {
    // Only show suggestions if user is actively typing
    if (isUserTyping && debouncedCity.length > 1 && othersSignalGroups && othersSignalGroups.length > 0) {
      const filtered = othersSignalGroups
        .filter((group: SignalGroup) => {
          const normalizedCity = normalize(debouncedCity);
          const normalizedGroupName = normalize(group.internalName);
          return normalizedGroupName.includes(normalizedCity);
        })
        .map((g: SignalGroup) => g.internalName)
        .slice(0, 5); // Limit suggestions to 5

      setCitySuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setCitySuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedCity, othersSignalGroups, isUserTyping]);

  useEffect(() => {
    return () => {
      if (confettiTimeoutRef.current) {
        clearTimeout(confettiTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchSignalGroup = useCallback(
    async (cityName?: string, isInitialLoad = false) => {
      try {
        setLoading((prev) => ({ ...prev, search: true }));
        const cityToSearch = normalize(cityName || state.currentCity);

        const searchResult = othersSignalGroups.find((group: SignalGroup) => {
          const normalizedGroupName = normalize(group.internalName);
          return normalizedGroupName === cityToSearch || normalizedGroupName.includes(cityToSearch);
        });

        setState((prev) => ({
          ...prev,
          city: cityToSearch,
          signalGroupExists: searchResult || null,
          activeStep: 1,
          searchMade: true,
          // Solo resetear en búsquedas manuales, no en carga inicial
          stepsWithConfetti: !isInitialLoad && cityName ? new Set() : prev.stepsWithConfetti,
        }));
      } catch (error) {
        console.error('Search error:', error);
        setState((prev) => ({ ...prev, signalGroupExists: null }));
      } finally {
        setLoading((prev) => ({ ...prev, search: false }));
      }
    },
    [state.currentCity, othersSignalGroups]
  );

  const handleSubmitNewGroup = useCallback(async () => {
    const validationErrors = validateForm(state.signalLink, state.email);
    if (Object.keys(validationErrors).length > 0) {
      setErrors((prev) => ({ ...prev, validation: validationErrors }));
      return;
    }

    setErrors({ validation: {}, submit: null });
    setLoading((prev) => ({ ...prev, submit: true }));

    try {
      const response = await fetch('/api/create-signal-group', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: state.city,
          url: state.signalLink,
          email: state.email,
          eventSlug: slug,
        }),
      });

      if (!response.ok) throw new Error('Failed to create group');

      changeStep(3, true);
    } catch (error) {
      console.error('Submit error:', error);
      setErrors((prev) => ({
        ...prev,
        submit: 'Er is een fout opgetreden bij het aanmaken van de groep. Probeer het opnieuw.',
      }));
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  }, [state.signalLink, state.email, state.city, slug]);

  const triggerConfetti = useCallback((intensity: ConfettiIntensity = 'normal') => {
    // Limpiar cualquier timeout anterior
    if (confettiTimeoutRef.current) {
      clearTimeout(confettiTimeoutRef.current);
      confettiTimeoutRef.current = null;
    }

    setState((prev) => ({
      ...prev,
      showConfetti: true,
      confettiKey: prev.confettiKey + 1,
    }));

    const config = CONFETTI_CONFIG[intensity] || CONFETTI_CONFIG.normal;
    confettiTimeoutRef.current = setTimeout(() => {
      setState((prev) => ({ ...prev, showConfetti: false }));
    }, config.duration);
  }, []);

  const changeStep = useCallback(
    (newStep: number, forceConfetti = false) => {
      setState((prev) => {
        const hasNotShownConfetti = !prev.stepsWithConfetti.has(newStep);
        const isGoingForward = newStep > prev.activeStep; // Solo verificar si vamos hacia adelante

        // Solo mostrar confetti si:
        // 1. No se ha mostrado antes para este paso Y
        // 2. Se fuerza con forceConfetti Y
        // 3. Estamos yendo hacia adelante (paso actual < paso nuevo)
        const shouldShowConfetti = hasNotShownConfetti && forceConfetti && isGoingForward;

        if (shouldShowConfetti) {
          triggerConfetti(newStep === 3 ? 'celebration' : 'normal');
        }

        return {
          ...prev,
          activeStep: newStep,
          stepsWithConfetti: shouldShowConfetti
            ? new Set([...prev.stepsWithConfetti, newStep])
            : prev.stepsWithConfetti,
        };
      });
    },
    [triggerConfetti]
  );

  const handleSignalShare = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(textLabels.shareText);
      setState((prev) => ({ ...prev, showSignalPopup: true }));
    } catch (err) {
      console.error('Copy error:', err);
      // Fallback: show manual copy modal
      setState((prev) => ({ ...prev, showSignalPopup: true }));
    }
  }, [textLabels.shareText]);

  const handleCitySelect = useCallback(
    (city: string) => {
      setState((prev) => ({ ...prev, currentCity: city }));
      setCitySuggestions([]);
      setShowSuggestions(false);
      setIsUserTyping(false); // Stop showing suggestions after selection
      handleSearchSignalGroup(city);
    },
    [handleSearchSignalGroup]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setState((prev) => ({ ...prev, currentCity: value }));
      setIsUserTyping(true); // Mark that user is typing

      // Immediately show suggestions if we have matching cities
      if (value.length > 1 && othersSignalGroups && othersSignalGroups.length > 0) {
        const filtered = othersSignalGroups
          .filter((group: SignalGroup) => {
            const normalizedValue = normalize(value);
            const normalizedGroupName = normalize(group.internalName);
            return normalizedGroupName.includes(normalizedValue);
          })
          .map((g: SignalGroup) => g.internalName)
          .slice(0, 5);

        setCitySuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setCitySuggestions([]);
        setShowSuggestions(false);
      }
    },
    [othersSignalGroups]
  );

  // Render loading state
  if (loading.initial) {
    return (
      <div className="travel-together-container">
        <LoadingSpinner />
      </div>
    );
  }

  // Main render
  return (
    <div id="travel-together" className="travel-together-container">
      <div className="travel-header">
        {icon === 'train' ? <TrainIcon /> : <ShoppingCartIcon />}
        <h3>
          {textLabels.header} {state.city}
        </h3>
      </div>

      {/* Search Form */}
      <div className="travel-input">
        <label style={{ position: 'relative' }}>
          <span>{textLabels.input}</span>
          <input
            ref={searchInputRef}
            placeholder={`${textLabels.input}...`}
            name="city"
            required
            autoComplete="off"
            value={state.currentCity}
            onChange={handleInputChange}
            onFocus={() => {
              // Only show suggestions if user has typed and there are suggestions
              if (isUserTyping && citySuggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onBlur={() => {
              // Delay to allow click on suggestion
              setTimeout(() => {
                setShowSuggestions(false);
                setIsUserTyping(false);
              }, 200);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchSignalGroup(state.currentCity);
                setShowSuggestions(false);
                setIsUserTyping(false);
              }
            }}
            aria-label={textLabels.input}
            aria-autocomplete="list"
            aria-controls="city-suggestions"
          />
          <CitySuggestions suggestions={citySuggestions} show={showSuggestions} onSelect={handleCitySelect} />
          <div className="validator-hint">
            <span>Vul je woonplaats in</span>
          </div>
        </label>
        <button
          type="button"
          onClick={() => {
            handleSearchSignalGroup(state.currentCity);
            setShowSuggestions(false);
            setIsUserTyping(false);
          }}
          disabled={loading.search}
          aria-busy={loading.search}
        >
          {loading.search ? 'Zoeken...' : textLabels.search}
        </button>
      </div>

      {/* Results */}
      {state.searchMade && (
        <>
          {!state.signalGroupExists ? (
            // City not found flow
            <div className="travel-steps no-exist-group">
              {/* Step 1 */}
              <div className={`step ${state.activeStep === 1 ? 'active' : ''}`}>
                <StepHeader
                  stepNumber={1}
                  title={textLabels.notFoundStep1.title}
                  isActive={state.activeStep === 1}
                  onClick={() => changeStep(1, true)}
                />
                <div className="content">
                  <div>
                    <p>
                      Start een{' '}
                      <a href="https://signal.me/#eu" rel="noopener noreferrer" target="_blank">
                        {textLabels.notFoundStep1.button}
                      </a>{' '}
                      (werkt hetzelfde als WhatsApp). Voeg een paar mensen toe die je wilt uitnodigen.
                    </p>
                    <button onClick={() => changeStep(2, true)}>{textLabels.notFoundStep1.secondaryButton}</button>
                    <p className="help-text">
                      <span>
                        Kom je er niet uit? Stuur een e-mail naar{' '}
                        <a href="mailto:doemee@milieudefensie.nl" className="email-link">
                          doemee@milieudefensie.nl
                        </a>
                      </span>
                    </p>
                  </div>
                  <img
                    src="https://www.datocms-assets.com/115430/1755526086-signal-explainer-travel-together-1.webp"
                    alt="Signal groep aanmaken uitleg"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Step 2 */}
              <div className={`step ${state.activeStep === 2 ? 'active' : ''}`}>
                <StepHeader
                  stepNumber={2}
                  title="Deel de uitnodigingslink met ons"
                  isActive={state.activeStep === 2}
                  onClick={() => changeStep(2, true)}
                />
                <div className="content">
                  <div>
                    <p
                      dangerouslySetInnerHTML={{ __html: textLabels.notFoundStep2.text?.replace('[city]', state.city) }}
                    >
                      {/* <strong>Kopieer de uitnodigingslink van je Signal-groep.</strong> Plak deze hieronder. Wij nodigen
                      andere veranderaars uit {state.city} en omgeving uit om samen te reizen. */}
                    </p>
                    <div className="form-container">
                      <label className="floating-label">
                        <span>Uitnodigingslink groep chat</span>
                        <input
                          placeholder="https://signal.group/..."
                          autoComplete="url"
                          type="url"
                          value={state.signalLink}
                          onChange={(e) => setState((prev) => ({ ...prev, signalLink: e.target.value }))}
                          style={{ borderColor: errors.validation.signalLink ? 'red' : undefined }}
                          aria-invalid={!!errors.validation.signalLink}
                          aria-describedby={errors.validation.signalLink ? 'signal-error' : undefined}
                        />
                        {errors.validation.signalLink && (
                          <div id="signal-error" className="field-error">
                            {errors.validation.signalLink}
                          </div>
                        )}
                      </label>

                      <label className="floating-label">
                        <span>E-mail</span>
                        <input
                          placeholder="E-mail"
                          autoComplete="email"
                          type="email"
                          value={state.email}
                          onChange={(e) => setState((prev) => ({ ...prev, email: e.target.value }))}
                          style={{ borderColor: errors.validation.email ? 'red' : undefined }}
                          aria-invalid={!!errors.validation.email}
                          aria-describedby={errors.validation.email ? 'email-error' : undefined}
                        />
                        {errors.validation.email && (
                          <div id="email-error" className="field-error">
                            {errors.validation.email}
                          </div>
                        )}
                      </label>

                      <button
                        className="full"
                        disabled={loading.submit}
                        type="button"
                        onClick={handleSubmitNewGroup}
                        aria-busy={loading.submit}
                      >
                        {loading.submit ? 'Verwerken...' : '👉 Publiceer link'}
                      </button>

                      {errors.submit && <ErrorMessage message={errors.submit} />}
                    </div>

                    <div className="help-text">
                      Lukt het niet? Stuur een e-mail naar{' '}
                      <a href="mailto:doemee@milieudefensie.nl" className="email-link">
                        doemee@milieudefensie.nl
                      </a>
                    </div>

                    <p className="extra-text">
                      {textLabels.notFoundStep2.bottomText}
                      {/* Wij controleren de link en delen deze openbaar op deze website, zodat iedereen zich makkelijk kan
                      aanmelden om samen te reizen. Je e-mail adres blijft prive. We sturen je eenmalig wat tips om je
                      te helpen met je samenreisevenement. */}
                    </p>
                  </div>
                  <img
                    src="https://www.datocms-assets.com/115430/1755526086-signal-explainer-travel-together-1.webp"
                    alt="Signal uitnodigingslink delen"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Step 3 */}
              <div className={`step ${state.activeStep === 3 ? 'active' : ''}`}>
                <StepHeader
                  stepNumber={3}
                  // title="Stem af hoe je samen reist"
                  title={textLabels.notFoundStep3.title}
                  isActive={state.activeStep === 3}
                  onClick={() => changeStep(3, true)}
                />
                <div className="extra-content">
                  <p dangerouslySetInnerHTML={{ __html: textLabels.notFoundStep3.text }}>
                    {/* {textLabels.notFoundStep3.text} */}
                  </p>

                  <ShareSection
                    shareMessage={textLabels.notFoundStep3.shareText?.replace('[city]', state.city)}
                    onSignalShare={handleSignalShare}
                    blockTitle={textLabels.notFoundStep3.blockTitle}
                  />

                  {textLabels.notFoundStep3.extraContent && (
                    <div className="share-extra-content">
                      <p dangerouslySetInnerHTML={{ __html: textLabels.notFoundStep3.extraContent.text }}>
                        {/* {textLabels.notFoundStep3.extraContent.text} */}
                      </p>
                      <a href={textLabels.notFoundStep3.extraContent.url}>
                        {textLabels.notFoundStep3.extraContent.button}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // City found flow
            <div className="travel-steps exist-group">
              {/* Step 1 */}
              <div className={`step ${state.activeStep === 1 ? 'active' : ''}`}>
                <StepHeader
                  stepNumber={1}
                  title={textLabels.foundStep1.title}
                  isActive={state.activeStep === 1}
                  onClick={() => changeStep(1, true)}
                />
                <div className="content first">
                  <div className="wrapper-steps">
                    <div className="image-wrapper-steps">
                      <QRCodeSVG
                        className="signal-qr"
                        value={state.signalGroupExists.url}
                        size={300}
                        imageSettings={{
                          src: '/signal-icon3.svg',
                          x: undefined,
                          y: undefined,
                          height: 60,
                          width: 60,
                          opacity: 1,
                          excavate: true,
                        }}
                        bgColor="#F5F5F5"
                      />
                    </div>
                    <div className="info-wrapper-steps">
                      <div>
                        <h2>{textLabels.foundStep1.title}</h2>
                        <div className="label">
                          {textLabels.foundStep1.subtitle} {state.city}
                        </div>
                        <div className="info">{textLabels.foundStep1.text.replace('[city]', state.city)}</div>
                      </div>
                      <div>
                        <a
                          className="signal-group-link"
                          href={state.signalGroupExists.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {textLabels.foundStep1.button}
                        </a>
                      </div>
                    </div>
                  </div>
                  <p className="help-text">
                    Kom je er niet uit? Stuur een e-mail naar{' '}
                    <a href="mailto:doemee@milieudefensie.nl" className="email-link">
                      doemee@milieudefensie.nl
                    </a>
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className={`step ${state.activeStep === 2 ? 'active' : ''}`}>
                <StepHeader
                  stepNumber={2}
                  title={textLabels.foundStep2.title}
                  isActive={state.activeStep === 2}
                  onClick={() => changeStep(2, true)}
                />
                <div className="extra-content">
                  <p dangerouslySetInnerHTML={{ __html: textLabels.foundStep2.text }}>
                    {/* {textLabels.foundStep2.text} */}
                  </p>

                  <ShareSection
                    shareMessage={textLabels.foundStep2.shareText?.replace('[city]', state.city)}
                    onSignalShare={handleSignalShare}
                    blockTitle={textLabels.foundStep2.blockTitle}
                  />

                  {textLabels.foundStep2.extraContent && (
                    <div className="share-extra-content">
                      <p dangerouslySetInnerHTML={{ __html: textLabels.foundStep2.extraContent.text }}>
                        {/* {textLabels.foundStep2.extraContent.text} */}
                      </p>
                      <a href={textLabels.foundStep2.extraContent.url}>{textLabels.foundStep2.extraContent.button}</a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Confetti */}
      {state.showConfetti && (
        <Suspense fallback={null}>
          <div className="confetti-container">
            <div className="confetti-wrapper">
              <ConfettiExplosion
                key={state.confettiKey}
                force={CONFETTI_CONFIG[state.activeStep === 3 ? 'celebration' : 'normal'].force}
                duration={CONFETTI_CONFIG[state.activeStep === 3 ? 'celebration' : 'normal'].duration}
                particleCount={CONFETTI_CONFIG[state.activeStep === 3 ? 'celebration' : 'normal'].count}
                width={windowDimensions.width}
                height={windowDimensions.height}
                colors={CONFETTI_COLORS}
                particleSize={CONFETTI_CONFIG[state.activeStep === 3 ? 'celebration' : 'normal'].size}
                onComplete={() => setState((prev) => ({ ...prev, showConfetti: false }))}
              />
            </div>
          </div>
        </Suspense>
      )}

      {/* Signal Modal */}
      <Suspense fallback={null}>
        <SignalModal
          isOpen={state.showSignalPopup}
          onClose={() => setState((prev) => ({ ...prev, showSignalPopup: false }))}
          defaultMessage={textLabels.shareText?.replace('[city]', state.city)}
        />
      </Suspense>
    </div>
  );
};

export default TravelTogether;
