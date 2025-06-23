import React from 'react';
import { CtaType, EventType } from '../../../types';
import { truncateText, formatEventDate, formatDateCSL } from '../../../utils';
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
    additional_image_sizes_url,
    externalLink,
    url,
    __typename,
    type,
    location,
    address,
    beknopteAddress,
    collection,
    startInZone,
  } = event || {};

  const isCslEvent = __typename === 'ExternalEvent' || type === 'CSL';
  let mainImage = Array.isArray(additional_image_sizes_url)
    ? additional_image_sizes_url.find((i) => i.style === 'original')?.url
    : null;

  const withImage = mainImage || image?.gatsbyImageData || image?.url || image_url;

  const cardContent = () => (
    <>
      {withImage && (
        <div className="image-container">
          <img src={mainImage || image?.url} alt="Event" />
        </div>
      )}
      <div className="content-container">
        <div>
          {collection && <div className="collection-wrapper">{collection.title}</div>}
          <h3>{title}</h3>
          <div className="type">
            {isCslEvent ? location?.locality || 'Online' : beknopteAddress ? beknopteAddress : address ? address : type}
          </div>
          <div className="date">
            {isCslEvent && event.rawDate ? (
              <span id={event.rawDate}>
                {formatEventDate(event.rawDate)} {formatDateCSL(startInZone)}
              </span>
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

  const link = event.__typename === 'EventCollection' ? cta : event;

  return (
    <Link to={link} className={`ui-event-card-v2 ${vertical ? 'vertical-layout' : ''} ${lessInfo ? 'less-info' : ''}`}>
      {cardContent()}
    </Link>
  );
};

export default EventCardV2;
