import React from 'react';
import './styles.scss';

const FloatLayout = ({ children, reduceOverlap, alternative = false }) => {
  return (
    <div className={`container float-layout ${reduceOverlap ? 'reduce' : ''} ${alternative ? 'alternative' : ''}`}>
      {children}
    </div>
  );
};

export default FloatLayout;
