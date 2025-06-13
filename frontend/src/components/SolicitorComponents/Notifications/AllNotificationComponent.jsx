import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import { fetchData } from '../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';
import Notification from './Notification';

const AllNotificationComponent = () => {
  const [allNotifications, setAllNotifications] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const token = Cookies.get('auth_token_agents');

  useEffect(() => {
    setIsError(false);
    setIsLoading(true);

    const fetchNotifications = async () => {
      if (token) {
        let endpoint = `/api/applications/notifications/`;

        const response = await fetchData(token, endpoint);

        // console.log(response.data);

        // If the response is successful, set the applications state
        if (response.status === 200) {
          setAllNotifications(response.data.results);
          setIsLoading(false);
          // console.log(response.data);
        } else {
          setIsError(true);
          console.log(response.data);
          setErrorMessage(response.data); // Setting error messages if any
          setIsLoading(false);
        }
      }
    };
    fetchNotifications();
  }, [token, refresh]);

  if (isLoading) {
    return (
      <div
        className='d-flex align-items-center justify-content-center'
        style={{ minHeight: '60vh' }}
      >
        <LoadingComponent />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className='mx-0 mb-4 p-4 rounded-3 border'
        style={{
          backgroundColor: '#fef2f2',
          border: '2px solid #fca5a5',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <div className='d-flex align-items-center gap-3'>
          <div
            className='d-flex align-items-center justify-content-center rounded-2 flex-shrink-0'
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#dc2626',
              color: 'white',
            }}
          >
            <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div>
            <h6 className='fw-bold mb-1' style={{ color: '#dc2626' }}>
              Error Loading Notifications
            </h6>
            <div style={{ fontSize: '0.875rem', color: '#b91c1c' }}>
              {renderErrors(errorMessage)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // console.log(allNotifications);
  return (
    <div
      className='bg-white'
      style={{
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Modern Header */}
      <div
        className='bg-white border-bottom'
        style={{
          padding: '24px 32px',
          borderBottom: '2px solid #f3f4f6',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        }}
      >
        <div className='text-center'>
          <div className='d-flex align-items-center justify-content-center gap-3 mb-3'>
            <div
              className='d-flex align-items-center justify-content-center rounded-3'
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                border: '2px solid #7c3aed',
                color: '#ffffff',
              }}
            >
              <svg
                width='20'
                height='20'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z' />
              </svg>
            </div>
            <h1
              className='mb-0 fw-bold text-dark'
              style={{
                fontSize: '1.875rem',
                fontWeight: '700',
                letterSpacing: '-0.025em',
                color: '#7c3aed',
              }}
            >
              Notifications
            </h1>
          </div>

          <div className='d-flex align-items-center justify-content-center gap-4'>
            <span
              className='px-4 py-2 rounded-pill fw-semibold d-flex align-items-center gap-2'
              style={{
                background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
                border: '1px solid #c4b5fd',
                fontSize: '0.875rem',
                color: '#7c3aed',
              }}
            >
              <svg
                width='14'
                height='14'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
              {allNotifications ? allNotifications.length : 0} Notifications
            </span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div
        className='bg-white'
        style={{
          padding: '24px',
          minHeight: '400px',
          background: 'linear-gradient(135deg, #ffffff 0%, #fafbff 100%)',
        }}
      >
        {allNotifications ? (
          <>
            {allNotifications.length > 0 ? (
              <div className='row g-0'>
                <div className='col-12'>
                  {allNotifications.map((notification, index) => (
                    <div
                      key={index}
                      style={{
                        animation: `fadeInUp 0.3s ease-out ${
                          index * 0.05
                        }s both`,
                      }}
                    >
                      <Notification
                        notification={notification}
                        refresh={refresh}
                        setRefresh={setRefresh}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className='d-flex flex-column align-items-center justify-content-center text-center'
                style={{ minHeight: '300px' }}
              >
                <div
                  className='d-flex align-items-center justify-content-center rounded-3 mb-4'
                  style={{
                    width: '64px',
                    height: '64px',
                    background:
                      'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                    border: '2px solid #d1d5db',
                    color: '#9ca3af',
                  }}
                >
                  <svg
                    width='32'
                    height='32'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z' />
                  </svg>
                </div>
                <h4 className='fw-bold mb-2' style={{ color: '#6b7280' }}>
                  No Notifications
                </h4>
                <p
                  className='mb-0'
                  style={{ fontSize: '0.9rem', color: '#9ca3af' }}
                >
                  You're all caught up! No new notifications at this time.
                </p>
              </div>
            )}
          </>
        ) : (
          <div
            className='d-flex align-items-center justify-content-center'
            style={{ minHeight: '300px' }}
          >
            <LoadingComponent />
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AllNotificationComponent;
