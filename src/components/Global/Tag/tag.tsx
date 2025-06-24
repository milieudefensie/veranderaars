import React from 'react';
import './index.scss';

type TagProps = {
  tag?: {
    title: string;
  } | null;
};

const Tag: React.FC<TagProps> = ({ tag }) => {
  if (!tag) return null;

  const { title } = tag;

  return <span className="tag">{title}</span>;
};

export default Tag;
