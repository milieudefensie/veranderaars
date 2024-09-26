import React from 'react';
import SocialLinkList from '../../Global/SocialLink/SocialLinkList';
import SocialMediaWidget from '../SocialMediaWidget/SocialMediaWidget';

import './index.scss';

const FollowUs = ({ block }) => {
  return (
    <div className="follow-us-block">
      <div className="container">
        <div className="row">
          <div className="basic-information">
            {block.title && <h2>{block.title}</h2>}
            {block.preTitle && <h3>{block.preTitle}</h3>}
          </div>

          {block.socialLinks && (
            <div>
              <SocialLinkList socialLinks={block.socialLinks} />
            </div>
          )}

          {block.widget && block.widget[0] && (
            <div>
              <SocialMediaWidget block={block.widget[0]} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowUs;
