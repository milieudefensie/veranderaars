import React, { useEffect, useState } from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout/layout';
import SeoDatoCMS from '../components/Layout/seo-datocms';
import StructuredTextDefault from '../components/Blocks/StructuredTextDefault/structured-text-default';
import WrapperLayout from '../components/Layout/WrapperLayout/wrapper-layout'; // @ts-expect-error
import { isArray, formatSimpleDateWithTimeCSL } from '../utils';
import FormSteps from '../components/Global/FormSteps/FormSteps';
import HubspotForm from '../components/Blocks/HubspotForm/HubspotForm';
import SignalModal from '../components/Global/SignalModal/signal-modal';
import { SignalGroupType } from '../types';
import TravelTogether from '../components/Layout/travel-together/travel-together';

import './basic.styles.scss';
import './event.styles.scss';

// @ts-expect-error
const Event = ({ pageContext, data: { page, favicon } }) => {
  const {
    seo,
    title,
    slug,
    introduction,
    hourStart,
    hourEnd,
    date,
    address,
    image,
    content,
    formSteps,
    registrationForm,
    collection,
    othersSignalGroups,
  } = page;

  const [city, setCity] = useState('Utrecht');
  const [shareWpText, setShareWpText] = useState('');
  const [shareSignalMessage, setShareSignalMessage] = useState('');
  const [showSignalPopup, setShowSignalPopup] = useState(false);
  const [travelShowSignalPopup, setTravelShowSignalPopup] = useState(false);

  useEffect(() => {
    const htmlElement = document.documentElement;
    htmlElement.style.overflow = '';

    const currentURL = `${window.location.origin}/agenda/${slug}?utm_medium=social&utm_source=whatsapp`;
    const signalURL = `${window.location.origin}/agenda/${slug}?utm_medium=social&utm_source=signal`;

    const message = `Lijkt het je leuk om hier samen met mij heen te gaan? ${currentURL}`;
    setShareWpText(`https://wa.me/?text=${encodeURIComponent(message)}`);

    const signalMessage = `Lijkt het je leuk om hier samen met mij heen te gaan? ${signalURL}`;
    setShareSignalMessage(signalMessage);
  }, []);

  const travelShareSignalMessageUpdated = `Ik ga hier samen met een paar andere mensen heen. Wie reist er nog meer met mij mee vanuit ${city}? ${
    typeof window !== 'undefined'
      ? `${window.location.origin}/agenda/${slug}#travel-together`
      : `/agenda/${slug}#travel-together`
  }`;

  const withFormsSteps = isArray(formSteps?.forms || formSteps?.[0]?.forms);

  const handleSignalShare = async (isTravel = false) => {
    try {
      await navigator.clipboard.writeText(isTravel ? travelShareSignalMessageUpdated : shareSignalMessage);
      isTravel ? setTravelShowSignalPopup(true) : setShowSignalPopup(true);
    } catch (err) {
      console.error('Err', err);
    }
  };

  return (
    <Layout>
      <SeoDatoCMS seo={seo} favicon={favicon} />

      <WrapperLayout variant={`white event-detail`}>
        <div className="container">
          <header id="event-information" className="event-header">
            <div className="image-container">
              <picture>
                <img
                  src={image?.url || 'https://www.datocms-assets.com/115430/1712234204-pattern-2500.png'}
                  alt={`Image for ${title}`}
                />
              </picture>
            </div>
            <div className="event-metadata">
              <div className="date-container">
                {date && <span className="date">{formatSimpleDateWithTimeCSL(date, hourStart, hourEnd)}</span>}
                {collection && (
                  <div>
                    <span className="badge-tour">{collection.title}</span>
                  </div>
                )}
              </div>
              <h1>{title}</h1>
              {address && (
                <div className="location-container">
                  <h3>{address}</h3>
                </div>
              )}
              <div className="desktop-form">
                {withFormsSteps ? (
                  <FormSteps form={formSteps} noStyle showPlaceholder formCustomVariant="agenda-event" />
                ) : registrationForm ? (
                  <HubspotForm {...registrationForm} style="agenda-event" showPlaceholder />
                ) : null}
              </div>
            </div>
          </header>
          <div className="event-participation agenda">
            <div className="btns-wrapper">
              <button className="btn-signal" onClick={() => handleSignalShare(false)}>
                <svg viewBox="0 0 24 24" width="1.5em" height="1.5em">
                  <path fill="currentColor" d="m21 12l-7-7v4C7 10 4 15 3 20c2.5-3.5 6-5.1 11-5.1V19z"></path>
                </svg>
                Deel op Signal
              </button>
              <a href={shareWpText} rel="noopener noreferrer" target="_blank" className="btn-signal">
                <svg viewBox="0 0 24 24" width="1.5em" height="1.5em">
                  <path
                    fill="currentColor"
                    d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23c-1.48 0-2.93-.39-4.19-1.15l-.3-.17l-3.12.82l.83-3.04l-.2-.32a8.2 8.2 0 0 1-1.26-4.38c.01-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31c-.22.25-.87.86-.87 2.07c0 1.22.89 2.39 1 2.56c.14.17 1.76 2.67 4.25 3.73c.59.27 1.05.42 1.41.53c.59.19 1.13.16 1.56.1c.48-.07 1.46-.6 1.67-1.18s.21-1.07.15-1.18c-.07-.1-.23-.16-.48-.27c-.25-.14-1.47-.74-1.69-.82c-.23-.08-.37-.12-.56.12c-.16.25-.64.81-.78.97c-.15.17-.29.19-.53.07c-.26-.13-1.06-.39-2-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.12-.24-.01-.39.11-.5c.11-.11.27-.29.37-.44c.13-.14.17-.25.25-.41c.08-.17.04-.31-.02-.43c-.06-.11-.56-1.35-.77-1.84c-.2-.48-.4-.42-.56-.43c-.14 0-.3-.01-.47-.01"
                  ></path>
                </svg>
                Deel op WhatsApp
              </a>
              <a href="#travel-together" className="btn-signal fill">
                <svg viewBox="0 0 24 24" width="1.5em" height="1.5em">
                  <path
                    fill="currentColor"
                    d="M12 2c-4 0-8 .5-8 4v9.5A3.5 3.5 0 0 0 7.5 19L6 20.5v.5h2.23l2-2H14l2 2h2v-.5L16.5 19a3.5 3.5 0 0 0 3.5-3.5V6c0-3.5-3.58-4-8-4M7.5 17A1.5 1.5 0 0 1 6 15.5A1.5 1.5 0 0 1 7.5 14A1.5 1.5 0 0 1 9 15.5A1.5 1.5 0 0 1 7.5 17m3.5-7H6V6h5zm2 0V6h5v4zm3.5 7a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5"
                  ></path>
                </svg>
                Reis samen vanuit Utrecht
              </a>
            </div>
          </div>
          <div className="event-content">
            {introduction && <div className="introduction" dangerouslySetInnerHTML={{ __html: introduction }} />}
            {content?.value && (
              <div className="content">
                <StructuredTextDefault content={content} />
              </div>
            )}
          </div>

          <TravelTogether
            slug={slug}
            othersSignalGroups={othersSignalGroups}
            shareWpText={shareWpText}
            isCSLEvent={false}
          />
          {/* <div id="travel-together" className="travel-together-container">
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

                      // Solo mostrar sugerencias si hay texto (más de 1 caracter)
                      if (value.length > 1 && othersSignalGroups) {
                        const filtered = othersSignalGroups
                          .map((g: any) => g.internalName)
                          .filter((c: string) => c.toLowerCase().includes(value.toLowerCase()));
                        setCitySuggestions(filtered);
                        setShowSuggestions(true); // Mostrar sugerencias
                      } else {
                        setCitySuggestions([]);
                        setShowSuggestions(false); // Ocultar sugerencias
                      }
                    }}
                    onFocus={() => {
                      // Si hay texto y sugerencias disponibles, mostrarlas al hacer focus
                      if (currentCity.length > 1 && citySuggestions.length > 0) {
                        setShowSuggestions(true);
                      }
                    }}
                    onBlur={() => {
                      // Ocultar sugerencias después de un pequeño delay para permitir clicks
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
                          chat groep (Signal werkt net als WhatsApp). Voeg alvast een paar mensen toe die je wil
                          uitnodigen
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
                            <strong>
                              Kopieer de uitnodigingslink van jou groep chat in Signal. Plak deze hieronder.
                            </strong>{' '}
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
                            Wij controleren de link en delen deze openbaar op deze website, zodat iedereen zich
                            makkelijk kan aanmelden om samen te reizen. Je e-mail adres blijft prive. We sturen je
                            eenmalig wat tips om je te helpen met je samenreisevenement.
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
                        Stem met elkaar af hoe je samen reist. Voeg aan de beschrijving van de groep bijvoorbeeld toe
                        welke trein je neemt, of deel een auto. 🚂
                      </p>
                      <p>
                        Je kent elkaar misschien nog niet. Stel jezelf voor en verwelkom nieuwe mensen. Je kan ook van
                        tevoren bij iemand thuis samen wat eten en protestborden verven om elkaar te leren kennen. 🍕🪧
                      </p>
                      <div className="share-content">
                        <div className="share-title">Nodig meer mensen uit:</div>
                        <div className="share-description">
                          Ik ga hier samen met een paar andere mensen heen. Wie reist er nog meer met mij mee vanuit{' '}
                          {city}?
                          <br />
                          <br />{' '}
                          {typeof window !== 'undefined'
                            ? `${window.location.origin}/lokaal/${slug}#travel-together`
                            : `/lokaal/${slug}#travel-together`}
                        </div>
                        <div className="share-buttons">
                          <button onClick={() => handleSignalShare(true)}>
                            <svg viewBox="0 0 24 24" width="1.5em" height="1.5em">
                              <path
                                fill="currentColor"
                                d="m21 12l-7-7v4C7 10 4 15 3 20c2.5-3.5 6-5.1 11-5.1V19z"
                              ></path>
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
                              Een veranderaar uit {city} heeft een Signal chat groep aangemaakt. In deze chat spreken
                              jullie samen af hoe jullie gaan reizen.
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
                        Stem met elkaar af hoe je samen reist. Voeg aan de beschrijving van de groep bijvoorbeeld toe
                        welke trein je neemt, of deel een auto. 🚂
                      </p>
                      <p>
                        Je kent elkaar misschien nog niet. Stel jezelf voor en verwelkom nieuwe mensen. Je kan ook van
                        tevoren bij iemand thuis samen wat eten en protestborden verven om elkaar te leren kennen. 🍕🪧
                      </p>
                      <div className="share-content">
                        <div className="share-title">Nodig meer mensen uit:</div>
                        <div className="share-description">
                          Ik ga hier samen met een paar andere mensen heen. Wie reist er nog meer met mij mee vanuit{' '}
                          {city}?
                          <br />
                          <br />
                          {typeof window !== 'undefined'
                            ? `${window.location.origin}/lokaal/${slug}#travel-together`
                            : `/lokaal/${slug}#travel-together`}
                        </div>
                        <div className="share-buttons">
                          <button onClick={() => handleSignalShare(true)}>
                            <svg viewBox="0 0 24 24" width="1.5em" height="1.5em">
                              <path
                                fill="currentColor"
                                d="m21 12l-7-7v4C7 10 4 15 3 20c2.5-3.5 6-5.1 11-5.1V19z"
                              ></path>
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
          </div> */}

          {othersSignalGroups && othersSignalGroups.length > 0 && (
            <div className="related-groups-container">
              <h3>Reis samen vanuit andere steden</h3>

              <div className={`related-events length-${othersSignalGroups.length}`}>
                <ul>
                  {othersSignalGroups.map((item: SignalGroupType) => (
                    <a
                      key={item.id}
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-all"
                    >
                      <li>
                        <div className="icon">
                          <svg viewBox="0 0 24 24" width="1.5em" height="1.5em">
                            <path
                              fill="currentColor"
                              d="M12 5.5A3.5 3.5 0 0 1 15.5 9a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8.5 9A3.5 3.5 0 0 1 12 5.5M5 8c.56 0 1.08.15 1.53.42c-.15 1.43.27 2.85 1.13 3.96C7.16 13.34 6.16 14 5 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3m14 0a3 3 0 0 1 3 3a3 3 0 0 1-3 3c-1.16 0-2.16-.66-2.66-1.62a5.54 5.54 0 0 0 1.13-3.96c.45-.27.97-.42 1.53-.42M5.5 18.25c0-2.07 2.91-3.75 6.5-3.75s6.5 1.68 6.5 3.75V20h-13zM0 20v-1.5c0-1.39 1.89-2.56 4.45-2.9c-.59.68-.95 1.62-.95 2.65V20zm24 0h-3.5v-1.75c0-1.03-.36-1.97-.95-2.65c2.56.34 4.45 1.51 4.45 2.9z"
                            ></path>
                          </svg>
                        </div>
                        <div className="metadata">
                          <div className="date">{item.internalName}</div>
                          <div className="type">Signal chat groep</div>
                        </div>
                      </li>
                    </a>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <SignalModal
          isOpen={showSignalPopup}
          onClose={() => setShowSignalPopup(false)}
          defaultMessage={shareSignalMessage}
        />
      </WrapperLayout>
    </Layout>
  );
};

export default Event;

export const PageQuery = graphql`
  query EventById($id: String) {
    favicon: datoCmsSite {
      faviconMetaTags {
        ...GatsbyDatoCmsFaviconMetaTags
      }
    }
    listEvent: datoCmsListEvent {
      id
      slug
    }
    page: datoCmsEvent(id: { eq: $id }) {
      ...EventPage
    }
  }
`;
