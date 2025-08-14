import React, { useState, useEffect } from 'react';
import { navigate } from 'gatsby';
import { useLocation } from '@reach/router';
import HubspotForm from '../../Blocks/HubspotForm/HubspotForm';

import './styles.scss';

interface FormStep {
  id: string;
  title?: string;
  introductionText?: string;
  disclaimerText?: string;
  formId: string;
  portalId: string;
  region: string;
  signalChat?: string;
  [key: string]: any;
}

interface FormStepsProps {
  title?: string;
  description?: string;
  bgImageUrl?: string;
  form: { forms?: FormStep[] }[];
  variant?: string;
  varianExtraSteps?: string;
  wrapperClassname?: string;
  formCustomVariant?: string;
  extraLogic?: (ctx: any) => void;
  headerComponents?: React.ReactNode;
  descriptionAsHtml?: boolean;
  noStyle?: boolean;
}

const FormSteps: React.FC<FormStepsProps> = ({
  title,
  description,
  bgImageUrl,
  form,
  variant,
  varianExtraSteps,
  wrapperClassname,
  formCustomVariant,
  extraLogic,
  headerComponents,
  descriptionAsHtml = false,
  noStyle = false,
}) => {
  const location = useLocation();
  const { forms = [] } = form[0] || {};

  const getInitialStep = (): number => {
    if (typeof window !== 'undefined') {
      const query = new URLSearchParams(window.location.search);
      const stepParam = parseInt(query.get('form_step') || '', 10);
      return !isNaN(stepParam) && stepParam > 0 ? stepParam - 1 : 0;
    }
    return 0;
  };

  const [currentStep, setCurrentStep] = useState<number>(getInitialStep);
  const [email, setEmail] = useState<string | null>(null);

  const isFirstStep = currentStep === 0;

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const stepParam = parseInt(query.get('form_step') || '', 10);
    if (!isNaN(stepParam) && stepParam > 0 && stepParam <= forms.length) {
      setCurrentStep(stepParam - 1);
    } else {
      setCurrentStep(0);
    }
  }, [location.search, forms.length]);

  const handleStepSubmitted = (_: any, data: any) => {
    if (data?.submissionValues?.email) {
      setEmail(data.submissionValues.email);
    }
    const nextStep = currentStep + 1;
    if (nextStep < forms.length) {
      navigate(`?form_step=${nextStep + 1}`, { replace: false });
    }
  };

  const initializeForm = (ctx: { id: string }) => {
    const formId = forms[currentStep]?.id;
    if (!formId) return;

    const inputs = document.querySelectorAll<HTMLInputElement>(`#hubspotForm-${formId} input`);
    const emailInput = document.querySelector<HTMLInputElement>(`#${ctx.id} input[name="email"]`);

    if (inputs.length > 1 && emailInput && email) {
      emailInput.value = email;
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
      inputs[1].focus();
    }
  };

  return (
    <div
      className={`container container-steps ${wrapperClassname ? wrapperClassname : ''} ${noStyle ? 'no-style' : ''}`}
    >
      {headerComponents}
      <div
        className={`ui-form-steps2 ${
          variant && isFirstStep ? variant : ''
        } ${!isFirstStep && varianExtraSteps ? varianExtraSteps : ''} ${isFirstStep ? 'first-step' : 'second-step'}`}
      >
        <div className="metadata">
          {(title || forms[currentStep]?.title) && <h1>{isFirstStep ? title : forms[currentStep]?.title}</h1>}
          {isFirstStep && description ? (
            descriptionAsHtml ? (
              <div>{description}</div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: description }} />
            )
          ) : (
            <div
              dangerouslySetInnerHTML={{
                __html: forms[currentStep]?.introductionText || '',
              }}
            />
          )}

          {Array.isArray(forms) && forms.length > 0 && forms[currentStep] && (
            <HubspotForm
              key={forms[currentStep]?.id}
              {...forms[currentStep]}
              onFormSubmitted={handleStepSubmitted}
              style={formCustomVariant ? formCustomVariant : isFirstStep ? variant || 'purple' : 'gray'}
              extraLogic={(ctx) => {
                extraLogic?.(ctx);
                initializeForm(ctx);
              }}
            />
          )}
        </div>
        <div className="image-container">
          <img src={bgImageUrl} alt={`${title}`} />
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
