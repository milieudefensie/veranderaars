import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import { useLocation } from '@reach/router';
import HubspotForm from '../../Blocks/HubspotForm/HubspotForm';

import './styles.scss';

const FormSteps = ({
  title,
  description,
  bgImageUrl,
  form,
  variant,
  extraLogic,
  headerComponents,
  descriptionAsHtml = false,
}) => {
  const location = useLocation();
  const { forms = [] } = form[0];

  const getInitialStep = () => {
    if (typeof window !== 'undefined') {
      const query = new URLSearchParams(window.location.search);
      const stepParam = parseInt(query.get('form_step'));
      return !isNaN(stepParam) && stepParam > 0 ? stepParam - 1 : 0;
    }
    return 0;
  };

  const [currentStep, setCurrentStep] = useState(getInitialStep);
  const [email, setEmail] = useState(null);

  const isFirstStep = currentStep === 0;

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const stepParam = parseInt(query.get('form_step'));
    if (!isNaN(stepParam) && stepParam > 0 && stepParam <= forms.length) {
      setCurrentStep(stepParam - 1);
    } else {
      setCurrentStep(0);
    }
  }, [location.search, forms.length]);

  const handleStepSubmitted = (_, data) => {
    if (data?.submissionValues?.email) {
      setEmail(data.submissionValues.email);
    }
    const nextStep = currentStep + 1;
    if (nextStep < forms.length) {
      navigate(`?form_step=${nextStep + 1}`, { replace: false });
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

  return (
    <div className="container container-steps">
      {headerComponents}
      <div
        className={`ui-form-steps ${variant && isFirstStep ? variant : ''} ${isFirstStep ? 'first-step' : 'second-step'}`}
      >
        <div className="metadata">
          <h1>{isFirstStep ? title : forms[currentStep]?.title}</h1>
          {isFirstStep && description ? (
            descriptionAsHtml ? (
              <div>{description}</div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: description }} />
            )
          ) : (
            <div dangerouslySetInnerHTML={{ __html: forms[currentStep]?.introductionText }} />
          )}

          {Array.isArray(forms) && forms.length > 0 && forms[currentStep] && (
            <HubspotForm
              key={forms[currentStep]?.id}
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
