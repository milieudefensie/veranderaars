import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import { useLocation } from '@reach/router';
import HubspotForm from '../../Blocks/HubspotForm/HubspotForm';

import './styles.scss';

const FormSteps = ({ title, bgImageUrl, form, variant, extraLogic, headerComponents }) => {
  const { forms = [] } = form[0];

  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const stepParam = parseInt(query.get('form_step'));
    if (!isNaN(stepParam) && stepParam < forms.length) {
      setCurrentStep(stepParam);
    } else {
      setCurrentStep(0);
    }
  }, [location, forms.length]);

  const handleStepSubmitted = (_, data) => {
    if (data?.submissionValues?.email) {
      setEmail(data.submissionValues.email);
    }
    const nextStep = currentStep + 1;
    if (nextStep < forms.length) {
      navigate(`?form_step=${nextStep}`, { replace: false });
    }
  };

  const initializeForm = (ctx) => {
    const inputs = document.querySelectorAll(`#hubspotForm-${forms[currentStep]?.id} input`);
    const emailInput = document.querySelector(`#${ctx.id} input[name="email"]`);

    if (inputs.length > 1 && emailInput && email) {
      emailInput.value = email;
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));

      inputs[1].focus();
    }
  };

  const isFirstStep = currentStep === 0;

  return (
    <div className="container container-steps">
      {headerComponents}
      <div
        className={`ui-form-steps ${variant && isFirstStep ? variant : ''} ${isFirstStep ? 'first-step' : 'second-step'}`}
      >
        <div className="metadata">
          <h1>{title}</h1>
          <div dangerouslySetInnerHTML={{ __html: forms[currentStep]?.introductionText }} />
          {forms[currentStep] && (
            <HubspotForm
              key={currentStep}
              {...forms[currentStep]}
              onFormSubmitted={handleStepSubmitted}
              style={isFirstStep ? variant || 'purple' : 'gray'}
              extraLogic={(ctx) => {
                extraLogic && extraLogic(ctx);
                initializeForm(ctx);
              }}
            />
          )}
        </div>
        <div className="image-container">
          <img src={bgImageUrl} />
        </div>
      </div>
      <div
        className={`legal-text ${isFirstStep ? 'first-step' : 'second-step'}`}
        dangerouslySetInnerHTML={{
          __html:
            forms[currentStep]?.disclaimerText ||
            `<p>We houden je op de hoogte over onze beweging en acties bij jou in de buurt via je ingevulde e-mailadres. Als je je nummer deelt kunnen we je bellen of een WhatsApp-berichtje sturen om je op weg te helpen. Lees onze <a href="http://milieudefensie.nl/over-ons/cookies-en-privacy">privacybepaling</a> voor alle details. Deze website wordt beschermd tegen spam door reCAPTCHA, dus het Google <a href="https://policies.google.com/privacy">privacybeleid</a> en <a href="https://policies.google.com/terms">voorwaarden</a> zijn van toepassing.</p>`,
        }}
      />
    </div>
  );
};

export default FormSteps;
