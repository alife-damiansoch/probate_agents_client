import { useParams } from 'react-router-dom';
import Chat from './CustomChat/Chat';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { fetchData } from '../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../GenericFunctions/HelperGenericFunctions';
import BackToApplicationsIcon from '../GenericComponents/BackToApplicationsIcon';

const Communication = () => {
  const [application, setApplication] = useState(null);
  const [selectedSolicitorId, setSelectedSolicitorId] = useState('');
  const [assignedSolicitorId, setAssignedSolicitorId] = useState(null);
  const [solicitor, setSolicitor] = useState(null);
  const [errors, setErrors] = useState(null);

  const token = Cookies.get('auth_token_agents');
  const { applicationId } = useParams();

  // fetching application
  useEffect(() => {
    const fetchApplication = async () => {
      setErrors(null);
      if (token && parseInt(applicationId) > 0) {
        const { access } = token;
        const endpoint = `/api/applications/agent_applications/${applicationId}/`;
        try {
          const response = await fetchData(access, endpoint);
          if (response.status === 200) {
            setApplication(response.data);
          } else {
            setErrors(response.data);
          }
        } catch (error) {
          console.error('Error fetching application details:', error);
        }
      }
    };
    fetchApplication();
  }, [token, applicationId]);

  //setting up solicitor id
  useEffect(() => {
    if (application) {
      if (application.solicitor) {
        setAssignedSolicitorId(application.solicitor);
        setSelectedSolicitorId(application.solicitor);
      } else {
        setSelectedSolicitorId(application.user.id);
      }
    }
  }, [application]);

  // fetching solicitor
  useEffect(() => {
    const fetchSolicitor = async () => {
      if (token) {
        const { access } = token;
        const endpoint = `/api/applications/solicitors/${selectedSolicitorId}/`;
        try {
          const response = await fetchData(access, endpoint);
          console.log(response);
          setSolicitor(response.data);
        } catch (error) {
          console.error('Error fetching solicitor details:', error);
        }
      }
    };
    if (selectedSolicitorId && selectedSolicitorId !== '') {
      fetchSolicitor();
    }
  }, [token, selectedSolicitorId]);

  // console.log(application);

  return (
    <>
      <BackToApplicationsIcon backUrl={-1} />
      {(application || parseInt(applicationId) < 0) && (
        <Chat
          application_id={applicationId}
          application={application}
          solicitor={solicitor}
          assignedSolicitorId={assignedSolicitorId}
        />
      )}
      {errors !== null && (
        <div
          className='col-8 mx-auto alert alert-danger text-center shadow py-0'
          role='alert'
        >
          {renderErrors([{ errors }])}
        </div>
      )}
    </>
  );
};

export default Communication;
