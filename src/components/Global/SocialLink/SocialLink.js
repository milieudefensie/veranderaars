import React from 'react';
import Link from '../Link/Link';
import { ReactSVG } from 'react-svg';

import facebookIcon from '../../Icons/job-facebook.svg';
import twitterIcon from '../../Icons/job-x.svg';
import linkedinIcon from '../../Icons/job-linkedin.svg';
import instagramIcon from '../../Icons/instagram.svg';

const SocialMap = {
  linkedin: linkedinIcon,
  twitter: twitterIcon,
  facebook: facebookIcon,
  instagram: instagramIcon,
};

const SocialLink = ({ name, url }) => {
  const socialImg = SocialMap[name];

  return (
    <Link to={url} target="_blank">
      <ReactSVG height={50} src={socialImg} alt={name} />
    </Link>
  );
};

export default SocialLink;
