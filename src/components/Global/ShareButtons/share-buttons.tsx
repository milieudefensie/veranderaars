import React, { useEffect, useState } from 'react';
import Link from '../Link/link';
import telegram from '../../Icons/wp-share.svg';
import facebook from '../../Icons/facebook-share.svg';
import twitter from '../../Icons/twitter-share.svg';
import { useTranslation } from 'gatsby-plugin-react-i18next';

import './index.scss';

function ShareButtons(): JSX.Element {
  const { t } = useTranslation();
  const [isFixed, setIsFixed] = useState<string>('');
  const [shareUrl, setShareUrl] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
      window.addEventListener('scroll', isSticky);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', isSticky);
      }
    };
  }, []);

  const isSticky = (): void => {
    const topHero = document.querySelector('.header')?.clientHeight || 0;
    const topContent = document.querySelector('.main-content')?.clientHeight || 0;
    const scrollTop = window.scrollY;

    if (scrollTop >= topHero && scrollTop <= topContent) {
      setIsFixed('show');
    } else {
      setIsFixed('');
    }
  };

  return (
    <div className={`share-buttons-fixed ${isFixed}`}>
      <div className="telegram">
        <Link target="_blank" to={`https://t.me/share/url?url=${shareUrl}`}>
          <img src={telegram} alt="Telegram icon" />
        </Link>
      </div>

      <div className="facebook">
        <Link target="_blank" to={`http://www.facebook.com/share.php?u=${shareUrl}`}>
          <img src={facebook} alt="Facebook icon" />
        </Link>
      </div>

      <div className="twitter">
        <Link target="_blank" to={`http://twitter.com/share?url=${shareUrl}`}>
          <img src={twitter} alt="Twitter icon" />
        </Link>
      </div>

      <span>{t('share_label')}</span>
    </div>
  );
}

export default ShareButtons;
