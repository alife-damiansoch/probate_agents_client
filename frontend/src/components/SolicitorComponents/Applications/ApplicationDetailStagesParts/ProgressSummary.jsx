// src/components/ApplicationDetailStages/ApplicationDetailStagesParts/ProgressSummary.js
import { useEffect, useState } from 'react';

const ProgressSummary = ({ userSteps }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const completedSteps = userSteps.filter((s) => s.completed).length;
  const totalSteps = userSteps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;
  const isComplete = completedSteps === totalSteps;

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  const getProgressColor = () => {
    if (isComplete) return '#10b981'; // Green
    if (progressPercentage >= 75) return '#3b82f6'; // Blue
    if (progressPercentage >= 50) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  const getProgressGlow = () => {
    const color = getProgressColor();
    return `0 0 20px ${color}40, 0 0 40px ${color}20`;
  };

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '16px',
        padding: '20px',
        margin: '16px 0',
        backdropFilter: 'blur(20px)',
        boxShadow:
          '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        transform: isVisible
          ? 'translateY(0) scale(1)'
          : 'translateY(10px) scale(0.95)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>
        {`
          @keyframes holographicScan {
            0% { transform: translateX(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(300%); opacity: 0; }
          }
          
          @keyframes dataStream {
            0% { transform: translateX(-20px); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(20px); opacity: 0; }
          }
          
          @keyframes completionPulse {
            0%, 100% { transform: scale(1); filter: brightness(1); }
            50% { transform: scale(1.02); filter: brightness(1.1); }
          }
        `}
      </style>

      {/* Holographic scan line effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '2px',
          background: `linear-gradient(90deg, transparent, ${getProgressColor()}, transparent)`,
          animation: 'holographicScan 3s infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Background circuit pattern */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          opacity: 0.1,
          pointerEvents: 'none',
        }}
        width='120'
        height='80'
        viewBox='0 0 120 80'
      >
        <path
          d='M20,20 L100,20 L100,40 L60,40 L60,60 L100,60'
          stroke={getProgressColor()}
          strokeWidth='1'
          fill='none'
          strokeDasharray='4,4'
        />
        <circle cx='20' cy='20' r='2' fill={getProgressColor()} opacity='0.6' />
        <circle
          cx='100'
          cy='20'
          r='2'
          fill={getProgressColor()}
          opacity='0.6'
        />
        <circle cx='60' cy='40' r='2' fill={getProgressColor()} opacity='0.6' />
        <circle
          cx='100'
          cy='60'
          r='2'
          fill={getProgressColor()}
          opacity='0.6'
        />
      </svg>

      <div className='d-flex align-items-center justify-content-between'>
        {/* Progress Section */}
        <div className='d-flex align-items-center gap-4 flex-grow-1'>
          {/* Circular Progress Indicator */}
          <div className='position-relative'>
            <svg width='56' height='56' viewBox='0 0 56 56'>
              <defs>
                <linearGradient
                  id='progressGradient'
                  x1='0%'
                  y1='0%'
                  x2='100%'
                  y2='100%'
                >
                  <stop
                    offset='0%'
                    stopColor={getProgressColor()}
                    stopOpacity='1'
                  />
                  <stop
                    offset='100%'
                    stopColor={getProgressColor()}
                    stopOpacity='0.6'
                  />
                </linearGradient>
              </defs>

              {/* Background circle */}
              <circle
                cx='28'
                cy='28'
                r='24'
                fill='none'
                stroke='rgba(255, 255, 255, 0.1)'
                strokeWidth='4'
              />

              {/* Progress circle */}
              <circle
                cx='28'
                cy='28'
                r='24'
                fill='none'
                stroke='url(#progressGradient)'
                strokeWidth='4'
                strokeLinecap='round'
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${
                  2 * Math.PI * 24 * (1 - animatedProgress / 100)
                }`}
                transform='rotate(-90 28 28)'
                style={{
                  transition:
                    'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: `drop-shadow(${getProgressGlow()})`,
                }}
              />
            </svg>

            {/* Center text */}
            <div
              className='position-absolute d-flex align-items-center justify-content-center'
              style={{
                top: 0,
                left: 0,
                width: '56px',
                height: '56px',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: '700',
                textAlign: 'center',
                textShadow: `0 0 8px ${getProgressColor()}`,
              }}
            >
              {Math.round(animatedProgress)}%
            </div>
          </div>

          {/* Modern Progress Bar */}
          <div className='flex-grow-1'>
            <div className='d-flex align-items-center justify-content-between mb-2'>
              <div>
                <h6
                  className='mb-1'
                  style={{
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: '600',
                    textShadow: `0 0 8px ${getProgressColor()}40`,
                  }}
                >
                  Timeline Progress
                </h6>
                <div
                  style={{
                    color: '#e2e8f0',
                    fontSize: '0.8rem',
                    opacity: 0.8,
                  }}
                >
                  {completedSteps} of {totalSteps} steps complete
                </div>
              </div>

              {/* Status indicator */}
              <div
                className='d-flex align-items-center gap-2'
                style={{
                  background: `linear-gradient(135deg, ${getProgressColor()}20, ${getProgressColor()}10)`,
                  border: `1px solid ${getProgressColor()}40`,
                  borderRadius: '12px',
                  padding: '6px 12px',
                  animation: isComplete
                    ? 'completionPulse 2s infinite'
                    : 'none',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: getProgressColor(),
                    boxShadow: `0 0 8px ${getProgressColor()}`,
                    animation: !isComplete ? 'dataStream 2s infinite' : 'none',
                  }}
                />
                <span
                  style={{
                    color: getProgressColor(),
                    fontSize: '0.7rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  {isComplete ? 'Complete' : 'In Progress'}
                </span>
              </div>
            </div>

            {/* Advanced Progress Bar */}
            <div
              style={{
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              {/* Progress fill */}
              <div
                style={{
                  height: '100%',
                  width: `${animatedProgress}%`,
                  background: `linear-gradient(90deg, ${getProgressColor()}, ${getProgressColor()}80)`,
                  borderRadius: '8px',
                  transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: `0 0 16px ${getProgressColor()}60, inset 0 1px 0 rgba(255, 255, 255, 0.3)`,
                  position: 'relative',
                }}
              >
                {/* Animated shine effect */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                    animation:
                      animatedProgress > 0
                        ? 'holographicScan 2s infinite'
                        : 'none',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Completion celebration */}
        {isComplete && (
          <div
            className='d-flex align-items-center gap-2 ms-3'
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              borderRadius: '12px',
              padding: '8px 12px',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
              animation: 'completionPulse 2s infinite',
            }}
          >
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
              <path
                d='M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z'
                stroke='white'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
            <span
              style={{
                color: 'white',
                fontSize: '0.8rem',
                fontWeight: '700',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
              }}
            >
              All Complete!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressSummary;
