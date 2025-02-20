import { useEffect } from 'react';
import Application from './Application';
import LoadingComponent from '../../GenericComponents/LoadingComponent';

import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../../../store/userSlice';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';

const Applications = ({
  applicationsAll,

  errors,

  setRefresh,
  pageTitle,
  totalItems,

  isFiltered,
  handleClearAllFilters,
}) => {
  const token = Cookies.get('auth_token_agents');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser); // Fetch user data
  }, [token, dispatch]);

  return (
    <div className='card'>
      <div className=' card-header'>
        <div className='text-center my-3'>
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
      </div>
      <div className=' card-body'>
        {applicationsAll ? (
          applicationsAll.map((application) => (
            <Application
              key={application.id}
              application={application}
              onDelete={() => setRefresh((prev) => !prev)} // Refresh applications on delete
            />
          ))
        ) : (
          <LoadingComponent />
        )}
      </div>

      {errors && (
        <div className='alert alert-danger'>
          <div className='alert text-center text-danger' role='alert'>
            {renderErrors(errors)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
