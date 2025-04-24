import React from 'react';
import { EventType } from '../../../types';
import { truncateText, formatEventDate, formatDateCSL, formatDate } from '../../../utils';
import Link from '../../Global/Link/Link';

import './styles.scss';

type Props = {
  event: EventType;
  vertical?: boolean;
  isHighlighted?: boolean;
  lessInfo?: boolean;
};

const EventCardV2: React.FC<Props> = ({ event, vertical = false, isHighlighted = false, lessInfo }) => {
  const { title, introduction, image, image_url, externalLink, url, __typename, type, location, address, collection } =
    event || {};

  const isCslEvent = __typename === 'ExternalEvent' || type === 'CSL';
  const withImage = image?.gatsbyImageData || image?.url || image_url;

  const cardContent = () => (
    <>
      {withImage && (
        <div className="image-container">
          <img src={image?.url} alt="Event" />
        </div>
      )}
      <div className="content-container">
        <div>
          {collection && <div className="collection-wrapper">{collection.title}</div>}
          <h3>{title}</h3>
          <div className="type">{isCslEvent ? location?.street : address ? address : type}</div>
          <div className="date">
            {isCslEvent ? (
              <span>{formatDate(event.rawDate)}</span>
            ) : (
              <>
                <span>{formatEventDate(event.date, event.hourStart)}</span>
              </>
            )}
          </div>
          <div className="description" dangerouslySetInnerHTML={{ __html: truncateText(introduction, 200) }} />
        </div>

        <span className="btn">Meld je aan</span>
      </div>
    </>
  );

  if (externalLink) {
    return (
      <a
        href={externalLink || url}
        target={`${externalLink ? '' : '_blank'}`}
        className={`ui-event-card-v2 ${isHighlighted ? 'highlighted' : ''} ${withImage ? '' : 'no-image'} ${vertical ? 'vertical-layout' : ''} ${lessInfo ? 'less-info' : ''} `}
      >
        {cardContent()}
      </a>
    );
  }

  return (
    <Link to={event} className={`ui-event-card-v2 ${vertical ? 'vertical-layout' : ''} ${lessInfo ? 'less-info' : ''}`}>
      {cardContent()}
    </Link>
  );
};

export default EventCardV2;
