import React, { ReactNode } from 'react';
import './styles.scss';

interface WrapperLayoutProps {
  variant?: 'white' | 'light' | string;
  responsiveVariant?: string;
  children: ReactNode;
}

const WrapperLayout: React.FC<WrapperLayoutProps> = ({ variant, responsiveVariant, children }) => {
  return <div className={`wrapper-layout ${variant ?? ''} ${responsiveVariant ?? ''}`}>{children}</div>;
};

export default WrapperLayout;
