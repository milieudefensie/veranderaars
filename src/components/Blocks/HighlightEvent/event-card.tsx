import React, { useEffect, useState } from 'react';
import ImageWrapper from '../../Global/Image/image-wrapper'; // @ts-expect-error
import { formatDate, formatDateCSL, truncateText, cleanLocation } from '../../../utils';
import TagList from '../../Global/Tag/tag-list';
import Link from '../../Global/Link/link';
import axios from 'axios';
import { useTranslate } from '@tolgee/react';
import Spinner from '../../Global/Spinner/spinner';
import { EventType } from '../../../types';

import './styles.scss';

interface EventCardProps {
  event: EventType;
  isHighlighted?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, isHighlighted = false }) => {
  const { t } = useTranslate();

  const {
    __typename,
    type,
    slug,
    title,
    introduction,
    image,
    image_url,
    date,
    rawDate,
    rawEndDate,
    startInZone,
    endInZone,
    address,
    hourStart,
    hourEnd,
    tags = [],
    url,
    externalLink,
    hiddenAddress = false,
    max_attendees_count,
  } = event;

  const [isWaitingListActive, setIsWaitingListActive] = useState(false);
  const [status, setStatus] = useState<'loading' | 'idle'>('loading');

  useEffect(() => {
    const checkIfEventHasReachedLimit = async () => {
      const response = await axios.post('/api/get-csl-attendees', {
        data: { slug, max_attendees_count },
      });
      const { isWaitingListActive, attendeesCount } = response.data;

      setIsWaitingListActive(isWaitingListActive);
      setStatus('idle');
    };

    if (isCslEvent && max_attendees_count) {
      checkIfEventHasReachedLimit();
    } else {
      setStatus('idle');
    }
  }, [slug, max_attendees_count]);

  const isCslEvent = __typename === 'ExternalEvent' || type === 'CSL';
  const withImage = image?.gatsbyImageData || image?.url || image_url;

  const formattedTitle = isWaitingListActive && !title.includes('[VOL]') ? `[VOL] ${title}` : title;

  const renderContent = () => (
    <>
      <div className="metadata">
        {date && <span className="date">{isCslEvent ? formatDate(rawDate) : formatDate(date)}</span>}

        <div className="venue">
          <span>
            {isCslEvent ? formatDateCSL(startInZone) : hourStart} {!isCslEvent && hourEnd ? `- ${hourEnd}` : ''}
            {isCslEvent && rawEndDate ? `- ${formatDateCSL(endInZone)}` : ''}
          </span>

          {address && !hiddenAddress && <span>{cleanLocation(address)}</span>}
        </div>

        {Array.isArray(tags) && tags.length > 0 ? <TagList tags={tags} /> : null}
      </div>

      <div className="basic-info">
        {formattedTitle && <h4>{formattedTitle}</h4>}
        {introduction && (
          <div className="introduction" dangerouslySetInnerHTML={{ __html: truncateText(introduction, 200) }} />
        )}

        <span className="custom-btn custom-btn-primary">
          {status === 'loading' ? <Spinner /> : isWaitingListActive ? t('waiting_list_message') : t('sign_up')}
        </span>
      </div>

      {withImage && (
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
        className={`event-card ${isHighlighted ? 'highlighted' : ''} ${withImage ? '' : 'no-image'}`}
      >
        {renderContent()}
      </a>
    );
  }

  return (
    <Link to={event} className={`event-card ${isHighlighted ? 'highlighted' : ''} ${withImage ? '' : 'no-image'}`}>
      {renderContent()}
    </Link>
  );
};

export default EventCard;
