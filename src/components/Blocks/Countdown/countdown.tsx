import React from 'react';
import { useTimer } from 'react-timer-hook';
import { useTranslate } from '@tolgee/react';

import './styles.scss';

interface CountDownProps {
  block: {
    headline: string;
    date: string;
    successMessage?: string;
    colorVariant?: string;
  };
}

const CountDown: React.FC<CountDownProps> = ({ block }) => {
  const { t } = useTranslate();
  const { headline, date, successMessage, colorVariant } = block;

  const expiryTimestamp = Date.parse(date);
  const { seconds, minutes, hours, days, isRunning } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn('onExpire called'),
  });

  return (
    <div className="countdown-wrapper">
      <div id="countdown" className={`countdown ${colorVariant}`}>
        <h2>{headline}</h2>

        <div className="">
          {isRunning && (
            <div className="countdown-container">
              <div className="item-countdown">
                <span>{days}</span>
                {t('days')}
              </div>
              <div className="item-countdown">
                <span>{hours}</span>
                {t('hours')}
              </div>
              <div className="item-countdown">
                <span>{minutes}</span>
                {t('minutes')}
              </div>
              <div className="item-countdown">
                <span>{seconds}</span>
                {t('seconds')}
              </div>
            </div>
          )}

          {!isRunning && (
            <div className="success-container">{successMessage && <p className="success">{successMessage}</p>}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountDown;
