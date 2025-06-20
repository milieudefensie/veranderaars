import React, { useEffect, useRef, useState } from 'react';
import './index.scss';

interface EmbedIframeProps {
  content: {
    iframeCode: string;
  };
}

const EmbedIframe: React.FC<EmbedIframeProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [addAsHtml, setAddAsHtml] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const contentHasEventixScript = content.iframeCode.includes('https://shop.eventix.io/build/integrate.js');

    if (!contentHasEventixScript) {
      setAddAsHtml(true);
      return;
    }

    containerRef.current.innerHTML = '';

    const eventixIdFromScript = content.iframeCode.match(/data-url="([^"]+)"/)?.[1];

    if (!eventixIdFromScript) {
      console.error('No se pudo encontrar el ID de Eventix');
      return;
    }

    const div = document.createElement('div');
    div.id = 'shop-frame';
    div.style.maxWidth = '600px';
    div.style.margin = '0 auto';
    div.setAttribute('data-url', eventixIdFromScript);

    containerRef.current.appendChild(div);

    if (!document.querySelector('script[src="https://shop.eventix.io/build/integrate.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://shop.eventix.io/build/integrate.js';
      script.async = true;
      script.onload = () => {
        // console.log('Script de Eventix cargado y ejecutado');
      };
      document.body.appendChild(script);
    } else {
      console.log('Script de Eventix ya estaba cargado.');
    }
  }, [content]);

  return (
    <div
      ref={containerRef}
      className="embed-iframe"
      dangerouslySetInnerHTML={{ __html: addAsHtml ? content.iframeCode : '' }}
    />
  );
};

export default EmbedIframe;
