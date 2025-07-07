import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  ExternalLink,
  FileText,
  Globe,
  Hash,
  RefreshCw,
  Shield,
  UserCheck,
  Users,
  UserX,
} from 'lucide-react';
import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { displayUserTeams } from '../../../GenericFunctions/HelperGenericFunctions';
import AssignComponent from './AssignComponent';

const ListUsersWithAssignedApplications = ({
  staffUsers,
  refresh,
  setRefresh,
}) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [revealedApplicationId, setRevealedApplicationId] = useState(null);
  const [revealedUserId, setRevealedUserId] = useState(null);
  const [reassingAllApplicationIds, setReassingAllApplicationIds] = useState(
    []
  );

  // Modern styles matching the design system
  const styles = {
    container: {
      position: 'relative',
    },
    userCard: {
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '0.75rem',
      boxShadow: '0 4px 16px rgba(139, 92, 246, 0.1)',
      marginBottom: '1rem',
      transition: 'all 0.3s ease',
      overflow: 'hidden',
    },
    inactiveUserCard: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
    userHeader: {
      background:
        'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
      borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
      padding: '1rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    userDetails: {
      display: 'flex',
      alignItems: 'center',
    },
    userAvatar: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '1rem',
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
    },
    inactiveAvatar: {
      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
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
    activeBadge: {
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      color: '#a7f3d0',
      border: '1px solid rgba(16, 185, 129, 0.3)',
    },
    inactiveBadge: {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      color: '#fca5a5',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
    applicationsList: {
      padding: '0',
      backgroundColor: 'transparent',
    },
    applicationItem: {
      backgroundColor: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      borderRadius: '0.5rem',
      margin: '0.5rem 1rem',
      padding: '1rem',
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
    },
    primaryButton: {
      background: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
    },
    dangerButton: {
      background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
    },
    successButton: {
      background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
      color: 'white',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
    },
    link: {
      color: '#a855f7',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
      transition: 'all 0.2s ease',
    },
    emptyBadge: {
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      color: '#93c5fd',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      padding: '0.5rem 1rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
    },
    expandedSection: {
      animation: 'slideDown 0.3s ease-out',
      borderTop: '1px solid rgba(139, 92, 246, 0.2)',
      backgroundColor: 'rgba(30, 41, 59, 0.3)',
    },
  };

  const handleUserClick = (userId) => {
    setSelectedUserId(userId === selectedUserId ? null : userId);
    setRevealedApplicationId(null);
  };

  const handleReassignClick = (applicationId) => {
    setRevealedApplicationId((prevId) =>
      prevId === applicationId ? null : applicationId
    );
    setRevealedUserId(null);
  };

  const reassignAllClickHandler = (user) => {
    setSelectedUserId(null);
    setRevealedApplicationId(null);
    setRevealedUserId((prevId) => (prevId === user.id ? null : user.id));
    const allAgentApplicationIds = user.applications.map((app) => app.id);
    setReassingAllApplicationIds(allAgentApplicationIds);
  };

  const getTotalApplications = () => {
    return staffUsers.reduce(
      (total, user) => total + user.applications.length,
      0
    );
  };

  const getActiveUsers = () => {
    return staffUsers.filter((user) => user.is_active).length;
  };

  return (
    <div style={styles.container}>
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 1000px;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Stats Summary */}
      <div className='row g-3 mb-4'>
        <div className='col-md-4'>
          <div
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '0.5rem',
              padding: '1rem',
            }}
          >
            <div className='d-flex align-items-center'>
              <Users size={20} className='text-primary me-2' />
              <div>
                <div className='text-muted small'>Total Staff</div>
                <div className='text-white fw-bold'>{staffUsers.length}</div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-4'>
          <div
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '0.5rem',
              padding: '1rem',
            }}
          >
            <div className='d-flex align-items-center'>
              <UserCheck size={20} className='text-success me-2' />
              <div>
                <div className='text-muted small'>Active Users</div>
                <div className='text-white fw-bold'>{getActiveUsers()}</div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-4'>
          <div
            style={{
              backgroundColor: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '0.5rem',
              padding: '1rem',
            }}
          >
            <div className='d-flex align-items-center'>
              <FileText size={20} className='text-warning me-2' />
              <div>
                <div className='text-muted small'>Total Applications</div>
                <div className='text-white fw-bold'>
                  {getTotalApplications()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div>
        {staffUsers.map((user) => (
          <Fragment key={user.id}>
            {(user.is_active ||
              (!user.is_active && user.applications.length > 0)) && (
              <div
                style={{
                  ...styles.userCard,
                  ...(user.is_active ? {} : styles.inactiveUserCard),
                }}
                onMouseEnter={(e) => {
                  if (user.is_active) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 24px rgba(139, 92, 246, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 4px 16px rgba(139, 92, 246, 0.1)';
                }}
              >
                {/* User Header */}
                <div
                  style={styles.userHeader}
                  onClick={() => handleUserClick(user.id)}
                >
                  <div style={styles.userInfo}>
                    <div style={styles.userDetails}>
                      <div
                        style={{
                          ...styles.userAvatar,
                          ...(user.is_active ? {} : styles.inactiveAvatar),
                        }}
                      >
                        {user.is_active ? (
                          <UserCheck className='text-white' size={24} />
                        ) : (
                          <UserX className='text-white' size={24} />
                        )}
                      </div>
                      <div>
                        <h6 className='text-white mb-1 fw-bold'>
                          {user.email}
                        </h6>
                        <div className='d-flex align-items-center gap-2 mb-2'>
                          <div
                            style={{
                              ...styles.statusBadge,
                              ...(user.is_active
                                ? styles.activeBadge
                                : styles.inactiveBadge),
                            }}
                          >
                            {user.is_active ? (
                              <CheckCircle2 size={12} />
                            ) : (
                              <AlertTriangle size={12} />
                            )}
                            {user.is_active ? 'Active' : 'Inactive'}
                          </div>
                          {displayUserTeams(user) && (
                            <div className='small text-muted d-flex align-items-center'>
                              <Shield size={12} className='me-1' />
                              {displayUserTeams(user)}
                            </div>
                          )}
                        </div>
                        <div className='small text-muted d-flex align-items-center'>
                          <FileText size={12} className='me-1' />
                          {user.applications.length} assigned application
                          {user.applications.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    <div className='d-flex align-items-center gap-3'>
                      <div className='text-center'>
                        <div className='text-white fw-bold fs-4'>
                          {user.applications.length}
                        </div>
                        <div className='small text-muted'>Apps</div>
                      </div>
                      {selectedUserId === user.id ? (
                        <ChevronUp size={20} className='text-muted' />
                      ) : (
                        <ChevronDown size={20} className='text-muted' />
                      )}
                    </div>
                  </div>

                  {/* Reassign All Button */}
                  {user.applications.length > 0 && (
                    <div className='mt-3'>
                      <button
                        style={{
                          ...styles.button,
                          ...(revealedUserId !== user.id
                            ? styles.dangerButton
                            : styles.successButton),
                          width: '100%',
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          reassignAllClickHandler(user);
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <RefreshCw size={14} />
                        {revealedUserId !== user.id
                          ? 'Reassign All Applications'
                          : 'Close Reassignment'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Applications List */}
                {selectedUserId === user.id && user.applications.length > 0 && (
                  <div style={styles.expandedSection}>
                    <div className='p-3'>
                      <h6 className='text-white mb-3 d-flex align-items-center'>
                        <FileText size={16} className='me-2' />
                        Assigned Applications ({user.applications.length})
                      </h6>

                      {user.applications
                        .slice()
                        .sort((a, b) => a.id - b.id)
                        .map((application) => (
                          <div
                            key={application.id}
                            style={styles.applicationItem}
                          >
                            <div className='row align-items-center'>
                              <div className='col-md-5'>
                                <div className='d-flex align-items-center mb-2'>
                                  <Hash
                                    size={14}
                                    className='text-primary me-2'
                                  />
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
                                    Application #{application.id}
                                    <ExternalLink size={12} />
                                  </Link>
                                </div>
                                {application?.country && (
                                  <div className='small text-muted d-flex align-items-center'>
                                    <Globe size={12} className='me-1' />
                                    {application.country}
                                  </div>
                                )}
                              </div>

                              {application.loan && (
                                <div className='col-md-4'>
                                  <div className='d-flex align-items-center mb-2'>
                                    <DollarSign
                                      size={14}
                                      className='text-success me-2'
                                    />
                                    <Link
                                      to={`/advancements/${application.loan.id}`}
                                      style={styles.link}
                                      onMouseEnter={(e) => {
                                        e.target.style.color = '#ec4899';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.target.style.color = '#a855f7';
                                      }}
                                    >
                                      Advancement #{application.loan.id}
                                      <ExternalLink size={12} />
                                    </Link>
                                  </div>
                                </div>
                              )}

                              <div className='col-md-3'>
                                <button
                                  style={{
                                    ...styles.button,
                                    ...(revealedApplicationId !== application.id
                                      ? styles.primaryButton
                                      : styles.successButton),
                                    width: '100%',
                                  }}
                                  onClick={() =>
                                    handleReassignClick(application.id)
                                  }
                                  onMouseEnter={(e) => {
                                    e.target.style.transform =
                                      'translateY(-1px)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.target.style.transform = 'translateY(0)';
                                  }}
                                >
                                  <RefreshCw size={12} />
                                  {revealedApplicationId !== application.id
                                    ? 'Reassign'
                                    : 'Close'}
                                </button>
                              </div>
                            </div>

                            {revealedApplicationId === application.id && (
                              <div
                                className='mt-3 pt-3 border-top'
                                style={{
                                  borderColor: 'rgba(139, 92, 246, 0.2)',
                                }}
                              >
                                <AssignComponent
                                  staffUsers={staffUsers}
                                  applicationIds={[application.id]}
                                  refresh={refresh}
                                  setRefresh={setRefresh}
                                />
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Reassign All Section */}
                {revealedUserId === user.id && (
                  <div style={styles.expandedSection} className='p-3'>
                    <h6 className='text-white mb-3 d-flex align-items-center'>
                      <RefreshCw size={16} className='me-2' />
                      Reassign All Applications (
                      {reassingAllApplicationIds.length})
                    </h6>
                    <AssignComponent
                      staffUsers={staffUsers}
                      applicationIds={reassingAllApplicationIds}
                      refresh={refresh}
                      setRefresh={setRefresh}
                    />
                  </div>
                )}
              </div>
            )}
          </Fragment>
        ))}
      </div>

      {staffUsers.length === 0 && (
        <div
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.5)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '0.75rem',
            padding: '3rem',
            textAlign: 'center',
          }}
        >
          <UserX size={48} className='text-muted mb-3' />
          <h5 className='text-white mb-2'>No Staff Users Found</h5>
          <p className='text-muted'>
            No staff members are available to display.
          </p>
        </div>
      )}
    </div>
  );
};

export default ListUsersWithAssignedApplications;
