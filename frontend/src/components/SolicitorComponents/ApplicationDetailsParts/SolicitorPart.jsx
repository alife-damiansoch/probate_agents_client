import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {
  fetchData,
  patchData,
} from '../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';
import { Link } from 'react-router-dom';

const SolicitorPart = ({
  solicitor_id,
  application_id,
  refresh,
  setRefresh,
}) => {
  const token = Cookies.get('auth_token_agents');
  const [errors, setErrors] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [solicitors, setSolicitors] = useState(null);
  const [assignedSolicitor, setAssignedSolicitor] = useState(null);

  // useEffect to fetch all solicitors for logged-in user
  useEffect(() => {
    const fetchSolicitors = async () => {
      setIsLoading(true); // Set loading state before fetching
      if (token) {
        const endpoint = `/api/applications/solicitors/`;
        try {
          const response = await fetchData(token, endpoint);

          if (response.status === 200) {
            setSolicitors(response.data);
            setIsError(false);
          } else {
            setErrors(response.data);
            setIsError(true);
          }
        } catch (error) {
          console.error('Error fetching solicitors:', error);
          setErrors('An error occurred while fetching solicitors.');
          setIsError(true);
        } finally {
          setIsLoading(false); // Ensure loading state is turned off after fetching
        }
      }
    };

    fetchSolicitors();
  }, [token, refresh]); // Dependency on token and refresh

  // useEffect to setup selected Solicitor if any selected
  useEffect(() => {
    if (solicitors) {
      setIsLoading(true); // Start loading state for assignment setup
      const selectedSolicitor = solicitors.find(
        (solicitor) => solicitor.id === solicitor_id
      );

      if (selectedSolicitor) {
        setAssignedSolicitor(selectedSolicitor);
      } else {
        setAssignedSolicitor(null); // Reset if not found
      }

      setIsLoading(false); // End loading state
    }
  }, [solicitor_id, solicitors]);

  const updateSelectedSolicitor = async (solicitor_id) => {
    const data = {
      solicitor: solicitor_id,
    };

    try {
      const endpoint = `/api/applications/solicitor_applications/${application_id}/`;
      const response = await patchData(endpoint, data);
      if (response.status !== 200) {
        setIsError(true);
        setErrors(response.data);
      } else {
        setIsError(false);
        setRefresh(!refresh);
        setErrors({ Solicitor: 'updated' });
        setTimeout(() => {
          setErrors('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating application:', error);
      setIsError(true);
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors(error.message);
      }
    }
  };

  return (
    <div className='card my-2 rounded bg-dark-subtle border-0 '>
      <div className='card-header rounded-top'>
        <div className='card-title text-info-emphasis col-12 row'>
          <div className='col-8'>
            <h3>Assigned Solicitor</h3>
          </div>
          <div className='col-4 text-end'>
            <a
              className='btn btn-sm btn-success'
              href={`/communication/${application_id}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              Open Communication
            </a>
          </div>
        </div>
      </div>
      <div className='card-body'>
        {isLoading ? ( // Conditional rendering based on loading state
          <div className='alert alert-info mt-3' role='alert'>
            Loading solicitors...
          </div>
        ) : (
          <div className='row mb-3'>
            <div className='col-md-6'>
              <label htmlFor='solicitor-select' className='form-label'>
                Assigned Solicitor:
              </label>
              <select
                id='solicitor-select'
                className='form-select form-select-sm shadow'
                onChange={(e) => updateSelectedSolicitor(e.target.value)}
                value={assignedSolicitor ? assignedSolicitor.id : ''}
                disabled
              >
                <option value='' disabled>
                  {assignedSolicitor
                    ? `${assignedSolicitor.title} ${assignedSolicitor.first_name} ${assignedSolicitor.last_name}`
                    : 'Select assigned solicitor'}
                </option>
                {solicitors &&
                  solicitors.map((solicitor) => (
                    <option
                      key={solicitor.id}
                      value={solicitor.id}
                      className={
                        solicitor.id === solicitor_id ? 'text-bg-info' : ''
                      }
                    >
                      {solicitor.title} {solicitor.first_name}{' '}
                      {solicitor.last_name}
                    </option>
                  ))}
              </select>
            </div>
            <div className='col-md-6 mt-4 text-center mt-md-auto'>
              <div className='col-12'>
                <Link
                  className='btn btn-sm btn-outline-info shadow'
                  to={`/solicitors/${application_id}`}
                >
                  View solicitors for this firm
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {isError && errors && (
        <div
          className={`col-8 mx-auto alert text-center ${
            isError ? 'alert-warning text-danger' : 'alert-success text-success'
          }`}
          role='alert'
        >
          {renderErrors(errors)}
        </div>
      )}

      {!isError && (
        <div
          className='col-8 mx-auto alert alert-danger text-center shadow py-0'
          role='alert'
        >
          {renderErrors([
            {
              Agent: "Solicitor can't be assigned or changed by the agent.",
            },
          ])}
        </div>
      )}
    </div>
  );
};

export default SolicitorPart;
