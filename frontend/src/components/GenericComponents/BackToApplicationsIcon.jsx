
import { IoChevronBackCircleOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const BackToApplicationsIcon = ({ backUrl }) => {
  const navigate = useNavigate();
  return (
    <div className='row my-3'>
      <div>
        <IoChevronBackCircleOutline
          size={30}
          className='me-3 icon-shadow'
          onClick={() => {
            navigate(backUrl);
          }}
          style={{ cursor: 'pointer' }}
          color='green'
        />
      </div>
    </div>
  );
};

export default BackToApplicationsIcon;
