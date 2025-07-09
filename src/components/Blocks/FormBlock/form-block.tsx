import React from 'react';
import HubspotForm from '../HubspotForm/HubspotForm'; // @ts-expect-error
import formVector from '../../Icons/new-form-icon.svg';
import FormSteps from '../../Global/FormSteps/FormSteps';
import { useEffect } from 'react';

import './styles.scss';

interface HubspotConfig {
  id: string;
  formId: string;
  region: string;
  portalId: string;
  columns: number;
  title: string;
  disclaimerText: string;
  introductionText: string;
}

interface FormBlockProps {
  block: {
    title?: string;
    description?: string;
    hubspot: HubspotConfig;
    formSteps?: HubspotConfig[];
    variant?: string;
  };
  isHomepage?: boolean;
}

const FormBlock: React.FC<FormBlockProps> = ({ block, isHomepage = false }) => {
  const { title, description, hubspot, formSteps, variant = null } = block;

  useEffect(() => {
    const { search } = location;
    const params = new URLSearchParams(search);
    const hasFormStep = params.has('form_step');

    if (hasFormStep) {
      const target = document.querySelector('.form-block-wrapper.with-steps');
      if (target) {
        const offset = 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'auto' });
      }
    }
  }, []);

  const withTopTitle = variant === 'top-title' || description;
  const withFormSteps = formSteps && formSteps.length > 0;

  return (
    <div className={`form-block-wrapper ${withFormSteps ? 'with-steps' : ''} ${isHomepage ? 'home-form' : ''}`}>
      <div className={`form-block`}>
        <div className={`row`}>
          {!withFormSteps && title && (
            <div className={`${withTopTitle ? 'col-lg-12' : 'col-lg-3'}`}>
              <h2>{title}</h2>

              {description && <div className="description" dangerouslySetInnerHTML={{ __html: description }} />}
              {!description && <img className="left-img" src={formVector} alt="Form icon" />}
            </div>
          )}

          <div className="col-lg">
            {!withFormSteps ? (
              <HubspotForm
                id={hubspot.id}
                formId={hubspot.formId}
                region={hubspot.region}
                portalId={hubspot.portalId}
                columns={hubspot.columns}
                style="default"
              />
            ) : (
              <FormSteps
                title={formSteps[0].title}
                form={[{ forms: formSteps }]}
                wrapperClassname="parent"
                variant="internal"
                varianExtraSteps="remove"
                formCustomVariant="gray"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBlock;
