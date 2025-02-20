import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchData } from '../GenericFunctions/AxiosGenericFunctions';
import { GiMailbox } from 'react-icons/gi';
import { useSelector } from 'react-redux';

const InfoEmialIcon = ({ title, personal = false, updateUnseenMessages }) => {
  const [unseenInfoMessagesCount, setInfoUnseenMessagesCount] = useState(0);
  const [refreshCountUnseenMessages, setRefreshCountUnseenMessages] =
    useState(false);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const updateInfoUnseenMessagesCount = async () => {
      try {
        let endpoint;
        if (!personal) {
          endpoint = `/api/communications/count-unseen_info_email/`;
        } else {
          endpoint = `/api/communications/user_emails/count-unseen/`;
        }

        const response = await fetchData('token', endpoint);
        if (response.status === 200) {
          setInfoUnseenMessagesCount(response.data.unseen_count);
        } else {
          console.log('Error getting unseen info email count ' + response.data);
        }
      } catch (error) {
        console.error('Error fetching solicitors:', error);
        console.log(
          'An error occurred while fetching unseen info emails count.'
        );
      }
    };

    if (isLoggedIn) {
      updateInfoUnseenMessagesCount();
    }
  }, [isLoggedIn, refreshCountUnseenMessages, personal]);

  // useEffect for auto-refresh functionality (every 120 seconds)
  useEffect(() => {
    let countdown = 30; // Local variable for countdown
    const countdownInterval = setInterval(() => {
      if (countdown > 1) {
        countdown -= 1;
      } else {
        setRefreshCountUnseenMessages((prevRefresh) => !prevRefresh); // Trigger refresh when countdown reaches 0
        console.log('Info unseen emails count refreshed');
        countdown = 30; // Reset countdown
      }
    }, 1000);

    return () => clearInterval(countdownInterval); // Cleanup interval on component unmount
  }, []);

  // useEffect that updates the total unseen messages in the parent component
  useEffect(() => {
    // Update parent with the current unseen messages count
    updateUnseenMessages(unseenInfoMessagesCount);
  }, [unseenInfoMessagesCount, updateUnseenMessages]);

  return (
    <div className=' d-flex flex-column justify-content-center align-items-center mx-2'>
      <div style={{ position: 'relative' }}>
        <Link
          className={`btn border-0 d-flex flex-column justify-content-center align-items-center ${
            unseenInfoMessagesCount === 0
              ? 'btn-outline-success'
              : 'btn-outline-danger'
          }`}
          to={personal ? '/communication/-2' : '/communication/-1'}
        >
          <GiMailbox size={25} />
          {unseenInfoMessagesCount > 0 && (
            <div style={{ position: 'absolute', top: '0%', right: '15%' }}>
              {unseenInfoMessagesCount}
            </div>
          )}
        </Link>
        {/* <a
          className={` btn  border-0 d-flex flex-column justify-content-center align-items-center ${
            unseenInfoMessagesCount === 0
              ? 'btn-outline-success'
              : 'btn-outline-danger'
          }`}
          href={`${!personal ? '/communication/-1' : '/communication/-2'}`}
          target='_blank'
          rel='noopener noreferrer'
        >
          <GiMailbox size={25} />
          {unseenInfoMessagesCount > 0 && (
            <div style={{ position: 'absolute', top: '0%', right: '15%' }}>
              {unseenInfoMessagesCount}
            </div>
          )}
        </a> */}
      </div>
      <p>
        <small className='text-muted text-lowercase'>{title}</small>
      </p>
    </div>
  );
};

export default InfoEmialIcon;
