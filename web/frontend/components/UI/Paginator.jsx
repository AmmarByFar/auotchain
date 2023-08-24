import React from 'react';
import ReactPaginate from 'react-paginate';

export default function Paginator({ pageCount, handlePageClick }) {
  return (
    <ReactPaginate
      previousLabel="Previous"
      nextLabel="Next"
      pageClassName="page-link"
      pageLinkClassName="page-link"
      previousClassName="nav-item"
      previousLinkClassName="page-link"
      nextClassName="nav-item"
      breakLabel="..."
      breakClassName="page-link"
      breakLinkClassName="page-link"
      pageCount={pageCount}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={handlePageClick}
      containerClassName="pagination"
      activeClassName="active"
    />
  );
}
