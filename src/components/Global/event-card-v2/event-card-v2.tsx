import React from 'react';
import { CtaType, EventType } from '../../../types';
import { truncateText, formatEventDate, formatDate } from '../../../utils';
import Link from '../../Global/Link/Link';
import Cta from '../Cta/Cta';

import './styles.scss';

type Props = {
  event: EventType;
  vertical?: boolean;
  isHighlighted?: boolean;
  lessInfo?: boolean;
  cta?: CtaType;
};

const EventCardV2: React.FC<Props> = ({ event, vertical = false, isHighlighted = false, lessInfo, cta }) => {
  const {
    title,
    introduction,
    image,
    image_url,
    externalLink,
    url,
    __typename,
    type,
    location,
    address,
    beknopteAddress,
    collection,
  } = event || {};

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
          <div className="type">
            {isCslEvent ? location?.street : beknopteAddress ? beknopteAddress : address ? address : type}
          </div>
          <div className="date">
            {isCslEvent && event.rawDate ? (
              <span id={event.rawDate}>{formatDate(event.rawDate)}</span>
            ) : event.date ? (
              <>
                <span id={`${event.date}--${event.hourStart}`}>{formatEventDate(event.date, event.hourStart)}</span>
              </>
            ) : null}
          </div>
          <div className="description" dangerouslySetInnerHTML={{ __html: truncateText(introduction, 200) }} />
        </div>

        {cta ? (
          <Cta cta={cta} isButton customVariant="full-green" />
        ) : (
          <Cta externalTitle="Meld je aan" isButton customVariant="full-green" off />
        )}
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
