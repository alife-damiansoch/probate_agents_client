import { Cloud, Files, FolderOpen, HardDrive, Upload } from 'lucide-react';
import { useState } from 'react';
import ListFiles from './ListFiles';
import UploadFile from './UploadFile';

const FileManager = () => {
  const [refresh, setRefresh] = useState(false);

  // Modern styles matching the design system
  const styles = {
    container: {
      position: 'relative',
      marginTop: '2rem',
      marginBottom: '2rem',
    },
    mainCard: {
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '1rem',
      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)',
      position: 'relative',
      overflow: 'hidden',
    },
    glassmorphismOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      zIndex: 1,
    },
    contentWrapper: {
      position: 'relative',
      zIndex: 2,
    },
    headerBanner: {
      background:
        'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
      border: '1px solid rgba(139, 92, 246, 0.4)',
      backdropFilter: 'blur(10px)',
    },
    gradientText: {
      background:
        'linear-gradient(90deg, #8b5cf6 0%, #a855f7 50%, #ec4899 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    featureCard: {
      backgroundColor: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      borderRadius: '0.5rem',
      padding: '1rem',
      transition: 'all 0.3s ease',
    },
    contentSection: {
      backgroundColor: 'rgba(30, 41, 59, 0.3)',
      borderRadius: '0.75rem',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      marginBottom: '1.5rem',
    },
    sectionHeader: {
      background:
        'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
      borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
      padding: '1rem 1.5rem',
      borderTopLeftRadius: '0.75rem',
      borderTopRightRadius: '0.75rem',
    },
  };

  return (
    <div style={styles.container}>
      <div
        className='p-4 rounded-4 position-relative overflow-hidden'
        style={styles.mainCard}
      >
        {/* Glassmorphism overlay */}
        <div style={styles.glassmorphismOverlay} />

        {/* Content wrapper */}
        <div style={styles.contentWrapper}>
          {/* Header Banner */}
          <div
            className='mb-4 p-3 rounded-3 d-flex align-items-center'
            style={styles.headerBanner}
          >
            <div
              className='me-3 d-flex align-items-center justify-content-center rounded-circle'
              style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
              }}
            >
              <FolderOpen className='text-white' size={28} />
            </div>
            <div className='flex-grow-1'>
              <h1 style={styles.gradientText} className='fw-bold mb-1 h3'>
                Document Management System
              </h1>
              <div
                className='small'
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                Upload • Organize • Download • Secure File Storage
              </div>
            </div>
          </div>

          {/* Feature Overview */}
          <div className='row g-3 mb-4'>
            <div className='col-md-4'>
              <div
                style={styles.featureCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)';
                }}
              >
                <div className='d-flex align-items-center mb-2'>
                  <Upload size={20} className='text-primary me-2' />
                  <h6 className='text-white mb-0 fw-medium'>File Upload</h6>
                </div>
                <p className='text-muted small mb-0'>
                  Securely upload documents and files with drag-and-drop support
                </p>
              </div>
            </div>

            <div className='col-md-4'>
              <div
                style={styles.featureCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)';
                }}
              >
                <div className='d-flex align-items-center mb-2'>
                  <Files size={20} className='text-success me-2' />
                  <h6 className='text-white mb-0 fw-medium'>File Management</h6>
                </div>
                <p className='text-muted small mb-0'>
                  Organize, preview, and manage your uploaded documents
                  efficiently
                </p>
              </div>
            </div>

            <div className='col-md-4'>
              <div
                style={styles.featureCard}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(139, 92, 246, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(30, 41, 59, 0.5)';
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)';
                }}
              >
                <div className='d-flex align-items-center mb-2'>
                  <Cloud size={20} className='text-warning me-2' />
                  <h6 className='text-white mb-0 fw-medium'>Cloud Storage</h6>
                </div>
                <p className='text-muted small mb-0'>
                  Secure cloud storage with automatic backup and version control
                </p>
              </div>
            </div>
          </div>

          {/* Upload Section */}
          <div style={styles.contentSection}>
            <div style={styles.sectionHeader}>
              <h5 className='text-white mb-0 fw-bold d-flex align-items-center'>
                <Upload size={20} className='me-2' />
                File Upload Center
              </h5>
              <p className='text-muted small mb-0 mt-1'>
                Upload new documents and files to the system
              </p>
            </div>
            <div className='p-3'>
              <UploadFile refresh={refresh} setRefresh={setRefresh} />
            </div>
          </div>

          {/* File List Section */}
          <div style={styles.contentSection}>
            <div style={styles.sectionHeader}>
              <h5 className='text-white mb-0 fw-bold d-flex align-items-center'>
                <HardDrive size={20} className='me-2' />
                Document Library
              </h5>
              <p className='text-muted small mb-0 mt-1'>
                Browse, manage, and download your uploaded files
              </p>
            </div>
            <div className='p-3'>
              <ListFiles refresh={refresh} setRefresh={setRefresh} />
            </div>
          </div>

          {/* Storage Info */}
          <div className='row g-3'>
            <div className='col-md-6'>
              <div
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.3)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                }}
              >
                <div className='d-flex align-items-center'>
                  <Cloud size={20} className='text-success me-2' />
                  <div>
                    <div className='text-white fw-medium'>Secure Storage</div>
                    <div className='text-muted small'>
                      Enterprise-grade security
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.3)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                }}
              >
                <div className='d-flex align-items-center'>
                  <Files size={20} className='text-primary me-2' />
                  <div>
                    <div className='text-white fw-medium'>File Management</div>
                    <div className='text-muted small'>
                      Organize & download files
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileManager;
