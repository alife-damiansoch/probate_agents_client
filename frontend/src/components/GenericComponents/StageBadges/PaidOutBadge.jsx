import { FaCheckCircle } from 'react-icons/fa';

const PaidOutBadge = () => {
  return (
    <div className='application-badge-container shadow'>
      <div className='badge badge-purple'>
        <FaCheckCircle className='me-2' />
        PaidOut
      </div>
    </div>
  );
};

export default PaidOutBadge;
