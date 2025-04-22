import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import { useLocation } from '@reach/router';
import HubspotForm from '../../Blocks/HubspotForm/HubspotForm';

import './styles.scss';

const FormSteps = ({ title, description, bgImageUrl, form, variant, extraLogic, headerComponents }) => {
  const { firstForm, secondForm, legalText, firstStepIntroduction, secondStepIntroduction } = form[0];
  const location = useLocation();

  const [currentStep, setCurrentStep] = useState(location.search.includes('form_step=2') ? 1 : 0);
  const [email, setEmail] = useState(null);
  const isFirstStep = currentStep === 0;

  useEffect(() => {
    if (location.search.includes('form_step=2')) {
      setCurrentStep(1);
    } else {
      setCurrentStep(0);
    }
  }, [location]);

  const handleOnFirstStepSubmitted = (_, data) => {
    const emailSubmitted = data.submissionValues.email;
    setEmail(emailSubmitted);
    navigate('?form_step=2', { replace: false });
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
    <div className="container container-steps">
      {headerComponents}
      <div
        className={`ui-form-steps ${variant && isFirstStep ? variant : ''} ${isFirstStep ? 'first-step' : 'second-step'}`}
      >
        <div className="metadata">
          <h1>{isFirstStep ? title : 'Bijna klaar...'}</h1>
          <div
            dangerouslySetInnerHTML={{
              __html: isFirstStep ? firstStepIntroduction || description : secondStepIntroduction,
            }}
          />
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
      <div
        className={`legal-text ${isFirstStep ? 'first-step' : 'second-step'}`}
        dangerouslySetInnerHTML={{ __html: legalText }}
      />
    </div>
  );
};

export default FormSteps;
