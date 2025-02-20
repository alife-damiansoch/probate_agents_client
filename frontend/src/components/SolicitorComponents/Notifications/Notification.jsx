import  { useState } from 'react';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';
import { patchData } from '../../GenericFunctions/AxiosGenericFunctions';
import { Link } from 'react-router-dom';
import { MdDoneAll } from 'react-icons/md';
import { MdOutlineRemoveDone } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { FaExclamationTriangle } from 'react-icons/fa';
import LoadingComponent from '../../GenericComponents/LoadingComponent';

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
  // console.log(notification);
  return (
    <>
      {user && notification ? (
        <>
          <div
            className=' mb-2'
            key={notification.id}
            style={{ position: 'relative' }}
          >
            <div
              className={`card py-2 px-4 col-12 shadow ${
                notification.seen ? 'bg-success-subtle' : 'bg-warning-subtle'
              }`}
            >
              <div className='row'>
                {notification.application ? (
                  <Link
                    className='col-12 link-info'
                    to={`/applications/${notification.application}`}
                  >
                    <small>
                      Application id:{' '}
                      {notification.application
                        ? notification.application
                        : 'Unknown'}
                    </small>
                    {notification.country && (
                      <sub>( {notification.country})</sub>
                    )}
                  </Link>
                ) : (
                  <p className='col-12 link-info'>
                    <small>
                      Application id:{' '}
                      {notification.application
                        ? notification.application
                        : 'Unknown'}
                    </small>
                  </p>
                )}

                <hr className=' mb-0 pb-0' />
                <div className='col-12 col-md-6 text-warning'>
                  <small>
                    Created by user:{' '}
                    {notification.created_by_email
                      ? notification.created_by_email
                      : 'Unknown'}
                  </small>
                </div>
                <div className='col-12 col-md-6 text-warning'>
                  <small>
                    Assigned to agent:{' '}
                    {notification.recipient_email
                      ? notification.recipient_email
                      : 'Not assigned'}
                  </small>
                </div>
                <hr className=' mb-0 pb-0' />
              </div>
              <div className='row mt-1'>
                <div className='col-12 col-md-10'>
                  <p className='mb-1 text-danger'>
                    <small>{notification.text}</small>
                  </p>
                  <p className='text-muted'>
                    <small>
                      {new Date(notification.timestamp).toLocaleString()}
                    </small>
                  </p>
                </div>

                <div className='col-12 col-md-2 my-auto mx-auto text-center'>
                  {!notification.seen ? (
                    <button
                      className='btn btn-sm btn-success  rounded-circle'
                      onClick={() => handleComplete(notification.id, true)}
                      disabled={
                        !user.is_superuser &&
                        notification.recipient_email &&
                        notification.recipient_email !== user.email
                      }
                    >
                      <MdDoneAll size={20} className='my-2' />
                    </button>
                  ) : (
                    <button
                      className='btn btn-sm btn-warning rounded-circle'
                      onClick={() => handleComplete(notification.id, false)}
                      disabled={
                        !user.is_superuser &&
                        notification.recipient_email &&
                        notification.recipient_email !== user.email
                      }
                    >
                      <MdOutlineRemoveDone size={20} className='my-2' />
                    </button>
                  )}
                  {!user.is_superuser &&
                    notification.recipient_email &&
                    notification.recipient_email !== user.email && (
                      <p
                        className='text-warning mt-3'
                        style={{ lineHeight: '0.8' }}
                      >
                        <sup>
                          Only assigned or admin users can mark as seen.
                        </sup>
                      </p>
                    )}
                </div>
              </div>
              {notification.recipient_email &&
                user.email &&
                notification.recipient_email === user.email && (
                  <FaExclamationTriangle
                    style={{ position: 'absolute', right: '10px' }}
                    color='red'
                    size={20}
                  />
                )}
            </div>
          </div>

          {errorMessage && (
            <div
              className={` col-8 mx-auto alert text-center ${
                isError
                  ? 'alert-warning text-danger'
                  : 'alert-success text-success'
              }`}
              role='alert'
            >
              {renderErrors(errorMessage)}
            </div>
          )}
        </>
      ) : (
        <LoadingComponent />
      )}
    </>
  );
};

export default Notification;
