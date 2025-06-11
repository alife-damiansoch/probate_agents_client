import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteData } from '../../GenericFunctions/AxiosGenericFunctions';

const DeleteApplication = ({ applicationId, setDeleteAppId }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

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
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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
            <h5 className='mb-0 fw-bold' style={{ fontSize: '1.125rem' }}>
              Confirm Deletion
            </h5>
            <p className='mb-0 opacity-75' style={{ fontSize: '0.875rem' }}>
              This action cannot be undone
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className='p-4'>
        {/* Main Message */}
        <div className='mb-4'>
          <div className='d-flex align-items-center gap-3 mb-3'>
            <div
              className='d-flex align-items-center justify-content-center rounded-3'
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
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
              <h6 className='mb-1 fw-bold' style={{ color: '#111827' }}>
                Delete Application #{applicationId}
              </h6>
              <p className='mb-0 text-muted' style={{ fontSize: '0.875rem' }}>
                Are you sure you want to permanently delete this application?
              </p>
            </div>
          </div>

          {/* Warning Details */}
          <div
            className='p-3 rounded-3 border'
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
            }}
          >
            <h6
              className='fw-bold mb-2'
              style={{ color: '#dc2626', fontSize: '0.8rem' }}
            >
              This will permanently delete:
            </h6>
            <ul
              className='mb-0 ps-3'
              style={{ fontSize: '0.75rem', color: '#991b1b' }}
            >
              <li>All application data and documents</li>
              <li>Associated comments and history</li>
              <li>Any linked advancement records</li>
              <li>All related audit trails</li>
            </ul>
          </div>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div
            className='p-3 rounded-3 border mb-4'
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
            }}
          >
            <div className='d-flex align-items-start gap-2'>
              <svg
                width='16'
                height='16'
                fill='#dc2626'
                viewBox='0 0 20 20'
                className='mt-1'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              <div>
                <h6
                  className='mb-1 fw-semibold'
                  style={{ color: '#dc2626', fontSize: '0.8rem' }}
                >
                  Deletion Failed
                </h6>
                <div style={{ fontSize: '0.75rem', color: '#991b1b' }}>
                  {errorMessage.split('\n').map((msg, index) => (
                    <div key={index}>{msg}</div>
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
            className='btn px-4 py-2 rounded-3 fw-medium d-flex align-items-center gap-2'
            style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              fontSize: '0.875rem',
            }}
            onClick={() => setDeleteAppId('')}
            disabled={isDeleting}
            onMouseEnter={(e) => {
              if (!e.target.disabled) {
                e.target.style.backgroundColor = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.target.disabled) {
                e.target.style.backgroundColor = '#f3f4f6';
              }
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
            type='button'
            className='btn px-4 py-2 rounded-3 fw-medium d-flex align-items-center gap-2'
            style={{
              background: isDeleting
                ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              border: 'none',
              fontSize: '0.875rem',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              minWidth: '120px',
            }}
            onClick={deleteApplicationHandler}
            disabled={isDeleting}
            onMouseEnter={(e) => {
              if (!isDeleting) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
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
                  style={{ width: '14px', height: '14px' }}
                >
                  <span className='visually-hidden'>Loading...</span>
                </div>
                Deleting...
              </>
            ) : (
              <>
                <svg
                  width='14'
                  height='14'
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
                Delete Application
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteApplication;
