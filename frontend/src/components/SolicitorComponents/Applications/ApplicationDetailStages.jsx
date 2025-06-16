import { formatDate } from '../../GenericFunctions/HelperGenericFunctions';

const ApplicationDetailStages = ({
  application,
  refresh,
  setRefresh,
  currentRequirements,
}) => {
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
        id: 'documents',
        title: 'Required Documents',
        description: allDocumentsComplete
          ? 'All documents submitted'
          : allMissingDocuments.length > 0
          ? `Missing: ${allMissingDocuments.join(', ')}`
          : 'Documents pending',
        completed: allDocumentsComplete,
        userAction: !allDocumentsComplete,
        icon: '📄',
        actionRequired: !allDocumentsComplete,
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

  const userSteps = getTimelineSteps();
  const statusStep = getStatusStep();
  const incompleteSteps = userSteps.filter((step) => step.actionRequired);

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
                      : '#f9fafb',
                    border: `2px solid ${
                      step.completed
                        ? '#22c55e'
                        : step.actionRequired
                        ? '#f59e0b'
                        : '#d1d5db'
                    }`,
                    fontSize: '1rem',
                    zIndex: 2,
                  }}
                >
                  {step.completed ? '✓' : step.icon}
                </div>

                <div className='flex-grow-1'>
                  <div className='d-flex align-items-center mb-1'>
                    <h6
                      className='mb-0 fw-semibold'
                      style={{
                        color: step.completed ? '#059669' : '#374151',
                        fontSize: '0.875rem',
                      }}
                    >
                      {step.title}
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
                  <p
                    className='mb-0 small'
                    style={{ color: '#6b7280', fontSize: '0.8rem' }}
                  >
                    {step.description}
                  </p>
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
    </div>
  );
};

export default ApplicationDetailStages;
