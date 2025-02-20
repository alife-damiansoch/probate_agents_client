import { Fragment, useEffect } from 'react';
import LoadingComponent from '../../GenericComponents/LoadingComponent';

import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../../../store/userSlice';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';

import Advancement from './Advancement';

const Loans = ({
  allLoans,
  errors,
  pageTitle,
  totalItems,
  isFiltered,
  handleClearAllFilters,
}) => {
  const token = Cookies.get('auth_token_agents');

  // const [errors, setErrors] = useState('');
  const dispatch = useDispatch();

  // Fetch user data when the component mounts or when the token changes
  useEffect(() => {
    dispatch(fetchUser());
  }, [token, dispatch]);

  return (
    <div className='card'>
      <div className='card-header text-center'>
        <h1
          className='text-center my-3'
          dangerouslySetInnerHTML={{
            __html: `${pageTitle} <br />(${totalItems})`,
          }}
        ></h1>
        {isFiltered && (
          <button
            className='btn btn-link text-info text-decoration-underline p-0'
            onClick={handleClearAllFilters} // Call your function to clear filters
          >
            Clear all filters
          </button>
        )}
      </div>
      <div className=' card-body'>
        <div className=' card-footer'></div>
        {allLoans ? (
          allLoans.map((loan) => (
            <Fragment key={loan.id}>
              <Advancement loan={loan} />
            </Fragment>
          ))
        ) : (
          <LoadingComponent /> // Display a loading component if loans are still being fetched
        )}

        {errors && (
          <div className='alert alert-danger'>
            <div className={`alert text-center text-danger`} role='alert'>
              {renderErrors(errors)}
              {/* Display any errors that occurred during the fetch or processing */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loans;
