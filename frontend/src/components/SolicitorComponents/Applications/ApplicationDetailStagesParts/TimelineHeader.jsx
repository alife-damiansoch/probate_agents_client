// src/components/ApplicationDetailStages/ApplicationDetailStagesParts/TimelineHeader.js

const TimelineHeader = ({ incompleteSteps }) => {
  return (
    <div className='d-flex align-items-center justify-content-between mb-3'>
      <h6 className='mb-0 fw-bold' style={{ color: '#111827' }}>
        User Completion Status
      </h6>
      <div className='d-flex align-items-center gap-2'>
        <button
          type='button'
          className='btn btn-sm d-flex align-items-center gap-1'
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            color: '#64748b',
            fontSize: '0.75rem',
            padding: '4px 8px',
            borderRadius: '6px',
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{ fontSize: '0.7rem' }}>🔄</span>
          Refresh
        </button>
        {incompleteSteps.length > 0 && (
          <span
            className='badge px-2 py-1'
            style={{
              backgroundColor: '#fef3c7',
              color: '#92400e',
              fontSize: '0.7rem',
              fontWeight: '600',
            }}
          >
            Action Needed
          </span>
        )}
      </div>
    </div>
  );
};

export default TimelineHeader;
