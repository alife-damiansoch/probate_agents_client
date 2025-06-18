// src/components/ApplicationDetailStages/ApplicationDetailStagesParts/RejectionReason.js

const RejectionReason = ({ application }) => {
  if (!application.is_rejected || !application.rejected_reason) return null;

  return (
    <div
      className='mt-3 p-3 rounded-3'
      style={{
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
      }}
    >
      <div className='d-flex align-items-start'>
        <span style={{ fontSize: '1rem', marginRight: '8px' }}>❌</span>
        <div>
          <h6
            className='fw-bold mb-1'
            style={{ color: '#dc2626', fontSize: '0.875rem' }}
          >
            Application Rejected
          </h6>
          <p className='mb-0' style={{ color: '#7f1d1d', fontSize: '0.8rem' }}>
            {application.rejected_reason}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RejectionReason;
