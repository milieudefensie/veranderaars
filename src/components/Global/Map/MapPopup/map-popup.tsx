import React from 'react';
import TagList from '../../Tag/tag-list'; // @ts-expect-error
import { formatDate, formatDateCSL } from '../../../../utils';
import Cta from '../../Cta/cta';
import Link from '../../Link/link';
import { useTranslate } from '@tolgee/react';

import './styles.scss';

interface MapPopupCard {
  slug: string;
  title: string;
  rawDate: string | null;
  hourStart: string;
  hourEnd: string | null;
  address: string | null;
  signalChat: string | null;
  image: {
    url: string;
  };
  tags: string[];
  type: string;
  whatsappGroup: string | null;
  url: string | null;
  externalLink: string | null;
  startInZone: string | null;
  endInZone: string | null;
}

interface MapPopupProps {
  card?: MapPopupCard;
  cards?: MapPopupCard[];
  linkTitle?: string;
  cardType?: string;
}

const MapPopup: React.FC<MapPopupProps> = ({ card, cards, linkTitle = 'Meld je aan', cardType = 'default' }) => {
  const { t } = useTranslate();

  if (Array.isArray(cards) && cards.length > 1) {
    return (
      <article className={`map-popup cluster-list ${cardType ? cardType : ''}`}>
        <h2>{t('multiple_events_here')}</h2>
        <ul className="cluster-list-items">
          {cards.map((c: any) => {
            const isCslEvent = c.type === 'CSL';
            const dateLabel = isCslEvent
              ? c.startInZone && formatDateCSL(c.startInZone)
              : c.rawDate && formatDate(c.rawDate);

            const content = (
              <>
                <strong>{c.title}</strong>
                {dateLabel && <span>{dateLabel}</span>}
              </>
            );

            if (c.externalLink) {
              return (
                <li key={c.id || c.slug}>
                  <a href={c.externalLink} target="_blank" rel="noopener noreferrer">
                    {content}
                  </a>
                </li>
              );
            }

            if (isCslEvent) {
              return (
                <li key={c.id || c.slug}>
                  <Link to={`/lokaal/${c.slug}`}>{content}</Link>
                </li>
              );
            }

            if (c.type === 'QOMON') {
              return (
                <li key={c.id || c.slug} className="not-clickable">
                  {content}
                </li>
              );
            }

            return (
              <li key={c.id || c.slug}>
                <Link to={c as any}>{content}</Link>
              </li>
            );
          })}
        </ul>
      </article>
    );
  }

  const singleCard = card || cards?.[0];
  if (!singleCard) return null;

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
    signalChat,
    url,
    externalLink,
    startInZone,
    endInZone,
  } = singleCard;
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
          {t('whatsapp_community')}
        </a>
      ) : cardType === 'signal' ? (
        <Cta
          cta={{ ...singleCard, title: 'Open Signal', isButton: true, style: 'primary' }}
          customVariant={'orange'}
          predefinedUrl={signalChat}
        />
      ) : isCslEvent ? (
        <Link to={`/lokaal/${slug}`} className="custom-btn custom-btn-primary">
          {t('sign_up')}
        </Link>
      ) : externalLink ? (
        <a href={externalLink} target="_blank" rel="noopener noreferrer" className="custom-btn custom-btn-primary">
          {t('sign_up')}
        </a>
      ) : (
        <Cta
          cta={{
            ...singleCard,
            title: cardType === 'group' ? 'Bekijk groep' : linkTitle,
            isButton: true,
            style: 'primary',
          }}
          customVariant={cardType === 'group' ? 'group-v2' : ''}
        />
      )}
    </article>
  );
};

export default MapPopup;
