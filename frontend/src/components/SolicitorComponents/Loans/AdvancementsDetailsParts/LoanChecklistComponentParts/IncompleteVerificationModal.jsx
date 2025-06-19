const IncompleteVerificationModal = ({ uncheckedItems, onClose }) => {
  return (
    <div
      className='position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
      style={{
        zIndex: 20,
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(12px)',
        animation: 'backdropFadeIn 0.2s ease-out',
      }}
      onClick={onClose}
    >
      <div
        className='d-flex flex-column'
        style={{
          maxWidth: '420px',
          width: '90%',
          maxHeight: '80vh',
          background: 'rgba(15, 23, 42, 0.95)',
          borderRadius: '16px',
          boxShadow:
            '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          animation: 'modalSlideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Header */}
        <div
          className='position-relative p-4 flex-shrink-0'
          style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className='d-flex align-items-center gap-3'>
            <div
              className='d-flex align-items-center justify-content-center'
              style={{
                width: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <svg width='20' height='20' fill='white' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='flex-grow-1'>
              <h4
                className='mb-1 fw-bold text-white'
                style={{ fontSize: '1.1rem' }}
              >
                Verification Required
              </h4>
              <div className='d-flex align-items-center gap-2'>
                <div
                  className='rounded-circle'
                  style={{
                    width: '6px',
                    height: '6px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    animation: 'pulse 2s infinite',
                  }}
                />
                <span
                  className='text-white'
                  style={{ fontSize: '0.85rem', opacity: 0.9 }}
                >
                  {uncheckedItems.length} pending
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className='flex-grow-1 overflow-auto p-4'>
          {/* Alert Message */}
          <div
            className='p-3 rounded-3 mb-4'
            style={{
              background:
                'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            <p
              className='mb-0 text-white'
              style={{ fontSize: '0.9rem', lineHeight: '1.5' }}
            >
              Complete all verification items before submission. Contact
              management if documentation is unavailable.
            </p>
          </div>

          {/* Items List */}
          <div className='mb-4'>
            <div className='d-flex align-items-center justify-content-between mb-3'>
              <h6
                className='mb-0 fw-semibold text-white'
                style={{ fontSize: '0.95rem' }}
              >
                Required Items
              </h6>
              <span
                className='badge px-2 py-1'
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  color: '#fca5a5',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                }}
              >
                {uncheckedItems.length}
              </span>
            </div>

            <div
              className='rounded-3'
              style={{
                maxHeight: '200px',
                overflowY: 'auto',
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              {uncheckedItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`d-flex align-items-center gap-3 p-3 ${
                    index !== uncheckedItems.length - 1 ? 'border-bottom' : ''
                  }`}
                  style={{
                    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
                    transition: 'all 0.2s ease',
                    animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.03)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div
                    className='d-flex align-items-center justify-content-center flex-shrink-0'
                    style={{
                      width: '18px',
                      height: '18px',
                      background:
                        'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      borderRadius: '4px',
                    }}
                  >
                    <svg
                      width='10'
                      height='10'
                      fill='white'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <span
                    className='text-white'
                    style={{
                      fontSize: '0.9rem',
                      lineHeight: '1.3',
                      opacity: 0.9,
                    }}
                  >
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div
            className='p-3 rounded-3'
            style={{
              background:
                'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            <div className='d-flex align-items-start gap-3'>
              <div
                className='d-flex align-items-center justify-content-center flex-shrink-0 mt-1'
                style={{
                  width: '20px',
                  height: '20px',
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  borderRadius: '6px',
                }}
              >
                <svg width='12' height='12' fill='white' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <p
                className='mb-0 text-white'
                style={{ fontSize: '0.85rem', lineHeight: '1.4', opacity: 0.9 }}
              >
                Return to checklist to complete all verifications
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className='p-4 flex-shrink-0'
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            background: 'rgba(15, 23, 42, 0.8)',
          }}
        >
          <button
            type='button'
            className='btn w-100 d-flex align-items-center justify-content-center gap-2 py-3'
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '0.9rem',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.2s ease',
              transform: 'translateY(0)',
            }}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.4)';
            }}
          >
            <svg width='16' height='16' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
                clipRule='evenodd'
              />
            </svg>
            Return to Checklist
          </button>
        </div>

        <style>{`
          @keyframes backdropFadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes modalSlideUp {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes pulse {
            0%,
            100% {
              opacity: 0.8;
            }
            50% {
              opacity: 0.4;
            }
          }

          /* Custom scrollbar */
          div::-webkit-scrollbar {
            width: 4px;
          }

          div::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 2px;
          }

          div::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.2);
            border-radius: 2px;
          }

          div::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
          }
        `}</style>
      </div>
    </div>
  );
};

export default IncompleteVerificationModal;
