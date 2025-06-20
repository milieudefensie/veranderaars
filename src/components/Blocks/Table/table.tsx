import React from 'react';
import './index.scss';

interface TableProps {
  content: {
    table: string;
  };
}

const Table: React.FC<TableProps> = ({ content }) => {
  return (
    <div className="responsive-table">
      <div dangerouslySetInnerHTML={{ __html: content.table }} />
    </div>
  );
};

export default Table;
