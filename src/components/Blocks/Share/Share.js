import React from 'react';
import SocialLinkList from '../../Global/SocialLink/SocialLinkList';
import CtaList from '../../Global/Cta/CtaList';
import { ReactSVG } from 'react-svg';
import wpIcon from '../../Icons/wp-icon.svg';
import { useTranslation } from 'gatsby-plugin-react-i18next';

import './styles.scss';

const Share = ({ block }) => {
  const { t } = useTranslation();
  const { title, socialLinks = [], ctas = [], whatsappGroup } = block;

  return (
    <div className="share-block">
      {title && <h3>{title}</h3>}

      {Array.isArray(socialLinks) && socialLinks.length > 0 && <SocialLinkList socialLinks={socialLinks} />}
      {Array.isArray(ctas) && ctas.length > 0 && <CtaList ctas={ctas} />}

      {whatsappGroup && (
        <a className="wp-button" href={`${whatsappGroup}`} target="_blank" rel="noopener noreferrer">
          <span>{t('join_whatsapp')}</span>
          <ReactSVG src={wpIcon} alt="Wp icon" />
        </a>
      )}
    </div>
  );
};

export default Share;
