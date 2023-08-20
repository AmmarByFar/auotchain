import { useState } from 'react';

export default function usePagination(items = [], itemsPerPage = 10) {
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = items.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(items.length / itemsPerPage);

  return {
    currentItems: currentItems,
    pageCount,
    itemOffset,
    handlePageClick: (event) => {
      const newOffset = (event.selected * itemsPerPage) % items.length;
      setItemOffset(newOffset);
    },
  };
}
