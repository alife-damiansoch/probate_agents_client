import { Fragment, useState } from 'react';
import { patchData } from '../../../GenericFunctions/AxiosGenericFunctions';
import renderErrors, {
  displayUserTeams,
} from '../../../GenericFunctions/HelperGenericFunctions';
import AnimatedWrapper from '../../../GenericFunctions/AnimationFuctions';

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
      `Are you sure you want to reassign the following applications: ${applicationIdsString}?`
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
          setErrorMessage({ Applications: 'updated' });
          setIsError(false);
          setRefresh(!refresh);
        } else {
          setErrorMessage('Some updates failed');
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

  return (
    <AnimatedWrapper>
      {/* Staff Users Dropdown */}

      <div className='row mb-2 '>
        <div className='col-12 col-md-8 mx-auto shadow'>
          <label htmlFor='staffUsersDropdown' className='form-label'>
            Select Staff User:
          </label>
          <div className='input-group row'>
            <div className=' col-12 col-md-9'>
              <select
                id='staffUsersDropdown'
                className='form-select form-select-sm shadow'
                value={selectedEmail}
                onChange={handleEmailChange}
                style={{ width: '100%', fontSize: '0.875rem' }} // Smaller font size and full width
              >
                <option value=''>Select user</option>
                {staffUsers &&
                  staffUsers.map((user) => (
                    <Fragment key={user.id}>
                      {user.is_active && (
                        <option key={user.id} value={user.id}>
                          {user.email}
                          {displayUserTeams(user)}
                        </option>
                      )}
                    </Fragment>
                  ))}
              </select>
            </div>
            {/* This button will remain connected on larger screens */}
            <div className=' col-12 col-md-3'>
              <button
                className='btn btn-outline-warning btn-sm d-none d-md-inline-block shadow mb-2'
                onClick={handleAssignClick}
                disabled={selectedUserId === 0 || loading}
                style={{ fontSize: '0.875rem', width: '100%' }} // Smaller font size
              >
                {loading ? 'Assigning...' : 'Assign'}
              </button>
            </div>
          </div>
          {selectedEmail && selectedEmail !== '' && (
            <p className='mt-2 text-success' style={{ fontSize: '0.875rem' }}>
              Selected User Email: <strong>{selectedEmail}</strong>
            </p>
          )}
          {/* This button will appear below the select on smaller screens */}
          <div className='d-md-none text-center mt-2'>
            <button
              className='btn btn-outline-warning btn-sm shadow mb-2'
              onClick={handleAssignClick}
              disabled={selectedUserId === 0 || loading}
              style={{ fontSize: '0.875rem', width: '100%' }} // Smaller font size
            >
              {loading ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div
          className={`alert text-center ${
            isError ? 'alert-warning text-danger' : 'alert-success text-success'
          }`}
          role='alert'
        >
          {renderErrors(errorMessage)}
        </div>
      )}
    </AnimatedWrapper>
  );
};

export default AssignComponent;
