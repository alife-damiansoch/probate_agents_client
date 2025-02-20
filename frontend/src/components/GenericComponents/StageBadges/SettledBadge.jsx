import { FaCheckCircle } from 'react-icons/fa';

const SettledBadge = () => {
  return (
    <div className='application-badge-container shadow'>
      <div className='badge badge-blue'>
        <FaCheckCircle className='me-2' />
        Settled
      </div>
    </div>
  );
};

export default SettledBadge;
