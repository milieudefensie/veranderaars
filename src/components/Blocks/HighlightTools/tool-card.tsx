import React from 'react';
import ImageWrapper from '../../Global/Image/image-wrapper';
import CtaList from '../../Global/Cta/cta-list';
import { ReactSVG } from 'react-svg';
import Link from '../../Global/Link/link';

import './styles.scss';

interface Icon {
  url: string;
}

export interface Tool {
  id?: string;
  title?: string;
  introduction?: string;
  image?: { gatsbyImageData: any; url: string } | null;
  icon?: Icon | null;
  cta?: { url: string; label: string }[];
  iconFontPicker?: string;
  backgroundColor?: string;
}

interface ToolCardProps {
  tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
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
