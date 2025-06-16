import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../../GenericComponents/DeleteConfirm/ConfirmModal.jsx';
import { useConfirmation } from '../../../GenericComponents/DeleteConfirm/UseConfirmationHook.jsx';
import LoadingComponent from '../../../GenericComponents/LoadingComponent.jsx';
import Tooltip from '../../../GenericComponents/Tooltip.jsx';
import {
  deleteData,
  downloadFileAxios,
  fetchData,
} from '../../../GenericFunctions/AxiosGenericFunctions.jsx';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions.jsx';
import ManageDocumentsButton from './ManageDocumentsButton.jsx';
import ManageDocumentsModal from './ManageDocumentsModal.jsx';

const DocumentsUpload = ({
  applicationId,
  refresh,
  setRefresh,
  user,
  currentRequirements,
  setCurrentRequirements,
}) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  // Document requirements state (moved from modal)
  const [availableDocumentTypes, setAvailableDocumentTypes] = useState([]);

  const [loadingRequirements, setLoadingRequirements] = useState(false);

  // Tooltip state
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [currentHoveredDocId, setCurrentHoveredDocId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user && user.is_superuser) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  const { confirmState, requestConfirmation, handleConfirm } =
    useConfirmation();

  let tokenObj = Cookies.get('auth_token_agents');
  let token = null;
  if (tokenObj) {
    tokenObj = JSON.parse(tokenObj);
    token = tokenObj.access;
  }

  const navigate = useNavigate();

  // Fetch documents
  React.useEffect(() => {
    setLoading(true);
    const fetchDocuments = async () => {
      if (token && applicationId) {
        try {
          const endpoint = `/api/applications/agent_applications/document_file/${applicationId}/`;
          const response = await fetchData(token, endpoint);
          setDocuments(response.data);
        } catch (error) {
          console.error('Error fetching documents:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDocuments();
  }, [applicationId, token, refresh]);

  // Fetch document requirements and types (moved from modal)
  useEffect(() => {
    const fetchDocumentData = async () => {
      if (token && applicationId) {
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
          setErrorMessage((prev) => [
            ...(prev || []),
            'Failed to fetch document requirements',
          ]);
        } finally {
          setLoadingRequirements(false);
        }
      }
    };

    fetchDocumentData();
  }, [token, applicationId, refresh, setCurrentRequirements]);

  const downloadFile = async (fileUrl) => {
    const fileName = fileUrl.split('/').pop();
    try {
      const endpoint = `/api/applications/agent_applications/document_file/download/${fileName}/`;
      const response = await downloadFileAxios(token, endpoint);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  const deleteFile = async (doc_id) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const endpoint = `/api/applications/agent_applications/document_file/delete/${doc_id}/`;
      const response = await deleteData(endpoint);
      if (response.status && response.status === 204) {
        setLoading(false);
        setRefresh(!refresh);
      } else {
        setLoading(false);
        setErrorMessage([response.data]);
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      if (error.response && error.response.data) {
        setLoading(false);
        setErrorMessage(error.response.data);
      } else {
        setLoading(false);
        setErrorMessage([{ message: 'Error deleting file' }]);
      }
    }
  };

  const handleDeleteClick = async (doc) => {
    const userConfirmed = await requestConfirmation(doc);
    if (userConfirmed) {
      await deleteFile(doc.id);
    }
  };

  const handleManageDocumentsClick = () => {
    setIsManageModalOpen(true);
  };

  const handleCloseManageModal = () => {
    setIsManageModalOpen(false);
  };

  // Helper function to get document type
  const getDocumentType = (doc) => {
    if (doc.is_undertaking) return 'Solicitor Undertaking';
    if (doc.is_loan_agreement) return 'Advancement Agreement';
    return 'Document';
  };

  // Helper function to get document type styling
  const getDocumentTypeStyle = (doc) => {
    if (doc.is_undertaking) {
      return {
        backgroundColor: '#fef3c7',
        color: '#92400e',
        border: '1px solid #f59e0b',
        iconBg: '#f59e0b',
      };
    }
    if (doc.is_loan_agreement) {
      return {
        backgroundColor: '#dcfce7',
        color: '#047857',
        border: '1px solid #10b981',
        iconBg: '#10b981',
      };
    }
    return {
      backgroundColor: '#e0f2fe',
      color: '#0369a1',
      border: '1px solid #0ea5e9',
      iconBg: '#0ea5e9',
    };
  };

  // Helper function to get signer display name
  const getSignerDisplayName = (whoNeedsToSign) => {
    if (whoNeedsToSign === 'solicitor') return 'Solicitor';
    if (whoNeedsToSign === 'applicant') return 'Applicant';
    return 'Unknown';
  };

  // Helper function to get signature status details
  const getSignatureStatusStyle = (doc) => {
    // Priority: If document is signed, show that first
    if (doc.is_signed) {
      return {
        backgroundColor: '#10b981',
        textColor: 'white',
        text: 'Signed',
        icon: 'check',
      };
    }

    // If signature is required but not signed
    if (doc.signature_required) {
      return {
        backgroundColor: '#f59e0b',
        textColor: 'white',
        text: 'Pending Signature',
        icon: 'pending',
      };
    }

    // No signature required
    return {
      backgroundColor: '#6b7280',
      textColor: 'white',
      text: 'No Signature Required',
      icon: 'info',
    };
  };

  // Helper function to get requirement status styling
  const getRequirementStatusStyle = (requirement) => {
    if (requirement.is_uploaded) {
      return {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        textColor: '#059669',
        iconColor: '#10b981',
        text: 'Uploaded',
        icon: 'check',
      };
    }
    return {
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      textColor: '#d97706',
      iconColor: '#f59e0b',
      text: 'Pending Upload',
      icon: 'pending',
    };
  };

  // Tooltip logic for specific document
  const handleMouseEnter = async (e, doc) => {
    if (doc.is_signed) {
      setCurrentHoveredDocId(doc.id);
      setTooltipVisible(true);
      setTooltipContent('Fetching signing details...');
      const filePath = doc.document;
      const fileName = filePath.split('/').pop();

      try {
        const endpoint = `/api/signed_documents/logs/file/${fileName}/`;
        const response = await fetchData(token, endpoint);
        const docData = response.data;

        const content = `
          <p><strong>Document Signing Details:</strong></p>
          <p style="margin: 2px 10px 0; color: ${
            docData.country !== 'Ireland' ? 'red' : 'black'
          };">Country: ${docData.country || 'N/A'}</p>
          <p style="margin: 1px 10px 0;">Region name: ${
            docData.region_name || 'N/A'
          }</p>
          <p style="margin: 1px 10px 0;">City: ${docData.city || 'N/A'}</p>
          <p style="margin: 1px 10px 0;">ISP: ${docData.isp || 'N/A'}</p>
          <p style="margin: 1px 10px 0; color: ${
            docData.is_proxy ? 'red' : 'black'
          };">Proxy: ${docData.is_proxy ? 'Yes' : 'No'}</p>
          <p style="margin: 1px 10px 0; color: ${
            docData.is_proxy ? 'red' : 'black'
          };">Proxy Type: ${docData.type || 'N/A'}</p> <br/>
          <p style="margin: 1px 10px 0;">Logged in user: ${
            docData.signing_user_email || 'N/A'
          }</p>
          <p style="margin: 1px 10px 0;">${getSignerDisplayName(
            doc.who_needs_to_sign
          )} full name: ${docData.solicitor_full_name || 'N/A'}</p>
        `;

        setTooltipContent(content);
      } catch (error) {
        console.error('Error getting file info:', error);
      }
    }
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
    setCurrentHoveredDocId(null);
  };

  if (loading) {
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ minHeight: '200px' }}
      >
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div className='mb-5'>
      {/* Header */}
      <div
        className='px-4 py-4 mb-4 rounded-3'
        style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
        }}
      >
        <div className='row align-items-center'>
          <div className='col-lg-8'>
            <h6 className='mb-0 fw-bold d-flex align-items-center gap-2'>
              <svg
                width='20'
                height='20'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                  clipRule='evenodd'
                />
              </svg>
              Documents & Requirements
            </h6>
          </div>
          <div className='col-lg-4 text-end'>
            <ManageDocumentsButton onClick={handleManageDocumentsClick} />
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {errorMessage && (
        <div
          className='mb-4 p-4 rounded-3 d-flex align-items-center gap-3'
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
          }}
        >
          <div
            className='d-flex align-items-center justify-content-center rounded-2'
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#dc2626',
              color: 'white',
            }}
          >
            <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div>
            <h6 className='mb-1 fw-bold' style={{ color: '#dc2626' }}>
              Error
            </h6>
            <div style={{ color: '#dc2626', fontSize: '0.875rem' }}>
              {renderErrors(errorMessage)}
            </div>
          </div>
        </div>
      )}

      {/* Document Requirements Section - Compact */}
      {!loadingRequirements && currentRequirements.length > 0 && (
        <div className='mb-4'>
          <div
            className='px-3 py-2 mb-3 rounded-3'
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
            }}
          >
            <h6 className='mb-0 fw-semibold d-flex align-items-center gap-2'>
              <svg
                width='16'
                height='16'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              Required Documents ({currentRequirements.length})
            </h6>
          </div>

          <div className='row g-2'>
            {currentRequirements.map((requirement) => {
              const statusStyle = getRequirementStatusStyle(requirement);
              return (
                <div key={requirement.id} className='col-lg-6'>
                  <div
                    className='p-3 rounded-3 d-flex align-items-center gap-3'
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div
                      className='d-flex align-items-center justify-content-center rounded-2 flex-shrink-0'
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: '#64748b',
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
                          d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                    <div className='flex-grow-1 min-w-0'>
                      <div className='d-flex align-items-center justify-content-between'>
                        <h6
                          className='mb-0 fw-semibold text-truncate'
                          style={{ fontSize: '0.85rem', color: '#1e293b' }}
                        >
                          {requirement.document_type.name}
                        </h6>
                        <span
                          className='px-2 py-1 rounded-pill text-white'
                          style={{
                            backgroundColor: statusStyle.iconColor,
                            fontSize: '0.7rem',
                            fontWeight: '600',
                          }}
                        >
                          {statusStyle.text}
                        </span>
                      </div>
                      {requirement.document_type.signature_required && (
                        <p
                          className='mb-0 text-muted'
                          style={{ fontSize: '0.7rem' }}
                        >
                          Requires{' '}
                          {getSignerDisplayName(
                            requirement.document_type.who_needs_to_sign
                          )}{' '}
                          signature
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Uploaded Documents Section - Compact */}
      <div
        className='px-3 py-2 mb-3 rounded-3'
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
          color: 'white',
        }}
      >
        <h6 className='mb-0 fw-semibold d-flex align-items-center gap-2'>
          <svg width='16' height='16' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
              clipRule='evenodd'
            />
          </svg>
          Uploaded Documents ({documents.length})
        </h6>
      </div>

      {/* Documents List - Condensed */}
      {documents.length > 0 ? (
        <div className='row g-2'>
          {documents.map((doc) => {
            const typeStyle = getDocumentTypeStyle(doc);
            const signatureStatus = getSignatureStatusStyle(doc);

            return (
              <div key={doc.document} className='col-lg-6'>
                <div
                  className='p-3 rounded-3 position-relative'
                  style={{
                    ...typeStyle,
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.01)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Document Header */}
                  <div className='d-flex align-items-center gap-3 mb-2'>
                    <div
                      className='d-flex align-items-center justify-content-center rounded-2 flex-shrink-0'
                      style={{
                        width: '24px',
                        height: '24px',
                        backgroundColor: typeStyle.iconBg,
                        color: 'white',
                      }}
                    >
                      <svg
                        width='12'
                        height='12'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        {doc.is_undertaking ? (
                          <path
                            fillRule='evenodd'
                            d='M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.94l1-4H9.03z'
                            clipRule='evenodd'
                          />
                        ) : doc.is_loan_agreement ? (
                          <path
                            fillRule='evenodd'
                            d='M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z'
                            clipRule='evenodd'
                          />
                        ) : (
                          <path
                            fillRule='evenodd'
                            d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                            clipRule='evenodd'
                          />
                        )}
                      </svg>
                    </div>
                    <div className='flex-grow-1 min-w-0'>
                      <h6
                        className='mb-0 fw-bold text-truncate'
                        style={{
                          color: typeStyle.color,
                          fontSize: '0.9rem',
                        }}
                      >
                        {getDocumentType(doc)}
                      </h6>
                      <p
                        className='mb-0 text-truncate opacity-75'
                        style={{
                          fontSize: '0.7rem',
                          color: typeStyle.color,
                        }}
                      >
                        {doc.original_name}
                      </p>
                    </div>
                    {/* Signature Status Badge - Compact */}
                    <span
                      className='px-2 py-1 rounded-pill d-flex align-items-center gap-1'
                      style={{
                        backgroundColor: signatureStatus.backgroundColor,
                        color: signatureStatus.textColor,
                        fontSize: '0.7rem',
                        fontWeight: '600',
                      }}
                    >
                      <svg
                        width='10'
                        height='10'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        {signatureStatus.icon === 'check' ? (
                          <path
                            fillRule='evenodd'
                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                            clipRule='evenodd'
                          />
                        ) : signatureStatus.icon === 'pending' ? (
                          <path
                            fillRule='evenodd'
                            d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                            clipRule='evenodd'
                          />
                        ) : (
                          <path
                            fillRule='evenodd'
                            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                            clipRule='evenodd'
                          />
                        )}
                      </svg>
                      {signatureStatus.text}
                    </span>
                  </div>

                  {/* Meta Information */}
                  <div className='d-flex align-items-center justify-content-between'>
                    <div className='d-flex gap-2'>
                      {doc.created_at && (
                        <span
                          className='px-2 py-1 rounded-pill'
                          style={{
                            backgroundColor: 'rgba(99, 102, 241, 0.1)',
                            color: '#4f46e5',
                            fontSize: '0.65rem',
                            fontWeight: '600',
                          }}
                        >
                          {new Date(doc.created_at).toLocaleDateString()}
                        </span>
                      )}
                      <span
                        className='px-2 py-1 rounded-pill'
                        style={{
                          backgroundColor: 'rgba(156, 163, 175, 0.2)',
                          color: '#6b7280',
                          fontSize: '0.65rem',
                          fontWeight: '600',
                        }}
                      >
                        ID: {doc.id}
                      </span>
                    </div>

                    {/* Action Buttons - Compact */}
                    <div className='d-flex gap-1'>
                      <button
                        className='btn btn-sm px-2 py-1 rounded-2 d-flex align-items-center gap-1'
                        style={{
                          background:
                            'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                          color: 'white',
                          border: 'none',
                          fontSize: '0.7rem',
                        }}
                        onClick={() => downloadFile(doc.document)}
                        onMouseEnter={(e) => handleMouseEnter(e, doc)}
                        onMouseLeave={() => handleMouseLeave()}
                      >
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
                        Download
                      </button>

                      {isAdmin && (
                        <button
                          type='button'
                          className='btn btn-sm p-1 rounded-2'
                          style={{
                            background: 'rgba(220, 38, 38, 0.1)',
                            border: '1px solid rgba(220, 38, 38, 0.2)',
                            color: '#dc2626',
                          }}
                          onClick={() => handleDeleteClick(doc)}
                        >
                          <svg
                            width='12'
                            height='12'
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
                              d='M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V7a1 1 0 00-1-1z'
                              clipRule='evenodd'
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Show Tooltip only for the hovered document */}
                  {currentHoveredDocId === doc.id && (
                    <Tooltip
                      content={tooltipContent}
                      visible={tooltipVisible}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className='text-center p-5 rounded-4'
          style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            border: '2px dashed #cbd5e1',
          }}
        >
          <div
            className='d-flex align-items-center justify-content-center rounded-4 mx-auto mb-4'
            style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
            }}
          >
            <svg width='40' height='40' fill='#64748b' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <h5 className='fw-bold mb-3' style={{ color: '#475569' }}>
            No Documents Uploaded
          </h5>
          <p className='mb-4' style={{ color: '#64748b', fontSize: '0.95rem' }}>
            No documents have been uploaded for this application yet. Get
            started by uploading your first document.
          </p>
          {/*<button*/}
          {/*  className='btn px-5 py-3 fw-semibold rounded-4 d-inline-flex align-items-center gap-3'*/}
          {/*  style={{*/}
          {/*    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',*/}
          {/*    color: 'white',*/}
          {/*    border: 'none',*/}
          {/*    fontSize: '0.95rem',*/}
          {/*    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',*/}
          {/*  }}*/}
          {/*  onClick={() => navigate(`/upload_new_document/${applicationId}`)}*/}
          {/*  onMouseEnter={(e) => {*/}
          {/*    e.target.style.transform = 'translateY(-2px)';*/}
          {/*    e.target.style.boxShadow = '0 12px 24px rgba(245, 158, 11, 0.4)';*/}
          {/*  }}*/}
          {/*  onMouseLeave={(e) => {*/}
          {/*    e.target.style.transform = 'translateY(0)';*/}
          {/*    e.target.style.boxShadow = 'none';*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>*/}
          {/*    <path*/}
          {/*      fillRule='evenodd'*/}
          {/*      d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'*/}
          {/*      clipRule='evenodd'*/}
          {/*    />*/}
          {/*  </svg>*/}
          {/*  Upload First Document*/}
          {/*</button>*/}
        </div>
      )}

      {/* Manage Documents Modal */}
      <ManageDocumentsModal
        isOpen={isManageModalOpen}
        onClose={handleCloseManageModal}
        applicationId={applicationId}
        refresh={refresh}
        setRefresh={setRefresh}
        existingDocuments={documents}
        availableDocumentTypes={availableDocumentTypes}
        currentRequirements={currentRequirements}
        loadingRequirements={loadingRequirements}
      />

      {/* Use the confirmation modal hook */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        document={confirmState.document}
        onConfirm={(result) => handleConfirm(result)}
        onCancel={() => handleConfirm(false)}
      />
    </div>
  );
};

export default DocumentsUpload;
