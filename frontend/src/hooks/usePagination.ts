import { useState } from 'react';

export const usePagination = (
  initialPage = 0,
  initialLimit = 10,
  totalCount = 0
) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const maxPage = Math.max(Math.ceil(totalCount / limit) - 1, 0);

  const nextPage = () => setPage((prev) => (prev < maxPage ? prev + 1 : prev));
  const prevPage = () => setPage((prev) => Math.max(prev - 1, 0));
  const resetPage = () => setPage(0);

  return {
    page,
    limit,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    resetPage,
    offset: page * limit,
    maxPage,
  };
};
