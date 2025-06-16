import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { clearAuthError, signup } from '../../store/authSlice';
import renderErrors from '../GenericFunctions/HelperGenericFunctions';

const LoginComponent = () => {
  const dispatch = useDispatch();
  const authError = useSelector((state) => state.auth.error);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Clear authError when the component is rendered
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const resultAction = await dispatch(signup({ email, password }));

    if (signup.fulfilled.match(resultAction)) {
      // Wait a moment for cookies to be set
      setTimeout(() => {
        // Verify cookie exists before navigating
        const authToken = Cookies.get('auth_token_agents');
        if (authToken) {
          navigate('/applications_active');
        } else {
          console.error('Auth token not found in cookies');
          // Retry or show error
        }
        setIsLoading(false);
      }, 100); // Small delay to ensure cookies are set
    } else if (signup.rejected.match(resultAction)) {
      console.error('Login error:', resultAction.payload);
      setIsLoading(false);
    }
  };

  return (
    <div className='container my-5'>
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <div className='card shadow'>
            <div className='card-body'>
              <h3 className='card-title text-center'>Login</h3>
              <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                  <label htmlFor='email' className='form-label   col-12'>
                    Email:
                    <input
                      type='email'
                      id='email'
                      className='form-control shadow'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <div className='mb-3'>
                  <label htmlFor='password' className='form-label col-12'>
                    Password:
                    <input
                      type='password'
                      id='password'
                      className='form-control shadow'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <button
                  type='submit'
                  className='btn btn-primary w-100 shadow'
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div
                      className='spinner-border text-warning'
                      role='status'
                    ></div>
                  ) : (
                    'Login'
                  )}
                </button>

                {authError ? (
                  <div
                    className='alert alert-danger text-center mt-2'
                    role='alert'
                  >
                    {renderErrors(authError)}
                  </div>
                ) : null}
              </form>
              <div className='text-center mt-3'>
                <Link className=' link-info' to='/register'>
                  Don&#39;t have an account? Register here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
