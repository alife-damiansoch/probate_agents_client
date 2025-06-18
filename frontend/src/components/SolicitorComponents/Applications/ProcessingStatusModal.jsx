import { useEffect, useState } from 'react';

const ProcessingStatusModal = ({ isOpen, onClose, application, onConfirm }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [confirmationChecked, setConfirmationChecked] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      setSelectedMethod('');
      setConfirmationChecked(false);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleConfirm = () => {
    if (selectedMethod && confirmationChecked) {
      onConfirm(selectedMethod);
      handleClose();
    }
  };

  const isConfirmEnabled = selectedMethod && confirmationChecked;

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className='position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
      style={{
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        opacity: isClosing ? 0 : 1,
        transition: 'all 0.3s ease',
      }}
      onClick={handleClose}
    >
      <div
        className='position-relative mx-3'
        style={{
          maxWidth: '1000px',
          width: '100%',
          maxHeight: '85vh',
          transform: isClosing ? 'scale(0.95)' : 'scale(1)',
          transition: 'all 0.3s ease',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className='rounded-4 overflow-hidden d-flex flex-column'
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
            maxHeight: '85vh',
          }}
        >
          {/* Header */}
          <div
            className='p-3 flex-shrink-0'
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            }}
          >
            <div className='d-flex align-items-center justify-content-between'>
              <div className='d-flex align-items-center'>
                <div
                  className='me-3 d-flex align-items-center justify-content-center rounded-circle'
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <span style={{ fontSize: '1.3rem' }}>🤝</span>
                </div>
                <div>
                  <h5 className='mb-0 fw-bold text-white'>
                    Application Details Confirmation
                  </h5>
                  <p className='mb-0 text-white opacity-75 small'>
                    Application #{application?.id}
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className='btn btn-link text-white p-1'
                style={{ fontSize: '1.5rem', textDecoration: 'none' }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className='flex-grow-1 overflow-auto p-4'>
            <div className='row g-3'>
              {/* Left Column - Instructions */}
              <div className='col-lg-4'>
                <div
                  className='p-3 rounded-3 h-100'
                  style={{
                    background:
                      'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    border: '1px solid #f59e0b',
                  }}
                >
                  <div className='d-flex align-items-start'>
                    <div
                      className='me-2 p-2 rounded-circle flex-shrink-0'
                      style={{
                        background: '#f59e0b',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: '0.9rem' }}>📞</span>
                    </div>
                    <div>
                      <h6
                        className='fw-bold mb-2'
                        style={{ color: '#92400e', fontSize: '0.9rem' }}
                      >
                        Contact Solicitor Required
                      </h6>
                      <p
                        className='mb-2 small'
                        style={{ color: '#78350f', lineHeight: '1.4' }}
                      >
                        You must contact the solicitor to:
                      </p>
                      <ul
                        className='mb-2 small'
                        style={{
                          color: '#78350f',
                          lineHeight: '1.3',
                          paddingLeft: '1rem',
                        }}
                      >
                        <li>
                          Verify all application details are correct and
                          completed
                        </li>
                        <li>
                          Confirm their preferred identity verification method
                        </li>
                        <li>Obtain specific details for the chosen method</li>
                      </ul>
                      <div
                        className='p-2 rounded-2 small'
                        style={{
                          background: '#f59e0b',
                          color: 'white',
                          fontWeight: '500',
                        }}
                      >
                        <strong>⚠️ Warning:</strong> Confirming will lock the
                        application permanently
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Options */}
              <div className='col-lg-8'>
                <h6 className='fw-bold mb-3' style={{ color: '#1f2937' }}>
                  Select Identity Verification Method
                </h6>

                <div className='row g-2 mb-3'>
                  {/* KYC Option */}
                  <div className='col-md-6'>
                    <div
                      className='p-3 rounded-3 cursor-pointer position-relative'
                      style={{
                        background:
                          selectedMethod === 'KYC'
                            ? 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)'
                            : '#f8fafc',
                        border:
                          selectedMethod === 'KYC'
                            ? '2px solid #3b82f6'
                            : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        transform:
                          selectedMethod === 'KYC' ? 'scale(1.01)' : 'scale(1)',
                      }}
                      onClick={() => setSelectedMethod('KYC')}
                    >
                      {selectedMethod === 'KYC' && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: '#3b82f6',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.7rem',
                          }}
                        >
                          ✓
                        </div>
                      )}
                      <div className='text-center'>
                        <div
                          className='mb-2 mx-auto'
                          style={{
                            width: '40px',
                            height: '40px',
                            background:
                              selectedMethod === 'KYC' ? '#3b82f6' : '#6b7280',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                          }}
                        >
                          🔍
                        </div>
                        <h6
                          className='fw-bold mb-1 small'
                          style={{
                            color:
                              selectedMethod === 'KYC' ? '#1e40af' : '#374151',
                          }}
                        >
                          KYC Verification
                        </h6>
                        <p
                          className='mb-0'
                          style={{
                            color:
                              selectedMethod === 'KYC' ? '#1e3a8a' : '#6b7280',
                            fontSize: '0.75rem',
                          }}
                        >
                          KYC Letter from Solicitor
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* AML Option */}
                  <div className='col-md-6'>
                    <div
                      className='p-3 rounded-3 cursor-pointer position-relative'
                      style={{
                        background:
                          selectedMethod === 'AML'
                            ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                            : '#f8fafc',
                        border:
                          selectedMethod === 'AML'
                            ? '2px solid #10b981'
                            : '1px solid #e2e8f0',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        transform:
                          selectedMethod === 'AML' ? 'scale(1.01)' : 'scale(1)',
                      }}
                      onClick={() => setSelectedMethod('AML')}
                    >
                      {selectedMethod === 'AML' && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '8px',
                            right: '8px',
                            background: '#10b981',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.7rem',
                          }}
                        >
                          ✓
                        </div>
                      )}
                      <div className='text-center'>
                        <div
                          className='mb-2 mx-auto'
                          style={{
                            width: '40px',
                            height: '40px',
                            background:
                              selectedMethod === 'AML' ? '#10b981' : '#6b7280',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                          }}
                        >
                          📄
                        </div>
                        <h6
                          className='fw-bold mb-1 small'
                          style={{
                            color:
                              selectedMethod === 'AML' ? '#065f46' : '#374151',
                          }}
                        >
                          Photo ID + Address
                        </h6>
                        <p
                          className='mb-0'
                          style={{
                            color:
                              selectedMethod === 'AML' ? '#064e3b' : '#6b7280',
                            fontSize: '0.75rem',
                          }}
                        >
                          Upload documents
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Method Description */}
                {selectedMethod && (
                  <div
                    className='p-3 rounded-3 mb-3 small'
                    style={{
                      background:
                        selectedMethod === 'KYC'
                          ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
                          : 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                      border:
                        selectedMethod === 'KYC'
                          ? '1px solid #bfdbfe'
                          : '1px solid #a7f3d0',
                    }}
                  >
                    <p
                      className='mb-0'
                      style={{
                        color: selectedMethod === 'KYC' ? '#1e3a8a' : '#064e3b',
                        lineHeight: '1.4',
                      }}
                    >
                      {selectedMethod === 'KYC'
                        ? "A KYC Letter from the Solicitor stating they have verified the borrower's identity and address. This scanned letter must be on official solicitor letterhead with the firm's name and details."
                        : 'Traditional method where borrowers upload government-issued photo ID and proof of address documents for manual verification.'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Confirmation Section */}
            <div
              className='mt-3 pt-3'
              style={{ borderTop: '1px solid #e5e7eb' }}
            >
              <div
                className='p-3 rounded-3'
                style={{
                  background:
                    'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                  border: '1px solid #f87171',
                }}
              >
                <div
                  className='d-flex align-items-start cursor-pointer'
                  onClick={() => setConfirmationChecked(!confirmationChecked)}
                >
                  <div
                    className='me-3 mt-1 flex-shrink-0'
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: '2px solid #dc2626',
                      backgroundColor: confirmationChecked
                        ? '#dc2626'
                        : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {confirmationChecked && (
                      <span
                        style={{
                          color: 'white',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                  <div>
                    <p
                      className='mb-1 fw-semibold small'
                      style={{ color: '#7f1d1d' }}
                    >
                      I understand that no more edits will be allowed
                    </p>
                    <p
                      className='mb-0'
                      style={{
                        color: '#991b1b',
                        fontSize: '0.8rem',
                        lineHeight: '1.4',
                      }}
                    >
                      I confirm that I have contacted the solicitor, verified
                      all application details, and understand this will
                      permanently lock the application.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div
            className='p-3 flex-shrink-0'
            style={{
              background: 'rgba(248, 250, 252, 0.9)',
              borderTop: '1px solid #e5e7eb',
            }}
          >
            <div className='d-flex gap-2 justify-content-end'>
              <button
                onClick={handleClose}
                className='btn btn-outline-secondary px-4 py-2'
                style={{ fontSize: '0.9rem' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!isConfirmEnabled}
                className='btn px-4 py-2 text-white'
                style={{
                  background: isConfirmEnabled
                    ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                    : '#d1d5db',
                  border: 'none',
                  cursor: isConfirmEnabled ? 'pointer' : 'not-allowed',
                  fontSize: '0.9rem',
                }}
              >
                {isConfirmEnabled
                  ? 'Confirm & Lock Application'
                  : 'Complete Selection First'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessingStatusModal;
