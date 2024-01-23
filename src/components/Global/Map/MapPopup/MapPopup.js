import React from 'react';
import TagList from '../../Tag/TagList';
import { formatDate } from '../../../../utils';
import Cta from '../../Cta/Cta';

import './styles.scss';

const MapPopup = ({ card, linkTitle = 'Meld je aan' }) => {
  const { title, date, hourStart, hourEnd, address, image, tags, type, url, externalLink } = card;
  const isCslEvent = type === 'INTERNATIONAL' || externalLink;

  return (
    <article className="map-popup">
      {Array.isArray(tags) && (
        <div className="tags">
          <TagList tags={tags} />
        </div>
      )}

      {image?.url && (
        <div className="image">
          <img src={image.url} />
        </div>
      )}

      <div className="metadata">
        {date && (
          <h5>
            {formatDate(date)} | {hourStart} {hourEnd ? ` - ${hourEnd}` : ''}
          </h5>
        )}

        {address && <span>{address}</span>}
      </div>

      {title && <h2>{title}</h2>}

      {isCslEvent ? (
        <a
          href={externalLink || url}
          target={`${externalLink ? '' : '_blank'}`}
          className="custom-btn custom-btn-primary"
        >
          Meld je aan
        </a>
      ) : (
        <Cta cta={{ ...card, title: linkTitle, isButton: true }} />
      )}
    </article>
  );
};

export default MapPopup;
