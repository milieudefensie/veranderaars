import React from 'react';
import { EventType } from '../../../types';
import { truncateText } from '../../../utils';
import Link from '../../Global/Link/Link';
import TagList from '../../Global/Tag/TagList';

import './styles.scss';

type Props = {
  event: EventType;
  vertical?: boolean;
  isHighlighted?: boolean;
};

const EventCardV2: React.FC<Props> = ({ event, vertical = false, isHighlighted = false }) => {
  const { title, introduction, image, image_url, tags, externalLink, url, __typename, type } = event || {};

  const isCslEvent = __typename === 'ExternalEvent' || type === 'CSL';
  const withImage = image?.gatsbyImageData || image?.url || image_url;

  const cardContent = () => (
    <>
      <div className="image-container">
        <img src={image?.url} alt="Event" />
      </div>
      <div className="content-container">
        <div>
          {Array.isArray(tags) && tags.length > 0 ? <TagList tags={tags} /> : null}
          <h3>{title}</h3>
          <div className="type">Online</div>
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
        className={`event-card ${isHighlighted ? 'highlighted' : ''} ${withImage ? '' : 'no-image'}`}
      >
        {cardContent()}
      </a>
    );
  }

  return (
    <Link to={event} className={`ui-event-card-v2 ${vertical ? 'vertical-layout' : ''}`}>
      {cardContent()}
    </Link>
  );
};

export default EventCardV2;
