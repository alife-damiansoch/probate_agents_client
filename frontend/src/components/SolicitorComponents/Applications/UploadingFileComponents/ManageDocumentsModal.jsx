import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import LoadingComponent from '../../../GenericComponents/LoadingComponent.jsx';
import {
  fetchData,
  postData, // Changed from postPdfRequest to postData
} from '../../../GenericFunctions/AxiosGenericFunctions.jsx';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions.jsx';

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
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState(''); // Added success message state

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

  // Generate Undertaking Document
  const generateUndertakingHandler = async () => {
    if (hasUndertaking) return; // Block if already exists

    setIsGeneratingUndertaking(true);
    setErrors([]);
    setSuccessMessage(''); // Clear previous success message

    const requestData = {
      application_id: application.id,
      fee_agreed_for_undertaking: fee,
    };

    try {
      const response = await postData(
        // Changed from postPdfRequest to postData
        token,
        '/api/generate_undertaking_pdf/',
        requestData
      );

      if (response && response.status === 200 && response.data.success) {
        setSuccessMessage(
          response.data.message ||
            'Undertaking PDF generated and saved successfully'
        );
        setRefresh(!refresh); // Trigger refresh to update application data
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
    if (hasLoanAgreement) return; // Block if already exists

    setIsGeneratingAgreement(true);
    setErrors([]);
    setSuccessMessage(''); // Clear previous success message

    const requestData = {
      application_id: application.id,
      fee_agreed_for_undertaking: fee,
    };

    try {
      const response = await postData(
        // Changed from postPdfRequest to postData
        token,
        '/api/generate_advancement_agreement_pdf/',
        requestData
      );

      if (response && response.status === 200 && response.data.success) {
        setSuccessMessage(
          response.data.message ||
            'Advancement Agreement PDFs generated and saved successfully'
        );
        setRefresh(!refresh); // Trigger refresh to update application data
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
                <h4 className='mb-0 fw-bold'>Document Generator</h4>
                <p className='mb-0 opacity-75 small'>
                  Generate and manage legal documents for this application
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
                    <div
                      className='mb-4 p-4 rounded-4 d-flex align-items-start gap-3'
                      style={{
                        backgroundColor: '#f0fdf4',
                        border: '2px solid #bbf7d0',
                      }}
                    >
                      <div
                        className='d-flex align-items-center justify-content-center rounded-3 flex-shrink-0'
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#16a34a',
                          color: 'white',
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
                      </div>
                      <div>
                        <h6
                          className='mb-2 fw-bold'
                          style={{ color: '#16a34a' }}
                        >
                          Success!
                        </h6>
                        <div style={{ color: '#16a34a', fontSize: '0.875rem' }}>
                          {successMessage}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Initial Documents Section */}
                  <div className='mb-5'>
                    <div className='d-flex align-items-center gap-3 mb-4'>
                      <div
                        className='d-flex align-items-center justify-content-center rounded-3'
                        style={{
                          width: '40px',
                          height: '40px',
                          background:
                            'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          color: 'white',
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
                            d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <div>
                        <h5
                          className='mb-0 fw-bold'
                          style={{ color: '#1e293b' }}
                        >
                          Initial Documents
                        </h5>
                        <p className='mb-0 text-muted small'>
                          Documents required to start the process
                        </p>
                      </div>
                    </div>

                    <div className='row g-3'>
                      {/* Solicitor Undertaking Card */}
                      <div className='col-lg-4 col-md-6'>
                        <div
                          className={`p-3 rounded-4 h-100 position-relative overflow-hidden transition-all ${
                            hasUndertaking ? 'opacity-50' : ''
                          }`}
                          style={{
                            background: hasUndertaking
                              ? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
                              : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                            border: hasUndertaking
                              ? '2px solid #d1d5db'
                              : '2px solid #f59e0b',
                            cursor: hasUndertaking ? 'not-allowed' : 'pointer',
                            filter: hasUndertaking ? 'grayscale(0.3)' : 'none',
                            transform: hasUndertaking
                              ? 'scale(0.98)'
                              : 'scale(1)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        >
                          {/* Existing Document Badge */}
                          {hasUndertaking && (
                            <div
                              className='position-absolute top-0 end-0 m-2'
                              style={{ zIndex: 10 }}
                            >
                              <div
                                className='d-flex align-items-center gap-1 px-2 py-1 rounded-pill'
                                style={{
                                  background:
                                    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                  color: 'white',
                                  fontSize: '0.7rem',
                                  fontWeight: '600',
                                  backdropFilter: 'blur(8px)',
                                  boxShadow:
                                    '0 4px 12px rgba(16, 185, 129, 0.3)',
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
                                EXISTS
                              </div>
                            </div>
                          )}

                          <div className='d-flex align-items-center gap-2 mb-2'>
                            <div
                              className='d-flex align-items-center justify-content-center rounded-2'
                              style={{
                                width: '32px',
                                height: '32px',
                                backgroundColor: hasUndertaking
                                  ? '#9ca3af'
                                  : '#f59e0b',
                                color: 'white',
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
                                  d='M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.94l1-4H9.03z'
                                  clipRule='evenodd'
                                />
                              </svg>
                            </div>
                            <div>
                              <h6
                                className='mb-0 fw-bold small'
                                style={{
                                  color: hasUndertaking ? '#6b7280' : '#92400e',
                                }}
                              >
                                Solicitor Undertaking
                              </h6>
                              <p
                                className='mb-0 text-muted'
                                style={{ fontSize: '0.7rem' }}
                              >
                                {hasUndertaking
                                  ? 'Document already exists'
                                  : 'Legal commitment document'}
                              </p>
                            </div>
                          </div>

                          {/* Glassmorphic overlay for blocked state */}
                          {hasUndertaking && (
                            <div
                              className='position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
                              style={{
                                background: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(2px)',
                                borderRadius: '16px',
                                zIndex: 5,
                              }}
                            >
                              <div className='text-center'>
                                <div
                                  className='d-flex align-items-center justify-content-center rounded-3 mx-auto mb-2'
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    background:
                                      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
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
                                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                      clipRule='evenodd'
                                    />
                                  </svg>
                                </div>
                                <p
                                  className='mb-0 fw-bold'
                                  style={{
                                    fontSize: '0.7rem',
                                    color: '#059669',
                                  }}
                                >
                                  Already Generated
                                </p>
                              </div>
                            </div>
                          )}

                          <button
                            className='btn btn-sm w-100 fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2'
                            style={{
                              background: hasUndertaking
                                ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                                : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              fontSize: '0.8rem',
                              cursor: hasUndertaking
                                ? 'not-allowed'
                                : 'pointer',
                              opacity: hasUndertaking ? 0.6 : 1,
                            }}
                            onClick={generateUndertakingHandler}
                            disabled={isGeneratingUndertaking || hasUndertaking}
                          >
                            {hasUndertaking ? (
                              <>
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
                                Already Exists
                              </>
                            ) : isGeneratingUndertaking ? (
                              <>
                                <div
                                  className='spinner-border spinner-border-sm'
                                  style={{ width: '12px', height: '12px' }}
                                />
                                Generating...
                              </>
                            ) : (
                              <>
                                <svg
                                  width='12'
                                  height='12'
                                  fill='currentColor'
                                  viewBox='0 0 20 20'
                                >
                                  <path
                                    fillRule='evenodd'
                                    d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
                                    clipRule='evenodd'
                                  />
                                </svg>
                                Generate
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Placeholder for future initial documents */}
                      <div className='col-lg-4 col-md-6'>
                        <div
                          className='p-3 rounded-4 h-100 d-flex align-items-center justify-content-center'
                          style={{
                            background:
                              'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                            border: '2px dashed #cbd5e1',
                            minHeight: '120px',
                          }}
                        >
                          <div className='text-center'>
                            <svg
                              width='24'
                              height='24'
                              fill='#94a3b8'
                              viewBox='0 0 20 20'
                              className='mb-2'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <p className='mb-0 text-muted small'>
                              More documents coming soon
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Final Documents Section */}
                  <div>
                    <div className='d-flex align-items-center gap-3 mb-4'>
                      <div
                        className='d-flex align-items-center justify-content-center rounded-3'
                        style={{
                          width: '40px',
                          height: '40px',
                          background:
                            'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
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
                            d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <div>
                        <h5
                          className='mb-0 fw-bold'
                          style={{ color: '#1e293b' }}
                        >
                          Final Documents
                        </h5>
                        <p className='mb-0 text-muted small'>
                          Completion and finalization documents
                        </p>
                      </div>
                    </div>

                    <div className='row g-3'>
                      {/* Advancement Agreement Card */}
                      <div className='col-lg-4 col-md-6'>
                        <div
                          className={`p-3 rounded-4 h-100 position-relative overflow-hidden transition-all ${
                            hasLoanAgreement ? 'opacity-50' : ''
                          }`}
                          style={{
                            background: hasLoanAgreement
                              ? 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
                              : 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                            border: hasLoanAgreement
                              ? '2px solid #d1d5db'
                              : '2px solid #10b981',
                            cursor: hasLoanAgreement
                              ? 'not-allowed'
                              : 'pointer',
                            filter: hasLoanAgreement
                              ? 'grayscale(0.3)'
                              : 'none',
                            transform: hasLoanAgreement
                              ? 'scale(0.98)'
                              : 'scale(1)',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          }}
                        >
                          {/* Existing Document Badge */}
                          {hasLoanAgreement && (
                            <div
                              className='position-absolute top-0 end-0 m-2'
                              style={{ zIndex: 10 }}
                            >
                              <div
                                className='d-flex align-items-center gap-1 px-2 py-1 rounded-pill'
                                style={{
                                  background:
                                    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                  color: 'white',
                                  fontSize: '0.7rem',
                                  fontWeight: '600',
                                  backdropFilter: 'blur(8px)',
                                  boxShadow:
                                    '0 4px 12px rgba(16, 185, 129, 0.3)',
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
                                EXISTS
                              </div>
                            </div>
                          )}

                          <div className='d-flex align-items-center gap-2 mb-2'>
                            <div
                              className='d-flex align-items-center justify-content-center rounded-2'
                              style={{
                                width: '32px',
                                height: '32px',
                                backgroundColor: hasLoanAgreement
                                  ? '#9ca3af'
                                  : '#10b981',
                                color: 'white',
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
                                  d='M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z'
                                  clipRule='evenodd'
                                />
                              </svg>
                            </div>
                            <div>
                              <h6
                                className='mb-0 fw-bold small'
                                style={{
                                  color: hasLoanAgreement
                                    ? '#6b7280'
                                    : '#047857',
                                }}
                              >
                                Advancement Agreement
                              </h6>
                              <p
                                className='mb-0 text-muted'
                                style={{ fontSize: '0.7rem' }}
                              >
                                {hasLoanAgreement
                                  ? 'Document already exists'
                                  : 'Financial agreement document'}
                              </p>
                            </div>
                          </div>

                          {/* Glassmorphic overlay for blocked state */}
                          {hasLoanAgreement && (
                            <div
                              className='position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
                              style={{
                                background: 'rgba(255, 255, 255, 0.8)',
                                backdropFilter: 'blur(2px)',
                                borderRadius: '16px',
                                zIndex: 5,
                              }}
                            >
                              <div className='text-center'>
                                <div
                                  className='d-flex align-items-center justify-content-center rounded-3 mx-auto mb-2'
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    background:
                                      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                    color: 'white',
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
                                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                      clipRule='evenodd'
                                    />
                                  </svg>
                                </div>
                                <p
                                  className='mb-0 fw-bold'
                                  style={{
                                    fontSize: '0.7rem',
                                    color: '#059669',
                                  }}
                                >
                                  Already Generated
                                </p>
                              </div>
                            </div>
                          )}

                          <button
                            className='btn btn-sm w-100 fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2'
                            style={{
                              background: hasLoanAgreement
                                ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              color: 'white',
                              border: 'none',
                              padding: '8px 12px',
                              fontSize: '0.8rem',
                              cursor: hasLoanAgreement
                                ? 'not-allowed'
                                : 'pointer',
                              opacity: hasLoanAgreement ? 0.6 : 1,
                            }}
                            onClick={generateAdvancementAgreementHandler}
                            disabled={isGeneratingAgreement || hasLoanAgreement}
                          >
                            {hasLoanAgreement ? (
                              <>
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
                                Already Exists
                              </>
                            ) : isGeneratingAgreement ? (
                              <>
                                <div
                                  className='spinner-border spinner-border-sm'
                                  style={{ width: '12px', height: '12px' }}
                                />
                                Generating...
                              </>
                            ) : (
                              <>
                                <svg
                                  width='12'
                                  height='12'
                                  fill='currentColor'
                                  viewBox='0 0 20 20'
                                >
                                  <path
                                    fillRule='evenodd'
                                    d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
                                    clipRule='evenodd'
                                  />
                                </svg>
                                Generate
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Placeholder for future final documents */}
                      <div className='col-lg-4 col-md-6'>
                        <div
                          className='p-3 rounded-4 h-100 d-flex align-items-center justify-content-center'
                          style={{
                            background:
                              'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                            border: '2px dashed #cbd5e1',
                            minHeight: '120px',
                          }}
                        >
                          <div className='text-center'>
                            <svg
                              width='24'
                              height='24'
                              fill='#94a3b8'
                              viewBox='0 0 20 20'
                              className='mb-2'
                            >
                              <path
                                fillRule='evenodd'
                                d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                                clipRule='evenodd'
                              />
                            </svg>
                            <p className='mb-0 text-muted small'>
                              More documents coming soon
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Error Messages */}
                  {errors.length > 0 && (
                    <div
                      className='mt-4 p-4 rounded-4 d-flex align-items-start gap-3'
                      style={{
                        backgroundColor: '#fef2f2',
                        border: '2px solid #fecaca',
                      }}
                    >
                      <div
                        className='d-flex align-items-center justify-content-center rounded-3 flex-shrink-0'
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#dc2626',
                          color: 'white',
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
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <div>
                        <h6
                          className='mb-2 fw-bold'
                          style={{ color: '#dc2626' }}
                        >
                          Generation Error
                        </h6>
                        <div style={{ color: '#dc2626', fontSize: '0.875rem' }}>
                          {renderErrors(errors)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Application Summary Sidebar */}
                <div className='col-xl-3 col-lg-4'>
                  <div
                    className='p-4 rounded-4 h-100 position-sticky'
                    style={{
                      background:
                        'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
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
                        <svg
                          width='20'
                          height='20'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
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
                        <span className='text-muted small'>
                          Application ID:
                        </span>
                        <span className='fw-semibold small'>
                          #{application.id}
                        </span>
                      </div>
                      <div className='d-flex justify-content-between align-items-center py-2 border-bottom border-light'>
                        <span className='text-muted small'>Amount:</span>
                        <span className='fw-semibold small text-success'>
                          €{application.amount?.toLocaleString()}
                        </span>
                      </div>
                      <div className='d-flex justify-content-between align-items-center py-2 border-bottom border-light'>
                        <span className='text-muted small'>Term:</span>
                        <span className='fw-semibold small'>
                          {application.term} months
                        </span>
                      </div>
                      <div className='d-flex justify-content-between align-items-center py-2 border-bottom border-light'>
                        <span className='text-muted small'>
                          Calculated Fee:
                        </span>
                        <span className='fw-semibold small text-primary'>
                          €{fee.toLocaleString()}
                        </span>
                      </div>

                      {application.applicants &&
                        application.applicants.length > 0 && (
                          <div className='mt-4'>
                            <h6
                              className='fw-bold mb-3'
                              style={{ color: '#0369a1' }}
                            >
                              Applicants
                            </h6>
                            {application.applicants.map((applicant, index) => (
                              <div
                                key={index}
                                className='mb-2 p-2 rounded-3'
                                style={{
                                  backgroundColor: 'rgba(14, 165, 233, 0.1)',
                                }}
                              >
                                <p className='mb-0 small fw-semibold'>
                                  {applicant.first_name} {applicant.last_name}
                                </p>
                                <p
                                  className='mb-0 text-muted'
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  {applicant.email}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                      {application.deceased && (
                        <div className='mt-4'>
                          <h6
                            className='fw-bold mb-3'
                            style={{ color: '#0369a1' }}
                          >
                            Deceased
                          </h6>
                          <div
                            className='p-2 rounded-3'
                            style={{
                              backgroundColor: 'rgba(14, 165, 233, 0.1)',
                            }}
                          >
                            <p className='mb-0 small fw-semibold'>
                              {application.deceased.first_name}{' '}
                              {application.deceased.last_name}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      className='mt-4 p-3 rounded-3 text-center'
                      style={{
                        backgroundColor: 'rgba(14, 165, 233, 0.1)',
                        border: '1px solid rgba(14, 165, 233, 0.2)',
                      }}
                    >
                      <small className='text-muted'>
                        Fee calculated at 15% per annum
                      </small>
                    </div>

                    {/* Document Status Summary */}
                    {(hasUndertaking || hasLoanAgreement) && (
                      <div className='mt-4'>
                        <h6
                          className='fw-bold mb-3'
                          style={{ color: '#0369a1' }}
                        >
                          Document Status
                        </h6>
                        <div className='space-y-2'>
                          {hasUndertaking && (
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
                              <span
                                className='small fw-semibold'
                                style={{ color: '#047857' }}
                              >
                                Undertaking Generated
                              </span>
                            </div>
                          )}
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
                              <span
                                className='small fw-semibold'
                                style={{ color: '#047857' }}
                              >
                                Agreement Generated
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
