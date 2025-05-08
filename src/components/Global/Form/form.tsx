import React, { useState, ChangeEvent, FocusEvent, FormEvent } from 'react';
import { navigate } from 'gatsby';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import ConferenceDistributor from '../ConferenceDistributor/conference-distributor';

import './styles.scss';

interface FormProps {
  event: string;
  inputs?: string[];
  conferenceUrl?: string | null;
  isWaitingList?: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  postcode: string;
  phone: string;
  consent_email: string | null;
  slug: string;
}

interface Errors {
  [key: string]: string | null;
}

const Form: React.FC<FormProps> = ({ event, inputs = [], conferenceUrl = null, isWaitingList = false }) => {
  const { t } = useTranslation();

  const [status, setStatus] = useState<'idle' | 'loading' | 'fail' | 'success'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    postcode: '',
    phone: '',
    consent_email: null,
    slug: event,
  });
  const [errors, setErrors] = useState<Errors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const empty = value === '';
    setErrors({ ...errors, [name]: empty ? t('form_required') : null });

    if (!empty) {
      if (name === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(value);
        setErrors((prevErrors) => ({ ...prevErrors, [name]: isValidEmail ? null : t('form_invalid_email') }));
      }

      if (name === 'postcode') {
        const postcodeRegex = /^\d{4}\s?[A-Za-z]{2}$/;
        const isValidPostcode = postcodeRegex.test(value);
        setErrors((prevErrors) => ({
          ...prevErrors,
          [name]: isValidPostcode ? null : t('form_postcode_error'),
        }));
      }
    }
  };

  const handleOnFocus = (e: FocusEvent<HTMLInputElement>) => {
    const label = e.target.parentElement?.parentElement?.querySelector('.custom-label');
    if (!label) return;

    label.classList.add('focused');
  };

  const handleOnFocusOut = (e: FocusEvent<HTMLInputElement>) => {
    const label = e.target.parentElement?.parentElement?.querySelector('.custom-label');
    if (!label || e.target.value !== '') return;

    label.classList.remove('focused');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    const newErrors: Errors = {};

    Object.keys(formData).forEach((key) => {
      if (formData[key as keyof FormData] === '' && key !== 'phone') {
        newErrors[key] = t('form_required');
      }
    });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = t('form_invalid_email');
    }

    const postcodeRegex = /^\d{4}\s?[A-Za-z]{2}$/;
    if (!postcodeRegex.test(formData.postcode)) {
      newErrors.postcode = t('form_postcode_error');
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
        body: JSON.stringify({ ...formData, waiting_list: isWaitingList }),
      });

      const response = await submit.json();
      if (submit.status !== 200) {
        setStatus('fail');
        setErrorMsg(response.message);
        return;
      } else {
        if (!conferenceUrl) {
          if (isWaitingList) {
            navigate('/aanmelding-wachtlijst/');
          } else {
            navigate('/bedankt-dat-je-komt/');
          }
        }
      }

      setStatus('success');
    } catch (error) {
      setStatus('error');
      console.error(error);
    }
  };

  const isFieldPresent = (fieldName: string) => {
    return inputs.some((input) => input.includes(`name="attendee[${fieldName}]"`));
  };

  const hasErrors = Object.values(errors).some((e) => e);
  const isLoading = status === 'loading';

  if (conferenceUrl && status === 'success') {
    return <ConferenceDistributor conferenceUrl={conferenceUrl} />;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="custom-form">
        {isFieldPresent('first_name') && (
          <div className="form-field" onFocus={handleOnFocus} onBlur={handleOnFocusOut}>
            <label className="custom-label" htmlFor="firstName">
              <span>{t('form_first_name')}</span>
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
        )}

        {isFieldPresent('last_name') && (
          <div className="form-field" onFocus={handleOnFocus} onBlur={handleOnFocusOut}>
            <label className="custom-label" htmlFor="lastName">
              <span>{t('form_last_name')}</span>
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
        )}

        {isFieldPresent('postcode') && (
          <div className="form-field" onFocus={handleOnFocus} onBlur={handleOnFocusOut}>
            <label className="custom-label" htmlFor="postcode">
              <span>{t('form_postcode')}</span>
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
        )}

        {isFieldPresent('email') && (
          <div className="form-field" onFocus={handleOnFocus} onBlur={handleOnFocusOut}>
            <label className="custom-label" htmlFor="email">
              <span>{t('form_email')}</span>
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
        )}

        {isFieldPresent('phone_number') && (
          <div className="form-field" onFocus={handleOnFocus} onBlur={handleOnFocusOut}>
            <label className="custom-label" htmlFor="phone">
              <span>{t('form_phone')}</span>
            </label>

            <div className="input">
              <input
                id="phone"
                name="phone"
                type="tel"
                className={`input ${errors.phone ? 'error' : ''} `}
                inputMode="tel"
                autoComplete="off"
                required={false}
                onChange={handleChange}
              />
            </div>

            {errors.phone && (
              <ul className="no-list hs-error-msgs inputs-list" role="alert">
                <li>
                  <label className="hs-error-msg hs-main-font-element">{errors.email}</label>
                </li>
              </ul>
            )}
          </div>
        )}

        <div className="form-field-checkbox" onFocus={handleOnFocus} onBlur={handleOnFocusOut}>
          <fieldset>
            <legend>{t('form_checkbox')}</legend>

            <div className="options">
              <div className="opt">
                <input
                  type="radio"
                  id="consent_email_yes"
                  name="consent_email"
                  value="yes"
                  onChange={handleChange}
                  required
                />
                <label htmlFor="consent_email_yes">{t('form_checkbox_yes')}</label>
              </div>

              <div className="opt">
                <input
                  type="radio"
                  id="consent_email_no"
                  name="consent_email"
                  value="no"
                  onChange={handleChange}
                  required
                />
                <label htmlFor="consent_email_no">{t('form_checkbox_no')}</label>
              </div>
            </div>
          </fieldset>
        </div>

        <input
          type="submit"
          value={isLoading ? t('form_sending') : isWaitingList ? t('waiting_list_message') : t('form_submit')}
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

      {status === 'fail' && errorMsg && (
        <div className="error-wrapper">
          <ul>
            {errorMsg
              .split(';')
              .filter((str) => str.trim().length)
              .map((e, idx) => (
                <li key={idx}>{e.charAt(0).toUpperCase() + e.slice(1)}</li>
              ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Form;
