const LoanDetailsCards = ({
  checklistData,
  advancement,
  formatMoney,
  approvalStatusText,
}) => {
  console.log('ADVANCEMENT', advancement);
  return (
    <div className='row mb-4 g-4'>
      <div className='col-md-4'>
        <div
          className='p-4 rounded-4 h-100'
          style={{
            background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            border: '2px solid #93c5fd',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div className='d-flex align-items-center gap-3 mb-2'>
            <div
              className='p-2 rounded-2'
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
              }}
            >
              <svg
                width='20'
                height='20'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z' />
              </svg>
            </div>
            <span className='text-muted fw-semibold'>Loan Amount</span>
          </div>
          <div
            className='fw-bold'
            style={{ color: '#1e40af', fontSize: '1.5rem' }}
          >
            {formatMoney(
              checklistData.loan_amount,
              advancement?.currency_sign || '£'
            )}
          </div>
        </div>
      </div>
      <div className='col-md-4'>
        <div
          className='p-4 rounded-4 h-100'
          style={{
            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
            border: '2px solid #86efac',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div className='d-flex align-items-center gap-3 mb-2'>
            <div
              className='p-2 rounded-2'
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
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
            <span className='text-muted fw-semibold'>Applicant</span>
          </div>
          <div
            className='fw-bold'
            style={{ color: '#065f46', fontSize: '1.25rem' }}
          >
            {checklistData.applicant}
          </div>
        </div>
      </div>
      <div className='col-md-4'>
        <div
          className='p-4 rounded-4 h-100'
          style={{
            background: checklistData.checklist_complete
              ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
              : 'linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%)',
            border: checklistData.checklist_complete
              ? '2px solid #86efac'
              : '2px solid #f9a8d4',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div className='d-flex align-items-center gap-3 mb-2'>
            <div
              className='p-2 rounded-2'
              style={{
                background: checklistData.checklist_complete
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                color: 'white',
              }}
            >
              <svg
                width='20'
                height='20'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                {checklistData.checklist_complete ? (
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                ) : (
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z'
                    clipRule='evenodd'
                  />
                )}
              </svg>
            </div>
            <span className='text-muted fw-semibold'>Approval Status</span>
          </div>
          <div
            className='fw-bold'
            style={{
              color: checklistData.checklist_complete ? '#065f46' : '#be185d',
              fontSize: '1.25rem',
            }}
          >
            {approvalStatusText}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetailsCards;
