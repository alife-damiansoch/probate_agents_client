const ChecklistHeader = ({ loanId, onClose }) => {
  return (
    <div
      className='d-flex justify-content-between align-items-center p-4 border-bottom'
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '24px 24px 0 0',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <div className='d-flex align-items-center gap-3'>
        <div
          className='p-3 rounded-3'
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <svg width='28' height='28' fill='white' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'
              clipRule='evenodd'
            />
          </svg>
        </div>
        <div>
          <h3 className='mb-1 fw-bold text-white'>Finance Checklist</h3>
          <p className='mb-0 text-white opacity-75'>
            Pre-disbursement verification for Loan #{loanId}
          </p>
        </div>
      </div>
      <button
        className='btn p-2 d-flex align-items-center justify-content-center'
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          border: 'none',
          borderRadius: '12px',
          width: '44px',
          height: '44px',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
        }}
        onClick={onClose}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.3)';
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          e.target.style.transform = 'scale(1)';
        }}
      >
        <svg width='20' height='20' fill='white' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
            clipRule='evenodd'
          />
        </svg>
      </button>
    </div>
  );
};

export default ChecklistHeader;
