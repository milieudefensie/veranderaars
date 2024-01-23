import React from 'react';
import './styles.scss';

const FloatLayout = ({ children, reduceOverlap }) => {
  return <div className={`float-layout ${reduceOverlap ? 'reduce' : ''}`}>{children}</div>;
};

export default FloatLayout;
