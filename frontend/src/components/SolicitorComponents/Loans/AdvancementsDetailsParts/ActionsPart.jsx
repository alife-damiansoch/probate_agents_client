import Cookies from 'js-cookie';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { patchData } from '../../../GenericFunctions/AxiosGenericFunctions';
import LoanChecklistComponent from './LoanChecklistComponent';
import FinalPayoutAuthorization from './LoanChecklistComponentParts/FinalPayoutAuthorization';

const ActionsPart = ({
  advancement,
  showReferenceNumberPart,
  setShowReferenceNumberPart,
  markAdvancementPaidOutHandler,
  payOutReferenceNumber,
  setPayOutReferenceNumber,
  // Add these required props from parent
  setErrorMessage,
  setIsError,
  setRefresh,
  refresh,
}) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const token = Cookies.get('auth_token_agents');

  // Add missing state for checklist
  const [showChecklistPart, setShowChecklistPart] = useState(false);

  console.log('ADVANCEMENT', advancement);

  // Helper function to check if payout authorization is needed
  const needsPayoutAuthorization = () => {
    return (
      advancement.is_paid_out &&
      (!advancement.paid_out_date ||
        advancement.paid_out_date === null ||
        advancement.paid_out_date === '' ||
        !advancement.pay_out_reference_number ||
        advancement.pay_out_reference_number === null ||
        advancement.pay_out_reference_number === '')
    );
  };

  // Show if showReferenceNumberPart is true OR if it needs authorization
  const shouldShowPayoutAuth =
    showReferenceNumberPart || needsPayoutAuthorization();

  console.log('Should show payout auth:', shouldShowPayoutAuth);
  console.log('advancement.is_paid_out:', advancement.is_paid_out);
  console.log('advancement.paid_out_date:', advancement.paid_out_date);
  console.log(
    'advancement.pay_out_reference_number:',
    advancement.pay_out_reference_number
  );

  return (
    <div
      style={{
        background: 'rgba(248, 250, 252, 0.9)',
        borderTop: '1px solid rgba(59, 130, 246, 0.2)',
      }}
    >
      {/* Header */}
      <div
        className='text-center'
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        }}
      >
        <h5
          className='mb-0 fw-bold d-flex align-items-center justify-content-center gap-2'
          style={{
            color: '#1e40af',
            fontSize: '1.1rem',
          }}
        >
          <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z'
              clipRule='evenodd'
            />
          </svg>
          Actions
        </h5>
      </div>

      {/* Body */}
      <div style={{ padding: '24px' }}>
        {/* Payout Authorization - Show this FIRST if needed */}
        {shouldShowPayoutAuth && (
          <div className='mb-4'>
            <FinalPayoutAuthorization
              advancement={advancement}
              onCancel={() => setShowReferenceNumberPart(false)}
              onSuccess={() => {
                setShowReferenceNumberPart(false);
                // Handle success - maybe show confirmation
              }}
              patchData={patchData}
              setErrorMessage={setErrorMessage}
              setIsError={setIsError}
              setRefresh={setRefresh}
              refresh={refresh}
            />
          </div>
        )}

        {!advancement.is_settled ? (
          <div className='d-flex align-items-center justify-content-center gap-3 flex-wrap'>
            <button
              className='btn d-flex align-items-center gap-2'
              style={{
                background: advancement.is_paid_out
                  ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
                  : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                fontWeight: '500',
                fontSize: '0.9rem',
                cursor: advancement.is_paid_out ? 'pointer' : 'not-allowed',
                opacity: advancement.is_paid_out ? 1 : 0.6,
              }}
              onClick={() => {
                navigate(`/transactions/${advancement.id}`);
              }}
              disabled={!advancement.is_paid_out}
            >
              <svg
                width='16'
                height='16'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
              </svg>
              Transactions
            </button>

            <button
              className='btn d-flex align-items-center gap-2'
              style={{
                background: advancement.is_paid_out
                  ? 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
                  : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                fontWeight: '500',
                fontSize: '0.9rem',
                cursor: advancement.is_paid_out ? 'pointer' : 'not-allowed',
                opacity: advancement.is_paid_out ? 1 : 0.6,
              }}
              onClick={() => {
                navigate(`/extentions/${advancement.id}`);
              }}
              disabled={!advancement.is_paid_out}
            >
              <svg
                width='16'
                height='16'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
                  clipRule='evenodd'
                />
              </svg>
              Extensions
            </button>

            <button
              className='btn d-flex align-items-center gap-2'
              style={{
                background: advancement.is_paid_out
                  ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                  : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                fontWeight: '500',
                fontSize: '0.9rem',
                cursor: advancement.is_paid_out ? 'pointer' : 'not-allowed',
                opacity: advancement.is_paid_out ? 1 : 0.6,
              }}
              onClick={() => {
                navigate(`/settle_advancement/${advancement.id}`);
              }}
              disabled={!advancement.is_paid_out}
            >
              <svg
                width='16'
                height='16'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
              Settle Advancement
            </button>
          </div>
        ) : (
          <div
            className='text-center p-4 rounded-3'
            style={{
              background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
              border: '1px solid #86efac',
            }}
          >
            <div className='d-flex align-items-center justify-content-center gap-2 mb-2'>
              <svg
                width='24'
                height='24'
                fill='currentColor'
                viewBox='0 0 20 20'
                style={{ color: '#16a34a' }}
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              <h6
                className='mb-0 fw-bold'
                style={{ color: '#16a34a', fontSize: '1rem' }}
              >
                Advancement Settled
              </h6>
            </div>
            <p
              className='mb-0'
              style={{ color: '#15803d', fontSize: '0.9rem' }}
            >
              Action buttons are not available for settled advancements
            </p>
          </div>
        )}

        {/* Not Paid Out Section */}
        {!advancement.is_paid_out && (
          <div className='mt-4'>
            <div
              className='p-3 rounded-3 mb-3'
              style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                border: '1px solid #fbbf24',
              }}
            >
              <div className='d-flex align-items-center gap-2'>
                <svg
                  width='20'
                  height='20'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  style={{ color: '#d97706' }}
                >
                  <path
                    fillRule='evenodd'
                    d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
                    clipRule='evenodd'
                  />
                </svg>
                <span
                  className='fw-semibold'
                  style={{ color: '#92400e', fontSize: '0.9rem' }}
                >
                  Actions are not available for unpaid advancements
                </span>
              </div>
            </div>

            {user &&
              user.teams &&
              user.teams.some((team) => team.name === 'finance') && (
                <div>
                  <button
                    className='btn w-100 d-flex align-items-center justify-content-center gap-2'
                    style={{
                      background:
                        advancement.needs_committee_approval &&
                        !advancement.is_committee_approved
                          ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                          : 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '14px 24px',
                      fontWeight: '600',
                      fontSize: '1rem',
                      cursor:
                        advancement.needs_committee_approval &&
                        !advancement.is_committee_approved
                          ? 'not-allowed'
                          : 'pointer',
                      opacity:
                        advancement.needs_committee_approval &&
                        !advancement.is_committee_approved
                          ? 0.6
                          : 1,
                      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                      transition: 'all 0.3s ease',
                    }}
                    onClick={() => {
                      // Show checklist instead of reference number part
                      setShowChecklistPart(!showChecklistPart);
                    }}
                    disabled={
                      advancement.needs_committee_approval &&
                      !advancement.is_committee_approved
                    }
                    onMouseEnter={(e) => {
                      if (!e.target.disabled) {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow =
                          '0 6px 20px rgba(139, 92, 246, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow =
                        '0 4px 12px rgba(139, 92, 246, 0.3)';
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
                        d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z'
                        clipRule='evenodd'
                      />
                    </svg>
                    {advancement.needs_committee_approval &&
                    advancement.is_committee_approved === null
                      ? 'Awaiting Committee Approval...'
                      : advancement.needs_committee_approval &&
                        advancement.is_committee_approved === false
                      ? 'Advancement Rejected by Committee'
                      : 'Process Finance Checklist'}
                  </button>

                  {/* Checklist Component */}
                  {showChecklistPart && (
                    <LoanChecklistComponent
                      advancement={advancement}
                      loanId={advancement.id}
                      token={token}
                      onChecklistComplete={() => {
                        // When checklist is complete, show reference number form
                        setShowChecklistPart(false);
                        setShowReferenceNumberPart(true);
                      }}
                      onCancel={() => setShowChecklistPart(false)}
                    />
                  )}
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionsPart;
