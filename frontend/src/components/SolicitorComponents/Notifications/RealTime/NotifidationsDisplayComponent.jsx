import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AnimatedWrapper from '../../../GenericFunctions/AnimationFuctions';
import { patchData } from '../../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';

const NotificationsDisplayComponent = ({
  notifications,
  setNotifications,
  setShowNotifications,
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [, setExitingNotifications] = useState([]); // Track notifications being removed

  const { user } = useSelector((state) => state.user);

  const handleClearNotification = (index) => {
    const notificationToRemove = notifications[index];
    setExitingNotifications((prev) => [
      ...prev,
      notificationToRemove.notification_id,
    ]);

    setTimeout(() => {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((_, i) => i !== index)
      );
      setExitingNotifications((prev) =>
        prev.filter((id) => id !== notificationToRemove.notification_id)
      );
    }, 500); // Delay matches exit animation duration
  };

  const handleSeenTrue = async (notification_id, index) => {
    try {
      const endpoint = `/api/applications/notifications/${notification_id}/`;
      const response = await patchData(endpoint, {
        seen: true,
      });
      if (response.status !== 200) {
        setIsError(true);
        setErrorMessage(response.data);
      } else {
        setErrorMessage({ Notification: 'updated' });
        setIsError(false);
        handleClearNotification(index); // Mark as seen and remove
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
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

  // console.log(user);
  return (
    <div>
      {/* Professional Error Display */}
      {errorMessage && (
        <div
          className='mb-3 p-3 rounded-3 border'
          style={{
            backgroundColor: isError ? '#fefce8' : '#f0fdf4',
            border: isError ? '1px solid #fbbf24' : '1px solid #22c55e',
          }}
        >
          <div className='d-flex align-items-center gap-2'>
            <div
              className='d-flex align-items-center justify-content-center rounded-2 flex-shrink-0'
              style={{
                width: '24px',
                height: '24px',
                backgroundColor: isError ? '#d97706' : '#16a34a',
                color: 'white',
              }}
            >
              <svg
                width='12'
                height='12'
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
                className='fw-bold mb-0'
                style={{
                  color: isError ? '#d97706' : '#16a34a',
                  fontSize: '0.8rem',
                }}
              >
                {isError ? 'Error' : 'Success'}
              </h6>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: isError ? '#b45309' : '#15803d',
                }}
              >
                {renderErrors(errorMessage)}
              </div>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {notifications.length > 0 && user && user.email ? (
          notifications.map((notification, index) => {
            const isAssignedToUser =
              notification.recipient && user.email === notification.recipient;

            return (
              <AnimatedWrapper key={index} className='mb-3'>
                <div
                  style={{
                    background: isAssignedToUser
                      ? 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)'
                      : 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
                    borderRadius: '12px',
                    border: isAssignedToUser
                      ? '2px solid #f87171'
                      : '2px solid #60a5fa',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                    transition: 'all 0.2s ease',
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
                  {/* Priority indicator */}
                  {isAssignedToUser && (
                    <div
                      style={{
                        background:
                          'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                        padding: '4px 0',
                        textAlign: 'center',
                      }}
                    >
                      <span
                        style={{
                          color: '#ffffff',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                        }}
                      >
                        ⚠️ ASSIGNED TO YOU
                      </span>
                    </div>
                  )}

                  <div className='d-flex justify-content-between align-items-center p-3'>
                    <div className='flex-grow-1 me-3'>
                      <small>
                        <strong className='text-success'>
                          <Link
                            className='link-info'
                            to={`/applications/${notification.application_id}`}
                            onClick={() => {
                              setShowNotifications(false);
                            }}
                            style={{
                              color: '#1e40af',
                              fontWeight: '600',
                              textDecoration: 'none',
                            }}
                          >
                            Application: {notification.application_id}
                          </Link>
                        </strong>{' '}
                        {notification.changes ? (
                          notification.changes.map((change, changeIndex) => (
                            <p
                              className='mb-0'
                              key={changeIndex}
                              style={{ fontSize: '0.85rem', color: '#374151' }}
                            >
                              {change}
                            </p>
                          ))
                        ) : notification.message ? (
                          <p
                            className='mb-0 text-black'
                            style={{ fontSize: '0.85rem' }}
                          >
                            {notification.message}
                          </p>
                        ) : (
                          <p
                            className='mb-0 text-black'
                            style={{ fontSize: '0.85rem' }}
                          >
                            Unrecognized change
                          </p>
                        )}
                      </small>
                      <p className='text-muted mb-0'>
                        <small style={{ fontSize: '0.75rem' }}>
                          {notification.recipient
                            ? `Agent: ${notification.recipient}`
                            : 'Not assigned'}
                        </small>
                      </p>
                    </div>
                    <div className='d-flex flex-column gap-2'>
                      {notification.recipient === user.email && (
                        <button
                          className='btn btn-sm rounded-circle d-flex align-items-center justify-content-center'
                          style={{
                            background:
                              'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                            border: 'none',
                            color: '#ffffff',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                          }}
                          onClick={() =>
                            handleSeenTrue(notification.notification_id, index)
                          }
                          onMouseEnter={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = 'scale(1)';
                          }}
                        >
                          <FiCheckCircle size={16} />
                        </button>
                      )}

                      <button
                        className='btn btn-sm rounded-circle d-flex align-items-center justify-content-center'
                        style={{
                          background:
                            'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          border: 'none',
                          color: '#ffffff',
                          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                        onClick={() => handleClearNotification(index)}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'scale(1)';
                        }}
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </AnimatedWrapper>
            );
          })
        ) : (
          <AnimatedWrapper>
            <div
              className='d-flex flex-column align-items-center justify-content-center text-center'
              style={{ minHeight: '120px' }}
            >
              <div
                className='d-flex align-items-center justify-content-center rounded-3 mb-3'
                style={{
                  width: '48px',
                  height: '48px',
                  background:
                    'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                  border: '2px solid #d1d5db',
                  color: '#9ca3af',
                }}
              >
                <svg
                  width='24'
                  height='24'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z' />
                </svg>
              </div>
              <h6
                className='fw-bold mb-1'
                style={{ color: '#6b7280', fontSize: '0.9rem' }}
              >
                No Notifications
              </h6>
              <p
                className='mb-0'
                style={{ fontSize: '0.8rem', color: '#9ca3af' }}
              >
                You're all caught up!
              </p>
            </div>
          </AnimatedWrapper>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsDisplayComponent;
