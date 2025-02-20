

const AssignedBadge = ({ email }) => {
  return (
    <>
      {email ? (
        <div className='row'>
          <span className='badge bg-success shadow col-auto mx-auto my-1'>
            Assigned to: <span>{email}</span>
          </span>
        </div>
      ) : (
        <div className='row'>
          <span className='badge bg-warning col-auto mx-auto my-1'>
            Not assigned.
          </span>
        </div>
      )}
    </>
  );
};

export default AssignedBadge;
