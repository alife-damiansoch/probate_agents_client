import  { useState } from 'react';
import { FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { patchData } from '../../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';
import { useSelector } from 'react-redux';
import AnimatedWrapper from '../../../GenericFunctions/AnimationFuctions';
import { AnimatePresence } from 'framer-motion';

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
    <div className=''>
      {errorMessage && (
        <div
          className={` col-8 mx-auto alert text-center ${
            isError ? 'alert-warning text-danger' : 'alert-success text-success'
          }`}
          role='alert'
        >
          {renderErrors(errorMessage)}
        </div>
      )}
      <AnimatePresence>
        {notifications.length > 0 && user && user.email ? (
          notifications.map((notification, index) => (
            <AnimatedWrapper
              key={index}
              className={`card mb-2 shadow ${
                notification.recipient && user.email === notification.recipient
                  ? 'border-3 border-danger bg-danger-subtle'
                  : 'border-3 border-info bg-info-subtle'
              }`}
            >
              <div className='card-body d-flex justify-content-between align-items-center'>
                <div>
                  <small>
                    <strong className=' text-success'>
                      <Link
                        className=' link-info'
                        to={`/applications/${notification.application_id}`}
                        onClick={() => {
                          setShowNotifications(false);
                        }}
                      >
                        Application: {notification.application_id}
                      </Link>
                    </strong>{' '}
                    {notification.changes ? (
                      notification.changes.map((change, index) => (
                        <p className=' mb-0' key={index}>
                          {change}
                        </p>
                      ))
                    ) : notification.message ? (
                      <p className=' mb-0 text-black' key={index}>
                        {notification.message}
                      </p>
                    ) : (
                      <p className=' mb-0 text-black' key={index}>
                        Unrecognized change
                      </p>
                    )}
                  </small>
                  <p className=' text-muted mb-0'>
                    <small>
                      {notification.recipient
                        ? `Agent: ${notification.recipient}`
                        : 'Not assigned'}
                    </small>
                  </p>
                </div>
                <div>
                  {notification.recipient === user.email && (
                    <button
                      className='btn btn-sm btn-outline-success rounded-circle mx-2 border-0 py-0 px-1'
                      onClick={() =>
                        handleSeenTrue(notification.notification_id, index)
                      }
                    >
                      <FiCheckCircle size={14} className='icon-shadow' />
                    </button>
                  )}

                  <button
                    className='btn btn-sm btn-outline-danger rounded-circle mx-2 border-0 py-0 px-1'
                    onClick={() => handleClearNotification(index)}
                  >
                    <FiTrash2 size={14} className='icon-shadow' />
                  </button>
                </div>
              </div>
            </AnimatedWrapper>
          ))
        ) : (
          <AnimatedWrapper>
            <p>
              <small>No notifications</small>
            </p>
          </AnimatedWrapper>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsDisplayComponent;
