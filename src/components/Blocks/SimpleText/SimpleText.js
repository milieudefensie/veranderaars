import React from 'react';
import './index.scss';

function SimpleText({ block, limitedWidth = false, extraClassNames = null }) {
  return (
    <div id="simple-text-block" className={`simple-text-wrapper ${extraClassNames ? extraClassNames : ''}`}>
      <div className={`simple-text ${limitedWidth ? 'limited-with' : ''}`}>
        <div dangerouslySetInnerHTML={{ __html: block.text }} />
      </div>
    </div>
  );
}

export default SimpleText;
