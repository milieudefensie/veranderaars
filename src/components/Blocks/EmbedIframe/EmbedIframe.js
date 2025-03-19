import React, { useEffect, useRef, useState } from 'react';
import './index.scss';

function EmbedIframe({ content }) {
  const containerRef = useRef(null);
  const [scriptCreated, setScriptCreated] = useState(false);

  useEffect(() => {
    if (containerRef.current) {
      const scripts = containerRef.current.getElementsByTagName('script');
      for (let script of scripts) {
        console.log({ src: script.src, exist: document.querySelector(`script[src="${script.src}"]`) });

        if (script.src && scriptCreated === false) {
          const newScript = document.createElement('script');
          newScript.src = script.src;
          newScript.async = true;
          document.body.appendChild(newScript);
          setScriptCreated(true);
        }
      }
    }
  }, [content]);

  return <div ref={containerRef} className="embed-iframe" dangerouslySetInnerHTML={{ __html: content.iframeCode }} />;
}

export default EmbedIframe;
