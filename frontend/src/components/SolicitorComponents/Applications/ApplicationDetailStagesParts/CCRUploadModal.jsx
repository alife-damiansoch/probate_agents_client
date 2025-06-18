import { useEffect, useState } from 'react';

const CCRUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title) return;

    setIsUploading(true);
    await onUpload(file, title, description);
    setIsUploading(false);
    handleClose();
  };

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
          maxWidth: '600px',
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
              background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
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
                  <span style={{ fontSize: '1.3rem' }}>📁</span>
                </div>
                <div>
                  <h5 className='mb-0 fw-bold text-white'>Upload CCR File</h5>
                  <p className='mb-0 text-white opacity-75 small'>
                    Securely upload and review the CCR file
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
            <div className='mb-3'>
              <h6 className='fw-bold mb-2' style={{ color: '#1f2937' }}>
                Upload Details
              </h6>
              <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                  <label
                    className='form-label small'
                    style={{ color: '#4b5563' }}
                  >
                    Title <span className='text-danger'>*</span>
                  </label>
                  <input
                    type='text'
                    className='form-control form-control-sm'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ fontSize: '0.9rem' }}
                  />
                </div>
                <div className='mb-3'>
                  <label
                    className='form-label small'
                    style={{ color: '#4b5563' }}
                  >
                    Description
                  </label>
                  <textarea
                    className='form-control form-control-sm'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ fontSize: '0.9rem' }}
                  />
                </div>
                <div className='mb-4'>
                  <label
                    className='form-label small'
                    style={{ color: '#4b5563' }}
                  >
                    File <span className='text-danger'>*</span>
                  </label>
                  <input
                    type='file'
                    className='form-control form-control-sm'
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                    style={{ fontSize: '0.9rem' }}
                  />
                </div>
                <div
                  className='p-3 rounded-3 mb-3 small'
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
                      <span style={{ fontSize: '0.9rem' }}>ℹ️</span>
                    </div>
                    <div>
                      <p
                        className='mb-0'
                        style={{ color: '#78350f', lineHeight: '1.4' }}
                      >
                        Upload the final CCR file in PDF or DOCX format. Ensure
                        it contains all verified applicant data for review.
                      </p>
                    </div>
                  </div>
                </div>
              </form>
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
                onClick={handleSubmit}
                disabled={!file || !title || isUploading}
                className='btn px-4 py-2 text-white'
                style={{
                  background:
                    !file || !title || isUploading
                      ? '#d1d5db'
                      : 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
                  border: 'none',
                  cursor:
                    !file || !title || isUploading ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem',
                }}
              >
                {isUploading ? 'Uploading...' : 'Upload CCR File'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCRUploadModal;
