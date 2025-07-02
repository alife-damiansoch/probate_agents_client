import Cookies from 'js-cookie';
import { useRef, useState } from 'react';
import { uploadFile } from '../../../../GenericFunctions/AxiosGenericFunctions';

const ManualDocumentUploadModal = ({
  isOpen,
  onClose,
  applicationId,
  onSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [errors, setErrors] = useState([]);
  const fileInputRef = useRef(null);

  // Get token
  let tokenObj = Cookies.get('auth_token_agents');
  let token = null;
  if (tokenObj) {
    tokenObj = JSON.parse(tokenObj);
    token = tokenObj.access;
  }

  const documentTypes = [
    { value: 'undertaking', label: 'Solicitor Undertaking', autoSigned: true },
    {
      value: 'loan_agreement',
      label: 'Advancement Agreement',
      autoSigned: true,
    },

    { value: 'other', label: 'Other Document', autoSigned: false },
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (file.size > maxSize) {
      setErrors(['File size must be less than 10MB']);
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setErrors(['Please upload a PDF, Word document, or image file']);
      return;
    }

    setSelectedFile(file);
    setErrors([]);
  };

  const handleDocumentTypeChange = (type) => {
    setDocumentType(type);
    const selectedType = documentTypes.find((dt) => dt.value === type);
    if (selectedType && selectedType.autoSigned) {
      setIsSigned(true);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !documentType) {
      setErrors(['Please select a file and document type']);
      return;
    }

    setIsUploading(true);
    setErrors([]);

    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('is_manual_upload', 'true');

      if (documentType === 'undertaking') {
        formData.append('is_undertaking', 'true');
        formData.append('is_signed', 'true');
      } else if (documentType === 'loan_agreement') {
        formData.append('is_loan_agreement', 'true');
        formData.append('is_signed', 'true');
      } else if (documentType === 'terms_of_business') {
        formData.append('is_terms_of_business', 'true');
        formData.append('is_signed', isSigned ? 'true' : 'false');
      } else if (documentType === 'secci') {
        formData.append('is_secci', 'true');
        formData.append('is_signed', isSigned ? 'true' : 'false');
      } else {
        formData.append('is_signed', isSigned ? 'true' : 'false');
      }

      const endpoint = `/api/applications/agent_applications/document_file/${applicationId}/`;
      const response = await uploadFile(endpoint, formData);

      if (response && response.status >= 200 && response.status < 300) {
        onSuccess?.();
        onClose();
        resetForm();
      } else {
        setErrors(['Upload failed. Please try again.']);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrors(['An error occurred during upload. Please try again.']);
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setDocumentType('');
    setIsSigned(false);
    setShowWarning(true);
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className='modal fade show d-block'
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(16px)',
        zIndex: 1070,
      }}
      tabIndex='-1'
      role='dialog'
    >
      <div
        className='modal-dialog modal-dialog-centered'
        role='document'
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className='modal-content border-0 shadow-lg w-100'
          style={{
            borderRadius: '32px',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Animated background elements */}
          <div
            style={{
              position: 'absolute',
              top: '-50%',
              right: '-20%',
              width: '200px',
              height: '200px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              borderRadius: '50%',
              opacity: 0.1,
              filter: 'blur(40px)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-30%',
              left: '-10%',
              width: '150px',
              height: '150px',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              borderRadius: '50%',
              opacity: 0.1,
              filter: 'blur(30px)',
            }}
          />

          {/* Header */}
          <div
            className='modal-header border-0 px-4 py-4'
            style={{
              background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
              color: 'white',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <div className='d-flex align-items-center gap-3'>
              <div
                className='d-flex align-items-center justify-content-center'
                style={{
                  width: '52px',
                  height: '52px',
                  background:
                    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  borderRadius: '20px',
                  boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
                }}
              >
                <svg
                  width='28'
                  height='28'
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
                <h4 className='mb-0 fw-bold'>Manual Document Upload</h4>
                <p className='mb-0 opacity-75 small'>
                  Upload pre-signed or physical documents
                </p>
              </div>
            </div>
            <button
              type='button'
              className='btn-close'
              onClick={handleClose}
              style={{
                filter: 'brightness(0) invert(1)',
                opacity: 0.8,
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
              }}
            />
          </div>

          {/* Body */}
          <div
            className='modal-body p-4'
            style={{ position: 'relative', zIndex: 1 }}
          >
            {showWarning && (
              <div
                className='alert mb-4 border-0'
                style={{
                  background:
                    'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  color: '#92400e',
                  borderRadius: '20px',
                  border: '2px solid #fbbf24',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background:
                      'linear-gradient(90deg, #f59e0b, #d97706, #f59e0b)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2s infinite',
                  }}
                />
                <div className='d-flex align-items-start gap-3'>
                  <div
                    className='flex-shrink-0 d-flex align-items-center justify-content-center'
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#f59e0b',
                      borderRadius: '12px',
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
                        d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div className='flex-grow-1'>
                    <h6 className='fw-bold mb-2'>Important Notice</h6>
                    <p className='mb-3 small lh-base'>
                      This upload function is intended exclusively for documents
                      that have been physically signed with wet ink signatures.
                      All standard documents should be generated through our
                      system and signed digitally. Only use this feature when
                      the signatory specifically requires physical document
                      signing.
                    </p>
                    <button
                      className='btn btn-sm fw-semibold'
                      style={{
                        backgroundColor: '#f59e0b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '8px 16px',
                      }}
                      onClick={() => setShowWarning(false)}
                    >
                      I Understand, Continue
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!showWarning && (
              <div className='space-y-4'>
                {/* Document Type Selection */}
                <div className='mb-4'>
                  <label
                    className='form-label fw-semibold mb-3'
                    style={{ color: '#334155' }}
                  >
                    Document Type
                  </label>
                  <div className='row g-2'>
                    {documentTypes.map((type) => (
                      <div key={type.value} className='col-6'>
                        <div
                          className={`card border-0 h-100 cursor-pointer transition-all ${
                            documentType === type.value ? 'border-primary' : ''
                          }`}
                          style={{
                            borderRadius: '16px',
                            background:
                              documentType === type.value
                                ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                                : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                            border:
                              documentType === type.value
                                ? '2px solid #3b82f6'
                                : '2px solid #e2e8f0',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            transform:
                              documentType === type.value
                                ? 'scale(1.02)'
                                : 'scale(1)',
                          }}
                          onClick={() => handleDocumentTypeChange(type.value)}
                        >
                          <div className='card-body p-3 text-center'>
                            <div
                              className='d-flex align-items-center justify-content-center mb-2'
                              style={{
                                width: '40px',
                                height: '40px',
                                background:
                                  documentType === type.value
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                    : 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                                borderRadius: '12px',
                                color: 'white',
                                margin: '0 auto',
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
                                  d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z'
                                  clipRule='evenodd'
                                />
                              </svg>
                            </div>
                            <p
                              className='mb-0 small fw-semibold'
                              style={{
                                color:
                                  documentType === type.value
                                    ? '#1e40af'
                                    : '#475569',
                              }}
                            >
                              {type.label}
                            </p>
                            {type.autoSigned && (
                              <span
                                className='badge mt-1'
                                style={{
                                  backgroundColor: '#10b981',
                                  color: 'white',
                                  fontSize: '10px',
                                  borderRadius: '8px',
                                }}
                              >
                                Auto-signed
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Signature Status for non-auto-signed documents */}
                {documentType &&
                  !documentTypes.find((dt) => dt.value === documentType)
                    ?.autoSigned && (
                    <div className='mb-4'>
                      <label
                        className='form-label fw-semibold mb-3'
                        style={{ color: '#334155' }}
                      >
                        Signature Status
                      </label>
                      <div
                        className='card border-0'
                        style={{
                          background:
                            'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                          borderRadius: '16px',
                          border: '2px solid #e2e8f0',
                        }}
                      >
                        <div className='card-body p-3'>
                          <div className='form-check'>
                            <input
                              className='form-check-input'
                              type='checkbox'
                              id='isSignedCheck'
                              checked={isSigned}
                              onChange={(e) => setIsSigned(e.target.checked)}
                              style={{
                                borderRadius: '6px',
                                width: '20px',
                                height: '20px',
                              }}
                            />
                            <label
                              className='form-check-label fw-semibold ms-2'
                              htmlFor='isSignedCheck'
                              style={{ color: '#374151' }}
                            >
                              This document is signed
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                {/* File Upload Area */}
                <div className='mb-4'>
                  <label
                    className='form-label fw-semibold mb-3'
                    style={{ color: '#334155' }}
                  >
                    Upload Document
                  </label>
                  <div
                    className={`card border-0 ${
                      dragActive ? 'border-primary' : ''
                    }`}
                    style={{
                      borderRadius: '20px',
                      border: dragActive
                        ? '3px dashed #3b82f6'
                        : selectedFile
                        ? '3px solid #10b981'
                        : '3px dashed #cbd5e1',
                      background: dragActive
                        ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                        : selectedFile
                        ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                        : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className='card-body p-4 text-center'>
                      {selectedFile ? (
                        <div>
                          <div
                            className='d-flex align-items-center justify-content-center mb-3'
                            style={{
                              width: '64px',
                              height: '64px',
                              background:
                                'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              borderRadius: '20px',
                              color: 'white',
                              margin: '0 auto',
                            }}
                          >
                            <svg
                              width='32'
                              height='32'
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
                          <h6
                            className='fw-bold mb-2'
                            style={{ color: '#065f46' }}
                          >
                            File Selected
                          </h6>
                          <p className='mb-0 small text-muted'>
                            {selectedFile.name}
                          </p>
                          <p className='mb-0 small text-muted'>
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div
                            className='d-flex align-items-center justify-content-center mb-3'
                            style={{
                              width: '64px',
                              height: '64px',
                              background:
                                'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                              borderRadius: '20px',
                              color: 'white',
                              margin: '0 auto',
                            }}
                          >
                            <svg
                              width='32'
                              height='32'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path d='M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z' />
                            </svg>
                          </div>
                          <h6
                            className='fw-bold mb-2'
                            style={{ color: '#374151' }}
                          >
                            {dragActive
                              ? 'Drop file here'
                              : 'Choose file or drag here'}
                          </h6>
                          <p className='mb-0 small text-muted'>
                            PDF, Word documents, or images (max 10MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type='file'
                    className='d-none'
                    accept='.pdf,.doc,.docx,.jpg,.jpeg,.png'
                    onChange={handleFileSelect}
                  />
                </div>

                {/* Error Messages */}
                {errors.length > 0 && (
                  <div
                    className='alert border-0 mb-4'
                    style={{
                      background:
                        'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                      color: '#dc2626',
                      borderRadius: '16px',
                      border: '2px solid #fca5a5',
                    }}
                  >
                    <div className='d-flex align-items-center gap-2'>
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
                      <div>
                        {errors.map((error, index) => (
                          <p key={index} className='mb-0 small fw-semibold'>
                            {error}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {!showWarning && (
            <div
              className='modal-footer border-0 p-4'
              style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              <div className='d-flex gap-3 w-100'>
                <button
                  type='button'
                  className='btn flex-fill fw-semibold'
                  style={{
                    backgroundColor: '#e2e8f0',
                    color: '#475569',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '12px',
                  }}
                  onClick={handleClose}
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type='button'
                  className='btn flex-fill fw-semibold'
                  style={{
                    background:
                      selectedFile && documentType
                        ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                        : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '12px',
                    boxShadow:
                      selectedFile && documentType
                        ? '0 8px 32px rgba(59, 130, 246, 0.3)'
                        : 'none',
                  }}
                  onClick={handleUpload}
                  disabled={!selectedFile || !documentType || isUploading}
                >
                  {isUploading ? (
                    <div className='d-flex align-items-center justify-content-center gap-2'>
                      <div
                        className='spinner-border spinner-border-sm'
                        role='status'
                        style={{ width: '16px', height: '16px' }}
                      />
                      Uploading...
                    </div>
                  ) : (
                    'Upload Document'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .transition-all {
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default ManualDocumentUploadModal;
