
import { FaCheckCircle } from 'react-icons/fa';

const ApprovedBadge = () => {
  return (
    <div className='application-badge-container shadow'>
      <div className='badge badge-success'>
        <FaCheckCircle className='me-2' />
        Approved
      </div>
    </div>
  );
};

export default ApprovedBadge;
