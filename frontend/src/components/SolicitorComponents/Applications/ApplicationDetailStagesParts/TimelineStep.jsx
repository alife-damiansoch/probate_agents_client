// TimelineStep.jsx - Condensed Futuristic Timeline
import { useState } from 'react';

const TimelineStep = ({
  step,
  index,
  userSteps,
  application,
  showModal,
  showCCRUploadModal,
  onRunPepCheck, // NEW: PEP check handler (opens modal)
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleStepClick = () => {
    if (!step.isClickable) return;

    if (step.id === 'processing') {
      showModal(true);
    } else if (step.id === 'ccr') {
      showCCRUploadModal(true);
    } else if (step.id === 'pep-check') {
      // NEW: Handle PEP check click
      onRunPepCheck();
    }
  };

  const getStepTheme = () => {
    if (step.completed) {
      return {
        bg: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        accent: '#10b981',
        glow: '0 0 20px rgba(16, 185, 129, 0.3)',
      };
    }
    if (step.actionRequired) {
      return {
        bg: 'linear-gradient(135deg, #451a03 0%, #78350f 100%)',
        accent: '#f59e0b',
        glow: '0 0 20px rgba(245, 158, 11, 0.4)',
      };
    }
    if (step.isClickable) {
      return {
        bg: 'linear-gradient(135deg, #0c1427 0%, #1e293b 100%)',
        accent: '#3b82f6',
        glow: '0 0 20px rgba(59, 130, 246, 0.3)',
      };
    }
    return {
      bg: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
      accent: '#6b7280',
      glow: 'none',
    };
  };

  const theme = getStepTheme();
  const isLastStep = index === userSteps.length - 1;

  return (
    <div
      className='position-relative d-flex'
      style={{ minHeight: '70px', marginBottom: '8px' }}
    >
      <style>
        {`
          @keyframes neonPulse {
            0%, 100% { 
              box-shadow: 0 0 10px ${theme.accent}40, 0 0 20px ${theme.accent}20;
            }
            50% { 
              box-shadow: 0 0 20px ${theme.accent}60, 0 0 30px ${theme.accent}30;
            }
          }
          
          @keyframes dataFlow {
            0% { transform: translateY(-5px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(25px); opacity: 0; }
          }
        `}
      </style>

      {/* Timeline Connector Column */}
      <div
        className='d-flex flex-column align-items-center'
        style={{ width: '50px', zIndex: 1 }}
      >
        {/* Timeline Node */}
        <div className='position-relative'>
          {/* Main Node */}
          <div
            className='d-flex align-items-center justify-content-center'
            style={{
              width: '40px',
              height: '40px',
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}80)`,
              borderRadius: '50%',
              border: `2px solid ${theme.accent}`,
              fontSize: '1rem',
              color: 'white',
              transition: 'all 0.3s ease',
              transform:
                isHovered && step.isClickable ? 'scale(1.1)' : 'scale(1)',
              cursor: step.isClickable ? 'pointer' : 'default',
              animation: step.actionRequired ? 'neonPulse 2s infinite' : 'none',
              boxShadow: `0 0 15px ${theme.accent}40`,
            }}
            onClick={step.isClickable ? handleStepClick : undefined}
          >
            {step.completed ? (
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                <path
                  d='M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            ) : (
              <span>{step.icon}</span>
            )}
          </div>

          {/* Step Number */}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              width: '18px',
              height: '18px',
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}80)`,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.6rem',
              fontWeight: '700',
              border: '2px solid #0f172a',
            }}
          >
            {index + 1}
          </div>
        </div>

        {/* Vertical Connector */}
        {!isLastStep && (
          <div
            className='position-relative'
            style={{ width: '2px', height: '35px', marginTop: '4px' }}
          >
            {/* Background Line */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'rgba(75, 85, 99, 0.3)',
                borderRadius: '1px',
              }}
            />

            {/* Active Line */}
            <div
              style={{
                position: 'absolute',
                width: '100%',
                height: step.completed ? '100%' : '0%',
                background: `linear-gradient(180deg, ${theme.accent}, ${theme.accent}80)`,
                borderRadius: '1px',
                transition: 'height 0.6s ease',
                boxShadow: `0 0 8px ${theme.accent}40`,
              }}
            />

            {/* Data Flow Particle */}
            {step.completed && (
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '4px',
                  height: '4px',
                  background: theme.accent,
                  borderRadius: '50%',
                  boxShadow: `0 0 6px ${theme.accent}`,
                  animation: 'dataFlow 2s infinite',
                }}
              />
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div
        className='flex-grow-1 ms-2'
        style={{ cursor: step.isClickable ? 'pointer' : 'default' }}
        onClick={step.isClickable ? handleStepClick : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Content Card */}
        <div
          style={{
            background: theme.bg,
            border: `1px solid ${theme.accent}40`,
            borderRadius: '12px',
            padding: '12px 16px',
            transition: 'all 0.3s ease',
            transform:
              isHovered && step.isClickable
                ? 'translateY(-2px)'
                : 'translateY(0)',
            boxShadow:
              isHovered && step.isClickable
                ? `${theme.glow}, 0 8px 25px -8px rgba(0, 0, 0, 0.3)`
                : step.actionRequired
                ? `${theme.glow}, 0 4px 15px -8px rgba(0, 0, 0, 0.2)`
                : '0 4px 15px -8px rgba(0, 0, 0, 0.2)',
            opacity: step.isBlurred ? 0.4 : 1,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div className='d-flex align-items-center justify-content-between mb-1'>
            <h6
              style={{
                color: 'white',
                fontSize: '0.95rem',
                fontWeight: '600',
                margin: 0,
                textShadow: `0 0 8px ${theme.accent}40`,
              }}
            >
              {step.title}
            </h6>

            {/* Status Badges */}
            <div className='d-flex align-items-center gap-1'>
              {step.actionRequired && (
                <div
                  style={{
                    background: `${theme.accent}20`,
                    border: `1px solid ${theme.accent}50`,
                    borderRadius: '8px',
                    padding: '2px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <div
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      background: theme.accent,
                      boxShadow: `0 0 6px ${theme.accent}`,
                    }}
                  />
                  <span
                    style={{
                      color: theme.accent,
                      fontSize: '0.6rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                    }}
                  >
                    Action
                  </span>
                </div>
              )}

              {step.isClickable && (
                <div
                  style={{
                    background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}80)`,
                    borderRadius: '8px',
                    padding: '3px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span
                    style={{
                      color: 'white',
                      fontSize: '0.6rem',
                      fontWeight: '700',
                    }}
                  >
                    CLICK
                  </span>
                  <svg width='8' height='8' fill='white' viewBox='0 0 24 24'>
                    <path d='M13.172 12L8.222 7.05L9.636 5.636L16 12L9.636 18.364L8.222 16.95L13.172 12Z' />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div
            style={{
              color: '#e2e8f0',
              fontSize: '0.8rem',
              lineHeight: '1.4',
              marginBottom: step.showConfirmButton ? '8px' : '0',
            }}
          >
            {step.description}
          </div>

          {/* Confirm Button */}
          {step.showConfirmButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStepClick();
              }}
              style={{
                background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}80)`,
                border: 'none',
                color: 'white',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '0.7rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
              }}
            >
              ⚡ Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineStep;
