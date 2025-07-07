import {
  AlertCircle,
  CheckCircle2,
  Cloud,
  File,
  FileText,
  Image,
  Loader2,
  Paperclip,
  Upload,
  X,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { uploadFile } from '../../../GenericFunctions/AxiosGenericFunctions';

const UploadFile = ({ refresh, setRefresh }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadStatusType, setUploadStatusType] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Modern styles matching the design system
  const styles = {
    container: {
      position: 'relative',
    },
    dropZone: {
      border: '2px dashed rgba(139, 92, 246, 0.3)',
      borderRadius: '1rem',
      padding: '3rem 2rem',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      backgroundColor: 'rgba(30, 41, 59, 0.5)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    },
    dropZoneActive: {
      borderColor: 'rgba(139, 92, 246, 0.6)',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      transform: 'scale(1.02)',
    },
    uploadIcon: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1.5rem',
      boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
    },
    filePreview: {
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '0.75rem',
      padding: '1rem',
      marginTop: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    fileIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '0.5rem',
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '1rem',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    },
    uploadButton: {
      background: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)',
      border: 'none',
      borderRadius: '0.75rem',
      color: 'white',
      padding: '0.75rem 2rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
      width: '100%',
      justifyContent: 'center',
      marginTop: '1.5rem',
    },
    disabledButton: {
      background: 'rgba(107, 114, 128, 0.5)',
      color: 'rgba(255, 255, 255, 0.5)',
      boxShadow: 'none',
      cursor: 'not-allowed',
    },
    removeButton: {
      background: 'none',
      border: 'none',
      color: '#ef4444',
      cursor: 'pointer',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      transition: 'all 0.3s ease',
    },
    alert: {
      borderRadius: '0.75rem',
      padding: '1rem',
      marginTop: '1.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    successAlert: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      color: '#a7f3d0',
    },
    errorAlert: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      color: '#fca5a5',
    },
    infoAlert: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      color: '#93c5fd',
    },
    progressBar: {
      width: '100%',
      height: '4px',
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      borderRadius: '2px',
      overflow: 'hidden',
      marginTop: '1rem',
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)',
      borderRadius: '2px',
      transition: 'width 0.3s ease',
    },
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus('');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);

    const files = event.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
      setUploadStatus('');
    }
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setUploadStatus('Please select a file first.');
      setUploadStatusType('error');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await uploadFile(
        '/api/downloadableFiles/add/',
        formData
      );
      if (response && response.status === 201) {
        setUploadStatus(
          `File "${response.data.filename}" uploaded successfully.`
        );
        setUploadStatusType('success');
        setSelectedFile(null);
        setRefresh(!refresh);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setUploadStatus(response.data.error || 'Error uploading file');
        setUploadStatusType('error');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Failed to upload file.');
      setUploadStatusType('error');
    } finally {
      setIsUploading(false);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setUploadStatus('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getFileIcon = (file) => {
    if (!file) return <FileText className='text-white' size={20} />;

    const fileType = file.type;
    if (fileType.startsWith('image/')) {
      return <Image className='text-white' size={20} />;
    } else if (fileType.includes('pdf')) {
      return <FileText className='text-white' size={20} />;
    } else {
      return <File className='text-white' size={20} />;
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getAlertStyle = () => {
    switch (uploadStatusType) {
      case 'success':
        return styles.successAlert;
      case 'error':
        return styles.errorAlert;
      default:
        return styles.infoAlert;
    }
  };

  const getAlertIcon = () => {
    switch (uploadStatusType) {
      case 'success':
        return <CheckCircle2 size={16} />;
      case 'error':
        return <AlertCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  return (
    <div style={styles.container}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type='file'
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept='.pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif'
      />

      {/* Upload Form */}
      <form onSubmit={handleFileUpload}>
        {/* Drop Zone */}
        <div
          style={{
            ...styles.dropZone,
            ...(isDragOver ? styles.dropZoneActive : {}),
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div style={styles.uploadIcon}>
            <Cloud className='text-white' size={32} />
          </div>

          <h5 className='text-white mb-2 fw-bold'>
            {selectedFile ? 'File Selected' : 'Upload Your File'}
          </h5>

          <p className='text-muted mb-3'>
            {selectedFile
              ? 'Click upload to proceed or drag a different file'
              : 'Drag and drop your file here, or click to browse'}
          </p>

          <div className='small text-muted'>
            Supported formats: PDF, DOC, DOCX, XLS, XLSX, TXT, Images
          </div>
        </div>

        {/* File Preview */}
        {selectedFile && (
          <div style={styles.filePreview}>
            <div className='d-flex align-items-center flex-grow-1'>
              <div style={styles.fileIcon}>{getFileIcon(selectedFile)}</div>
              <div>
                <div className='text-white fw-medium'>
                  {selectedFile.name.length > 30
                    ? selectedFile.name.substring(0, 30) + '...'
                    : selectedFile.name}
                </div>
                <div className='small text-muted'>
                  {formatFileSize(selectedFile.size)} •{' '}
                  {selectedFile.type || 'Unknown type'}
                </div>
              </div>
            </div>

            <button
              type='button'
              style={styles.removeButton}
              onClick={removeSelectedFile}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
              title='Remove file'
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Upload Button */}
        <button
          type='submit'
          style={{
            ...styles.uploadButton,
            ...(!selectedFile || isUploading ? styles.disabledButton : {}),
          }}
          disabled={!selectedFile || isUploading}
          onMouseEnter={(e) => {
            if (selectedFile && !isUploading) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 16px rgba(139, 92, 246, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow =
              selectedFile && !isUploading
                ? '0 4px 12px rgba(139, 92, 246, 0.3)'
                : 'none';
          }}
        >
          {isUploading ? (
            <>
              <Loader2 size={16} className='spinner-border spinner-border-sm' />
              Uploading...
            </>
          ) : (
            <>
              <Upload size={16} />
              {selectedFile ? 'Upload File' : 'Select File First'}
            </>
          )}
        </button>

        {/* Upload Progress */}
        {isUploading && (
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: '100%',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
          </div>
        )}
      </form>

      {/* Status Message */}
      {uploadStatus && (
        <div style={{ ...styles.alert, ...getAlertStyle() }}>
          {getAlertIcon()}
          {uploadStatus}
        </div>
      )}

      {/* Upload Tips */}
      <div
        style={{
          backgroundColor: 'rgba(30, 41, 59, 0.3)',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '0.5rem',
          padding: '1rem',
          marginTop: '1.5rem',
        }}
      >
        <h6 className='text-white mb-2 fw-medium d-flex align-items-center'>
          <Paperclip size={16} className='me-2' />
          Upload Guidelines
        </h6>
        <div className='small text-muted'>
          <div className='mb-1'>• Maximum file size: 50MB</div>
          <div className='mb-1'>
            • Supported formats: Documents, spreadsheets, and images
          </div>
          <div>• Files are automatically scanned for security</div>
        </div>
      </div>
    </div>
  );
};

export default UploadFile;
