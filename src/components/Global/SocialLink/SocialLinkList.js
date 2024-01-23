import React from 'react';
import { isArray } from '../../../utils';
import SocialLink from './SocialLink';

import './index.scss';

const SocialLinkList = ({ socialLinks = [], whiteIcons = false, smallIcons = false, isLanding = false }) => {
  return (
    <>
      {isArray(socialLinks) && (
        <div className="social-icons">
          {socialLinks.map((social, index) => (
            <SocialLink
              key={`${social.url}-${index}`}
              name={social.socialNetwork}
              url={social.url}
              whiteIcons={whiteIcons}
              smallIcons={smallIcons}
              isLanding={isLanding}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default SocialLinkList;
