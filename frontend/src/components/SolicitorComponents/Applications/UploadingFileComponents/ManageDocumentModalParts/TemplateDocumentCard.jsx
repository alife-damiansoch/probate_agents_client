const TemplateDocumentCard = ({
  title,
  description,
  icon,
  isGenerated,
  isGenerating,
  onGenerate,
  bgColors,
  iconBg,
}) => {
  return (
    <div className='col-lg-4 col-md-6'>
      <div
        className={`p-3 rounded-4 h-100 position-relative overflow-hidden transition-all ${
          isGenerated ? 'opacity-50' : ''
        }`}
        style={{
          background: isGenerated
            ? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
            : bgColors.background,
          border: isGenerated ? '2px solid #d1d5db' : bgColors.border,
          cursor: isGenerated ? 'not-allowed' : 'pointer',
          filter: isGenerated ? 'grayscale(0.3)' : 'none',
          transform: isGenerated ? 'scale(0.98)' : 'scale(1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Existing Document Badge */}
        {isGenerated && (
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
              EXISTS
            </div>
          </div>
        )}

        <div className='d-flex align-items-center gap-2 mb-2'>
          <div
            className='d-flex align-items-center justify-content-center rounded-2'
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: isGenerated ? '#9ca3af' : iconBg,
              color: 'white',
            }}
          >
            {icon}
          </div>
          <div>
            <h6
              className='mb-0 fw-bold small'
              style={{
                color: isGenerated ? '#6b7280' : bgColors.textColor,
              }}
            >
              {title}
            </h6>
            <p className='mb-0 text-muted' style={{ fontSize: '0.7rem' }}>
              {isGenerated ? 'Document already exists' : description}
            </p>
          </div>
        </div>

        {/* Glassmorphic overlay for blocked state */}
        {isGenerated && (
          <div
            className='position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(2px)',
              borderRadius: '16px',
              zIndex: 5,
            }}
          >
            <div className='text-center'>
              <div
                className='d-flex align-items-center justify-content-center rounded-3 mx-auto mb-2'
                style={{
                  width: '32px',
                  height: '32px',
                  background:
                    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <p
                className='mb-0 fw-bold'
                style={{
                  fontSize: '0.7rem',
                  color: '#059669',
                }}
              >
                Already Generated
              </p>
            </div>
          </div>
        )}

        <button
          className='btn btn-sm w-100 fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2'
          style={{
            background: isGenerated
              ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
              : bgColors.buttonBg,
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            fontSize: '0.8rem',
            cursor: isGenerated ? 'not-allowed' : 'pointer',
            opacity: isGenerated ? 0.6 : 1,
          }}
          onClick={onGenerate}
          disabled={isGenerating || isGenerated}
        >
          {isGenerated ? (
            <>
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
              Already Exists
            </>
          ) : isGenerating ? (
            <>
              <div
                className='spinner-border spinner-border-sm'
                style={{ width: '12px', height: '12px' }}
              />
              Generating...
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
                  d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
              Generate
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TemplateDocumentCard;
