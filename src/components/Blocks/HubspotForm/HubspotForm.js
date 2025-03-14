import React from 'react';
import { Script } from 'gatsby';
import { homepageFormIssues } from '../../../utils';

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
  onFormSubmitted,
}) => {
  return (
    <>
      <Script
        src="https://js.hsforms.net/forms/v2.js"
        onLoad={() => {
          window.hbspt.forms.create({
            region: region,
            portalId: portalId,
            formId: formId,
            target: `#hubspotForm-${id}`,
            locale: 'nl',
            translations: {
              nl: {
                required: 'Verplicht veld',
                invalidEmail: 'Geen geldig e-mailadres',
                invalidEmailFormat: 'Geen geldig e-mailadres',
                phoneInvalidCharacters: 'Telefoonnummer mag alleen nummers, +, en haakjes () bevatten.',
                phoneInvalidCharactersWithoutCountryCode:
                  'Telefoonnummer mag alleen nummers, +, en haakjes () bevatten.',
              },
            },
            onFormReady: (ctx) => {
              const { id } = ctx;

              // Handlers
              const inputs = document.querySelectorAll(`#${id} .hs-input`);
              inputs.forEach((input) => input.setAttribute('autocomplete', 'off'));

              inputs.forEach((input) => {
                input.addEventListener('input', () => {
                  if (input.value.trim() !== '') {
                    input.setAttribute('data-input', 'load');
                  } else {
                    input.setAttribute('data-input', 'empty');
                  }
                });
              });

              document.querySelectorAll(`#${id} .hs-form-field`).forEach((e) => {
                const labelElement = e.querySelector('label');
                const inputElement = e.querySelector('input');

                if (inputElement && inputElement.value.trim() !== '') {
                  labelElement?.classList.add('focused');
                }

                e.addEventListener('focusin', function () {
                  labelElement?.classList.add('focused');
                  checkIfFormHasErrors();
                });

                e.addEventListener('focusout', function () {
                  labelElement?.classList.remove('focused');

                  if (inputElement && inputElement.value.trim() !== '') {
                    labelElement?.classList.add('focused');
                  }

                  checkIfFormHasErrors();
                  setTimeout(() => {
                    checkIfFormHasErrors();
                  }, 100);
                });

                e.addEventListener('input', (input) => {
                  const formWrapper = document.querySelector(`#${id}`);
                  const submitBtn = formWrapper.querySelector('input[type="submit"].hs-button');
                  const hasError = input.target.classList.contains('error');
                  submitBtn.disabled = hasError;
                });
              });

              // General logic
              function checkIfFormHasErrors() {
                const formWrapper = document.querySelector(`#${id}`);
                const submitBtn = formWrapper.querySelector('input[type="submit"].hs-button');
                const fields = formWrapper.querySelectorAll('input.hs-input');

                const hasError = Array.from(fields).some((input) => input.classList.contains('error'));
                submitBtn.disabled = hasError;

                // Homepage form fixes
                if (style === 'homepage') {
                  const heroHomepage = document.querySelector('.wrapper-hero');
                  const nextElementOfHome = heroHomepage.nextElementSibling;

                  if (!nextElementOfHome) return;
                  homepageFormIssues();
                }
              }

              // Postal code custom logic
              const zipInput = document.querySelectorAll('.hs_zip');
              zipInput.forEach((hsZipContainer) => {
                const zipInput = hsZipContainer.querySelector('input[name="zip"]');

                hsZipContainer.addEventListener('input', () => {
                  verifyPostalCode(zipInput, hsZipContainer);
                  checkIfFormHasErrors();
                });
              });

              function verifyPostalCode(input, hsZipContainer) {
                const zipValue = input.value;
                const zipRegex = /^\d{4}\s?[a-zA-Z]{2}$/;
                const errorContainer = hsZipContainer.querySelector('.hs-error-msgs');

                const invalidInput = !zipRegex.test(zipValue);
                if (zipValue === '') {
                  const tempDivId = hsZipContainer.querySelectorAll('#to-delete');
                  if (tempDivId) {
                    tempDivId.forEach((div) => (div.innerHTML = ``));
                  }

                  return;
                }

                const submitBtn = document.querySelector('input[type="submit"].hs-button');

                if (invalidInput) {
                  input.classList.add('invalid', 'error');
                  submitBtn.disabled = true;
                } else {
                  input.classList.remove('invalid', 'error');

                  const tempDivId = hsZipContainer.querySelectorAll('#to-delete');
                  if (tempDivId) {
                    tempDivId.forEach((div) => (div.innerHTML = ``));
                    return;
                  }
                }

                if (!errorContainer) {
                  const errorMessage = `
                    <ul class="no-list hs-error-msgs inputs-list" role="alert">
                      <li>
                        <label class="hs-error-msg hs-main-font-element">Voer een geldige postcode in</label>
                      </li>
                    </ul>
                  `;

                  const tempDiv = document.createElement('div');
                  tempDiv.id = `to-delete`;
                  tempDiv.innerHTML = errorMessage;
                  hsZipContainer.appendChild(tempDiv);
                }
              }

              // Add reCaptcha text
              const legalTextContainer = document.querySelector(`#${id} .legal-consent-container .hs-richtext p`);
              if (legalTextContainer) {
                legalTextContainer.innerHTML += `
                  Deze website wordt beschermd tegen spam door reCAPTCHA, dus het Google 
                  <a href="https://policies.google.com/privacy">privacybeleid</a> en 
                   <a href="https://policies.google.com/terms">voorwaarden</a> zijn van toepassing.
                `;
              }

              // Custom logic if needed
              if (extraLogic) extraLogic(ctx);
            },
            onFormSubmitted: ($form, data) => {
              onFormSubmitted && onFormSubmitted($form, data);
            },
          });
        }}
        onError={async (e) => {
          if (window !== undefined && trackErrors) {
            try {
              const bodyError = {
                date: new Date().toISOString(),
                url: window.location.href,
                browser: navigator.userAgent,
              };
              await fetch('/api/csl-form-errors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyError),
              });

              console.log('[Hubspot] Tracking errors.');
            } catch (e) {
              console.log(e);
            }
          }

          document.querySelector(`#hubspotForm-${id}`).innerHTML =
            `<p style="color:red">Je instellingen blokkeren de weergave van dit formulier. Voeg onze website toe aan de uitzonderingenlijst van je adblocker, browser- of netwerkfilter en vernieuw de pagina</p>`;
        }}
      />

      <div
        id={`hubspotForm-${id}`}
        className={`ui-form-hubspot ${style ? style : ''} ${columns ? `columns-${columns}` : ''}`}
      />
    </>
  );
};

export default HubspotForm;
