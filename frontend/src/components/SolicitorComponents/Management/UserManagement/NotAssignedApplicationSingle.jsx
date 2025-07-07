import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  ExternalLink,
  FileText,
  Globe,
  Loader2,
  Mail,
  User,
  UserCheck,
  UserPlus,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { patchData } from '../../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';
import AssignComponent from './AssignComponent';

const NotAssignedApplicationSingle = ({
  application,
  advancement,
  staffUsers,
  refresh,
  setRefresh,
  assignments,
}) => {
  const [revealedApplicationId, setRevealedApplicationId] = useState(null);
  const [defaultAssignment, setDefaultAssignment] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Modern styles matching the design system
  const styles = {
    card: {
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '1rem',
      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    },
    cardHeader: {
      background:
        'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
      borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
    },
    infoItem: {
      backgroundColor: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      borderRadius: '0.5rem',
      padding: '0.75rem',
      transition: 'all 0.3s ease',
    },
    button: {
      border: 'none',
      borderRadius: '0.5rem',
      padding: '0.5rem 1rem',
      fontSize: '0.75rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      textDecoration: 'none',
    },
    primaryButton: {
      background: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
    },
    secondaryButton: {
      background: 'rgba(139, 92, 246, 0.1)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      color: 'rgba(255, 255, 255, 0.8)',
    },
    successButton: {
      background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    },
    warningButton: {
      background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
    },
    link: {
      color: '#a855f7',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      transition: 'all 0.2s ease',
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    expandedArea: {
      backgroundColor: 'rgba(30, 41, 59, 0.3)',
      borderTop: '1px solid rgba(139, 92, 246, 0.2)',
      animation: 'slideDown 0.3s ease-out',
    },
    errorAlert: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '0.5rem',
      color: '#fca5a5',
      backdropFilter: 'blur(10px)',
    },
  };

  useEffect(() => {
    if (assignments && application) {
      const def_assigment = assignments.find(
        (x) => x.agency_user.email === application.user.email
      );

      if (def_assigment) {
        setDefaultAssignment(def_assigment);
      }
    }
  }, [assignments, application]);

  const handleAssignClick = (applicationId) => {
    setRevealedApplicationId((prevId) =>
      prevId === applicationId ? null : applicationId
    );
  };

  const handleAssignToDefault = async (applicationId) => {
    setLoading(true);
    const patchObj = {
      assigned_to: defaultAssignment.staff_user.id,
    };
    const endpoint = `/api/applications/agent_applications/${applicationId}/`;
    const result = await patchData(endpoint, patchObj);
    if (result.status === 200) {
      console.log('Assigned Successfully');
      setRefresh(!refresh);
    } else {
      setErrorMessage(result.data);
      console.log(result.data);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={styles.card} className='p-4 text-center'>
        <div className='d-flex align-items-center justify-content-center mb-3'>
          <Loader2 className='text-primary me-2 spinner-border' size={24} />
          <span className='text-white fw-medium'>Assigning Application...</span>
        </div>
      </div>
    );
  }

  const isExpanded = revealedApplicationId === application.id;
  const isDefaultUserActive = defaultAssignment?.staff_user?.is_active;

  return (
    <div>
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 500px;
            transform: translateY(0);
          }
        }
      `}</style>

      <div
        style={styles.card}
        className='mb-3'
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow =
            '0 12px 40px rgba(139, 92, 246, 0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow =
            '0 8px 32px rgba(139, 92, 246, 0.1)';
        }}
      >
        {/* Card Header */}
        <div style={styles.cardHeader} className='p-3'>
          <div className='d-flex align-items-center justify-content-between'>
            <div className='d-flex align-items-center'>
              <div
                className='me-3 d-flex align-items-center justify-content-center rounded-circle'
                style={{
                  width: '40px',
                  height: '40px',
                  background:
                    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                }}
              >
                <FileText className='text-white' size={18} />
              </div>
              <div>
                <h6 className='text-white mb-0 fw-bold'>
                  Application #{application.id}
                </h6>
                <div className='small d-flex align-items-center text-muted'>
                  <Globe size={12} className='me-1' />
                  {application?.user?.country || 'Unknown Country'}
                </div>
              </div>
            </div>

            <div
              style={{
                ...styles.statusBadge,
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                color: '#fbbf24',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              <AlertCircle size={12} />
              Pending Assignment
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className='p-3'>
          <div className='row g-3 mb-3'>
            {/* Application Info */}
            <div className='col-md-6'>
              <div style={styles.infoItem}>
                <div className='d-flex align-items-center mb-2'>
                  <FileText size={16} className='text-primary me-2' />
                  <span className='text-muted small'>Application Details</span>
                </div>
                <Link
                  to={`/applications/${application.id}`}
                  style={styles.link}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#ec4899';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#a855f7';
                  }}
                >
                  View Application #{application.id}
                  <ExternalLink size={12} />
                </Link>
              </div>
            </div>

            {/* Advancement Info */}
            <div className='col-md-6'>
              <div style={styles.infoItem}>
                <div className='d-flex align-items-center mb-2'>
                  <DollarSign size={16} className='text-success me-2' />
                  <span className='text-muted small'>Approved Advancement</span>
                </div>
                {advancement ? (
                  <Link
                    to={`/advancements/${advancement.id}`}
                    style={styles.link}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#ec4899';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#a855f7';
                    }}
                  >
                    Advancement #{advancement.id}
                    <ExternalLink size={12} />
                  </Link>
                ) : (
                  <span className='text-muted'>No advancement available</span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='d-flex gap-2 flex-wrap'>
            <button
              style={isExpanded ? styles.secondaryButton : styles.primaryButton}
              onClick={() => handleAssignClick(application.id)}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <UserPlus size={14} />
              {isExpanded ? 'Close Assignment' : 'Assign Manually'}
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {defaultAssignment && (
              <div className='d-flex flex-column'>
                <button
                  style={
                    isDefaultUserActive
                      ? styles.successButton
                      : styles.warningButton
                  }
                  onClick={() => handleAssignToDefault(application.id)}
                  disabled={!isDefaultUserActive}
                  onMouseEnter={(e) => {
                    if (isDefaultUserActive) {
                      e.target.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <UserCheck size={14} />
                  Assign to Default User
                </button>

                <div className='mt-2 d-flex align-items-center'>
                  {isDefaultUserActive ? (
                    <CheckCircle2 size={12} className='text-success me-1' />
                  ) : (
                    <XCircle size={12} className='text-danger me-1' />
                  )}
                  <div className='small d-flex align-items-center'>
                    <Mail size={12} className='me-1' />
                    <span
                      style={{
                        color: isDefaultUserActive ? '#a7f3d0' : '#fca5a5',
                      }}
                    >
                      {defaultAssignment.staff_user.email}
                    </span>
                  </div>
                </div>

                {!isDefaultUserActive && (
                  <div className='small text-danger mt-1'>
                    User is currently inactive
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Expanded Assignment Area */}
        {isExpanded && (
          <div style={styles.expandedArea} className='p-3'>
            <div className='mb-3'>
              <h6 className='text-white mb-2 d-flex align-items-center'>
                <User size={16} className='me-2' />
                Manual Assignment
              </h6>
              <p className='text-muted small mb-0'>
                Select a staff member to assign this application to:
              </p>
            </div>
            <AssignComponent
              staffUsers={staffUsers}
              applicationIds={[application.id]}
              refresh={refresh}
              setRefresh={setRefresh}
            />
          </div>
        )}

        {/* Error Display */}
        {errorMessage && (
          <div style={styles.errorAlert} className='m-3 p-3'>
            <div className='d-flex align-items-center mb-2'>
              <AlertCircle size={16} className='me-2' />
              <span className='fw-medium'>Assignment Error</span>
            </div>
            <div className='small'>{renderErrors(errorMessage)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotAssignedApplicationSingle;
