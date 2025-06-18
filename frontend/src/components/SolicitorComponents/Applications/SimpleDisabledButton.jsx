import { AiFillExclamationCircle } from 'react-icons/ai';

const SimpleDisabledButton = ({
  allStagesCompleted,
  isAmountWithinLimits,
  onButtonClick,
  buttonText = 'Approve for Advancement',
}) => {
  const handleClick = () => {
    if (allStagesCompleted && isAmountWithinLimits) {
      onButtonClick();
    }
  };

  const isDisabled = !allStagesCompleted || !isAmountWithinLimits;

  return (
    <div className='col-lg-4'>
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`btn w-100 py-3 fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2 ${
          isDisabled ? 'position-relative' : ''
        }`}
        style={{
          background: !isDisabled
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
            : '#6c757d',
          color: 'white',
          border: 'none',
          fontSize: '0.875rem',
          opacity: !isDisabled ? 1 : 0.6,
          cursor: !isDisabled ? 'pointer' : 'not-allowed',
        }}
      >
        <svg width='16' height='16' fill='currentColor' viewBox='0 0 20 20'>
          {!isDisabled ? (
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
              clipRule='evenodd'
            />
          ) : (
            <path
              fillRule='evenodd'
              d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
              clipRule='evenodd'
            />
          )}
        </svg>
        {buttonText}
      </button>

      {!allStagesCompleted && (
        <div className='mt-2'>
          <small className='text-danger d-flex align-items-center gap-1'>
            <AiFillExclamationCircle size={14} />
            Complete all timeline stages to enable
          </small>
        </div>
      )}

      {!isAmountWithinLimits && (
        <div className='mt-2'>
          <small className='text-danger d-flex align-items-center gap-1'>
            <AiFillExclamationCircle size={14} />
            Requested amount is not within the allowed limit
          </small>
        </div>
      )}
    </div>
  );
};

export default SimpleDisabledButton;
