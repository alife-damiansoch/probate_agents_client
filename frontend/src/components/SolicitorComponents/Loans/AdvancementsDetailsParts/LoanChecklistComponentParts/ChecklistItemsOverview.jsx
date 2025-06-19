const ChecklistItemsOverview = ({ items }) => {
  return (
    <div className='mb-4'>
      <h5
        className='fw-bold mb-3 d-flex align-items-center gap-2'
        style={{ color: '#374151' }}
      >
        <svg width='24' height='24' fill='currentColor' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'
            clipRule='evenodd'
          />
        </svg>
        Checklist Items Overview
        <span
          className='badge px-2 py-1'
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            borderRadius: '6px',
            fontSize: '0.8rem',
          }}
        >
          {items.length} items
        </span>
      </h5>
      <div className='row g-3'>
        {items.map((item) => (
          <div key={item.id} className='col-lg-6'>
            <div
              className='p-4 rounded-3 border h-100'
              style={{
                background: item.is_complete
                  ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                  : item.users_checked_count > 0
                  ? 'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)'
                  : 'linear-gradient(135deg, #fff7ed 0%, #fef2f2 100%)',
                border: `2px solid ${
                  item.is_complete
                    ? '#34d399'
                    : item.users_checked_count > 0
                    ? '#fbbf24'
                    : '#fca5a5'
                }`,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 25px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div className='d-flex justify-content-between align-items-start mb-3'>
                <div className='d-flex align-items-center gap-3'>
                  <div
                    className='p-2 rounded-2'
                    style={{
                      background: item.is_complete
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : item.users_checked_count > 0
                        ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      minWidth: '36px',
                      height: '36px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.is_complete ? (
                      <svg
                        width='18'
                        height='18'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    ) : item.users_checked_count > 0 ? (
                      <svg
                        width='18'
                        height='18'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                          clipRule='evenodd'
                        />
                      </svg>
                    ) : (
                      <svg
                        width='18'
                        height='18'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h6
                      className='fw-bold mb-1'
                      style={{
                        color: item.is_complete
                          ? '#065f46'
                          : item.users_checked_count > 0
                          ? '#92400e'
                          : '#991b1b',
                        fontSize: '1rem',
                      }}
                    >
                      {item.title}
                    </h6>
                    <div
                      className='small'
                      style={{
                        color: item.is_complete
                          ? '#047857'
                          : item.users_checked_count > 0
                          ? '#b45309'
                          : '#b91c1c',
                      }}
                    >
                      {item.is_complete
                        ? '✓ Fully approved'
                        : item.users_checked_count > 0
                        ? `${item.users_checked_count}/${item.required_count} approvals - In progress`
                        : 'Not started'}
                    </div>
                  </div>
                </div>
                <div className='text-center'>
                  <div
                    className='badge px-2 py-1 mb-1'
                    style={{
                      background: item.is_complete
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : item.users_checked_count > 0
                        ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      fontSize: '0.8rem',
                      borderRadius: '6px',
                      minWidth: '45px',
                    }}
                  >
                    {item.users_checked_count}/{item.required_count}
                  </div>
                  <div className='small text-muted'>Approvals</div>
                </div>
              </div>

              {item.description && (
                <div className='mb-3'>
                  <p
                    className='small mb-0 p-2 rounded-2'
                    style={{
                      background: item.is_complete
                        ? '#ecfdf5'
                        : item.users_checked_count > 0
                        ? '#fefbf0'
                        : '#fef2f2',
                      color: item.is_complete
                        ? '#047857'
                        : item.users_checked_count > 0
                        ? '#b45309'
                        : '#b91c1c',
                      border: `1px solid ${
                        item.is_complete
                          ? '#a7f3d0'
                          : item.users_checked_count > 0
                          ? '#fed7aa'
                          : '#fca5a5'
                      }`,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              )}

              {/* Progress Bar */}
              <div className='mb-2'>
                <div className='d-flex justify-content-between align-items-center mb-1'>
                  <small className='text-muted fw-semibold'>Progress</small>
                  <small className='text-muted'>
                    {Math.round(
                      (item.users_checked_count / item.required_count) * 100
                    )}
                    %
                  </small>
                </div>
                <div
                  className='progress'
                  style={{
                    height: '8px',
                    borderRadius: '4px',
                    background: '#f1f5f9',
                  }}
                >
                  <div
                    className='progress-bar'
                    style={{
                      width: `${
                        (item.users_checked_count / item.required_count) * 100
                      }%`,
                      background: item.is_complete
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : item.users_checked_count > 0
                        ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>

              {/* Status Footer */}
              <div
                className='d-flex justify-content-between align-items-center pt-2 border-top'
                style={{ borderColor: 'rgba(0,0,0,0.1)' }}
              >
                <div className='d-flex align-items-center gap-2'>
                  <div
                    className='rounded-circle'
                    style={{
                      width: '8px',
                      height: '8px',
                      background: item.is_complete
                        ? '#10b981'
                        : item.users_checked_count > 0
                        ? '#f59e0b'
                        : '#ef4444',
                    }}
                  />
                  <small
                    className='fw-semibold'
                    style={{
                      color: item.is_complete
                        ? '#065f46'
                        : item.users_checked_count > 0
                        ? '#92400e'
                        : '#991b1b',
                    }}
                  >
                    {item.is_complete
                      ? 'Complete'
                      : item.users_checked_count > 0
                      ? 'In Progress'
                      : 'Pending'}
                  </small>
                </div>
                <small className='text-muted'>
                  Priority #{item.order || 0}
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className='mt-4'>
        <div
          className='p-4 rounded-4'
          style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '2px solid #e2e8f0',
          }}
        >
          <div className='row g-4 text-center'>
            <div className='col-md-3'>
              <div className='d-flex flex-column align-items-center'>
                <div
                  className='p-2 rounded-2 mb-2'
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
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='fw-bold text-success fs-5'>
                  {items.filter((item) => item.is_complete).length}
                </div>
                <small className='text-muted fw-semibold'>Completed</small>
              </div>
            </div>
            <div className='col-md-3'>
              <div className='d-flex flex-column align-items-center'>
                <div
                  className='p-2 rounded-2 mb-2'
                  style={{
                    background:
                      'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='fw-bold text-warning fs-5'>
                  {
                    items.filter(
                      (item) =>
                        !item.is_complete && item.users_checked_count > 0
                    ).length
                  }
                </div>
                <small className='text-muted fw-semibold'>In Progress</small>
              </div>
            </div>
            <div className='col-md-3'>
              <div className='d-flex flex-column align-items-center'>
                <div
                  className='p-2 rounded-2 mb-2'
                  style={{
                    background:
                      'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
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
                      d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='fw-bold text-danger fs-5'>
                  {
                    items.filter((item) => item.users_checked_count === 0)
                      .length
                  }
                </div>
                <small className='text-muted fw-semibold'>Not Started</small>
              </div>
            </div>
            <div className='col-md-3'>
              <div className='d-flex flex-column align-items-center'>
                <div
                  className='p-2 rounded-2 mb-2'
                  style={{
                    background:
                      'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
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
                      d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='fw-bold text-primary fs-5'>
                  {Math.round(
                    (items.filter((item) => item.is_complete).length /
                      items.length) *
                      100
                  )}
                  %
                </div>
                <small className='text-muted fw-semibold'>
                  Overall Progress
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistItemsOverview;
