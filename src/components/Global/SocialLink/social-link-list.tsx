import React from 'react'; // @ts-expect-error
import { isArray } from '../../../utils';
import SocialLink from './social-link';

import './index.scss';

type SocialName = 'linkedin' | 'twitter' | 'facebook' | 'instagram';

export interface SocialLinkItem {
  socialNetwork: SocialName;
  url: string;
}

interface SocialLinkListProps {
  socialLinks?: SocialLinkItem[];
  whiteIcons?: boolean;
  smallIcons?: boolean;
  isLanding?: boolean;
}

const SocialLinkList: React.FC<SocialLinkListProps> = ({
  socialLinks = [],
  whiteIcons = false,
  smallIcons = false,
  isLanding = false,
}) => {
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
