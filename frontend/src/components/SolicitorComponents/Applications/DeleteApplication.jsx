import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteData } from '../../GenericFunctions/AxiosGenericFunctions';

const DeleteApplication = ({ applicationId, setDeleteAppId }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsAnimating(true);
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setDeleteAppId(''), 150);
  };

  const deleteApplicationHandler = async () => {
    setIsDeleting(true);
    setErrorMessage('');

    console.log(`deleting application ${applicationId}`);
    try {
      const endpoint = `/api/applications/agent_applications/${applicationId}/`;
      const response = await deleteData(endpoint);
      console.log('Deleted Application:', response.data);
      navigate('/applications');
    } catch (error) {
      console.error('Error deleting application:', error);
      if (error.response && error.response.data) {
        const errors = error.response.data;
        let message = 'Error deleting application:\n';
        for (const key in errors) {
          if (Array.isArray(errors[key])) {
            message += `${key}: ${errors[key].join(', ')}\n`;
          } else if (typeof errors[key] === 'object' && errors[key] !== null) {
            for (const nestedKey in errors[key]) {
              message += `${key} - ${nestedKey}: ${errors[key][nestedKey].join(
                ', '
              )}\n`;
            }
          } else {
            message += `${key}: ${errors[key]}\n`;
          }
        }
        setErrorMessage(message);
      } else {
        setErrorMessage(error.message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className='position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
      style={{
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        opacity: isAnimating ? 1 : 0,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) handleClose();
      }}
    >
      <div
        className='bg-white rounded-4 overflow-hidden position-relative mx-3'
        style={{
          maxWidth: '550px',
          width: '100%',
          maxHeight: '90vh',
          transform: isAnimating
            ? 'scale(1) translateY(0)'
            : 'scale(0.95) translateY(20px)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow:
            '0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        {!isDeleting && (
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
        )}

        {/* Header with Danger Gradient */}
        <div
          className='px-5 py-4 position-relative'
          style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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
                  d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z'
                  clipRule='evenodd'
                />
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V7a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div>
              <h4 className='mb-1 fw-bold' style={{ fontSize: '1.5rem' }}>
                Confirm Deletion
              </h4>
              <p className='mb-0 opacity-90' style={{ fontSize: '0.95rem' }}>
                This action cannot be undone
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className='p-5'>
          {/* Main Warning */}
          <div className='mb-4'>
            <div className='d-flex align-items-start gap-4 mb-4'>
              <div
                className='d-flex align-items-center justify-content-center rounded-3 flex-shrink-0'
                style={{
                  width: '56px',
                  height: '56px',
                  background:
                    'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                  border: '2px solid #fecaca',
                }}
              >
                <svg width='28' height='28' fill='#dc2626' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div>
                <h5
                  className='mb-2 fw-bold'
                  style={{ color: '#111827', fontSize: '1.2rem' }}
                >
                  Delete Application #{applicationId}
                </h5>
                <p
                  className='mb-0'
                  style={{
                    fontSize: '0.95rem',
                    color: '#6b7280',
                    lineHeight: '1.5',
                  }}
                >
                  Are you absolutely sure you want to permanently delete this
                  application? This action will remove all associated data and
                  cannot be reversed.
                </p>
              </div>
            </div>

            {/* Critical Data Warning */}
            <div
              className='p-4 rounded-3'
              style={{
                background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                border: '1px solid #fecaca',
              }}
            >
              <div className='d-flex align-items-start gap-3'>
                <div
                  className='d-flex align-items-center justify-content-center rounded-2 flex-shrink-0'
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#dc2626',
                    color: 'white',
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
                </div>
                <div>
                  <h6
                    className='fw-bold mb-2'
                    style={{ color: '#dc2626', fontSize: '0.95rem' }}
                  >
                    ⚠️ The following data will be permanently deleted:
                  </h6>
                  <div className='row'>
                    <div className='col-12'>
                      <ul
                        className='mb-0'
                        style={{
                          fontSize: '0.85rem',
                          color: '#991b1b',
                          lineHeight: '1.6',
                        }}
                      >
                        <li className='mb-1'>
                          <strong>Application data:</strong> All forms, personal
                          information, and status records
                        </li>
                        <li className='mb-1'>
                          <strong>Documents & files:</strong> Uploaded
                          documents, signed agreements, and attachments
                        </li>
                        <li className='mb-1'>
                          <strong>Communications:</strong> Comments, notes, and
                          communication history
                        </li>
                        <li className='mb-1'>
                          <strong>Linked records:</strong> Associated
                          advancement records and relationships
                        </li>
                        <li>
                          <strong>Audit trails:</strong> All tracking and
                          modification history
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {errorMessage && (
            <div
              className='p-4 rounded-3 mb-4'
              style={{
                background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                border: '1px solid #fecaca',
              }}
            >
              <div className='d-flex align-items-start gap-3'>
                <div
                  className='d-flex align-items-center justify-content-center rounded-2 flex-shrink-0'
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#dc2626',
                    color: 'white',
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
                </div>
                <div>
                  <h6
                    className='fw-bold mb-2'
                    style={{ color: '#dc2626', fontSize: '0.95rem' }}
                  >
                    Deletion Failed
                  </h6>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: '#991b1b',
                      lineHeight: '1.4',
                    }}
                  >
                    {errorMessage.split('\n').map((msg, index) => (
                      <div key={index} className={msg.trim() ? 'mb-1' : ''}>
                        {msg.trim() || ''}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className='d-flex gap-3 justify-content-end'>
            <button
              type='button'
              className='btn px-5 py-3 rounded-3 fw-semibold d-flex align-items-center gap-2'
              style={{
                backgroundColor: '#f1f5f9',
                color: '#475569',
                border: '2px solid #e2e8f0',
                fontSize: '0.9rem',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: isDeleting ? 0.6 : 1,
              }}
              onClick={handleClose}
              disabled={isDeleting}
              onMouseEnter={(e) => {
                if (!isDeleting) {
                  e.target.style.backgroundColor = '#e2e8f0';
                  e.target.style.borderColor = '#cbd5e1';
                  e.target.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isDeleting) {
                  e.target.style.backgroundColor = '#f1f5f9';
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.transform = 'translateY(0)';
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
              Cancel
            </button>

            <button
              type='button'
              className='btn px-5 py-3 rounded-3 fw-semibold d-flex align-items-center gap-2'
              style={{
                background: isDeleting
                  ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
                  : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                border: 'none',
                fontSize: '0.9rem',
                cursor: isDeleting ? 'not-allowed' : 'pointer',
                minWidth: '160px',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onClick={deleteApplicationHandler}
              disabled={isDeleting}
              onMouseEnter={(e) => {
                if (!isDeleting) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow =
                    '0 8px 25px rgba(239, 68, 68, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isDeleting) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }
              }}
            >
              {isDeleting ? (
                <>
                  <div
                    className='spinner-border spinner-border-sm'
                    role='status'
                    style={{ width: '16px', height: '16px' }}
                  >
                    <span className='visually-hidden'>Loading...</span>
                  </div>
                  Deleting Application...
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
                      d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z'
                      clipRule='evenodd'
                    />
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V7a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Permanently Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteApplication;
