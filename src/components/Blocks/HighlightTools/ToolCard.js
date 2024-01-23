import React from 'react';
import ImageWrapper from '../../Global/Image/ImageWrapper';
import CtaList from '../../Global/Cta/CtaList';
import { ReactSVG } from 'react-svg';
import Link from '../../Global/Link/Link';

import './styles.scss';

const ToolCard = ({ tool }) => {
  const { title, introduction, image, icon, cta = [], iconFontPicker, backgroundColor } = tool;
  const googleFontIcon = iconFontPicker ? JSON.parse(iconFontPicker) : '';

  const hasLink = Array.isArray(cta) && cta.length > 0;

  const renderContent = () => {
    return (
      <>
        {image && (
          <div className="image">
            <ImageWrapper image={image} />
          </div>
        )}

        <div className="content-tool">
          <div>
            {googleFontIcon ? (
              <div className="icon">
                <span className="material-symbols-outlined">{googleFontIcon?.icon}</span>
              </div>
            ) : icon?.url ? (
              <div className="icon">
                <ReactSVG src={icon.url} />
              </div>
            ) : (
              <></>
            )}

            {title && <h3>{title}</h3>}
            {introduction && <div className="introduction" dangerouslySetInnerHTML={{ __html: introduction }} />}
          </div>

          {hasLink && <CtaList ctas={cta} off />}
        </div>
      </>
    );
  };

  if (hasLink) {
    return (
      <Link to={cta[0]} className={`tool-card ${backgroundColor ? backgroundColor : ''}`}>
        {renderContent()}
      </Link>
    );
  }

  return <div className={`tool-card ${backgroundColor ? backgroundColor : ''}`}>{renderContent()}</div>;
};

export default ToolCard;
