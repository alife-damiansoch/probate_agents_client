// InternalFileEditModal.jsx
import { useEffect, useState } from 'react';
import { patchData } from '../../../GenericFunctions/AxiosGenericFunctions.jsx';

const InternalFileEditModal = ({
  isOpen,
  onClose,
  selectedFile,
  token,
  setSuccessMessage,
  setErrorMessage,
  refresh,
  setRefresh,
  loading,
  setLoading,
  clearMessages,
}) => {
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
  });

  // Update form when selectedFile changes
  useEffect(() => {
    if (selectedFile) {
      setEditForm({
        title: selectedFile.title || '',
        description: selectedFile.description || '',
      });
    }
  }, [selectedFile]);

  const handleEdit = async (e) => {
    e.preventDefault();
    if (!editForm.title) {
      setErrorMessage(['Title is required']);
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      const endpoint = `/api/internal-files/${selectedFile.id}/`;
      const response = await patchData(endpoint, editForm);

      if (response.status === 200) {
        setSuccessMessage(['Internal file updated successfully']);
        onClose();
        setRefresh(!refresh);
      }
    } catch (error) {
      console.error('Error updating file:', error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage(['Error updating file']);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEditForm({ title: '', description: '' });
    onClose();
  };

  if (!isOpen || !selectedFile) return null;

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
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
                <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
              </svg>
              Edit Internal File
            </h5>
            <button
              type='button'
              className='btn-close btn-close-white'
              onClick={handleClose}
            ></button>
          </div>
          <div className='modal-body p-4'>
            <div
              className='mb-3 p-3 rounded-3'
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <h6 className='mb-1 fw-semibold text-muted'>Current File:</h6>
              <p className='mb-0' style={{ fontSize: '0.9rem' }}>
                {selectedFile.title}
              </p>
              {selectedFile.description && (
                <p className='mb-0 text-muted' style={{ fontSize: '0.8rem' }}>
                  {selectedFile.description}
                </p>
              )}
            </div>

            <form onSubmit={handleEdit}>
              <div className='mb-3'>
                <label className='form-label fw-semibold'>
                  Title <span className='text-danger'>*</span>
                </label>
                <input
                  type='text'
                  className='form-control rounded-3'
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  placeholder='Enter file title'
                  required
                />
              </div>
              <div className='mb-4'>
                <label className='form-label fw-semibold'>Description</label>
                <textarea
                  className='form-control rounded-3'
                  rows='3'
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  placeholder='Enter file description (optional)'
                />
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
                  className='btn btn-warning rounded-3 px-4'
                  disabled={loading}
                  style={{
                    background:
                      'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    border: 'none',
                    color: 'white',
                  }}
                >
                  {loading ? (
                    <>
                      <span
                        className='spinner-border spinner-border-sm me-2'
                        role='status'
                        aria-hidden='true'
                      ></span>
                      Updating...
                    </>
                  ) : (
                    'Update'
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

export default InternalFileEditModal;
