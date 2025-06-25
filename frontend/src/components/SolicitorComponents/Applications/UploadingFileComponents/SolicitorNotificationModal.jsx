import { useEffect, useState } from 'react';

const SolicitorNotificationModal = ({
  isOpen,
  onConfirm,
  onCancel,
  applicationId,
  documentsCount = 0,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Generate particles for background animation
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
      }));
      setParticles(newParticles);
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsAnimating(false);
    setTimeout(() => onConfirm(), 200);
  };

  const handleCancel = () => {
    setIsAnimating(false);
    setTimeout(() => onCancel(), 200);
  };

  return (
    <div
      className='position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(12px)',
        zIndex: 2000,
        animation: isAnimating
          ? 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          : 'fadeOut 0.3s ease-out',
      }}
    >
      {/* Animated particles background */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className='position-absolute rounded-circle'
          style={{
            width: '4px',
            height: '4px',
            background: 'linear-gradient(45deg, #10b981, #34d399)',
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite alternate`,
            opacity: 0.6,
          }}
        />
      ))}

      <div
        className='position-relative rounded-5 overflow-hidden'
        style={{
          width: '90%',
          maxWidth: '540px',
          background:
            'linear-gradient(135deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%)',
          boxShadow:
            '0 25px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          animation: isAnimating
            ? 'modalSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
            : 'modalSlideDown 0.3s ease-out',
          transform: isAnimating ? 'scale(1)' : 'scale(0.95)',
        }}
      >
        {/* Gradient header with floating elements */}
        <div
          className='position-relative px-5 py-5 text-white overflow-hidden'
          style={{
            background:
              'linear-gradient(135deg, #10b981 0%, #059669 30%, #047857 100%)',
          }}
        >
          {/* Floating geometric shapes */}
          <div
            className='position-absolute rounded-circle'
            style={{
              width: '120px',
              height: '120px',
              background: 'rgba(255, 255, 255, 0.1)',
              top: '-30px',
              right: '-30px',
              animation: 'slowSpin 20s linear infinite',
            }}
          />
          <div
            className='position-absolute'
            style={{
              width: '60px',
              height: '60px',
              background: 'rgba(255, 255, 255, 0.08)',
              top: '20px',
              left: '-15px',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              animation: 'slowBob 6s ease-in-out infinite',
            }}
          />

          <div className='position-relative d-flex align-items-center gap-4'>
            {/* Icon with pulse animation */}
            <div
              className='position-relative d-flex align-items-center justify-content-center rounded-4'
              style={{
                width: '64px',
                height: '64px',
                background:
                  'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}
            >
              <svg
                width='32'
                height='32'
                fill='currentColor'
                viewBox='0 0 20 20'
                style={{
                  animation: 'iconPulse 2s ease-in-out infinite',
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))',
                }}
              >
                <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                <path d='m18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
              </svg>

              {/* Pulse rings */}
              <div
                className='position-absolute w-100 h-100 rounded-4'
                style={{
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  animation: 'pulseRing 2s ease-out infinite',
                }}
              />
              <div
                className='position-absolute w-100 h-100 rounded-4'
                style={{
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  animation: 'pulseRing 2s ease-out 0.5s infinite',
                }}
              />
            </div>

            <div>
              <h3
                className='mb-2 fw-bold'
                style={{
                  fontSize: '1.8rem',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  letterSpacing: '-0.5px',
                }}
              >
                Send Email Notification
              </h3>
              <p
                className='mb-0 opacity-90'
                style={{
                  fontSize: '1.1rem',
                  fontWeight: '400',
                }}
              >
                Notify solicitor about new documents
              </p>
            </div>
          </div>
        </div>

        {/* Content section with enhanced styling */}
        <div className='px-5 py-5'>
          {/* Info cards with glassmorphism effect */}
          <div className='row g-4 mb-4'>
            <div className='col-6'>
              <div
                className='text-center p-4 rounded-4'
                style={{
                  background:
                    'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.12) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  className='d-inline-flex align-items-center justify-content-center rounded-3 mb-3'
                  style={{
                    width: '48px',
                    height: '48px',
                    background:
                      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <svg
                    width='20'
                    height='20'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <h5 className='fw-bold mb-1' style={{ color: '#047857' }}>
                  {documentsCount}
                </h5>
                <p
                  className='mb-0 small fw-medium'
                  style={{ color: '#065f46' }}
                >
                  Documents Available
                </p>
              </div>
            </div>

            <div className='col-6'>
              <div
                className='text-center p-4 rounded-4'
                style={{
                  background:
                    'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(29, 78, 216, 0.12) 100%)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div
                  className='d-inline-flex align-items-center justify-content-center rounded-3 mb-3'
                  style={{
                    width: '48px',
                    height: '48px',
                    background:
                      'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <svg
                    width='20'
                    height='20'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <h5 className='fw-bold mb-1' style={{ color: '#1d4ed8' }}>
                  #{applicationId}
                </h5>
                <p
                  className='mb-0 small fw-medium'
                  style={{ color: '#1e40af' }}
                >
                  Application ID
                </p>
              </div>
            </div>
          </div>

          {/* Description with enhanced typography */}
          <div
            className='p-4 rounded-4 mb-5'
            style={{
              background:
                'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(79, 70, 229, 0.08) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.15)',
            }}
          >
            <div className='d-flex align-items-start gap-3'>
              <div
                className='d-flex align-items-center justify-content-center rounded-2 flex-shrink-0'
                style={{
                  width: '32px',
                  height: '32px',
                  background:
                    'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: 'white',
                }}
              >
                <svg
                  width='16'
                  height='16'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div>
                <h6 className='fw-bold mb-2' style={{ color: '#4f46e5' }}>
                  What happens next?
                </h6>
                <ul
                  className='mb-0 ps-3'
                  style={{ color: '#6b7280', lineHeight: '1.6' }}
                >
                  <li className='mb-1'>
                    A professional email will be sent to the solicitor
                  </li>
                  <li className='mb-1'>
                    The email includes application details and document summary
                  </li>
                  <li className='mb-0'>
                    The solicitor will be able to review all uploaded documents
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action buttons with enhanced styling */}
          <div className='d-flex gap-3'>
            <button
              onClick={handleCancel}
              className='btn flex-fill py-3 rounded-4 fw-semibold border-0'
              style={{
                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                color: '#374151',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '1.05rem',
                letterSpacing: '0.3px',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
                e.target.style.background =
                  'linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
                e.target.style.background =
                  'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
              }}
            >
              Cancel
            </button>

            <button
              onClick={handleConfirm}
              className='btn flex-fill py-3 rounded-4 fw-bold text-white border-0 position-relative overflow-hidden'
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                fontSize: '1.05rem',
                letterSpacing: '0.5px',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px) scale(1.02)';
                e.target.style.boxShadow =
                  '0 15px 35px rgba(16, 185, 129, 0.5)';
                e.target.style.background =
                  'linear-gradient(135deg, #059669 0%, #047857 100%)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
                e.target.style.background =
                  'linear-gradient(135deg, #10b981 0%, #059669 100%)';
              }}
            >
              {/* Button shine effect */}
              <div
                className='position-absolute top-0 start-0 w-100 h-100'
                style={{
                  background:
                    'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                  animation: 'buttonShine 3s ease-in-out infinite',
                  pointerEvents: 'none',
                }}
              />

              <span className='d-flex align-items-center justify-content-center gap-2'>
                <svg
                  width='18'
                  height='18'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                  <path d='m18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                </svg>
                Send Email Notification
              </span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(60px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes modalSlideDown {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        @keyframes slowSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes slowBob {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes iconPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        @keyframes pulseRing {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        @keyframes buttonShine {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default SolicitorNotificationModal;
