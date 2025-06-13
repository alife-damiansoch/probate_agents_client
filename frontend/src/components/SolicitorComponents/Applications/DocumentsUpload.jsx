import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../../GenericComponents/DeleteConfirm/ConfirmModal';
import { useConfirmation } from '../../GenericComponents/DeleteConfirm/UseConfirmationHook';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import Tooltip from '../../GenericComponents/Tooltip';
import {
  deleteData,
  downloadFileAxios,
  fetchData,
} from '../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';

const DocumentsUpload = ({ applicationId, refresh, setRefresh, user }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Tooltip state
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [currentHoveredDocId, setCurrentHoveredDocId] = useState(null); // Track which document is hovered
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if the user is an admin
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
    const userConfirmed = await requestConfirmation(doc); // Await user confirmation with full document object
    if (userConfirmed) {
      await deleteFile(doc.id);
    }
  };

  // Tooltip logic for specific document
  const handleMouseEnter = async (e, doc) => {
    if (doc.is_signed) {
      setCurrentHoveredDocId(doc.id); // Set the current document ID on hover
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
                          <p style="margin: 1px 10px 0;">City: ${
                            docData.city || 'N/A'
                          }</p>
                          <p style="margin: 1px 10px 0;">ISP: ${
                            docData.isp || 'N/A'
                          }</p>
                          <p style="margin: 1px 10px 0; color: ${
                            docData.is_proxy ? 'red' : 'black'
                          };">Proxy: ${docData.is_proxy ? 'Yes' : 'No'}</p>
                          <p style="margin: 1px 10px 0; color: ${
                            docData.is_proxy ? 'red' : 'black'
                          };">Proxy Type: ${docData.type || 'N/A'}</p> </br>
                            <p style="margin: 1px 10px 0;">Logged in user: ${
                              docData.signing_user_email || 'N/A'
                            }</p>
                            <p style="margin: 1px 10px 0;">${
                              doc.is_undertaking
                                ? 'Solicitor'
                                : doc.is_loan_agreement
                                ? 'Applicant'
                                : 'Signing person'
                            } full name: ${
          docData.solicitor_full_name || 'N/A'
        }</p>
                        `;

        setTooltipContent(content);
      } catch (error) {
        console.error('Error getting file info:', error);
      }
    }
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
    setCurrentHoveredDocId(null); // Reset the hovered document ID
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
              Uploaded Documents ({documents.length})
            </h6>
          </div>
          <div className='col-lg-4 text-end'>
            <button
              className='btn px-4 py-2 fw-semibold rounded-3 d-inline-flex align-items-center gap-2'
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontSize: '0.875rem',
              }}
              onClick={() => navigate(`/upload_new_document/${applicationId}`)}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
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
                  d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                  clipRule='evenodd'
                />
              </svg>
              Add Document
            </button>
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

      {/* Documents List */}
      {documents.length > 0 ? (
        <div className='row g-3'>
          {documents.map((doc) => (
            <div key={doc.document} className='col-lg-6 col-xl-4'>
              <div
                className='p-4 rounded-3 h-100 position-relative'
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                {/* Signed Badge */}
                {doc.is_signed && (
                  <div
                    className='position-absolute top-0 end-0 px-3 py-1 rounded-pill d-flex align-items-center gap-1'
                    style={{
                      backgroundColor: '#dc2626',
                      color: 'white',
                      transform: 'translate(8px, -8px)',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      zIndex: 10,
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
                        d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Signed
                  </div>
                )}

                {/* Document Icon and Info */}
                <div className='d-flex align-items-center gap-3 mb-3'>
                  <div
                    className='d-flex align-items-center justify-content-center rounded-3'
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: doc.is_signed ? '#dc2626' : '#f59e0b',
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
                        d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div className='flex-grow-1'>
                    <h6
                      className='mb-1 fw-bold'
                      style={{ color: '#111827', fontSize: '0.875rem' }}
                    >
                      {doc.original_name}
                    </h6>
                    <div className='d-flex align-items-center gap-2'>
                      {doc.is_signed && (
                        <span
                          className='badge px-2 py-1 rounded-pill'
                          style={{
                            backgroundColor: '#fef2f2',
                            color: '#dc2626',
                            fontSize: '0.65rem',
                          }}
                        >
                          Digitally Signed
                        </span>
                      )}
                      {doc.is_undertaking && (
                        <span
                          className='badge px-2 py-1 rounded-pill'
                          style={{
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            fontSize: '0.65rem',
                          }}
                        >
                          Undertaking
                        </span>
                      )}
                      {doc.is_loan_agreement && (
                        <span
                          className='badge px-2 py-1 rounded-pill'
                          style={{
                            backgroundColor: '#f0fdf4',
                            color: '#059669',
                            fontSize: '0.65rem',
                          }}
                        >
                          Loan Agreement
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='d-flex justify-content-between align-items-center'>
                  <button
                    className='btn btn-sm px-3 py-2 fw-semibold rounded-2 d-flex align-items-center gap-2'
                    style={{
                      background:
                        'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      color: 'white',
                      border: 'none',
                      fontSize: '0.75rem',
                    }}
                    onClick={() => downloadFile(doc.document)}
                    onMouseEnter={(e) => handleMouseEnter(e, doc)}
                    onMouseLeave={handleMouseLeave}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow =
                        '0 4px 12px rgba(59, 130, 246, 0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
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
                        d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Download
                  </button>

                  {isAdmin && (
                    <button
                      type='button'
                      className='btn btn-sm p-2 rounded-2'
                      style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        color: '#dc2626',
                      }}
                      onClick={() => handleDeleteClick(doc)}
                      onMouseEnter={(e) => {
                        e.target.style.background = '#fee2e2';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = '#fef2f2';
                        e.target.style.transform = 'translateY(0)';
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

                {/* Show Tooltip only for the hovered document */}
                {currentHoveredDocId === doc.id && (
                  <Tooltip content={tooltipContent} visible={tooltipVisible} />
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className='text-center p-5 rounded-3'
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
          }}
        >
          <svg
            width='48'
            height='48'
            fill='#9ca3af'
            viewBox='0 0 20 20'
            className='mx-auto mb-3'
          >
            <path
              fillRule='evenodd'
              d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
              clipRule='evenodd'
            />
          </svg>
          <h6 className='fw-bold mb-2' style={{ color: '#6b7280' }}>
            No Documents Uploaded
          </h6>
          <p
            className='mb-3'
            style={{ color: '#9ca3af', fontSize: '0.875rem' }}
          >
            No documents have been uploaded for this application yet.
          </p>
          <button
            className='btn px-4 py-2 fw-semibold rounded-3 d-inline-flex align-items-center gap-2'
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              border: 'none',
              fontSize: '0.875rem',
            }}
            onClick={() => navigate(`/upload_new_document/${applicationId}`)}
          >
            <svg width='16' height='16' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                clipRule='evenodd'
              />
            </svg>
            Upload First Document
          </button>
        </div>
      )}

      {/* Use the confirmation modal hook */}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        document={confirmState.document} // Pass the entire document object
        onConfirm={(result) => handleConfirm(result)}
        onCancel={() => handleConfirm(false)}
      />
    </div>
  );
};

export default DocumentsUpload;
