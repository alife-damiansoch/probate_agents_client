const ApplicationUser = ({ application }) => {
  return (
    <div className='row g-3'>
      <div className='col-12 col-md-6'>
        <div className='d-flex align-items-center gap-2 mb-3'>
          <div
            className='d-flex align-items-center justify-content-center rounded-3'
            style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
            }}
          >
            <svg width='16' height='16' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <h6
            className='mb-0 fw-bold text-dark'
            style={{ fontSize: '0.95rem' }}
          >
            Solicitor Details
          </h6>
        </div>

        <div
          className='rounded-3 border p-3'
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e2e8f0',
          }}
        >
          <div className='row g-2'>
            <div className='col-12'>
              <div className='d-flex justify-content-between align-items-center py-1 border-bottom border-light'>
                <span
                  className='text-muted fw-medium'
                  style={{ fontSize: '0.75rem' }}
                >
                  ID
                </span>
                <span
                  className='badge fw-bold px-2 py-1 rounded-2'
                  style={{
                    background: '#f1f5f9',
                    color: '#475569',
                    fontSize: '0.7rem',
                  }}
                >
                  {application.user.id}
                </span>
              </div>
            </div>

            <div className='col-12'>
              <div className='d-flex justify-content-between align-items-center py-1 border-bottom border-light'>
                <span
                  className='text-muted fw-medium'
                  style={{ fontSize: '0.75rem' }}
                >
                  Name
                </span>
                <span
                  className='fw-semibold text-dark'
                  style={{ fontSize: '0.8rem' }}
                >
                  {application.user.name}
                </span>
              </div>
            </div>

            <div className='col-12'>
              <div className='d-flex justify-content-between align-items-center py-1 border-bottom border-light'>
                <span
                  className='text-muted fw-medium'
                  style={{ fontSize: '0.75rem' }}
                >
                  Email
                </span>
                <span
                  className='text-primary fw-medium'
                  style={{ fontSize: '0.75rem' }}
                >
                  {application.user.email}
                </span>
              </div>
            </div>

            <div className='col-12'>
              <div className='d-flex justify-content-between align-items-center py-1'>
                <span
                  className='text-muted fw-medium'
                  style={{ fontSize: '0.75rem' }}
                >
                  Phone
                </span>
                <span
                  className='fw-medium text-dark'
                  style={{ fontSize: '0.8rem' }}
                >
                  {application.user.phone_number}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='col-12 col-md-6'>
        <div className='d-flex align-items-center gap-2 mb-3'>
          <div
            className='d-flex align-items-center justify-content-center rounded-3'
            style={{
              width: '32px',
              height: '32px',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              color: 'white',
            }}
          >
            <svg width='16' height='16' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-6a1 1 0 00-1-1H9a1 1 0 00-1 1v6a1 1 0 01-1 1H4a1 1 0 110-2V4z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <h6
            className='mb-0 fw-bold text-dark'
            style={{ fontSize: '0.95rem' }}
          >
            Firm Address
          </h6>
        </div>

        <div
          className='rounded-3 border p-3'
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e2e8f0',
          }}
        >
          <div className='row g-2'>
            <div className='col-12'>
              <div className='d-flex justify-content-between align-items-start py-1 border-bottom border-light'>
                <span
                  className='text-muted fw-medium'
                  style={{ fontSize: '0.75rem' }}
                >
                  Address
                </span>
                <div className='text-end'>
                  <div
                    className='fw-semibold text-dark'
                    style={{ fontSize: '0.8rem', lineHeight: '1.3' }}
                  >
                    {application.user.address.line1}
                  </div>
                  {application.user.address.line2 && (
                    <div
                      className='text-muted'
                      style={{ fontSize: '0.75rem', lineHeight: '1.3' }}
                    >
                      {application.user.address.line2}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className='col-12'>
              <div className='d-flex justify-content-between align-items-center py-1 border-bottom border-light'>
                <span
                  className='text-muted fw-medium'
                  style={{ fontSize: '0.75rem' }}
                >
                  City
                </span>
                <span
                  className='fw-semibold text-dark'
                  style={{ fontSize: '0.8rem' }}
                >
                  {application.user.address.town_city}
                </span>
              </div>
            </div>

            <div className='col-12'>
              <div className='d-flex justify-content-between align-items-center py-1 border-bottom border-light'>
                <span
                  className='text-muted fw-medium'
                  style={{ fontSize: '0.75rem' }}
                >
                  County
                </span>
                <span
                  className='fw-medium text-dark'
                  style={{ fontSize: '0.8rem' }}
                >
                  {application.user.address.county}
                </span>
              </div>
            </div>

            <div className='col-12'>
              <div className='d-flex justify-content-between align-items-center py-1'>
                <span
                  className='text-muted fw-medium'
                  style={{ fontSize: '0.75rem' }}
                >
                  Country
                </span>
                <span
                  className='badge fw-bold px-2 py-1 rounded-2'
                  style={{
                    background:
                      'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                    color: 'white',
                    fontSize: '0.7rem',
                  }}
                >
                  {application.user.country}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationUser;
