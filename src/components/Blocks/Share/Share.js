import React from 'react';
import SocialLinkList from '../../Global/SocialLink/SocialLinkList';
import CtaList from '../../Global/Cta/CtaList';
import { ReactSVG } from 'react-svg';
import wpIcon from '../../Icons/wp-icon.svg';
import { useTranslate } from '@tolgee/react';

import './styles.scss';

const Share = ({ block }) => {
  const { t } = useTranslate();
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
