import React from 'react';
import TagList from '../../Tag/TagList';
import { formatDate, formatDateCSL } from '../../../../utils';
import Cta from '../../Cta/Cta';
import Link from '../../Link/Link';

import './styles.scss';

const MapPopup = ({ card, linkTitle = 'Meld je aan', cardType = 'default' }) => {
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
          WhatsApp Community
        </a>
      ) : isCslEvent ? (
        <Link to={`/lokaal/${slug}`} className="custom-btn custom-btn-primary">
          Meld je aan
        </Link>
      ) : externalLink ? (
        <a
          href={externalLink || url}
          target={`${externalLink ? '' : '_blank'}`}
          className="custom-btn custom-btn-primary"
        >
          Meld je aan
        </a>
      ) : (
        <Cta cta={{ ...card, title: linkTitle, isButton: true, style: 'primary' }} />
      )}
    </article>
  );
};

export default MapPopup;
