import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import {
  deleteData,
  fetchData,
  postData,
} from '../../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';
import ManualDocumentUploadModal from './ManageDocumentModalParts/ManualDocumentUploadModal';

// Import the new smaller components
import AlertMessage from './ManageDocumentModalParts/AlertMessage';
import ApplicationSummarySidebar from './ManageDocumentModalParts/ApplicationSummarySidebar';
import DocumentRequirementsSection from './ManageDocumentModalParts/DocumentRequirementsSection';
import TemplateDocumentsSection from './ManageDocumentModalParts/TemplateDocumentsSection';

const ManageDocumentsModal = ({
  isOpen,
  onClose,
  applicationId,
  refresh,
  setRefresh,
  existingDocuments = [],
}) => {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fee, setFee] = useState(0);
  const [feeCounted, setFeeCounted] = useState(false);
  const [isGeneratingUndertaking, setIsGeneratingUndertaking] = useState(false);
  const [isGeneratingAgreement, setIsGeneratingAgreement] = useState(false);
  const [isGeneratingTermsOfBusiness, setIsGeneratingTermsOfBusiness] =
    useState(false);
  const [isGeneratingSECCI, setIsGeneratingSECCI] = useState(false);

  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  // New state for document requirements
  const [availableDocumentTypes, setAvailableDocumentTypes] = useState([]);
  const [currentRequirements, setCurrentRequirements] = useState([]);
  const [loadingRequirements, setLoadingRequirements] = useState(false);
  const [addingRequirement, setAddingRequirement] = useState(null);
  const [removingRequirement, setRemovingRequirement] = useState(null);

  const [showManualUploadModal, setShowManualUploadModal] = useState(false);

  // Get token
  let tokenObj = Cookies.get('auth_token_agents');
  let token = null;
  if (tokenObj) {
    tokenObj = JSON.parse(tokenObj);
    token = tokenObj.access;
  }

  console.log('Existing Documents:', existingDocuments);

  // Check if documents already exist
  const hasUndertaking = existingDocuments.some(
    (doc) => doc.is_undertaking === true
  );
  const hasLoanAgreement = existingDocuments.some(
    (doc) => doc.is_loan_agreement === true
  );
  // Add this check with your existing document checks
  const hasTermsOfBusiness = existingDocuments.some(
    (doc) => doc.is_terms_of_business === true
  );
  const hasSECCI = existingDocuments.some((doc) => doc.is_secci === true);

  // Fetch application data when modal opens
  useEffect(() => {
    const fetchApplication = async () => {
      if (token && applicationId && isOpen) {
        setLoading(true);
        try {
          const endpoint = `/api/applications/agent_applications/${applicationId}/`;
          const response = await fetchData(token, endpoint);
          setApplication(response.data);
          console.log('Application data:', response.data);
        } catch (error) {
          console.error('Error fetching application:', error);
          setErrors(['Failed to fetch application data']);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchApplication();
  }, [token, applicationId, isOpen]);

  // Fetch available document types and current requirements
  useEffect(() => {
    const fetchDocumentData = async () => {
      if (token && applicationId && isOpen) {
        setLoadingRequirements(true);
        try {
          // Fetch available document types
          const typesResponse = await fetchData(token, '/api/document-types/');
          setAvailableDocumentTypes(typesResponse.data);

          // Fetch current requirements for this application
          const requirementsResponse = await fetchData(
            token,
            `/api/applications/${applicationId}/document-requirements/`
          );
          setCurrentRequirements(requirementsResponse.data);

          console.log('Available Document Types:', typesResponse.data);
          console.log('Current Requirements:', requirementsResponse.data);
        } catch (error) {
          console.error('Error fetching document data:', error);
          setErrors((prev) => [
            ...prev,
            'Failed to fetch document requirements',
          ]);
        } finally {
          setLoadingRequirements(false);
        }
      }
    };

    fetchDocumentData();
  }, [token, applicationId, isOpen, refresh]);

  // Calculate fee when application is loaded
  useEffect(() => {
    if (application) {
      let yearMultiplier = Math.ceil(application.term / 12);
      const calculatedFee =
        Math.round(application.amount * 0.15 * yearMultiplier * 100) / 100;
      setFee(calculatedFee);
      setFeeCounted(true);
    }
  }, [application]);

  // Add document requirement
  const addDocumentRequirement = async (documentTypeId) => {
    setAddingRequirement(documentTypeId);
    setErrors([]);
    setSuccessMessage('');

    try {
      const response = await postData(
        token,
        `/api/applications/${applicationId}/document-requirements/add/`,
        { document_type_id: documentTypeId }
      );

      if (response && response.status === 201) {
        setSuccessMessage(
          response.data.message || 'Document requirement added successfully'
        );

        // Refresh requirements
        const requirementsResponse = await fetchData(
          token,
          `/api/applications/${applicationId}/document-requirements/`
        );
        setCurrentRequirements(requirementsResponse.data);
        setRefresh(!refresh);
      } else {
        setErrors(['Failed to add document requirement']);
      }
    } catch (error) {
      console.error('Error adding document requirement:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrors([error.response.data.error]);
      } else {
        setErrors(['An error occurred while adding the document requirement']);
      }
    } finally {
      setAddingRequirement(null);
    }
  };

  // Remove document requirement
  const removeDocumentRequirement = async (documentTypeId) => {
    setRemovingRequirement(documentTypeId);
    setErrors([]);
    setSuccessMessage('');

    try {
      const response = await deleteData(
        `/api/applications/${applicationId}/document-requirements/${documentTypeId}/remove/`
      );

      if (response && (response.status === 200 || response.status === 204)) {
        setSuccessMessage('Document requirement removed successfully');

        // Refresh requirements
        const requirementsResponse = await fetchData(
          token,
          `/api/applications/${applicationId}/document-requirements/`
        );
        setCurrentRequirements(requirementsResponse.data);
        setRefresh(!refresh);
      } else {
        setErrors(['Failed to remove document requirement']);
      }
    } catch (error) {
      console.error('Error removing document requirement:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrors([error.response.data.error]);
      } else {
        setErrors([
          'An error occurred while removing the document requirement',
        ]);
      }
    } finally {
      setRemovingRequirement(null);
    }
  };

  // Generate Undertaking Document
  const generateUndertakingHandler = async () => {
    if (hasUndertaking) return;

    setIsGeneratingUndertaking(true);
    setErrors([]);
    setSuccessMessage('');

    const requestData = {
      application_id: application.id,
      fee_agreed_for_undertaking: fee,
    };

    try {
      const response = await postData(
        token,
        '/api/generate_undertaking_pdf/',
        requestData
      );

      if (response && response.status === 200 && response.data.success) {
        setSuccessMessage(
          response.data.message ||
            'Undertaking PDF generated and saved successfully'
        );
        setRefresh(!refresh);
      } else {
        setErrors(['Failed to generate undertaking document']);
      }
    } catch (error) {
      console.error('Error generating undertaking:', error);
      setErrors([
        'An error occurred while generating the undertaking document',
      ]);
    } finally {
      setIsGeneratingUndertaking(false);
    }
  };

  // Generate Advancement Agreement Document
  const generateAdvancementAgreementHandler = async () => {
    if (hasLoanAgreement) return;

    setIsGeneratingAgreement(true);
    setErrors([]);
    setSuccessMessage('');

    const requestData = {
      application_id: application.id,
      fee_agreed_for_undertaking: fee,
    };

    try {
      const response = await postData(
        token,
        '/api/generate_advancement_agreement_pdf/',
        requestData
      );

      if (response && response.status === 200 && response.data.success) {
        setSuccessMessage(
          response.data.message ||
            'Advancement Agreement PDFs generated and saved successfully'
        );
        setRefresh(!refresh);
      } else {
        setErrors(['Failed to generate advancement agreement document']);
      }
    } catch (error) {
      console.error('Error generating advancement agreement:', error);
      setErrors([
        'An error occurred while generating the advancement agreement document',
      ]);
    } finally {
      setIsGeneratingAgreement(false);
    }
  };

  // Generate Terms of Business Document
  const generateTermsOfBusinessHandler = async () => {
    if (hasTermsOfBusiness) return; // This prevents generation if already exists

    setIsGeneratingTermsOfBusiness(true);
    setErrors([]);
    setSuccessMessage('');

    const requestData = {
      application_id: application.id,
    };

    try {
      const response = await postData(
        token,
        '/api/generate_terms_of_business_pdf/',
        requestData
      );

      if (response && response.status === 200 && response.data.success) {
        setSuccessMessage(
          response.data.message ||
            'Terms of Business PDF generated and saved successfully'
        );
        setRefresh(!refresh);
      } else {
        setErrors(['Failed to generate Terms of Business document']);
      }
    } catch (error) {
      console.error('Error generating Terms of Business:', error);
      setErrors([
        'An error occurred while generating the Terms of Business document',
      ]);
    } finally {
      setIsGeneratingTermsOfBusiness(false);
    }
  };

  const generateSECCIHandler = async () => {
    if (hasSECCI) return;

    setIsGeneratingSECCI(true);
    setErrors([]);
    setSuccessMessage('');

    const requestData = {
      application_id: application.id,
      fee_agreed_for_undertaking: fee,
    };

    try {
      const response = await postData(
        token,
        '/api/generate_secci_pdf/',
        requestData
      );

      if (response && response.status === 200 && response.data.success) {
        setSuccessMessage(
          response.data.message ||
            'SECCI Form PDF generated and saved successfully'
        );
        setRefresh(!refresh);
      } else {
        setErrors(['Failed to generate SECCI Form document']);
      }
    } catch (error) {
      console.error('Error generating SECCI Form:', error);
      setErrors(['An error occurred while generating the SECCI Form document']);
    } finally {
      setIsGeneratingSECCI(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className='modal fade show d-block'
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(12px)',
        zIndex: 1060,
      }}
      tabIndex='-1'
      role='dialog'
    >
      <div
        className='modal-dialog modal-dialog-centered'
        role='document'
        style={{
          maxWidth: '95vw',
          width: '95vw',
          height: '95vh',
          margin: '2.5vh auto',
        }}
      >
        <div
          className='modal-content border-0 shadow-lg h-100 d-flex flex-column'
          style={{
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          }}
        >
          {/* Modal Header */}
          <div
            className='modal-header border-0 px-5 py-4 flex-shrink-0'
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              color: 'white',
              borderRadius: '24px 24px 0 0',
            }}
          >
            <div className='d-flex align-items-center gap-3'>
              <div
                className='d-flex align-items-center justify-content-center'
                style={{
                  width: '48px',
                  height: '48px',
                  background:
                    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '16px',
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
                    d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div>
                <h4 className='mb-0 fw-bold'>Document Manager</h4>
                <p className='mb-0 opacity-75 small'>
                  Generate and manage document requirements for this application
                </p>
              </div>
            </div>
            <button
              type='button'
              className='btn-close'
              onClick={onClose}
              style={{
                filter: 'brightness(0) invert(1)',
                opacity: 0.8,
                padding: '12px',
              }}
            />
          </div>

          {/* Modal Body */}
          <div className='modal-body p-5 flex-grow-1 overflow-auto'>
            {loading ? (
              <div className='d-flex align-items-center justify-content-center h-100'>
                <div className='text-center'>
                  <LoadingComponent />
                  <p className='mt-3 text-muted'>Loading application data...</p>
                </div>
              </div>
            ) : application ? (
              <div className='row h-100'>
                {/* Main Content Area */}
                <div className='col-xl-9 col-lg-8 mb-4'>
                  {/* Success Message */}
                  {successMessage && (
                    <AlertMessage
                      type='success'
                      title='Success!'
                      message={successMessage}
                    />
                  )}

                  {/* Document Requirements Section */}
                  <DocumentRequirementsSection
                    availableDocumentTypes={availableDocumentTypes}
                    currentRequirements={currentRequirements}
                    loadingRequirements={loadingRequirements}
                    addingRequirement={addingRequirement}
                    removingRequirement={removingRequirement}
                    onAddRequirement={addDocumentRequirement}
                    onRemoveRequirement={removeDocumentRequirement}
                  />

                  {/* Template Documents Section */}
                  <TemplateDocumentsSection
                    hasUndertaking={hasUndertaking}
                    hasLoanAgreement={hasLoanAgreement}
                    hasTermsOfBusiness={hasTermsOfBusiness}
                    hasSECCI={hasSECCI}
                    isGeneratingUndertaking={isGeneratingUndertaking}
                    isGeneratingAgreement={isGeneratingAgreement}
                    isGeneratingTermsOfBusiness={isGeneratingTermsOfBusiness}
                    isGeneratingSECCI={isGeneratingSECCI}
                    onGenerateUndertaking={generateUndertakingHandler}
                    onGenerateAgreement={generateAdvancementAgreementHandler}
                    onGenerateTermsOfBusiness={generateTermsOfBusinessHandler}
                    onGenerateSECCI={generateSECCIHandler}
                  />

                  {/* Manual Upload Section */}
                  <div className='mb-4'>
                    <div
                      className='card border-0 shadow-sm'
                      style={{
                        borderRadius: '20px',
                        background:
                          'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        border: '2px solid #e2e8f0',
                      }}
                    >
                      <div
                        className='card-header border-0 pb-0'
                        style={{ background: 'transparent' }}
                      >
                        <div className='d-flex align-items-center gap-3'>
                          <div
                            className='d-flex align-items-center justify-content-center'
                            style={{
                              width: '48px',
                              height: '48px',
                              background:
                                'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                              borderRadius: '16px',
                              color: 'white',
                            }}
                          >
                            <svg
                              width='24'
                              height='24'
                              fill='currentColor'
                              viewBox='0 0 24 24'
                            >
                              <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z' />
                              <polyline points='14,2 14,8 20,8' />
                              <line x1='16' y1='13' x2='8' y2='13' />
                              <line x1='16' y1='17' x2='8' y2='17' />
                              <polyline points='10,9 9,9 8,9' />
                            </svg>
                          </div>
                          <div>
                            <h5
                              className='mb-1 fw-bold'
                              style={{ color: '#1e293b' }}
                            >
                              Manual Document Upload
                            </h5>
                            <p className='mb-0 text-muted small'>
                              Upload pre-signed or wet ink signed documents
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className='card-body pt-3'>
                        <div className='row align-items-center'>
                          <div className='col-md-8'>
                            <p className='mb-0 text-muted small lh-base'>
                              Use this feature when documents have been
                              physically signed outside the system, or when
                              digital signing is not preferred by the signatory.
                            </p>
                          </div>
                          <div className='col-md-4 text-md-end mt-3 mt-md-0'>
                            <button
                              className='btn fw-semibold px-4 py-2'
                              style={{
                                background:
                                  'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '16px',
                                boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                                transition: 'all 0.3s ease',
                              }}
                              onClick={() => setShowManualUploadModal(true)}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow =
                                  '0 12px 40px rgba(139, 92, 246, 0.4)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow =
                                  '0 8px 32px rgba(139, 92, 246, 0.3)';
                              }}
                            >
                              <div className='d-flex align-items-center gap-2'>
                                <svg
                                  width='20'
                                  height='20'
                                  fill='currentColor'
                                  viewBox='0 0 24 24'
                                >
                                  <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z' />
                                  <polyline points='14,2 14,8 20,8' />
                                  <line x1='12' y1='18' x2='12' y2='12' />
                                  <line x1='9' y1='15' x2='15' y2='15' />
                                </svg>
                                Upload Document
                              </div>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Manual Upload Modal */}
                  <ManualDocumentUploadModal
                    isOpen={showManualUploadModal}
                    onClose={() => setShowManualUploadModal(false)}
                    applicationId={applicationId}
                    onSuccess={() => {
                      setSuccessMessage('Document uploaded successfully');
                      setRefresh(!refresh);
                    }}
                  />

                  {/* Error Messages */}
                  {errors.length > 0 && (
                    <AlertMessage
                      type='error'
                      title='Error'
                      message={renderErrors(errors)}
                    />
                  )}
                </div>

                {/* Application Summary Sidebar */}
                <ApplicationSummarySidebar
                  application={application}
                  fee={fee}
                  currentRequirements={currentRequirements}
                  hasUndertaking={hasUndertaking}
                  hasLoanAgreement={hasLoanAgreement}
                  hasTermsOfBusiness={hasTermsOfBusiness}
                  hasSECCI={hasSECCI}
                />
              </div>
            ) : (
              <div className='d-flex align-items-center justify-content-center h-100'>
                <div className='text-center'>
                  <div
                    className='d-flex align-items-center justify-content-center rounded-4 mx-auto mb-4'
                    style={{
                      width: '80px',
                      height: '80px',
                      backgroundColor: '#fef2f2',
                      border: '2px solid #fecaca',
                    }}
                  >
                    <svg
                      width='40'
                      height='40'
                      fill='#dc2626'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <h5 className='fw-bold mb-3' style={{ color: '#dc2626' }}>
                    Failed to Load Application
                  </h5>
                  <p className='text-muted'>
                    Unable to fetch application data. Please try again.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div
            className='modal-footer border-0 px-5 py-4 flex-shrink-0'
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderRadius: '0 0 24px 24px',
            }}
          >
            <button
              type='button'
              className='btn px-4 py-2 fw-semibold rounded-3'
              style={{
                backgroundColor: '#e2e8f0',
                color: '#475569',
                border: 'none',
              }}
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageDocumentsModal;
