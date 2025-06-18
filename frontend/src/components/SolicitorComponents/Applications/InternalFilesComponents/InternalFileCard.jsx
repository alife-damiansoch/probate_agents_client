// InternalFileCard.jsx
import ConfirmModal from '../../../GenericComponents/DeleteConfirm/ConfirmModal.jsx';
import { useConfirmation } from '../../../GenericComponents/DeleteConfirm/UseConfirmationHook.jsx';
import {
  deleteData,
  downloadFileAxios,
} from '../../../GenericFunctions/AxiosGenericFunctions.jsx';

const InternalFileCard = ({
  file,
  isAdmin,
  token,
  onEditClick,
  setErrorMessage,
  setSuccessMessage,
  refresh,
  setRefresh,
}) => {
  const { confirmState, requestConfirmation, handleConfirm } =
    useConfirmation();

  const getFileTypeStyle = () => {
    return {
      backgroundColor: '#f0f9ff',
      color: '#0369a1',
      border: '1px solid #0ea5e9',
      iconBg: '#0ea5e9',
    };
  };

  const downloadFile = async (fileId, fileTitle) => {
    try {
      const endpoint = `/api/internal-files/${fileId}/download/`;
      const response = await downloadFileAxios(token, endpoint);

      // Get the original filename from the file field or use title as fallback
      const originalFileName = file.file
        ? file.file.split('/').pop()
        : `${fileTitle}.bin`;

      // Create blob with proper content type based on file extension
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', originalFileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      setErrorMessage(['Error downloading file']);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      const endpoint = `/api/internal-files/${fileId}/`;
      const response = await deleteData(endpoint);
      if (response.status === 204) {
        setSuccessMessage(['Internal file deleted successfully']);
        setRefresh(!refresh);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage(['Error deleting file']);
      }
    }
  };

  const handleDeleteClick = async (file) => {
    // Create a document object that matches what ConfirmModal expects
    const documentForConfirmation = {
      ...file,
      name: file.title, // For components expecting 'name'
      original_name: file.title, // For components expecting 'original_name'
      document: file.title, // For components expecting 'document'
      title: file.title, // Keep original title
    };

    const userConfirmed = await requestConfirmation(documentForConfirmation);
    if (userConfirmed) {
      await deleteFile(file.id);
    }
  };

  // Helper function to get file extension icon
  const getFileIcon = () => {
    if (!file.file) return getDefaultFileIcon();

    const extension = file.file.split('.').pop()?.toLowerCase();

    switch (extension) {
      case 'pdf':
        return (
          <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
              clipRule='evenodd'
            />
          </svg>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return (
          <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
              clipRule='evenodd'
            />
          </svg>
        );
      case 'doc':
      case 'docx':
        return (
          <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm6 6a1 1 0 01-1 1H7a1 1 0 110-2h2a1 1 0 011 1zm-1 4a1 1 0 100-2H7a1 1 0 100 2h2z'
              clipRule='evenodd'
            />
          </svg>
        );
      default:
        return getDefaultFileIcon();
    }
  };

  const getDefaultFileIcon = () => (
    <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>
      <path
        fillRule='evenodd'
        d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
        clipRule='evenodd'
      />
    </svg>
  );

  // Helper function to display file info
  const getFileInfo = () => {
    if (!file.file) return null;

    const fileName = file.file.split('/').pop();
    const extension = fileName.split('.').pop()?.toUpperCase();

    return (
      <span
        className='px-2 py-1 rounded-pill'
        style={{
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          color: '#4f46e5',
          fontSize: '0.7rem',
          fontWeight: '600',
        }}
      >
        {extension || 'FILE'}
      </span>
    );
  };

  const typeStyle = getFileTypeStyle();

  return (
    <>
      <div
        className='p-4 rounded-3 position-relative'
        style={{
          ...typeStyle,
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.02)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* File Header */}
        <div className='d-flex align-items-start gap-3 mb-3'>
          <div
            className='d-flex align-items-center justify-content-center rounded-3 flex-shrink-0'
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: typeStyle.iconBg,
              color: 'white',
            }}
          >
            {getFileIcon()}
          </div>
          <div className='flex-grow-1 min-w-0'>
            <h6
              className='mb-1 fw-bold text-truncate'
              style={{ color: typeStyle.color, fontSize: '1rem' }}
            >
              {file.title}
            </h6>
            {file.description && (
              <p
                className='mb-2 opacity-75'
                style={{
                  fontSize: '0.85rem',
                  color: typeStyle.color,
                  lineHeight: '1.4',
                }}
              >
                {file.description}
              </p>
            )}
            <div className='d-flex gap-2 flex-wrap'>
              {file.created_at && (
                <span
                  className='px-2 py-1 rounded-pill'
                  style={{
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    color: '#16a34a',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                  }}
                >
                  {new Date(file.created_at).toLocaleDateString()}
                </span>
              )}
              {getFileInfo()}
              <span
                className='px-2 py-1 rounded-pill'
                style={{
                  backgroundColor: 'rgba(156, 163, 175, 0.2)',
                  color: '#6b7280',
                  fontSize: '0.7rem',
                  fontWeight: '600',
                }}
              >
                ID: {file.id}
              </span>
              {file.uploaded_by && (
                <span
                  className='px-2 py-1 rounded-pill'
                  style={{
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    color: '#7c3aed',
                    fontSize: '0.7rem',
                    fontWeight: '600',
                  }}
                >
                  By: {file.uploaded_by}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='d-flex gap-2 justify-content-end'>
          <button
            className='btn btn-sm px-3 py-2 rounded-3 d-flex align-items-center gap-2'
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: '600',
            }}
            onClick={() => downloadFile(file.id, file.title)}
          >
            <svg width='14' height='14' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
            Download
          </button>

          {isAdmin && (
            <>
              <button
                className='btn btn-sm px-3 py-2 rounded-3 d-flex align-items-center gap-2'
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#d97706',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                }}
                onClick={() => onEditClick(file)}
              >
                <svg
                  width='14'
                  height='14'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                </svg>
                Edit
              </button>

              <button
                className='btn btn-sm px-3 py-2 rounded-3 d-flex align-items-center gap-2'
                style={{
                  background: 'rgba(220, 38, 38, 0.1)',
                  border: '1px solid rgba(220, 38, 38, 0.2)',
                  color: '#dc2626',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                }}
                onClick={() => handleDeleteClick(file)}
              >
                <svg
                  width='14'
                  height='14'
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
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmState.isOpen}
        document={confirmState.document}
        onConfirm={(result) => handleConfirm(result)}
        onCancel={() => handleConfirm(false)}
      />
    </>
  );
};

export default InternalFileCard;
