import React from 'react';
import './index.scss';

function EmbedIframe({ content }) {
  return <div className="embed-iframe" dangerouslySetInnerHTML={{ __html: content.iframeCode }} />;
}

export default EmbedIframe;
