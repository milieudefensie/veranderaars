import React from 'react';
import { useEffect } from 'react';

const SocialMediaWidget = ({ block }) => {
  const { widgetId } = block;

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.charset = 'UTF-8';
    script.src = `https://cdn.curator.io/published/${widgetId}.js`;

    const div = document.getElementById('curator-feed-default-feed-layout');
    div.appendChild(script);

    return () => {
      div.removeChild(script);
    };
  }, []);

  return (
    <div id="curator-feed-default-feed-layout">
      <a href="https://curator.io" target="_blank" rel="noopener noreferrer" className="crt-logo crt-tag">
        Powered by Curator.io
      </a>
    </div>
  );
};

export default SocialMediaWidget;
