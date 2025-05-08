import React from 'react';
import './index.scss';

interface CtaHandlerProps {
  title: string;
  icon?: React.ReactNode | null;
  handleOnClick: () => void;
  isPrimaryButton?: boolean;
  variant?: string;
}

const CtaHandler: React.FC<CtaHandlerProps> = ({
  title,
  icon = null,
  handleOnClick,
  isPrimaryButton = false,
  variant,
}) => {
  return (
    <div
      className={`custom-btn with-handler ${isPrimaryButton ? 'custom-btn-primary' : ''} ${variant ? variant : ''}`}
      onClick={handleOnClick}
    >
      {title || 'Klik hier'}
      {icon && icon}
    </div>
  );
};

export default CtaHandler;
