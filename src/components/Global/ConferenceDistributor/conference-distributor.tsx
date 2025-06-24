import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // @ts-expect-error
import { detectService } from '../../../utils';
import { useTranslate } from '@tolgee/react';

import './styles.scss';

interface ConferenceDistributorProps {
  conferenceUrl: string;
}

const ConferenceDistributor: React.FC<ConferenceDistributorProps> = ({ conferenceUrl }) => {
  const { t } = useTranslate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent);
      setIsMobile(isMobileDevice);
    };
    checkDevice();
  }, []);

  const service = detectService(conferenceUrl);

  if (!service) {
    console.warn('[CONFERENCE] No url set.');
    return null;
  }

  if (isMobile && service === 'WhatsApp') {
    return (
      <p className="redirect-message">
        <p className="heading">{t('conference_mobile_whatsapp_message', { service })}</p>
        <a className="wp-btn" href={conferenceUrl} target="_blank" rel="noopener noreferrer">
          {t('whatsapp_open')}
        </a>
      </p>
    );
  }

  return (
    <section className="ui-conference-distributor">
      {service === 'WhatsApp' && !isMobile && <WhatsAppQR url={conferenceUrl} />}
      {service === 'Signal' && !isMobile && <SignalQR url={conferenceUrl} />}
      {service === 'Zoom' && <ZoomMessage url={conferenceUrl} />}
    </section>
  );
};

// Utils
interface QRProps {
  url: string;
}

const WhatsAppQR: React.FC<QRProps> = ({ url }) => {
  const { t } = useTranslate();
  return (
    <div className="ui-whatsapp-qr">
      <QRCodeSVG
        id="whatsapp-qr"
        value={url}
        size={200}
        imageSettings={{
          src: '/whatsapp-icon.svg',
          x: undefined,
          y: undefined,
          height: 30,
          width: 30,
          opacity: 1,
          excavate: true,
        }}
        bgColor="#F5F5F5"
      />
      <div>
        <p className="heading">{t('conference_whatsapp_chat')}</p>
        <p>{t('conference_scan_qr')}</p>
        <a className="wp-btn" href={url} target="_blank" rel="noopener noreferrer">
          {t('whatsapp_open_computer')}
        </a>
      </div>
    </div>
  );
};

const SignalQR: React.FC<QRProps> = ({ url }) => {
  const { t } = useTranslate();
  return (
    <div className="ui-signal-qr">
      <QRCodeSVG
        id="signal-qr"
        value={url}
        size={200}
        imageSettings={{
          src: '/signal-icon3.svg',
          x: undefined,
          y: undefined,
          height: 30,
          width: 30,
          opacity: 1,
          excavate: true,
        }}
        bgColor="#F5F5F5"
      />
      <div>
        <p className="heading">{t('conference_signal_chat')}</p>
        <p>
          {t('conference_signal_label')}{' '}
          <a href="https://signal.org/download/" target="_blank" rel="noopener noreferrer">
            {t('download')}
          </a>
        </p>
        <p>{t('conference_scan_qr')}</p>
      </div>
    </div>
  );
};

