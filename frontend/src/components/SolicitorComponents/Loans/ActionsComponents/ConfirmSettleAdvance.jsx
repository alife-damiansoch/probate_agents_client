
const ConfirmSettleAdvance = ({ onConfirm, onCancel }) => {
  return (
    <div className='card bg-danger-subtle'>
      <div className='card-body'>
        <div className='confirm-dialog'>
          <div className='confirm-dialog-content'>
            <h3 className=' text-center'>
              Are you sure you want to settle the advance?
            </h3>
            <p className=' text-center'>
              <strong>This action cannot be undone.</strong>
            </p>
            <div className='confirm-dialog-actions d-flex align-items-center justify-content-center'>
              <button onClick={onConfirm} className='btn btn-danger mx-2'>
                Yes, Settle
              </button>
              <button onClick={onCancel} className='btn btn-secondary mx-2'>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmSettleAdvance;
