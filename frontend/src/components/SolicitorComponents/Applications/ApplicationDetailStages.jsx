import { useState } from 'react';
import { postData } from '../../GenericFunctions/AxiosGenericFunctions';
import { formatDate } from '../../GenericFunctions/HelperGenericFunctions';
import ProcessingStatusModal from './ProcessingStatusModal';

const ApplicationDetailStages = ({
  application,
  refresh,
  setRefresh,
  currentRequirements,
}) => {
  const [showModal, setShowModal] = useState(false);

  console.log('Application Detail Stages Rendered', application);

  const getTimelineSteps = () => {
    // Existing validations
    const requiredDocsComplete =
      application.loan_agreement_ready && application.undertaking_ready;
    const estateValue =
      parseFloat(application.value_of_the_estate_after_expenses) || 0;
    const estateValueComplete = estateValue > 0;
    const solicitorAssigned = application.solicitor !== null;

    // New validations for submitted stage
    const amountValid =
      application.amount && parseFloat(application.amount) > 0;
    const applicantsValid =
      application.applicants && application.applicants.length > 0;
    const deceasedValid =
      application.deceased &&
      application.deceased.first_name &&
      application.deceased.first_name.trim() !== '' &&
      application.deceased.last_name &&
      application.deceased.last_name.trim() !== '';

    const submittedComplete = amountValid && applicantsValid && deceasedValid;

    // Processing status validation
    const processingStatusComplete =
      application.processing_status?.application_details_completed_confirmed ||
      false;

    // Add this check for all previous steps completion
    const allPreviousStepsComplete =
      submittedComplete &&
      solicitorAssigned &&
      estateValueComplete &&
      processingStatusComplete;

    console.log('CURRENT REQUIREMENTS:', currentRequirements);

    // Check for missing requirements from currentRequirements
    const missingRequirements = [];
    if (currentRequirements && Array.isArray(currentRequirements)) {
      const missingRequirementNames = currentRequirements
        .filter((req) => !req.is_uploaded)
        .map((req) => req.document_type?.name)
        .filter(Boolean); // Remove any undefined/null names

      missingRequirements.push(...missingRequirementNames);
    }

    // Check for missing template documents
    const missingTemplateDocuments = [
      !application.loan_agreement_ready && 'Agreement',
      !application.undertaking_ready && 'Undertaking',
    ].filter(Boolean);

    // Combine all missing documents
    const allMissingDocuments = [
      ...missingRequirements,
      ...missingTemplateDocuments,
    ];

    // Check if all documents are complete (both requirements and templates)
    const allRequirementsUploaded = currentRequirements
      ? currentRequirements.every((req) => req.is_uploaded)
      : true;
    const allDocumentsComplete =
      requiredDocsComplete && allRequirementsUploaded;

    // Build missing requirements list for submitted stage
    const missingSubmittedRequirements = [];
    if (!amountValid) missingSubmittedRequirements.push('Loan Amount');
    if (!applicantsValid)
      missingSubmittedRequirements.push('Applicant Information');
    if (!deceasedValid)
      missingSubmittedRequirements.push('Deceased Information');

    return [
      {
        id: 'submitted',
        title: 'Application Submitted',
        description: submittedComplete
          ? `Submitted ${formatDate(application.date_submitted)}`
          : `Missing: ${missingSubmittedRequirements.join(', ')}`,
        completed: submittedComplete,
        userAction: !submittedComplete,
        icon: '📝',
        actionRequired: !submittedComplete,
      },
      {
        id: 'solicitor',
        title: 'Solicitor Assignment',
        description: solicitorAssigned
          ? `Solicitor assigned`
          : 'Awaiting assignment',
        completed: solicitorAssigned,
        userAction: !solicitorAssigned,
        icon: '👨‍💼',
        actionRequired: !solicitorAssigned,
      },
      {
        id: 'estate',
        title: 'Estate Information',
        description: estateValueComplete
          ? 'Estate details complete'
          : 'Estate information missing',
        completed: estateValueComplete,
        userAction: !estateValueComplete,
        icon: '🏠',
        actionRequired: !estateValueComplete,
      },
      {
        id: 'processing',
        title: 'Details Confirmation',
        description: processingStatusComplete
          ? `All details confirmed with solicitor • ${
              application.processing_status?.solicitor_preferred_aml_method ===
              'KYC'
                ? 'KYC Letter Required'
                : application.processing_status
                    ?.solicitor_preferred_aml_method === 'AML'
                ? 'Photo ID + Proof of Address Required'
                : 'Method Confirmed'
            }`
          : submittedComplete && solicitorAssigned && estateValueComplete
          ? 'Ready for solicitor confirmation'
          : 'Available after completing previous steps',
        completed: processingStatusComplete,
        userAction: false,
        icon: '🤝',
        actionRequired: false,
        isClickable:
          submittedComplete &&
          solicitorAssigned &&
          estateValueComplete &&
          !processingStatusComplete,
        isBlurred: !(
          submittedComplete &&
          solicitorAssigned &&
          estateValueComplete
        ),
        showConfirmButton:
          !processingStatusComplete &&
          submittedComplete &&
          solicitorAssigned &&
          estateValueComplete,
        isDisabled: processingStatusComplete,
      },
      {
        id: 'documents',
        title: 'Required Documents',
        description: allPreviousStepsComplete
          ? allDocumentsComplete
            ? 'All documents submitted'
            : allMissingDocuments.length > 0
            ? `Missing: ${allMissingDocuments.join(', ')}`
            : 'Documents pending'
          : 'Available after completing all previous steps',
        completed: allDocumentsComplete,
        userAction: !allDocumentsComplete && allPreviousStepsComplete,
        icon: '📄',
        actionRequired: !allDocumentsComplete && allPreviousStepsComplete,
        isBlurred: !allPreviousStepsComplete,
        isDisabled: !allPreviousStepsComplete,
      },
    ];
  };

  const getStatusStep = () => {
    return {
      id: 'review',
      title: 'Under Review',
      description: application.approved
        ? application.loan?.needs_committee_approval
          ? 'Approved - Committee pending'
          : 'Application approved'
        : application.is_rejected
        ? 'Application rejected'
        : 'Under review',
      completed: application.approved || application.is_rejected,
      userAction: false,
      icon: application.approved ? '✅' : application.is_rejected ? '❌' : '🔍',
      isError: application.is_rejected,
      actionRequired: false,
    };
  };

  const handleConfirmProcessing = async (selectedMethod) => {
    try {
      console.log(
        'Confirming processing status for application:',
        application.id
      );
      console.log('Selected method:', selectedMethod);

      // Get the auth token (adjust this based on how you store auth tokens)
      const token = localStorage.getItem('token'); // or however you store your JWT token

      const response = await postData(
        token,
        `/api/applications/agent_applications/${application.id}/processing-status/`,
        {
          application_details_completed_confirmed: true,
          solicitor_preferred_aml_method: selectedMethod,
        }
      );

      // Check if the response was successful
      if (response && response.status >= 200 && response.status < 300) {
        console.log('Processing status created successfully:', response.data);

        // Refresh the data
        setRefresh(!refresh);

        // Optional: Show success message
        // toast.success('Application details confirmed successfully!');
      } else {
        // Handle error response
        const errorMessage =
          response?.data?.error || 'Failed to create processing status';
        console.error('Error response:', response?.data);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error confirming processing status:', error);

      // Optional: Show error message to user
      // toast.error(error.message || 'Failed to confirm application details');

      // You can also handle specific error cases here
      if (error.message?.includes('already exists')) {
        console.log(
          'Processing status already exists - this application may have been confirmed already'
        );
      }
    }
  };

  const userSteps = getTimelineSteps();
  const statusStep = getStatusStep();
  const incompleteSteps = userSteps.filter((step) => step.actionRequired);

  // Get values for the locked documents info
  const submittedComplete = userSteps[0].completed;
  const solicitorAssigned = userSteps[1].completed;
  const estateValueComplete = userSteps[2].completed;
  const processingStatusComplete = userSteps[3].completed;

  return (
    <div>
      {application && (
        <div
          className='bg-white rounded-4 p-3 mb-3'
          style={{
            boxShadow:
              '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
        >
          <div className='d-flex align-items-center justify-content-between mb-3'>
            <h6 className='mb-0 fw-bold' style={{ color: '#111827' }}>
              User Completion Status
            </h6>
            <div className='d-flex align-items-center gap-2'>
              <button
                type='button'
                className='btn btn-sm d-flex align-items-center gap-1'
                onClick={() => setRefresh(!refresh)}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  color: '#64748b',
                  fontSize: '0.75rem',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f1f5f9';
                  e.target.style.borderColor = '#cbd5e1';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f8fafc';
                  e.target.style.borderColor = '#e2e8f0';
                }}
              >
                <span style={{ fontSize: '0.7rem' }}>🔄</span>
                Refresh
              </button>
              {incompleteSteps.length > 0 && (
                <span
                  className='badge px-2 py-1'
                  style={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                  }}
                >
                  Action Needed
                </span>
              )}
            </div>
          </div>

          {/* Agent Instruction Alert – All Required Actions */}
          {incompleteSteps.length > 0 && (
            <div
              className='alert py-2 px-3 mb-3'
              style={{
                backgroundColor: '#fefbf3',
                border: '1px solid #fed7aa',
                borderRadius: '8px',
              }}
            >
              <div className='d-flex align-items-center'>
                <span style={{ fontSize: '1rem', marginRight: '8px' }}>📞</span>
                <div>
                  <strong style={{ color: '#d97706', fontSize: '0.85rem' }}>
                    Instruct User:
                  </strong>
                  <span
                    style={{
                      color: '#374151',
                      fontSize: '0.85rem',
                      marginLeft: '4px',
                    }}
                  >
                    {incompleteSteps.map((step) => step.title).join(', ')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Timeline – User Steps */}
          <div className='position-relative mb-3'>
            {userSteps.map((step, index) => (
              <div key={step.id} className='d-flex mb-2 position-relative'>
                {index < userSteps.length - 1 && (
                  <div
                    className='position-absolute'
                    style={{
                      left: '18px',
                      top: '36px',
                      width: '2px',
                      height: 'calc(100% + 4px)',
                      backgroundColor: step.completed ? '#22c55e' : '#e5e7eb',
                      zIndex: 1,
                    }}
                  />
                )}

                <div
                  className='d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 me-3'
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: step.completed
                      ? '#f0fdf4'
                      : step.actionRequired
                      ? '#fefbf3'
                      : step.isBlurred
                      ? '#f3f4f6'
                      : '#f9fafb',
                    border: `2px solid ${
                      step.completed
                        ? '#22c55e'
                        : step.actionRequired
                        ? '#f59e0b'
                        : step.isBlurred
                        ? '#d1d5db'
                        : '#d1d5db'
                    }`,
                    fontSize: '1rem',
                    zIndex: 2,
                    opacity: step.isBlurred ? 0.4 : 1,
                    filter: step.isBlurred ? 'blur(1px)' : 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {step.completed ? '✓' : step.icon}
                </div>

                <div
                  className='flex-grow-1'
                  style={{
                    cursor:
                      step.id === 'processing' &&
                      step.isClickable &&
                      !step.isDisabled
                        ? 'pointer'
                        : step.isDisabled
                        ? 'not-allowed'
                        : 'default',
                    transition: 'all 0.2s ease',
                    opacity: step.isBlurred ? 0.5 : step.isDisabled ? 0.8 : 1,
                    filter: step.isBlurred ? 'blur(0.5px)' : 'none',
                  }}
                  onClick={
                    step.id === 'processing' &&
                    step.isClickable &&
                    !step.isDisabled
                      ? () => setShowModal(true)
                      : undefined
                  }
                  onMouseEnter={
                    step.id === 'processing' &&
                    step.isClickable &&
                    !step.isDisabled
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
                    step.id === 'processing' &&
                    step.isClickable &&
                    !step.isDisabled
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
                          color: step.completed
                            ? '#059669'
                            : step.isBlurred
                            ? '#9ca3af'
                            : step.isDisabled
                            ? '#6b7280'
                            : '#374151',
                          fontSize: '0.875rem',
                        }}
                      >
                        {step.title}
                        {step.id === 'processing' &&
                          step.isClickable &&
                          !step.isDisabled && (
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
                        {step.id === 'processing' && step.isDisabled && (
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
                      </h6>
                      {step.userAction && (
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
                    {step.id === 'processing' && (
                      <div className='d-flex align-items-center'>
                        {step.showConfirmButton && !step.isDisabled && (
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
                        {step.isBlurred && (
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
                        {step.isDisabled && (
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
                            backgroundColor: step.completed
                              ? '#22c55e'
                              : step.isBlurred
                              ? '#d1d5db'
                              : step.isDisabled
                              ? '#22c55e'
                              : '#667eea',
                            animation:
                              !step.completed &&
                              !step.isBlurred &&
                              !step.isDisabled
                                ? 'pulse 2s infinite'
                                : 'none',
                            opacity: step.isBlurred ? 0.4 : 1,
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
                        color: step.isBlurred
                          ? '#9ca3af'
                          : step.isDisabled
                          ? '#6b7280'
                          : '#6b7280',
                        fontSize: '0.8rem',
                        lineHeight: '1.4',
                      }}
                    >
                      {step.description}
                      {step.id === 'processing' &&
                        step.isClickable &&
                        !step.completed &&
                        !step.isDisabled && (
                          <span
                            style={{ color: '#667eea', fontStyle: 'italic' }}
                          >
                            {' '}
                            - Click to manage
                          </span>
                        )}
                    </p>

                    {/* Method details display for completed processing status */}
                    {step.id === 'processing' &&
                      step.completed &&
                      application.processing_status
                        ?.solicitor_preferred_aml_method && (
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
                            <span
                              style={{ marginRight: '6px', fontSize: '0.9rem' }}
                            >
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
                    {step.id === 'documents' && step.isBlurred && (
                      <div
                        className='mt-2 p-3 rounded-3'
                        style={{
                          background:
                            'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                          border: '1px solid #f59e0b',
                          fontSize: '0.75rem',
                          boxShadow: '0 4px 12px rgba(245, 158, 11, 0.1)',
                        }}
                      >
                        <div className='d-flex align-items-start'>
                          <div
                            className='me-2 p-1 rounded-circle flex-shrink-0'
                            style={{
                              background:
                                'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                              width: '20px',
                              height: '20px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span style={{ fontSize: '0.7rem' }}>🔒</span>
                          </div>
                          <div>
                            <p
                              className='mb-1 fw-semibold'
                              style={{ color: '#92400e', fontSize: '0.8rem' }}
                            >
                              Documents Phase Locked
                            </p>
                            <p
                              className='mb-2'
                              style={{ color: '#78350f', lineHeight: '1.4' }}
                            >
                              Complete all previous steps to unlock document
                              submission:
                            </p>
                            <div className='d-flex flex-wrap gap-1'>
                              {[
                                {
                                  id: 'submitted',
                                  label: 'Application Submitted',
                                  completed: submittedComplete,
                                },
                                {
                                  id: 'solicitor',
                                  label: 'Solicitor Assignment',
                                  completed: solicitorAssigned,
                                },
                                {
                                  id: 'estate',
                                  label: 'Estate Information',
                                  completed: estateValueComplete,
                                },
                                {
                                  id: 'processing',
                                  label: 'Details Confirmation',
                                  completed: processingStatusComplete,
                                },
                              ].map((reqStep) => (
                                <span
                                  key={reqStep.id}
                                  className='badge'
                                  style={{
                                    backgroundColor: reqStep.completed
                                      ? '#d1fae5'
                                      : '#fef2f2',
                                    color: reqStep.completed
                                      ? '#065f46'
                                      : '#dc2626',
                                    fontSize: '0.65rem',
                                    fontWeight: '500',
                                    padding: '2px 6px',
                                    border: reqStep.completed
                                      ? '1px solid #10b981'
                                      : '1px solid #f87171',
                                  }}
                                >
                                  {reqStep.completed ? '✓' : '○'}{' '}
                                  {reqStep.label}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Processing locked info message */}
                  {step.id === 'processing' && step.isBlurred && (
                    <div
                      className='mt-2 p-2 rounded'
                      style={{
                        backgroundColor: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        fontSize: '0.75rem',
                        color: '#6b7280',
                      }}
                    >
                      <div className='d-flex align-items-center'>
                        <span style={{ marginRight: '6px' }}>ℹ️</span>
                        <span>
                          Complete Application Submitted, Solicitor Assignment,
                          and Estate Information first
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Timeline – Review Info */}
          <div className='border-top pt-3 mt-3'>
            <div className='d-flex position-relative'>
              <div
                className='d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 me-3'
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: statusStep.isError ? '#fef2f2' : '#f9fafb',
                  border: `2px solid ${
                    statusStep.isError ? '#ef4444' : '#d1d5db'
                  }`,
                  fontSize: '1rem',
                  zIndex: 2,
                }}
              >
                {statusStep.completed && !statusStep.isError
                  ? '✓'
                  : statusStep.icon}
              </div>

              <div className='flex-grow-1'>
                <div className='d-flex align-items-center mb-1'>
                  <h6
                    className='mb-0 fw-semibold'
                    style={{
                      color: statusStep.isError ? '#dc2626' : '#374151',
                      fontSize: '0.875rem',
                    }}
                  >
                    {statusStep.title}
                  </h6>
                </div>
                <p
                  className='mb-0 small'
                  style={{ color: '#6b7280', fontSize: '0.8rem' }}
                >
                  {statusStep.description}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Summary */}
          <div
            className='mt-3 p-2 rounded-3'
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
            }}
          >
            <div className='d-flex align-items-center justify-content-between'>
              <div className='d-flex align-items-center'>
                <div className='me-2'>
                  <div
                    className='progress'
                    style={{ width: '80px', height: '6px' }}
                  >
                    <div
                      className='progress-bar'
                      style={{
                        width: `${
                          (userSteps.filter((s) => s.completed).length /
                            userSteps.length) *
                          100
                        }%`,
                        backgroundColor: '#22c55e',
                      }}
                    />
                  </div>
                </div>
                <small
                  style={{
                    color: '#6b7280',
                    fontWeight: '500',
                    fontSize: '0.8rem',
                  }}
                >
                  {userSteps.filter((s) => s.completed).length} of{' '}
                  {userSteps.length} complete
                </small>
              </div>
            </div>
          </div>

          {/* Rejection Reason */}
          {application.is_rejected && application.rejected_reason && (
            <div
              className='mt-3 p-3 rounded-3'
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
              }}
            >
              <div className='d-flex align-items-start'>
                <span style={{ fontSize: '1rem', marginRight: '8px' }}>❌</span>
                <div>
                  <h6
                    className='fw-bold mb-1'
                    style={{ color: '#dc2626', fontSize: '0.875rem' }}
                  >
                    Application Rejected
                  </h6>
                  <p
                    className='mb-0'
                    style={{ color: '#7f1d1d', fontSize: '0.8rem' }}
                  >
                    {application.rejected_reason}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Processing Status Modal */}
      <ProcessingStatusModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        application={application}
        onConfirm={handleConfirmProcessing}
      />
    </div>
  );
};

export default ApplicationDetailStages;
