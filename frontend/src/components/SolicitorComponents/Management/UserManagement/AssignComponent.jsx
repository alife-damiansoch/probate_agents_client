import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Loader2,
  Mail,
  Shield,
  Target,
  UserCheck,
  Users,
} from 'lucide-react';
import { Fragment, useState } from 'react';
import AnimatedWrapper from '../../../GenericFunctions/AnimationFuctions';
import { patchData } from '../../../GenericFunctions/AxiosGenericFunctions';
import renderErrors, {
  displayUserTeams,
} from '../../../GenericFunctions/HelperGenericFunctions';

const AssignComponent = ({
  staffUsers,
  applicationIds,
  refresh,
  setRefresh,
}) => {
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Modern styles matching the design system
  const styles = {
    container: {
      backgroundColor: 'rgba(30, 41, 59, 0.3)',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      borderRadius: '0.75rem',
      backdropFilter: 'blur(10px)',
      padding: '1.5rem',
    },
    header: {
      background:
        'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1.5rem',
    },
    selectWrapper: {
      position: 'relative',
    },
    select: {
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '0.5rem',
      color: 'white',
      padding: '0.75rem 1rem',
      paddingRight: '2.5rem',
      fontSize: '0.875rem',
      appearance: 'none',
      width: '100%',
      transition: 'all 0.3s ease',
    },
    selectIcon: {
      position: 'absolute',
      right: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'rgba(255, 255, 255, 0.5)',
    },
    button: {
      background: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
      border: 'none',
      borderRadius: '0.5rem',
      color: 'white',
      padding: '0.75rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      width: '100%',
      boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
    },
    disabledButton: {
      background: 'rgba(107, 114, 128, 0.5)',
      color: 'rgba(255, 255, 255, 0.5)',
      boxShadow: 'none',
      cursor: 'not-allowed',
    },
    selectedUserCard: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '0.5rem',
      padding: '0.75rem',
      marginTop: '1rem',
    },
    alertSuccess: {
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      borderRadius: '0.5rem',
      color: '#a7f3d0',
      padding: '0.75rem',
      marginTop: '1rem',
    },
    alertError: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '0.5rem',
      color: '#fca5a5',
      padding: '0.75rem',
      marginTop: '1rem',
    },
    label: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontSize: '0.875rem',
      fontWeight: '500',
      marginBottom: '0.5rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
  };

  const handleEmailChange = (event) => {
    const id = parseInt(event.target.value);
    setSelectedUserId(id);
    const selectedUser = staffUsers.find((user) => user.id === id);

    if (selectedUser) {
      setSelectedEmail(selectedUser.email);
    }
  };

  const handleAssignClick = async () => {
    setErrorMessage('');
    setIsError(false);
    const applicationIdsString = applicationIds.join(', ');
    const confirmed = window.confirm(
      `Are you sure you want to assign the following applications: ${applicationIdsString}?`
    );
    if (confirmed) {
      setLoading(true);

      try {
        const promises = applicationIds.map(async (applicationId) => {
          const patchObj = {
            assigned_to: selectedUserId,
          };
          const endpoint = `/api/applications/agent_applications/${applicationId}/`;
          return await patchData(endpoint, patchObj);
        });

        const responses = await Promise.all(promises);

        const allSuccessful = responses.every(
          (response) => response.status === 200
        );

        if (allSuccessful) {
          setErrorMessage({ Applications: 'assigned successfully' });
          setIsError(false);
          setRefresh(!refresh);
        } else {
          setErrorMessage('Some assignments failed');
          setIsError(true);
        }
      } catch (error) {
        console.error('Error updating applications:', error);
        setIsError(true);
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const selectedUser = staffUsers?.find((user) => user.id === selectedUserId);
  const isButtonDisabled = selectedUserId === 0 || loading;

  return (
    <AnimatedWrapper>
      <div style={styles.container}>
        {/* Header Section */}
        <div style={styles.header}>
          <div className='d-flex align-items-center mb-2'>
            <div
              className='me-3 d-flex align-items-center justify-content-center rounded-circle'
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
              }}
            >
              <Target className='text-white' size={20} />
            </div>
            <div>
              <h6 className='text-white mb-0 fw-bold'>Assignment Control</h6>
              <div className='small text-muted'>
                Assign {applicationIds.length} application
                {applicationIds.length !== 1 ? 's' : ''} to a staff member
              </div>
            </div>
          </div>
        </div>

        {/* User Selection */}
        <div className='mb-3'>
          <label style={styles.label}>
            <Users size={16} />
            Select Staff Member
          </label>
          <div style={styles.selectWrapper}>
            <select
              style={{
                ...styles.select,
                borderColor:
                  selectedUserId !== 0
                    ? 'rgba(16, 185, 129, 0.5)'
                    : 'rgba(139, 92, 246, 0.3)',
              }}
              value={selectedUserId}
              onChange={handleEmailChange}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(139, 92, 246, 0.6)';
                e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor =
                  selectedUserId !== 0
                    ? 'rgba(16, 185, 129, 0.5)'
                    : 'rgba(139, 92, 246, 0.3)';
                e.target.style.boxShadow = 'none';
              }}
            >
              <option value=''>Choose a staff member...</option>
              {staffUsers &&
                staffUsers.map((user) => (
                  <Fragment key={user.id}>
                    {user.is_active && (
                      <option value={user.id}>
                        {user.email} {displayUserTeams(user)}
                      </option>
                    )}
                  </Fragment>
                ))}
            </select>
            <ChevronDown size={16} style={styles.selectIcon} />
          </div>
        </div>

        {/* Selected User Display */}
        {selectedUser && (
          <div style={styles.selectedUserCard}>
            <div className='d-flex align-items-center'>
              <CheckCircle2 size={16} className='text-success me-2' />
              <div>
                <div className='small text-muted'>Selected Staff Member:</div>
                <div className='d-flex align-items-center text-success fw-medium'>
                  <Mail size={14} className='me-2' />
                  {selectedUser.email}
                </div>
                {selectedUser.teams && selectedUser.teams.length > 0 && (
                  <div className='small text-muted mt-1'>
                    <Shield size={12} className='me-1' />
                    Teams:{' '}
                    {selectedUser.teams.map((team) => team.name).join(', ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Assignment Button */}
        <div className='mt-4'>
          <button
            style={{
              ...styles.button,
              ...(isButtonDisabled ? styles.disabledButton : {}),
            }}
            onClick={handleAssignClick}
            disabled={isButtonDisabled}
            onMouseEnter={(e) => {
              if (!isButtonDisabled) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isButtonDisabled) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3)';
              }
            }}
          >
            {loading ? (
              <>
                <Loader2
                  size={16}
                  className='spinner-border spinner-border-sm'
                />
                Assigning Applications...
              </>
            ) : (
              <>
                <UserCheck size={16} />
                Assign {applicationIds.length} Application
                {applicationIds.length !== 1 ? 's' : ''}
              </>
            )}
          </button>
        </div>

        {/* Status Messages */}
        {errorMessage && (
          <div style={isError ? styles.alertError : styles.alertSuccess}>
            <div className='d-flex align-items-center'>
              {isError ? (
                <AlertTriangle size={16} className='me-2' />
              ) : (
                <CheckCircle2 size={16} className='me-2' />
              )}
              <div className='fw-medium'>
                {isError ? 'Assignment Error' : 'Assignment Successful'}
              </div>
            </div>
            <div className='mt-2 small'>{renderErrors(errorMessage)}</div>
          </div>
        )}
      </div>
    </AnimatedWrapper>
  );
};

export default AssignComponent;
