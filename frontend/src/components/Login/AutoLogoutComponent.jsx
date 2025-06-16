import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import { clearUser } from '../../store/userSlice';
import { postData } from '../GenericFunctions/AxiosGenericFunctions';
import useApiKeyExpiration from '../GenericFunctions/CustomHooks/useApiKeyExpiration';
import TimeoutWarning from './TimeoutWarningComponent';

const AutoLogoutComponent = () => {
  const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before expiration
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const expirationTime = useApiKeyExpiration();
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);

  // Function to log out the user
  const logoutUser = async () => {
    setShowWarning(false);
    dispatch(logout());
    dispatch(clearUser());
    navigate('/');
  };

  // Function to reset warning state
  const stayLoggedIn = async () => {
    const endpoint = '/api/user/refresh-api-key/';
    const res = await postData('token', endpoint, {});
    if (res.status === 200) {
      setShowWarning(false);
    }
  };

  useEffect(() => {
    if (!expirationTime) return;

    const expiresAt = expirationTime.getTime();
    const now = Date.now();
    const timeRemaining = expiresAt - now;

    setRemainingTime(timeRemaining);

    if (timeRemaining <= 0) {
      logoutUser();
    } else if (timeRemaining <= WARNING_TIME) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const timeRemaining = expiresAt - now;
      setRemainingTime(timeRemaining);

      if (timeRemaining <= 0) {
        logoutUser();
      } else if (timeRemaining <= WARNING_TIME) {
        setShowWarning(true);
      } else {
        setShowWarning(false);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationTime]);

  return (
    <div>
      {/* <div className='timer-display'>
        <p>
          Session Time Remaining: {Math.floor(remainingTime / 1000)} seconds
        </p>
      </div> */}
      {showWarning && (
        <TimeoutWarning
          remainingTime={Math.floor(remainingTime / 1000)}
          stayLoggedIn={stayLoggedIn}
        />
      )}
    </div>
  );
};

export default AutoLogoutComponent;
