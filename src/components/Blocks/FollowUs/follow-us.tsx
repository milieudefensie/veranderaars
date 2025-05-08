import React from 'react';
import SocialLinkList from '../../Global/SocialLink/social-link-list';
import SocialMediaWidget from '../SocialMediaWidget/social-media-widget';

import './index.scss';

interface SocialLink {
  url: string;
  platform: string;
}

interface Widget {
  id: string;
  title: string;
}

interface FollowUsProps {
  block: {
    title?: string;
    preTitle?: string;
    socialLinks?: SocialLink[];
    widget?: Widget[];
  };
}

const FollowUs: React.FC<FollowUsProps> = ({ block }) => {
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
