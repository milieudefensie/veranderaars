import React, { useState } from 'react';
import { navigate } from 'gatsby';

import './styles.scss';

const Form = ({ event }) => {
  const [status, setStatus] = useState('idle'); // idle | loading | fail | success
  const [errorMsg, setErrorMsg] = useState(null);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', postcode: '', slug: event });
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
          [name]: isValidPostcode ? null : 'Voer een geldige postcode in (geen spaties)',
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
      newErrors.postcode = 'Voer een geldige postcode in (geen spaties)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

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
  };

  const hasErrors = Object.values(errors).some((e) => e);

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

        <input
          type="submit"
          value="Ik ben er bij!"
          className={`send-btn ${hasErrors ? 'disabled' : ''}`}
          disabled={hasErrors}
        />
      </form>

      {/* Error messages */}
      {status === 'fail' && errorMsg && (
        <div className="error-wrapper">
          <ul>
            {errorMsg.split(';').map((e) => (
              <li>{e}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Form;
