import React from 'react';
import { Script } from 'gatsby';
import { useTranslate } from '@tolgee/react';

import './index.scss';

interface HubspotFormProps {
  id: string;
  formId: string;
  region: string;
  portalId: string;
  trackErrors?: boolean;
  style?: string;
  columns?: number;
  extraLogic?: (ctx: any) => void;
  onFormSubmitted?: (form: HTMLFormElement, data: any) => void;
}

declare global {
  interface Window {
    hbspt: any;
  }
}

const HubspotForm: React.FC<HubspotFormProps> = ({
  id,
  formId,
  region,
  portalId,
  trackErrors = true,
  style = 'default',
  columns,
  extraLogic = null,
  onFormSubmitted,
}) => {
  const { t } = useTranslate();

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
          required: t('form_required'),
          invalidEmail: t('form_invalid_email'),
          invalidEmailFormat: t('form_invalid_email_format'),
          phoneInvalidCharacters: t('form_invalid_phone'),
          phoneInvalidCharactersWithoutCountryCode: t('form_invalid_phone_format'),
        },
      },
      onFormReady: handleFormReady,
      onFormSubmitted: (form: HTMLFormElement, data: any) => {
        onFormSubmitted?.(form, data);
      },
    });
  };

  const handleFormReady = (ctx: { id: string }) => {
    const formWrapper = document.querySelector(`#${ctx.id}`) as HTMLElement | null;
    if (!formWrapper) return;

    const submitBtn = formWrapper.querySelector('input[type="submit"].hs-button') as HTMLInputElement | null;
    const inputs = formWrapper.querySelectorAll<HTMLInputElement>('.hs-input');

    inputs.forEach((input) => setupInputObserver(input, submitBtn));
    setupFocusHandlers(formWrapper);
    setupPostalCodeValidation(formWrapper, submitBtn);
    addRecaptchaText(formWrapper);

    if (extraLogic) extraLogic(ctx);
  };

  const setupInputObserver = (input: HTMLInputElement, submitBtn: HTMLInputElement | null) => {
    input.autocomplete = 'off';

    const observer = new MutationObserver(() => {
      if (submitBtn) validateForm(submitBtn);
    });

    observer.observe(input, { attributes: true, attributeFilter: ['value', 'class'] });
    input.addEventListener('input', () => {
      if (submitBtn) validateForm(submitBtn);
    });
  };

  const validateForm = (submitBtn: HTMLInputElement) => {
    const hasError = Array.from(document.querySelectorAll<HTMLInputElement>(`#hubspotForm-${id} .hs-input`)).some(
      (input) => input.classList.contains('error')
    );

    submitBtn.disabled = hasError;
    submitBtn.classList.toggle('disabled', hasError);
  };

  const setupFocusHandlers = (formWrapper: HTMLElement) => {
    formWrapper.querySelectorAll<HTMLElement>('.hs-form-field').forEach((field) => {
      const label = field.querySelector('label');
      const input = field.querySelector<HTMLInputElement>('input');

      if (input?.value.trim()) {
        label?.classList.add('focused');
      }

      field.addEventListener('focusin', () => {
        label?.classList.add('focused');
      });

      field.addEventListener('focusout', () => {
        if (!input?.value.trim()) label?.classList.remove('focused');
      });
    });
  };

  const setupPostalCodeValidation = (formWrapper: HTMLElement, submitBtn: HTMLInputElement | null) => {
    formWrapper.querySelectorAll<HTMLElement>('.hs_zip').forEach((container) => {
      const zipInput = container.querySelector<HTMLInputElement>('input[name="zip"]');

      zipInput?.addEventListener('input', () => {
        validatePostalCode(zipInput, container);
        if (submitBtn) validateForm(submitBtn);
      });
    });
  };

  const validatePostalCode = (input: HTMLInputElement | null, container: HTMLElement) => {
    if (!input) return;

    const zipRegex = /^\d{4}\s?[a-zA-Z]{2}$/;
    const isValid = zipRegex.test(input.value);
    const errorContainer = container.querySelector('.hs-error-msgs');

    if (!input.value) {
      errorContainer?.remove();
      return;
    }

    if (!isValid) {
      input.classList.add('error');
      if (!errorContainer) showError(container, t('form_postcode_error'));
    } else {
      input.classList.remove('error');
      errorContainer?.remove();
    }
  };

  const showError = (container: HTMLElement, message: string) => {
    const errorHTML = `
      <ul class="no-list hs-error-msgs inputs-list" role="alert">
        <li><label class="hs-error-msg hs-main-font-element">${message}</label></li>
      </ul>
    `;
    const errorDiv = document.createElement('div');
    errorDiv.innerHTML = errorHTML;
    container.appendChild(errorDiv);
  };

  const addRecaptchaText = (formWrapper: HTMLElement) => {
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

    const errorContainer = document.querySelector(`#hubspotForm-${id}`);
    if (errorContainer) {
      errorContainer.innerHTML = `<p style="color:red">${t('hubspot_error_privacy')}</p>`;
    }
  };

  return (
    <>
      <Script src="https://js.hsforms.net/forms/v2.js" onLoad={initializeForm} onError={handleScriptError} />
      <div id={`hubspotForm-${id}`} className={`ui-form-hubspot ${style} ${columns ? `columns-${columns}` : ''}`} />
    </>
  );
};

export default HubspotForm;
