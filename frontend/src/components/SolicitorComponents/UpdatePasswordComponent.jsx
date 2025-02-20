import  { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../baseUrls';
import renderErrors from '../GenericFunctions/HelperGenericFunctions';
import { useSelector } from 'react-redux';

const UpdatePasswordComponent = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [errors, setErrors] = useState(null);

  const token = useSelector((state) => state.auth.token.access);

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setErrors({ password: 'New passwords do not match' });
      return;
    }
    try {
      await axios.patch(
        `${API_URL}/api/user/update_password/`,
        { old_password: oldPassword, new_password: newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Password updated successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setErrors(null); // Clear errors on successful submission
    } catch (err) {
      console.error('Error updating password:', err);
      setErrors(err.response.data || { error: 'An error occurred' });
    }
  };

  return (
    <div className='container mt-3'>
      <div className='card'>
        <div className='card-body'>
          <h2 className='card-title mb-4'>Update Password</h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor='oldPassword' className='form-label'>
                Old Password
              </label>
              <input
                type='password'
                className='form-control form-control-sm'
                id='oldPassword'
                name='oldPassword'
                value={oldPassword}
                onChange={handleOldPasswordChange}
                required
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='newPassword' className='form-label'>
                New Password
              </label>
              <input
                type='password'
                className='form-control form-control-sm'
                id='newPassword'
                name='newPassword'
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
              />
            </div>
            <div className='mb-3'>
              <label htmlFor='confirmNewPassword' className='form-label'>
                Confirm New Password
              </label>
              <input
                type='password'
                className='form-control form-control-sm'
                id='confirmNewPassword'
                name='confirmNewPassword'
                value={confirmNewPassword}
                onChange={handleConfirmNewPasswordChange}
                required
              />
            </div>
            <button type='submit' className='btn btn-primary btn-sm'>
              Update Password
            </button>
          </form>
          {renderErrors(errors)}
        </div>
      </div>
    </div>
  );
};

export default UpdatePasswordComponent;
