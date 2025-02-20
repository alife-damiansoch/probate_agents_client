// import axios from 'axios';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { API_URL } from '../../baseUrls';
// import renderErrors from '../GenericFunctions/HelperGenericFunctions';
import BackToApplicationsIcon from '../GenericComponents/BackToApplicationsIcon';

const RegisterComponent = () => {
  // const [formData, setFormData] = useState({
  //   email: '',
  //   password: '',
  //   confirmPassword: '',
  //   name: '',
  //   phone_number: '',
  //   address: {
  //     line1: '',
  //     line2: '',
  //     town_city: '',
  //     county: '',
  //     eircode: '',
  //   },
  //   team: {
  //     name: 'solicitors',
  //   },
  // });
  // // const [errors, setErrors] = useState(null);
  // const navigate = useNavigate();
  //
  // const registerUser = async (formData) => {
  //   try {
  //     const response = await axios.post(
  //       `${API_URL}/api/user/create/`,
  //       formData
  //     );
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error registering user:', error);
  //     throw error;
  //   }
  // };

  // const handleSubmit = async (e) => {
  //   setErrors({});
  //   e.preventDefault();
  //   if (formData.password !== formData.confirmPassword) {
  //     setErrors({ confirmPassword: ['Passwords do not match'] });
  //     return;
  //   }
  //   try {
  //     const response = await registerUser(formData);
  //     console.log('Registration successful:', response);
  //     navigate('/applications');
  //   } catch (error) {
  //     console.error('Registration error:', error.response.data);
  //     setErrors(error.response.data || { general: ['An error occurred'] });
  //     window.scrollTo(0, document.body.scrollHeight);
  //   }
  // };

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name.includes('address.')) {
  //     const addressField = name.split('.')[1];
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       address: {
  //         ...prevData.address,
  //         [addressField]: value,
  //       },
  //     }));
  //   } else if (name.includes('team.')) {
  //     const teamField = name.split('.')[1];
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       team: {
  //         ...prevData.team,
  //         [teamField]: value,
  //       },
  //     }));
  //   } else {
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       [name]: value,
  //     }));
  //   }
  // };

  return (
    <>
      <BackToApplicationsIcon backUrl={-1} />
      <div className=' alert alert-danger text-center my-5'>
        Creating Agents is not possible here. <br /> <br />
        Contact IT to create new agent.
      </div>
    </>
  );

  // // The code underneatch is left here just in case we want to create agents like that, but for the moment this is not possible
  // return (
  //   <>
  //     <BackToApplicationsIcon backUrl={-1} />
  //     <div className='container mt-5'>
  //       <div className='row justify-content-center'>
  //         <div className='col-md-8'>
  //           <div className='card shadow'>
  //             <div className='card-body'>
  //               <h3 className='card-title text-center'>Register</h3>
  //               <form onSubmit={handleSubmit}>
  //                 <div className='mb-3'>
  //                   <label htmlFor='email' className='form-label col-12'>
  //                     Email:
  //                     <input
  //                       type='email'
  //                       id='email'
  //                       name='email'
  //                       className='form-control form-control-sm shadow'
  //                       value={formData.email}
  //                       onChange={handleChange}
  //                       required
  //                     />
  //                   </label>
  //                 </div>
  //                 <div className='mb-3'>
  //                   <label htmlFor='password' className='form-label col-12'>
  //                     Password:
  //                     <input
  //                       type='password'
  //                       id='password'
  //                       name='password'
  //                       className='form-control form-control-sm shadow'
  //                       value={formData.password}
  //                       onChange={handleChange}
  //                       required
  //                     />
  //                   </label>
  //                 </div>
  //                 <div className='mb-3'>
  //                   <label
  //                     htmlFor='confirmPassword'
  //                     className='form-label col-12'
  //                   >
  //                     Confirm Password:
  //                     <input
  //                       type='password'
  //                       id='confirmPassword'
  //                       name='confirmPassword'
  //                       className='form-control form-control-sm shadow'
  //                       value={formData.confirmPassword}
  //                       onChange={handleChange}
  //                       required
  //                     />
  //                   </label>
  //                 </div>
  //                 <div className='mb-3'>
  //                   <label htmlFor='name' className='form-label col-12'>
  //                     Law Firm Name:
  //                     <input
  //                       type='text'
  //                       id='name'
  //                       name='name'
  //                       className='form-control form-control-sm shadow'
  //                       value={formData.name}
  //                       onChange={handleChange}
  //                       required
  //                     />
  //                   </label>
  //                 </div>
  //                 <div className='mb-3'>
  //                   <label htmlFor='phone_number' className='form-label col-12'>
  //                     Phone Number:
  //                     <input
  //                       type='text'
  //                       id='phone_number'
  //                       name='phone_number'
  //                       className='form-control form-control-sm shadow'
  //                       value={formData.phone_number}
  //                       onChange={handleChange}
  //                       required
  //                     />
  //                   </label>
  //                 </div>
  //                 <div className='mb-3'>
  //                   <label htmlFor='line1' className='form-label col-12'>
  //                     Address Line 1:
  //                     <input
  //                       type='text'
  //                       id='line1'
  //                       name='address.line1'
  //                       className='form-control form-control-sm shadow'
  //                       value={formData.address.line1}
  //                       onChange={handleChange}
  //                       required
  //                     />
  //                   </label>
  //                 </div>
  //                 <div className='mb-3'>
  //                   <label htmlFor='line2' className='form-label col-12'>
  //                     Address Line 2:
  //                     <input
  //                       type='text'
  //                       id='line2'
  //                       name='address.line2'
  //                       className='form-control form-control-sm shadow'
  //                       value={formData.address.line2}
  //                       onChange={handleChange}
  //                     />
  //                   </label>
  //                 </div>
  //                 <div className='mb-3'>
  //                   <label htmlFor='town_city' className='form-label col-12'>
  //                     Town/City:
  //                     <input
  //                       type='text'
  //                       id='town_city'
  //                       name='address.town_city'
  //                       className='form-control form-control-sm shadow'
  //                       value={formData.address.town_city}
  //                       onChange={handleChange}
  //                       required
  //                     />
  //                   </label>
  //                 </div>
  //                 <div className='mb-3'>
  //                   <label htmlFor='county' className='form-label col-12'>
  //                     County:
  //                     <input
  //                       type='text'
  //                       id='county'
  //                       name='address.county'
  //                       className='form-control form-control-sm shadow'
  //                       value={formData.address.county}
  //                       onChange={handleChange}
  //                       required
  //                     />
  //                   </label>
  //                 </div>
  //                 <div className='mb-3'>
  //                   <label htmlFor='eircode' className='form-label col-12'>
  //                     Eircode:
  //                     <input
  //                       type='text'
  //                       id='eircode'
  //                       name='address.eircode'
  //                       className='form-control form-control-sm shadow'
  //                       value={formData.address.eircode}
  //                       onChange={handleChange}
  //                       required
  //                     />
  //                   </label>
  //                 </div>
  //                 <button
  //                   type='submit'
  //                   className='btn btn-sm btn-primary w-100 shadow'
  //                 >
  //                   Register
  //                 </button>
  //                 {errors ? (
  //                   <div
  //                     className='alert alert-danger text-start mt-2'
  //                     role='alert'
  //                   >
  //                     {renderErrors(errors)}
  //                   </div>
  //                 ) : null}
  //               </form>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </>
  // );
};

export default RegisterComponent;
