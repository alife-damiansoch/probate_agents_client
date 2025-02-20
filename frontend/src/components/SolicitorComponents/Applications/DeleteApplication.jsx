import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { deleteData } from '../../GenericFunctions/AxiosGenericFunctions';

const DeleteApplication = ({ applicationId, setDeleteAppId }) => {
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const deleteApplicationHandler = async () => {
    console.log(`deleting application ${applicationId}`);
    try {
      const endpoint = `/api/applications/agent_applications/${applicationId}/`;
      const response = await deleteData(endpoint);
      console.log('Deleted Application:', response.data);
      navigate('/applications');
    } catch (error) {
      console.error('Error deleting application:', error);
      if (error.response && error.response.data) {
        const errors = error.response.data;
        let message = 'Error deleting application:\n';
        for (const key in errors) {
          if (Array.isArray(errors[key])) {
            message += `${key}: ${errors[key].join(', ')}\n`;
          } else if (typeof errors[key] === 'object' && errors[key] !== null) {
            for (const nestedKey in errors[key]) {
              message += `${key} - ${nestedKey}: ${errors[key][nestedKey].join(
                ', '
              )}\n`;
            }
          } else {
            message += `${key}: ${errors[key]}\n`;
          }
        }
        setErrorMessage(message);
      } else {
        setErrorMessage(error.message);
      }
    }
  };
  return (
    <div className='alert alert-danger rounded shadow' role='alert'>
      <h4 className='alert-heading'>Confirm Deletion</h4>
      <p>
        Are you sure you want to delete the application with ID: {applicationId}
        ?
      </p>
      <hr />
      <div className='d-flex justify-content-end'>
        <button
          type='button'
          className='btn btn-success me-2 shadow'
          onClick={() => {
            setDeleteAppId('');
          }}
        >
          Cancel
        </button>
        <button
          type='button'
          className='btn btn-danger shadow'
          onClick={deleteApplicationHandler}
        >
          Delete
        </button>
      </div>
      {errorMessage && (
        <div className='alert alert-danger text-center' role='alert'>
          {errorMessage.split('\n').map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeleteApplication;
