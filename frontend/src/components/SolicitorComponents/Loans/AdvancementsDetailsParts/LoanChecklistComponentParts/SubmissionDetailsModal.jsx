import { useEffect, useState } from 'react';

const SubmissionDetailsModal = ({ submission, checklistItems, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Get the items that were checked in this submission
  const getSubmissionItems = () => {
    if (!submission.items_checked || !checklistItems) return [];

    return checklistItems.filter((item) =>
      submission.items_checked.includes(item.title)
    );
  };

  const submissionItems = getSubmissionItems();
  console.log('SUBMITION ITEM', submissionItems);
  return (
    <div
      className='position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
      style={{
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(12px)',
        borderRadius: '24px',
        zIndex: 10,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
      }}
      onClick={handleBackdropClick}
    >
      <div
        className='overflow-auto'
        style={{
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
          borderRadius: '16px',
          margin: '20px',
          maxWidth: '800px',
          maxHeight: '85vh',
          width: '90%',
          padding: '24px',
          transform: isVisible
            ? 'scale(1) translateY(0)'
            : 'scale(0.96) translateY(10px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow:
            '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className='d-flex align-items-center justify-content-between mb-3 pb-2'
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}
        >
          <div className='d-flex align-items-center gap-2'>
            <div
              className='p-1 rounded-2'
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
              }}
            >
              <svg
                width='16'
                height='16'
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
              <h5
                className='mb-0 fw-bold'
                style={{ fontSize: '1rem', color: '#1e293b' }}
              >
                {submission.user}
              </h5>
              <p
                className='mb-0'
                style={{ color: '#64748b', fontSize: '0.75rem' }}
              >
                {new Date(submission.submitted_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
          <button
            className='btn p-1'
            style={{
              background: 'rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '6px',
              color: '#64748b',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
            onClick={handleClose}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.08)';
              e.target.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.04)';
              e.target.style.color = '#64748b';
            }}
          >
            <svg width='14' height='14' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>

        {/* Submission Stats */}
        <div className='row mb-3 g-2'>
          <div className='col-md-4'>
            <div
              className='p-2 rounded-2 h-100'
              style={{
                background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                border: '1px solid #bfdbfe',
                boxShadow: '0 1px 4px rgba(59, 130, 246, 0.1)',
              }}
            >
              <div className='d-flex align-items-center gap-2 mb-1'>
                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    background: '#3b82f6',
                    borderRadius: '50%',
                  }}
                />
                <span
                  style={{
                    color: '#6b7280',
                    fontSize: '0.7rem',
                    fontWeight: '500',
                  }}
                >
                  Items
                </span>
              </div>
              <div
                className='fw-bold'
                style={{ fontSize: '1.1rem', color: '#1e40af' }}
              >
                {submission.checked_items}/{submission.total_items}
              </div>
            </div>
          </div>
          <div className='col-md-4'>
            <div
              className='p-2 rounded-2 h-100'
              style={{
                background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                border: '1px solid #86efac',
                boxShadow: '0 1px 4px rgba(16, 185, 129, 0.1)',
              }}
            >
              <div className='d-flex align-items-center gap-2 mb-1'>
                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    background: '#10b981',
                    borderRadius: '50%',
                  }}
                />
                <span
                  style={{
                    color: '#6b7280',
                    fontSize: '0.7rem',
                    fontWeight: '500',
                  }}
                >
                  Complete
                </span>
              </div>
              <div
                className='fw-bold'
                style={{ fontSize: '1.1rem', color: '#047857' }}
              >
                {Math.round(
                  (submission.checked_items / submission.total_items) * 100
                )}
                %
              </div>
            </div>
          </div>
          <div className='col-md-4'>
            <div
              className='p-2 rounded-2 h-100'
              style={{
                background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
                border: '1px solid #f9a8d4',
                boxShadow: '0 1px 4px rgba(236, 72, 153, 0.1)',
              }}
            >
              <div className='d-flex align-items-center gap-2 mb-1'>
                <div
                  style={{
                    width: '4px',
                    height: '4px',
                    background: '#ec4899',
                    borderRadius: '50%',
                  }}
                />
                <span
                  style={{
                    color: '#6b7280',
                    fontSize: '0.7rem',
                    fontWeight: '500',
                  }}
                >
                  Status
                </span>
              </div>
              <div
                className='fw-bold'
                style={{ fontSize: '0.9rem', color: '#be185d' }}
              >
                Verified
              </div>
            </div>
          </div>
        </div>

        {/* Overall Notes */}
        {submission.notes && (
          <div className='mb-3'>
            <h6
              className='fw-semibold mb-2'
              style={{ fontSize: '0.85rem', color: '#374151' }}
            >
              Notes
            </h6>
            <div
              className='p-2 rounded-2'
              style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                border: '1px solid #7dd3fc',
                boxShadow: '0 1px 4px rgba(14, 165, 233, 0.1)',
              }}
            >
              <p
                className='mb-0'
                style={{
                  fontSize: '0.8rem',
                  lineHeight: '1.4',
                  color: '#0c4a6e',
                }}
              >
                {submission.notes}
              </p>
            </div>
          </div>
        )}

        {/* Checked Items */}
        <div className='mb-3'>
          <div className='d-flex align-items-center justify-content-between mb-2'>
            <h6
              className='fw-semibold mb-0'
              style={{ fontSize: '0.85rem', color: '#374151' }}
            >
              Verified Items
            </h6>
            <span
              className='badge px-2 py-1'
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: 'white',
                borderRadius: '4px',
                fontSize: '0.7rem',
                boxShadow: '0 1px 3px rgba(16, 185, 129, 0.2)',
              }}
            >
              {submission.checked_items}
            </span>
          </div>

          {submissionItems.length > 0 ? (
            <div
              className='rounded-2'
              style={{
                background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
                border: '1px solid #e5e7eb',
                maxHeight: '300px',
                overflowY: 'auto',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
              }}
            >
              {submissionItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-2 ${
                    index !== submissionItems.length - 1 ? 'border-bottom' : ''
                  }`}
                  style={{
                    borderBottomColor: '#e5e7eb',
                    transition: 'all 0.2s ease',
                    animation: `slideIn 0.3s ease-out ${index * 0.05}s both`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(59, 130, 246, 0.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div className='d-flex align-items-start gap-2'>
                    <div
                      className='d-flex align-items-center justify-content-center flex-shrink-0 mt-1'
                      style={{
                        width: '16px',
                        height: '16px',
                        background:
                          'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '4px',
                        boxShadow: '0 1px 3px rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <svg
                        width='10'
                        height='10'
                        fill='white'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <div className='flex-grow-1'>
                      <h6
                        className='fw-semibold mb-1'
                        style={{ fontSize: '0.8rem', color: '#1e293b' }}
                      >
                        {item.title}
                      </h6>
                      {item.description && (
                        <p
                          className='mb-1 small'
                          style={{
                            color: '#64748b',
                            fontSize: '0.7rem',
                            lineHeight: '1.3',
                          }}
                        >
                          {item.description}
                        </p>
                      )}
                      {/* User Notes Display */}
                      {item.user_notes && item.user_notes.trim() !== '' && (
                        <div
                          className='mt-1 p-2 rounded-2'
                          style={{
                            background:
                              'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                            border: '1px solid #d1d5db',
                            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                          }}
                        >
                          <div className='d-flex align-items-center gap-1 mb-1'>
                            <svg
                              width='10'
                              height='10'
                              fill='#8b5cf6'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <span
                              style={{
                                color: '#8b5cf6',
                                fontSize: '0.65rem',
                                fontWeight: '600',
                              }}
                            >
                              Notes
                            </span>
                          </div>
                          <p
                            className='mb-0'
                            style={{
                              color: '#374151',
                              fontSize: '0.7rem',
                              lineHeight: '1.3',
                              fontStyle: 'italic',
                            }}
                          >
                            "{item.user_notes}"
                          </p>
                        </div>
                      )}
                    </div>
                    <div
                      className='badge px-1 py-1'
                      style={{
                        background:
                          'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                        color: '#047857',
                        borderRadius: '3px',
                        fontSize: '0.65rem',
                        border: '1px solid #86efac',
                        height: 'fit-content',
                        boxShadow: '0 1px 2px rgba(16, 185, 129, 0.1)',
                        minWidth: '18px',
                        textAlign: 'center',
                      }}
                    >
                      ✓
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className='text-center py-4'>
              <div
                className='p-2 rounded-2 d-inline-block mb-2'
                style={{
                  background:
                    'linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%)',
                  border: '1px solid #fbbf24',
                  boxShadow: '0 1px 4px rgba(245, 158, 11, 0.1)',
                }}
              >
                <svg width='24' height='24' fill='#d97706' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <h6
                className='fw-semibold'
                style={{ color: '#6b7280', fontSize: '0.8rem' }}
              >
                No Items Verified
              </h6>
              <p style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                This submission contained no verified items.
              </p>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div
          className='d-flex justify-content-end pt-2'
          style={{ borderTop: '1px solid rgba(0, 0, 0, 0.08)' }}
        >
          <button
            type='button'
            className='btn px-3 py-2'
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '0.8rem',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s ease',
              transform: 'translateY(0)',
            }}
            onClick={handleClose}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)';
            }}
          >
            Close
          </button>
        </div>

        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          /* Custom scrollbar */
          div::-webkit-scrollbar {
            width: 4px;
          }

          div::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 2px;
          }

          div::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 2px;
          }

          div::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.3);
          }
        `}</style>
      </div>
    </div>
  );
};

export default SubmissionDetailsModal;
