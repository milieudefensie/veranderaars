import React from 'react';
import Cta from '../../Global/Cta/cta';
import { CtaType } from '../../../types';

import './styles.scss';

interface Group {
  title: string;
  image: { gatsbyImageData: any; url: string } | null;
  whatsappGroup?: string;
  cta?: CtaType[];
  signalChat?: string;
}

interface GroupCardProps {
  group: Group;
  redirectToWhatsappGroup?: boolean;
}

const GroupSignalCard: React.FC<GroupCardProps> = ({ group }) => {
  const { title, image, signalChat } = group;
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

        <Cta externalTitle="Open Signal" isButton customVariant="group-v2 orange" off />
      </div>
    </>
  );

  return (
    // @ts-ignore
    <a className="group-card-v2" href={signalChat} target="_blank" rel="noopener noreferrer">
      {renderContent()}
    </a>
  );
};

export default GroupSignalCard;
