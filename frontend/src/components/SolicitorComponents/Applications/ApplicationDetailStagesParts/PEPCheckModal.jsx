import { useEffect, useState } from 'react';

const PEPCheckModal = ({ isOpen, onClose, onRunCheck, application }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [checkResult, setCheckResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const applicant = application?.applicants?.[0];

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setShowResult(false);
      setCheckResult(null);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      setShowResult(false);
      setCheckResult(null);
      setIsRunning(false);
      onClose();
    }, 300);
  };

  const handleRunCheck = async () => {
    setIsRunning(true);
    try {
      const result = await onRunCheck();
      setCheckResult(result);
      setShowResult(true);
    } catch (error) {
      console.error('PEP check failed:', error);
      setCheckResult({
        success: false,
        error: error.message || 'Failed to run PEP check',
      });
      setShowResult(true);
    } finally {
      setIsRunning(false);
    }
  };

  const handleFinish = () => {
    handleClose();
  };

  if (!isOpen && !isVisible) return null;

  const isHighRisk =
    checkResult?.requires_review || checkResult?.total_hits > 0;

  return (
    <div
      className='position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
      style={{
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(12px)',
        opacity: isClosing ? 0 : 1,
        transition: 'all 0.3s ease',
      }}
      onClick={handleClose}
    >
      <div
        className='position-relative mx-3'
        style={{
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          transform: isClosing ? 'scale(0.95)' : 'scale(1)',
          transition: 'all 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className='rounded-4 overflow-hidden d-flex flex-column'
          style={{
            background: 'rgba(255, 255, 255, 0.98)',
            backdropFilter: 'blur(25px)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow:
              '0 30px 80px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            maxHeight: '90vh',
          }}
        >
          {/* Dynamic Header */}
          <div
            className='p-4 flex-shrink-0'
            style={{
              background: showResult
                ? isHighRisk
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Animated Background Pattern */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                animation: 'pulse 3s ease-in-out infinite',
              }}
            />

            <div className='d-flex align-items-center justify-content-between position-relative'>
              <div className='d-flex align-items-center'>
                <div
                  className='me-3 d-flex align-items-center justify-content-center rounded-circle'
                  style={{
                    width: '50px',
                    height: '50px',
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>
                    {isRunning
                      ? '⏳'
                      : showResult
                      ? isHighRisk
                        ? '⚠️'
                        : '✅'
                      : '🔍'}
                  </span>
                </div>
                <div>
                  <h4 className='mb-1 fw-bold text-white'>
                    {showResult
                      ? isHighRisk
                        ? 'PEP Check - Review Required'
                        : 'PEP Check - All Clear'
                      : 'PEP & Sanctions Screening'}
                  </h4>
                  <p className='mb-0 text-white opacity-85 small'>
                    {showResult
                      ? `Screening completed for ${applicant?.first_name} ${applicant?.last_name}`
                      : 'Automated compliance screening against global watchlists'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className='btn btn-link text-white p-2'
                style={{
                  fontSize: '1.8rem',
                  textDecoration: 'none',
                  opacity: 0.8,
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => (e.target.style.opacity = 1)}
                onMouseLeave={(e) => (e.target.style.opacity = 0.8)}
              >
                ×
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className='flex-grow-1 overflow-auto p-4'>
            {!showResult ? (
              /* Pre-Check View */
              <div>
                <div className='mb-4'>
                  <h6
                    className='fw-bold mb-3 d-flex align-items-center'
                    style={{ color: '#1f2937' }}
                  >
                    <span className='me-2'>👤</span>
                    Applicant Information
                  </h6>

                  <div
                    className='p-4 rounded-3'
                    style={{
                      background:
                        'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div className='row g-3'>
                      <div className='col-md-6'>
                        <div className='d-flex align-items-center mb-2'>
                          <div
                            className='me-3 rounded-circle d-flex align-items-center justify-content-center'
                            style={{
                              width: '35px',
                              height: '35px',
                              background:
                                'linear-gradient(135deg, #3b82f6, #2563eb)',
                              color: 'white',
                              fontSize: '0.8rem',
                            }}
                          >
                            {applicant?.first_name?.charAt(0)}
                            {applicant?.last_name?.charAt(0)}
                          </div>
                          <div>
                            <div
                              className='fw-semibold'
                              style={{ color: '#1f2937' }}
                            >
                              {applicant?.title} {applicant?.first_name}{' '}
                              {applicant?.last_name}
                            </div>
                            <div className='small text-muted'>
                              Primary Applicant
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='col-md-6'>
                        <div className='small text-muted mb-1'>
                          Date of Birth
                        </div>
                        <div className='fw-medium' style={{ color: '#374151' }}>
                          {applicant?.date_of_birth || 'Not provided'}
                        </div>
                      </div>

                      <div className='col-md-6'>
                        <div className='small text-muted mb-1'>Email</div>
                        <div className='fw-medium' style={{ color: '#374151' }}>
                          {applicant?.email || 'Not provided'}
                        </div>
                      </div>

                      <div className='col-md-6'>
                        <div className='small text-muted mb-1'>Phone</div>
                        <div className='fw-medium' style={{ color: '#374151' }}>
                          {applicant?.phone_number || 'Not provided'}
                        </div>
                      </div>

                      <div className='col-12'>
                        <div className='small text-muted mb-1'>Address</div>
                        <div className='fw-medium' style={{ color: '#374151' }}>
                          {[
                            applicant?.address_line_1,
                            applicant?.address_line_2,
                            applicant?.city,
                            applicant?.county,
                            applicant?.country,
                          ]
                            .filter(Boolean)
                            .join(', ') || 'Not provided'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mb-4'>
                  <h6
                    className='fw-bold mb-3 d-flex align-items-center'
                    style={{ color: '#1f2937' }}
                  >
                    <span className='me-2'>🛡️</span>
                    Screening Coverage
                  </h6>

                  <div className='row g-3'>
                    {[
                      {
                        icon: '🌍',
                        title: 'Global Sanctions',
                        desc: 'OFAC, EU, UN, UK sanctions lists',
                      },
                      {
                        icon: '👥',
                        title: 'PEP Database',
                        desc: 'Politically Exposed Persons worldwide',
                      },
                      {
                        icon: '🚨',
                        title: 'Criminal Lists',
                        desc: 'Interpol, FBI watchlists',
                      },
                      {
                        icon: '📰',
                        title: 'Adverse Media',
                        desc: 'Global news source monitoring',
                      },
                    ].map((item, index) => (
                      <div key={index} className='col-md-6'>
                        <div
                          className='p-3 rounded-3 h-100'
                          style={{
                            background:
                              'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                            border: '1px solid #e2e8f0',
                            transition: 'transform 0.2s ease',
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.transform = 'translateY(-2px)')
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.transform = 'translateY(0)')
                          }
                        >
                          <div className='d-flex align-items-start'>
                            <span
                              className='me-3'
                              style={{ fontSize: '1.5rem' }}
                            >
                              {item.icon}
                            </span>
                            <div>
                              <div
                                className='fw-semibold mb-1'
                                style={{ color: '#1f2937' }}
                              >
                                {item.title}
                              </div>
                              <div className='small text-muted'>
                                {item.desc}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className='p-4 rounded-3 mb-4'
                  style={{
                    background:
                      'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                    border: '1px solid #3b82f6',
                  }}
                >
                  <div className='d-flex align-items-start'>
                    <div
                      className='me-3 p-2 rounded-circle flex-shrink-0'
                      style={{
                        background: '#3b82f6',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: '1.1rem', color: 'white' }}>
                        ℹ️
                      </span>
                    </div>
                    <div>
                      <div
                        className='fw-semibold mb-2'
                        style={{ color: '#1e3a8a' }}
                      >
                        About This Screening
                      </div>
                      <p
                        className='mb-0 small'
                        style={{ color: '#1e40af', lineHeight: '1.5' }}
                      >
                        This automated check will search for{' '}
                        <strong>
                          {applicant?.first_name} {applicant?.last_name}
                        </strong>{' '}
                        across multiple international databases including
                        sanctions lists, politically exposed persons (PEP)
                        databases, and criminal watchlists. The process
                        typically takes 10-30 seconds and generates a compliance
                        report.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Results View */
              <div>
                {checkResult?.success ? (
                  <div>
                    {/* Risk Level Card */}
                    <div
                      className='p-4 rounded-3 mb-4'
                      style={{
                        background: isHighRisk
                          ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                          : 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                        border: `2px solid ${
                          isHighRisk ? '#f59e0b' : '#10b981'
                        }`,
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'absolute',
                          top: '-50%',
                          right: '-50%',
                          width: '100%',
                          height: '100%',
                          background: `radial-gradient(circle, ${
                            isHighRisk
                              ? 'rgba(245,158,11,0.1)'
                              : 'rgba(16,185,129,0.1)'
                          } 0%, transparent 70%)`,
                        }}
                      />

                      <div className='position-relative'>
                        <div className='d-flex align-items-center mb-3'>
                          <div
                            className='me-3 rounded-circle d-flex align-items-center justify-content-center'
                            style={{
                              width: '50px',
                              height: '50px',
                              background: isHighRisk ? '#f59e0b' : '#10b981',
                              color: 'white',
                              fontSize: '1.5rem',
                            }}
                          >
                            {isHighRisk ? '⚠️' : '✅'}
                          </div>
                          <div>
                            <h5
                              className='mb-1 fw-bold'
                              style={{
                                color: isHighRisk ? '#92400e' : '#065f46',
                              }}
                            >
                              {isHighRisk
                                ? 'HIGH RISK - Manual Review Required'
                                : 'CLEAR - No Matches Found'}
                            </h5>
                            <p
                              className='mb-0'
                              style={{
                                color: isHighRisk ? '#d97706' : '#059669',
                              }}
                            >
                              {checkResult.total_hits} match(es) found in
                              screening databases
                            </p>
                          </div>
                        </div>

                        <div className='row g-3'>
                          <div className='col-md-4'>
                            <div className='text-center'>
                              <div
                                className='fw-bold mb-1'
                                style={{
                                  fontSize: '1.5rem',
                                  color: isHighRisk ? '#92400e' : '#065f46',
                                }}
                              >
                                {checkResult.total_hits}
                              </div>
                              <div
                                className='small'
                                style={{
                                  color: isHighRisk ? '#d97706' : '#059669',
                                }}
                              >
                                Total Matches
                              </div>
                            </div>
                          </div>
                          <div className='col-md-4'>
                            <div className='text-center'>
                              <div
                                className='fw-bold mb-1'
                                style={{
                                  fontSize: '1.5rem',
                                  color: isHighRisk ? '#92400e' : '#065f46',
                                }}
                              >
                                {checkResult.risk_level}
                              </div>
                              <div
                                className='small'
                                style={{
                                  color: isHighRisk ? '#d97706' : '#059669',
                                }}
                              >
                                Risk Level
                              </div>
                            </div>
                          </div>
                          <div className='col-md-4'>
                            <div className='text-center'>
                              <div
                                className='fw-bold mb-1'
                                style={{
                                  fontSize: '1.5rem',
                                  color: isHighRisk ? '#92400e' : '#065f46',
                                }}
                              >
                                {checkResult.requires_review
                                  ? 'CRITICAL'
                                  : 'YES'}
                              </div>
                              <div
                                className='small'
                                style={{
                                  color: isHighRisk ? '#d97706' : '#059669',
                                }}
                              >
                                Review Required
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Next Steps */}
                    <div className='mb-4'>
                      <h6
                        className='fw-bold mb-3 d-flex align-items-center'
                        style={{ color: '#1f2937' }}
                      >
                        <span className='me-2'>📋</span>
                        Next Steps
                      </h6>

                      <div
                        className='p-4 rounded-3'
                        style={{
                          background:
                            'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        {isHighRisk ? (
                          <div>
                            <div className='d-flex align-items-center mb-3'>
                              <span
                                className='me-2'
                                style={{ fontSize: '1.2rem' }}
                              >
                                🔍
                              </span>
                              <span
                                className='fw-semibold'
                                style={{ color: '#d97706' }}
                              >
                                Manual Review Process Required
                              </span>
                            </div>
                            <ul
                              className='mb-0 ps-4'
                              style={{ color: '#374151' }}
                            >
                              <li className='mb-2'>
                                Review the detailed PEP check report in Internal
                                Files
                              </li>
                              <li className='mb-2'>
                                Conduct enhanced due diligence on flagged
                                matches
                              </li>
                              <li className='mb-2'>
                                Document review findings and risk assessment
                              </li>
                              <li className='mb-0'>
                                Obtain compliance approval before proceeding
                              </li>
                            </ul>
                          </div>
                        ) : (
                          <div>
                            <div className='d-flex align-items-center mb-3'>
                              <span
                                className='me-2'
                                style={{ fontSize: '1.2rem' }}
                              >
                                ✅
                              </span>
                              <span
                                className='fw-semibold'
                                style={{ color: '#059669' }}
                              >
                                Cleared for Processing
                              </span>
                            </div>
                            <p className='mb-0' style={{ color: '#374151' }}>
                              No matches found in sanctions, PEP, or criminal
                              watchlists. The application can proceed to the
                              next stage. A compliance report has been generated
                              and saved to Internal Files.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Report Info */}
                    <div
                      className='p-3 rounded-3'
                      style={{
                        background:
                          'linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)',
                        border: '1px solid #0284c7',
                      }}
                    >
                      <div className='d-flex align-items-center'>
                        <span className='me-3' style={{ fontSize: '1.2rem' }}>
                          📄
                        </span>
                        <div>
                          <div
                            className='fw-semibold mb-1'
                            style={{ color: '#0c4a6e' }}
                          >
                            Compliance Report Generated
                          </div>
                          <div className='small' style={{ color: '#0369a1' }}>
                            File ID: {checkResult.file_id} • Generated:{' '}
                            {checkResult.check_timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Error View */
                  <div>
                    {/* Check if it's a quota/payment error */}
                    {checkResult?.error &&
                    (checkResult.error.toLowerCase().includes('quota') ||
                      checkResult.error.toLowerCase().includes('payment') ||
                      checkResult.error
                        .toLowerCase()
                        .includes('subscription') ||
                      checkResult.error.toLowerCase().includes('upgrade')) ? (
                      /* Payment/Quota Required View */
                      <div
                        className='p-4 rounded-3'
                        style={{
                          background:
                            'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                          border: '2px solid #f59e0b',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            position: 'absolute',
                            top: '-50%',
                            right: '-50%',
                            width: '100%',
                            height: '100%',
                            background:
                              'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)',
                          }}
                        />

                        <div className='position-relative text-center'>
                          <div className='mb-3' style={{ fontSize: '3rem' }}>
                            💳
                          </div>
                          <h5
                            className='fw-bold mb-3'
                            style={{ color: '#92400e' }}
                          >
                            Dilisense Quota Exceeded
                          </h5>
                          <p
                            className='mb-4'
                            style={{ color: '#d97706', lineHeight: '1.6' }}
                          >
                            {checkResult.error}
                          </p>

                          <div
                            className='p-3 rounded-3 mb-4'
                            style={{
                              background: 'rgba(255, 255, 255, 0.8)',
                              border: '1px solid #f59e0b',
                            }}
                          >
                            <div className='row g-3'>
                              <div className='col-md-4'>
                                <div
                                  className='fw-bold'
                                  style={{ color: '#92400e' }}
                                >
                                  Free Tier
                                </div>
                                <div
                                  className='small'
                                  style={{ color: '#d97706' }}
                                >
                                  100 checks/month
                                </div>
                              </div>
                              <div className='col-md-4'>
                                <div
                                  className='fw-bold'
                                  style={{ color: '#92400e' }}
                                >
                                  Current Status
                                </div>
                                <div
                                  className='small'
                                  style={{ color: '#d97706' }}
                                >
                                  Quota Exceeded
                                </div>
                              </div>
                              <div className='col-md-4'>
                                <div
                                  className='fw-bold'
                                  style={{ color: '#92400e' }}
                                >
                                  Action Required
                                </div>
                                <div
                                  className='small'
                                  style={{ color: '#d97706' }}
                                >
                                  Upgrade Plan
                                </div>
                              </div>
                            </div>
                          </div>

                          <div
                            className='p-3 rounded-3'
                            style={{
                              background: 'rgba(59, 130, 246, 0.1)',
                              border: '1px solid #3b82f6',
                            }}
                          >
                            <h6
                              className='fw-bold mb-2'
                              style={{ color: '#1e40af' }}
                            >
                              💡 Next Steps
                            </h6>
                            <ul
                              className='text-start mb-0 ps-4'
                              style={{ color: '#2563eb', fontSize: '0.9rem' }}
                            >
                              <li className='mb-1'>
                                Visit dilisense.com to upgrade your plan
                              </li>
                              <li className='mb-1'>
                                Choose a plan that fits your screening volume
                              </li>
                              <li className='mb-1'>
                                Update your payment method if needed
                              </li>
                              <li className='mb-0'>
                                Retry the PEP check after upgrading
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* General Error View */
                      <div
                        className='p-4 rounded-3 text-center'
                        style={{
                          background:
                            'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                          border: '1px solid #ef4444',
                        }}
                      >
                        <div className='mb-3' style={{ fontSize: '3rem' }}>
                          ❌
                        </div>
                        <h6
                          className='fw-bold mb-2'
                          style={{ color: '#991b1b' }}
                        >
                          PEP Check Failed
                        </h6>
                        <p className='mb-0' style={{ color: '#dc2626' }}>
                          {checkResult?.error ||
                            'An unexpected error occurred during the screening process.'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dynamic Footer */}
          <div
            className='p-4 flex-shrink-0'
            style={{
              background: 'rgba(248, 250, 252, 0.95)',
              borderTop: '1px solid #e5e7eb',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className='d-flex gap-3 justify-content-end'>
              {!showResult ? (
                <>
                  <button
                    onClick={handleClose}
                    className='btn btn-outline-secondary px-4 py-2'
                    style={{ fontSize: '0.9rem' }}
                    disabled={isRunning}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRunCheck}
                    disabled={isRunning}
                    className='btn px-4 py-2 text-white position-relative'
                    style={{
                      background: isRunning
                        ? '#9ca3af'
                        : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      border: 'none',
                      cursor: isRunning ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem',
                      overflow: 'hidden',
                    }}
                  >
                    {isRunning && (
                      <div
                        className='position-absolute top-0 start-0 w-100 h-100'
                        style={{
                          background:
                            'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                          animation: 'shimmer 1.5s infinite',
                        }}
                      />
                    )}
                    <span className='position-relative'>
                      {isRunning ? (
                        <>
                          <span className='spinner-border spinner-border-sm me-2' />
                          Running Screening...
                        </>
                      ) : (
                        '🔍 Run PEP Check'
                      )}
                    </span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleFinish}
                  className='btn px-4 py-2 text-white'
                  style={{
                    background:
                      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: 'none',
                    fontSize: '0.9rem',
                  }}
                >
                  ✅ Complete
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.8; }
          }
        `}
      </style>
    </div>
  );
};

export default PEPCheckModal;
