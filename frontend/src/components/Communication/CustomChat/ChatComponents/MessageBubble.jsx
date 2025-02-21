import DOMPurify from 'dompurify';
import { useState, useMemo, Fragment, useEffect } from 'react';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import AssignApplication from './AssignApplication';
import {
  downloadFileAxios,
  patchData,
} from '../../../GenericFunctions/AxiosGenericFunctions';
import { MdOutlineReply } from 'react-icons/md';
import { BsShieldExclamation } from 'react-icons/bs';
import ReplyComponent from './ReplyComponent/ReplyComponent';
import { RiEyeCloseLine, RiEyeFill } from 'react-icons/ri';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';
import { useSelector } from 'react-redux';

const MessageBubble = ({ message, refresh, setRefresh, application_id }) => {
  const [bubbleClass, setBubbleClass] = useState('');
  const [showAssignApplication, setShowAssignApplication] = useState(false);
  const [showReplyIcon, setShowReplyIcon] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.user.user);

  // Use useMemo to avoid recalculating the sanitized message on every render
  const sanitizedMessage = useMemo(() => {
    if (message && message.message) {
      return DOMPurify.sanitize(message.message);
    }
    return '';
  }, [message]);

  // Log only when the message changes
  // useEffect(() => {
  //   if (message) {
  //     console.log(message);
  //   }
  // }, [message]);

  // console.log(application_id);

  useEffect(() => {
    let newBubbleClass = '';
    let shouldShowReplyIcon = false;

    if (message) {
      if (!message.is_sent) {
        if (!message.application) {
          newBubbleClass = 'bg-warning-subtle';
          shouldShowReplyIcon = true;
        } else {
          newBubbleClass = 'bg-success-subtle';
          shouldShowReplyIcon = true;
        }
      } else {
        newBubbleClass = 'bg-light text-dark ms-auto';
        shouldShowReplyIcon = false;
      }
    }

    // if (message && user) {
    //   if (parseInt(application_id) === -2) {
    //     if (message.recipient === user.email) {
    //       newBubbleClass = 'bg-light';
    //       shouldShowReplyIcon = true;
    //     } else {
    //       newBubbleClass = 'bg-dark text-white ms-auto';
    //       shouldShowReplyIcon = false;
    //     }
    //   } else if (parseInt(application_id) === -1) {
    //     if (message.recipient.includes('@alife.ie')) {
    //       newBubbleClass = 'bg-light';
    //       shouldShowReplyIcon = true;
    //     } else {
    //       newBubbleClass = 'bg-dark text-white ms-auto';
    //       shouldShowReplyIcon = false;
    //     }
    //   } else {
    //     if (message.recipient === OWN_INFO_EMAIL) {
    //       newBubbleClass = 'bg-light';
    //       shouldShowReplyIcon = true;
    //     } else {
    //       newBubbleClass = 'bg-dark text-white ms-auto';
    //       shouldShowReplyIcon = false;
    //     }
    //   }
    // }

    setBubbleClass(newBubbleClass);
    setShowReplyIcon(shouldShowReplyIcon);
  }, [message, user, application_id]);

  const downloadAttachmentHandler = async (filePath) => {
    // console.log(filePath);
    try {
      const fileName = filePath.split(/[\/\\]/).pop();
      console.log(fileName);
      const endpoint = `/api/communications/download_attachment/${
        message.id
      }/${fileName}/${
        parseInt(application_id) === -2 ? '?is_user_email_log=true' : ''
      }`;
      const response = await downloadFileAxios('', endpoint);
      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } else {
        console.log(response.data);
      }
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  const handleToggleMessageSeen = async () => {
    setError(null);

    try {
      let endpoint = `/api/communications/update_seen/${message.id}/`;
      if (parseInt(application_id) === -2) {
        endpoint = `/api/communications/user_emails/update_seen/${message.id}/`;
      }

      const res = await patchData(endpoint, { seen: !message.seen });

      if (res.status === 200) {
        console.log('Status updated successfully');
        setRefresh(!refresh);
      } else {
        setError(res.data);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error sending email:', error);
    }
  };

  return (
    <div className='d-flex mb-2'>
      <div
        className={`p-2 card rounded shadow ${bubbleClass} ${
          !message.seen && 'border-2 border-danger bg-danger-subtle'
        }`}
        style={{
          minWidth: '80%',
          maxWidth: '90%',
          wordBreak: 'break-word',
          fontSize: '0.8rem',
        }}
      >
        <div className='card-header text-info row my-0 py-0'>
          <div className='col-md-4'>
            <small className='text-muted'>From:</small>{' '}
            {message.is_sent ? message.send_from : message.sender}{' '}
          </div>
          <div className='col-md-3'>
            <small className='text-muted'>To:</small> {message.recipient}
          </div>
          <div className='col-md-4'>
            <small className=' text-warning'>
              {message.created_at.split('T')[0]}{' '}
              {message.created_at.split('T')[1].split('.')[0]}
            </small>
          </div>
          {!message.is_sent && (
            <div className='col-md-1'>
              {message.seen ? (
                <button className=' btn btn-sm btn-outline-success border-0 m-0 py-0'>
                  <RiEyeFill
                    size={20}
                    onClick={() => handleToggleMessageSeen()}
                  />
                </button>
              ) : (
                <button className=' btn btn-sm btn-outline-danger border-0 m-0 py-0'>
                  <RiEyeCloseLine
                    size={20}
                    onClick={() => handleToggleMessageSeen()}
                  />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Conditional rendering */}
        {sanitizedMessage && sanitizedMessage !== '' ? (
          <>
            <div className='mb-1 mt-3  h4'>
              {message.subject && message.subject !== ''
                ? message.subject
                : 'No subject'}
            </div>
            <div
              className='card-body my-0 pb-0 mx-0 px-0 text-start'
              dangerouslySetInnerHTML={{ __html: sanitizedMessage }}
            ></div>
            {message.attachments &&
              message.original_filenames &&
              message.attachments.length > 0 &&
              message.original_filenames.length > 0 && (
                <div className='card-footer bg-info-subtle text-start text-black'>
                  <h6>Attachments:</h6>
                  {message.original_filenames.map((att_filename, index) => (
                    <Fragment key={index}>
                      <span
                        className=' link-info text-decoration-underline'
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          downloadAttachmentHandler(message.attachments[index]);
                        }}
                      >
                        {att_filename}
                      </span>
                      <br />
                    </Fragment>
                  ))}
                </div>
              )}
            {/* TODO move to env variables */}
            {showReplyIcon && (
              <div className=' text-end text-success-emphasis me-2 my-1'>
                <button
                  onClick={() => setShowReply(!showReply)}
                  className=' btn btn-sm btn-outline-success border-0'
                >
                  Reply <MdOutlineReply size={30} />
                </button>
              </div>
            )}
            {showReply && (
              <ReplyComponent
                emailLogId={message.id}
                setRefresh={setRefresh}
                refresh={refresh}
                setShowReply={setShowReply}
                application_id={application_id}
              />
            )}
            <div className='card-footer row mb-0 pb-0'>
              <div className='d-inline-block col-6 text-start'>
                {message.is_sent && message.send_from !== message.sender && (
                  <span className='text-success'>Sender: {message.sender}</span>
                )}
              </div>
              <div
                className='d-inline-block col-6  text-end'
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  setShowAssignApplication(!showAssignApplication);
                }}
              >
                {message.application ? (
                  <span className='text-success'>
                    Application id: {message.application}
                  </span>
                ) : (
                  <>
                    <span className='text-danger me-2'>No application</span>
                    <BsShieldExclamation size={30} color='red' />
                  </>
                )}
              </div>
              {showAssignApplication && (
                <AssignApplication
                  solicitor_firm_id={message.solicitor_firm}
                  application_id={message.application}
                  setShowAssignApplication={setShowAssignApplication}
                  message_id={message.id}
                  refresh={refresh}
                  setRefresh={setRefresh}
                  useUserEndpoint={parseInt(application_id) === -2}
                />
              )}
            </div>
          </>
        ) : (
          <LoadingComponent />
        )}
      </div>
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

export default MessageBubble;
