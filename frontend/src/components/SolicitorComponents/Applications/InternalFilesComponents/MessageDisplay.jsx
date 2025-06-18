// MessageDisplay.jsx
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions.jsx';

const MessageDisplay = ({ successMessage, errorMessage }) => {
  if (!successMessage && !errorMessage) return null;

  return (
    <>
      {/* Success Messages */}
      {successMessage && (
        <div
          className='mb-4 p-4 rounded-3 d-flex align-items-center gap-3'
          style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
          }}
        >
          <div
            className='d-flex align-items-center justify-content-center rounded-2'
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#16a34a',
              color: 'white',
            }}
          >
            <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div>
            <h6 className='mb-1 fw-bold' style={{ color: '#16a34a' }}>
              Success
            </h6>
            <div style={{ color: '#16a34a', fontSize: '0.875rem' }}>
              {renderErrors(successMessage)}
            </div>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {errorMessage && (
        <div
          className='mb-4 p-4 rounded-3 d-flex align-items-center gap-3'
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
          }}
        >
          <div
            className='d-flex align-items-center justify-content-center rounded-2'
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#dc2626',
              color: 'white',
            }}
          >
            <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div>
            <h6 className='mb-1 fw-bold' style={{ color: '#dc2626' }}>
              Error
            </h6>
            <div style={{ color: '#dc2626', fontSize: '0.875rem' }}>
              {renderErrors(errorMessage)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageDisplay;
