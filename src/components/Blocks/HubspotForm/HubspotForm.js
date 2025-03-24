import React from 'react';
import { Script } from 'gatsby';

import './index.scss';

const HubspotForm = ({
  id,
  formId,
  region,
  portalId,
  trackErrors = true,
  style = 'default',
  columns,
  extraLogic = null,
}) => {
  const initializeForm = () => {
    if (!window.hbspt) return;

    window.hbspt.forms.create({
      region,
      portalId,
      formId,
      target: `#hubspotForm-${id}`,
      locale: 'nl',
      translations: {
        nl: {
          required: 'Verplicht veld',
          invalidEmail: 'Geen geldig e-mailadres',
          invalidEmailFormat: 'Geen geldig e-mailadres',
          phoneInvalidCharacters: 'Telefoonnummer mag alleen nummers, +, en haakjes () bevatten.',
          phoneInvalidCharactersWithoutCountryCode: 'Telefoonnummer mag alleen nummers, +, en haakjes () bevatten.',
        },
      },
      onFormReady: handleFormReady,
    });
  };

  const handleFormReady = (ctx) => {
    const formWrapper = document.querySelector(`#${ctx.id}`);
    if (!formWrapper) return;

    const submitBtn = formWrapper.querySelector('input[type="submit"].hs-button');
    const inputs = formWrapper.querySelectorAll('.hs-input');

    inputs.forEach((input) => setupInputObserver(input, submitBtn));
    setupFocusHandlers(formWrapper);
    setupPostalCodeValidation(formWrapper, submitBtn);
    addRecaptchaText(formWrapper);

    if (extraLogic) extraLogic();
  };

  const setupInputObserver = (input, submitBtn) => {
    input.autocomplete = 'off';

    const observer = new MutationObserver(() => {
      // updateInputState(input);
      validateForm(submitBtn);
    });

    observer.observe(input, { attributes: true, attributeFilter: ['value', 'class'] });
    input.addEventListener('input', () => validateForm(submitBtn));
  };

  const updateInputState = (input) => {
    const label = input.closest('.hs-form-field')?.querySelector('label');
    if (input.value.trim() !== '') {
      input.setAttribute('data-input', 'load');
      label?.classList.add('focused');
    } else {
      input.setAttribute('data-input', 'empty');
      label?.classList.remove('focused');
    }
  };

  const validateForm = (submitBtn) => {
    const hasError = Array.from(document.querySelectorAll(`#hubspotForm-${id} .hs-input`)).some((input) =>
      input.classList.contains('error')
    );
    submitBtn.disabled = hasError;
    submitBtn.classList.toggle('disabled', hasError);
  };

  const setupFocusHandlers = (formWrapper) => {
    formWrapper.querySelectorAll('.hs-form-field').forEach((field) => {
      const label = field.querySelector('label');
      const input = field.querySelector('input');

      if (input?.value.trim()) {
        label?.classList.add('focused');
      }

      field.addEventListener('focusin', () => {
        label.classList.add('focused');
      });

      field.addEventListener('focusout', () => {
        if (!input?.value.trim()) label?.classList.remove('focused');
      });
    });
  };

  const setupPostalCodeValidation = (formWrapper, submitBtn) => {
    formWrapper.querySelectorAll('.hs_zip').forEach((container) => {
      const zipInput = container.querySelector('input[name="zip"]');

      zipInput?.addEventListener('input', () => {
        validatePostalCode(zipInput, container);
        validateForm(submitBtn);
      });
    });
  };

  const validatePostalCode = (input, container) => {
    const zipRegex = /^\d{4}\s?[a-zA-Z]{2}$/;
    const isValid = zipRegex.test(input.value);
    const errorContainer = container.querySelector('.hs-error-msgs');

    if (!input.value) {
      errorContainer?.remove();
      return;
    }

    if (!isValid) {
      input.classList.add('error');
      if (!errorContainer) showError(container, 'Voer een geldige postcode in');
    } else {
      input.classList.remove('error');
      errorContainer?.remove();
    }
  };

  const showError = (container, message) => {
    const errorHTML = `
      <ul class="no-list hs-error-msgs inputs-list" role="alert">
        <li><label class="hs-error-msg hs-main-font-element">${message}</label></li>
      </ul>
    `;
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = errorHTML;
    container.appendChild(errorDiv);
  };

  const addRecaptchaText = (formWrapper) => {
    const legalTextContainer = formWrapper.querySelector('.legal-consent-container .hs-richtext p');
    if (legalTextContainer) {
      legalTextContainer.innerHTML += `
        Deze website wordt beschermd tegen spam door reCAPTCHA, dus het Google 
        <a href="https://policies.google.com/privacy">privacybeleid</a> en 
        <a href="https://policies.google.com/terms">voorwaarden</a> zijn van toepassing.
      `;
    }
  };

  const handleScriptError = () => {
    if (!trackErrors) return;

    const errorData = {
      date: new Date().toISOString(),
      url: window.location.href,
      browser: navigator.userAgent,
    };

    fetch('/api/csl-form-errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorData),
    }).catch(console.error);

    document.querySelector(`#hubspotForm-${id}`).innerHTML =
      `<p style="color:red">Je instellingen blokkeren de weergave van dit formulier. Voeg onze website toe aan de uitzonderingenlijst van je adblocker, browser- of netwerkfilter en vernieuw de pagina</p>`;
  };

  return (
    <>
      <Script src="https://js.hsforms.net/forms/v2.js" onLoad={initializeForm} onError={handleScriptError} />
      <div id={`hubspotForm-${id}`} className={`ui-form-hubspot ${style} ${columns ? `columns-${columns}` : ''}`} />
    </>
  );
};

export default HubspotForm;
