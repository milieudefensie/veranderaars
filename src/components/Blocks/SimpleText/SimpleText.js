import React from 'react';
import './index.scss';

function SimpleText({ block, custom = false, limitedWidth = false, container = true, extraClassNames = null }) {
  return (
    <div id="simple-text-block" className={`simple-text-wrapper ${extraClassNames ? extraClassNames : ''}`}>
      <div className={`${custom ? '' : `${container ? 'container' : ''}`}`}>
        <div className={`simple-text ${limitedWidth ? 'limited-with' : ''}`}>
          <div className={`${custom ? '' : 'row'}`}>
            <div className={`${custom ? '' : 'col'}`}>
              <div dangerouslySetInnerHTML={{ __html: block.text }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleText;
