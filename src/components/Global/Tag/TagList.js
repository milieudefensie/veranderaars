import React from 'react';
import Tag from './Tag';
import { isArray } from '../../../utils';

import './index.scss';

const TagList = ({ tags }) => {
  if (!isArray(tags)) return null;

  return (
    <div className="tags-list">
      {tags.map((tag) => (
        <Tag tag={tag} key={tag.id} />
      ))}
    </div>
  );
};

export default TagList;
