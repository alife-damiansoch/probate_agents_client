// InternalFilesEmptyState.jsx

const InternalFilesEmptyState = ({ isAdmin }) => {
  return (
    <div
      className='text-center p-5 rounded-4'
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        border: '2px dashed #cbd5e1',
      }}
    >
      <div
        className='d-flex align-items-center justify-content-center rounded-4 mx-auto mb-4'
        style={{
          width: '80px',
          height: '80px',
          background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
        }}
      >
        <svg width='40' height='40' fill='#64748b' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
            clipRule='evenodd'
          />
        </svg>
      </div>
      <h5 className='fw-bold mb-3' style={{ color: '#475569' }}>
        No Internal Files
      </h5>
      <p className='mb-4' style={{ color: '#64748b', fontSize: '0.95rem' }}>
        No internal files have been uploaded for this application yet.
        {isAdmin &&
          ' Click the button above to upload your first internal file.'}
      </p>
    </div>
  );
};

export default InternalFilesEmptyState;
