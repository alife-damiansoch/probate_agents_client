
const RejectionForm = ({
  rejectionReason,
  setRejectionReason,
  handleRejectCancel,
  handleRejectSubmit,
}) => {
  return (
    <div className='card bg-danger-subtle mx-5 my-3 p-3 shadow'>
      <h5>Reject Application</h5>
      <div className='mb-3'>
        <label htmlFor='rejectionReason' className='form-label'>
          Reason for Rejection:
        </label>
        <textarea
          id='rejectionReason'
          className='form-control form-control-sm shadow'
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
        />
      </div>
      <div className='text-end'>
        <button
          className='btn btn-success shadow me-2'
          onClick={handleRejectCancel}
        >
          Cancel
        </button>
        <button className='btn btn-danger  shadow' onClick={handleRejectSubmit}>
          Reject
        </button>
      </div>
    </div>
  );
};

export default RejectionForm;
