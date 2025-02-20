
import { FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

const InProgressBadge = () => {
  return (
    <div className='application-badge-container'>
      <div className='badge badge-warning d-flex align-items-center shadow'>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className='me-2'
        >
          <FaSpinner />
        </motion.div>
        <span>In Progress</span>
      </div>
    </div>
  );
};

export default InProgressBadge;
