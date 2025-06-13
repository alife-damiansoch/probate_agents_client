const RejectionForm = ({
  rejectionReason,
  setRejectionReason,
  handleRejectCancel,
  handleRejectSubmit,
}) => {
  const isReasonValid = rejectionReason.trim().length > 0;

  return (
    <div
      className='bg-white rounded-4 overflow-hidden'
      style={{
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid #fecaca',
      }}
    >
      {/* Header */}
      <div
        className='px-4 py-3'
        style={{
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
          color: 'white',
        }}
      >
        <div className='d-flex align-items-center gap-3'>
          <div
            className='d-flex align-items-center justify-content-center rounded-2'
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
            }}
          >
            <svg width='18' height='18' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div>
            <h5 className='mb-0 fw-bold' style={{ fontSize: '1.125rem' }}>
              Reject Application
            </h5>
            <p className='mb-0 opacity-75' style={{ fontSize: '0.875rem' }}>
              Please provide a detailed reason for rejection
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-4'>
        <div className='mb-4'>
          <label
            htmlFor='rejectionReason'
            className='form-label fw-semibold mb-2'
            style={{ color: '#374151', fontSize: '0.875rem' }}
          >
            Reason for Rejection *
          </label>
          <div className='position-relative'>
            <div
              className='position-absolute start-0 ms-3'
              style={{
                color: '#9ca3af',
                zIndex: 10,
                top: '12px',
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
                  d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <textarea
              id='rejectionReason'
              className='form-control ps-5 py-3 border-0 rounded-3'
              style={{
                backgroundColor: '#f9fafb',
                border: `2px solid ${
                  !isReasonValid && rejectionReason.length > 0
                    ? '#ef4444'
                    : '#e5e7eb'
                }`,
                fontSize: '0.875rem',
                minHeight: '120px',
                resize: 'vertical',
                transition: 'all 0.2s ease',
              }}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder='Please provide a specific reason for rejecting this application (e.g., "Incomplete documentation - missing proof of income", "Application does not meet credit requirements")'
              onFocus={(e) => {
                e.target.style.borderColor = '#dc2626';
                e.target.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor =
                  !isReasonValid && rejectionReason.length > 0
                    ? '#ef4444'
                    : '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Character counter and validation */}
          <div className='d-flex justify-content-between align-items-center mt-2'>
            <div>
              {!isReasonValid && rejectionReason.length > 0 && (
                <div
                  className='d-flex align-items-center gap-2'
                  style={{ color: '#ef4444', fontSize: '0.75rem' }}
                >
                  <svg
                    width='14'
                    height='14'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Rejection reason is required
                </div>
              )}
            </div>
            <div className='text-muted' style={{ fontSize: '0.75rem' }}>
              {rejectionReason.length} characters
            </div>
          </div>
        </div>

        {/* Warning Notice */}
        <div
          className='p-3 rounded-3 border mb-4'
          style={{
            backgroundColor: '#fef3cd',
            border: '1px solid #fde68a',
          }}
        >
          <div className='d-flex align-items-start gap-2'>
            <svg
              width='16'
              height='16'
              fill='#d97706'
              viewBox='0 0 20 20'
              className='mt-1'
            >
              <path
                fillRule='evenodd'
                d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
            <div>
              <h6
                className='mb-1 fw-semibold'
                style={{ color: '#92400e', fontSize: '0.8rem' }}
              >
                Important Notice
              </h6>
              <p
                className='mb-0'
                style={{ fontSize: '0.75rem', color: '#975a16' }}
              >
                This action will permanently reject the application and notify
                the applicant. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='d-flex gap-3 justify-content-end'>
          <button
            className='btn px-4 py-2 rounded-3 fw-medium d-flex align-items-center gap-2'
            style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              fontSize: '0.875rem',
            }}
            onClick={handleRejectCancel}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#e5e7eb';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f3f4f6';
            }}
          >
            <svg width='14' height='14' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
            Cancel
          </button>

          <button
            className='btn px-4 py-2 rounded-3 fw-medium d-flex align-items-center gap-2'
            style={{
              background: isReasonValid
                ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
              color: 'white',
              border: 'none',
              fontSize: '0.875rem',
              cursor: isReasonValid ? 'pointer' : 'not-allowed',
            }}
            onClick={handleRejectSubmit}
            disabled={!isReasonValid}
            onMouseEnter={(e) => {
              if (isReasonValid) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (isReasonValid) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            <svg width='14' height='14' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z'
                clipRule='evenodd'
              />
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V7a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
            Reject Application
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectionForm;
