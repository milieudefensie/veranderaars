import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import SignalModal from '../../Global/SignalModal/signal-modal';

type Props = {
  slug: string;
  shareWpText: string;
  othersSignalGroups: any[];
  isCSLEvent?: boolean;
};

export default function TravelTogether({ slug, othersSignalGroups, shareWpText, isCSLEvent = true }: Props) {
  const [city, setCity] = useState('Utrecht');
  const [currentCity, setCurrentCity] = useState('Utrecht');
  const [signalLink, setSignalLink] = useState('');
  const [email, setEmail] = useState('');
  const [searchMade, setSearchMade] = useState(false);
  const [signalGroupExists, setSignalGroupExists] = useState<{
    internalName: string;
    url: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; signalLink?: string }>({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeStepTravelTogether, setActiveStepTravelTogether] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 2520,
    height: 1880,
  });
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [travelShowSignalPopup, setTravelShowSignalPopup] = useState(false);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then((res) => res.json())
      .then((data) => {
        handleSearchSignalGroup(data.city);
        setCurrentCity(data.city);
      })
      .catch((err) => {
        console.error(err);
        handleSearchSignalGroup('Utrecht');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const submitNewSignalGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationErrors({});
    setSubmitError(null);

    const errors: { email?: string; signalLink?: string } = {};

    if (!signalLink) {
      errors.signalLink = 'Signal link is verplicht';
    }

    if (!email) {
      errors.email = 'E-mail is verplicht';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Ongeldig e-mailadres';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      setLoadingSubmit(true);
      await axios.post('/api/create-signal-group', {
        name: city,
        url: signalLink,
        email,
        eventSlug: slug,
      });
      setActiveStepTravelTogether(3);
      triggerConfetti('celebration');
    } catch (error: any) {
      console.error('Error creating signal group:', error);
      setSubmitError('Er is een fout opgetreden bij het aanmaken van de groep. Probeer het opnieuw.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleSearchSignalGroup = async (newCity: string | undefined) => {
    try {
      setLoadingSearch(true);
      setCity(newCity ? newCity : currentCity);
      const searchRelatedGroups = othersSignalGroups?.find(
        (group: any) => group.internalName.toLowerCase() === (newCity || currentCity).toLowerCase()
      );

      setSignalGroupExists(searchRelatedGroups ? searchRelatedGroups : null);
      setActiveStepTravelTogether(1);
      setSearchMade(true);
    } catch (error) {
      console.error('Error searching signal group:', error);
      setSignalGroupExists(null);
    } finally {
      setLoadingSearch(false);
    }
  };

  const triggerConfetti = (intensity = 'normal') => {
    setShowConfetti(true);
    setConfettiKey((prev) => prev + 1);

    const duration = intensity === 'celebration' ? 4000 : intensity === 'subtle' ? 2000 : 3000;
    setTimeout(() => {
      setShowConfetti(false);
    }, duration);
  };

  const handleSignalShare = async () => {
    try {
      await navigator.clipboard.writeText(travelShareSignalMessageUpdated);
      setTravelShowSignalPopup(true);
    } catch (err) {
      console.error('Err', err);
    }
  };

  if (isLoading) return null;

  const travelShareSignalMessageUpdated = `Ik ga hier samen met een paar andere mensen heen. Wie reist er nog meer met mij mee vanuit ${city}? ${
    typeof window !== 'undefined'
      ? `${window.location.origin}/${isCSLEvent ? 'lokaal' : 'agenda'}/${slug}#travel-together`
      : `/${isCSLEvent ? 'lokaal' : 'agenda'}/${slug}#travel-together`
  }`;

  return (
    <div id="travel-together" className="travel-together-container">
      <div className="travel-header">
        <svg viewBox="0 0 24 24" width="1.5em" height="1.5em">
          <path
            fill="currentColor"
            d="M12 2c-4 0-8 .5-8 4v9.5A3.5 3.5 0 0 0 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19a3.5 3.5 0 0 0 3.5-3.5V6c0-3.5-3.58-4-8-4M7.5 17A1.5 1.5 0 0 1 6 15.5A1.5 1.5 0 0 1 7.5 14A1.5 1.5 0 0 1 9 15.5A1.5 1.5 0 0 1 7.5 17m3.5-7H6V6h5zm2 0V6h5v4zm3.5 7a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5"
          ></path>
        </svg>
        <h3>Reis samen vanuit {city}</h3>
      </div>
      <div>
        <form
          className="travel-input"
          onSubmit={(e) => {
            e.preventDefault();
            handleSearchSignalGroup(currentCity);
          }}
        >
          <label>
            <span>Ik reis vanuit</span>
            <input
              placeholder="Ik reis vanuit..."
              name="city"
              required
              autoComplete="off"
              value={currentCity}
              onChange={(e) => {
                const value = e.target.value;
                setCurrentCity(value);

                if (value.length > 1 && othersSignalGroups) {
                  const filtered = othersSignalGroups
                    .map((g: any) => g.internalName)
                    .filter((c: string) => c.toLowerCase().includes(value.toLowerCase()));
                  setCitySuggestions(filtered);
                  setShowSuggestions(true);
                } else {
                  setCitySuggestions([]);
                  setShowSuggestions(false);
                }
              }}
              onFocus={() => {
                if (currentCity.length > 1 && citySuggestions.length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowSuggestions(false), 150);
              }}
            />
            {showSuggestions && citySuggestions.length > 0 && (
              <ul className="city-suggestions">
                {citySuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="city-suggestion-item"
                    onClick={() => {
                      setCurrentCity(suggestion);
                      setCitySuggestions([]);
                      setShowSuggestions(false);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
            <div className="validator-hint">
              <span>Vul je woonplaats in</span>
            </div>
          </label>
          <button onClick={() => handleSearchSignalGroup(currentCity)} disabled={loadingSearch} type="submit">
            {loadingSearch ? 'Zoeken...' : 'Plan reis'}
          </button>
        </form>
      </div>

      {searchMade && (
        <>
          <div className="travel-steps no-exist-group" style={{ display: !signalGroupExists ? 'block' : 'none' }}>
            <div className={`step ${activeStepTravelTogether === 1 ? 'active' : ''}`}>
              <div
                className="header"
                onClick={() => {
                  setActiveStepTravelTogether(1);
                  // triggerConfetti('subtle');
                }}
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <span className="step-number">1</span>
                </div>
                <div>
                  <span className="step-title">Maak een chat groep</span>
                </div>
              </div>
              <div className="content">
                <div>
                  <p>
                    Maak een{' '}
                    <a href="https://signal.me/#eu" rel="noopener noreferrer" target="_blank">
                      Signal
                    </a>{' '}
                    chat groep (Signal werkt net als WhatsApp). Voeg alvast een paar mensen toe die je wil uitnodigen
                  </p>
                  <button
                    onClick={() => {
                      setActiveStepTravelTogether(2);
                      triggerConfetti('subtle');
                    }}
                  >
                    ✅ Ik heb een groep chat aangemaakt
                  </button>
                  <p className="help-text">
                    <span>Kom je er niet uit? Stuur een e-mail naar doemee@milieudefensie.nl </span>
                  </p>
                </div>
                <img src="https://www.datocms-assets.com/115430/1755526086-signal-explainer-travel-together-1.webp" />
              </div>
            </div>
            <div className={`step ${activeStepTravelTogether === 2 ? 'active' : ''}`}>
              <div
                className="header"
                onClick={() => {
                  setActiveStepTravelTogether(2);
                  // triggerConfetti('subtle');
                }}
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <span className="step-number">2</span>
                </div>
                <div>
                  <span className="step-title">Deel de uitnodigingslink met ons</span>
                </div>
              </div>
              <div className="content">
                <div>
                  <div>
                    <p>
                      <strong>Kopieer de uitnodigingslink van jou groep chat in Signal. Plak deze hieronder.</strong>{' '}
                      Wij nodigen vervolgens veranderaars in Utrecht uit om met jou samen te reizen.
                    </p>
                    <form onSubmit={submitNewSignalGroup}>
                      <label className="floating-label">
                        <span>Uitnodigingslink groep chat</span>
                        <input
                          placeholder="https://invite-link..."
                          autoComplete="url"
                          type="url"
                          value={signalLink}
                          onChange={(e) => setSignalLink(e.target.value)}
                          style={{
                            borderColor: validationErrors.signalLink ? 'red' : undefined,
                          }}
                        />
                        {validationErrors.signalLink && (
                          <div style={{ color: 'red', fontSize: '12px', marginTop: '.25rem' }}>
                            {validationErrors.signalLink}
                          </div>
                        )}
                      </label>
                      <label className="floating-label">
                        <span>E-mail</span>
                        <input
                          placeholder="E-mail"
                          autoComplete="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          style={{
                            borderColor: validationErrors.email ? 'red' : undefined,
                          }}
                        />
                        {validationErrors.email && (
                          <div style={{ color: 'red', fontSize: '12px', marginTop: '.25rem' }}>
                            {validationErrors.email}
                          </div>
                        )}
                      </label>
                      <button className="full" disabled={loadingSubmit} type="submit">
                        {loadingSubmit ? 'Verwerken...' : '👉 Publiceer link'}
                      </button>
                      {submitError && (
                        <div
                          className="submit-error"
                          style={{ color: 'red', marginTop: '0.3rem', fontSize: '15px', marginBlock: '1rem' }}
                        >
                          {submitError}
                        </div>
                      )}
                    </form>
                    <div className="help-text">
                      Kom je er niet uit? Stuur de uitnodiginslink naar doemee@milieudefensie.nl
                    </div>
                    <p className="extra-text">
                      Wij controleren de link en delen deze openbaar op deze website, zodat iedereen zich makkelijk kan
                      aanmelden om samen te reizen. Je e-mail adres blijft prive. We sturen je eenmalig wat tips om je
                      te helpen met je samenreisevenement.
                    </p>
                  </div>
                </div>
                <img src="https://www.datocms-assets.com/115430/1755526086-signal-explainer-travel-together-1.webp" />
              </div>
            </div>
            <div className={`step ${activeStepTravelTogether === 3 ? 'active' : ''}`}>
              <div
                className="header"
                onClick={() => {
                  setActiveStepTravelTogether(3);
                  // triggerConfetti('subtle');
                }}
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <span className="step-number">3</span>
                </div>
                <div>
                  <span className="step-title">Stem af hoe je samen reist</span>
                </div>
              </div>
              <div className="extra-content">
                <p>
                  Stem met elkaar af hoe je samen reist. Voeg aan de beschrijving van de groep bijvoorbeeld toe welke
                  trein je neemt, of deel een auto. 🚂
                </p>
                <p>
                  Je kent elkaar misschien nog niet. Stel jezelf voor en verwelkom nieuwe mensen. Je kan ook van tevoren
                  bij iemand thuis samen wat eten en protestborden verven om elkaar te leren kennen. 🍕🪧
                </p>
                <div className="share-content">
                  <div className="share-title">Nodig meer mensen uit:</div>
                  <div className="share-description">
                    Ik ga hier samen met een paar andere mensen heen. Wie reist er nog meer met mij mee vanuit {city}?
                    <br />
                    <br />{' '}
                    {typeof window !== 'undefined'
                      ? `${window.location.origin}/${isCSLEvent ? 'lokaal' : 'agenda'}/${slug}#travel-together`
                      : `/${isCSLEvent ? 'lokaal' : 'agenda'}/${slug}#travel-together`}
                  </div>
                  <div className="share-buttons">
                    <button onClick={handleSignalShare}>
                      <svg viewBox="0 0 24 24" width="1.5em" height="1.5em">
                        <path fill="currentColor" d="m21 12l-7-7v4C7 10 4 15 3 20c2.5-3.5 6-5.1 11-5.1V19z"></path>
                      </svg>
                      Deel op Signal
                    </button>
                    <a href={shareWpText} rel="noopener noreferrer" target="_blank">
                      <svg viewBox="0 0 24 24" width="1.5em" height="1.5em">
                        <path
                          fill="currentColor"
                          d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23c-1.48 0-2.93-.39-4.19-1.15l-.3-.17l-3.12.82l.83-3.04l-.2-.32a8.2 8.2 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31c-.22.25-.87.86-.87 2.07c0 1.22.89 2.39 1 2.56c.14.17 1.76 2.67 4.25 3.73c.59.27 1.05.42 1.41.53c.59.19 1.13.16 1.56.1c.48-.07 1.46-.6 1.67-1.18s.21-1.07.15-1.18c-.07-.1-.23-.16-.48-.27c-.25-.14-1.47-.74-1.69-.82c-.23-.08-.37-.12-.56.12c-.16.25-.64.81-.78.97c-.15.17-.29.19-.53.07c-.26-.13-1.06-.39-2-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.12-.24-.01-.39.11-.5c.11-.11.27-.29.37-.44c.13-.14.17-.25.25-.41c.08-.17.04-.31-.02-.43c-.06-.11-.56-1.35-.77-1.84c-.2-.48-.4-.42-.56-.43c-.14 0-.3-.01-.47-.01"
                        ></path>
                      </svg>
                      Deel op WhatsApp
                    </a>
                  </div>
                </div>
                <div className="share-extra-content">
                  <p>
                    Vergeet niet om je aan te melden voor dit evenement <br /> zodat je op de hoogte blijft van
                    belangrijke updates:
                  </p>
                  <a href="#event-information">👉 Meld je aan voor evenement</a>
                </div>
              </div>
            </div>
          </div>
          <div className="travel-steps exist-group" style={{ display: signalGroupExists ? 'block' : 'none' }}>
            <div className={`step ${activeStepTravelTogether === 1 ? 'active' : ''}`}>
              <div
                className="header"
                onClick={() => {
                  setActiveStepTravelTogether(1);
                  triggerConfetti('subtle');
                }}
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <span className="step-number">1</span>
                </div>
                <div>
                  <span className="step-title">Ga in de chat groep</span>
                </div>
              </div>
              <div className="content first">
                <div className="wrapper-steps">
                  <div className="image-wrapper-steps">
                    <QRCodeSVG
                      className="signal-qr"
                      value={signalGroupExists?.url!}
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
                      <div> </div>
                      <h2>Ga in de chat groep</h2>
                      <div className="label">Reis samen vanuit {city}</div>
                      <div className="info">
                        Een veranderaar uit {city} heeft een Signal chat groep aangemaakt. In deze chat spreken jullie
                        samen af hoe jullie gaan reizen.
                      </div>
                    </div>
                    <div>
                      <a
                        className="signal-group-link"
                        href={signalGroupExists?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        💬 Open de Signal groep
                      </a>
                    </div>
                  </div>
                </div>
                <p className="help-text">Kom je er niet uit? Stuur een e-mail naar doemee@milieudefensie.nl </p>
              </div>
            </div>
            <div className={`step ${activeStepTravelTogether === 2 ? 'active' : ''}`}>
              <div
                className="header"
                onClick={() => {
                  setActiveStepTravelTogether(2);
                  triggerConfetti('subtle');
                }}
                style={{ cursor: 'pointer' }}
              >
                <div>
                  <span className="step-number">2</span>
                </div>
                <div>
                  <span className="step-title">Nodig anderen uit en reis samen</span>
                </div>
              </div>
              <div className="extra-content">
                <p>
                  Stem met elkaar af hoe je samen reist. Voeg aan de beschrijving van de groep bijvoorbeeld toe welke
                  trein je neemt, of deel een auto. 🚂
                </p>
                <p>
                  Je kent elkaar misschien nog niet. Stel jezelf voor en verwelkom nieuwe mensen. Je kan ook van tevoren
                  bij iemand thuis samen wat eten en protestborden verven om elkaar te leren kennen. 🍕🪧
                </p>
                <div className="share-content">
                  <div className="share-title">Nodig meer mensen uit:</div>
                  <div className="share-description">
                    Ik ga hier samen met een paar andere mensen heen. Wie reist er nog meer met mij mee vanuit {city}?
                    <br />
                    <br />
                    {typeof window !== 'undefined'
                      ? `${window.location.origin}/${isCSLEvent ? 'lokaal' : 'agenda'}/${slug}#travel-together`
                      : `/${isCSLEvent ? 'lokaal' : 'agenda'}/${slug}#travel-together`}
                  </div>
                  <div className="share-buttons">
                    <button onClick={handleSignalShare}>
                      <svg viewBox="0 0 24 24" width="1.5em" height="1.5em">
                        <path fill="currentColor" d="m21 12l-7-7v4C7 10 4 15 3 20c2.5-3.5 6-5.1 11-5.1V19z"></path>
                      </svg>
                      Deel op Signal
                    </button>
                    <a href={shareWpText} rel="noopener noreferrer" target="_blank">
                      <svg viewBox="0 0 24 24" width="1.5em" height="1.5em">
                        <path
                          fill="currentColor"
                          d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23c-1.48 0-2.93-.39-4.19-1.15l-.3-.17l-3.12.82l.83-3.04l-.2-.32a8.2 8.2 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31c-.22.25-.87.86-.87 2.07c0 1.22.89 2.39 1 2.56c.14.17 1.76 2.67 4.25 3.73c.59.27 1.05.42 1.41.53c.59.19 1.13.16 1.56.1c.48-.07 1.46-.6 1.67-1.18s.21-1.07.15-1.18c-.07-.1-.23-.16-.48-.27c-.25-.14-1.47-.74-1.69-.82c-.23-.08-.37-.12-.56.12c-.16.25-.64.81-.78.97c-.15.17-.29.19-.53.07c-.26-.13-1.06-.39-2-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.12-.24-.01-.39.11-.5c.11-.11.27-.29.37-.44c.13-.14.17-.25.25-.41c.08-.17.04-.31-.02-.43c-.06-.11-.56-1.35-.77-1.84c-.2-.48-.4-.42-.56-.43c-.14 0-.3-.01-.47-.01"
                        ></path>
                      </svg>
                      Deel op WhatsApp
                    </a>
                  </div>
                </div>
                <div className="share-extra-content">
                  <p>
                    Vergeet niet om je aan te melden voor dit evenement <br /> zodat je op de hoogte blijft van
                    belangrijke updates:
                  </p>
                  <a href="#event-information">👉 Meld je aan voor evenement</a>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showConfetti && (
        <div className="confetti-container">
          <div className="confetti-wrapper">
            <ConfettiExplosion
              key={confettiKey}
              force={activeStepTravelTogether === 3 ? 1.5 : 0.9}
              duration={activeStepTravelTogether === 3 ? 5000 : 3500}
              particleCount={activeStepTravelTogether === 3 ? 300 : 180}
              width={windowDimensions.width}
              height={windowDimensions.height}
              colors={[
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
              ]}
              particleSize={activeStepTravelTogether === 3 ? 20 : 16}
              onComplete={() => setShowConfetti(false)}
            />
          </div>
        </div>
      )}

      <SignalModal
        isOpen={travelShowSignalPopup}
        onClose={() => setTravelShowSignalPopup(false)}
        defaultMessage={travelShareSignalMessageUpdated}
      />
    </div>
  );
}
