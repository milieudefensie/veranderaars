import React from 'react';
import TagList from '../../Tag/TagList';
import { formatDate } from '../../../../utils';
import Cta from '../../Cta/Cta';
import Link from '../../Link/Link';

import './styles.scss';

const MapPopup = ({ card, linkTitle = 'Meld je aan' }) => {
  const { slug, title, rawDate, hourStart, hourEnd, address, image, tags, type, url, externalLink } = card;
  const isCslEvent = type === 'CSL';

  return (
    <article className="map-popup">
      {Array.isArray(tags) && (
        <div className="tags">
          <TagList tags={tags} />
        </div>
      )}

      {image?.url && (
        <div className="image">
          <img src={image.url} alt={`${title}`} />
        </div>
      )}

      <div className="metadata">
        {rawDate && (
          <h5>
            {formatDate(rawDate)} | {hourStart} {hourEnd ? ` - ${hourEnd}` : ''}
          </h5>
        )}

        {address && <span>{address}</span>}
      </div>

      {title && <h2>{title}</h2>}

      {isCslEvent ? (
        <Link to={`/agenda/${slug}`} className="custom-btn custom-btn-primary">
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
