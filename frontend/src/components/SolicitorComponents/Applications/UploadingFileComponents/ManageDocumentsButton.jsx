const ManageDocumentsButton = ({ onClick }) => {
  return (
    <button
      className='btn px-4 py-2 fw-semibold rounded-3 d-inline-flex align-items-center gap-2'
      style={{
        background: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        fontSize: '0.875rem',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.target.style.background = 'rgba(255, 255, 255, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.target.style.background = 'rgba(255, 255, 255, 0.2)';
      }}
    >
      <svg width='16' height='16' fill='currentColor' viewBox='0 0 20 20'>
        <path
          fillRule='evenodd'
          d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
          clipRule='evenodd'
        />
      </svg>
      Manage Documents
    </button>
  );
};

export default ManageDocumentsButton;
