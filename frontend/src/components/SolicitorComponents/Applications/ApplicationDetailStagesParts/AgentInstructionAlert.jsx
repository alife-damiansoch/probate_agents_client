const AgentInstructionAlert = ({ incompleteSteps }) => {
  if (incompleteSteps.length === 0) return null;

  // Determine instruction type and content based on step analysis
  const getInstructionData = () => {
    const stepTitles = incompleteSteps.map((step) => step.title);
    const stepIds = incompleteSteps.map((step) => step.id);
    const hasUserAction = incompleteSteps.some((step) => step.userAction);
    const hasAgentAction = incompleteSteps.some((step) => !step.userAction);

    console.log('STEPsIds', stepIds);

    // Priority-based instruction logic
    if (stepIds.includes('submitted')) {
      return {
        type: 'user',
        icon: '📝',
        title: 'Instruct User:',
        message: 'Complete application submission with missing information',
        urgency: 'high',
        action: 'Application form completion required',
      };
    }

    if (stepIds.includes('solicitor')) {
      return {
        type: 'user',
        icon: '👨‍💼',
        title: 'Instruct User:',
        message: 'Assign qualified solicitor to this application',
        urgency: 'high',
        action: 'Solicitor assignment pending',
      };
    }

    if (stepIds.includes('estate')) {
      return {
        type: 'user',
        icon: '🏠',
        title: 'Instruct User:',
        message: 'Submit estate details',
        urgency: 'medium',
        action: 'Estate information collection required',
      };
    }

    if (stepIds.includes('processing')) {
      return {
        type: 'agent',
        icon: '🤝',
        title: 'Agent Action:',
        message: 'Confirm application details with solicitor',
        urgency: 'medium',
        action: 'Processing confirmation required',
      };
    }

    if (stepIds.includes('ccr')) {
      return {
        type: 'agent',
        icon: '📁',
        title: 'Agent Action:',
        message: 'Generate and upload CCR file for review',
        urgency: 'medium',
        action: 'CCR file creation pending',
      };
    }

    if (stepIds.includes('documents')) {
      return {
        type: 'mixed',
        icon: '📄',
        title: 'Document Stage:',
        message:
          'Agent: Add requirements & create docs | Solicitor: Upload & sign documents',
        urgency: 'high',
        action: 'Both parties action required',
      };
    }

    if (stepIds.includes('beneficiary-emails')) {
      return {
        type: 'agent',
        icon: '📤',
        title: 'Agent Action:',
        message: 'Send required documents to beneficiary via email',
        urgency: 'high',
        action: 'Document delivery pending',
      };
    }

    if (stepIds.includes('advancement-agreement')) {
      return {
        type: 'mixed',
        icon: '📋',
        title: 'Agent Action:',
        message: 'Create advancement agreement and obtain signatures',
        urgency: 'critical',
        action: 'Agreement execution required',
      };
    }

    // Mixed scenarios
    if (hasUserAction && hasAgentAction) {
      return {
        type: 'mixed',
        icon: '🤝',
        title: 'Coordinate:',
        message: `Multiple actions needed: ${stepTitles.join(', ')}`,
        urgency: 'high',
        action: 'User and agent coordination required',
      };
    }

    // User-focused steps
    if (hasUserAction) {
      return {
        type: 'user',
        icon: '📞',
        title: 'Instruct User:',
        message: `Complete: ${stepTitles.join(', ')}`,
        urgency: 'medium',
        action: 'User action required',
      };
    }

    // Agent-focused steps
    return {
      type: 'agent',
      icon: '⚡',
      title: 'Agent Action:',
      message: `Process: ${stepTitles.join(', ')}`,
      urgency: 'medium',
      action: 'Agent intervention required',
    };
  };

  const instructionData = getInstructionData();
  const { type, icon, title, message, urgency, action } = instructionData;

  return (
    <div className={`instruction-alert instruction-${type} urgency-${urgency}`}>
      <style jsx>{`
        .instruction-alert {
          position: relative;
          border-radius: 16px;
          padding: 16px 20px;
          margin-bottom: 16px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .instruction-alert::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 16px;
          padding: 2px;
          background: linear-gradient(
            135deg,
            var(--border-start) 0%,
            var(--border-end) 100%
          );
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: xor;
          -webkit-mask-composite: xor;
          opacity: 0.8;
        }

        .instruction-alert::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% {
            left: -100%;
          }
          50% {
            left: 100%;
          }
          100% {
            left: 100%;
          }
        }

        /* User instruction styling */
        .instruction-user {
          --bg-start: rgba(59, 130, 246, 0.1);
          --bg-end: rgba(37, 99, 235, 0.05);
          --border-start: rgba(59, 130, 246, 0.3);
          --border-end: rgba(37, 99, 235, 0.2);
          --text-primary: #1e40af;
          --text-secondary: #374151;
          background: linear-gradient(
            135deg,
            var(--bg-start) 0%,
            var(--bg-end) 100%
          );
          box-shadow: 0 8px 25px 0 rgba(59, 130, 246, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        /* Agent instruction styling */
        .instruction-agent {
          --bg-start: rgba(16, 185, 129, 0.12);
          --bg-end: rgba(5, 150, 105, 0.06);
          --border-start: rgba(16, 185, 129, 0.4);
          --border-end: rgba(5, 150, 105, 0.3);
          --text-primary: #047857;
          --text-secondary: #374151;
          background: linear-gradient(
            135deg,
            var(--bg-start) 0%,
            var(--bg-end) 100%
          );
          box-shadow: 0 8px 25px 0 rgba(16, 185, 129, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        /* Mixed coordination styling */
        .instruction-mixed {
          --bg-start: rgba(245, 158, 11, 0.12);
          --bg-end: rgba(217, 119, 6, 0.06);
          --border-start: rgba(245, 158, 11, 0.4);
          --border-end: rgba(217, 119, 6, 0.3);
          --text-primary: #d97706;
          --text-secondary: #374151;
          background: linear-gradient(
            135deg,
            var(--bg-start) 0%,
            var(--bg-end) 100%
          );
          box-shadow: 0 8px 25px 0 rgba(245, 158, 11, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
        }

        /* Urgency levels */
        .urgency-critical {
          animation: critical-pulse 2s ease-in-out infinite;
          box-shadow: 0 12px 35px 0 rgba(239, 68, 68, 0.3),
            0 0 0 0 rgba(239, 68, 68, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.6) !important;
        }

        .urgency-critical::before {
          background: linear-gradient(
            135deg,
            rgba(239, 68, 68, 0.6) 0%,
            rgba(220, 38, 38, 0.4) 100%
          ) !important;
        }

        @keyframes critical-pulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 12px 35px 0 rgba(239, 68, 68, 0.3),
              0 0 0 0 rgba(239, 68, 68, 0.2),
              inset 0 1px 0 rgba(255, 255, 255, 0.6);
          }
          50% {
            transform: scale(1.02);
            box-shadow: 0 16px 45px 0 rgba(239, 68, 68, 0.4),
              0 0 0 8px rgba(239, 68, 68, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.6);
          }
        }

        .urgency-high {
          animation: high-glow 3s ease-in-out infinite;
        }

        @keyframes high-glow {
          0%,
          100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.05);
          }
        }

        .instruction-content {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          position: relative;
          z-index: 1;
        }

        .instruction-icon {
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.4) 0%,
            rgba(255, 255, 255, 0.1) 100%
          );
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.6);
          flex-shrink: 0;
          animation: icon-float 4s ease-in-out infinite;
        }

        @keyframes icon-float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }

        .instruction-text {
          flex: 1;
          min-width: 0;
        }

        .instruction-title {
          font-weight: 700;
          font-size: 16px;
          color: var(--text-primary);
          margin-bottom: 4px;
          text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
          background: linear-gradient(
            135deg,
            var(--text-primary) 0%,
            var(--text-primary) 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          animation: title-shimmer 6s ease-in-out infinite;
        }

        @keyframes title-shimmer {
          0%,
          100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.2);
          }
        }

        .instruction-message {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 6px;
          font-weight: 500;
        }

        .instruction-action {
          font-size: 12px;
          color: var(--text-primary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.8;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .instruction-action::before {
          content: '•';
          font-size: 8px;
          animation: dot-pulse 2s ease-in-out infinite;
        }

        @keyframes dot-pulse {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        .priority-badge {
          position: absolute;
          top: 8px;
          right: 12px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 12px 0 rgba(239, 68, 68, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          animation: badge-bounce 2s ease-in-out infinite;
          z-index: 2;
        }

        @keyframes badge-bounce {
          0%,
          100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-2px) scale(1.05);
          }
        }

        .instruction-alert:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 16px 45px 0 rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.8);
        }

        .instruction-alert:hover .instruction-icon {
          transform: scale(1.1) rotate(5deg);
        }
      `}</style>

      <div className='instruction-content'>
        <div className='instruction-icon'>{icon}</div>

        <div className='instruction-text'>
          <div className='instruction-title'>{title}</div>
          <div className='instruction-message'>{message}</div>
          <div className='instruction-action'>{action}</div>
        </div>
      </div>

      {urgency === 'critical' && <div className='priority-badge'>Critical</div>}
    </div>
  );
};

export default AgentInstructionAlert;
