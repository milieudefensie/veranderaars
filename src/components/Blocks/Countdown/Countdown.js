import React from 'react';
import { useTimer } from 'react-timer-hook';

import './styles.scss';

export default function CountDown({ block }) {
  const { headline, date, successMessage, colorVariant } = block;

  const expiryTimestamp = Date.parse(date);
  const { seconds, minutes, hours, days, isRunning } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn('onExpire called'),
  });

  return (
    <div id="countdown" className={`countdown ${colorVariant}`}>
      <h2>{headline}</h2>

      <div className="">
        {isRunning && (
          <div className="countdown-container">
            <div className="item-countdown">
              <span>{days}</span>
              days
            </div>
            <div className="item-countdown">
              <span>{hours}</span>
              hours
            </div>
            <div className="item-countdown">
              <span>{minutes}</span>
              minutes
            </div>
            <div className="item-countdown">
              <span>{seconds}</span>
              seconds
            </div>
          </div>
        )}

        {!isRunning && (
          <div className="success-container">{successMessage && <p className="success">{successMessage}</p>}</div>
        )}
      </div>
    </div>
  );
}
