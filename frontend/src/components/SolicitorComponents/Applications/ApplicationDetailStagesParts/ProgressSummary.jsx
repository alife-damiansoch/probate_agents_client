// src/components/ApplicationDetailStages/ApplicationDetailStagesParts/ProgressSummary.js

const ProgressSummary = ({ userSteps }) => {
  return (
    <div
      className='mt-3 p-2 rounded-3'
      style={{
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
      }}
    >
      <div className='d-flex align-items-center justify-content-between'>
        <div className='d-flex align-items-center'>
          <div className='me-2'>
            <div className='progress' style={{ width: '80px', height: '6px' }}>
              <div
                className='progress-bar'
                style={{
                  width: `${
                    (userSteps.filter((s) => s.completed).length /
                      userSteps.length) *
                    100
                  }%`,
                  backgroundColor: '#22c55e',
                }}
              />
            </div>
          </div>
          <small
            style={{
              color: '#6b7280',
              fontWeight: '500',
              fontSize: '0.8rem',
            }}
          >
            {userSteps.filter((s) => s.completed).length} of {userSteps.length}{' '}
            complete
          </small>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;
