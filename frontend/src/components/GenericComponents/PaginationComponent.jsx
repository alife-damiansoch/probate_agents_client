import  { useState } from 'react';

function PaginationComponent({
  totalItems,
  itemsPerPage,
  currentPage,
  setCurrentPage,
  onPageChange,
  setItemsPerPage,
}) {
  const [hoveredPage, setHoveredPage] = useState(null);

  const handleSelect = (pageNum) => {
    onPageChange(pageNum);
  };

  const options = [2, 50, 100, 200];
  const pagesCount = Math.ceil(totalItems / itemsPerPage);
  let pages = [];
  for (let number = 1; number <= pagesCount; number++) {
    pages.push(
      <li
        className={`page-item ${number === currentPage ? 'active' : ''}`}
        key={number}
        role='presentation'
      >
        <button
          className='page-link'
          style={{
            backgroundColor: hoveredPage === number ? '#f0f0f0' : 'white',
            color: hoveredPage === number ? 'black' : 'blue',
            padding: '0.25rem 0.5rem',
            fontSize: '0.875rem',
          }}
          onMouseEnter={() => setHoveredPage(number)}
          onMouseLeave={() => setHoveredPage(null)}
          onClick={() => handleSelect(number)}
        >
          {number}
        </button>
      </li>
    );
  }

  const handleClick = (value) => {
    if (value !== itemsPerPage) {
      setItemsPerPage(value);
      setCurrentPage(1);
    }
  };

  return (
    <>
      <hr />
      <div className='row justify-content-center'>
        <nav
          aria-label='Page navigation example'
          className='col-12 col-md-auto mx-auto'
        >
          <ul className='pagination pagination-sm flex-wrap justify-content-center'>
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className='page-link'
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                onClick={
                  currentPage > 1
                    ? () => handleSelect(currentPage - 1)
                    : undefined
                }
              >
                Previous
              </button>
            </li>
            {pages}
            <li
              className={`page-item ${
                currentPage === pagesCount ? 'disabled' : ''
              }`}
            >
              <button
                className='page-link'
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                onClick={
                  currentPage < pagesCount
                    ? () => handleSelect(currentPage + 1)
                    : undefined
                }
              >
                Next
              </button>
            </li>
          </ul>
        </nav>

        <div className='col-12 text-center mt-2'>
          <div
            className='btn-group btn-group-sm'
            role='group'
            aria-label='Items per page'
          >
            {options.map((option) => (
              <button
                key={option}
                type='button'
                className={`btn btn-link p-1 ${
                  option === itemsPerPage ? 'disabled' : 'text-info'
                }`}
                onClick={() => handleClick(option)}
                style={{ cursor: 'pointer' }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default PaginationComponent;
