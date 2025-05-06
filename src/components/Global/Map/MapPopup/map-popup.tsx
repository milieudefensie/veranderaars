import React from 'react';
import TagList from '../../Tag/tag-list';
import { formatDate, formatDateCSL } from '../../../../utils';
import Cta from '../../Cta/Cta';
import Link from '../../Link/Link';
import { useTranslation } from 'gatsby-plugin-react-i18next';

import './styles.scss';

interface MapPopupProps {
  card: {
    slug: string;
    title: string;
    rawDate: string | null;
    hourStart: string;
    hourEnd: string | null;
    address: string | null;
    image: {
      url: string;
    };
    tags: string[];
    type: string;
    whatsappGroup: string | null;
    url: string | null;
    externalLink: string | null;
    startInZone: string | null;
    endInZone: string | null;
  };
  linkTitle?: string;
  cardType?: string;
}

const MapPopup: React.FC<MapPopupProps> = ({ card, linkTitle = 'Meld je aan', cardType = 'default' }) => {
  const { t } = useTranslation();

  const {
    slug,
    title,
    rawDate,
    hourStart,
    hourEnd,
    address,
    image,
    tags,
    type,
    whatsappGroup,
    url,
    externalLink,
    startInZone,
    endInZone,
  } = card;
  const isCslEvent = type === 'CSL';
  const withTags = Array.isArray(tags) && tags.length > 0;

  return (
    <article className={`map-popup ${cardType ? cardType : ''} ${withTags ? 'with-tags' : 'no-tags'}`}>
      {withTags && (
        <div className="tags">
          <TagList tags={tags} />
        </div>
      )}

      {image?.url && (
        <div className="image">
          <img src={image.url} alt={`${title}`} />
        </div>
      )}
      {(rawDate || address) && (
        <div className="metadata">
          {rawDate && (
            <h5>
              {isCslEvent ? (
                <>
                  {formatDate(startInZone)} | {startInZone ? formatDateCSL(startInZone) : ''}{' '}
                  {endInZone ? ` - ${formatDateCSL(endInZone)}` : ''}
                </>
              ) : (
                <>
                  {formatDate(rawDate)} | {hourStart} {hourEnd ? ` - ${hourEnd}` : ''}
                </>
              )}
            </h5>
          )}

          {address && <span>{address}</span>}
        </div>
      )}
      {title && <h2>{title}</h2>}

      {cardType === 'wp-group' ? (
        <a href={whatsappGroup} target={`_blank`} className="custom-btn custom-btn-primary">
          {t('whatsapp_community')}
        </a>
      ) : isCslEvent ? (
        <Link to={`/lokaal/${slug}`} className="custom-btn custom-btn-primary">
          {t('sign_up')}
        </Link>
      ) : externalLink ? (
        <a
          href={externalLink || url}
          target={`${externalLink ? '' : '_blank'}`}
          className="custom-btn custom-btn-primary"
        >
          {t('sign_up')}
        </a>
      ) : (
        <Cta cta={{ ...card, title: linkTitle, isButton: true, style: 'primary' }} />
      )}
    </article>
  );
};

export default MapPopup;
