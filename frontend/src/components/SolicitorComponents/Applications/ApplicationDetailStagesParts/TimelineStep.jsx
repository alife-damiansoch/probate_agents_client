// src/components/ApplicationDetailStages/ApplicationDetailStagesParts/TimelineStep.js

import TimelineLockedMessage from './TimelineLockedMessage';

const TimelineStep = ({
  step,
  index,
  userSteps,
  showModal,
  showCCRUploadModal,
  application,
}) => {
  const {
    id,
    title,
    description,
    completed,
    userAction,
    icon,
    actionRequired,
    isClickable,
    isBlurred,
    isDisabled,
    showConfirmButton,
  } = step;

  const submittedComplete = userSteps[0].completed;
  const solicitorAssigned = userSteps[1].completed;
  const estateValueComplete = userSteps[2].completed;
  const processingStatusComplete = userSteps[3].completed;
  const ccrFileComplete = userSteps[4].completed;

  return (
    <div key={id} className='d-flex mb-2 position-relative'>
      {index < userSteps.length - 1 && (
        <div
          className='position-absolute'
          style={{
            left: '18px',
            top: '36px',
            width: '2px',
            height: 'calc(100% + 4px)',
            backgroundColor: completed ? '#22c55e' : '#e5e7eb',
            zIndex: 1,
          }}
        />
      )}

      <div
        className='d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 me-3'
        style={{
          width: '36px',
          height: '36px',
          backgroundColor: completed
            ? '#f0fdf4'
            : actionRequired
            ? '#fefbf3'
            : isBlurred
            ? '#f3f4f6'
            : '#f9fafb',
          border: `2px solid ${
            completed
              ? '#22c55e'
              : actionRequired
              ? '#f59e0b'
              : isBlurred
              ? '#d1d5db'
              : '#d1d5db'
          }`,
          fontSize: '1rem',
          zIndex: 2,
          opacity: isBlurred ? 0.4 : 1,
          filter: isBlurred ? 'blur(1px)' : 'none',
          transition: 'all 0.2s ease',
        }}
      >
        {completed ? '✓' : icon}
      </div>

      <div
        className='flex-grow-1'
        style={{
          cursor:
            (id === 'processing' && isClickable && !isDisabled) ||
            (id === 'ccr' && isClickable && !isDisabled)
              ? 'pointer'
              : isDisabled
              ? 'not-allowed'
              : 'default',
          transition: 'all 0.2s ease',
          opacity: isBlurred ? 0.5 : isDisabled ? 0.8 : 1,
          filter: isBlurred ? 'blur(0.5px)' : 'none',
        }}
        onClick={
          id === 'processing' && isClickable && !isDisabled
            ? () => showModal(true)
            : id === 'ccr' && isClickable && !isDisabled
            ? () => showCCRUploadModal(true)
            : undefined
        }
        onMouseEnter={
          (id === 'processing' && isClickable && !isDisabled) ||
          (id === 'ccr' && isClickable && !isDisabled)
            ? (e) => {
                e.currentTarget.style.backgroundColor =
                  'rgba(102, 126, 234, 0.05)';
                e.currentTarget.style.borderRadius = '8px';
                e.currentTarget.style.marginLeft = '-8px';
                e.currentTarget.style.marginRight = '-8px';
                e.currentTarget.style.paddingLeft = '8px';
                e.currentTarget.style.paddingRight = '8px';
              }
            : undefined
        }
        onMouseLeave={
          (id === 'processing' && isClickable && !isDisabled) ||
          (id === 'ccr' && isClickable && !isDisabled)
            ? (e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.marginLeft = '0';
                e.currentTarget.style.marginRight = '0';
                e.currentTarget.style.paddingLeft = '0';
                e.currentTarget.style.paddingRight = '0';
              }
            : undefined
        }
      >
        <div className='d-flex align-items-center justify-content-between mb-1'>
          <div className='d-flex align-items-center'>
            <h6
              className='mb-0 fw-semibold d-flex align-items-center'
              style={{
                color: completed
                  ? '#059669'
                  : isBlurred
                  ? '#9ca3af'
                  : isDisabled
                  ? '#6b7280'
                  : '#374151',
                fontSize: '0.875rem',
              }}
            >
              {title}
              {(id === 'processing' || id === 'ccr') &&
                isClickable &&
                !isDisabled && (
                  <span
                    className='ms-2 d-flex align-items-center'
                    style={{
                      color: '#667eea',
                      fontSize: '0.75rem',
                      animation: 'pulse 2s infinite',
                    }}
                  >
                    👆 Click to view
                  </span>
                )}
              {id === 'processing' && isDisabled && (
                <span
                  className='ms-2 d-flex align-items-center'
                  style={{
                    color: '#059669',
                    fontSize: '0.75rem',
                    background:
                      'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    border: '1px solid #10b981',
                    fontWeight: '500',
                  }}
                >
                  ✓ Confirmed
                </span>
              )}
              {id === 'ccr' && isDisabled && (
                <span
                  className='ms-2 d-flex align-items-center'
                  style={{
                    color: '#059669',
                    fontSize: '0.75rem',
                    background:
                      'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    border: '1px solid #10b981',
                    fontWeight: '500',
                  }}
                >
                  ✓ Uploaded
                </span>
              )}
            </h6>
            {userAction && (
              <span
                className='badge ms-2'
                style={{
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  fontSize: '0.65rem',
                  fontWeight: '500',
                  padding: '2px 6px',
                }}
              >
                User Action Required
              </span>
            )}
          </div>

          {/* Visual indicator for processing status */}
          {id === 'processing' && (
            <div className='d-flex align-items-center'>
              {showConfirmButton && !isDisabled && (
                <span
                  className='badge me-2'
                  style={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    fontSize: '0.65rem',
                    fontWeight: '500',
                    padding: '2px 6px',
                  }}
                >
                  Action Available
                </span>
              )}
              {isBlurred && (
                <span
                  className='badge me-2'
                  style={{
                    backgroundColor: '#f3f4f6',
                    color: '#6b7280',
                    fontSize: '0.65rem',
                    fontWeight: '500',
                    padding: '2px 6px',
                  }}
                >
                  🔒 Locked
                </span>
              )}
              {isDisabled && (
                <span
                  className='badge me-2'
                  style={{
                    backgroundColor: '#d1fae5',
                    color: '#065f46',
                    fontSize: '0.65rem',
                    fontWeight: '500',
                    padding: '2px 6px',
                  }}
                >
                  ✓ Completed
                </span>
              )}
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: completed
                    ? '#22c55e'
                    : isBlurred
                    ? '#d1d5db'
                    : isDisabled
                    ? '#22c55e'
                    : '#667eea',
                  animation:
                    !completed && !isBlurred && !isDisabled
                      ? 'pulse 2s infinite'
                      : 'none',
                  opacity: isBlurred ? 0.4 : 1,
                }}
              />
            </div>
          )}
        </div>

        {/* Enhanced description with method display */}
        <div>
          <p
            className='mb-0 small'
            style={{
              color: isBlurred ? '#9ca3af' : isDisabled ? '#6b7280' : '#6b7280',
              fontSize: '0.8rem',
              lineHeight: '1.4',
            }}
          >
            {description}
            {(id === 'processing' || id === 'ccr') &&
              isClickable &&
              !completed &&
              !isDisabled && (
                <span style={{ color: '#667eea', fontStyle: 'italic' }}>
                  {' '}
                  - Click to manage
                </span>
              )}
          </p>

          {/* Method details display for completed processing status */}
          {id === 'processing' &&
            completed &&
            application.processing_status?.solicitor_preferred_aml_method && (
              <div
                className='mt-2 p-2 rounded-2'
                style={{
                  background:
                    application.processing_status
                      .solicitor_preferred_aml_method === 'KYC'
                      ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
                      : 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                  border:
                    application.processing_status
                      .solicitor_preferred_aml_method === 'KYC'
                      ? '1px solid #bfdbfe'
                      : '1px solid #a7f3d0',
                  fontSize: '0.75rem',
                }}
              >
                <div className='d-flex align-items-center'>
                  <span style={{ marginRight: '6px', fontSize: '0.9rem' }}>
                    {application.processing_status
                      .solicitor_preferred_aml_method === 'KYC'
                      ? '🔍'
                      : '📄'}
                  </span>
                  <div>
                    <span
                      style={{
                        color:
                          application.processing_status
                            .solicitor_preferred_aml_method === 'KYC'
                            ? '#1e40af'
                            : '#065f46',
                        fontWeight: '600',
                      }}
                    >
                      {application.processing_status
                        .solicitor_preferred_aml_method === 'KYC'
                        ? 'KYC Letter'
                        : 'Photo ID + Proof of Address'}
                    </span>
                    <span
                      style={{
                        color:
                          application.processing_status
                            .solicitor_preferred_aml_method === 'KYC'
                            ? '#1e3a8a'
                            : '#064e3b',
                        marginLeft: '4px',
                      }}
                    >
                      verification method confirmed
                    </span>
                  </div>
                </div>
              </div>
            )}

          {/* Documents locked info message */}
          {id === 'documents' && isBlurred && (
            <TimelineLockedMessage
              submittedComplete={submittedComplete}
              solicitorAssigned={solicitorAssigned}
              estateValueComplete={estateValueComplete}
              processingStatusComplete={processingStatusComplete}
              ccrFileComplete={ccrFileComplete}
            />
          )}

          {/* Processing locked info message */}
          {id === 'processing' && isBlurred && (
            <TimelineLockedMessage message='Complete Application Submitted, Solicitor Assignment, and Estate Information first' />
          )}

          {/* CCR locked info message */}
          {id === 'ccr' && isBlurred && (
            <TimelineLockedMessage message='Complete Details Confirmation first to unlock CCR file upload' />
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineStep;
