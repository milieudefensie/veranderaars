import React from 'react';
import './index.scss';

interface SimpleTextBlockProps {
  block: {
    text: string;
  };
  limitedWidth?: boolean;
  extraClassNames?: string | null;
}

const SimpleText: React.FC<SimpleTextBlockProps> = ({ block, limitedWidth = false, extraClassNames = null }) => {
  return (
    <div id="simple-text-block" className={`simple-text-wrapper ${extraClassNames ? extraClassNames : ''}`}>
      <div className={`simple-text ${limitedWidth ? 'limited-with' : ''}`}>
        <div dangerouslySetInnerHTML={{ __html: block.text }} />
      </div>
    </div>
  );
};

export default SimpleText;
