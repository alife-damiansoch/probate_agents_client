const DocumentTypeCard = ({
  docType,
  isRequired,
  isProcessing,
  onAdd,
  onRemove,
}) => {
  return (
    <div className='col-lg-4 col-md-6'>
      <div
        className={`p-3 rounded-4 h-100 position-relative overflow-hidden transition-all`}
        style={{
          background: isRequired
            ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
            : 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
          border: isRequired ? '2px solid #10b981' : '2px solid #cbd5e1',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          opacity: isProcessing ? 0.7 : 1,
          transform: isRequired ? 'scale(1.02)' : 'scale(1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Required Badge */}
        {isRequired && (
          <div
            className='position-absolute top-0 end-0 m-2'
            style={{ zIndex: 10 }}
          >
            <div
              className='d-flex align-items-center gap-1 px-2 py-1 rounded-pill'
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: '600',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              }}
            >
              <svg
                width='12'
                height='12'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
              REQUIRED
            </div>
          </div>
        )}

        {/* Document Type Header */}
        <div className='d-flex align-items-center gap-2 mb-3'>
          <div
            className='d-flex align-items-center justify-content-center rounded-2'
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: isRequired ? '#10b981' : '#64748b',
              color: 'white',
            }}
          >
            <svg width='16' height='16' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div className='flex-grow-1'>
            <h6
              className='mb-0 fw-bold small'
              style={{ color: isRequired ? '#047857' : '#374151' }}
            >
              {docType.name}
            </h6>
            <p
              className='mb-0 text-muted'
              style={{ fontSize: '0.7rem', lineHeight: '1.3' }}
            >
              {docType.description || 'No description available'}
            </p>
          </div>
        </div>

        {/* Signature Requirements Info */}
        {docType.signature_required && (
          <div
            className='mb-3 p-2 rounded-3'
            style={{
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
            }}
          >
            <div className='d-flex align-items-center gap-2'>
              <svg width='14' height='14' fill='#f59e0b' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z'
                  clipRule='evenodd'
                />
              </svg>
              <span
                style={{
                  fontSize: '0.7rem',
                  color: '#d97706',
                  fontWeight: '600',
                }}
              >
                Requires {docType.who_needs_to_sign} signature
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          className='btn btn-sm w-100 fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2'
          style={{
            background: isRequired
              ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            fontSize: '0.8rem',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
          }}
          onClick={() =>
            isRequired ? onRemove(docType.id) : onAdd(docType.id)
          }
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div
                className='spinner-border spinner-border-sm'
                style={{ width: '12px', height: '12px' }}
              />
              {isRequired ? 'Removing...' : 'Adding...'}
            </>
          ) : isRequired ? (
            <>
              <svg
                width='12'
                height='12'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
              Remove Requirement
            </>
          ) : (
            <>
              <svg
                width='12'
                height='12'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                  clipRule='evenodd'
                />
              </svg>
              Add Requirement
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DocumentTypeCard;
