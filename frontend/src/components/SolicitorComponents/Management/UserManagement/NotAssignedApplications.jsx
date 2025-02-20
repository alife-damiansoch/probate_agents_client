import { Fragment, useEffect, useState } from 'react';
import NotAssignedApplicationSingle from './NotAssignedApplicationSingle';
import Cookies from 'js-cookie';
import { fetchData } from '../../../GenericFunctions/AxiosGenericFunctions';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';

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

  useEffect(() => {
    const fetchAssignments = async () => {
      if (token) {
        setIsLoading(true);
        const endpoint = '/api/assignments/assignments/';
        const response = await fetchData(token, endpoint);
        // console.log(response.data);

        if (response.status === 200) {
          //setting up two of them, because when im adding not assigned im getting the infinite loop
          setAssignments(response.data);
        } else {
          setErrors(response.data);
        }
      }
      setIsLoading(false);
    };

    fetchAssignments();
  }, [token]);

  // console.log(notAssignedApplications);

  if (isLoading) {
    return <LoadingComponent />;
  }
  return (
    <>
      {showApplications && (
        <div className='applications-container'>
          {notAssignedApplications.map((application) => (
            <Fragment key={application.id}>
              <NotAssignedApplicationSingle
                application={application}
                advancement={application.loan}
                staffUsers={staffUsers}
                refresh={refresh}
                setRefresh={setRefresh}
                assignments={assignments}
              />
            </Fragment>
          ))}
        </div>
      )}
      {errors && (
        <div className='alert alert-danger'>
          <div className={`alert text-center text-danger`} role='alert'>
            {renderErrors(errors)}
          </div>
        </div>
      )}
    </>
  );
};

export default NotAssignedApplications;
