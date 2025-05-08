import React, { useState, useEffect, useMemo } from 'react';
import Pagination, { PAGE_SIZE } from './pagination';

interface ListPaginatedProps<T> {
  list: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  resetPage?: any;
  customPageSize?: number;
  extraLogic?: () => void;
}

function ListPaginated<T>({
  list,
  renderItem,
  resetPage = null,
  customPageSize = PAGE_SIZE,
  extraLogic,
}: ListPaginatedProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (resetPage) {
      setCurrentPage(1);
    }
  }, [resetPage]);

  const listPaginated = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * customPageSize;
    const lastPageIndex = firstPageIndex + customPageSize;
    return list.slice(firstPageIndex, lastPageIndex);
  }, [list, currentPage, customPageSize]);

  return (
    <>
      {listPaginated.map((item, index) => renderItem(item, index))}

      <Pagination
        pageSize={customPageSize}
        currentPage={currentPage}
        totalCount={list.length}
        onPageChange={(page) => {
          setCurrentPage(page);
          if (extraLogic) {
            extraLogic();
          }
        }}
      />
    </>
  );
}

export default ListPaginated;
