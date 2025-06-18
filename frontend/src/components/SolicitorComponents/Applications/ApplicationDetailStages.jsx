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
  const [internalFiles, setInternalFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

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
    const calculateCompletionStatus = () => {
      if (!application) return false;

      const steps = getTimelineSteps();

      const allTimelineStepsComplete = steps.every((step) => step.completed);

      return allTimelineStepsComplete;
    };

    const completionStatus = calculateCompletionStatus();

    setAllStagesCompleted(completionStatus);
  }, [application, internalFiles, currentRequirements, refresh]);

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

    const allPreviousStepsComplete =
      submittedComplete &&
      solicitorAssigned &&
      estateValueComplete &&
      processingStatusComplete &&
      ccrFileComplete;

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

    console.log(allMissingDocuments);

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
      {
        id: 'documents',
        title: 'Required Documents',
        description: allPreviousStepsComplete ? (
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
        userAction: !allDocumentsComplete && allPreviousStepsComplete,
        icon: '📄',
        actionRequired: !allDocumentsComplete && allPreviousStepsComplete,
        isBlurred: !allPreviousStepsComplete,
        isDisabled: !allPreviousStepsComplete,
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
    </div>
  );
};

export default ApplicationDetailStages;
