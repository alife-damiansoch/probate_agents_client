import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { postData } from '../../../GenericFunctions/AxiosGenericFunctions.jsx';

const SolicitorNotificationButton = ({
  applicationId,
  onSuccess,
  onError,
  disabled = false,
  documentsCount = 0,
  onShowModal,
  triggerSend = false,
  onSendComplete,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [buttonState, setButtonState] = useState('normal'); // 'normal', 'success', 'error'
  const [statusMessage, setStatusMessage] = useState('');

  // Reset button state after showing success/error
  useEffect(() => {
    if (buttonState !== 'normal') {
      const timer = setTimeout(() => {
        setButtonState('normal');
        setStatusMessage('');
      }, 4000); // Show for 4 seconds
      return () => clearTimeout(timer);
    }
  }, [buttonState]);

  const handleButtonClick = () => {
    if (!disabled && !isLoading && buttonState === 'normal') {
      onShowModal();
    }
  };

  // Function to actually send the notification
  const sendNotification = async () => {
    setIsLoading(true);
    setButtonState('normal');

    try {
      let tokenObj = Cookies.get('auth_token_agents');
      let token = null;
      if (tokenObj) {
        tokenObj = JSON.parse(tokenObj);
        token = tokenObj.access;
      }

      const endpoint = `/api/applications/agent_applications/${applicationId}/notify-solicitor-documents/`;
      const response = await postData(token, endpoint, {});

      if (response.status === 200) {
        setButtonState('success');
        setStatusMessage(`Email sent to ${response.data.solicitor_email}`);
        onSuccess(response.data);
      } else {
        setButtonState('error');
        setStatusMessage(response.data?.error || 'Failed to send notification');
        onError(response.data?.error || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending solicitor notification:', error);
      const errorMsg = error.response?.data?.error || 'Network error occurred';
      setButtonState('error');
      setStatusMessage(errorMsg);
      onError(errorMsg);
    } finally {
      setIsLoading(false);
      if (onSendComplete) {
        onSendComplete();
      }
    }
  };

  // Trigger send when triggerSend prop changes to true
  useEffect(() => {
    if (triggerSend && !isLoading) {
      sendNotification();
    }
  }, [triggerSend]);

  // Get button styling based on state
  const getButtonStyle = () => {
    if (disabled) {
      return {
        background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
        boxShadow: 'none',
        transform: 'none',
      };
    }

    if (isLoading) {
      return {
        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
        boxShadow: '0 8px 32px rgba(245, 158, 11, 0.4)',
        transform: 'translateY(0) scale(1)',
      };
    }

    if (buttonState === 'success') {
      return {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        boxShadow: '0 12px 40px rgba(16, 185, 129, 0.6)',
        transform: 'translateY(-2px) scale(1.02)',
      };
    }

    if (buttonState === 'error') {
      return {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        boxShadow: '0 12px 40px rgba(239, 68, 68, 0.6)',
        transform: 'translateY(-2px) scale(1.02)',
      };
    }

    // Normal state
    return {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      boxShadow: isHovered
        ? '0 15px 45px rgba(16, 185, 129, 0.6)'
        : '0 8px 32px rgba(16, 185, 129, 0.4)',
      transform: isHovered
        ? 'translateY(-3px) scale(1.03)'
        : 'translateY(0) scale(1)',
    };
  };

  // Get button text based on state
  const getButtonText = () => {
    if (isLoading) return 'Sending Notification...';
    if (buttonState === 'success') return 'Email Sent Successfully!';
    if (buttonState === 'error') return 'Failed to Send Email';
    return 'Notify Solicitor';
  };

  // Get icon based on state
  const getIcon = () => {
    if (isLoading) {
      return (
        <div className='position-relative'>
          <svg
            width='22'
            height='22'
            fill='currentColor'
            viewBox='0 0 20 20'
            style={{
              animation: 'spin 1.5s linear infinite',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          >
            <path
              fillRule='evenodd'
              d='M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm0 2h12v12H4V4z'
              clipRule='evenodd'
            />
            <path d='M10 6a4 4 0 100 8 4 4 0 000-8zM8 10a2 2 0 114 0 2 2 0 01-4 0z' />
          </svg>
          <div
            className='position-absolute top-0 start-0 w-100 h-100 rounded-circle'
            style={{
              border: '2px solid transparent',
              borderTop: '2px solid rgba(255,255,255,0.6)',
              animation: 'spin 1s linear infinite reverse',
            }}
          />
        </div>
      );
    }

    if (buttonState === 'success') {
      return (
        <svg
          width='22'
          height='22'
          fill='currentColor'
          viewBox='0 0 20 20'
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          }}
        >
          <path
            fillRule='evenodd'
            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
            clipRule='evenodd'
          />
        </svg>
      );
    }

    if (buttonState === 'error') {
      return (
        <svg
          width='22'
          height='22'
          fill='currentColor'
          viewBox='0 0 20 20'
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          }}
        >
          <path
            fillRule='evenodd'
            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
            clipRule='evenodd'
          />
        </svg>
      );
    }

    // Normal state
    return (
      <div className='position-relative'>
        <svg
          width='22'
          height='22'
          fill='currentColor'
          viewBox='0 0 20 20'
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.3s ease',
          }}
        >
          <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
          <path d='m18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
        </svg>

        {/* Pulse ring on hover for normal state */}
        {isHovered && buttonState === 'normal' && (
          <div
            className='position-absolute top-50 start-50 translate-middle'
            style={{
              width: '140%',
              height: '140%',
              border: '2px solid rgba(255,255,255,0.4)',
              borderRadius: '50%',
              animation: 'pulseRing 1.5s ease-out infinite',
            }}
          />
        )}
      </div>
    );
  };

  const buttonStyle = getButtonStyle();

  return (
    <div className='position-relative'>
      <button
        onClick={handleButtonClick}
        disabled={disabled || isLoading}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`btn position-relative overflow-hidden d-flex align-items-center justify-content-center gap-3 px-5 py-3 rounded-4 fw-bold text-white border-0 ${
          disabled ? 'opacity-50' : ''
        }`}
        style={{
          ...buttonStyle,
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          fontSize:
            buttonState === 'success' || buttonState === 'error'
              ? '0.9rem'
              : '1rem',
          letterSpacing: '0.5px',
          minHeight: '56px',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Animated background layers */}
        <div
          className='position-absolute top-0 start-0 w-100 h-100'
          style={{
            background:
              isHovered && !disabled && !isLoading && buttonState === 'normal'
                ? 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)'
                : 'transparent',
            transition: 'all 0.4s ease',
            pointerEvents: 'none',
          }}
        />

        {/* Shimmer effect for loading */}
        {isLoading && (
          <div
            className='position-absolute top-0 start-0 w-100 h-100'
            style={{
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              animation: 'shimmer 2s infinite',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Success celebration particles */}
        {buttonState === 'success' && (
          <>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className='position-absolute rounded-circle'
                style={{
                  width: '4px',
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.9)',
                  left: `${15 + i * 10}%`,
                  top: `${20 + (i % 3) * 30}%`,
                  animation: `celebrationParticle ${1 + i * 0.1}s ease-out`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </>
        )}

        {/* Floating particles effect when hovered (normal state only) */}
        {isHovered && !disabled && !isLoading && buttonState === 'normal' && (
          <>
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className='position-absolute rounded-circle'
                style={{
                  width: '3px',
                  height: '3px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  left: `${20 + i * 12}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  animation: `floatParticle ${
                    1.5 + i * 0.2
                  }s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </>
        )}

        {/* Icon with enhanced animations */}
        <div
          className='d-flex align-items-center justify-content-center position-relative'
          style={{
            transform: isLoading ? 'rotate(360deg)' : 'rotate(0deg)',
            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {getIcon()}
        </div>

        {/* Text with enhanced styling */}
        <span
          className='fw-bold'
          style={{
            transform: isLoading ? 'translateX(-2px)' : 'translateX(0)',
            transition: 'transform 0.3s ease',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            letterSpacing: '0.5px',
          }}
        >
          {getButtonText()}
        </span>

        {/* Success/Error ripple effect */}
        {(buttonState === 'success' || buttonState === 'error') && (
          <div
            className='position-absolute top-50 start-50 translate-middle rounded-4'
            style={{
              width: '120%',
              height: '120%',
              background:
                buttonState === 'success'
                  ? 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)'
                  : 'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
              animation: 'statusRipple 2s ease-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Normal hover ripple effect */}
        {!disabled && !isLoading && isHovered && buttonState === 'normal' && (
          <div
            className='position-absolute top-50 start-50 translate-middle rounded-4'
            style={{
              width: '120%',
              height: '120%',
              background:
                'radial-gradient(circle at center, rgba(255,255,255,0.15) 0%, transparent 70%)',
              animation: 'ripple 2s ease-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}
      </button>

      {/* Status message tooltip */}
      {statusMessage &&
        (buttonState === 'success' || buttonState === 'error') && (
          <div
            className='position-absolute w-100 mt-2 px-3 py-2 rounded-3 text-center'
            style={{
              top: '100%',
              left: '0',
              background:
                buttonState === 'success'
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
              animation: 'slideDown 0.3s ease-out',
              zIndex: 10,
            }}
          >
            {statusMessage}
            {/* Arrow pointing up */}
            <div
              className='position-absolute'
              style={{
                top: '-6px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '0',
                height: '0',
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderBottom: `6px solid ${
                  buttonState === 'success' ? '#10b981' : '#ef4444'
                }`,
              }}
            />
          </div>
        )}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes floatParticle {
          0%,
          100% {
            transform: translateY(0px) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-15px) scale(1.2);
            opacity: 1;
          }
        }

        @keyframes celebrationParticle {
          0% {
            transform: translateY(0px) scale(0);
            opacity: 1;
          }
          50% {
            transform: translateY(-20px) scale(1.5);
            opacity: 1;
          }
          100% {
            transform: translateY(-40px) scale(0);
            opacity: 0;
          }
        }

        @keyframes pulseRing {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.8);
            opacity: 0;
          }
        }

        @keyframes ripple {
          0% {
            transform: translate(-50%, -50%) scale(0.8);
            opacity: 0.6;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0;
          }
        }

        @keyframes statusRipple {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.4;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0;
          }
        }

        @keyframes slideDown {
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

export default SolicitorNotificationButton;