const ZoomMessage: React.FC<{ url: string }> = ({ url }) => {
  const { t } = useTranslate();
  return (
    <div className="ui-zoom-message">
      <div className="img">
        <svg xmlns="http://www.w3.org/2000/svg" width="200" height="45" viewBox="0 0 200 45" fill="none">
          <g clipPath="url(#clip0_1825_11205)">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M162.837 13.4943C163.602 14.8149 163.852 16.3175 163.934 18.0066L164.043 20.258V36.0014L164.154 38.2552C164.376 41.9359 167.087 44.6574 170.791 44.889L173.03 45V20.258L173.141 18.0066C173.233 16.3364 173.481 14.8055 174.257 13.4754C175.048 12.1112 176.184 10.9793 177.55 10.1935C178.916 9.40763 180.465 8.99544 182.04 8.99831C183.616 9.00119 185.163 9.41901 186.526 10.2098C187.889 11.0007 189.021 12.1367 189.807 13.5038C190.571 14.8244 190.81 16.3553 190.902 18.0066L191.012 20.2509V36.0014L191.123 38.2552C191.355 41.9548 194.045 44.6763 197.761 44.889L200 45V18.0066C200 13.2334 198.107 8.65567 194.736 5.27987C191.366 1.90406 186.795 0.00661053 182.027 0.00473123C179.476 0.00203702 176.953 0.544563 174.628 1.59606C172.302 2.64757 170.228 4.18383 168.543 6.10222C166.857 4.18459 164.782 2.64869 162.457 1.59688C160.132 0.545067 157.609 0.00148951 155.058 0.00236833C151.325 0.00236833 147.861 1.13635 144.992 3.09482C143.241 1.13871 139.324 0.00236833 137.076 0.00236833V45L139.324 44.889C143.085 44.6409 145.804 41.9926 145.95 38.2552L146.07 36.0014V20.258L146.181 18.0066C146.275 16.308 146.511 14.8149 147.278 13.4849C148.07 12.1215 149.205 10.9899 150.57 10.2031C151.935 9.41627 153.483 9.00176 155.058 9.00095C156.634 9.00129 158.183 9.41662 159.548 10.2053C160.913 10.994 162.048 12.1282 162.837 13.4943ZM8.98752 44.8913L11.2362 45H44.9423L44.8314 42.7557C44.527 39.0561 41.9103 36.3534 38.2034 36.1125L35.9548 36.0014H15.7335L42.6937 8.99859L42.5828 6.75662C42.4082 3.01922 39.6805 0.318938 35.9548 0.113403L33.7061 0.0118179L0 0.00236833L0.110899 2.25379C0.405842 5.91795 3.06033 8.67729 6.73651 8.88992L8.98752 9.00095H29.2088L2.24865 36.0038L2.35955 38.2552C2.58135 41.9642 5.25471 44.6504 8.98752 44.889V44.8913ZM128.253 6.58889C130.34 8.67805 131.996 11.1584 133.125 13.8882C134.255 16.6181 134.836 19.544 134.836 22.4988C134.836 25.4537 134.255 28.3796 133.125 31.1094C131.996 33.8393 130.34 36.3196 128.253 38.4088C124.037 42.627 118.32 44.9966 112.359 44.9966C106.399 44.9966 100.682 42.627 96.4654 38.4088C87.6902 29.6228 87.6902 15.3748 96.4654 6.58889C98.5505 4.50042 101.026 2.84363 103.751 1.7131C106.475 0.582578 109.396 0.000466373 112.345 5.42372e-06C115.299 -0.00204809 118.225 0.579038 120.955 1.71003C123.684 2.84102 126.164 4.49971 128.253 6.59125V6.58889ZM121.894 12.9604C124.422 15.493 125.842 18.9268 125.842 22.5071C125.842 26.0874 124.422 29.5212 121.894 32.0538C119.365 34.5844 115.935 36.006 112.359 36.006C108.783 36.006 105.354 34.5844 102.824 32.0538C100.297 29.5212 98.877 26.0874 98.877 22.5071C98.877 18.9268 100.297 15.493 102.824 12.9604C105.354 10.4297 108.783 9.00817 112.359 9.00817C115.935 9.00817 119.365 10.4297 121.894 12.9604ZM65.1825 5.42372e-06C68.132 0.000776633 71.0525 0.583261 73.7772 1.71419C76.5019 2.84513 78.9773 4.50236 81.0623 6.59125C89.8398 15.3748 89.8398 29.6252 81.0623 38.4088C76.8458 42.627 71.129 44.9966 65.1684 44.9966C59.2077 44.9966 53.491 42.627 49.2744 38.4088C40.4993 29.6228 40.4993 15.3748 49.2744 6.58889C51.3596 4.50042 53.8351 2.84363 56.5598 1.7131C59.2845 0.582578 62.2048 0.000466373 65.1542 5.42372e-06H65.1825ZM74.7033 12.9557C77.2316 15.4884 78.6518 18.9227 78.6518 22.5035C78.6518 26.0844 77.2316 29.5187 74.7033 32.0514C72.1738 34.5821 68.7442 36.0036 65.1684 36.0036C61.5925 36.0036 58.1629 34.5821 55.6334 32.0514C53.1059 29.5188 51.686 26.085 51.686 22.5047C51.686 18.9244 53.1059 15.4907 55.6334 12.9581C58.1629 10.4274 61.5925 9.00581 65.1684 9.00581C68.7442 9.00581 72.1738 10.4274 74.7033 12.9581V12.9557Z"
              fill="white"
            />
          </g>
          <defs>
            <clipPath id="clip0_1825_11205">
              <rect width="200" height="45" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
      <div>
        <p className="heading">{t('conference_zoom_chat')}</p>
        <p className="link">
          {t('conference_zoom_link')}{' '}
          <a href={url} target="_blank">
            {url}
          </a>
        </p>
      </div>
    </div>
  );
};

export default ConferenceDistributor;
