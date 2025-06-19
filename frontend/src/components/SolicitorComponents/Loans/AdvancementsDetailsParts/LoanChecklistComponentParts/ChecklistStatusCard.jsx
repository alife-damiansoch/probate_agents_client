const ChecklistStatusCard = ({ checklistData, approvalStatusText }) => {
  return (
    <div
      className='p-4 rounded-4 mb-4'
      style={{
        background: checklistData.checklist_complete
          ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
          : 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
        border: `2px solid ${
          checklistData.checklist_complete ? '#34d399' : '#fbbf24'
        }`,
      }}
    >
      <div className='d-flex justify-content-between align-items-center'>
        <div className='d-flex align-items-center gap-3'>
          <div
            className='p-3 rounded-3'
            style={{
              background: checklistData.checklist_complete
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
            }}
          >
            <svg width='32' height='32' fill='currentColor' viewBox='0 0 20 20'>
              {checklistData.checklist_complete ? (
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              ) : (
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                  clipRule='evenodd'
                />
              )}
            </svg>
          </div>
          <div>
            <h4
              className='mb-1 fw-bold'
              style={{
                color: checklistData.checklist_complete ? '#065f46' : '#92400e',
              }}
            >
              {checklistData.checklist_complete
                ? 'Checklist Complete'
                : 'Checklist In Progress'}
            </h4>
            <p
              className='mb-0'
              style={{
                color: checklistData.checklist_complete ? '#047857' : '#b45309',
              }}
            >
              {checklistData.checklist_complete
                ? 'All required approvals have been completed'
                : `${checklistData.submissions?.length || 0} of ${
                    checklistData.config?.required_approvers || 2
                  } required approvals completed`}
            </p>
          </div>
        </div>
        <div
          className='badge px-4 py-2'
          style={{
            background: checklistData.checklist_complete
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '600',
          }}
        >
          {approvalStatusText}
        </div>
      </div>
    </div>
  );
};

export default ChecklistStatusCard;
