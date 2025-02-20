
const MultipleEmailsAlert = ({
  filterMessagesByAssignedSolicitorOnly,
  toggleEmailAndMessageUserOrSolicitorEmail,
}) => {
  return (
    <div className=' alert alert-warning shadow'>
      <div>
        <h5 className=' text-danger'>
          {filterMessagesByAssignedSolicitorOnly
            ? 'ASSIGNED SOLICITOR messages only'
            : 'ALL messages'}{' '}
        </h5>
      </div>
      <div>
        <button
          className=' btn btn-sm btn-outline-info shadow'
          onClick={() => {
            toggleEmailAndMessageUserOrSolicitorEmail();
          }}
        >
          {filterMessagesByAssignedSolicitorOnly
            ? 'Show All Messages'
            : 'Show assigned solicitor messages only'}
        </button>
      </div>
      <div className='alert alert-danger text-danger mt-2 shadow'>
        <h6>Please Note:</h6>
        <p>
          The selection you make here will determine the email address to which
          the new message will be sent (either the assigned solicitor or user
          solicitor). Ensure that the correct solicitor is selected before
          sending your message.
        </p>
      </div>
    </div>
  );
};

export default MultipleEmailsAlert;
