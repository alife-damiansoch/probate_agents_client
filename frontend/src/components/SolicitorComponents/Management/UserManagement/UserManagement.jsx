import Cookies from 'js-cookie';
import {
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Shield,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import { fetchData } from '../../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';
import ListUsersWithAssignedApplications from './ListUsersWithAssignedApplications';
import NotAssignedApplications from './NotAssignedApplications';

const UserManagement = () => {
  const [staffUsers, setStaffUsers] = useState(null);
  const [notAssignedApplications, setNotAssignedApplications] = useState(null);
  const [errors, setErrors] = useState('');
  const [showApplications, setShowApplications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const token = Cookies.get('auth_token_agents');

  // Modern styles matching EmailCommunicationsComponent
  const styles = {
    container: {
      position: 'relative',
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
    card: {
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '1rem',
      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)',
    },
    button: {
      background: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)',
      border: 'none',
      borderRadius: '0.75rem',
      color: 'white',
      padding: '0.75rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
    },
    toggleButton: {
      background: showApplications
        ? 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)'
        : 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
      border: 'none',
      borderRadius: '0.75rem',
      color: 'white',
      padding: '0.75rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: showApplications
        ? '0 4px 12px rgba(239, 68, 68, 0.3)'
        : '0 4px 12px rgba(16, 185, 129, 0.3)',
    },
    statsCard: {
      backgroundColor: 'rgba(30, 41, 59, 0.5)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '0.75rem',
      transition: 'all 0.3s ease',
    },
    errorAlert: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '0.75rem',
      color: '#fca5a5',
      backdropFilter: 'blur(10px)',
    },
    loadingCard: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '0.75rem',
      color: '#93c5fd',
      backdropFilter: 'blur(10px)',
    },
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      if (token) {
        const endpoint = '/api/user/';
        const response = await fetchData(token, endpoint);

        if (response.status === 200) {
          const allUsers = response.data;
          const sUsers = allUsers.filter(
            (user) => user.is_staff === true || user.is_superuser === true
          );
          setStaffUsers(sUsers);
        } else {
          setErrors(response.data);
        }
        setIsLoading(false);
      }
    };

    const fetchApplications = async () => {
      setIsLoading(true);
      if (token) {
        const endpoint = `/api/applications/agent_applications?page_size=${9999}&assigned=${false}`;
        const response = await fetchData(token, endpoint);

        if (response.status === 200) {
          const notAssApp = response.data.results;
          setNotAssignedApplications(notAssApp);
        } else {
          setErrors(response.data);
        }
        setIsLoading(false);
      }
    };

    fetchUsers();
    fetchApplications();
  }, [token, refresh]);

  const toggleShowApplications = () => {
    setShowApplications((prevShow) => !prevShow);
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        {/* Loading Header */}
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
            <Users className='text-white' size={24} />
          </div>
          <div>
            <h2 style={styles.gradientText} className='fw-bold mb-1'>
              User Management
            </h2>
            <div
              className='small'
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Loading user data and applications...
            </div>
          </div>
        </div>

        <LoadingComponent />

        <div style={styles.loadingCard} className='p-4 text-center mt-4'>
          <div className='d-flex align-items-center justify-content-center mb-3'>
            <RefreshCw className='me-2 spinner-border' size={20} />
            <span className='fw-medium'>Processing Data</span>
          </div>
          <div className='small'>
            This might take some time, fetching all applications...
            <br />
            If it takes too long, check the console window (F12)
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header Banner */}
      <div
        className='mb-4 p-3 rounded-3 d-flex align-items-center justify-content-between'
        style={styles.headerBanner}
      >
        <div className='d-flex align-items-center'>
          <div
            className='me-3 d-flex align-items-center justify-content-center rounded-circle'
            style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
            }}
          >
            <Users className='text-white' size={24} />
          </div>
          <div>
            <h2 style={styles.gradientText} className='fw-bold mb-1'>
              User Management
            </h2>
            <div
              className='small'
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Staff Users • Application Assignments • Access Control
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <button
          style={{
            background: 'rgba(139, 92, 246, 0.2)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '0.5rem',
            color: 'white',
            padding: '0.5rem',
            transition: 'all 0.3s ease',
          }}
          onClick={() => setRefresh(!refresh)}
          className='btn d-flex align-items-center justify-content-center'
          title='Refresh Data'
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(139, 92, 246, 0.3)';
            e.target.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(139, 92, 246, 0.2)';
            e.target.style.transform = 'scale(1)';
          }}
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className='row g-3 mb-4'>
        <div className='col-md-4'>
          <div style={styles.statsCard} className='p-3'>
            <div className='d-flex align-items-center'>
              <div className='me-3'>
                <UserCheck size={24} style={{ color: '#10b981' }} />
              </div>
              <div>
                <div className='text-muted small'>Staff Users</div>
                <div className='text-white fw-bold fs-5'>
                  {staffUsers ? staffUsers.length : '...'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='col-md-4'>
          <div style={styles.statsCard} className='p-3'>
            <div className='d-flex align-items-center'>
              <div className='me-3'>
                <UserX size={24} style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <div className='text-muted small'>Unassigned Apps</div>
                <div className='text-white fw-bold fs-5'>
                  {notAssignedApplications
                    ? notAssignedApplications.length
                    : '...'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='col-md-4'>
          <div style={styles.statsCard} className='p-3'>
            <div className='d-flex align-items-center'>
              <div className='me-3'>
                <Shield size={24} style={{ color: '#8b5cf6' }} />
              </div>
              <div>
                <div className='text-muted small'>Access Level</div>
                <div className='text-white fw-bold fs-5'>Admin</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Not Assigned Applications Section */}
      <div style={styles.card} className='p-4 mb-4'>
        <div className='d-flex align-items-center justify-content-between mb-3'>
          <h3 className='text-white mb-0 d-flex align-items-center'>
            <UserX size={20} className='text-warning me-2' />
            Unassigned Applications
          </h3>

          <button
            style={styles.toggleButton}
            onClick={toggleShowApplications}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = showApplications
                ? '0 6px 16px rgba(239, 68, 68, 0.4)'
                : '0 6px 16px rgba(16, 185, 129, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = showApplications
                ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                : '0 4px 12px rgba(16, 185, 129, 0.3)';
            }}
          >
            {showApplications ? <EyeOff size={16} /> : <Eye size={16} />}
            {showApplications
              ? 'Hide Applications'
              : `Show Applications ${
                  notAssignedApplications
                    ? `(${notAssignedApplications.length})`
                    : '(0)'
                }`}
          </button>
        </div>

        <NotAssignedApplications
          showApplications={showApplications}
          notAssignedApplications={notAssignedApplications}
          staffUsers={staffUsers}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      </div>

      {/* Assigned Applications Section */}
      <div style={styles.card} className='p-4 mb-4'>
        <div className='mb-3'>
          <h3 className='text-white mb-0 d-flex align-items-center'>
            <UserCheck size={20} className='text-success me-2' />
            Users with Assigned Applications
          </h3>
          <p className='text-muted small mb-0 mt-1'>
            Manage staff assignments and workload distribution
          </p>
        </div>

        {staffUsers ? (
          <ListUsersWithAssignedApplications
            staffUsers={staffUsers}
            setRefresh={setRefresh}
            refresh={refresh}
          />
        ) : (
          <div className='text-center py-5'>
            <LoadingComponent />
            <div className='text-muted mt-3'>Loading staff user data...</div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {errors && (
        <div style={styles.errorAlert} className='p-4'>
          <div className='d-flex align-items-center mb-2'>
            <AlertCircle size={20} className='me-2' />
            <span className='fw-medium'>Error Occurred</span>
          </div>
          <div className='text-center'>{renderErrors(errors)}</div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
