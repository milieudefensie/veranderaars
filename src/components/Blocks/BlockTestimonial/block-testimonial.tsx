import React from 'react';
import './styles.scss';

const BlockTestimonial: React.FC<{
  block: {
    id: string;
    authorName: string;
    content: string;
    authorImage: {
      url: string;
      alt: string;
    };
  };
}> = ({ block }) => {
  return (
    <div className="ui-block-testimonial">
      <div className="avatar">
        <div>
          <img alt={block.authorImage.alt} src={block.authorImage.url} />
        </div>
      </div>
      <div className="name">{block.authorName}</div>
      <div className="content">{block.content}</div>
    </div>
  );
};

export default BlockTestimonial;
