import { useEffect, useState } from 'react';
import {
  fetchData,
  postData,
} from '../../../GenericFunctions/AxiosGenericFunctions';

const PepperApprovalComponent = ({
  advancement,
  user,
  token,
  setRefresh,
  refresh,
}) => {
  const [decision, setDecision] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDecisionForm, setShowDecisionForm] = useState(false);
  const [pepperStatus, setPepperStatus] = useState(null);
  const [userExistingDecision, setUserExistingDecision] = useState(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // Internal error/success state
  const [localErrorMessage, setLocalErrorMessage] = useState('');
  const [localIsError, setLocalIsError] = useState(false);
  const [showLocalMessage, setShowLocalMessage] = useState(false);

  // Check if user is a pepper member
  const isPepperMember = user?.teams?.some(
    (team) => team.name === 'pepper_members'
  );

  // Fetch pepper status and decisions
  useEffect(() => {
    const fetchPepperStatus = async () => {
      if (!advancement?.id || !token) return;

      setIsLoadingStatus(true);
      try {
        const { access } = token;
        const endpoint = `/api/loans/loans/${advancement.id}/pepper-status/`;
        const response = await fetchData(access, endpoint);

        if (response.status === 200) {
          setPepperStatus(response.data);

          // Find current user's existing decision
          const userDecision = response.data.decision_history?.find(
            (decision) => decision.approved_by.id === user?.id
          );
          setUserExistingDecision(userDecision);
        }
      } catch (error) {
        console.error('Error fetching pepper status:', error);
      } finally {
        setIsLoadingStatus(false);
      }
    };

    if (advancement && user) {
      fetchPepperStatus();
    } else {
      setIsLoadingStatus(false);
    }
  }, [advancement?.id, user?.id, token, refresh]);

  const handleDecisionSubmit = async () => {
    if (!decision) {
      setLocalErrorMessage('Please select approve or reject');
      setLocalIsError(true);
      setShowLocalMessage(true);
      return;
    }

    if (decision === 'rejected' && !explanation.trim()) {
      setLocalErrorMessage('Explanation is required when rejecting');
      setLocalIsError(true);
      setShowLocalMessage(true);
      return;
    }

    setIsSubmitting(true);
    setLocalErrorMessage('');
    setLocalIsError(false);
    setShowLocalMessage(false);

    try {
      const endpoint = `/api/loans/loans/${advancement.id}/pepper-decision/`;
      const payload = {
        decision: decision,
        explanation: explanation.trim() || undefined,
      };

      const response = await postData('', endpoint, payload);

      if (response.status === 200) {
        setLocalErrorMessage(
          `Loan ${decision} successfully. ${
            response.data.loan_status.is_pepper_approved
              ? 'Pepper approval process completed.'
              : response.data.loan_status.is_pepper_rejected
              ? 'Loan rejected through Pepper process.'
              : 'Waiting for more approvals.'
          }`
        );
        setLocalIsError(false);
        setShowLocalMessage(true);
        setRefresh(!refresh);
        setShowDecisionForm(false);
        setDecision('');
        setExplanation('');

        // Hide success message after 5 seconds
        setTimeout(() => {
          setShowLocalMessage(false);
        }, 5000);
      }
    } catch (error) {
      console.error('Error submitting pepper decision:', error);
      setLocalIsError(true);
      if (error.response?.data?.detail) {
        setLocalErrorMessage(error.response.data.detail);
      } else {
        setLocalErrorMessage('Failed to submit decision. Please try again.');
      }
      setShowLocalMessage(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeDecision = () => {
    setDecision(userExistingDecision?.decision || '');
    setExplanation(userExistingDecision?.explanation || '');
    setShowDecisionForm(true);
  };

  if (!advancement.needs_pepper_approval) {
    return null;
  }

  if (isLoadingStatus) {
    return (
      <div
        className='px-4 py-3 rounded-3 mb-3 d-flex align-items-center justify-content-center'
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          minHeight: '100px',
        }}
      >
        <div className='d-flex align-items-center gap-2'>
          <div
            className='spinner-border spinner-border-sm text-white'
            role='status'
          >
            <span className='visually-hidden'>Loading...</span>
          </div>
          <span style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
            Loading pepper status...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className='px-4 py-3 rounded-3 mb-3'
      style={{
        background: 'rgba(255, 255, 255, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}
    >
      <div className='d-flex align-items-center justify-content-between mb-3'>
        <h5
          className='mb-0 fw-bold text-uppercase'
          style={{ fontSize: '1rem' }}
        >
          PEPPER Approval Required
        </h5>

        {advancement.is_pepper_rejected && (
          <span
            className='px-3 py-1 rounded-pill fw-bold'
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              color: '#dc2626',
              fontSize: '0.8rem',
              border: '1px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            REJECTED
          </span>
        )}

        {pepperStatus && (
          <div className='d-flex align-items-center gap-2'>
            <span
              className='px-2 py-1 rounded-pill fw-bold'
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              {pepperStatus.pepper_status.current_approvals}/
              {pepperStatus.pepper_status.required_approvals}
            </span>
          </div>
        )}
      </div>

      {/* Local Message Display */}
      {showLocalMessage && localErrorMessage && (
        <div
          className='mb-3 p-3 rounded-2'
          style={{
            backgroundColor: localIsError ? '#fef2f2' : '#f0fdf4',
            border: localIsError ? '1px solid #ef4444' : '1px solid #22c55e',
          }}
        >
          <div className='d-flex align-items-center gap-2'>
            <div
              className='d-flex align-items-center justify-content-center rounded-2 flex-shrink-0'
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: localIsError ? '#ef4444' : '#22c55e',
                color: 'white',
              }}
            >
              <svg
                width='14'
                height='14'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                {localIsError ? (
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                ) : (
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                )}
              </svg>
            </div>
            <div
              style={{
                fontSize: '0.9rem',
                color: localIsError ? '#b91c1c' : '#15803d',
              }}
            >
              {localErrorMessage}
            </div>
            <button
              onClick={() => setShowLocalMessage(false)}
              style={{
                background: 'none',
                border: 'none',
                color: localIsError ? '#b91c1c' : '#15803d',
                marginLeft: 'auto',
                cursor: 'pointer',
                padding: '4px',
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
            </button>
          </div>
        </div>
      )}

      {advancement.is_pepper_rejected ? (
        <div
          className='p-3 rounded-2'
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#374151',
            fontSize: '0.9rem',
          }}
        >
          <div className='d-flex align-items-center gap-2 mb-2'>
            <svg
              width='16'
              height='16'
              fill='currentColor'
              viewBox='0 0 20 20'
              style={{ color: '#dc2626' }}
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
            <span className='fw-bold' style={{ color: '#dc2626' }}>
              This loan has been rejected through the Pepper process
            </span>
          </div>
          <p className='mb-0'>
            No further actions are available for this advancement.
          </p>
        </div>
      ) : !isPepperMember ? (
        <div
          className='p-3 rounded-2'
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#374151',
            fontSize: '0.9rem',
          }}
        >
          <div className='d-flex align-items-center gap-2 mb-2'>
            <svg
              width='16'
              height='16'
              fill='currentColor'
              viewBox='0 0 20 20'
              style={{ color: '#f59e0b' }}
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                clipRule='evenodd'
              />
            </svg>
            <span className='fw-bold' style={{ color: '#d97706' }}>
              Pepper Member Approval Required
            </span>
          </div>
          <p className='mb-3'>
            This advancement requires approval from Pepper committee members.
            You are not authorized to approve or reject this loan.
          </p>

          {pepperStatus && (
            <div className='border-top pt-3' style={{ borderColor: '#e5e7eb' }}>
              <div className='mb-3'>
                <div className='d-flex justify-content-between align-items-center mb-2'>
                  <span className='fw-bold' style={{ color: '#1f2937' }}>
                    Overall Status:
                  </span>
                  <span
                    className='px-2 py-1 rounded fw-bold'
                    style={{
                      background: pepperStatus.pepper_status.is_pepper_approved
                        ? '#dcfce7'
                        : pepperStatus.pepper_status.is_pepper_rejected
                        ? '#fef2f2'
                        : '#fef3c7',
                      color: pepperStatus.pepper_status.is_pepper_approved
                        ? '#166534'
                        : pepperStatus.pepper_status.is_pepper_rejected
                        ? '#991b1b'
                        : '#a16207',
                      fontSize: '0.8rem',
                    }}
                  >
                    {pepperStatus.pepper_status.status_summary}
                  </span>
                </div>
              </div>

              {pepperStatus.decision_history &&
                pepperStatus.decision_history.length > 0 && (
                  <div>
                    <h6
                      className='fw-bold mb-2'
                      style={{ color: '#1f2937', fontSize: '0.9rem' }}
                    >
                      Decision History:
                    </h6>
                    <div className='d-flex flex-column gap-2'>
                      {pepperStatus.decision_history.map((decision, index) => (
                        <div
                          key={decision.id}
                          className='p-2 rounded'
                          style={{
                            background: '#f8f9fa',
                            border: '1px solid #e9ecef',
                          }}
                        >
                          <div className='d-flex align-items-center justify-content-between mb-2'>
                            <div className='d-flex align-items-center gap-2'>
                              <div
                                className='d-flex align-items-center justify-content-center rounded-circle'
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  background:
                                    decision.decision === 'approved'
                                      ? '#22c55e'
                                      : '#ef4444',
                                  color: 'white',
                                }}
                              >
                                <svg
                                  width='10'
                                  height='10'
                                  fill='currentColor'
                                  viewBox='0 0 20 20'
                                >
                                  {decision.decision === 'approved' ? (
                                    <path
                                      fillRule='evenodd'
                                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                      clipRule='evenodd'
                                    />
                                  ) : (
                                    <path
                                      fillRule='evenodd'
                                      d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                                      clipRule='evenodd'
                                    />
                                  )}
                                </svg>
                              </div>
                              <div>
                                <div
                                  className='fw-bold'
                                  style={{ fontSize: '0.85rem' }}
                                >
                                  {decision.approved_by.first_name}{' '}
                                  {decision.approved_by.last_name}
                                </div>
                                <div
                                  className='text-muted'
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  {decision.approved_by.email}
                                </div>
                              </div>
                            </div>
                            <div className='text-end'>
                              <div
                                className='fw-bold'
                                style={{
                                  fontSize: '0.8rem',
                                  color:
                                    decision.decision === 'approved'
                                      ? '#16a34a'
                                      : '#dc2626',
                                }}
                              >
                                {decision.decision.toUpperCase()}
                              </div>
                              <div
                                className='text-muted'
                                style={{ fontSize: '0.7rem' }}
                              >
                                {new Date(
                                  decision.decision_date
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          {decision.explanation && (
                            <div
                              className='p-2 rounded mt-2'
                              style={{
                                background: '#ffffff',
                                border: '1px solid #d1d5db',
                                borderLeft: `3px solid ${
                                  decision.decision === 'approved'
                                    ? '#22c55e'
                                    : '#ef4444'
                                }`,
                              }}
                            >
                              <small className='fw-bold text-muted d-block mb-1'>
                                Explanation:
                              </small>
                              <div
                                style={{ fontSize: '0.8rem', color: '#374151' }}
                              >
                                "{decision.explanation}"
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
      ) : (
        <div
          className='p-3 rounded-2'
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            color: '#374151',
            fontSize: '0.9rem',
          }}
        >
          {userExistingDecision ? (
            <div>
              <div className='d-flex align-items-center gap-2 mb-3'>
                <svg
                  width='16'
                  height='16'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  style={{
                    color:
                      userExistingDecision.decision === 'approved'
                        ? '#16a34a'
                        : '#dc2626',
                  }}
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='fw-bold' style={{ color: '#1f2937' }}>
                  Your Decision:{' '}
                  {userExistingDecision.decision === 'approved'
                    ? 'APPROVED'
                    : 'REJECTED'}
                </span>
                <span className='text-muted' style={{ fontSize: '0.8rem' }}>
                  on{' '}
                  {new Date(
                    userExistingDecision.decision_date
                  ).toLocaleDateString()}
                </span>
              </div>

              {userExistingDecision.explanation && (
                <div
                  className='p-2 rounded mb-3'
                  style={{
                    background: '#f8f9fa',
                    border: '1px solid #e9ecef',
                  }}
                >
                  <small className='fw-bold text-muted d-block mb-1'>
                    Your explanation:
                  </small>
                  <div style={{ fontSize: '0.85rem' }}>
                    "{userExistingDecision.explanation}"
                  </div>
                </div>
              )}

              {pepperStatus && (
                <div className='mb-3'>
                  <p className='mb-2 fw-bold'>
                    Overall Status: {pepperStatus.pepper_status.status_summary}
                  </p>
                  <div
                    className='p-2 rounded d-flex align-items-center gap-2'
                    style={{
                      background: '#e0f2fe',
                      border: '1px solid #0284c7',
                    }}
                  >
                    <svg
                      width='16'
                      height='16'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      style={{ color: '#0284c7' }}
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span style={{ fontSize: '0.9rem', color: '#0369a1' }}>
                      Your decision has been recorded and cannot be changed.
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : !showDecisionForm ? (
            <div>
              <div className='d-flex align-items-center gap-2 mb-3'>
                <svg
                  width='16'
                  height='16'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  style={{ color: '#3b82f6' }}
                >
                  <path
                    fillRule='evenodd'
                    d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
                <span className='fw-bold' style={{ color: '#1f2937' }}>
                  Ready for Your Decision
                </span>
              </div>
              <p className='mb-3'>
                As a Pepper committee member, you can approve or reject this
                advancement. Required approvals:{' '}
                <strong>{advancement.pepper_members_count_required}</strong>
                {pepperStatus && (
                  <span>
                    {' '}
                    | Current status:{' '}
                    <strong>{pepperStatus.pepper_status.status_summary}</strong>
                  </span>
                )}
              </p>
              <div className='d-flex gap-2'>
                <button
                  className='btn btn-success btn-sm d-flex align-items-center gap-2'
                  onClick={() => setShowDecisionForm(true)}
                  style={{
                    background:
                      'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontWeight: '500',
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
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Make Decision
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className='mb-3'>
                <label
                  className='fw-bold mb-2 d-block'
                  style={{ color: '#374151' }}
                >
                  Your Decision:
                </label>
                <div className='d-flex gap-3 mb-3'>
                  <label className='d-flex align-items-center gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='decision'
                      value='approved'
                      checked={decision === 'approved'}
                      onChange={(e) => setDecision(e.target.value)}
                      className='form-check-input'
                    />
                    <span className='fw-bold' style={{ color: '#16a34a' }}>
                      Approve
                    </span>
                  </label>
                  <label className='d-flex align-items-center gap-2 cursor-pointer'>
                    <input
                      type='radio'
                      name='decision'
                      value='rejected'
                      checked={decision === 'rejected'}
                      onChange={(e) => setDecision(e.target.value)}
                      className='form-check-input'
                    />
                    <span className='fw-bold' style={{ color: '#dc2626' }}>
                      Reject
                    </span>
                  </label>
                </div>
              </div>

              <div className='mb-3'>
                <label
                  className='fw-bold mb-2 d-block'
                  style={{ color: '#374151' }}
                >
                  {decision === 'rejected'
                    ? 'Explanation (Required):'
                    : 'Explanation (Optional):'}
                </label>
                <textarea
                  className='form-control'
                  rows='3'
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder={
                    decision === 'rejected'
                      ? "Please explain why you're rejecting this loan..."
                      : 'Optional: Add any comments about your decision...'
                  }
                  style={{
                    border: '2px solid #e5e7eb',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                  }}
                />
              </div>

              <div className='d-flex gap-2 justify-content-end'>
                <button
                  className='btn btn-secondary btn-sm'
                  onClick={() => {
                    setShowDecisionForm(false);
                    setDecision('');
                    setExplanation('');
                  }}
                  disabled={isSubmitting}
                  style={{
                    background: '#6b7280',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                  }}
                >
                  Cancel
                </button>
                <button
                  className='btn btn-primary btn-sm d-flex align-items-center gap-2'
                  onClick={handleDecisionSubmit}
                  disabled={isSubmitting || !decision}
                  style={{
                    background:
                      decision === 'approved'
                        ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontWeight: '500',
                    opacity: !decision || isSubmitting ? 0.6 : 1,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div
                        className='spinner-border spinner-border-sm'
                        role='status'
                        style={{ width: '14px', height: '14px' }}
                      >
                        <span className='visually-hidden'>Loading...</span>
                      </div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg
                        width='14'
                        height='14'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      Submit{' '}
                      {decision === 'approved' ? 'Approval' : 'Rejection'}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PepperApprovalComponent;
