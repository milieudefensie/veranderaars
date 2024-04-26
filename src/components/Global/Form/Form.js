import React, { useState } from 'react';
import { navigate } from 'gatsby';

import './styles.scss';

const Form = ({ event }) => {
  const [status, setStatus] = useState('idle'); // idle | loading | fail | success
  const [errorMsg, setErrorMsg] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    postcode: '',
    consent_email: null,
    slug: event,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const empty = value === '';
    setErrors({ ...errors, [name]: empty ? 'Verplicht veld' : null });

    if (!empty) {
      if (name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(value);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: isValidEmail ? null : 'Geen geldig e-mailadres' }));
      }

      if (name === 'postcode') {
        const postcodeRegex = /^\d{4}\s?[A-Za-z]{2}$/;
        const isValidPostcode = postcodeRegex.test(value);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: isValidPostcode ? null : 'Voer een geldige postcode in',
        }));
      }
    }
  };

  const handleOnFocus = (e) => {
    const label = e.target.parentElement.parentElement.querySelector('.custom-label');
    if (!label) return;

    label.classList.add('focused');
  };

  const handleOnFocusOut = (e) => {
    const label = e.target.parentElement.parentElement.querySelector('.custom-label');
    if (!label || e.target.value !== '') return;

    label.classList.remove('focused');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (formData[key] === '') {
        newErrors[key] = 'Verplicht veld';
      }
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Geen geldig e-mailadres';
    }

    const postcodeRegex = /^\d{4}\s?[A-Za-z]{2}$/;
    if (!postcodeRegex.test(formData.postcode)) {
      newErrors.postcode = 'Voer een geldige postcode in';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setStatus('idle');
      return;
    }

    try {
      const submit = await fetch('/api/submit-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const response = await submit.json();
      if (submit.status !== 200) {
        setStatus('fail');
        setErrorMsg(response.message);
      } else {
        navigate('/bedankt-dat-je-komt/');
      }
    } catch (error) {
      setStatus('error');
      console.error(error);
    }
  };

  const hasErrors = Object.values(errors).some((e) => e);
  const isLoading = status === 'loading';

  return (
    <>
      <form onSubmit={handleSubmit} className="custom-form">
        <div className="form-field" onFocus={handleOnFocus} onBlur={handleOnFocusOut}>
          <label className="custom-label" htmlFor="firstName">
            <span>Voornaam</span>
            <span className="required">*</span>
          </label>

          <div className="input">
            <input
              id="firstName"
              name="firstName"
              type="text"
              className={`input ${errors.firstName ? 'error' : ''} `}
              inputMode="text"
              autoComplete="off"
              onChange={handleChange}
            />
          </div>

          {errors.firstName && (
            <ul className="no-list hs-error-msgs inputs-list" role="alert">
              <li>
                <label className="hs-error-msg hs-main-font-element">{errors.firstName}</label>
              </li>
            </ul>
          )}
        </div>

        <div className="form-field" onFocus={handleOnFocus} onBlur={handleOnFocusOut}>
          <label className="custom-label" htmlFor="lastName">
            <span>Achternaam</span>
            <span className="required">*</span>
          </label>

          <div className="input">
            <input
              id="lastName"
              name="lastName"
              type="text"
              className={`input ${errors.lastName ? 'error' : ''} `}
              inputMode="text"
              autoComplete="off"
              onChange={handleChange}
            />
          </div>

          {errors.lastName && (
            <ul className="no-list hs-error-msgs inputs-list" role="alert">
              <li>
                <label className="hs-error-msg hs-main-font-element">{errors.lastName}</label>
              </li>
            </ul>
          )}
        </div>

        <div className="form-field" onFocus={handleOnFocus} onBlur={handleOnFocusOut}>
          <label className="custom-label" htmlFor="postcode">
            <span>Postcode</span>
            <span className="required">*</span>
          </label>

          <div className="input">
            <input
              id="postcode"
              name="postcode"
              type="text"
              className={`input ${errors.postcode ? 'error' : ''} `}
              inputMode="text"
              autoComplete="off"
              onChange={handleChange}
            />
          </div>

          {errors.postcode && (
            <ul className="no-list hs-error-msgs inputs-list" role="alert">
              <li>
                <label className="hs-error-msg hs-main-font-element">{errors.postcode}</label>
              </li>
            </ul>
          )}
        </div>

        <div className="form-field" onFocus={handleOnFocus} onBlur={handleOnFocusOut}>
          <label className="custom-label" htmlFor="email">
            <span>E-mail</span>
            <span className="required">*</span>
          </label>

          <div className="input">
            <input
              id="email"
              name="email"
              type="text"
              className={`input ${errors.email ? 'error' : ''} `}
              inputMode="text"
              autoComplete="off"
              onChange={handleChange}
            />
          </div>

          {errors.email && (
            <ul className="no-list hs-error-msgs inputs-list" role="alert">
              <li>
                <label className="hs-error-msg hs-main-font-element">{errors.email}</label>
              </li>
            </ul>
          )}
        </div>

        <div className="form-field-checkbox" onFocus={handleOnFocus} onBlur={handleOnFocusOut}>
          <fieldset>
            <legend>Ik wil emails ontvangen over de beweging</legend>

            <div className="opt">
              <input type="radio" id="consent_email_yes" name="consent_email" value="yes" onChange={handleChange} />
              <label htmlFor="consent_email_yes">Yes</label>
            </div>

            <div className="opt">
              <input type="radio" id="consent_email_no" name="consent_email" value="no" onChange={handleChange} />
              <label htmlFor="consent_email_no">No</label>
            </div>
          </fieldset>
        </div>

        <input
          type="submit"
          value={isLoading ? 'Sending...' : 'Ik ben er bij!'}
          className={`send-btn ${hasErrors ? 'disabled' : ''}`}
          disabled={hasErrors || isLoading}
        />

        <div className="legal-consent-container">
          <p>
            Als we je mogen mailen, dan houden we je op de hoogte over onze beweging en acties bij jou in de buurt. Als
            je je nummer deelt kunnen we je bellen of een WhatsApp-berichtje sturen om je op weg te helpen. Lees onze{' '}
            <a href="https://milieudefensie.nl/over-ons/cookies-en-privacy">privacybepaling</a> voor alle details.
          </p>
        </div>
      </form>

      {/* Error messages */}
      {status === 'fail' && errorMsg && (
        <div className="error-wrapper">
          <ul>
            {errorMsg
              .split(';')
              .filter((str) => str.trim().length) // Avoid empty fields
              .map((e) => (
                <li>{e.charAt(0).toUpperCase() + e.slice(1)}</li>
              ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Form;
