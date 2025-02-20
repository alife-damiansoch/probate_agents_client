import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdAddChart } from 'react-icons/md';
import { FaFileSignature } from 'react-icons/fa6';
import { TbXboxX } from 'react-icons/tb';
import Cookies from 'js-cookie';
import {
  deleteData,
  downloadFileAxios,
  fetchData,
} from '../../GenericFunctions/AxiosGenericFunctions';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';
import Tooltip from '../../GenericComponents/Tooltip';
import { useConfirmation } from '../../GenericComponents/DeleteConfirm/UseConfirmationHook';
import ConfirmModal from '../../GenericComponents/DeleteConfirm/ConfirmModal';

const DocumentsUpload = ({ applicationId, refresh, setRefresh }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Tooltip state
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [currentHoveredDocId, setCurrentHoveredDocId] = useState(null); // Track which document is hovered

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
    return <LoadingComponent />;
  }

  return (
    <>
      <div className='card-header'>
        <h3 className='card-subtitle py-2 text-info-emphasis'>
          Uploaded documents
        </h3>
      </div>

      {documents.length > 0 ? (
        <div className='card-body bg-light mx-3 rounded mt-2 shadow p-4 position-relative'>
          <ul className='d-flex flex-wrap gap-4 align-items-center justify-content-evenly'>
            {documents.map((doc) => (
              <li
                key={doc.document}
                style={{ position: 'relative', marginBottom: '40px' }}
              >
                {doc.is_signed && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%) rotate(-20deg)',
                      zIndex: 0,
                      display: 'flex',
                      alignItems: 'center',
                      pointerEvents: 'none',
                      opacity: '0.5',
                    }}
                  >
                    <FaFileSignature size={40} color='red' />
                    <span
                      style={{
                        color: 'red',
                        marginLeft: '10px',
                        fontSize: '15px',
                        fontWeight: 'bold',
                      }}
                    >
                      Signed
                    </span>
                  </div>
                )}
                <p style={{ position: 'relative', zIndex: 1 }}>
                  <span
                    style={{
                      cursor: 'pointer',
                      color: 'blue',
                      textDecoration: 'underline',
                    }}
                    onClick={() => downloadFile(doc.document)}
                    onMouseEnter={(e) => handleMouseEnter(e, doc)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {doc.original_name}
                  </span>

                  <i
                    className='ms-2 text-danger'
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleDeleteClick(doc)}
                  >
                    <TbXboxX className='mb-4 icon-shadow' size={30} />
                  </i>
                </p>
                {/* Show Tooltip only for the hovered document */}
                {currentHoveredDocId === doc.id && (
                  <Tooltip content={tooltipContent} visible={tooltipVisible} />
                )}
              </li>
            ))}
          </ul>
          {/* Use the confirmation modal hook */}
          <ConfirmModal
            isOpen={confirmState.isOpen}
            document={confirmState.document} // Pass the entire document object
            onConfirm={(result) => handleConfirm(result)}
            onCancel={() => handleConfirm(false)}
          />
        </div>
      ) : (
        <div className='alert alert-danger text-center'>
          No documents uploaded
        </div>
      )}

      {errorMessage && (
        <div className='alert alert-danger text-center' role='alert'>
          {renderErrors(errorMessage)}
        </div>
      )}

      <div className='row my-3 ms-auto'>
        <div className='ms-auto me-2'>
          <button
            className='btn btn-sm btn-outline-primary'
            onClick={() => navigate(`/upload_new_document/${applicationId}`)}
          >
            <MdAddChart size={20} className='me-2' />
            Add document
          </button>
        </div>
      </div>
    </>
  );
};

export default DocumentsUpload;
