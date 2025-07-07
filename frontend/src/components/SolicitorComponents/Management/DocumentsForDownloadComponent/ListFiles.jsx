import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Download,
  File,
  FileText,
  FolderOpen,
  HardDrive,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  deleteData,
  downloadFileAxios,
  fetchData,
} from '../../../GenericFunctions/AxiosGenericFunctions';

const ListFiles = ({ refresh, setRefresh }) => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Modern styles matching the design system
  const styles = {
    container: {
      position: 'relative',
    },
    searchBar: {
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '0.75rem',
      color: 'white',
      padding: '0.75rem 1rem 0.75rem 2.5rem',
      fontSize: '0.875rem',
      width: '100%',
      transition: 'all 0.3s ease',
    },
    searchWrapper: {
      position: 'relative',
      marginBottom: '1.5rem',
    },
    searchIcon: {
      position: 'absolute',
      left: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'rgba(255, 255, 255, 0.5)',
      pointerEvents: 'none',
    },
    fileCard: {
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '0.75rem',
      padding: '1rem',
      marginBottom: '0.75rem',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 16px rgba(139, 92, 246, 0.1)',
    },
    fileIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '0.5rem',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '1rem',
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
    },
    actionButton: {
      background: 'none',
      border: 'none',
      borderRadius: '0.5rem',
      padding: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '36px',
      height: '36px',
    },
    downloadButton: {
      color: '#10b981',
      '&:hover': {
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
      },
    },
    deleteButton: {
      color: '#ef4444',
      '&:hover': {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
      },
    },
    alert: {
      borderRadius: '0.75rem',
      padding: '1rem',
      marginBottom: '1.5rem',
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
    emptyState: {
      backgroundColor: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '0.75rem',
      padding: '3rem 2rem',
      textAlign: 'center',
    },
    statsCard: {
      backgroundColor: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1.5rem',
    },
  };

  useEffect(() => {
    fetchFiles();
  }, [refresh]);

  useEffect(() => {
    // Filter files based on search term
    const filtered = files.filter((file) =>
      file.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFiles(filtered);
  }, [files, searchTerm]);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetchData(null, '/api/downloadableFiles/list/');
      if (response && response.status === 200) {
        setFiles(response.data);
        setStatusType('success');
        setStatusMessage('');
      } else {
        setStatusMessage('Failed to load files.');
        setStatusType('danger');
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      setStatusMessage('Error fetching files.');
      setStatusType('danger');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = async (filename) => {
    if (!window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      return;
    }

    try {
      const response = await deleteData(
        `/api/downloadableFiles/delete/${filename}/`
      );
      if (response && response.status === 200) {
        setStatusMessage(`File "${filename}" deleted successfully.`);
        setStatusType('success');
        await fetchFiles();
        setRefresh(!refresh);
      } else {
        setStatusMessage(response.data.error || 'Failed to delete file.');
        setStatusType('danger');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      setStatusMessage('Failed to delete file.');
      setStatusType('danger');
    }
  };

  const downloadFile = async (filename) => {
    try {
      const response = await downloadFileAxios(
        null,
        `/api/downloadableFiles/download/${filename}`
      );
      if (response && response.status === 200) {
        const blob = new Blob([response.data], {
          type: response.headers['content-type'],
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        setStatusMessage(`File "${filename}" downloaded successfully.`);
        setStatusType('success');
      } else {
        setStatusMessage('Failed to download file.');
        setStatusType('danger');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      setStatusMessage('Error downloading file.');
      setStatusType('danger');
    }
  };

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className='text-white' size={20} />;
      case 'doc':
      case 'docx':
        return <File className='text-white' size={20} />;
      case 'xls':
      case 'xlsx':
        return <File className='text-white' size={20} />;
      default:
        return <File className='text-white' size={20} />;
    }
  };

  const formatFileSize = (filename) => {
    // This is a placeholder - you might want to get actual file sizes from the API
    return `${Math.floor(Math.random() * 100) + 1} KB`;
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div className='text-center py-5'>
          <div className='spinner-border text-primary mb-3' role='status'>
            <span className='visually-hidden'>Loading...</span>
          </div>
          <div className='text-white'>Loading files...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* File Statistics */}
      <div className='row g-3 mb-4'>
        <div className='col-md-6'>
          <div style={styles.statsCard}>
            <div className='d-flex align-items-center'>
              <HardDrive size={20} className='text-primary me-2' />
              <div>
                <div className='text-muted small'>Total Files</div>
                <div className='text-white fw-bold fs-5'>{files.length}</div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-6'>
          <div style={styles.statsCard}>
            <div className='d-flex align-items-center'>
              <Search size={20} className='text-success me-2' />
              <div>
                <div className='text-muted small'>Filtered Results</div>
                <div className='text-white fw-bold fs-5'>
                  {filteredFiles.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={styles.searchWrapper}>
        <Search size={16} style={styles.searchIcon} />
        <input
          type='text'
          style={styles.searchBar}
          placeholder='Search files by name...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={(e) => {
            e.target.style.borderColor = 'rgba(139, 92, 246, 0.6)';
            e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(139, 92, 246, 0.3)';
            e.target.style.boxShadow = 'none';
          }}
        />
        {searchTerm && (
          <button
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.5)',
              cursor: 'pointer',
            }}
            onClick={() => setSearchTerm('')}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Status Messages */}
      {statusMessage && (
        <div
          style={{
            ...styles.alert,
            ...(statusType === 'success'
              ? styles.successAlert
              : styles.errorAlert),
          }}
        >
          {statusType === 'success' ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertCircle size={16} />
          )}
          {statusMessage}
        </div>
      )}

      {/* File List */}
      {filteredFiles.length > 0 ? (
        <div>
          {filteredFiles.map((file, index) => (
            <div
              key={index}
              style={styles.fileCard}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 24px rgba(139, 92, 246, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 4px 16px rgba(139, 92, 246, 0.1)';
              }}
            >
              <div className='d-flex align-items-center'>
                <div style={styles.fileIcon}>{getFileIcon(file)}</div>

                <div className='flex-grow-1'>
                  <h6 className='text-white mb-1 fw-medium'>
                    {file.length > 50 ? file.substring(0, 50) + '...' : file}
                  </h6>
                  <div className='d-flex align-items-center gap-3'>
                    <div className='small text-muted d-flex align-items-center'>
                      <Calendar size={12} className='me-1' />
                      Available for download
                    </div>
                    <div className='small text-muted d-flex align-items-center'>
                      <HardDrive size={12} className='me-1' />
                      {formatFileSize(file)}
                    </div>
                  </div>
                </div>

                <div className='d-flex gap-2'>
                  <button
                    style={{
                      ...styles.actionButton,
                      color: '#10b981',
                    }}
                    onClick={() => downloadFile(file)}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor =
                        'rgba(16, 185, 129, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                    title='Download File'
                  >
                    <Download size={18} />
                  </button>

                  <button
                    style={{
                      ...styles.actionButton,
                      color: '#ef4444',
                    }}
                    onClick={() => deleteFile(file)}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                    title='Delete File'
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : files.length === 0 ? (
        /* No files at all */
        <div style={styles.emptyState}>
          <FolderOpen size={48} className='text-muted mb-3' />
          <h5 className='text-white mb-2'>No Files Available</h5>
          <p className='text-muted mb-0'>
            Upload some files to get started with the document management
            system.
          </p>
        </div>
      ) : (
        /* No search results */
        <div style={styles.emptyState}>
          <Search size={48} className='text-muted mb-3' />
          <h5 className='text-white mb-2'>No Files Found</h5>
          <p className='text-muted mb-3'>
            No files match your search criteria: "{searchTerm}"
          </p>
          <button
            className='btn btn-outline-light btn-sm'
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
};

export default ListFiles;
