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
import SolicitorNotificationButton from './SolicitorNotificationButton.jsx';
import SolicitorNotificationModal from './SolicitorNotificationModal.jsx';

const DocumentsUpload = ({
  applicationId,
  refresh,
  setRefresh,
  user,
  currentRequirements,
  setCurrentRequirements,
  manageDocummentButtonDisabled = true,
}) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);

  // Document requirements state
  const [availableDocumentTypes, setAvailableDocumentTypes] = useState([]);
  const [loadingRequirements, setLoadingRequirements] = useState(false);

  // Solicitor notification modal state
  const [showSolicitorModal, setShowSolicitorModal] = useState(false);
  const [triggerEmailSend, setTriggerEmailSend] = useState(false);

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

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Fetch documents
  React.useEffect(() => {
    setLoading(true);
    const fetchDocuments = async () => {
      if (token && applicationId) {
        try {
          const endpoint = `/api/applications/agent_applications/document_file/${applicationId}/`;
          const response = await fetchData(token, endpoint);
          console.log('DOCUMENTS FETCHED', response.data);
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

  // Fetch document requirements and types
  useEffect(() => {
    const fetchDocumentData = async () => {
      if (token && applicationId) {
        setLoadingRequirements(true);
        try {
          const typesResponse = await fetchData(token, '/api/document-types/');
          setAvailableDocumentTypes(typesResponse.data);

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

  // Solicitor notification functions
  const handleNotificationSuccess = (data) => {
    console.log('Email notification sent successfully:', data);
    setErrorMessage(null);
    setSuccessMessage([
      {
        message: `Email notification sent successfully to ${data.solicitor_email}! The solicitor has been informed about the new documents for application #${data.application_id}.`,
      },
    ]);
  };

  const handleNotificationError = (error) => {
    console.error('Failed to send email notification:', error);
    setErrorMessage([
      { message: `Failed to send email notification: ${error}` },
    ]);
    setSuccessMessage(null);
  };

  const handleShowSolicitorModal = () => {
    setShowSolicitorModal(true);
  };

  const handleCloseSolicitorModal = () => {
    setShowSolicitorModal(false);
    setTriggerEmailSend(false);
  };

  const handleConfirmSolicitorNotification = () => {
    setShowSolicitorModal(false);
    setTriggerEmailSend(true);
  };

  const handleSendComplete = () => {
    setTriggerEmailSend(false);
  };

  // Helper functions
  const getDocumentType = (doc) => {
    if (doc.is_undertaking) return 'Solicitor Undertaking';
    if (doc.is_loan_agreement) return 'Advancement Agreement';
    return 'Document';
  };

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

  const getSignerDisplayName = (whoNeedsToSign) => {
    if (whoNeedsToSign === 'solicitor') return 'Solicitor';
    if (whoNeedsToSign === 'applicant') return 'Applicant';
    return 'Unknown';
  };

  const getSignatureStatusStyle = (doc) => {
    if (doc.is_signed) {
      return {
        backgroundColor: '#10b981',
        textColor: 'white',
        text: 'Signed',
        icon: 'check',
      };
    }

    if (doc.signature_required) {
      return {
        backgroundColor: '#f59e0b',
        textColor: 'white',
        text: 'Pending Signature',
        icon: 'pending',
      };
    }

    return {
      backgroundColor: '#6b7280',
      textColor: 'white',
      text: 'No Signature Required',
      icon: 'info',
    };
  };

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

  const formatEmailRecipients = (recipients) => {
    if (!recipients || recipients.length === 0) return 'No recipients';
    if (recipients.length === 1) return recipients[0];
    if (recipients.length === 2) return `${recipients[0]} and ${recipients[1]}`;
    return `${recipients[0]} and ${recipients.length - 1} other${
      recipients.length > 2 ? 's' : ''
    }`;
  };

  const formatEmailDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  // Tooltip logic
  // Updated handleMouseEnter function in DocumentsUpload component
  const handleMouseEnter = async (e, doc) => {
    if (doc.is_signed) {
      setCurrentHoveredDocId(doc.id);
      setTooltipVisible(true);

      // Check if this is a manually uploaded document
      if (doc.is_manual_upload) {
        const content = `
        <div style="text-align: center; padding: 8px;">
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
            <div style="
              width: 48px; 
              height: 48px; 
              background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); 
              border-radius: 16px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white;
              box-shadow: 0 8px 32px rgba(139, 92, 246, 0.3);
            ">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
          </div>
          <h4 style="
            color: #7c3aed; 
            margin: 0 0 8px 0; 
            font-weight: 700; 
            font-size: 16px;
            letter-spacing: 0.5px;
          ">Manual Upload</h4>
          <p style="
            color: #6b46c1; 
            margin: 0 0 12px 0; 
            font-size: 14px; 
            line-height: 1.4;
            font-weight: 500;
          ">Wet Ink Signature Document</p>
          
          <div style="
            background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.15) 100%);
            border: 2px solid rgba(139, 92, 246, 0.2);
            border-radius: 12px;
            padding: 12px;
            margin: 12px 0;
          ">
            <p style="
              color: #553c9a; 
              margin: 0; 
              font-size: 13px; 
              line-height: 1.4;
              font-weight: 500;
            ">
              This document was physically signed with wet ink and uploaded manually to the system.
            </p>
          </div>
          
          <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 12px;">
            <div style="
              width: 20px; 
              height: 20px; 
              background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center;
            ">
              <svg width="12" height="12" fill="white" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <span style="
              color: #059669; 
              font-size: 12px; 
              font-weight: 600; 
              text-transform: uppercase; 
              letter-spacing: 0.5px;
            ">Verified Upload</span>
          </div>
          
          <div style="
            margin-top: 16px; 
            padding-top: 12px; 
            border-top: 1px solid rgba(139, 92, 246, 0.2);
          ">
            <div style="margin-bottom: 4px;">
              <p style="
                color: #8b5cf6; 
                margin: 0; 
                font-size: 11px; 
                font-weight: 500;
                opacity: 0.8;
              ">
                Uploaded: ${new Date(doc.created_at).toLocaleDateString(
                  'en-US',
                  {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )}
              </p>
            </div>
            ${
              doc.uploaded_by_email
                ? `
              <div>
                <p style="
                  color: #8b5cf6; 
                  margin: 0; 
                  font-size: 10px; 
                  font-weight: 500;
                  opacity: 0.7;
                ">
                  By: ${doc.uploaded_by_email}
                </p>
              </div>
            `
                : ''
            }
          </div>
        </div>
      `;
        setTooltipContent(content);
        return;
      }

      // Original digital signature tooltip logic for non-manual uploads
      setTooltipContent('Fetching signing details...');
      const filePath = doc.document;
      const fileName = filePath.split('/').pop();

      try {
        const endpoint = `/api/signed_documents/logs/file/${fileName}/`;
        const response = await fetchData(token, endpoint);
        const docData = response.data;

        const content = `
        <div style="text-align: center; padding: 8px; min-width: 260px;">
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 8px;">
            <div style="
              width: 40px; 
              height: 40px; 
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); 
              border-radius: 12px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white;
              box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
            ">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
          </div>
          
          <h4 style="
            color: #1e40af; 
            margin: 0 0 8px 0; 
            font-weight: 700; 
            font-size: 14px;
            letter-spacing: 0.3px;
          ">Digital Signature</h4>
          
          <div style="
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(29, 78, 216, 0.1) 100%);
            border: 1px solid rgba(59, 130, 246, 0.15);
            border-radius: 12px;
            padding: 10px;
            margin: 8px 0;
            text-align: left;
          ">
            <div style="display: grid; gap: 6px; font-size: 11px;">
              
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="color: #64748b; font-weight: 500;">Country</span>
                <span style="color: ${
                  docData.country !== 'Ireland' ? '#dc2626' : '#1e293b'
                }; font-weight: 600;">
                  ${docData.country || 'N/A'}
                </span>
              </div>

              <div style="height: 1px; background: rgba(59, 130, 246, 0.1);"></div>

              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="color: #64748b; font-weight: 500;">Location</span>
                <span style="color: #1e293b; font-weight: 600; text-align: right; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  ${docData.city || 'N/A'}, ${docData.region_name || 'N/A'}
                </span>
              </div>

              <div style="height: 1px; background: rgba(59, 130, 246, 0.1);"></div>

              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="color: #64748b; font-weight: 500;">ISP</span>
                <span style="color: #1e293b; font-weight: 600; text-align: right; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  ${docData.isp || 'N/A'}
                </span>
              </div>

              <div style="height: 1px; background: rgba(59, 130, 246, 0.1);"></div>

              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="color: #64748b; font-weight: 500;">Proxy</span>
                <span style="color: ${
                  docData.is_proxy ? '#dc2626' : '#059669'
                }; font-weight: 600;">
                  ${
                    docData.is_proxy
                      ? `Yes${docData.type ? ` (${docData.type})` : ''}`
                      : 'No'
                  }
                </span>
              </div>
            </div>
          </div>

          <div style="
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.06) 0%, rgba(5, 150, 105, 0.1) 100%);
            border: 1px solid rgba(16, 185, 129, 0.15);
            border-radius: 12px;
            padding: 10px;
            margin: 8px 0;
            text-align: left;
          ">
            <div style="display: grid; gap: 6px; font-size: 11px;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="color: #6b7280; font-weight: 500;">User</span>
                <span style="color: #047857; font-weight: 600; text-align: right; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  ${docData.signing_user_email || 'N/A'}
                </span>
              </div>
              
              <div style="height: 1px; background: rgba(16, 185, 129, 0.1);"></div>
              
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="color: #6b7280; font-weight: 500;">${getSignerDisplayName(
                  doc.who_needs_to_sign
                )}</span>
                <span style="color: #047857; font-weight: 600; text-align: right; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  ${docData.solicitor_full_name || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: center; gap: 4px; margin-top: 8px;">
            <div style="
              width: 12px; 
              height: 12px; 
              background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
              border-radius: 50%;
            "></div>
            <span style="
              color: #3b82f6; 
              font-size: 9px; 
              font-weight: 600;
              opacity: 0.8;
            ">Verified & Logged</span>
          </div>
          
          <div style="
            margin-top: 8px; 
            padding-top: 6px; 
            border-top: 1px solid rgba(59, 130, 246, 0.15);
            text-align: center;
          ">
            <div style="margin-bottom: 3px;">
              <span style="
                color: #6b7280; 
                font-size: 9px; 
                font-weight: 500;
                opacity: 0.7;
              ">
                Signed: ${new Date(
                  docData.created_at || doc.created_at
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            ${
              doc.uploaded_by_email
                ? `
              <div>
                <span style="
                  color: #6b7280; 
                  font-size: 8px; 
                  font-weight: 500;
                  opacity: 0.6;
                ">
                  Uploaded by: ${doc.uploaded_by_email}
                </span>
              </div>
            `
                : ''
            }
          </div>
        </div>
      `;

        setTooltipContent(content);
      } catch (error) {
        console.error('Error getting file info:', error);

        // Fallback content for digital signatures when API fails
        const content = `
        <div style="text-align: center; padding: 8px;">
          <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 12px;">
            <div style="
              width: 48px; 
              height: 48px; 
              background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); 
              border-radius: 16px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white;
            ">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <h4 style="color: #dc2626; margin: 0 0 8px 0; font-weight: 700; font-size: 16px;">
            Signature Details Unavailable
          </h4>
          <p style="color: #991b1b; margin: 0; font-size: 14px; line-height: 1.4;">
            Unable to retrieve digital signature information for this document.
          </p>
        </div>
      `;
        setTooltipContent(content);
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
            <ManageDocumentsButton
              onClick={handleManageDocumentsClick}
              manageDocummentButtonDisabled={manageDocummentButtonDisabled}
            />
          </div>
        </div>
      </div>

      {/* Success Messages */}
      {successMessage && (
        <div
          className='mb-4 p-4 rounded-3 d-flex align-items-center gap-3'
          style={{
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
          }}
        >
          <div
            className='d-flex align-items-center justify-content-center rounded-2'
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#16a34a',
              color: 'white',
            }}
          >
            <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div>
            <h6 className='mb-1 fw-bold' style={{ color: '#16a34a' }}>
              Success!
            </h6>
            <div style={{ color: '#16a34a', fontSize: '0.875rem' }}>
              {renderErrors(successMessage)}
            </div>
          </div>
        </div>
      )}

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

      {/* Document Requirements Section */}
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

      {/* Uploaded Documents Section */}
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

      {/* Documents List */}
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
                  {/* Email Status Badge */}
                  {doc.is_emailed && (
                    <div
                      className='position-absolute d-flex align-items-center gap-1 px-2 py-1 rounded-pill'
                      style={{
                        top: '-8px',
                        right: '12px',
                        background:
                          'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: 'white',
                        fontSize: '0.65rem',
                        fontWeight: '700',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                        border: '2px solid white',
                        zIndex: 10,
                      }}
                    >
                      <svg
                        width='10'
                        height='10'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                        <path d='m18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                      </svg>
                      <span
                        style={{
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        SENT
                      </span>
                    </div>
                  )}

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
                        style={{ color: typeStyle.color, fontSize: '0.9rem' }}
                      >
                        {getDocumentType(doc)}
                      </h6>
                      <p
                        className='mb-0 text-truncate opacity-75'
                        style={{ fontSize: '0.7rem', color: typeStyle.color }}
                      >
                        {doc.original_name}
                      </p>
                    </div>
                    {/* Signature Status Badge */}
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

                  {/* Email Information Section */}
                  {doc.is_emailed && (
                    <div
                      className='mt-3 p-2 rounded-2'
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.12) 100%)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                      }}
                    >
                      <div className='d-flex align-items-center gap-2 mb-1'>
                        <div
                          className='d-flex align-items-center justify-content-center rounded-1'
                          style={{
                            width: '16px',
                            height: '16px',
                            background:
                              'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                          }}
                        >
                          <svg
                            width='8'
                            height='8'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                            <path d='m18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                          </svg>
                        </div>
                        <span
                          className='fw-semibold'
                          style={{ color: '#059669', fontSize: '0.7rem' }}
                        >
                          Email Delivery
                        </span>
                        {doc.email_count > 1 && (
                          <span
                            className='px-1 rounded-1'
                            style={{
                              backgroundColor: '#10b981',
                              color: 'white',
                              fontSize: '0.6rem',
                              fontWeight: '700',
                              minWidth: '16px',
                              textAlign: 'center',
                            }}
                          >
                            {doc.email_count}
                          </span>
                        )}
                      </div>
                      <div className='d-flex align-items-center justify-content-between'>
                        <div
                          className='text-truncate'
                          style={{
                            color: '#047857',
                            fontSize: '0.65rem',
                            maxWidth: '200px',
                          }}
                        >
                          <span className='fw-medium'>To:</span>{' '}
                          {formatEmailRecipients(doc.emailed_to_recipients)}
                        </div>
                        {doc.last_emailed_date && (
                          <span
                            className='px-2 py-1 rounded-pill'
                            style={{
                              backgroundColor: 'rgba(16, 185, 129, 0.15)',
                              color: '#047857',
                              fontSize: '0.6rem',
                              fontWeight: '600',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {formatEmailDate(doc.last_emailed_date)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Meta Information */}
                  <div className='d-flex align-items-center justify-content-between mt-3'>
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

                    {/* Action Buttons */}
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

                  {/* Tooltip */}
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
        </div>
      )}

      {/* Solicitor Notification Section */}
      {documents.length > 0 && (
        <div
          className='mt-5 p-5 rounded-5 position-relative overflow-hidden'
          style={{
            background:
              'linear-gradient(135deg, rgba(16, 185, 129, 0.03) 0%, rgba(5, 150, 105, 0.08) 50%, rgba(16, 185, 129, 0.03) 100%)',
            border: '2px solid rgba(16, 185, 129, 0.12)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Floating background elements */}
          <div
            className='position-absolute rounded-circle'
            style={{
              width: '200px',
              height: '200px',
              background:
                'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
              top: '-50px',
              right: '-50px',
              animation: 'slowFloat 8s ease-in-out infinite',
            }}
          />
          <div
            className='position-absolute'
            style={{
              width: '120px',
              height: '120px',
              background: 'rgba(5, 150, 105, 0.04)',
              bottom: '-30px',
              left: '-30px',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              animation: 'slowFloat 6s ease-in-out infinite reverse',
            }}
          />

          <div className='row align-items-center position-relative'>
            <div className='col-lg-8 col-xl-9'>
              <div className='d-flex align-items-center gap-4 mb-4'>
                <div
                  className='position-relative d-flex align-items-center justify-content-center rounded-4'
                  style={{
                    width: '64px',
                    height: '64px',
                    background:
                      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    boxShadow: '0 12px 40px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <svg
                    width='28'
                    height='28'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                    <path d='m18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                  </svg>

                  {/* Animated ring */}
                  <div
                    className='position-absolute w-100 h-100 rounded-4'
                    style={{
                      border: '3px solid rgba(16, 185, 129, 0.3)',
                      animation: 'pulseRing 3s ease-out infinite',
                    }}
                  />
                </div>

                <div>
                  <h4
                    className='mb-2 fw-bold'
                    style={{ color: '#047857', fontSize: '1.5rem' }}
                  >
                    Notify Solicitor
                  </h4>
                  <p
                    className='mb-0'
                    style={{
                      color: '#065f46',
                      fontSize: '1.1rem',
                      lineHeight: '1.5',
                    }}
                  >
                    Send a professional email notification about the newly
                    uploaded documents to keep the solicitor informed of the
                    latest updates.
                  </p>
                </div>
              </div>

              {/* Feature highlights */}
              <div className='row g-3 mb-4'>
                <div className='col-sm-6 col-lg-4'>
                  <div className='d-flex align-items-center gap-2'>
                    <div
                      className='d-flex align-items-center justify-content-center rounded-2 flex-shrink-0'
                      style={{
                        width: '24px',
                        height: '24px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#059669',
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
                      style={{
                        color: '#065f46',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                      }}
                    >
                      Instant delivery
                    </span>
                  </div>
                </div>

                <div className='col-sm-6 col-lg-4'>
                  <div className='d-flex align-items-center gap-2'>
                    <div
                      className='d-flex align-items-center justify-content-center rounded-2 flex-shrink-0'
                      style={{
                        width: '24px',
                        height: '24px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#059669',
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
                      style={{
                        color: '#065f46',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                      }}
                    >
                      Professional template
                    </span>
                  </div>
                </div>

                <div className='col-sm-6 col-lg-4'>
                  <div className='d-flex align-items-center gap-2'>
                    <div
                      className='d-flex align-items-center justify-content-center rounded-2 flex-shrink-0'
                      style={{
                        width: '24px',
                        height: '24px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: '#059669',
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
                      style={{
                        color: '#065f46',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                      }}
                    >
                      Detailed summary
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className='col-lg-4 col-xl-3 text-center'>
              <SolicitorNotificationButton
                applicationId={applicationId}
                onSuccess={handleNotificationSuccess}
                onError={handleNotificationError}
                disabled={manageDocummentButtonDisabled}
                documentsCount={documents.length}
                onShowModal={handleShowSolicitorModal}
                triggerSend={triggerEmailSend}
                onSendComplete={handleSendComplete}
              />

              {/* Additional info */}
              <p className='mt-3 mb-0 small text-muted'>
                Email will include application #{applicationId} details
              </p>
            </div>
          </div>

          <style>{`
           @keyframes slowFloat {
             0%, 100% { transform: translateY(0px) rotate(0deg); }
             50% { transform: translateY(-20px) rotate(180deg); }
           }

           @keyframes pulseRing {
             0% {
               transform: scale(1);
               opacity: 0.8;
             }
             100% {
               transform: scale(1.4);
               opacity: 0;
             }
           }
         `}</style>
        </div>
      )}

      {/* Modals */}
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

      <SolicitorNotificationModal
        isOpen={showSolicitorModal}
        onConfirm={handleConfirmSolicitorNotification}
        onCancel={handleCloseSolicitorModal}
        applicationId={applicationId}
        documentsCount={documents.length}
      />

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
