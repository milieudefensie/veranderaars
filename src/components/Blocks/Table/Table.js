import React from 'react';
import './index.scss';

function Table({ content }) {
  return (
    <div className="responsive-table">
      <div dangerouslySetInnerHTML={{ __html: content.table }} />
    </div>
  );
}

export default Table;
