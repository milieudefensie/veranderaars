import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

import './styles.scss';

const ConferenceDistributor = ({ conferenceUrl }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent);
      setIsMobile(isMobileDevice);
    };
    checkDevice();
  }, []);

  const detectService = (url) => {
    try {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;

      if (hostname.includes('whatsapp.com') || hostname.includes('whatsapp.net')) {
        return 'WhatsApp';
      } else if (hostname.includes('signal.org') || hostname.includes('signal.group')) {
        return 'Signal';
      } else if (hostname.includes('zoom.us')) {
        return 'Zoom';
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  };
  const service = detectService(conferenceUrl);

  if (!service) {
    console.warn('[CONFERENCE] No url set.');
    return null;
  }

  if (isMobile && (service === 'WhatsApp' || service === 'Signal')) {
    window.location.href = conferenceUrl;
    return <p className="redirect-message">Doorverwijzen naar {service}...</p>;
  }

  return (
    <section className="ui-conference-distributor">
      {service === 'WhatsApp' && !isMobile && <WhatsAppQR url={conferenceUrl} />}
      {service === 'Signal' && !isMobile && <SignalQR url={conferenceUrl} />}
      {service === 'Zoom' && <ZoomMessage />}
    </section>
  );
};

// Utils
const WhatsAppQR = ({ url }) => (
  <div className="ui-whatsapp-qr">
    <QRCodeSVG
      value={url}
      size={200}
      imageSettings={{
        src: '/whatsapp-icon.svg',
        x: undefined,
        y: undefined,
        height: 50,
        width: 50,
        opacity: 1,
        excavate: true,
      }}
    />
    <div>
      <p className="heading">Voor dit evenement is er een WhatsApp chat!</p>
      <p>Scan de QR code met je telefoon om op de hoogte gehouden te worden van de actie</p>
    </div>
  </div>
);

const SignalQR = ({ url }) => (
  <div className="ui-signal-qr">
    <QRCodeSVG
      id="signal-qr"
      value={url}
      size={200}
      imageSettings={{
        src: '/signal-icon.svg',
        x: undefined,
        y: undefined,
        height: 50,
        width: 50,
        opacity: 1,
        excavate: true,
      }}
      bgColor="#FFF"
      fgColor="#2c6bed"
    />
    <div>
      <p className="heading">Voor dit evenement is er een Signal chat!</p>
      <p>
        Heb je nog geen Signal?{' '}
        <a href="https://signal.org/download/" target="_blank" rel="noopener noreferrer">
          Downloaden
        </a>
      </p>
      <p>Scan de QR code met je telefoon om op de hoogte gehouden te worden van de actie</p>
    </div>
  </div>
);

const ZoomMessage = () => (
  <div className="ui-zoom-message">
    <img src="/zoom-icon.svg" alt="Zoom Logo" />
    <div>
      <p className="heading">Dit is een online evenement.</p>
      <p>Je ontvangt de zoomlink in je mail!</p>
    </div>
  </div>
);

export default ConferenceDistributor;
