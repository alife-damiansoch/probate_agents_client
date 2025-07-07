import Cookies from 'js-cookie';
import { AlertCircle, Database, FileX, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchData } from '../../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';
import NotAssignedApplicationSingle from './NotAssignedApplicationSingle';

const NotAssignedApplications = ({
  showApplications,
  notAssignedApplications,
  staffUsers,
  refresh,
  setRefresh,
}) => {
  const token = Cookies.get('auth_token_agents');
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState('');

  // Modern styles matching the design system
  const styles = {
    container: {
      position: 'relative',
    },
    applicationsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1rem',
      padding: '1rem 0',
    },
    loadingCard: {
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '0.75rem',
      backdropFilter: 'blur(10px)',
      padding: '2rem',
      textAlign: 'center',
    },
    errorCard: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '0.75rem',
      backdropFilter: 'blur(10px)',
      color: '#fca5a5',
    },
    emptyStateCard: {
      backgroundColor: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      borderRadius: '0.75rem',
      backdropFilter: 'blur(10px)',
      padding: '3rem 2rem',
      textAlign: 'center',
    },
    slideAnimation: {
      animation: 'slideDown 0.3s ease-out',
    },
    fadeInAnimation: {
      animation: 'fadeIn 0.5s ease-out',
    },
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      if (token) {
        setIsLoading(true);
        const endpoint = '/api/assignments/assignments/';
        const response = await fetchData(token, endpoint);

        if (response.status === 200) {
          setAssignments(response.data);
        } else {
          setErrors(response.data);
        }
      }
      setIsLoading(false);
    };

    fetchAssignments();
  }, [token]);

  // Loading state
  if (isLoading) {
    return (
      <div style={styles.loadingCard}>
        <div className='d-flex align-items-center justify-content-center mb-3'>
          <Loader2 className='text-primary me-2 spinner-border' size={24} />
          <span className='text-primary fw-medium'>Loading Assignments</span>
        </div>
        <div className='text-muted small'>
          Fetching assignment data from the server...
        </div>
      </div>
    );
  }

  // Error state
  if (errors) {
    return (
      <div style={styles.errorCard} className='p-4'>
        <div className='d-flex align-items-center mb-3'>
          <AlertCircle size={24} className='me-2' />
          <span className='fw-medium'>Error Loading Data</span>
        </div>
        <div className='text-center'>{renderErrors(errors)}</div>
      </div>
    );
  }

  // Main content - only show when showApplications is true
  if (!showApplications) {
    return null;
  }

  return (
    <div style={{ ...styles.container, ...styles.slideAnimation }}>
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .applications-container {
          animation: fadeIn 0.5s ease-out;
        }

        .application-item {
          transition: all 0.3s ease;
        }

        .application-item:hover {
          transform: translateY(-2px);
        }
      `}</style>

      {/* Applications Content */}
      {notAssignedApplications && notAssignedApplications.length > 0 ? (
        <div className='applications-container'>
          {/* Header Info */}
          <div className='mb-3 d-flex align-items-center justify-content-between'>
            <div className='d-flex align-items-center text-muted'>
              <Database size={16} className='me-2' />
              <span className='small'>
                Showing {notAssignedApplications.length} unassigned application
                {notAssignedApplications.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Quick Stats */}
            <div className='d-flex gap-3'>
              <div
                className='px-3 py-1 rounded-pill small'
                style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  color: '#fbbf24',
                }}
              >
                Pending Assignment
              </div>
            </div>
          </div>

          {/* Applications Grid */}
          <div style={styles.applicationsGrid}>
            {notAssignedApplications.map((application, index) => (
              <div
                key={application.id}
                className='application-item'
                style={{
                  ...styles.fadeInAnimation,
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <NotAssignedApplicationSingle
                  application={application}
                  advancement={application.loan}
                  staffUsers={staffUsers}
                  refresh={refresh}
                  setRefresh={setRefresh}
                  assignments={assignments}
                />
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div
            className='mt-4 pt-3 border-top'
            style={{ borderColor: 'rgba(139, 92, 246, 0.2)' }}
          >
            <div className='text-muted small text-center'>
              💡 Tip: Applications will automatically appear here when they need
              assignment to staff members
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div style={styles.emptyStateCard}>
          <div className='mb-3'>
            <FileX size={48} className='text-muted' />
          </div>
          <h4 className='text-white fw-bold mb-2'>
            No Unassigned Applications
          </h4>
          <p className='text-muted mb-3'>
            Great! All applications have been assigned to staff members.
          </p>
          <div
            className='small px-3 py-2 rounded'
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              color: '#a7f3d0',
              display: 'inline-block',
            }}
          >
            ✅ All applications are currently assigned
          </div>
        </div>
      )}
    </div>
  );
};

export default NotAssignedApplications;
