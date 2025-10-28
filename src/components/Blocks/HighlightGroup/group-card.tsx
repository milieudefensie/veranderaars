import React from 'react';
import Link from '../../Global/Link/link';
import Cta from '../../Global/Cta/cta';
import { CtaType } from '../../../types';

import './styles.scss';

interface Group {
  title: string;
  image: { gatsbyImageData: any; url: string } | null;
  whatsappGroup?: string;
  cta?: CtaType[];
}

interface GroupCardProps {
  group: Group;
  redirectToWhatsappGroup?: boolean;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, redirectToWhatsappGroup = false }) => {
  const { title, image, whatsappGroup } = group;
  const withImage = image?.gatsbyImageData || image?.url;

  const renderContent = () => (
    <>
      {withImage && (
        <div className="image-container">
          <img src={image?.url} alt={title} />
        </div>
      )}
      <div className="content-container">
        <h4>{title}</h4>

        <Cta externalTitle="Bekijk groep" isButton customVariant="group-v2" off />
      </div>
    </>
  );

  if (redirectToWhatsappGroup && whatsappGroup) {
    return (
      <a className="group-card" href={whatsappGroup} target="_blank" rel="noopener noreferrer">
        {renderContent()}
      </a>
    );
  }

  return (
    // @ts-ignore
    <Link to={group} className="group-card-v2">
      {renderContent()}
    </Link>
  );
};

export default GroupCard;
