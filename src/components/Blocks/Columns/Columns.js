import React from 'react';
import Blocks from '../../Blocks';

import './styles.scss';

const Columns = ({ block }) => {
  const { firstColumn, secondColumn } = block;

  return (
    <div id="block-columns" className="block-columns">
      <div className="first">
        <Blocks blocks={firstColumn} />
      </div>
      <div className="second">
        <Blocks blocks={secondColumn} />
      </div>
    </div>
  );
};

export default Columns;
