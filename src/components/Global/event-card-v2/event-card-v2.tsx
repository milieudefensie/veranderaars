import React from 'react'; // @ts-expect-error
import { truncateText, formatEventDate, formatDateWithTimeCSL } from '../../../utils';
import Link from '../../Global/Link/link';
import Cta from '../Cta/cta';
import { CtaType, EventCollectionType, EventType } from '../../../types';

import './styles.scss';

type Props = {
  event: EventType;
  vertical?: boolean;
  isHighlighted?: boolean;
  lessInfo?: boolean;
  cta?: CtaType;
  collection?: EventCollectionType;
  isLocalGroup?: boolean;
  extraClassName?: string;
};

const PLACEHOLDER_IMAGE = 'https://www.datocms-assets.com/115430/1712234204-pattern-2500.png';

const EventCardV2: React.FC<Props> = ({
  event,
  vertical = false,
  isHighlighted = false,
  lessInfo,
  cta,
  collection,
  isLocalGroup = false,
  extraClassName,
}) => {
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
    rawDate,
    startInZone,
  } = event || {};

  const isCslEvent = __typename === 'ExternalEvent' || type === 'CSL';
  let mainImage = Array.isArray(additional_image_sizes_url)
    ? additional_image_sizes_url.find((i) => i.style === 'original')?.url
    : null;

  const withImage = mainImage || image?.gatsbyImageData || image?.url || image_url || PLACEHOLDER_IMAGE;

  const cardContent = () => (
    <>
      {withImage && (
        <div className="image-container">
          <img src={mainImage || image?.url || PLACEHOLDER_IMAGE} alt="Event" />
        </div>
      )}
      <div className="content-container">
        <div>
          <div className="date">
            {isCslEvent && event.rawDate ? (
              <span>{formatDateWithTimeCSL(rawDate, startInZone)}</span>
            ) : event.date ? (
              <>
                <span>{formatEventDate(event.date, event.hourStart, true)}</span>
              </>
            ) : null}
          </div>
          {collection && (
            <div className="collection-wrapper">
              <span>{collection.title}</span>
            </div>
          )}
          <h3>{title}</h3>
          <div className="type">
            <span className="type-child">
              {isCslEvent
                ? location?.locality || 'Online'
                : beknopteAddress
                  ? beknopteAddress
                  : address
                    ? address
                    : type}
            </span>

            {isLocalGroup && <span className="local-group">Door lokale groep</span>}
          </div>
          {introduction && (
            <div className="description" dangerouslySetInnerHTML={{ __html: truncateText(introduction, 200) }} />
          )}
        </div>

        {cta ? (
          <Cta cta={cta} isButton customVariant={isHighlighted ? 'full-green' : 'outline'} />
        ) : (
          <Cta externalTitle="Meld je aan" isButton customVariant={isHighlighted ? 'full-green' : 'outline'} off />
        )}
      </div>
    </>
  );

  if (externalLink) {
    return (
      <a
        href={externalLink || url}
        target={`${externalLink ? '' : '_blank'}`}
        className={`ui-event-card-v2 ${isHighlighted ? 'highlighted' : ''} ${withImage ? '' : 'no-image'} ${vertical ? 'vertical-layout' : ''} ${lessInfo ? 'less-info' : ''} ${extraClassName ? extraClassName : ''}`}
      >
        {cardContent()}
      </a>
    );
  }

  const link = event.__typename === 'EventCollection' ? cta : event;

  return (
    <Link
      to={link}
      className={`ui-event-card-v2 ${vertical ? 'vertical-layout' : ''} ${lessInfo ? 'less-info' : ''} ${extraClassName ? extraClassName : ''}`}
    >
      {cardContent()}
    </Link>
  );
};

export default EventCardV2;
