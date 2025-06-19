import { useState } from 'react';
import { formatMoney } from '../../../../GenericFunctions/HelperGenericFunctions';

const FinalPayoutAuthorization = ({
  advancement,
  onCancel,
  onSuccess,
  patchData,
  setErrorMessage,
  setIsError,
  setRefresh,
  refresh,
}) => {
  const [payOutReferenceNumber, setPayOutReferenceNumber] = useState(
    advancement.pay_out_reference_number || ''
  );
  const [paidOutDate, setPaidOutDate] = useState(
    advancement.paid_out_date || new Date().toISOString().split('T')[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmPayout = async () => {
    if (!payOutReferenceNumber.trim()) {
      setErrorMessage('Reference number is required');
      setIsError(true);
      return;
    }

    if (!paidOutDate) {
      setErrorMessage('Payout date is required');
      setIsError(true);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setIsError(false);

    const dataForUpdate = {
      pay_out_reference_number: payOutReferenceNumber.trim(),
      paid_out_date: paidOutDate,
      is_paid_out: true,
    };

    try {
      const endpoint = `/api/loans/loans/${advancement.id}/`;
      const response = await patchData(endpoint, dataForUpdate);
      console.log(response);
      setErrorMessage({ Advancement: 'Payout completed successfully' });
      setIsError(false);
      setRefresh(!refresh);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error updating payout:', error);
      setIsError(true);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
        console.log(error.response.data);
      } else {
        setErrorMessage(error.message);
        console.log(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.98) 100%)',
        borderRadius: '12px',
        padding: '20px',
        margin: '16px 0',
        boxShadow:
          '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        backdropFilter: 'blur(8px)',
        animation: 'slideIn 0.3s ease-out',
      }}
    >
      {/* Header */}
      <div className='d-flex align-items-center gap-3 mb-3'>
        <div
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            color: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
          }}
        >
          <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z'
              clipRule='evenodd'
            />
          </svg>
        </div>
        <div>
          <h6
            className='mb-1 fw-bold'
            style={{ color: '#1e293b', fontSize: '1rem' }}
          >
            Record Payout Details{' '}
          </h6>
          <p className='mb-0' style={{ color: '#64748b', fontSize: '0.8rem' }}>
            Complete the payout process with reference and date
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className='row g-3 mb-3'>
        <div className='col-md-6'>
          <label
            htmlFor='referenceNumber'
            style={{
              color: '#374151',
              fontSize: '0.8rem',
              fontWeight: '600',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Reference Number
          </label>
          <input
            type='text'
            id='referenceNumber'
            value={payOutReferenceNumber}
            onChange={(e) => setPayOutReferenceNumber(e.target.value)}
            placeholder='Enter reference number...'
            required
            style={{
              width: '100%',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '8px 12px',
              fontSize: '0.85rem',
              background: 'rgba(248, 250, 252, 0.5)',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
              e.target.style.background = 'white';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
              e.target.style.background = 'rgba(248, 250, 252, 0.5)';
            }}
            disabled={isSubmitting}
          />
        </div>
        <div className='col-md-6'>
          <label
            htmlFor='payoutDate'
            style={{
              color: '#374151',
              fontSize: '0.8rem',
              fontWeight: '600',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Payout Date
          </label>
          <input
            type='date'
            id='payoutDate'
            value={paidOutDate}
            onChange={(e) => setPaidOutDate(e.target.value)}
            required
            style={{
              width: '100%',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '8px 12px',
              fontSize: '0.85rem',
              background: 'rgba(248, 250, 252, 0.5)',
              transition: 'all 0.2s ease',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
              e.target.style.background = 'white';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e2e8f0';
              e.target.style.boxShadow = 'none';
              e.target.style.background = 'rgba(248, 250, 252, 0.5)';
            }}
            disabled={isSubmitting}
          />
        </div>
      </div>

      {/* Status Info */}
      <div
        style={{
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          border: '1px solid #7dd3fc',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '16px',
        }}
      >
        <div className='d-flex align-items-center gap-2 mb-2'>
          <div
            style={{
              width: '6px',
              height: '6px',
              background: '#3b82f6',
              borderRadius: '50%',
            }}
          />
          <span
            style={{ color: '#0c4a6e', fontSize: '0.75rem', fontWeight: '600' }}
          >
            Loan Information
          </span>
        </div>
        <div className='row g-2' style={{ fontSize: '0.75rem' }}>
          <div className='col-4'>
            <span style={{ color: '#64748b' }}>Amount:</span>
            <div style={{ color: '#1e293b', fontWeight: '600' }}>
              {formatMoney(
                advancement?.amount_agreed,
                advancement.currency_sign
              )}
            </div>
          </div>
          <div className='col-4'>
            <span style={{ color: '#64748b' }}>Status:</span>
            <div
              style={{
                color: advancement.is_paid_out ? '#059669' : '#d97706',
                fontWeight: '600',
              }}
            >
              {advancement.is_paid_out ? 'Paid Out' : 'Pending'}
            </div>
          </div>
          <div className='col-4'>
            <span style={{ color: '#64748b' }}>Current Ref:</span>
            <div style={{ color: '#1e293b', fontWeight: '600' }}>
              {advancement.pay_out_reference_number || 'None'}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='d-flex gap-2 justify-content-end'>
        <button
          type='button'
          onClick={onCancel}
          disabled={isSubmitting}
          style={{
            background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '0.8rem',
            fontWeight: '500',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            opacity: isSubmitting ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(100, 116, 139, 0.3)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <svg
            width='14'
            height='14'
            fill='currentColor'
            viewBox='0 0 20 20'
            style={{ marginRight: '4px' }}
          >
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
          Cancel
        </button>
        <button
          type='button'
          onClick={handleConfirmPayout}
          disabled={
            isSubmitting || !payOutReferenceNumber.trim() || !paidOutDate
          }
          style={{
            background:
              isSubmitting || !payOutReferenceNumber.trim() || !paidOutDate
                ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontSize: '0.8rem',
            fontWeight: '600',
            cursor:
              isSubmitting || !payOutReferenceNumber.trim() || !paidOutDate
                ? 'not-allowed'
                : 'pointer',
            boxShadow:
              isSubmitting || !payOutReferenceNumber.trim() || !paidOutDate
                ? 'none'
                : '0 4px 12px rgba(16, 185, 129, 0.3)',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting && payOutReferenceNumber.trim() && paidOutDate) {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow =
              isSubmitting || !payOutReferenceNumber.trim() || !paidOutDate
                ? 'none'
                : '0 4px 12px rgba(16, 185, 129, 0.3)';
          }}
        >
          {isSubmitting ? (
            <>
              <span
                style={{
                  display: 'inline-block',
                  width: '12px',
                  height: '12px',
                  border: '1px solid transparent',
                  borderTop: '1px solid white',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginRight: '6px',
                }}
              />
              Processing...
            </>
          ) : (
            <>
              <svg
                width='14'
                height='14'
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
              Confirm Payout
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default FinalPayoutAuthorization;
