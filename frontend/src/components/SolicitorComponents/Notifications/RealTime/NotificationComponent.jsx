import { useState, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { FiAlertCircle } from 'react-icons/fi';
import { MdNotifications, MdWifi, MdWifiOff, MdError } from 'react-icons/md';
import { RiLoader4Fill } from 'react-icons/ri'; // Icon for 'connecting' state
import { motion, useAnimation } from 'framer-motion'; // Import Framer Motion
import { WS_URL } from '../../../../baseUrls';
import { useSelector } from 'react-redux';

const NotificationComponent = ({
  showNotifications,
  setShowNotifications,
  notifications,
  setNotifications,
}) => {
  const [connectionStateIcon, setConnectionStateIcon] = useState(<MdError />); // State for icon representing the WebSocket state
  const controls = useAnimation(); // Framer Motion controls for animation
  const [isUserInteracted, setIsUserInteracted] = useState(false); // State to track user interaction
  const [userTeams, setUserTeams] = useState([]);

  const { lastMessage, readyState } = useWebSocket(
    `${WS_URL}/ws/notifications/`
  );
  const { user } = useSelector((state) => state.user);

  //getting user teams
  useEffect(() => {
    if (user) {
      const teams = [];
      user.teams?.map((team) => teams.push(team.name));
      setUserTeams(teams);
    }
  }, [user]);

  // console.log(userTeams);

  // Handle incoming notifications
  useEffect(() => {
    if (lastMessage !== null) {
      // Parse the incoming message
      const {
        message,
        notification_id,
        application_id,
        recipient,
        seen,
        changes,
        country, // Include country in the destructuring
      } = JSON.parse(lastMessage.data);

      // Log the entire message for debugging purposes
      console.log('Received notification:', {
        message,
        notification_id,
        application_id,
        recipient,
        seen,
        changes,
        country, // Log country for debugging
      });

      // Check if the notification's country matches any of the user's teams
      if (country) {
        const matchesUserTeam = userTeams.some((team) =>
          team.startsWith(country.toLowerCase())
        );

        if (!matchesUserTeam) {
          console.log(
            `Notification ignored. Country '${country}' does not match user's teams:`,
            userTeams
          );
          return; // Ignore this notification if it doesn't match
        } else {
          console.log(
            `Notification accepted. Country '${country}' does  match user's teams:`,
            userTeams
          );
        }
      }

      // Update the notifications state
      setNotifications((prevNotifications) => [
        {
          message,
          notification_id,
          application_id,
          recipient,
          seen,
          changes,
          country, // Include country in the notification object
        },
        ...prevNotifications,
      ]);

      // Play notification sound only if user has interacted
      if (isUserInteracted) {
        const audio = new Audio('/sounds/notificationSound.mp3');
        audio
          .play()
          .catch((error) => console.log('Error playing sound:', error));
      }

      // Trigger the shaking animation for 5 seconds
      controls.start({
        x: [0, -10, 10, -10, 10, 0], // Shake animation keyframes
        transition: { duration: 0.5, repeat: 10 }, // Total duration is 5 seconds
      });
    }
  }, [lastMessage, setNotifications, controls, isUserInteracted, userTeams]); // Include `controls` and `userTeams` in the dependencies array

  // Effect to update the icon based on the WebSocket connection state
  useEffect(() => {
    let icon;
    switch (readyState) {
      case ReadyState.CONNECTING:
        icon = (
          <RiLoader4Fill className='icon-rotating' color='orange' size={20} />
        ); // Icon for 'connecting' state with rotation
        console.log('WebSocket is connecting...');
        break;
      case ReadyState.OPEN:
        icon = <MdWifi color='green' size={20} />; // Icon for 'open' state
        console.log('WebSocket is open');
        break;
      case ReadyState.CLOSING:
        icon = <MdError color='yellow' size={20} />; // Icon for 'closing' state
        console.log('WebSocket is closing...');
        break;
      case ReadyState.CLOSED:
        icon = <MdWifiOff color='red' size={20} />; // Icon for 'closed' state
        console.log('WebSocket is closed');
        break;
      default:
        icon = <MdError color='gray' size={20} />; // Icon for 'unknown' state
        console.log('WebSocket is in an unknown state');
        break;
    }
    setConnectionStateIcon(icon);
  }, [readyState]); // Re-run this effect when `readyState` changes

  // Function to handle user interaction
  const handleUserInteraction = () => {
    setIsUserInteracted(true);
  };

  const handleButtonClick = () => {
    handleUserInteraction(); // Record user interaction
    setShowNotifications(!showNotifications);
  };

  return (
    <>
      {notifications && (
        <div
          className='border border-bottom-0 rounded p-2'
          style={{ position: 'relative', display: 'inline-block' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={handleButtonClick}
              className={`btn btn-sm ${
                notifications.length === 0
                  ? 'btn-outline-secondary'
                  : 'btn-outline-danger'
              }`}
              style={{ position: 'relative' }}
            >
              <motion.div animate={controls}>
                <MdNotifications size={20} />
              </motion.div>
              {notifications.length > 0 && (
                <>
                  <FiAlertCircle
                    size={15}
                    style={{
                      position: 'absolute',
                      top: '20px',
                      right: '5px',
                      color: 'red',
                    }}
                  />
                </>
              )}
              <div
                style={{
                  position: 'absolute',
                  marginTop: '-12px',
                  marginLeft: '-15px',
                }}
              >
                {connectionStateIcon}
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationComponent;
