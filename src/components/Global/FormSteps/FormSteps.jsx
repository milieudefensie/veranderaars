import React, { useState } from 'react';
import HubspotForm from '../../Blocks/HubspotForm/HubspotForm';

import './styles.scss';

const FormSteps = ({ title, description, bgImageUrl, form, variant, extraLogic, headerComponents }) => {
  const { firstForm, secondForm, legalText, secondStepIntroduction } = form[0];

  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState(null);
  const isFirstStep = currentStep === 0;

  const handleOnFirstStepSubmitted = (_, data) => {
    const emailSubmitted = data.submissionValues.email;
    setEmail(emailSubmitted);
    setCurrentStep(1);
  };

  const initializeSecondStepForm = (ctx) => {
    const inputs = document.querySelectorAll(`#hubspotForm-${secondForm.id} input`);
    const emailInput = document.querySelector(`#${ctx.id} input[name="email"]`);

    if (inputs.length > 1) {
      emailInput.value = email;
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));

      inputs[1].focus();
    }
  };

  return (
    <div className="container">
      {headerComponents}
      <div
        className={`ui-form-steps ${variant && isFirstStep ? variant : ''} ${isFirstStep ? 'first-step' : 'second-step'}`}
      >
        <div className="metadata">
          <h1>{isFirstStep ? title : 'Bijna klaar...'}</h1>
          <div dangerouslySetInnerHTML={{ __html: isFirstStep ? description : secondStepIntroduction }} />
          {isFirstStep ? (
            <HubspotForm
              key={currentStep}
              {...firstForm}
              onFormSubmitted={handleOnFirstStepSubmitted}
              style={variant ? variant : 'purple'}
              extraLogic={(ctx) => {
                extraLogic && extraLogic(ctx);
              }}
            />
          ) : (
            <HubspotForm
              key={currentStep}
              {...secondForm}
              extraLogic={(ctx) => {
                extraLogic && extraLogic(ctx);
                initializeSecondStepForm(ctx);
              }}
              style="gray"
            />
          )}
        </div>
        <div className="image-container">
          <img src={bgImageUrl} />
        </div>
      </div>
      <div className="legal-text" dangerouslySetInnerHTML={{ __html: legalText }} />
    </div>
  );
};

export default FormSteps;
