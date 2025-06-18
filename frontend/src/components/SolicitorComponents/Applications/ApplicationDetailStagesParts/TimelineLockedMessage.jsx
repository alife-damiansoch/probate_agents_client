// src/components/ApplicationDetailStages/ApplicationDetailStagesParts/TimelineLockedMessage.js

const TimelineLockedMessage = ({ message, ...completionProps }) => {
  if (message) {
    return (
      <div
        className='mt-2 p-2 rounded'
        style={{
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          fontSize: '0.75rem',
          color: '#6b7280',
        }}
      >
        <div className='d-flex align-items-center'>
          <span style={{ marginRight: '6px' }}>ℹ️</span>
          <span>{message}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className='mt-2 p-3 rounded-3'
      style={{
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        border: '1px solid #f59e0b',
        fontSize: '0.75rem',
        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.1)',
      }}
    >
      <div className='d-flex align-items-start'>
        <div
          className='me-2 p-1 rounded-circle flex-shrink-0'
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '0.7rem' }}>🔒</span>
        </div>
        <div>
          <p
            className='mb-1 fw-semibold'
            style={{ color: '#92400e', fontSize: '0.8rem' }}
          >
            Documents Phase Locked
          </p>
          <p className='mb-2' style={{ color: '#78350f', lineHeight: '1.4' }}>
            Complete all previous steps to unlock document submission:
          </p>
          <div className='d-flex flex-wrap gap-1'>
            {[
              {
                id: 'submitted',
                label: 'Application Submitted',
                completed: completionProps.submittedComplete,
              },
              {
                id: 'solicitor',
                label: 'Solicitor Assignment',
                completed: completionProps.solicitorAssigned,
              },
              {
                id: 'estate',
                label: 'Estate Information',
                completed: completionProps.estateValueComplete,
              },
              {
                id: 'processing',
                label: 'Details Confirmation',
                completed: completionProps.processingStatusComplete,
              },
              {
                id: 'ccr',
                label: 'Create and Review CCR File',
                completed: completionProps.ccrFileComplete,
              },
            ].map((reqStep) => (
              <span
                key={reqStep.id}
                className='badge'
                style={{
                  backgroundColor: reqStep.completed ? '#d1fae5' : '#fef2f2',
                  color: reqStep.completed ? '#065f46' : '#dc2626',
                  fontSize: '0.65rem',
                  fontWeight: '500',
                  padding: '2px 6px',
                  border: reqStep.completed
                    ? '1px solid #10b981'
                    : '1px solid #f87171',
                }}
              >
                {reqStep.completed ? '✓' : '○'} {reqStep.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineLockedMessage;
