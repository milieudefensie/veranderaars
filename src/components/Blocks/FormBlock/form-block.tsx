import React from 'react';
import HubspotForm from '../HubspotForm/HubspotForm'; // @ts-expect-error
import formVector from '../../Icons/new-form-icon.svg';

import './styles.scss';

interface HubspotConfig {
  id: string;
  formId: string;
  region: string;
  portalId: string;
  columns: number;
}

interface FormBlockProps {
  block: {
    title?: string;
    description?: string;
    hubspot: HubspotConfig;
    variant?: string;
  };
  isHomepage?: boolean;
}

const FormBlock: React.FC<FormBlockProps> = ({ block, isHomepage = false }) => {
  const { title, description, hubspot, variant = null } = block;
  const withTopTitle = variant === 'top-title' || description;

  return (
    <div className={`form-block-wrapper ${isHomepage ? 'home-form' : ''}`}>
      <div className={`form-block`}>
        <div className={`row`}>
          {title && (
            <div className={`${withTopTitle ? 'col-lg-12' : 'col-lg-3'}`}>
              <h2>{title}</h2>

              {description && <div className="description" dangerouslySetInnerHTML={{ __html: description }} />}
              {!description && <img className="left-img" src={formVector} alt="Form icon" />}
            </div>
          )}

          {/* Hubspot form */}
          <div className="col-lg">
            <HubspotForm
              id={hubspot.id}
              formId={hubspot.formId}
              region={hubspot.region}
              portalId={hubspot.portalId}
              columns={hubspot.columns}
              style="default"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormBlock;
