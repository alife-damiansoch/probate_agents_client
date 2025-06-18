// InternalFileUploadModal.jsx
import { useState } from 'react';
import { uploadFile } from '../../../GenericFunctions/AxiosGenericFunctions.jsx';

const InternalFileUploadModal = ({
  isOpen,
  onClose,
  applicationId,
  token,
  setSuccessMessage,
  setErrorMessage,
  refresh,
  setRefresh,
  loading,
  setLoading,
  clearMessages,
}) => {
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    file: null,
  });

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.title || !uploadForm.file) {
      setErrorMessage(['Title and file are required']);
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      const formData = new FormData();
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('file', uploadForm.file);
      // Add application_id to the form data since the serializer expects it
      formData.append('application_id', applicationId);

      const endpoint = `/api/internal-files/application/${applicationId}/`;
      const response = await uploadFile(endpoint, formData);

      if (response.status === 201) {
        setSuccessMessage(['Internal file uploaded successfully']);
        setUploadForm({ title: '', description: '', file: null });
        onClose();
        setRefresh(!refresh);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage(['Error uploading file']);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUploadForm({ title: '', description: '', file: null });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className='modal d-block'
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1050,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className='modal-dialog modal-lg'>
        <div
          className='modal-content rounded-4 border-0'
          style={{
            boxShadow:
              '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div
            className='modal-header border-0 pb-0'
            style={{
              background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
              color: 'white',
              borderRadius: '1rem 1rem 0 0',
            }}
          >
            <h5 className='modal-title fw-bold d-flex align-items-center gap-2'>
              <svg
                width='20'
                height='20'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                  clipRule='evenodd'
                />
              </svg>
              Upload Internal File
            </h5>
            <button
              type='button'
              className='btn-close btn-close-white'
              onClick={handleClose}
            ></button>
          </div>
          <div className='modal-body p-4'>
            <form onSubmit={handleUpload}>
              <div className='mb-3'>
                <label className='form-label fw-semibold'>
                  Title <span className='text-danger'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control rounded-3'
                  value={uploadForm.title}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, title: e.target.value })
                  }
                  placeholder='Enter file title'
                  required
                />
              </div>
              <div className='mb-3'>
                <label className='form-label fw-semibold'>Description</label>
                <textarea
                  className='form-control rounded-3'
                  rows='3'
                  value={uploadForm.description}
                  onChange={(e) =>
                    setUploadForm({
                      ...uploadForm,
                      description: e.target.value,
                    })
                  }
                  placeholder='Enter file description (optional)'
                />
              </div>
              <div className='mb-4'>
                <label className='form-label fw-semibold'>
                  File <span className='text-danger'>*</span>
                </label>
                <input
                  type='file'
                  className='form-control rounded-3'
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, file: e.target.files[0] })
                  }
                  required
                />
                {uploadForm.file && (
                  <div className='mt-2'>
                    <small className='text-muted'>
                      Selected: {uploadForm.file.name}
                    </small>
                  </div>
                )}
              </div>
              <div className='d-flex gap-2 justify-content-end'>
                <button
                  type='button'
                  className='btn btn-secondary rounded-3 px-4'
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='btn btn-primary rounded-3 px-4'
                  disabled={loading}
                  style={{
                    background:
                      'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
                    border: 'none',
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        className='spinner-border spinner-border-sm me-2'
                        role='status'
                        aria-hidden='true'
                      ></span>
                      Uploading...
                    </>
                  ) : (
                    'Upload'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternalFileUploadModal;
