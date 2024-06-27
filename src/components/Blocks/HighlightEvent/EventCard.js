import React from 'react';
import ImageWrapper from '../../Global/Image/ImageWrapper';
import { formatDate, formatDateCSL, truncateText } from '../../../utils';
import TagList from '../../Global/Tag/TagList';
import Link from '../../Global/Link/Link';

import './styles.scss';

const EventCard = ({ event, isHighlighted = false }) => {
  const {
    __typename,
    type,
    title,
    introduction,
    image,
    image_url,
    date,
    rawDate,
    rawStartDate,
    rawEndDate,
    address,
    hourStart,
    hourEnd,
    tags = [],
    url,
    externalLink,
  } = event;

  const isCslEvent = __typename === 'ExternalEvent' || type === 'CSL';

  const renderContent = () => (
    <>
      <div className="metadata">
        {date && <span className="date">{isCslEvent ? formatDateCSL(rawDate) : formatDate(date)}</span>}

        <div className="venue">
          <span>
            {isCslEvent ? formatDateCSL(rawStartDate) : hourStart} {!isCslEvent && hourEnd ? `- ${hourEnd}` : ''}
            {isCslEvent && rawEndDate ? `- ${formatDateCSL(rawEndDate)}` : ''}
          </span>

          {address && <span>{address}</span>}
        </div>

        {Array.isArray(tags) && tags.length > 0 ? <TagList tags={tags} /> : <div className="tags-list" />}
      </div>

      <div className="basic-info">
        {title && <h4>{title}</h4>}
        {introduction && (
          <div className="introduction" dangerouslySetInnerHTML={{ __html: truncateText(introduction, 200) }} />
        )}

        <span className="custom-btn custom-btn-primary">Meld je aan</span>
      </div>

      {(image?.gatsbyImageData || image?.url || image_url) && (
        <div className="image">
          <ImageWrapper image={image || image_url} />
        </div>
      )}
    </>
  );

  if (externalLink) {
    return (
      <a
        href={externalLink || url}
        target={`${externalLink ? '' : '_blank'}`}
        className={`event-card ${isHighlighted ? 'highlighted' : ''}`}
      >
        {renderContent()}
      </a>
    );
  }

  return (
    <Link to={event} className={`event-card ${isHighlighted ? 'highlighted' : ''}`}>
      {renderContent()}
    </Link>
  );
};

export default EventCard;
