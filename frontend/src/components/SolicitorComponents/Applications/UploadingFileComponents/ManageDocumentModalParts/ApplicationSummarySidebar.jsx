import { formatMoney } from '../../../../GenericFunctions/HelperGenericFunctions';

const ApplicationSummarySidebar = ({
  application,
  fee,
  currentRequirements = [],
  hasUndertaking = false,
  hasLoanAgreement = false,
  hasTermsOfBusiness = false,
  hasSECCI = false, // Add this prop
}) => {
  return (
    <div className='col-xl-3 col-lg-4'>
      <div
        className='p-4 rounded-4 h-100 position-sticky'
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          border: '1px solid #bae6fd',
          top: '20px',
        }}
      >
        <div className='d-flex align-items-center gap-3 mb-4'>
          <div
            className='d-flex align-items-center justify-content-center rounded-3'
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#0ea5e9',
              color: 'white',
            }}
          >
            <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <h6 className='mb-0 fw-bold' style={{ color: '#0369a1' }}>
            Application Summary
          </h6>
        </div>

        <div className='space-y-3'>
          <div className='d-flex justify-content-between align-items-center py-2 border-bottom border-light'>
            <span className='text-muted small'>Application ID:</span>
            <span className='fw-semibold small'>#{application.id}</span>
          </div>
          <div className='d-flex justify-content-between align-items-center py-2 border-bottom border-light'>
            <span className='text-muted small'>Amount:</span>
            <span className='fw-semibold small text-success'>
              {application.currency_sign}
              {formatMoney(application.amount)}
            </span>
          </div>
          <div className='d-flex justify-content-between align-items-center py-2 border-bottom border-light'>
            <span className='text-muted small'>Term:</span>
            <span className='fw-semibold small'>{application.term} months</span>
          </div>
          <div className='d-flex justify-content-between align-items-center py-2 border-bottom border-light'>
            <span className='text-muted small'>Calculated Fee:</span>
            <span className='fw-semibold small text-primary'>
              {application.currency_sign}
              {formatMoney(fee)}
            </span>
          </div>
        </div>

        {/* Document Requirements Summary */}
        {currentRequirements.length > 0 && (
          <div className='mt-4'>
            <h6 className='fw-bold mb-3' style={{ color: '#0369a1' }}>
              Required Documents ({currentRequirements.length})
            </h6>
            <div className='space-y-2'>
              {currentRequirements.map((requirement) => (
                <div
                  key={requirement.id}
                  className='d-flex align-items-center gap-2 p-2 rounded-3'
                  style={{
                    backgroundColor: requirement.is_uploaded
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'rgba(245, 158, 11, 0.1)',
                    border: `1px solid ${
                      requirement.is_uploaded
                        ? 'rgba(16, 185, 129, 0.2)'
                        : 'rgba(245, 158, 11, 0.2)'
                    }`,
                  }}
                >
                  <div
                    className='d-flex align-items-center justify-content-center rounded-2'
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: requirement.is_uploaded
                        ? '#10b981'
                        : '#f59e0b',
                      color: 'white',
                    }}
                  >
                    <svg
                      width='12'
                      height='12'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      {requirement.is_uploaded ? (
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
                  <div className='flex-grow-1'>
                    <span
                      className='small fw-semibold'
                      style={{
                        color: requirement.is_uploaded ? '#047857' : '#d97706',
                      }}
                    >
                      {requirement.document_type.name}
                    </span>
                    {requirement.document_type.signature_required && (
                      <div
                        style={{
                          fontSize: '0.7rem',
                          color: '#6b7280',
                          marginTop: '1px',
                        }}
                      >
                        Requires {requirement.document_type.who_needs_to_sign}{' '}
                        signature
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Template Documents Status */}
        {(hasTermsOfBusiness ||
          hasSECCI ||
          hasUndertaking ||
          hasLoanAgreement) && (
          <div className='mt-4'>
            <h6 className='fw-bold mb-3' style={{ color: '#0369a1' }}>
              Template Documents
            </h6>
            <div className='space-y-2'>
              {/* Terms of Business - First as it's pre-contractual */}
              {hasTermsOfBusiness && (
                <div
                  className='d-flex align-items-center gap-2 p-2 rounded-3'
                  style={{
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                  }}
                >
                  <div
                    className='d-flex align-items-center justify-content-center rounded-2'
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                    }}
                  >
                    <svg
                      width='12'
                      height='12'
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
                  <div className='flex-grow-1'>
                    <span
                      className='small fw-semibold'
                      style={{ color: '#6b46c1' }}
                    >
                      Terms of Business
                    </span>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: '#6b7280',
                        marginTop: '1px',
                      }}
                    >
                      Pre-contractual information
                    </div>
                  </div>
                </div>
              )}

              {/* SECCI Form - Second as it's mandatory pre-contractual */}
              {hasSECCI && (
                <div
                  className='d-flex align-items-center gap-2 p-2 rounded-3'
                  style={{
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    border: '1px solid rgba(14, 165, 233, 0.2)',
                  }}
                >
                  <div
                    className='d-flex align-items-center justify-content-center rounded-2'
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#0ea5e9',
                      color: 'white',
                    }}
                  >
                    <svg
                      width='12'
                      height='12'
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
                  <div className='flex-grow-1'>
                    <span
                      className='small fw-semibold'
                      style={{ color: '#0369a1' }}
                    >
                      SECCI Form
                    </span>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: '#6b7280',
                        marginTop: '1px',
                      }}
                    >
                      EU credit information
                    </div>
                  </div>
                </div>
              )}

              {/* Solicitor Undertaking */}
              {hasUndertaking && (
                <div
                  className='d-flex align-items-center gap-2 p-2 rounded-3'
                  style={{
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                  }}
                >
                  <div
                    className='d-flex align-items-center justify-content-center rounded-2'
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#f59e0b',
                      color: 'white',
                    }}
                  >
                    <svg
                      width='12'
                      height='12'
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
                  <div className='flex-grow-1'>
                    <span
                      className='small fw-semibold'
                      style={{ color: '#92400e' }}
                    >
                      Solicitor Undertaking
                    </span>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: '#6b7280',
                        marginTop: '1px',
                      }}
                    >
                      Requires solicitor signature
                    </div>
                  </div>
                </div>
              )}

              {/* Advancement Agreement */}
              {hasLoanAgreement && (
                <div
                  className='d-flex align-items-center gap-2 p-2 rounded-3'
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                  }}
                >
                  <div
                    className='d-flex align-items-center justify-content-center rounded-2'
                    style={{
                      width: '20px',
                      height: '20px',
                      backgroundColor: '#10b981',
                      color: 'white',
                    }}
                  >
                    <svg
                      width='12'
                      height='12'
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
                  <div className='flex-grow-1'>
                    <span
                      className='small fw-semibold'
                      style={{ color: '#047857' }}
                    >
                      Advancement Agreement
                    </span>
                    <div
                      style={{
                        fontSize: '0.7rem',
                        color: '#6b7280',
                        marginTop: '1px',
                      }}
                    >
                      Requires applicant signature
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div
          className='mt-4 p-3 rounded-3 text-center'
          style={{
            backgroundColor: 'rgba(14, 165, 233, 0.1)',
            border: '1px solid rgba(14, 165, 233, 0.2)',
          }}
        >
          <small className='text-muted'>Fee calculated at 15% per annum</small>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSummarySidebar;
