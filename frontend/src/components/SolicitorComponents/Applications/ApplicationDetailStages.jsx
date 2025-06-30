// src/components/ApplicationDetailStages/ApplicationDetailStages.js
import { useEffect, useState } from 'react';
import {
  fetchData,
  postData,
  uploadFile,
} from '../../GenericFunctions/AxiosGenericFunctions';
import { formatDate } from '../../GenericFunctions/HelperGenericFunctions';
import AgentInstructionAlert from './ApplicationDetailStagesParts/AgentInstructionAlert';
import CCRUploadModal from './ApplicationDetailStagesParts/CCRUploadModal';
import PEPCheckModal from './ApplicationDetailStagesParts/PEPCheckModal';
import ProcessingStatusModal from './ApplicationDetailStagesParts/ProcessingStatusModal';
import ProgressSummary from './ApplicationDetailStagesParts/ProgressSummary';
import RejectionReason from './ApplicationDetailStagesParts/RejectionReason';
import ReviewInfo from './ApplicationDetailStagesParts/ReviewInfo';
import TimelineHeader from './ApplicationDetailStagesParts/TimelineHeader';
import TimelineStep from './ApplicationDetailStagesParts/TimelineStep';

const ApplicationDetailStages = ({
  application,
  refresh,
  setRefresh,
  currentRequirements,
  allStagesCompleted,
  setAllStagesCompleted,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showCCRUploadModal, setShowCCRUploadModal] = useState(false);
  const [showPEPCheckModal, setShowPEPCheckModal] = useState(false);
  const [internalFiles, setInternalFiles] = useState([]);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // ALL HOOKS MUST COME FIRST - BEFORE ANY CONDITIONAL RETURNS
  useEffect(() => {
    const fetchInternalFiles = async () => {
      if (application?.id) {
        setLoading(true);
        try {
          const endpoint = `/api/internal-files/?application_id=${application.id}`;
          const response = await fetchData('token', endpoint);
          setInternalFiles(response.data || response || []);
        } catch (error) {
          console.error('Error fetching internal files:', error);
          setErrorMessage(['Failed to fetch internal files']);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchInternalFiles();
  }, [application?.id, refresh]);

  useEffect(() => {
    const fetchEmails = async () => {
      if (application?.id) {
        try {
          const token = localStorage.getItem('token');
          const response = await fetchData(
            token,
            `api/applications/${application.id}/emails/`
          );
          if (response && response.status >= 200 && response.status < 300) {
            setEmails(response.data || []);
          } else {
            setEmails([]);
          }
        } catch (error) {
          console.error('Failed to fetch emails:', error);
          setEmails([]);
        }
      }
    };

    fetchEmails();
  }, [application?.id, refresh]);

  useEffect(() => {
    const calculateCompletionStatus = () => {
      if (!application) return false;

      const steps = getTimelineSteps();
      const allTimelineStepsComplete = steps.every((step) => step.completed);
      return allTimelineStepsComplete;
    };

    const completionStatus = calculateCompletionStatus();
    setAllStagesCompleted(completionStatus);
  }, [application, internalFiles, currentRequirements, emails, refresh]);

  const getTimelineSteps = () => {
    const estateValue =
      parseFloat(application.value_of_the_estate_after_expenses) || 0;
    const estateValueComplete = estateValue > 0;
    const solicitorAssigned = application.solicitor !== null;

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

    const processingStatusComplete =
      application.processing_status?.application_details_completed_confirmed ||
      false;

    const ccrFileComplete = internalFiles.some((file) => file.is_ccr === true);

    // NEW: Check for PEP check completion
    const pepCheckComplete = internalFiles.some(
      (file) => file.is_pep_check === true
    );

    const allPreviousStepsComplete =
      submittedComplete &&
      solicitorAssigned &&
      estateValueComplete &&
      processingStatusComplete &&
      ccrFileComplete;

    // NEW: All steps including PEP check
    const allStepsIncludingPepComplete =
      allPreviousStepsComplete && pepCheckComplete;

    const missingRequirements = [];
    if (currentRequirements && Array.isArray(currentRequirements)) {
      const missingRequirementNames = currentRequirements
        .filter((req) => !req.is_uploaded)
        .map((req) => req.document_type?.name)
        .filter(Boolean);
      missingRequirements.push(...missingRequirementNames);
    }

    const getMissingTemplateDocuments = () => {
      const allDocs = [
        ...(application.documents || []),
        ...(application.signed_documents || []),
      ];

      if (allDocs.length === 0) {
        return ['No documents have been uploaded'];
      }

      const missingUploads = allDocs
        .filter((doc) => doc.is_required && !doc.is_uploaded)
        .map((doc) => `${doc.original_name || doc.title} - Not uploaded`);

      if (missingUploads.length > 0) {
        return missingUploads;
      }

      const signatureIssues = allDocs
        .filter((doc) => doc.signature_required && !doc.is_signed)
        .map((doc) => `${doc.original_name || doc.title} - Signature required`);

      return signatureIssues;
    };

    const missingTemplateDocuments = getMissingTemplateDocuments();
    const allMissingDocuments = [
      ...missingRequirements,
      ...missingTemplateDocuments,
    ];

    const allRequirementsUploaded = currentRequirements
      ? currentRequirements.every((req) => req.is_uploaded)
      : true;

    const allDocumentsComplete =
      allRequirementsUploaded && allMissingDocuments.length === 0;

    // Analyze emails data for completion status
    const analyzeEmails = () => {
      if (!emails || emails.length === 0) {
        return {
          completed: false,
          description: 'No emails created yet',
          hasWarning: true,
        };
      }

      const sentEmails = emails.filter(
        (email) => email.sent_at !== null && email.status !== 'draft'
      );
      const draftEmails = emails.filter(
        (email) => email.sent_at === null || email.status === 'draft'
      );
      const totalDocumentCount = emails.reduce(
        (sum, email) => sum + (email.document_count || 0),
        0
      );
      const sentDocumentCount = sentEmails.reduce(
        (sum, email) => sum + (email.document_count || 0),
        0
      );

      if (sentEmails.length === 0) {
        return {
          completed: false,
          description: `${emails.length} email(s) created but none sent yet`,
          hasWarning: true,
          details: `All ${emails.length} email(s) are still in draft status`,
        };
      }

      if (sentEmails.length > 0 && totalDocumentCount === 0) {
        return {
          completed: false,
          description: `${sentEmails.length} email(s) sent but no documents attached`,
          hasWarning: true,
          details: 'Emails sent without any documents',
        };
      }

      if (sentEmails.length > 0 && sentDocumentCount === 0) {
        return {
          completed: false,
          description: `${sentEmails.length} email(s) sent but documents not included`,
          hasWarning: true,
          details: 'Sent emails contain no documents',
        };
      }

      if (
        sentEmails.length > 0 &&
        sentDocumentCount > 0 &&
        draftEmails.length > 0
      ) {
        return {
          completed: true,
          description: `${sentEmails.length} email(s) sent with ${sentDocumentCount} document(s)`,
          hasWarning: true,
          details: `${draftEmails.length} email(s) still in draft status`,
        };
      }

      if (
        sentEmails.length > 0 &&
        sentDocumentCount > 0 &&
        draftEmails.length === 0
      ) {
        return {
          completed: true,
          description: `All ${sentEmails.length} email(s) sent with ${sentDocumentCount} document(s)`,
          hasWarning: false,
          details: 'All emails successfully sent with documents',
        };
      }

      return {
        completed: false,
        description: 'Email status unclear',
        hasWarning: true,
        details: 'Unable to determine email completion status',
      };
    };

    const emailAnalysis = analyzeEmails();

    // All steps before beneficiary emails step (now includes PEP check)
    const allStepsBeforeBeneficiaryComplete =
      allStepsIncludingPepComplete && allDocumentsComplete;

    // Analyze advancement agreement status
    const analyzeAdvancementAgreement = () => {
      const allDocs = [
        ...(application.documents || []),
        ...(application.signed_documents || []),
      ];

      if (allDocs.length === 0) {
        return {
          completed: false,
          created: false,
          signed: false,
          description: 'No documents found in application',
          hasWarning: true,
        };
      }

      const loanAgreements = allDocs.filter(
        (doc) => doc.is_loan_agreement === true
      );

      if (loanAgreements.length === 0) {
        return {
          completed: false,
          created: false,
          signed: false,
          description: 'Advancement agreement not created yet',
          hasWarning: true,
          details: `Found ${allDocs.length} document(s) but no loan agreement`,
        };
      }

      const signedAgreements = loanAgreements.filter(
        (doc) => doc.is_signed === true
      );

      if (loanAgreements.length > 0 && signedAgreements.length === 0) {
        return {
          completed: false,
          created: true,
          signed: false,
          description: 'Advancement agreement created but not signed',
          hasWarning: true,
          details: `${loanAgreements.length} agreement(s) created, none signed`,
        };
      }

      if (
        signedAgreements.length > 0 &&
        signedAgreements.length < loanAgreements.length
      ) {
        return {
          completed: true,
          created: true,
          signed: true,
          description: 'Advancement agreement signed',
          hasWarning: true,
          details: `${signedAgreements.length} of ${loanAgreements.length} agreement(s) signed`,
        };
      }

      if (
        signedAgreements.length > 0 &&
        signedAgreements.length === loanAgreements.length
      ) {
        return {
          completed: true,
          created: true,
          signed: true,
          description: 'All advancement agreements signed',
          hasWarning: false,
          details: `${signedAgreements.length} agreement(s) fully executed`,
        };
      }

      return {
        completed: false,
        created: false,
        signed: false,
        description: 'Agreement status unclear',
        hasWarning: true,
      };
    };

    const agreementAnalysis = analyzeAdvancementAgreement();

    // All steps before advancement agreement step
    const allStepsBeforeAgreementComplete =
      allStepsBeforeBeneficiaryComplete && emailAnalysis.completed;

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
          ? 'Ready for solicitor confirmation - Click to proceed'
          : 'Available after completing previous steps',
        completed: processingStatusComplete,
        userAction: false,
        icon: '🤝',
        actionRequired:
          !processingStatusComplete &&
          submittedComplete &&
          solicitorAssigned &&
          estateValueComplete,
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
        id: 'ccr',
        title: 'Create and Review CCR File',
        description: ccrFileComplete
          ? 'CCR file uploaded and reviewed'
          : 'Upload and review CCR file',
        completed: ccrFileComplete,
        userAction: !ccrFileComplete && processingStatusComplete,
        icon: '📁',
        actionRequired: !ccrFileComplete && processingStatusComplete,
        isClickable: processingStatusComplete && !ccrFileComplete,
        isBlurred: !processingStatusComplete,
        isDisabled: ccrFileComplete,
      },
      // NEW: PEP Check Step
      {
        id: 'pep-check',
        title: 'PEP & Sanctions Check',
        description: pepCheckComplete
          ? (() => {
              const pepFile = internalFiles.find(
                (file) => file.is_pep_check === true
              );
              const isHighRisk =
                pepFile &&
                pepFile.description &&
                pepFile.description.includes('MATCH FOUND');
              return isHighRisk
                ? '⚠️ PEP check completed - REQUIRES REVIEW'
                : '✅ PEP check completed - Clear';
            })()
          : 'Run automated PEP & sanctions check',
        completed: pepCheckComplete,
        userAction: !pepCheckComplete && ccrFileComplete,
        icon: pepCheckComplete
          ? (() => {
              const pepFile = internalFiles.find(
                (file) => file.is_pep_check === true
              );
              const isHighRisk =
                pepFile &&
                pepFile.description &&
                pepFile.description.includes('MATCH FOUND');
              return isHighRisk ? '⚠️' : '✅';
            })()
          : '🔍',
        actionRequired: !pepCheckComplete && ccrFileComplete,
        isClickable: ccrFileComplete && !pepCheckComplete,
        isBlurred: !ccrFileComplete,
        isDisabled: pepCheckComplete,
        hasWarning:
          pepCheckComplete &&
          (() => {
            const pepFile = internalFiles.find(
              (file) => file.is_pep_check === true
            );
            return (
              pepFile &&
              pepFile.description &&
              pepFile.description.includes('MATCH FOUND')
            );
          })(),
      },
      {
        id: 'documents',
        title: 'Required Documents',
        description: allStepsIncludingPepComplete ? (
          allDocumentsComplete ? (
            'All documents submitted'
          ) : allMissingDocuments.length > 0 ? (
            <div>
              <div
                className='text-danger'
                style={{ fontSize: '0.85rem', marginBottom: '4px' }}
              >
                Agent: Ensure all requirements are added and documents created
              </div>
              <div>
                Missing:{' '}
                {allMissingDocuments
                  .filter((doc) => doc && doc.trim() !== '')
                  .join(', ')}
              </div>
            </div>
          ) : (
            'Documents pending'
          )
        ) : (
          'Available after completing all previous steps'
        ),
        completed: allDocumentsComplete,
        userAction: !allDocumentsComplete && allStepsIncludingPepComplete,
        icon: '📄',
        actionRequired: !allDocumentsComplete && allStepsIncludingPepComplete,
        isBlurred: !allStepsIncludingPepComplete,
        isDisabled: !allStepsIncludingPepComplete,
      },
      {
        id: 'beneficiary-emails',
        title: 'Document Delivery to Beneficiary',
        description: allStepsBeforeBeneficiaryComplete ? (
          emailAnalysis.completed ? (
            <div>
              <div
                style={{ marginBottom: emailAnalysis.hasWarning ? '4px' : '0' }}
              >
                {emailAnalysis.description}
              </div>
              {emailAnalysis.hasWarning && (
                <div className='text-warning' style={{ fontSize: '0.85rem' }}>
                  Warning: {emailAnalysis.details}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div
                className='text-danger'
                style={{ fontSize: '0.85rem', marginBottom: '4px' }}
              >
                Agent: Ensure all required documents are sent to the beneficiary
              </div>
              <div>{emailAnalysis.description}</div>
              {emailAnalysis.details && (
                <div
                  className='text-warning'
                  style={{ fontSize: '0.8rem', marginTop: '2px' }}
                >
                  {emailAnalysis.details}
                </div>
              )}
            </div>
          )
        ) : (
          'Available after completing all previous steps'
        ),
        completed: emailAnalysis.completed,
        userAction:
          !emailAnalysis.completed && allStepsBeforeBeneficiaryComplete,
        icon: '📤',
        actionRequired:
          !emailAnalysis.completed && allStepsBeforeBeneficiaryComplete,
        isBlurred: !allStepsBeforeBeneficiaryComplete,
        isDisabled: !allStepsBeforeBeneficiaryComplete,
        isClickable: false,
      },
      {
        id: 'advancement-agreement',
        title: 'Advancement Agreement',
        description: allStepsBeforeAgreementComplete ? (
          agreementAnalysis.completed ? (
            <div>
              <div
                style={{
                  marginBottom: agreementAnalysis.hasWarning ? '4px' : '0',
                }}
              >
                ✅ Created • {agreementAnalysis.signed ? '✅' : '❌'} Signed
              </div>
              <div
                style={{
                  marginBottom: agreementAnalysis.hasWarning ? '4px' : '0',
                }}
              >
                {agreementAnalysis.description}
              </div>
              {agreementAnalysis.hasWarning && (
                <div className='text-warning' style={{ fontSize: '0.85rem' }}>
                  Warning: {agreementAnalysis.details}
                </div>
              )}
              {agreementAnalysis.details && !agreementAnalysis.hasWarning && (
                <div className='text-warning' style={{ fontSize: '0.85rem' }}>
                  {agreementAnalysis.details}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '4px' }}>
                {agreementAnalysis.created ? '✅' : '❌'} Created •{' '}
                {agreementAnalysis.signed ? '✅' : '❌'} Signed
              </div>
              <div
                className='text-danger'
                style={{ fontSize: '0.85rem', marginBottom: '4px' }}
              >
                Agent: Create and ensure advancement agreement is signed
              </div>
              <div>{agreementAnalysis.description}</div>
              {agreementAnalysis.details && (
                <div
                  className='text-warning'
                  style={{ fontSize: '0.8rem', marginTop: '2px' }}
                >
                  {agreementAnalysis.details}
                </div>
              )}
            </div>
          )
        ) : (
          'Available after completing all previous steps'
        ),
        completed: agreementAnalysis.completed,
        userAction:
          !agreementAnalysis.completed && allStepsBeforeAgreementComplete,
        icon: '📋',
        actionRequired:
          !agreementAnalysis.completed && allStepsBeforeAgreementComplete,
        isBlurred: !allStepsBeforeAgreementComplete,
        isDisabled: !allStepsBeforeAgreementComplete,
        isClickable: false,
      },
    ];
  };

  const getStatusStep = () => ({
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
  });

  const handleConfirmProcessing = async (selectedMethod) => {
    try {
      const token = localStorage.getItem('token');
      const response = await postData(
        token,
        `/api/applications/agent_applications/${application.id}/processing-status/`,
        {
          application_details_completed_confirmed: true,
          solicitor_preferred_aml_method: selectedMethod,
        }
      );

      if (response && response.status >= 200 && response.status < 300) {
        setRefresh(!refresh);
      } else {
        throw new Error(
          response?.data?.error || 'Failed to create processing status'
        );
      }
    } catch (error) {
      console.error('Error confirming processing status:', error);
    }
  };

  const handleUploadCCR = async (file, title, description) => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('file', file);
      formData.append('application_id', application.id);
      formData.append('is_ccr', true);

      const endpoint = `/api/internal-files/application/${application.id}/`;
      const response = await uploadFile(endpoint, formData);

      if (response.status === 201) {
        setRefresh(!refresh);
        setShowCCRUploadModal(false);
      }
    } catch (error) {
      console.error('Error uploading CCR file:', error);
    }
  };

  // Handle PEP Check Modal
  const handleRunPepCheck = () => {
    setShowPEPCheckModal(true);
  };

  const handlePEPCheckAPICall = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = `/api/internal-files/pep-check/application/${application.id}/`;

      const response = await postData(token, endpoint, {});

      if (response && response.status >= 200 && response.status < 300) {
        setRefresh(!refresh);
        return response.data;
      } else {
        throw new Error(response?.data?.error || 'Failed to run PEP check');
      }
    } catch (error) {
      console.error('Error running PEP check:', error);
      throw error;
    }
  };

  // NOW WE CAN CHECK FOR REJECTION - AFTER ALL HOOKS
  if (application?.is_rejected) {
    return (
      <div
        className='bg-white rounded-4 p-4 mb-4'
        style={{
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Rejection Header */}
        <div className='text-center mb-4'>
          <div
            className='d-inline-flex align-items-center justify-content-center rounded-circle mb-3'
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
              color: 'white',
            }}
          >
            <svg width='40' height='40' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <h3 className='fw-bold text-danger mb-2'>Application Rejected</h3>
          <p className='text-muted mb-0' style={{ fontSize: '1.1rem' }}>
            This application has been rejected and no further processing is
            required
          </p>
        </div>

        {/* Rejection Details Card */}
        <div
          className='rounded-3 p-4 mb-4'
          style={{
            background: 'linear-gradient(135deg, #fef2f2 0%, #fef7f7 100%)',
            border: '1px solid #fecaca',
          }}
        >
          <div className='row g-4'>
            {/* Rejection Date */}
            <div className='col-md-6'>
              <div className='d-flex align-items-center gap-3'>
                <div
                  className='d-flex align-items-center justify-content-center rounded-2'
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                  }}
                >
                  <svg
                    width='24'
                    height='24'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div>
                  <h6 className='fw-bold mb-1 text-danger'>Rejected By</h6>
                  <p
                    className='mb-0 fw-semibold'
                    style={{ fontSize: '1.1rem' }}
                  >
                    {(() => {
                      const rejectedByMatch =
                        application.rejected_reason?.match(
                          /Rejected by: (.+)$/
                        );
                      return rejectedByMatch
                        ? rejectedByMatch[1]
                        : 'Not specified';
                    })()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rejection Reason */}
        <div
          className='rounded-3 p-4'
          style={{
            background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
            border: '1px solid #e5e7eb',
          }}
        >
          <div className='d-flex align-items-start gap-3'>
            <div
              className='d-flex align-items-center justify-content-center rounded-2 flex-shrink-0'
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#6b7280',
                color: 'white',
              }}
            >
              <svg
                width='24'
                height='24'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div className='flex-grow-1'>
              <h6 className='fw-bold mb-3' style={{ color: '#374151' }}>
                Rejection Reason
              </h6>
              <div
                className='p-3 rounded-2'
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  minHeight: '80px',
                }}
              >
                {application.rejected_reason ? (
                  <div style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                    {(() => {
                      const parts =
                        application.rejected_reason.split('\n\nRejected by:');
                      const mainReason = parts[0] || 'No reason provided';
                      return (
                        <p
                          className='mb-0'
                          style={{ fontSize: '1rem', color: '#374151' }}
                        >
                          {mainReason}
                        </p>
                      );
                    })()}
                  </div>
                ) : (
                  <p className='mb-0 text-muted fst-italic'>
                    No rejection reason provided
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className='text-center mt-4'>
          <div
            className='d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill'
            style={{
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              fontSize: '0.875rem',
            }}
          >
            <svg width='16' height='16' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                clipRule='evenodd'
              />
            </svg>
            No further action required for this application
          </div>
        </div>
      </div>
    );
  }

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
          <TimelineHeader
            incompleteSteps={incompleteSteps}
            refresh={refresh}
            setRefresh={setRefresh}
          />
          <AgentInstructionAlert incompleteSteps={incompleteSteps} />
          <div className='position-relative mb-3'>
            {userSteps.map((step, index) => (
              <TimelineStep
                key={step.id}
                step={step}
                index={index}
                userSteps={userSteps}
                application={application}
                showModal={setShowModal}
                showCCRUploadModal={setShowCCRUploadModal}
                onRunPepCheck={handleRunPepCheck}
              />
            ))}
          </div>
          <ReviewInfo statusStep={statusStep} />
          <ProgressSummary userSteps={userSteps} />
          <RejectionReason application={application} />
        </div>
      )}

      <ProcessingStatusModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        application={application}
        onConfirm={handleConfirmProcessing}
      />

      <CCRUploadModal
        isOpen={showCCRUploadModal}
        onClose={() => setShowCCRUploadModal(false)}
        onUpload={handleUploadCCR}
      />

      <PEPCheckModal
        isOpen={showPEPCheckModal}
        onClose={() => setShowPEPCheckModal(false)}
        onRunCheck={handlePEPCheckAPICall}
        application={application}
      />
    </div>
  );
};

export default ApplicationDetailStages;
