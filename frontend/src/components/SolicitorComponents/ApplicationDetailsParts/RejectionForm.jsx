import { useEffect, useState } from 'react';

const RejectionForm = ({
  rejectionReason,
  setRejectionReason,
  handleRejectCancel,
  handleRejectSubmit,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const isReasonValid = rejectionReason.trim().length > 0;

  useEffect(() => {
    setIsAnimating(true);
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(handleRejectCancel, 150);
  };

  const handleSubmit = () => {
    if (isReasonValid) {
      handleRejectSubmit();
    }
  };

  return (
    <div
      className='position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
      style={{
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        opacity: isAnimating ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className='bg-white rounded-4 overflow-hidden position-relative mx-3'
        style={{
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          transform: isAnimating
            ? 'scale(1) translateY(0)'
            : 'scale(0.95) translateY(20px)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow:
            '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          className='btn position-absolute d-flex align-items-center justify-content-center'
          style={{
            top: '16px',
            right: '16px',
            width: '36px',
            height: '36px',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            color: 'white',
            zIndex: 10,
            transition: 'all 0.2s ease',
          }}
          onClick={handleClose}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <svg width='16' height='16' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>

        {/* Header with Gradient */}
        <div
          className='px-5 py-4 position-relative'
          style={{
            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
            color: 'white',
          }}
        >
          {/* Subtle Pattern Overlay */}
          <div
            className='position-absolute top-0 start-0 w-100 h-100'
            style={{
              background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              opacity: 0.3,
            }}
          />

          <div className='d-flex align-items-center gap-3 position-relative'>
            <div
              className='d-flex align-items-center justify-content-center rounded-3'
              style={{
                width: '48px',
                height: '48px',
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <svg
                width='24'
                height='24'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div>
              <h4 className='mb-1 fw-bold' style={{ fontSize: '1.5rem' }}>
                Reject Application
              </h4>
              <p className='mb-0 opacity-90' style={{ fontSize: '0.95rem' }}>
                Please provide a detailed reason for rejection
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className='p-5'>
          {/* Form Field */}
          <div className='mb-4'>
            <label
              htmlFor='rejectionReason'
              className='form-label fw-semibold mb-3 d-flex align-items-center gap-2'
              style={{ color: '#111827', fontSize: '1rem' }}
            >
              <svg
                width='16'
                height='16'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z'
                  clipRule='evenodd'
                />
              </svg>
              Reason for Rejection
              <span style={{ color: '#ef4444' }}>*</span>
            </label>

            <div className='position-relative'>
              <textarea
                id='rejectionReason'
                className='form-control border-0 rounded-3 shadow-sm'
                style={{
                  backgroundColor: '#f8fafc',
                  border: `2px solid ${
                    !isReasonValid && rejectionReason.length > 0
                      ? '#ef4444'
                      : isReasonValid
                      ? '#10b981'
                      : '#e2e8f0'
                  }`,
                  fontSize: '0.95rem',
                  minHeight: '140px',
                  resize: 'vertical',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  padding: '16px 20px',
                  lineHeight: '1.6',
                }}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder='Please provide a specific and detailed reason for rejecting this application. Include specific issues such as missing documentation, eligibility criteria not met, or other relevant concerns...'
                onFocus={(e) => {
                  e.target.style.borderColor = '#dc2626';
                  e.target.style.boxShadow = '0 0 0 4px rgba(220, 38, 38, 0.1)';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor =
                    !isReasonValid && rejectionReason.length > 0
                      ? '#ef4444'
                      : isReasonValid
                      ? '#10b981'
                      : '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                  e.target.style.backgroundColor = '#f8fafc';
                }}
              />

              {/* Character Counter */}
              <div
                className='position-absolute bottom-0 end-0 pe-3 pb-3'
                style={{
                  fontSize: '0.8rem',
                  color: rejectionReason.length > 500 ? '#ef4444' : '#64748b',
                  fontWeight: '500',
                }}
              >
                {rejectionReason.length} characters
              </div>
            </div>

            {/* Validation Message */}
            {!isReasonValid && rejectionReason.length > 0 && (
              <div
                className='d-flex align-items-center gap-2 mt-3 p-3 rounded-3'
                style={{
                  color: '#dc2626',
                  fontSize: '0.85rem',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
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
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='fw-medium'>
                  A detailed rejection reason is required
                </span>
              </div>
            )}
          </div>

          {/* Critical Warning */}
          <div
            className='p-4 rounded-3 mb-5'
            style={{
              background: 'linear-gradient(135deg, #fef3cd 0%, #fde68a 100%)',
              border: '1px solid #f59e0b',
            }}
          >
            <div className='d-flex align-items-start gap-3'>
              <div
                className='d-flex align-items-center justify-content-center rounded-2 flex-shrink-0'
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#f59e0b',
                  color: 'white',
                }}
              >
                <svg
                  width='20'
                  height='20'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div>
                <h6
                  className='mb-2 fw-bold'
                  style={{ color: '#92400e', fontSize: '0.95rem' }}
                >
                  ⚠️ Critical Action Warning
                </h6>
                <p
                  className='mb-0'
                  style={{
                    fontSize: '0.85rem',
                    color: '#975a16',
                    lineHeight: '1.5',
                  }}
                >
                  This action will permanently reject the application.
                  <strong className='d-block mt-1'>
                    This action cannot be reversed.
                  </strong>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='d-flex gap-3 justify-content-end'>
            <button
              className='btn px-5 py-3 rounded-3 fw-semibold d-flex align-items-center gap-2'
              style={{
                backgroundColor: '#f1f5f9',
                color: '#475569',
                border: '2px solid #e2e8f0',
                fontSize: '0.9rem',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onClick={handleClose}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#e2e8f0';
                e.target.style.borderColor = '#cbd5e1';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f1f5f9';
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.transform = 'translateY(0)';
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
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
              Cancel
            </button>

            <button
              className='btn px-5 py-3 rounded-3 fw-semibold d-flex align-items-center gap-2'
              style={{
                background: isReasonValid
                  ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                  : 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
                color: 'white',
                border: 'none',
                fontSize: '0.9rem',
                cursor: isReasonValid ? 'pointer' : 'not-allowed',
                opacity: isReasonValid ? 1 : 0.7,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onClick={handleSubmit}
              disabled={!isReasonValid}
              onMouseEnter={(e) => {
                if (isReasonValid) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow =
                    '0 8px 25px rgba(220, 38, 38, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (isReasonValid) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
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
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
              Confirm Rejection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RejectionForm;
