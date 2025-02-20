import { useEffect, useRef } from 'react';
import NotificationsDisplayComponent from './NotifidationsDisplayComponent';

const NotificationsWrapper = ({
  notifications,
  setNotifications,
  setShowNotifications,
}) => {
  const wrapperRef = useRef(null);

  // Click outside handler
  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setShowNotifications(false);
    }
  };

  // Add event listener on mount, remove on unmount
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return (
    <div
      ref={wrapperRef}
      className='border mt-2 p-2 bg-warning rounded shadow-sm'
      style={{
        position: 'absolute',
        width: '100%',
        zIndex: 100,
      }}
    >
      <NotificationsDisplayComponent
        notifications={notifications}
        setNotifications={setNotifications}
        setShowNotifications={setShowNotifications}
      />
    </div>
  );
};

export default NotificationsWrapper;
