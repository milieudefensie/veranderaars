import React from 'react';
import Link from '../Link/link';
import { ReactSVG } from 'react-svg';
// @ts-expect-error
import facebookIcon from '../../Icons/job-facebook.svg'; // @ts-expect-error
import twitterIcon from '../../Icons/job-x.svg'; // @ts-expect-error
import linkedinIcon from '../../Icons/job-linkedin.svg'; // @ts-expect-error
import instagramIcon from '../../Icons/instagram.svg';

type SocialName = 'linkedin' | 'twitter' | 'facebook' | 'instagram';

interface SocialLinkProps {
  name: SocialName;
  url: string;
  whiteIcons?: boolean;
  smallIcons?: boolean;
  isLanding?: boolean;
}

const SocialMap: Record<SocialName, string> = {
  linkedin: linkedinIcon,
  twitter: twitterIcon,
  facebook: facebookIcon,
  instagram: instagramIcon,
};

const SocialLink: React.FC<SocialLinkProps> = ({ name, url }) => {
  const socialImg = SocialMap[name];

  return (
    <Link to={url} target="_blank">
      <ReactSVG height={50} src={socialImg} />
    </Link>
  );
};

export default SocialLink;
