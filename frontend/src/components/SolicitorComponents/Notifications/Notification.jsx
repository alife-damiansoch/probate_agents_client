import { useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { MdDoneAll, MdOutlineRemoveDone } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import { patchData } from '../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';

const Notification = ({ notification, refresh, setRefresh }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const { user } = useSelector((state) => state.user);

  const handleComplete = async (notification_id, completed) => {
    try {
      const endpoint = `/api/applications/notifications/${notification_id}/`;
      const response = await patchData(endpoint, {
        seen: completed,
      });
      if (response.status !== 200) {
        setIsError(true);
        setErrorMessage(response.data);
      } else {
        // console.log(response);
        setIsError(false);
        setRefresh(!refresh);
      }
    } catch (error) {
      console.error('Error updating application:', error);
      setIsError(true);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage(error.message);
      }
    }
  };

  // Get styling based on notification status
  const getNotificationStyles = () => {
    if (notification.seen) {
      return {
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
        borderColor: '#22c55e',
        statusBg: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
        statusText: '#15803d',
      };
    }
    return {
      background: 'linear-gradient(135deg, #ffffff 0%, #fefce8 100%)',
      borderColor: '#f59e0b',
      statusBg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      statusText: '#d97706',
    };
  };

  const notificationStyles = getNotificationStyles();

  // Check if user can modify this notification
  const canModify =
    user.is_superuser ||
    (notification.recipient_email &&
      notification.recipient_email === user.email);

  // Check if this notification is assigned to current user
  const isAssignedToCurrentUser =
    notification.recipient_email &&
    user.email &&
    notification.recipient_email === user.email;

  // console.log(notification);
  return (
    <>
      {user && notification ? (
        <>
          <div
            className='mb-3'
            style={{
              background: notificationStyles.background,
              borderRadius: '16px',
              border: `2px solid ${notificationStyles.borderColor}`,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow =
                '0 8px 20px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow =
                '0 4px 12px rgba(0, 0, 0, 0.08)';
            }}
          >
            {/* Status Indicator */}
            <div
              className='position-absolute'
              style={{
                top: '12px',
                right: '12px',
                zIndex: 10,
              }}
            >
              {isAssignedToCurrentUser && (
                <div
                  className='position-absolute'
                  style={{
                    top: '-4px',
                    right: '-4px',
                    zIndex: 15,
                  }}
                >
                  <FaExclamationTriangle color='#dc2626' size={16} />
                </div>
              )}
              <span
                className='px-2 py-1 rounded-pill fw-medium'
                style={{
                  background: notificationStyles.statusBg,
                  color: notificationStyles.statusText,
                  fontSize: '0.7rem',
                  border: `1px solid ${notificationStyles.borderColor}`,
                }}
              >
                {notification.seen ? 'Seen' : 'New'}
              </span>
            </div>

            <div style={{ padding: '20px 24px' }}>
              {/* Header with Application Link */}
              <div className='mb-3'>
                {notification.application ? (
                  <Link
                    to={`/applications/${notification.application}`}
                    className='d-flex align-items-center gap-2 text-decoration-none'
                    style={{
                      color: '#1e40af',
                      fontWeight: '600',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#1e3a8a';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#1e40af';
                    }}
                  >
                    <svg
                      width='16'
                      height='16'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span style={{ fontSize: '0.9rem' }}>
                      Application #{notification.application}
                    </span>
                    {notification.country && (
                      <span
                        className='px-2 py-1 rounded-2'
                        style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: '#1e40af',
                          fontSize: '0.7rem',
                        }}
                      >
                        {notification.country}
                      </span>
                    )}
                  </Link>
                ) : (
                  <div className='d-flex align-items-center gap-2'>
                    <svg
                      width='16'
                      height='16'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      style={{ color: '#6b7280' }}
                    >
                      <path
                        fillRule='evenodd'
                        d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                      Application #Unknown
                    </span>
                  </div>
                )}
              </div>

              {/* User Information */}
              <div className='row g-2 mb-3'>
                <div className='col-md-6'>
                  <div
                    className='p-2 rounded-3'
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div className='d-flex align-items-center gap-2'>
                      <svg
                        width='14'
                        height='14'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        style={{ color: '#8b5cf6' }}
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                          Created by:
                        </span>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: '#374151',
                            fontWeight: '500',
                          }}
                        >
                          {notification.created_by_email || 'Unknown'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='col-md-6'>
                  <div
                    className='p-2 rounded-3'
                    style={{
                      background: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div className='d-flex align-items-center gap-2'>
                      <svg
                        width='14'
                        height='14'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                        style={{ color: '#059669' }}
                      >
                        <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
                      </svg>
                      <div>
                        <span style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                          Assigned to:
                        </span>
                        <div
                          style={{
                            fontSize: '0.8rem',
                            color: '#374151',
                            fontWeight: '500',
                          }}
                        >
                          {notification.recipient_email || 'Not assigned'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Content */}
              <div className='d-flex justify-content-between align-items-start gap-3'>
                <div className='flex-grow-1'>
                  <div
                    className='p-3 rounded-3 mb-2'
                    style={{
                      background: 'rgba(220, 38, 38, 0.05)',
                      border: '1px solid rgba(220, 38, 38, 0.2)',
                    }}
                  >
                    <p
                      className='mb-0'
                      style={{
                        color: '#dc2626',
                        fontSize: '0.9rem',
                        lineHeight: '1.4',
                      }}
                    >
                      {notification.text}
                    </p>
                  </div>

                  <div className='d-flex align-items-center gap-2'>
                    <svg
                      width='14'
                      height='14'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                      style={{ color: '#9ca3af' }}
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      {new Date(notification.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Action Button */}
                <div className='d-flex flex-column align-items-center gap-2'>
                  {!notification.seen ? (
                    <button
                      className='btn rounded-circle d-flex align-items-center justify-content-center'
                      style={{
                        background: canModify
                          ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                          : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                        border: 'none',
                        color: '#ffffff',
                        cursor: canModify ? 'pointer' : 'not-allowed',
                        opacity: canModify ? 1 : 0.6,
                      }}
                      onClick={() => handleComplete(notification.id, true)}
                      disabled={!canModify}
                      title={
                        canModify
                          ? 'Mark as seen'
                          : 'You cannot modify this notification'
                      }
                    >
                      <MdDoneAll size={18} />
                    </button>
                  ) : (
                    <button
                      className='btn rounded-circle d-flex align-items-center justify-content-center'
                      style={{
                        background: canModify
                          ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                          : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                        border: 'none',
                        color: '#ffffff',
                        cursor: canModify ? 'pointer' : 'not-allowed',
                        opacity: canModify ? 1 : 0.6,
                      }}
                      onClick={() => handleComplete(notification.id, false)}
                      disabled={!canModify}
                      title={
                        canModify
                          ? 'Mark as unseen'
                          : 'You cannot modify this notification'
                      }
                    >
                      <MdOutlineRemoveDone size={18} />
                    </button>
                  )}

                  {!canModify && (
                    <div
                      className='text-center px-2 py-1 rounded-2'
                      style={{
                        background: 'rgba(245, 158, 11, 0.1)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        fontSize: '0.65rem',
                        color: '#d97706',
                        lineHeight: '1.2',
                        maxWidth: '80px',
                      }}
                    >
                      Only assigned or admin users can modify
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Professional Error Display */}
          {errorMessage && (
            <div
              className='mx-0 mb-3 p-3 rounded-3 border'
              style={{
                backgroundColor: isError ? '#fefce8' : '#f0fdf4',
                border: isError ? '1px solid #fbbf24' : '1px solid #22c55e',
                maxWidth: '500px',
                margin: '0 auto',
              }}
            >
              <div className='d-flex align-items-center gap-3'>
                <div
                  className='d-flex align-items-center justify-content-center rounded-2 flex-shrink-0'
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: isError ? '#d97706' : '#16a34a',
                    color: 'white',
                  }}
                >
                  <svg
                    width='16'
                    height='16'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    {isError ? (
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    ) : (
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    )}
                  </svg>
                </div>
                <div>
                  <h6
                    className='fw-bold mb-1'
                    style={{
                      color: isError ? '#d97706' : '#16a34a',
                      fontSize: '0.9rem',
                    }}
                  >
                    {isError ? 'Error' : 'Success'}
                  </h6>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: isError ? '#b45309' : '#15803d',
                    }}
                  >
                    {renderErrors(errorMessage)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div
          className='d-flex align-items-center justify-content-center'
          style={{ minHeight: '100px' }}
        >
          <LoadingComponent />
        </div>
      )}
    </>
  );
};

export default Notification;
