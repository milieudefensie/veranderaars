import React from 'react';
import './index.scss';

const Tag = ({ tag }) => {
  if (!tag) return null;

  const { title } = tag;

  return <span className="tag">{title}</span>;
};

export default Tag;
