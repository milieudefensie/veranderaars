import React from 'react';
import Blocks, { Block } from '../../blocks';

import './styles.scss';

interface ColumnBlock {
  firstColumn: Block[];
  secondColumn: Block[];
}

interface ColumnsProps {
  block: ColumnBlock;
}

const Columns: React.FC<ColumnsProps> = ({ block }) => {
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
