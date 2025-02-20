import  { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { fetchData } from '../../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import NotAssignedApplications from './NotAssignedApplications';
import ListUsersWithAssignedApplications from './ListUsersWithAssignedApplications';

const UserManagement = () => {
  const [staffUsers, setStaffUsers] = useState(null);
  const [notAssignedApplications, setNotAssignedApplications] = useState(null);

  const [errors, setErrors] = useState('');
  const [showApplications, setShowApplications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const token = Cookies.get('auth_token_agents');

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      if (token) {
        const endpoint = '/api/user/';
        const response = await fetchData(token, endpoint);

        if (response.status === 200) {
          const allUsers = response.data;
          const sUsers = allUsers.filter(
            (user) => user.is_staff === true || user.is_superuser === true
          );
          setStaffUsers(sUsers);
        } else {
          setErrors(response.data);
        }
        setIsLoading(false);
      }
    };
    // console.log(staffUsers);
    const fetchApplications = async () => {
      setIsLoading(true);

      if (token) {
        const endpoint = `/api/applications/agent_applications?page_size=${9999}&assigned=${false}`;
        const response = await fetchData(token, endpoint);
        // console.log(response);

        if (response.status === 200) {
          const notAssApp = response.data.results;

          // console.log(notAssApp);
          setNotAssignedApplications(notAssApp);
        } else {
          setErrors(response.data);
        }
        setIsLoading(false);
      }
    };

    fetchUsers();
    fetchApplications();
  }, [token, refresh]);

  const toggleShowApplications = () => {
    setShowApplications((prevShow) => !prevShow);
  };

  if (isLoading) {
    return (
      <>
        <LoadingComponent />
        <div className='alert alert-info text-center'>
          This might take some time, fetching all applications... <br />
          If it takes to long, check the console window (F12)
        </div>
      </>
    );
  }
  //   console.log(staffUsers);
  return (
    <>
      {/* -----NOT ASSIGNED APPLICATIONS PART */}
      {/* Button to show/hide applications */}

      <button
        onClick={toggleShowApplications}
        className='btn btn-info shadow mb-2'
      >
        {showApplications
          ? 'Hide Not Assigned Applications'
          : `Show Not Assigned Applications ${
              notAssignedApplications
                ? `  (${notAssignedApplications.length})`
                : '(- 0)'
            }`}
      </button>

      {/* Compact horizontal cards for not assigned applications */}
      <NotAssignedApplications
        showApplications={showApplications}
        notAssignedApplications={notAssignedApplications}
        staffUsers={staffUsers}
        refresh={refresh}
        setRefresh={setRefresh}
      />

      {/* -----ASSIGNED APPLICATIONS PART */}
      {staffUsers ? (
        <ListUsersWithAssignedApplications
          staffUsers={staffUsers}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      ) : (
        <>
          <LoadingComponent />
        </>
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

export default UserManagement;
