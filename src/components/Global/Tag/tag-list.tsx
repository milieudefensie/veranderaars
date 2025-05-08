import React from 'react';
import Tag from './tag';
import { isArray } from '../../../utils';

import './index.scss';

type TagType = {
  id: string | number;
  title: string;
};

type TagListProps = {
  tags?: TagType[] | null;
};

const TagList: React.FC<TagListProps> = ({ tags }) => {
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
