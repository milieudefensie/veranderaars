import React, { useState, ChangeEvent, FocusEvent, FormEvent, useEffect } from 'react';
import { navigate } from 'gatsby';
import { useLocation } from '@reach/router';
import { useTranslate } from '@tolgee/react';
import ConferenceDistributor from '../ConferenceDistributor/conference-distributor';

import './styles.scss';

interface FormProps {
  title: string;
  introduction: string;
  event: string;
  inputs?: string[];
  conferenceUrl?: string | null;
  isWaitingList?: boolean;
  image: any;
  headerComponents: any;
  configuration: any;
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

const Form: React.FC<FormProps> = ({
  title,
  introduction,
  event,
  inputs = [],
  image,
  headerComponents,
  conferenceUrl = null,
  isWaitingList = false,
  configuration,
}) => {
  const location = useLocation();
  const { t } = useTranslate();

  const [status, setStatus] = useState<'idle' | 'loading' | 'fail' | 'success' | 'error'>('idle');
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

  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(location.search.includes('form_step=2') ? 1 : 0);
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    if (location.search.includes('form_step=2')) {
      setCurrentStep(1);
    } else {
      setCurrentStep(0);
    }
  }, [location]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const empty = value === '';
    const requiredFields = ['firstName', 'lastName', 'email', 'postcode', 'consent_email'];

    if (requiredFields.includes(name)) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: empty ? t('form_required') : null }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
    }

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

  const handleOnFirstStepSubmitted = (e: any) => {
    e.preventDefault();
    navigate('?form_step=2', { replace: false });

    setTimeout(() => {
      const nameInput = document.querySelector('#postcode');
      // @ts-ignore
      if (nameInput) nameInput.focus();
    }, 100);
  };

  const hasErrors = Object.values(errors).some((e) => e);
  const isLoading = status === 'loading';

  if (conferenceUrl && status === 'success') {
    return <ConferenceDistributor conferenceUrl={conferenceUrl} />;
  }

  return (
    <div className="container container-steps">
      {headerComponents}

      <div className={`ui-form-steps2 ${isFirstStep ? 'green first-step agenda' : 'second-step'}`}>
        <div className="metadata">
          <h1>{isFirstStep ? title : configuration.formSecondStepTitle}</h1>
          {isFirstStep ? (
            <p>{introduction}</p>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: configuration.formSecondStepDescription }} />
          )}

          {isFirstStep ? (
            <>
              <form className="custom-form first" onSubmit={handleOnFirstStepSubmitted}>
                {isFieldPresent('email') && (
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
                        required
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

                <input
                  type="submit"
                  value={isLoading ? 'Versturen...' : 'Ik ben er bij!'}
                  className={`send-btn ${hasErrors ? 'disabled' : ''}`}
                  disabled={hasErrors || isLoading}
                />
              </form>

              {/* Error messages */}
              {status === 'fail' && errorMsg && (
                <div className="error-wrapper white">
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
          ) : (
            <>
              <form onSubmit={handleSubmit} className="custom-form second second-step">
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
                          <label className="hs-error-msg hs-main-font-element">{errors.phone}</label>
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
          )}
        </div>
        <div className="image-container">
          <img src={image} />
        </div>
      </div>
      <div
        className={`legal-text ${isFirstStep ? 'first-step' : 'second-step'}`}
        dangerouslySetInnerHTML={{
          __html: isFirstStep ? configuration.formFirstStepDisclaimer : configuration.formSecondStepDisclaimer,
        }}
      />
    </div>
  );
};

export default Form;
