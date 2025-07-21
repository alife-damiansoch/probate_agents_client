import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import { postData } from '../../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';
import ConfirmationModal from './ConfirmationModal';

const CommitteeApproveReject = ({ advancement, refresh, setRefresh }) => {
  const [showRejectionMessageWindow, setShowRejectionMessageWindow] =
    useState(false);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(false);
  const [action, setAction] = useState('');
  const [errors, setErrors] = useState(null);
  const [posting, setPosting] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Decision history states
  const [userDecision, setUserDecision] = useState(null);
  const [showChangeDecision, setShowChangeDecision] = useState(false);

  // Modal states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState({
    approved: false,
    rejection_reason: null,
    action: '',
  });

  // Get current user from Redux
  const user = useSelector((state) => state.user.user);
  const currentUserEmail = user?.email;

  const navigate = useNavigate();

  useEffect(() => {
    if (advancement?.id && currentUserEmail) {
      checkUserDecision();
    }
  }, [advancement?.id, currentUserEmail]);

  const parseCommitteeStatus = (statusString) => {
    if (!statusString || typeof statusString !== 'string') {
      return null;
    }

    try {
      // Create a temporary div to parse HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = statusString;

      // Get the text content and split by sections
      const textContent = tempDiv.textContent || tempDiv.innerText || '';

      // Parse approved members
      const approvedMatch = textContent.match(
        /Approved by:\s*(.*?)(?=Reason:|No response from:|$)/s
      );
      const approvedEmails = approvedMatch
        ? approvedMatch[1]
            .split(',')
            .map((email) => email.trim())
            .filter((email) => email)
        : [];

      // Parse rejected members and reasons
      const rejectedMatch = textContent.match(
        /Rejected by:\s*(.*?)(?=Reason:|No response from:|$)/s
      );
      const rejectedEmails = rejectedMatch
        ? rejectedMatch[1]
            .split(',')
            .map((email) => email.trim())
            .filter((email) => email)
        : [];

      // Parse rejection reason
      const reasonMatch = textContent.match(
        /Reason:\s*(.*?)(?=No response from:|$)/s
      );
      const rejectionReason = reasonMatch ? reasonMatch[1].trim() : null;

      // Parse no response members
      const noResponseMatch = textContent.match(/No response from:\s*(.*?)$/s);
      const noResponseEmails = noResponseMatch
        ? noResponseMatch[1]
            .split(',')
            .map((email) => email.trim())
            .filter((email) => email)
        : [];

      return {
        approved: approvedEmails,
        rejected: rejectedEmails,
        rejectionReason: rejectionReason,
        noResponse: noResponseEmails,
        rawContent: textContent,
      };
    } catch (error) {
      console.error('Error parsing committee status:', error);
      return null;
    }
  };

  const checkUserDecision = () => {
    try {
      setLoading(true);

      let existingDecision = null;

      // Parse the committee_approvements_status string
      if (advancement.committee_approvements_status) {
        const parsedStatus = parseCommitteeStatus(
          advancement.committee_approvements_status
        );

        if (parsedStatus) {
          // Check if current user is in approved list
          if (parsedStatus.approved.includes(currentUserEmail)) {
            existingDecision = {
              approved: true,
              rejection_reason: null,
              action_type: 'approval',
              created_at: new Date().toISOString(), // We don't have exact timestamp from the string
              user_email: currentUserEmail,
            };
          }
          // Check if current user is in rejected list
          else if (parsedStatus.rejected.includes(currentUserEmail)) {
            existingDecision = {
              approved: false,
              rejection_reason: parsedStatus.rejectionReason,
              action_type: 'full_rejection', // We can't determine the exact action type from the string
              created_at: new Date().toISOString(), // We don't have exact timestamp from the string
              user_email: currentUserEmail,
            };
          }
          // User is in no response list or not mentioned at all
          else {
            existingDecision = null;
          }
        }
      }

      setUserDecision(existingDecision);

      // Pre-populate form if user wants to change their decision
      if (existingDecision && !existingDecision.approved) {
        setComment(existingDecision.rejection_reason || '');
        setAction('full_rejection'); // Default since we can't parse the exact action type
      }
    } catch (err) {
      console.error('Error checking user decision:', err);
      setUserDecision(null);
    } finally {
      setLoading(false);
    }
  };

  const renderCommitteeStatusOverview = () => {
    if (!advancement.committee_approvements_status) return null;

    const parsedStatus = parseCommitteeStatus(
      advancement.committee_approvements_status
    );
    if (!parsedStatus) return null;

    return (
      <div
        className='p-4 rounded-4 mb-4'
        style={{
          background:
            'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(67, 56, 202, 0.12) 100%)',
          border: '2px solid rgba(99, 102, 241, 0.2)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(99, 102, 241, 0.15)',
        }}
      >
        <div className='d-flex align-items-start gap-3'>
          <div
            className='d-flex align-items-center justify-content-center flex-shrink-0 rounded-4'
            style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
              color: '#ffffff',
            }}
          >
            <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z' />
            </svg>
          </div>

          <div className='flex-grow-1'>
            <h6 className='fw-bold mb-3' style={{ color: '#1e293b' }}>
              Committee Status Overview
            </h6>

            <div className='row g-3'>
              {/* Approved Members */}
              {parsedStatus.approved.length > 0 && (
                <div className='col-md-4'>
                  <div
                    className='p-3 rounded-3'
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.15) 100%)',
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}
                  >
                    <div className='d-flex align-items-center gap-2 mb-2'>
                      <svg
                        width='16'
                        height='16'
                        fill='#10b981'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span
                        className='fw-semibold'
                        style={{ color: '#065f46', fontSize: '0.9rem' }}
                      >
                        Approved ({parsedStatus.approved.length})
                      </span>
                    </div>
                    {parsedStatus.approved.map((email, index) => (
                      <div key={index} className='mb-1'>
                        <span
                          style={{
                            color: '#065f46',
                            fontSize: '0.8rem',
                            fontWeight:
                              email === currentUserEmail ? '600' : '400',
                            background:
                              email === currentUserEmail
                                ? 'rgba(16, 185, 129, 0.2)'
                                : 'transparent',
                            padding:
                              email === currentUserEmail ? '2px 6px' : '0',
                            borderRadius:
                              email === currentUserEmail ? '4px' : '0',
                          }}
                        >
                          {email === currentUserEmail
                            ? `${email} (You)`
                            : email}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejected Members */}
              {parsedStatus.rejected.length > 0 && (
                <div className='col-md-4'>
                  <div
                    className='p-3 rounded-3'
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.15) 100%)',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                    }}
                  >
                    <div className='d-flex align-items-center gap-2 mb-2'>
                      <svg
                        width='16'
                        height='16'
                        fill='#ef4444'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span
                        className='fw-semibold'
                        style={{ color: '#7f1d1d', fontSize: '0.9rem' }}
                      >
                        Rejected ({parsedStatus.rejected.length})
                      </span>
                    </div>
                    {parsedStatus.rejected.map((email, index) => (
                      <div key={index} className='mb-1'>
                        <span
                          style={{
                            color: '#7f1d1d',
                            fontSize: '0.8rem',
                            fontWeight:
                              email === currentUserEmail ? '600' : '400',
                            background:
                              email === currentUserEmail
                                ? 'rgba(239, 68, 68, 0.2)'
                                : 'transparent',
                            padding:
                              email === currentUserEmail ? '2px 6px' : '0',
                            borderRadius:
                              email === currentUserEmail ? '4px' : '0',
                          }}
                        >
                          {email === currentUserEmail
                            ? `${email} (You)`
                            : email}
                        </span>
                      </div>
                    ))}
                    {parsedStatus.rejectionReason && (
                      <div
                        className='mt-2 pt-2'
                        style={{
                          borderTop: '1px solid rgba(239, 68, 68, 0.2)',
                        }}
                      >
                        <span
                          className='fw-semibold'
                          style={{ color: '#7f1d1d', fontSize: '0.8rem' }}
                        >
                          Reason:
                        </span>
                        <span
                          style={{
                            color: '#7f1d1d',
                            fontSize: '0.8rem',
                            fontStyle: 'italic',
                          }}
                        >
                          {parsedStatus.rejectionReason}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* No Response Members */}
              {parsedStatus.noResponse.length > 0 && (
                <div className='col-md-4'>
                  <div
                    className='p-3 rounded-3'
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(107, 114, 128, 0.1) 0%, rgba(75, 85, 99, 0.15) 100%)',
                      border: '1px solid rgba(107, 114, 128, 0.2)',
                    }}
                  >
                    <div className='d-flex align-items-center gap-2 mb-2'>
                      <svg
                        width='16'
                        height='16'
                        fill='#6b7280'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span
                        className='fw-semibold'
                        style={{ color: '#374151', fontSize: '0.9rem' }}
                      >
                        Pending ({parsedStatus.noResponse.length})
                      </span>
                    </div>
                    {parsedStatus.noResponse.map((email, index) => (
                      <div key={index} className='mb-1'>
                        <span
                          style={{
                            color: '#374151',
                            fontSize: '0.8rem',
                            fontWeight:
                              email === currentUserEmail ? '600' : '400',
                            background:
                              email === currentUserEmail
                                ? 'rgba(107, 114, 128, 0.2)'
                                : 'transparent',
                            padding:
                              email === currentUserEmail ? '2px 6px' : '0',
                            borderRadius:
                              email === currentUserEmail ? '4px' : '0',
                          }}
                        >
                          {email === currentUserEmail
                            ? `${email} (You)`
                            : email}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderDecisionHistory = () => {
    if (!userDecision) return null;

    const getDecisionIcon = () => {
      if (userDecision.approved) {
        return (
          <svg width='24' height='24' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
              clipRule='evenodd'
            />
          </svg>
        );
      } else {
        return (
          <svg width='24' height='24' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        );
      }
    };

    const getDecisionStyles = () => {
      if (userDecision.approved) {
        return {
          bgGradient:
            'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.12) 100%)',
          border: '2px solid rgba(16, 185, 129, 0.2)',
          iconBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          iconColor: '#ffffff',
          textColor: '#065f46',
          badgeColor: '#10b981',
        };
      } else {
        return {
          bgGradient:
            'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.12) 100%)',
          border: '2px solid rgba(239, 68, 68, 0.2)',
          iconBg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          iconColor: '#ffffff',
          textColor: '#7f1d1d',
          badgeColor: '#ef4444',
        };
      }
    };

    const styles = getDecisionStyles();
    const decisionText = userDecision.approved
      ? 'Approved'
      : userDecision.action_type === 'refer_back'
      ? 'Referred Back'
      : 'Rejected';

    return (
      <div
        className='p-4 rounded-4 mb-4'
        style={{
          background: styles.bgGradient,
          border: styles.border,
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className='d-flex align-items-start gap-4'>
          <div
            className='d-flex align-items-center justify-content-center flex-shrink-0 rounded-4'
            style={{
              width: '60px',
              height: '60px',
              background: styles.iconBg,
              color: styles.iconColor,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            }}
          >
            {getDecisionIcon()}
          </div>

          <div className='flex-grow-1'>
            <div className='d-flex align-items-center gap-3 mb-3'>
              <h5 className='fw-bold mb-0' style={{ color: '#1e293b' }}>
                Your Previous Decision
              </h5>
              <span
                className='badge px-3 py-2 rounded-pill fw-semibold'
                style={{
                  background: styles.badgeColor,
                  color: '#ffffff',
                  fontSize: '0.8rem',
                }}
              >
                {decisionText}
              </span>
            </div>

            <div className='mb-3'>
              <div className='row'>
                <div className='col-md-6'>
                  <p
                    className='mb-2'
                    style={{ color: styles.textColor, lineHeight: '1.6' }}
                  >
                    <strong>Decision Date:</strong>{' '}
                    {new Date(userDecision.created_at).toLocaleString()}
                  </p>
                </div>
                <div className='col-md-6'>
                  <p
                    className='mb-2'
                    style={{ color: styles.textColor, lineHeight: '1.6' }}
                  >
                    <strong>Decided by:</strong> {currentUserEmail}
                  </p>
                </div>
              </div>

              {userDecision.rejection_reason && (
                <div>
                  <p
                    className='mb-2 fw-semibold'
                    style={{ color: styles.textColor }}
                  >
                    Reason Provided:
                  </p>
                  <div
                    className='p-3 rounded-3'
                    style={{
                      background: 'rgba(255, 255, 255, 0.5)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      fontStyle: 'italic',
                      color: styles.textColor,
                    }}
                  >
                    "{userDecision.rejection_reason}"
                  </div>
                </div>
              )}
            </div>

            <div className='d-flex gap-3 align-items-center'>
              <div
                className='d-flex align-items-center gap-2'
                style={{ color: '#6b7280' }}
              >
                <svg
                  width='16'
                  height='16'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 011-1h.01a1 1 0 110 2H12a1 1 0 01-1-1zm1 4a1 1 0 10-2 0v4a1 1 0 102 0v-4z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='fw-medium' style={{ fontSize: '0.9rem' }}>
                  You can change your decision until all committee members
                  respond
                </span>
              </div>

              <button
                className='btn btn-sm d-flex align-items-center gap-2 ms-auto'
                style={{
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: '500',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                  transition: 'all 0.3s ease',
                }}
                onClick={() => setShowChangeDecision(true)}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow =
                    '0 6px 16px rgba(59, 130, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow =
                    '0 4px 12px rgba(59, 130, 246, 0.3)';
                }}
              >
                <svg
                  width='14'
                  height='14'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                </svg>
                Change Decision
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Rest of the component methods remain the same...
  const renderMessage = () => {
    if (action === 'full_rejection') {
      return (
        <div
          className='position-relative p-4 rounded-4 mt-4'
          style={{
            background:
              'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.12) 100%)',
            border: '2px solid rgba(239, 68, 68, 0.2)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15)',
          }}
        >
          <div className='d-flex align-items-start gap-3'>
            <div
              className='d-flex align-items-center justify-content-center flex-shrink-0 rounded-3'
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#ffffff',
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
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='flex-grow-1'>
              <h6 className='fw-bold mb-2' style={{ color: '#dc2626' }}>
                Action Selected: Full Rejection
              </h6>
              <p
                className='mb-2'
                style={{ color: '#7f1d1d', lineHeight: '1.6' }}
              >
                This action will {userDecision ? 'update' : 'record'} your
                response. Until all committee members have submitted their
                responses, you may revise your decision.
              </p>
              <p
                className='mb-0'
                style={{ color: '#7f1d1d', lineHeight: '1.6' }}
              >
                Once all committee members have submitted their responses, the
                advancement will be either automatically fully rejected or
                approved, in accordance with the requirements for advancement
                approval.
              </p>
            </div>
          </div>
        </div>
      );
    }
    if (action === 'refer_back') {
      return (
        <div
          className='position-relative p-4 rounded-4 mt-4'
          style={{
            background:
              'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.15) 100%)',
            border: '2px solid rgba(239, 68, 68, 0.3)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(239, 68, 68, 0.2)',
          }}
        >
          <div className='d-flex align-items-start gap-3'>
            <div
              className='d-flex align-items-center justify-content-center flex-shrink-0 rounded-3'
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#ffffff',
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
                  d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='flex-grow-1'>
              <h6 className='fw-bold mb-3' style={{ color: '#dc2626' }}>
                Action Selected: Refer Back to Agent Assigned
              </h6>
              <div
                className='p-3 rounded-3 mb-3'
                style={{
                  background:
                    'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(185, 28, 28, 0.15) 100%)',
                  border: '1px solid rgba(220, 38, 38, 0.2)',
                }}
              >
                <div className='d-flex align-items-center gap-2 mb-2'>
                  <svg
                    width='16'
                    height='16'
                    fill='#dc2626'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span
                    className='fw-bold'
                    style={{ color: '#dc2626', fontSize: '0.9rem' }}
                  >
                    WARNING!
                  </span>
                </div>
                <p
                  className='mb-0'
                  style={{ color: '#7f1d1d', fontSize: '0.9rem' }}
                >
                  This action will immediately reset the advancement process.
                </p>
              </div>
              <div
                className='mb-2'
                style={{ color: '#7f1d1d', lineHeight: '1.6' }}
              >
                <p className='mb-2'>
                  It will delete all committee member approvals or rejections,
                  if any previously submitted.
                </p>
                <p className='mb-2'>
                  It will also remove the advancement data and revert the
                  application back to the assigned agent.
                </p>
                <p className='mb-2'>
                  The application will return to its pre-approval state, as if
                  it was never approved.
                </p>
                <p className='mb-0 fw-semibold'>
                  <strong>Note:</strong> This action is irreversible and will be
                  executed immediately, regardless of whether any committee
                  members have already submitted their responses.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getConfirmationContent = (approved, actionType, rejectionReason) => {
    const isChanging = userDecision ? 'change' : 'make';

    if (approved) {
      return {
        title: userDecision
          ? 'Change Decision to Approval'
          : 'Confirm Approval',
        message: `Are you sure you want to ${isChanging} your decision to approve advancement ID: ${advancement.id}?`,
        confirmText: userDecision ? 'Change to Approve' : 'Yes, Approve',
        type: 'success',
        icon: (
          <svg width='24' height='24' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
              clipRule='evenodd'
            />
          </svg>
        ),
      };
    } else if (actionType === 'full_rejection') {
      return {
        title: userDecision
          ? 'Change Decision to Rejection'
          : 'Confirm Rejection',
        message: `Are you sure you want to ${isChanging} your decision to reject advancement ID: ${advancement.id}?`,
        confirmText: userDecision ? 'Change to Reject' : 'Yes, Reject',
        type: 'danger',
        icon: (
          <svg width='24' height='24' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        ),
      };
    } else {
      return {
        title: userDecision
          ? 'Change Decision to Referral'
          : 'Confirm Referral',
        message: `Are you sure you want to ${isChanging} your decision to refer advancement ID: ${advancement.id} back to the assigned agent? This action will reset the entire approval process.`,
        confirmText: userDecision ? 'Change to Refer Back' : 'Yes, Refer Back',
        type: 'warning',
        icon: (
          <svg width='24' height='24' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
              clipRule='evenodd'
            />
          </svg>
        ),
      };
    }
  };

  const handleConfirmAction = async () => {
    const { approved, rejection_reason } = confirmationData;

    setErrors(null);
    setPosting(true);
    setIsAnimating(true);

    const formData = {
      approved,
      rejection_reason,
    };

    try {
      const token =
        localStorage.getItem('token') || sessionStorage.getItem('token');
      let endpoint = `/api/loans/loans/${advancement.id}/approve_loan/`;
      if (action === 'refer_back') {
        endpoint = `/api/loans/loans/${advancement.id}/refer_back_to_agent/`;
      }

      const response = await postData(token, endpoint, formData);

      if (response.status === 200) {
        setCommentError(false);
        setShowRejectionMessageWindow(false);
        setShowChangeDecision(false);
        setShowConfirmModal(false);
        setComment('');
        setPosting(false);
        setIsAnimating(false);

        // Refresh the user decision to show the updated state
        // You might want to refresh the entire advancement data here
        setRefresh(!refresh);

        if (action === 'refer_back') {
          navigate(`/applications/${advancement.application}`);
        }
      } else {
        setErrors(response.data);
        setPosting(false);
        setIsAnimating(false);
        setShowConfirmModal(false);
      }
    } catch (err) {
      setPosting(false);
      setIsAnimating(false);
      setShowConfirmModal(false);
      console.error('Error updating advancement:', err);
      setErrors(err.response.data || { error: 'An error occurred' });
    }
  };

  const postAproveReject = async (approved, rejection_reason = null) => {
    if (!approved && !rejection_reason) {
      setCommentError(true);
      return;
    }

    // Set up confirmation data and show modal
    setConfirmationData({
      approved,
      rejection_reason,
      action,
    });
    setShowConfirmModal(true);
  };

  const handleAcceptReject = (actionType) => {
    if (actionType === 'approve') {
      postAproveReject(true);
    } else {
      setShowRejectionMessageWindow(true);
    }
  };

  const handleCloseRejectionForm = () => {
    setComment('');
    setCommentError(false);
    setAction('');
    setShowRejectionMessageWindow(false);
    setShowChangeDecision(false);
  };

  // Check if user is authenticated
  if (!currentUserEmail) {
    return (
      <div className='text-center p-4'>
        <div className='alert alert-warning'>
          <strong>Authentication Required:</strong> Please log in to access
          committee decisions.
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingComponent />;
  }

  if (!advancement) {
    return <LoadingComponent />;
  }

  const confirmationContent = getConfirmationContent(
    confirmationData.approved,
    confirmationData.action,
    confirmationData.rejection_reason
  );

  const showMainForm = !userDecision || showChangeDecision;

  return (
    <>
      <div
        className='position-relative'
        style={{
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(20px)',
          boxShadow:
            '0 25px 80px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          padding: '2rem',
          minHeight: '400px',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Committee Status Overview - Show for all users */}
        {renderCommitteeStatusOverview()}

        {/* Show decision history if user has made a decision and not changing it */}
        {userDecision && !showChangeDecision && renderDecisionHistory()}

        {/* Show main form if no decision or user wants to change decision */}
        {showMainForm && (
          <>
            {/* Header Section */}
            <div className='text-center mb-4'>
              <div
                className='d-inline-flex align-items-center justify-content-center rounded-4 mb-3'
                style={{
                  width: '80px',
                  height: '80px',
                  background:
                    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                }}
              >
                <svg width='36' height='36' fill='white' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <h4 className='fw-bold mb-2' style={{ color: '#1e293b' }}>
                {userDecision
                  ? 'Change Your Decision'
                  : 'Committee Review Required'}
              </h4>
              <p className='text-muted mb-0' style={{ fontSize: '1.1rem' }}>
                {userDecision
                  ? 'Update your decision on the advancement'
                  : 'Please review and make your decision on the advancement'}
              </p>
            </div>

            {/* Cancel Change Decision Button */}
            {showChangeDecision && (
              <div className='text-center mb-4'>
                <button
                  className='btn btn-sm d-flex align-items-center gap-2 mx-auto'
                  style={{
                    background:
                      'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '500',
                    boxShadow: '0 4px 12px rgba(107, 114, 128, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => setShowChangeDecision(false)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow =
                      '0 6px 16px rgba(107, 114, 128, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow =
                      '0 4px 12px rgba(107, 114, 128, 0.3)';
                  }}
                >
                  <svg
                    width='14'
                    height='14'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Cancel Change
                </button>
              </div>
            )}

            {/* Main Action Buttons */}
            {!showRejectionMessageWindow && (
              <div className='d-flex gap-4 justify-content-center mb-4'>
                <button
                  className='btn d-flex align-items-center gap-3 px-5 py-3'
                  style={{
                    background:
                      'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '16px',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    minWidth: '160px',
                    opacity: posting ? 0.7 : 1,
                    transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
                  }}
                  onClick={() => handleAcceptReject('reject')}
                  disabled={posting}
                  onMouseEnter={(e) => {
                    if (!posting) {
                      e.target.style.transform = 'translateY(-3px) scale(1.02)';
                      e.target.style.boxShadow =
                        '0 12px 35px rgba(239, 68, 68, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!posting) {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow =
                        '0 8px 25px rgba(239, 68, 68, 0.3)';
                    }
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
                  {posting
                    ? 'Processing...'
                    : userDecision
                    ? 'Change to Reject'
                    : 'Reject'}
                </button>

                <button
                  className='btn d-flex align-items-center gap-3 px-5 py-3'
                  style={{
                    background:
                      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '16px',
                    fontWeight: '600',
                    fontSize: '1.1rem',
                    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    minWidth: '160px',
                    opacity: posting ? 0.7 : 1,
                    transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
                  }}
                  onClick={() => handleAcceptReject('approve')}
                  disabled={posting}
                  onMouseEnter={(e) => {
                    if (!posting) {
                      e.target.style.transform = 'translateY(-3px) scale(1.02)';
                      e.target.style.boxShadow =
                        '0 12px 35px rgba(16, 185, 129, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!posting) {
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow =
                        '0 8px 25px rgba(16, 185, 129, 0.3)';
                    }
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
                  {posting
                    ? 'Processing...'
                    : userDecision
                    ? 'Change to Approve'
                    : 'Approve'}
                </button>
              </div>
            )}

            {/* Rejection Form */}
            {showRejectionMessageWindow && (
              <div
                style={{
                  animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <div
                  className='p-4 rounded-4 mb-4'
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
                    border: '2px solid rgba(226, 232, 240, 0.8)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {/* Action Selection */}
                  <div className='mb-4'>
                    <label
                      htmlFor='action'
                      className='form-label fw-semibold mb-3'
                      style={{ color: '#374151' }}
                    >
                      {userDecision ? 'Change Action To' : 'Select Action'}
                    </label>
                    <select
                      id='action'
                      className='form-select'
                      value={action}
                      onChange={(e) => setAction(e.target.value)}
                      style={{
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        padding: '12px 16px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(8px)',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#667eea';
                        e.target.style.boxShadow =
                          '0 0 0 4px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value=''>Select an action</option>
                      <option value='full_rejection'>Full Rejection</option>
                      <option value='refer_back'>
                        Refer Back to the Agent Assigned
                      </option>
                    </select>
                  </div>

                  {/* Rejection Reason */}
                  <div className='mb-4'>
                    <label
                      htmlFor='comment'
                      className='form-label fw-semibold mb-3'
                      style={{ color: '#374151' }}
                    >
                      {userDecision
                        ? 'Update Rejection Reason'
                        : 'Rejection Reason'}
                    </label>
                    <textarea
                      id='comment'
                      className={`form-control ${
                        commentError ? 'is-invalid' : ''
                      }`}
                      rows='5'
                      value={comment}
                      onChange={(e) => {
                        setComment(e.target.value);
                        if (e.target.value) setCommentError(false);
                      }}
                      placeholder={
                        userDecision
                          ? 'Update your rejection reason...'
                          : 'Enter detailed rejection reason...'
                      }
                      style={{
                        borderRadius: '12px',
                        border: commentError
                          ? '2px solid #ef4444'
                          : '2px solid #e5e7eb',
                        padding: '16px',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                        background: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(8px)',
                        resize: 'vertical',
                        minHeight: '120px',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = commentError
                          ? '#ef4444'
                          : '#667eea';
                        e.target.style.boxShadow = commentError
                          ? '0 0 0 4px rgba(239, 68, 68, 0.1)'
                          : '0 0 0 4px rgba(102, 126, 234, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = commentError
                          ? '#ef4444'
                          : '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {commentError && (
                      <div className='invalid-feedback d-flex align-items-center gap-2 mt-2'>
                        <svg
                          width='16'
                          height='16'
                          fill='#ef4444'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                            clipRule='evenodd'
                          />
                        </svg>
                        Rejection reason is required.
                      </div>
                    )}
                  </div>

                  {/* Action Message */}
                  {renderMessage()}

                  {/* Form Actions */}
                  <div className='d-flex gap-3 justify-content-end mt-4'>
                    <button
                      type='button'
                      className='btn d-flex align-items-center gap-2 px-4 py-2'
                      style={{
                        background:
                          'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '500',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease',
                      }}
                      onClick={handleCloseRejectionForm}
                      disabled={posting}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow =
                          '0 6px 20px rgba(107, 114, 128, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
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
                          d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
                      Cancel
                    </button>

                    <button
                      type='button'
                      className='btn d-flex align-items-center gap-2 px-4 py-2'
                      style={{
                        background:
                          action && !posting
                            ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                            : '#9ca3af',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '12px',
                        fontWeight: '600',
                        fontSize: '1rem',
                        boxShadow:
                          action && !posting
                            ? '0 6px 20px rgba(239, 68, 68, 0.3)'
                            : 'none',
                        transition: 'all 0.3s ease',
                        opacity: posting ? 0.7 : 1,
                      }}
                      onClick={() => postAproveReject(false, comment)}
                      disabled={posting || action === ''}
                      onMouseEnter={(e) => {
                        if (action && !posting) {
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow =
                            '0 8px 25px rgba(239, 68, 68, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (action && !posting) {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow =
                            '0 6px 20px rgba(239, 68, 68, 0.3)';
                        }
                      }}
                    >
                      {posting ? (
                        <>
                          <div
                            className='spinner-border spinner-border-sm'
                            role='status'
                            style={{ width: '16px', height: '16px' }}
                          >
                            <span className='visually-hidden'>Loading...</span>
                          </div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg
                            width='16'
                            height='16'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path
                              fillRule='evenodd'
                              d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z'
                              clipRule='evenodd'
                            />
                            <path
                              fillRule='evenodd'
                              d='M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H7a2 2 0 01-2-2V5zM6 7a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1z'
                              clipRule='evenodd'
                            />
                          </svg>
                          {userDecision ? 'Update Decision' : 'Submit'}{' '}
                          {action === 'full_rejection'
                            ? 'Rejection'
                            : 'Referral'}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Error Display */}
        {errors && (
          <div
            className='p-4 rounded-4 mt-4'
            style={{
              background:
                'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.12) 100%)',
              border: '2px solid rgba(239, 68, 68, 0.2)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15)',
              animation: 'slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            <div className='d-flex align-items-start gap-3'>
              <div
                className='d-flex align-items-center justify-content-center flex-shrink-0 rounded-3'
                style={{
                  width: '32px',
                  height: '32px',
                  background:
                    'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#ffffff',
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
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='flex-grow-1'>
                <h6 className='fw-bold mb-2' style={{ color: '#dc2626' }}>
                  Error Occurred
                </h6>
                <div style={{ color: '#7f1d1d' }}>{renderErrors(errors)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {posting && (
          <div
            className='position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(8px)',
              borderRadius: '24px',
              zIndex: 10,
            }}
          >
            <div className='text-center'>
              <div
                className='spinner-border mb-3'
                style={{
                  width: '3rem',
                  height: '3rem',
                  color: '#667eea',
                  borderWidth: '4px',
                }}
                role='status'
              >
                <span className='visually-hidden'>Loading...</span>
              </div>
              <h6 className='fw-semibold' style={{ color: '#475569' }}>
                {userDecision
                  ? 'Updating your decision...'
                  : 'Processing your decision...'}
              </h6>
              <p className='text-muted mb-0'>
                Please wait while we submit your response
              </p>
            </div>
          </div>
        )}

        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .btn:disabled {
            cursor: not-allowed;
          }

          .form-control:focus,
          .form-select:focus {
            outline: none;
            transform: translateY(-1px);
          }

          .invalid-feedback {
            display: block;
            font-weight: 500;
          }

          textarea::-webkit-scrollbar {
            width: 8px;
          }

          textarea::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 4px;
          }

          textarea::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
          }

          textarea::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.3);
          }

          .btn {
            position: relative;
            overflow: hidden;
          }

          .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.2),
              transparent
            );
            transition: left 0.5s;
          }

          .btn:hover::before {
            left: 100%;
          }

          .position-relative {
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
          }

          * {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
        `}</style>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAction}
        title={confirmationContent.title}
        message={confirmationContent.message}
        confirmText={confirmationContent.confirmText}
        cancelText='Cancel'
        type={confirmationContent.type}
        icon={confirmationContent.icon}
        isLoading={posting}
      />
    </>
  );
};

export default CommitteeApproveReject;
