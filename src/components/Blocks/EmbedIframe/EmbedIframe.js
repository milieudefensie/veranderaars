import React, { useEffect, useRef, useState } from 'react';
import './index.scss';

function EmbedIframe({ content }) {
  const containerRef = useRef(null);
  const [addAsHTML, setAddAsHtml] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const contentHasEventixScript = content.iframeCode.includes('https://shop.eventix.io/build/integrate.js');

    if (!contentHasEventixScript) {
      setAddAsHtml(true);
      return;
    }

    containerRef.current.innerHTML = '';

    // Crear e insertar el div con el ID requerido por Eventix.
    const eventixIdFromScript = content.iframeCode.match(/data-url="([^"]+)"/)[1];

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
        console.log('Script de Eventix cargado y ejecutado');
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
      dangerouslySetInnerHTML={{ __html: addAsHTML ? content.iframeCode : null }}
    />
  );
}

export default EmbedIframe;
