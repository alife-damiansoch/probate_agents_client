import { useEffect, useState } from 'react';
import IncompleteVerificationModal from './IncompleteVerificationModal';

const ChecklistCompletionForm = ({
  checklistData,
  userChecks,
  notes,
  submitting,
  onCheckChange,
  onNotesChange,
  onNotesUpdate,
  onClose,
  onSubmit,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const getUncheckedItems = () => {
    if (!checklistData.checklist_items) return [];

    return checklistData.checklist_items.filter((item) => {
      const userCheck = userChecks[item.id];
      return !userCheck || !userCheck.is_checked;
    });
  };

  const handleSubmitAttempt = () => {
    const uncheckedItems = getUncheckedItems();

    if (uncheckedItems.length > 0) {
      setShowWarningModal(true);
      return;
    } else {
      onSubmit();
    }
  };

  return (
    <div
      className='position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
      style={{
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(12px)',
        borderRadius: '24px',
        zIndex: 10,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
      }}
      onClick={handleBackdropClick}
    >
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
          borderRadius: '12px',
          margin: '20px',
          maxWidth: '600px',
          maxHeight: '75vh',
          width: '90%',
          padding: '16px',
          overflowY: 'auto',
          transform: isVisible
            ? 'scale(1) translateY(0)'
            : 'scale(0.96) translateY(10px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow:
            '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className='d-flex align-items-center justify-content-between mb-2 pb-2'
          style={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}
        >
          <div className='d-flex align-items-center gap-2'>
            <div
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 4px rgba(59, 130, 246, 0.3)',
              }}
            >
              <svg
                width='12'
                height='12'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div>
              <h6
                className='mb-0 fw-bold'
                style={{ fontSize: '0.85rem', color: '#1e293b' }}
              >
                Checklist
              </h6>
              <p
                className='mb-0'
                style={{ color: '#64748b', fontSize: '0.65rem' }}
              >
                Review items
              </p>
            </div>
          </div>
          <button
            style={{
              background: 'rgba(0, 0, 0, 0.04)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: '4px',
              color: '#64748b',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={handleClose}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.08)';
              e.target.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.04)';
              e.target.style.color = '#64748b';
            }}
          >
            <svg width='10' height='10' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        </div>

        {/* Progress Overview */}
        <div
          style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            border: '1px solid #7dd3fc',
            borderRadius: '8px',
            padding: '8px',
            marginBottom: '12px',
            boxShadow: '0 1px 3px rgba(125, 211, 252, 0.1)',
          }}
        >
          <div className='row g-1 text-center'>
            <div className='col-4'>
              <div className='d-flex flex-column align-items-center'>
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '4px',
                  }}
                >
                  <svg
                    width='10'
                    height='10'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div
                  className='fw-bold text-primary'
                  style={{ fontSize: '0.8rem' }}
                >
                  {checklistData.checklist_items?.length || 0}
                </div>
                <small
                  className='text-muted fw-medium'
                  style={{ fontSize: '0.6rem' }}
                >
                  Total
                </small>
              </div>
            </div>
            <div className='col-4'>
              <div className='d-flex flex-column align-items-center'>
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '4px',
                  }}
                >
                  <svg
                    width='10'
                    height='10'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div
                  className='fw-bold text-success'
                  style={{ fontSize: '0.8rem' }}
                >
                  {
                    Object.values(userChecks).filter(
                      (check) => check.is_checked
                    ).length
                  }
                </div>
                <small
                  className='text-muted fw-medium'
                  style={{ fontSize: '0.6rem' }}
                >
                  Done
                </small>
              </div>
            </div>
            <div className='col-4'>
              <div className='d-flex flex-column align-items-center'>
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '4px',
                  }}
                >
                  <svg
                    width='10'
                    height='10'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div
                  className='fw-bold text-warning'
                  style={{ fontSize: '0.8rem' }}
                >
                  {checklistData.config?.required_approvers || 2}
                </div>
                <small
                  className='text-muted fw-medium'
                  style={{ fontSize: '0.6rem' }}
                >
                  Req'd
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Checklist Items */}
        <div
          style={{
            maxHeight: '300px',
            overflowY: 'auto',
            background: 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '8px',
            marginBottom: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          }}
        >
          {checklistData.checklist_items?.map((item, index) => (
            <div
              key={item.id}
              style={{
                background: userChecks[item.id]?.is_checked
                  ? 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)'
                  : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: userChecks[item.id]?.is_checked
                  ? '1px solid #86efac'
                  : '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '8px',
                marginBottom:
                  index !== checklistData.checklist_items.length - 1
                    ? '8px'
                    : '0',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 2px 8px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 1px 2px rgba(0, 0, 0, 0.03)';
              }}
            >
              <div className='d-flex align-items-start gap-2'>
                <input
                  type='checkbox'
                  id={`check-${item.id}`}
                  checked={userChecks[item.id]?.is_checked || false}
                  onChange={(e) => onCheckChange(item.id, e.target.checked)}
                  style={{
                    transform: 'scale(1.1)',
                    accentColor: '#3b82f6',
                    marginTop: '2px',
                  }}
                />
                <div className='flex-grow-1'>
                  <label
                    htmlFor={`check-${item.id}`}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: userChecks[item.id]?.is_checked
                        ? '#047857'
                        : '#374151',
                      cursor: 'pointer',
                      display: 'block',
                      marginBottom: '4px',
                    }}
                  >
                    {item.title}
                  </label>
                  {item.description && (
                    <div
                      style={{
                        background: userChecks[item.id]?.is_checked
                          ? '#f0fdf4'
                          : '#f8fafc',
                        border: `1px solid ${
                          userChecks[item.id]?.is_checked
                            ? '#bbf7d0'
                            : '#e2e8f0'
                        }`,
                        borderRadius: '4px',
                        padding: '4px',
                        marginBottom: '6px',
                      }}
                    >
                      <small
                        style={{
                          color: userChecks[item.id]?.is_checked
                            ? '#065f46'
                            : '#64748b',
                          fontSize: '0.65rem',
                          lineHeight: '1.2',
                        }}
                      >
                        {item.description}
                      </small>
                    </div>
                  )}
                  <input
                    type='text'
                    placeholder='Notes...'
                    value={userChecks[item.id]?.notes || ''}
                    onChange={(e) => onNotesChange(item.id, e.target.value)}
                    style={{
                      width: '100%',
                      borderRadius: '4px',
                      border: '1px solid #e2e8f0',
                      padding: '4px 6px',
                      fontSize: '0.7rem',
                      height: '24px',
                      transition: 'all 0.2s ease',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#3b82f6';
                      e.target.style.boxShadow =
                        '0 0 0 1px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e2e8f0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div className='text-center'>
                  <div
                    style={{
                      background:
                        item.users_checked_count >= item.required_count
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: 'white',
                      fontSize: '0.6rem',
                      borderRadius: '3px',
                      padding: '2px 4px',
                      marginBottom: '2px',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                      minWidth: '20px',
                      textAlign: 'center',
                    }}
                  >
                    {item.users_checked_count}/{item.required_count}
                  </div>
                  <div style={{ fontSize: '0.55rem', color: '#6b7280' }}>
                    Apps
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Notes */}
        <div style={{ marginBottom: '12px' }}>
          <label
            style={{
              color: '#374151',
              fontSize: '0.7rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginBottom: '4px',
            }}
          >
            <svg width='10' height='10' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z'
                clipRule='evenodd'
              />
            </svg>
            Notes
          </label>
          <textarea
            rows='2'
            placeholder='Overall notes...'
            value={notes}
            onChange={(e) => onNotesUpdate(e.target.value)}
            style={{
              width: '100%',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              padding: '6px',
              fontSize: '0.7rem',
              transition: 'all 0.2s ease',
              resize: 'vertical',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 1px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* Form Actions */}
        <div
          className='d-flex gap-2 justify-content-end'
          style={{
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            paddingTop: '8px',
          }}
        >
          <button
            type='button'
            onClick={handleClose}
            disabled={submitting}
            style={{
              background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.7rem',
              fontWeight: '500',
              cursor: submitting ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 2px 8px rgba(100, 116, 139, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Cancel
          </button>
          <button
            type='button'
            disabled={submitting}
            onClick={handleSubmitAttempt}
            style={{
              background: submitting
                ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.7rem',
              fontWeight: '600',
              cursor: submitting ? 'not-allowed' : 'pointer',
              boxShadow: submitting
                ? 'none'
                : '0 1px 4px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!submitting) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 1px 4px rgba(59, 130, 246, 0.3)';
              }
            }}
          >
            {submitting ? (
              <>
                <span
                  style={{
                    display: 'inline-block',
                    width: '8px',
                    height: '8px',
                    border: '1px solid transparent',
                    borderTop: '1px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '4px',
                  }}
                />
                Submitting...
              </>
            ) : (
              <>
                <svg
                  width='10'
                  height='10'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  style={{ marginRight: '4px' }}
                >
                  <path
                    fillRule='evenodd'
                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                    clipRule='evenodd'
                  />
                </svg>
                Submit
              </>
            )}
          </button>
        </div>

        <style>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          /* Custom scrollbar */
          div::-webkit-scrollbar {
            width: 4px;
          }

          div::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 2px;
          }

          div::-webkit-scrollbar-thumb {
            background: rgba(0, 0, 0, 0.2);
            border-radius: 2px;
          }

          div::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 0, 0, 0.3);
          }
        `}</style>
      </div>

      {/* Warning Modal */}
      {showWarningModal && (
        <IncompleteVerificationModal
          uncheckedItems={getUncheckedItems()}
          onClose={() => setShowWarningModal(false)}
        />
      )}
    </div>
  );
};

export default ChecklistCompletionForm;
