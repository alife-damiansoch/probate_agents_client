import  { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../store/userSlice';

import renderErrors from '../GenericFunctions/HelperGenericFunctions';
import { useNavigate } from 'react-router-dom';
import { patchData } from '../GenericFunctions/AxiosGenericFunctions';
import BackToApplicationsIcon from '../GenericComponents/BackToApplicationsIcon';

const UserProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone_number: '',
    address: {
      line1: '',
      line2: '',
      town_city: '',
      county: '',
      eircode: '',
    },
  });

  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (user) {
      // Format phone number if it starts with +353, otherwise use the phone number as is or an empty string
      const formattedPhoneNumber =
        user.phone_number && user.phone_number.startsWith('+353')
          ? '0' + user.phone_number.slice(4)
          : user?.phone_number ?? '';

      // Set the form data with proper checks for null and undefined values
      setFormData({
        email: user?.email ?? '',
        name: user?.name ?? '',
        phone_number: formattedPhoneNumber,
        address: {
          line1: user?.address?.line1 ?? '',
          line2: user?.address?.line2 ?? '',
          town_city: user?.address?.town_city ?? '',
          county: user?.address?.county ?? '',
          eircode: user?.address?.eircode ?? '',
        },
      });
    }
  }, [user]); // Dependency array ensures this runs when the user object changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prevState) => ({
        ...prevState,
        address: {
          ...prevState.address,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(null); // Clear errors
    try {
      const endpoint = `/api/user/me/`;
      const response = await patchData(endpoint, formData);
      if (response.status === 200) {
        alert('Profile updated successfully!');

        dispatch(fetchUser()); // Fetch the updated user data
      } else {
        setErrors(response.data);
        dispatch(fetchUser()); // Fetch the updated user data
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrors(err.response.data || { error: 'An error occurred' });
    }
  };

  return (
    <>
      <BackToApplicationsIcon backUrl={-1} />
      <div className='row'>
        <button
          className='col-lg-6 mx-auto my-4 btn btn-sm btn-danger shadow'
          onClick={() => {
            navigate('/update_password');
          }}
        >
          Change password
        </button>
      </div>
      {user ? (
        <form onSubmit={handleSubmit}>
          <div className='card rounded col-8 mx-auto shadow'>
            <div className='card-header rounded-top bg-dark'>
              <h4 className='card-title text-center text-white'>
                User Profile
              </h4>
            </div>
            {errors ? (
              <div className=' card-footer'>
                <div className='alert alert-danger' role='alert'>
                  {renderErrors(errors)}
                </div>
              </div>
            ) : null}
            <div className='mb-3 row mt-3'>
              <label htmlFor='email' className='form-label col-lg-8 mx-auto'>
                Email: <br />
                <small className=' text-danger'>
                  When the email address is updated, the login email will be
                  updated as well.
                </small>
                <input
                  type='email'
                  className='form-control form-control-sm shadow'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className='mb-3 row'>
              <label htmlFor='name' className='form-label col-lg-8 mx-auto'>
                Name:
                <input
                  type='text'
                  className='form-control form-control-sm shadow'
                  id='name'
                  name='name'
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className='mb-3 row'>
              <label
                htmlFor='phone_number'
                className='form-label col-lg-8 mx-auto'
              >
                Phone Number:
                <input
                  type='text'
                  className='form-control form-control-sm shadow'
                  id='phone_number'
                  name='phone_number'
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </label>
            </div>

            <h4 className='my-3 text-center'>Address</h4>
            <div className='mb-3 row'>
              <label htmlFor='line1' className='form-label col-lg-8 mx-auto'>
                Address Line 1:
                <input
                  type='text'
                  className='form-control form-control-sm shadow'
                  id='line1'
                  name='address.line1'
                  value={formData.address.line1}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className='mb-3 row'>
              <label htmlFor='line2' className='form-label col-lg-8 mx-auto'>
                Address Line 2:
                <input
                  type='text'
                  className='form-control form-control-sm shadow'
                  id='line2'
                  name='address.line2'
                  value={formData.address.line2}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className='mb-3 row'>
              <label
                htmlFor='town_city'
                className='form-label col-lg-8 mx-auto'
              >
                Town/City:
                <input
                  type='text'
                  className='form-control form-control-sm shadow'
                  id='town_city'
                  name='address.town_city'
                  value={formData.address.town_city}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className='mb-3 row'>
              <label htmlFor='county' className='form-label col-lg-8 mx-auto'>
                County:
                <input
                  type='text'
                  className='form-control form-control-sm shadow'
                  id='county'
                  name='address.county'
                  value={formData.address.county}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className='mb-3 row'>
              <label htmlFor='eircode' className='form-label col-lg-8 mx-auto'>
                Eircode:
                <input
                  type='text'
                  className='form-control form-control-sm shadow'
                  id='eircode'
                  name='address.eircode'
                  value={formData.address.eircode}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className='row my-3'>
              {' '}
              <button
                type='submit'
                className='btn btn-danger btn-sm col-lg-7 mx-auto  shadow'
              >
                Update Profile
              </button>
            </div>
          </div>
        </form>
      ) : (
        <p>Loading user data...</p>
      )}
    </>
  );
};

export default UserProfile;
