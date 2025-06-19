const SubmissionsGrid = ({ submissions, onSubmissionClick }) => {
  return (
    <div className='mb-4'>
      <h5
        className='fw-bold mb-3 d-flex align-items-center gap-2'
        style={{ color: '#374151' }}
      >
        <svg width='24' height='24' fill='currentColor' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
            clipRule='evenodd'
          />
        </svg>
        Completed Submissions
      </h5>
      <div className='row g-4'>
        {submissions.map((submission, index) => (
          <div key={index} className='col-lg-6'>
            <div
              className='p-4 rounded-4 border h-100'
              style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                border: '2px solid #e2e8f0',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onClick={() => onSubmissionClick(submission)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow =
                  '0 12px 35px rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.borderColor = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div className='d-flex justify-content-between align-items-start mb-3'>
                <div className='d-flex align-items-center gap-3'>
                  <div
                    className='p-3 rounded-3'
                    style={{
                      background:
                        'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                    }}
                  >
                    <svg
                      width='20'
                      height='20'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div>
                    <div className='fw-bold text-success fs-5'>
                      {submission.user}
                    </div>
                    <small className='text-muted fw-medium'>
                      {new Date(submission.submitted_at).toLocaleString()}
                    </small>
                  </div>
                </div>
                <div className='d-flex flex-column align-items-end gap-2'>
                  <div
                    className='badge px-3 py-2'
                    style={{
                      background:
                        'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: 'white',
                      borderRadius: '8px',
                    }}
                  >
                    {submission.checked_items}/{submission.total_items}
                  </div>
                  <small className='text-muted'>Click to view details</small>
                </div>
              </div>
              {submission.notes && (
                <div
                  className='p-3 rounded-3'
                  style={{ background: '#e0f2fe', border: '1px solid #b3e5fc' }}
                >
                  <small className='fw-semibold text-muted d-block mb-1'>
                    Notes:
                  </small>
                  <small style={{ color: '#0369a1' }}>
                    {submission.notes.length > 100
                      ? `${submission.notes.substring(0, 100)}...`
                      : submission.notes}
                  </small>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmissionsGrid;
