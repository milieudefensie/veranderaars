import React from 'react';
import SocialLinkList from '../../Global/SocialLink/social-link-list';
import CtaList from '../../Global/Cta/cta-list';
import { ReactSVG } from 'react-svg';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import wpIcon from '../../Icons/wp-icon.svg';

import './styles.scss';

interface SocialLink {
  id: string;
  title: string;
  url: string;
  icon?: string;
  [key: string]: any;
}

interface Cta {
  id: string;
  title: string;
  url: string;
  [key: string]: any;
}

interface ShareBlockProps {
  block: {
    title?: string;
    socialLinks?: SocialLink[];
    ctas?: Cta[];
    whatsappGroup?: string;
  };
}

const Share: React.FC<ShareBlockProps> = ({ block }) => {
  const { t } = useTranslation();
  const { title, socialLinks = [], ctas = [], whatsappGroup } = block;

  return (
    <div className="share-block">
      {title && <h3>{title}</h3>}

      {Array.isArray(socialLinks) && socialLinks.length > 0 && <SocialLinkList socialLinks={socialLinks} />}
      {Array.isArray(ctas) && ctas.length > 0 && <CtaList ctas={ctas} />}

      {whatsappGroup && (
        <a className="wp-button" href={whatsappGroup} target="_blank" rel="noopener noreferrer">
          <span>{t('join_whatsapp')}</span>
          <ReactSVG src={wpIcon} />
        </a>
      )}
    </div>
  );
};

export default Share;
