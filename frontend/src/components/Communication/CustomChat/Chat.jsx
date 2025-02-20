import  { useEffect, useRef, useState } from 'react';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import Cookies from 'js-cookie';
import { fetchData } from '../../GenericFunctions/AxiosGenericFunctions';
import MessageBubble from './ChatComponents/MessageBubble';
import 'draft-js/dist/Draft.css';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';
import { WiCloudRefresh } from 'react-icons/wi';
import MultipleEmailsAlert from './ChatComponents/MultipleEmailsAlert';
import ApplicationFilterInput from './ChatComponents/ApplicationFilterInput';
import SendEmailComponent from './ChatComponents/SendEmailComponent';
import { useSelector } from 'react-redux';
import { OWN_INFO_EMAIL } from '../../../baseUrls';

const Chat = ({
  application_id,
  application,
  solicitor,
  assignedSolicitorId,
}) => {
  // States for managing various data
  const [chatEmail, setChatEmail] = useState(''); // Stores email for chat communication
  const [loadingCommunication, setLoadingCommunication] = useState(false); // Tracks loading state for communications
  const [error, setError] = useState(null); // Stores any error messages
  const [messages, setMessages] = useState(null); // Stores fetched messages
  const [
    filteredMessagesByAssignedSolicitor,
    setFilteredMessagesByAssignedSolicitor,
  ] = useState(null); // Stores messages filtered by the assigned solicitor's email
  const [messagesAfterSetup, setMessagesAfterSetup] = useState(null); // Stores messages after setup (initial fetch)
  const [
    messagesAfterSetupAndFilteredByApp,
    setMessagesAfterSetupAndFilteredByApp,
  ] = useState(null); // Stores messages filtered by selected application ID
  const [refresh, setRefresh] = useState(false); // Used to trigger a refresh of the message data
  const [assignedSolicitorEmail, setAssignedSolicitorEmial] = useState(''); // Stores the assigned solicitor's email
  const [
    filterMessagesByAssignedSolicitorOnly,
    setFilterMessagesByAssignedSolicitorOnly,
  ] = useState(true); // Toggle between showing messages for assigned solicitor or general messages
  const [
    selectedApplicationIdForFilterring,
    setSelectedApplicationIdForFilterring,
  ] = useState(''); // Stores the selected application ID for filtering

  const token = Cookies.get('auth_token_agents'); // Fetches the token for authentication
  const messagesEndRef = useRef(null); // Reference to the end of the message list (for auto-scrolling)
  const messagesContainerRef = useRef(null); // Reference to the message container (for scrolling control)

  const user = useSelector((state) => state.user.user);

  // useEffect to set the email based on solicitor or user
  useEffect(() => {
    if (application && application !== '') {
      if (solicitor && solicitor.own_email && solicitor.own_email !== '') {
        setChatEmail(solicitor.own_email);
      } else {
        setChatEmail(application.user.email);
      }
    }
  }, [application, solicitor]);

  // useEffect to fetch communications for the current solicitor/application
  useEffect(() => {
    const fetchCommunicationWithSolicitor = async () => {
      if (token) {
        setLoadingCommunication(true);
        let endpoint = '';
        if (parseInt(application_id) > 0) {
          endpoint = `/api/communications/list_by_solicitor_firm/?firm_id=${application.user.id}`;
        } else if (parseInt(application_id) === -1) {
          endpoint = `/api/communications/list/`;
        } else if (parseInt(application_id) === -2) {
          endpoint = `/api/communications/user_emails/list/`;
        }

        try {
          const response = await fetchData(token, endpoint);
          if (response.status === 200) {
            if (messages === null) {
              setMessages(response.data);
              setMessagesAfterSetup(response.data); // Set initial message data
            } else if (
              messages.length !== response.data.length ||
              !areMessagesEqual(messages, response.data)
            ) {
              setMessages(response.data); // Update messages only if there are changes
              setMessagesAfterSetup(response.data);
            }
          } else {
            setError(response.data);
          }
        } catch (error) {
          console.error('Error fetching solicitors:', error);
          setError('An error occurred while fetching solicitors.');
        } finally {
          setLoadingCommunication(false);
        }
      }
    };

    // Helper function to check if messages have changed
    const areMessagesEqual = (oldMessages, newMessages) => {
      return oldMessages.every(
        (message, index) =>
          JSON.stringify(message) === JSON.stringify(newMessages[index])
      );
    };

    fetchCommunicationWithSolicitor();
    // eslint-disable-next-line
  }, [application, token, refresh, application_id]);

  // useEffect to auto-scroll to the bottom of the message container when new messages are loaded
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // useEffect to fetch assigned solicitor details based on solicitor ID
  useEffect(() => {
    if (token && assignedSolicitorId) {
      const fetchAssignedSolicitor = async () => {
        const { access } = token;
        const endpoint = `/api/applications/solicitors/${assignedSolicitorId}/`;
        try {
          const response = await fetchData(access, endpoint);
          if (response.status === 200) {
            if (response.data.own_email && response.data.own_email !== '') {
              setAssignedSolicitorEmial(response.data.own_email); // Set the assigned solicitor's email
            }
          }
        } catch (error) {
          console.error('Error fetching solicitor details:', error);
        }
      };

      fetchAssignedSolicitor();
    }
  }, [assignedSolicitorId, token]);

  // useEffect to filter messages by assigned solicitor's email
  useEffect(() => {
    if (assignedSolicitorEmail && assignedSolicitorEmail !== '') {
      if (messages) {
        const filteredMessages = messages.filter(
          (message) =>
            message.sender === assignedSolicitorEmail ||
            message.recipient === assignedSolicitorEmail
        );
        setFilteredMessagesByAssignedSolicitor(filteredMessages); // Filtered messages for the assigned solicitor
      }
    }
  }, [messages, assignedSolicitorEmail]);

  // Toggle between solicitor's email and user's email for filtering messages
  const toggleEmailAndMessageUserOrSolicitorEmail = () => {
    if (filterMessagesByAssignedSolicitorOnly) {
      setFilterMessagesByAssignedSolicitorOnly(false);
      setMessagesAfterSetup(messages); // Reset to all messages
      setChatEmail(application.user.email); // Set chat email to user's email
    } else {
      setFilterMessagesByAssignedSolicitorOnly(true);
      setMessagesAfterSetup(filteredMessagesByAssignedSolicitor); // Show messages for solicitor only
      setChatEmail(assignedSolicitorEmail); // Set chat email to solicitor's email
    }
  };

  // useEffect to filter messages by application ID
  useEffect(() => {
    if (selectedApplicationIdForFilterring !== '') {
      const filteredMessages = messagesAfterSetup?.filter(
        (message) =>
          message.application === parseInt(selectedApplicationIdForFilterring)
      );
      setMessagesAfterSetupAndFilteredByApp(filteredMessages); // Update the filtered messages based on application ID
    } else {
      setMessagesAfterSetupAndFilteredByApp(messagesAfterSetup); // Show all messages if no filter is applied
    }
  }, [selectedApplicationIdForFilterring, messagesAfterSetup]);

  if (application_id > 0) {
    if (application === null || solicitor === null) {
      return <LoadingComponent />;
    }
  } else if (messagesAfterSetupAndFilteredByApp === null) {
    return <LoadingComponent />;
  }

  // console.log(messagesAfterSetupAndFilteredByApp);

  return (
    <div
      className='card w-100 h-100 rounded bg-body-tertiary text-info-emphasis text-center'
      style={{ height: '100vh' }}
    >
      <div className='card-header'>
        <h4 className='text-info-emphasis'>
          {parseInt(application_id) === -1 ? (
            <span className=' text-lowercase'>{OWN_INFO_EMAIL}</span>
          ) : parseInt(application_id) === -2 ? (
            <span className=' text-lowercase'> {user?.email}</span>
          ) : (
            application.user.name
          )}
        </h4>
        <br />
        {parseInt(application_id) > 0 && (
          <>
            <h6>
              <span className='text-muted'>Email:</span> {chatEmail}
            </h6>

            <h6>
              <span className='text-muted'>Assigned solicitor: </span>
              {solicitor.title && solicitor.title}{' '}
              {solicitor.first_name && solicitor.first_name}{' '}
              {solicitor.last_name && solicitor.last_name}
            </h6>
            {filteredMessagesByAssignedSolicitor && (
              <MultipleEmailsAlert
                filterMessagesByAssignedSolicitorOnly={
                  filterMessagesByAssignedSolicitorOnly
                }
                toggleEmailAndMessageUserOrSolicitorEmail={
                  toggleEmailAndMessageUserOrSolicitorEmail
                }
              />
            )}
          </>
        )}
      </div>
      {/* filter by application input */}
      <ApplicationFilterInput
        selectedApplicationIdForFilterring={selectedApplicationIdForFilterring}
        setSelectedApplicationIdForFilterring={
          setSelectedApplicationIdForFilterring
        }
      />
      {/* Message container */}
      <div
        className='card-body bg-info-subtle rounded text-dark-emphasis m-2 shadow p-2'
        style={{
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 300px)',
        }}
        ref={messagesContainerRef}
      >
        {messagesAfterSetupAndFilteredByApp &&
        messagesAfterSetupAndFilteredByApp.length > 0 ? (
          messagesAfterSetupAndFilteredByApp.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              refresh={refresh}
              setRefresh={setRefresh}
              application_id={application_id}
            />
          ))
        ) : (
          <div className='alert alert-info shadow'>No emails found</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className='row mx-0'>
        <div className='col-4 ms-auto'>
          <button
            className='btn btn-outline-success border-0'
            onClick={() => setRefresh(!refresh)}
          >
            {loadingCommunication ? (
              <small>Fetching new emails...</small>
            ) : (
              <>
                <WiCloudRefresh className=' icon-shadow' size={30} /> <br />
              </>
            )}
          </button>
        </div>
      </div>
      {/* {parseInt(application_id) > 0 && ( */}
      <div className='card-footer'>
        <SendEmailComponent
          setError={setError}
          application={application}
          token={token}
          setRefresh={setRefresh}
          refresh={refresh}
          chatEmail={parseInt(application_id) > 0 ? chatEmail : ''}
          filterMessagesByAssignedSolicitorOnly={
            filterMessagesByAssignedSolicitorOnly
          }
          application_id={application_id}
        />
      </div>
      {/* )} */}

      {error !== null && (
        <div
          className='col-8 mx-auto alert alert-danger text-center shadow py-0'
          role='alert'
        >
          {renderErrors([{ error }])}
        </div>
      )}
    </div>
  );
};

export default Chat;
