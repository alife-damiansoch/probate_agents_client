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
      className='border'
      style={{
        position: 'absolute',
        width: '100%',
        zIndex: 100,
        marginTop: '8px',
        borderRadius: '20px',
        border: '2px solid #8b5cf6',
        background: 'linear-gradient(135deg, #ffffff 0%, #faf5ff 100%)',
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
        animation: 'slideInDown 0.3s ease-out',
      }}
    >
      {/* Header */}
      <div
        className='d-flex align-items-center justify-content-between'
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          padding: '16px 20px',
          color: '#ffffff',
        }}
      >
        <div className='d-flex align-items-center gap-2'>
          <div
            className='d-flex align-items-center justify-content-center rounded-2'
            style={{
              width: '24px',
              height: '24px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          >
            <svg width='14' height='14' fill='currentColor' viewBox='0 0 20 20'>
              <path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z' />
            </svg>
          </div>
          <h6 className='mb-0 fw-bold' style={{ fontSize: '1rem' }}>
            Notifications
          </h6>
        </div>

        <div className='d-flex align-items-center gap-3'>
          <span
            className='px-2 py-1 rounded-pill fw-medium'
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              fontSize: '0.75rem',
            }}
          >
            {notifications.length}
          </span>
          <button
            className='btn p-0 d-flex align-items-center justify-content-center'
            style={{
              width: '24px',
              height: '24px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '6px',
              color: '#ffffff',
            }}
            onClick={() => setShowNotifications(false)}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <svg width='12' height='12' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          padding: '20px',
          maxHeight: '400px',
          overflowY: 'auto',
          background: 'rgba(255, 255, 255, 0.8)',
        }}
      >
        <NotificationsDisplayComponent
          notifications={notifications}
          setNotifications={setNotifications}
          setShowNotifications={setShowNotifications}
        />
      </div>

      <style>{`
        @keyframes slideInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationsWrapper;
