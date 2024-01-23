import React from 'react';
import { Script } from 'gatsby';

import './index.scss';

const HubspotForm = ({ id, formId, region, portalId, style = 'default' }) => {
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
            onFormReady: () => {
              // Handlers
              const inputs = document.querySelectorAll('.hs-input');

              inputs.forEach((input) => {
                input.setAttribute('autocomplete', 'off');
              });

              inputs.forEach((input) => {
                input.addEventListener('input', () => {
                  if (input.value.trim() !== '') {
                    input.setAttribute('data-input', 'load');
                  } else {
                    input.setAttribute('data-input', 'empty');
                  }
                });
              });

              document.querySelectorAll('.hs-form-field').forEach((e) => {
                const labelElement = e.querySelector('label');
                const inputElement = e.querySelector('input');

                if (inputElement && inputElement.value.trim() !== '') {
                  labelElement?.classList.add('focused');
                }

                e.addEventListener('focusin', function () {
                  labelElement?.classList.add('focused');
                });

                e.addEventListener('focusout', function () {
                  labelElement?.classList.remove('focused');

                  if (inputElement && inputElement.value.trim() !== '') {
                    labelElement?.classList.add('focused');
                  }
                });
              });

              // Postal code custom logic
              const zipInput = document.querySelectorAll('.hs_zip');
              zipInput.forEach((hsZipContainer) => {
                const zipInput = hsZipContainer.querySelector('input[name="zip"]');

                hsZipContainer.addEventListener('input', () => {
                  verifyPostalCode(zipInput, hsZipContainer);
                });
              });

              function verifyPostalCode(input, hsZipContainer) {
                const zipValue = input.value.trim();
                const zipRegex = /^\d{4}[a-zA-Z]{2}$/;
                const errorContainer = hsZipContainer.querySelector('.hs-error-msgs');

                const invalidInput = !zipRegex.test(zipValue);
                if (zipValue === '') {
                  const tempDivId = hsZipContainer.querySelectorAll('#to-delete');
                  if (tempDivId) {
                    tempDivId.forEach((div) => (div.innerHTML = ``));
                  }

                  return;
                }

                if (invalidInput) {
                  input.classList.add('invalid', 'error');
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
            },
          });
        }}
        onError={(e) => console.error(e)}
      />

      <div id={`hubspotForm-${id}`} className={`form-hubspot ${style ? style : ''}`}></div>
    </>
  );
};

export default HubspotForm;
