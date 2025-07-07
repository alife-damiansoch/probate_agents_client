// Management.jsx - Updated with modern styling to match EmailCommunicationsComponent
import {
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  FolderOpen,
  Lock,
  Settings,
  Shield,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import CCRModal from './CCR/CCRModal';
import DefaultAssigmentManager from './DefaultAssigmentManager.jsx/DefaultAssigmentManager';
import FileManager from './DocumentsForDownloadComponent/FileManager';
import UserManagement from './UserManagement/UserManagement';

const Management = () => {
  const [activeSection, setActiveSection] = useState('agents');
  const [showCCRModal, setShowCCRModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const CCR_PASSWORD = 'damiansoch';

  // Modern styles matching EmailCommunicationsComponent
  const styles = {
    container: {
      minHeight: '100vh',
      // minWidth: '100vw',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
      padding: '2rem',
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
    navCard: {
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '1rem',
      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)',
    },
    navButton: {
      background: 'transparent',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '0.75rem',
      color: 'rgba(255, 255, 255, 0.8)',
      padding: '1rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      width: '100%',
      textAlign: 'left',
      textDecoration: 'none',
      position: 'relative',
      overflow: 'hidden',
    },
    activeNavButton: {
      background: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)',
      border: '1px solid rgba(139, 92, 246, 0.5)',
      color: 'white',
      boxShadow: '0 4px 20px rgba(139, 92, 246, 0.3)',
    },
    ccrButton: {
      background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
      border: '1px solid rgba(245, 158, 11, 0.5)',
      color: 'white',
      boxShadow: '0 4px 20px rgba(245, 158, 11, 0.3)',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 1050,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContent: {
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '1rem',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      width: '90%',
      maxWidth: '400px',
      position: 'relative',
      overflow: 'hidden',
    },
    passwordInput: {
      backgroundColor: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '0.75rem',
      color: 'white',
      padding: '0.75rem 1rem',
      paddingRight: '3rem',
    },
    button: {
      background: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)',
      border: 'none',
      borderRadius: '0.75rem',
      color: 'white',
      padding: '0.75rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    contentCard: {
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '1rem',
      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)',
    },
  };

  const handleCCRClick = () => {
    setShowPasswordModal(true);
    setPassword('');
    setPasswordError('');
    setShowPassword(false);
  };

  const handlePasswordSubmit = () => {
    if (password === CCR_PASSWORD) {
      setShowPasswordModal(false);
      setShowCCRModal(true);
      setPassword('');
      setPasswordError('');
    } else {
      setPasswordError('Invalid password. Access denied.');
      setPassword('');
    }
  };

  const handlePasswordKeyPress = (e) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  const PasswordModal = () => (
    <div style={styles.modal}>
      <div style={styles.modalContent}>
        {/* Glassmorphism overlay for modal */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            zIndex: 1,
          }}
        />

        <div style={{ position: 'relative', zIndex: 2 }} className='p-4'>
          {/* Header */}
          <div className='text-center mb-4'>
            <div
              className='mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle'
              style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                boxShadow: '0 8px 24px rgba(245, 158, 11, 0.4)',
              }}
            >
              <Lock className='text-white' size={28} />
            </div>
            <h3 style={styles.gradientText} className='fw-bold mb-2'>
              Secure Access Required
            </h3>
            <p className='text-muted mb-0'>
              Enter password to access CCR Reporting
            </p>
          </div>

          {/* Password Input */}
          <div className='mb-4'>
            <label className='form-label text-light mb-2 d-flex align-items-center'>
              <Shield size={16} className='me-2' />
              Access Password
            </label>
            <div className='position-relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                className='form-control'
                style={styles.passwordInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handlePasswordKeyPress}
                placeholder='Enter secure password'
                autoFocus
              />
              <button
                type='button'
                className='btn btn-link position-absolute end-0 top-50 translate-middle-y me-2 p-0'
                style={{ color: 'rgba(255, 255, 255, 0.6)', zIndex: 10 }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {passwordError && (
            <div className='mb-4'>
              <div
                className='alert mb-0'
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                  borderColor: 'rgba(239, 68, 68, 0.2)',
                  color: '#fca5a5',
                  border: '1px solid',
                }}
              >
                <div className='d-flex align-items-center'>
                  <Shield size={16} className='me-2' />
                  {passwordError}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className='d-flex gap-3'>
            <button
              className='btn btn-secondary flex-fill'
              onClick={() => {
                setShowPasswordModal(false);
                setPassword('');
                setPasswordError('');
              }}
            >
              Cancel
            </button>
            <button
              style={styles.button}
              className='flex-fill'
              onClick={handlePasswordSubmit}
              disabled={!password}
            >
              <Lock size={16} />
              Access CCR
            </button>
          </div>

          {/* Security Note */}
          <div className='text-center mt-4'>
            <div
              className='small p-2 rounded'
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                color: 'rgba(255, 255, 255, 0.7)',
              }}
            >
              🔒 This area contains sensitive compliance data
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const navigationItems = [
    {
      id: 'agents',
      label: 'Agents Management',
      icon: Users,
      description: 'Manage user accounts and permissions',
    },
    {
      id: 'default_assigment',
      label: 'Default Assignment Management',
      icon: Settings,
      description: 'Configure default assignments and workflows',
    },
    {
      id: 'documents',
      label: 'Document Management',
      icon: FolderOpen,
      description: 'Manage downloadable documents and files',
    },
  ];

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'agents':
        return <UserManagement />;
      case 'documents':
        return <FileManager />;
      case 'default_assigment':
        return <DefaultAssigmentManager />;
      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      <div
        className='my-5 p-4 rounded-4 position-relative overflow-hidden'
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
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
              }}
            >
              <Settings className='text-white' size={24} />
            </div>
            <div>
              <h1 style={styles.gradientText} className='fw-bold mb-1 h3'>
                Management Dashboard
              </h1>
              <div
                className='small'
                style={{ color: 'rgba(255, 255, 255, 0.7)' }}
              >
                System Administration • User Controls • Document Management
              </div>
            </div>
          </div>

          <div className='row g-4'>
            {/* Navigation Sidebar */}
            <div className='col-lg-4 col-xl-3'>
              <div style={styles.navCard} className='p-4'>
                <h3 className='text-white mb-4 fw-bold'>Navigation</h3>

                <div className='d-flex flex-column gap-3'>
                  {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                      <button
                        key={item.id}
                        style={{
                          ...styles.navButton,
                          ...(isActive ? styles.activeNavButton : {}),
                        }}
                        onClick={() => handleNavClick(item.id)}
                        className='text-start'
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.target.style.background =
                              'rgba(139, 92, 246, 0.1)';
                            e.target.style.borderColor =
                              'rgba(139, 92, 246, 0.5)';
                            e.target.style.color = 'white';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.target.style.background = 'transparent';
                            e.target.style.borderColor =
                              'rgba(139, 92, 246, 0.3)';
                            e.target.style.color = 'rgba(255, 255, 255, 0.8)';
                          }
                        }}
                      >
                        <Icon size={20} />
                        <div className='flex-grow-1'>
                          <div className='fw-medium'>{item.label}</div>
                          <div
                            className='small'
                            style={{
                              color: isActive
                                ? 'rgba(255, 255, 255, 0.8)'
                                : 'rgba(255, 255, 255, 0.6)',
                            }}
                          >
                            {item.description}
                          </div>
                        </div>
                        <ChevronRight
                          size={16}
                          className={`transition-transform ${
                            isActive ? 'rotate-90' : ''
                          }`}
                        />
                      </button>
                    );
                  })}

                  {/* CCR Reporting Button */}
                  <button
                    style={{
                      ...styles.navButton,
                      ...styles.ccrButton,
                    }}
                    onClick={() => handleCCRClick()}
                    className='text-start mt-3'
                    onMouseEnter={(e) => {
                      e.target.style.background =
                        'linear-gradient(90deg, #d97706 0%, #b45309 100%)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow =
                        '0 6px 24px rgba(245, 158, 11, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background =
                        'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow =
                        '0 4px 20px rgba(245, 158, 11, 0.3)';
                    }}
                  >
                    <FileText size={20} />
                    <div className='flex-grow-1'>
                      <div className='fw-medium'>CCR Reporting</div>
                      <div
                        className='small'
                        style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                      >
                        Generate compliance reports
                      </div>
                    </div>
                    <ChevronRight size={16} />
                  </button>
                </div>

                {/* Active Section Indicator */}
                <div
                  className='mt-4 p-3 rounded-3'
                  style={{
                    background: 'rgba(139, 92, 246, 0.1)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                  }}
                >
                  <div className='small text-muted mb-1'>Currently Viewing</div>
                  <div className='text-white fw-medium'>
                    {
                      navigationItems.find((item) => item.id === activeSection)
                        ?.label
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className='col-lg-8 col-xl-9'>
              <div style={styles.contentCard} className='p-4 min-vh-75'>
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && <PasswordModal />}

      {/* CCR Modal */}
      <CCRModal show={showCCRModal} onHide={() => setShowCCRModal(false)} />
    </div>
  );
};

export default Management;
