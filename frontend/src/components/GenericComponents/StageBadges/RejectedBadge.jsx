import { FaTimesCircle } from 'react-icons/fa';

const RejectedBadge = () => {
  return (
    <div className='application-badge-container shadow'>
      <div className='badge badge-danger'>
        <FaTimesCircle className='me-2' />
        Rejected
      </div>
    </div>
  );
};

export default RejectedBadge;
