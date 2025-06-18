// InternalFilesHeader.jsx

const InternalFilesHeader = ({ isAdmin, onUploadClick }) => {
  return (
    <div
      className='px-4 py-4 mb-4 rounded-3'
      style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
        color: 'white',
      }}
    >
      <div className='row align-items-center'>
        <div className='col-lg-8'>
          <h6 className='mb-0 fw-bold d-flex align-items-center gap-2'>
            <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                clipRule='evenodd'
              />
            </svg>
            Internal Files Management
          </h6>
          <p className='mb-0 opacity-90' style={{ fontSize: '0.85rem' }}>
            Manage internal documentation for this application
          </p>
        </div>
        <div className='col-lg-4 text-end'>
          {isAdmin && (
            <button
              className='btn btn-light fw-semibold px-4 py-2 rounded-3 d-inline-flex align-items-center gap-2'
              onClick={onUploadClick}
              style={{ transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <svg
                width='16'
                height='16'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                  clipRule='evenodd'
                />
              </svg>
              Add File
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternalFilesHeader;
