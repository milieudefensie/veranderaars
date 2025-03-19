import React, { useEffect, useRef } from 'react';
import './index.scss';

function EmbedIframe({ content }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const scripts = containerRef.current.getElementsByTagName('script');
      for (let script of scripts) {
        const newScript = document.createElement('script');
        newScript.src = script.src;
        newScript.async = true;
        document.body.appendChild(newScript);
      }
    }
  }, [content]);

  return <div ref={containerRef} className="embed-iframe" dangerouslySetInnerHTML={{ __html: content.iframeCode }} />;
}

export default EmbedIframe;
