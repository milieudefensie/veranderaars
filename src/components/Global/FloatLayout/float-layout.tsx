import React, { ReactNode } from 'react';
import './styles.scss';

interface FloatLayoutProps {
  children: ReactNode;
  reduceOverlap?: boolean;
  alternative?: boolean;
}

const FloatLayout: React.FC<FloatLayoutProps> = ({ children, reduceOverlap = false, alternative = false }) => {
  return (
    <div className={`container float-layout ${reduceOverlap ? 'reduce' : ''} ${alternative ? 'alternative' : ''}`}>
      {children}
    </div>
  );
};

export default FloatLayout;
