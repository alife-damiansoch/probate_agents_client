import { useEffect, useState } from 'react';
import {
  fetchData,
  postData,
} from '../../../GenericFunctions/AxiosGenericFunctions';
import { formatMoney } from '../../../GenericFunctions/HelperGenericFunctions';
import ChecklistCompletionForm from './LoanChecklistComponentParts/ChecklistCompletionForm';
import ChecklistHeader from './LoanChecklistComponentParts/ChecklistHeader';
import ChecklistItemsOverview from './LoanChecklistComponentParts/ChecklistItemsOverview';
import ChecklistStatusCard from './LoanChecklistComponentParts/ChecklistStatusCard';
import LoanDetailsCards from './LoanChecklistComponentParts/LoanDetailsCards';
import SubmissionDetailsModal from './LoanChecklistComponentParts/SubmissionDetailsModal';
import SubmissionsGrid from './LoanChecklistComponentParts/SubmissionsGrid';

const LoanChecklistComponent = ({
  loanId,
  token,
  advancement,
  onChecklistComplete,
  onCancel,
}) => {
  const [checklistData, setChecklistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCompletionForm, setShowCompletionForm] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [userChecks, setUserChecks] = useState({});
  const [notes, setNotes] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    fetchChecklistData();
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [loanId]);

  const fetchChecklistData = async () => {
    try {
      setLoading(true);
      const response = await fetchData(
        token,
        `/api/finance/loan/${loanId}/checklist/`
      );

      if (response.status === 200) {
        setChecklistData(response.data);

        const initialChecks = {};
        response.data.checklist_items?.forEach((item) => {
          initialChecks[item.id] = {
            is_checked: item.user_checked,
            notes: item.user_notes,
          };
        });
        setUserChecks(initialChecks);
      } else {
        console.error('Error fetching checklist data:', response.data);
      }
    } catch (error) {
      console.error('Error fetching checklist data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitChecklist = async () => {
    setSubmitting(true);

    try {
      const checklistItems = Object.entries(userChecks).map(
        ([itemId, check]) => ({
          item_id: parseInt(itemId),
          is_checked: check.is_checked,
          notes: check.notes || '',
        })
      );

      const response = await postData(
        token,
        `/api/finance/loan/${loanId}/checklist/submit/`,
        {
          checklist_items: checklistItems,
          notes: notes,
        }
      );

      if (response.status >= 200 && response.status < 300) {
        if (response.data.loan_marked_for_payout) {
          handleClose();
          onChecklistComplete?.();
        } else {
          await fetchChecklistData();
          setShowCompletionForm(false);
        }
      } else {
        alert(response.data.error || 'Error submitting checklist');
      }
    } catch (error) {
      console.error('Error submitting checklist:', error);
      alert('Error submitting checklist');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCheckChange = (itemId, checked) => {
    setUserChecks((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        is_checked: checked,
      },
    }));
  };

  const handleNotesChange = (itemId, notes) => {
    setUserChecks((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        notes: notes,
      },
    }));
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onCancel();
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const getApprovalStatusText = () => {
    if (!checklistData?.config) return 'Unknown';

    const current = checklistData.submissions?.length || 0;
    const required = checklistData.config.required_approvers;

    if (current >= required) {
      return `✓ Approved (${current}/${required})`;
    } else {
      return `${current}/${required} Needed`;
    }
  };

  return (
    <div
      className='position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
      style={{
        zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
      }}
      onClick={handleBackdropClick}
    >
      <div
        className='position-relative w-100 h-100 d-flex flex-column'
        style={{
          maxWidth: '95vw',
          maxHeight: '95vh',
          background:
            'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
          borderRadius: '24px',
          boxShadow:
            '0 25px 80px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          transform: isVisible
            ? 'scale(1) translateY(0)'
            : 'scale(0.95) translateY(20px)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <ChecklistHeader loanId={loanId} onClose={handleClose} />

        {/* Body */}
        <div className='flex-grow-1 overflow-hidden'>
          {loading ? (
            <div className='d-flex flex-column align-items-center justify-content-center h-100'>
              <div
                className='spinner-border mb-4'
                style={{
                  width: '4rem',
                  height: '4rem',
                  color: '#667eea',
                  borderWidth: '4px',
                }}
                role='status'
              >
                <span className='visually-hidden'>Loading...</span>
              </div>
              <h5 className='fw-bold text-muted'>
                Loading finance checklist...
              </h5>
              <p className='text-muted'>
                Please wait while we fetch the latest data
              </p>
            </div>
          ) : !checklistData ? (
            <div className='d-flex flex-column align-items-center justify-content-center h-100'>
              <div
                className='p-4 rounded-4 mb-4'
                style={{
                  background:
                    'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                  border: '2px solid #fca5a5',
                }}
              >
                <svg width='48' height='48' fill='#dc2626' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <h5 className='fw-bold text-danger mb-2'>
                Error Loading Checklist
              </h5>
              <p className='text-muted mb-4'>
                Unable to load checklist data. Please try again.
              </p>
              <button
                className='btn btn-primary px-4 py-2'
                onClick={() => fetchChecklistData()}
              >
                Retry
              </button>
            </div>
          ) : (
            <div className='h-100 overflow-auto p-4'>
              {/* Status Header */}
              <ChecklistStatusCard
                checklistData={checklistData}
                approvalStatusText={getApprovalStatusText()}
              />

              {/* Loan Details */}
              <LoanDetailsCards
                checklistData={checklistData}
                advancement={advancement}
                formatMoney={formatMoney}
                approvalStatusText={getApprovalStatusText()}
              />

              {/* Submissions Grid */}
              {checklistData.submissions &&
                checklistData.submissions.length > 0 && (
                  <SubmissionsGrid
                    submissions={checklistData.submissions}
                    onSubmissionClick={setSelectedSubmission}
                  />
                )}

              {/* Checklist Items Overview */}
              {checklistData.checklist_items &&
                checklistData.checklist_items.length > 0 && (
                  <ChecklistItemsOverview
                    items={checklistData.checklist_items}
                  />
                )}
            </div>
          )}
        </div>

        {/* Footer */}
        {checklistData && (
          <div
            className='p-4 border-top'
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              borderTop: '1px solid #e2e8f0',
              borderRadius: '0 0 24px 24px',
            }}
          >
            <div className='d-flex gap-3 justify-content-end'>
              <button
                type='button'
                className='btn d-flex align-items-center gap-2 px-4 py-2'
                style={{
                  background:
                    'linear-gradient(135deg, #64748b 0%, #475569 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '500',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                }}
                onClick={handleClose}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow =
                    '0 6px 20px rgba(100, 116, 139, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <svg
                  width='18'
                  height='18'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
                Close
              </button>

              {checklistData.checklist_complete ? (
                <button
                  type='button'
                  className='btn d-flex align-items-center gap-2 px-5 py-2'
                  style={{
                    background:
                      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '1rem',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => {
                    handleClose();
                    onChecklistComplete?.();
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow =
                      '0 8px 25px rgba(16, 185, 129, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow =
                      '0 6px 20px rgba(16, 185, 129, 0.3)';
                  }}
                >
                  <svg
                    width='18'
                    height='18'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Proceed to Payout
                </button>
              ) : !checklistData.user_has_submitted ? (
                <button
                  type='button'
                  className='btn d-flex align-items-center gap-2 px-4 py-2'
                  style={{
                    background:
                      'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '600',
                    fontSize: '1rem',
                    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.3)',
                    transition: 'all 0.3s ease',
                  }}
                  onClick={() => setShowCompletionForm(true)}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow =
                      '0 8px 25px rgba(59, 130, 246, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow =
                      '0 6px 20px rgba(59, 130, 246, 0.3)';
                  }}
                >
                  <svg
                    width='18'
                    height='18'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Complete My Checklist
                </button>
              ) : (
                <div
                  className='d-flex align-items-center gap-3 px-4 py-2 rounded-3'
                  style={{ background: '#fef3c7', border: '2px solid #fbbf24' }}
                >
                  <svg
                    width='20'
                    height='20'
                    fill='#d97706'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span className='fw-semibold' style={{ color: '#92400e' }}>
                    {getApprovalStatusText()} - Waiting for more approvals
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Completion Form Overlay */}
        {showCompletionForm && (
          <ChecklistCompletionForm
            checklistData={checklistData}
            userChecks={userChecks}
            notes={notes}
            submitting={submitting}
            onCheckChange={handleCheckChange}
            onNotesChange={handleNotesChange}
            onNotesUpdate={setNotes}
            onClose={() => setShowCompletionForm(false)}
            onSubmit={handleSubmitChecklist}
          />
        )}

        {/* Submission Details Modal */}
        {selectedSubmission && (
          <SubmissionDetailsModal
            submission={selectedSubmission}
            checklistItems={checklistData.checklist_items}
            onClose={() => setSelectedSubmission(null)}
          />
        )}
      </div>
    </div>
  );
};

export default LoanChecklistComponent;
