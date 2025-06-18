// src/components/ApplicationDetailStages/ApplicationDetailStagesParts/ReviewInfo.js

const ReviewInfo = ({ statusStep }) => {
  return (
    <div className='border-top pt-3 mt-3'>
      <div className='d-flex position-relative'>
        <div
          className='d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 me-3'
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: statusStep.isError ? '#fef2f2' : '#f9fafb',
            border: `2px solid ${statusStep.isError ? '#ef4444' : '#d1d5db'}`,
            fontSize: '1rem',
            zIndex: 2,
          }}
        >
          {statusStep.completed && !statusStep.isError ? '✓' : statusStep.icon}
        </div>

        <div className='flex-grow-1'>
          <div className='d-flex align-items-center mb-1'>
            <h6
              className='mb-0 fw-semibold'
              style={{
                color: statusStep.isError ? '#dc2626' : '#374151',
                fontSize: '0.875rem',
              }}
            >
              {statusStep.title}
            </h6>
          </div>
          <p
            className='mb-0 small'
            style={{ color: '#6b7280', fontSize: '0.8rem' }}
          >
            {statusStep.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReviewInfo;
