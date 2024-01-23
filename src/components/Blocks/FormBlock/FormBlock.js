import React from 'react';
import formVector from '../../Icons/form-vector.svg';
import HubspotForm from '../HubspotForm/HubspotForm';

import './styles.scss';

function FormBlock({ block }) {
  const { title, description, hubspot } = block;

  return (
    <div className="form-block-wrapper">
      <div className="container">
        <div className={`form-block`}>
          <img className="left-img" src={formVector} alt="Form icon" />

          <div className="form-container-content">
            <div className={`row`}>
              {title && (
                <div className={`${description ? 'col-lg-12' : 'col-lg-3'}`}>
                  <h2>{title}</h2>

                  {description && <div className="description" dangerouslySetInnerHTML={{ __html: description }} />}
                </div>
              )}

              {/* Hubspot form */}
              <div className="col-lg">
                <HubspotForm
                  id={hubspot.id}
                  formId={hubspot.formId}
                  region={hubspot.region}
                  portalId={hubspot.portalId}
                  style="default"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormBlock;
