import { useEffect, useState } from 'react';

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default', // 'default', 'danger', 'warning', 'success'
  isLoading = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = 'unset';
      }, 300);
      return () => clearTimeout(timer);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      handleClose();
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (!isLoading) {
      onConfirm();
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          confirmBg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          confirmShadow: '0 8px 25px rgba(239, 68, 68, 0.3)',
          confirmHoverShadow: '0 12px 35px rgba(239, 68, 68, 0.4)',
          icon: (
            <svg width='24' height='24' fill='white' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
          ),
        };
      case 'warning':
        return {
          iconBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          confirmBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          confirmShadow: '0 8px 25px rgba(245, 158, 11, 0.3)',
          confirmHoverShadow: '0 12px 35px rgba(245, 158, 11, 0.4)',
          icon: (
            <svg width='24' height='24' fill='white' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
          ),
        };
      case 'success':
        return {
          iconBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          confirmBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          confirmShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
          confirmHoverShadow: '0 12px 35px rgba(16, 185, 129, 0.4)',
          icon: (
            <svg width='24' height='24' fill='white' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
          ),
        };
      default:
        return {
          iconBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          confirmBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          confirmShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
          confirmHoverShadow: '0 12px 35px rgba(59, 130, 246, 0.4)',
          icon: (
            <svg width='24' height='24' fill='white' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                clipRule='evenodd'
              />
            </svg>
          ),
        };
    }
  };

  const typeStyles = getTypeStyles();

  if (!isVisible) return null;

  return (
    <div
      className='position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
      style={{
        zIndex: 10000,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isAnimating ? 1 : 0,
        visibility: isAnimating ? 'visible' : 'hidden',
      }}
      onClick={handleBackdropClick}
    >
      <div
        className='position-relative bg-white'
        style={{
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
          borderRadius: '24px',
          boxShadow:
            '0 25px 80px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          maxWidth: '500px',
          width: '90vw',
          padding: '0',
          overflow: 'hidden',
          transform: isAnimating
            ? 'scale(1) translateY(0)'
            : 'scale(0.95) translateY(20px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className='d-flex align-items-center justify-content-between p-4 border-bottom'
          style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
          }}
        >
          <div className='d-flex align-items-center gap-3'>
            <div
              className='d-flex align-items-center justify-content-center rounded-3'
              style={{
                width: '48px',
                height: '48px',
                background: typeStyles.iconBg,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              }}
            >
              {typeStyles.icon}
            </div>
            <div>
              <h5 className='mb-0 fw-bold' style={{ color: '#1e293b' }}>
                {title || 'Confirm Action'}
              </h5>
            </div>
          </div>

          {!isLoading && (
            <button
              type='button'
              className='btn-close-custom d-flex align-items-center justify-content-center'
              onClick={handleClose}
              style={{
                width: '32px',
                height: '32px',
                border: 'none',
                background: 'rgba(107, 114, 128, 0.1)',
                borderRadius: '8px',
                color: '#6b7280',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(107, 114, 128, 0.2)';
                e.target.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(107, 114, 128, 0.1)';
                e.target.style.color = '#6b7280';
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
            </button>
          )}
        </div>

        {/* Body */}
        <div className='p-4'>
          <p
            className='mb-0'
            style={{
              color: '#475569',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              textAlign: 'center',
            }}
          >
            {message}
          </p>
        </div>

        {/* Footer */}
        <div
          className='p-4 border-top'
          style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderTop: '1px solid rgba(226, 232, 240, 0.8)',
          }}
        >
          <div className='d-flex gap-3 justify-content-end'>
            <button
              type='button'
              className='btn d-flex align-items-center gap-2 px-4 py-2'
              style={{
                background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '500',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                opacity: isLoading ? 0.5 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
              onClick={handleClose}
              disabled={isLoading}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow =
                    '0 6px 20px rgba(107, 114, 128, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
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
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
              {cancelText}
            </button>

            <button
              type='button'
              className='btn d-flex align-items-center gap-2 px-4 py-2'
              style={{
                background: isLoading ? '#9ca3af' : typeStyles.confirmBg,
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: isLoading ? 'none' : typeStyles.confirmShadow,
                transition: 'all 0.3s ease',
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
              onClick={handleConfirm}
              disabled={isLoading}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = typeStyles.confirmHoverShadow;
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = typeStyles.confirmShadow;
                }
              }}
            >
              {isLoading ? (
                <>
                  <div
                    className='spinner-border spinner-border-sm'
                    role='status'
                    style={{ width: '16px', height: '16px' }}
                  >
                    <span className='visually-hidden'>Loading...</span>
                  </div>
                  Processing...
                </>
              ) : (
                <>
                  <svg
                    width='16'
                    height='16'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  {confirmText}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div
            className='position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              borderRadius: '24px',
              zIndex: 10,
            }}
          >
            <div className='text-center'>
              <div
                className='spinner-border mb-3'
                style={{
                  width: '3rem',
                  height: '3rem',
                  color: '#667eea',
                  borderWidth: '4px',
                }}
                role='status'
              >
                <span className='visually-hidden'>Loading...</span>
              </div>
              <h6 className='fw-semibold' style={{ color: '#475569' }}>
                Processing...
              </h6>
            </div>
          </div>
        )}

        <style>{`
          .btn-close-custom:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
          }

          .btn:disabled {
            cursor: not-allowed !important;
          }

          /* Custom scrollbar */
          ::-webkit-scrollbar {
            width: 8px;
          }

          ::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
          }

          ::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.3);
          }
        `}</style>
      </div>
    </div>
  );
};

export default ConfirmationModal;
