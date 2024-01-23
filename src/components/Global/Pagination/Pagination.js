import React from 'react';
import { usePagination, DOTS } from './hooks/usePagination';

import './index.scss';

export const PAGE_SIZE = 12;

const Pagination = (props) => {
  const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  // If there are less than 2 times in pagination range we shall not render the component
  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  return (
    <ul className={'pagination-container'}>
      {paginationRange.map((pageNumber) => {
        // If the pageItem is a DOT, render the DOTS unicode character
        if (pageNumber === DOTS) {
          return (
            <li key={`${pageNumber}-dots`} className="pagination-item dots">
              &#8230;
            </li>
          );
        }

        // Render our Page Pills
        return (
          <li
            key={pageNumber}
            className={`${pageNumber === currentPage ? 'pagination-item' : ''} ${
              pageNumber === currentPage ? 'active' : ''
            }`}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}
    </ul>
  );
};

export default Pagination;
