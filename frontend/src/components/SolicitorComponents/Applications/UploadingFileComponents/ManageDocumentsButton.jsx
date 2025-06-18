const ManageDocumentsButton = ({ onClick, manageDocummentButtonDisabled }) => {
  return (
    <div className='position-relative'>
      <button
        className='btn px-4 py-2 fw-semibold rounded-3 d-inline-flex align-items-center gap-2 position-relative overflow-hidden'
        style={{
          background: manageDocummentButtonDisabled
            ? 'linear-gradient(135deg, rgba(156, 163, 175, 0.3) 0%, rgba(107, 114, 128, 0.3) 100%)'
            : 'rgba(255, 255, 255, 0.2)',
          color: manageDocummentButtonDisabled
            ? 'rgba(255, 255, 255, 0.5)'
            : 'white',
          border: manageDocummentButtonDisabled
            ? '1px solid rgba(156, 163, 175, 0.4)'
            : '1px solid rgba(255, 255, 255, 0.3)',
          fontSize: '0.875rem',
          cursor: manageDocummentButtonDisabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: manageDocummentButtonDisabled ? 'scale(0.98)' : 'scale(1)',
          filter: manageDocummentButtonDisabled ? 'blur(0.5px)' : 'none',
        }}
        onClick={manageDocummentButtonDisabled ? undefined : onClick}
        disabled={manageDocummentButtonDisabled}
        onMouseEnter={
          !manageDocummentButtonDisabled
            ? (e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'scale(1.02) translateY(-1px)';
                e.target.style.boxShadow =
                  '0 8px 25px rgba(255, 255, 255, 0.15)';
              }
            : undefined
        }
        onMouseLeave={
          !manageDocummentButtonDisabled
            ? (e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'scale(1) translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            : undefined
        }
      >
        {/* Disabled overlay effect */}
        {manageDocummentButtonDisabled && (
          <div
            className='position-absolute top-0 start-0 w-100 h-100'
            style={{
              background:
                'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255, 255, 255, 0.1) 2px, rgba(255, 255, 255, 0.1) 4px)',
              pointerEvents: 'none',
            }}
          />
        )}

        <svg
          width='16'
          height='16'
          fill='currentColor'
          viewBox='0 0 20 20'
          style={{
            opacity: manageDocummentButtonDisabled ? 0.5 : 1,
            transition: 'opacity 0.2s ease',
          }}
        >
          <path
            fillRule='evenodd'
            d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
            clipRule='evenodd'
          />
        </svg>

        {manageDocummentButtonDisabled
          ? 'Documents Locked'
          : 'Manage Documents'}

        {manageDocummentButtonDisabled && (
          <svg
            width='14'
            height='14'
            fill='currentColor'
            viewBox='0 0 24 24'
            style={{ opacity: 0.7 }}
          >
            <path d='M6 10V8C6 5.79 7.79 4 10 4H14C16.21 4 18 5.79 18 8V10H19C20.1 10 21 10.9 21 12V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V12C3 10.9 3.9 10 5 10H6ZM8 8V10H16V8C16 6.9 15.1 6 14 6H10C8.9 6 8 6.9 8 8Z' />
          </svg>
        )}
      </button>

      {/* Tooltip for disabled state */}
      {manageDocummentButtonDisabled && (
        <div
          className='position-absolute top-100 start-50 translate-middle-x mt-2'
          style={{
            zIndex: 1000,
            minWidth: '280px',
          }}
        >
          <div
            className='p-3 rounded-3 shadow-lg'
            style={{
              background:
                'linear-gradient(135deg, rgba(254, 243, 199, 0.95) 0%, rgba(253, 230, 138, 0.95) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              boxShadow:
                '0 20px 40px rgba(245, 158, 11, 0.15), 0 0 0 1px rgba(245, 158, 11, 0.1)',
            }}
          >
            <div className='d-flex align-items-start'>
              <div
                className='me-2 p-1 rounded-circle flex-shrink-0'
                style={{
                  background:
                    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width='10' height='10' fill='white' viewBox='0 0 24 24'>
                  <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' />
                </svg>
              </div>
              <div>
                <p
                  className='mb-1 fw-semibold small'
                  style={{ color: '#92400e' }}
                >
                  Document Management Locked
                </p>
                <p
                  className='mb-2 small'
                  style={{
                    color: '#78350f',
                    lineHeight: '1.4',
                    fontSize: '0.8rem',
                  }}
                >
                  Complete all required steps first:
                </p>
                <div className='d-flex flex-wrap gap-1'>
                  {[
                    'Application Submitted',
                    'Solicitor Assignment',
                    'Estate Information',
                    'Details Confirmation',
                  ].map((step, index) => (
                    <span
                      key={index}
                      className='badge'
                      style={{
                        backgroundColor: 'rgba(245, 158, 11, 0.2)',
                        color: '#92400e',
                        fontSize: '0.65rem',
                        fontWeight: '500',
                        padding: '2px 6px',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                      }}
                    >
                      {index + 1}. {step}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tooltip arrow */}
            <div
              className='position-absolute'
              style={{
                top: '-6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 0,
                height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: '6px solid rgba(245, 158, 11, 0.3)',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDocumentsButton;
