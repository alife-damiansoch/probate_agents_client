import  { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {
  fetchData,
  patchData,
} from '../../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';

const AssignApplication = ({
  solicitor_firm_id = undefined,
  application_id = null,
  setShowAssignApplication,
  message_id,
  refresh,
  setRefresh,
  useUserEndpoint = false,
}) => {
  const [availableApplicationsIds, setAvailableApplicationIds] = useState(null);
  const [errors, setErrors] = useState(null);
  const [choosenApplicationIdToSet, setChoosenApplicationIdToSet] =
    useState('');
  const [loading, setLoading] = useState(false);

  const token = Cookies.get('auth_token_agents');

  useEffect(() => {
    if (application_id) {
      setChoosenApplicationIdToSet(application_id);
    }
  }, [application_id]);

  useEffect(() => {
    setErrors(null);
    if (solicitor_firm_id !== undefined) {
      let endpoint = '';
      if (solicitor_firm_id === null) {
        endpoint = `/api/applications/agent_applications/all_application_ids/`;
      } else {
        endpoint = `/api/applications/agent_applications/application_ids_by_user/?user_id=${solicitor_firm_id}`;
      }

      if (endpoint !== '') {
        const fetchApplication = async () => {
          setLoading(true);
          if (token) {
            const { access } = token;

            try {
              const response = await fetchData(access, endpoint);
              if (response.status === 200) {
                setAvailableApplicationIds(response.data.sort((a, b) => b - a));
              } else {
                setErrors(response.data);
              }
            } catch (error) {
              console.error('Error fetching application ids:', error);
            }
          }
          setLoading(false);
        };

        fetchApplication();
      } else {
        console.log('endpoint not defined');
      }
    }
  }, [solicitor_firm_id, token]);

  const handleSelectChange = (event) => {
    setChoosenApplicationIdToSet(event.target.value);
  };

  const assignApplicationHandler = async () => {
    setErrors(null);
    try {
      setLoading(true);
      let endpoint = `/api/communications/update_application_id/${message_id}/`;
      if (useUserEndpoint) {
        endpoint = `/api/communications/user_emails/update_application/${message_id}/`;
      }
      const res = await patchData(endpoint, {
        application: choosenApplicationIdToSet,
      });

      if (res.status === 200) {
        console.log('Application id updated');
        setRefresh(!refresh);
        setShowAssignApplication(false);
        if (application_id) {
          setChoosenApplicationIdToSet(application_id);
        } else {
          setChoosenApplicationIdToSet('');
        }
      } else {
        setErrors(res.data);
      }
    } catch (error) {
      setErrors(error.message);
      console.error('Error sending email:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <>
      {availableApplicationsIds && availableApplicationsIds.length > 0 && (
        <div className='mb-3'>
          <label htmlFor='basicSelect' className='form-label'>
            Choose an option:
          </label>
          <select
            id='basicSelect'
            className='form-select'
            value={choosenApplicationIdToSet}
            onChange={handleSelectChange}
          >
            <option value=''>Select an option</option>
            {availableApplicationsIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
          <div className='mt-2'>
            Selected Option: {choosenApplicationIdToSet}
          </div>
        </div>
      )}

      {errors !== null && (
        <div
          className='col-8 mx-auto alert alert-danger text-center shadow py-0'
          role='alert'
        >
          {renderErrors([{ errors }])}
        </div>
      )}
      <div className='row  justify-content-end'>
        <div className=' col-md-2'>
          <button
            className=' btn btn-sm btn-outline-success'
            onClick={() => {
              setChoosenApplicationIdToSet(application_id);
              setShowAssignApplication(false);
            }}
          >
            Cancel
          </button>
        </div>
        <div className=' col-md-2'>
          <button
            className=' btn btn-sm btn-outline-danger'
            onClick={() => assignApplicationHandler()}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default AssignApplication;
