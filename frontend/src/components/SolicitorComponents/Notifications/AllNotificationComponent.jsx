import  { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { fetchData } from '../../GenericFunctions/AxiosGenericFunctions';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import Notification from './Notification';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';

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
    return <LoadingComponent />;
  }
  if (isError) {
    return (
      <div className=' alert alert-danger text-center'>
        {renderErrors(errorMessage)}
      </div>
    );
  }
  // console.log(allNotifications);
  return (
    <div className='card'>
      <div className=' card-header text-center'>
        <h4>Notifications ({allNotifications && allNotifications.length})</h4>
      </div>
      <div className=' card-body'>
        {allNotifications ? (
          <div className='row'>
            {allNotifications.map((notification, index) => (
              <Notification
                notification={notification}
                refresh={refresh}
                setRefresh={setRefresh}
                key={index}
              />
            ))}
          </div>
        ) : (
          <LoadingComponent />
        )}
      </div>
    </div>
  );
};

export default AllNotificationComponent;
