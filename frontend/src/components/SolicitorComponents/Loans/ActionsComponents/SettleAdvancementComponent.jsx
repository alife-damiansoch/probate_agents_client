import  { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  fetchData,
  patchData,
} from '../../../GenericFunctions/AxiosGenericFunctions';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import Advancement from '../Advancement';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';
import ConfirmSettleAdvance from './ConfirmSettleAdvance';
import BackToApplicationsIcon from '../../../GenericComponents/BackToApplicationsIcon';

const SettleAdvancementComponent = () => {
  const token = Cookies.get('auth_token_agents');
  const { advancementId } = useParams();
  const [advancement, setAdvancement] = useState(null);
  const [errors, setErrors] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      if (token && advancementId) {
        setIsLoading(true);
        const endpoint = `/api/loans/loans/${advancementId}/`;
        const response = await fetchData(token, endpoint);

        // If the response is successful, set the applications state
        if (response.status === 200) {
          // console.log(response.data);
          setAdvancement(response.data);
          setIsLoading(false);
        } else {
          setErrors(response.data); // Setting error messages if any
          console.log(response.data);
          setIsLoading(false);
        }
      }
    };

    fetchApplications();

     
  }, [token, advancementId]); // Dependencies: token, refresh (re-fetch when these change)

  const handleSettleClick = () => {
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    // Logic to settle the advance

    const dataForUpdate = {
      is_settled: true,
      settled_date: new Date().toISOString().split('T')[0],
    };

    setErrors('');
    setIsError(false);

    try {
      const endpoint = `/api/loans/loans/${advancement.id}/`;
      const response = await patchData(endpoint, dataForUpdate);
      // console.log(response);
      if (response.status === 200) {
        setErrors({ Advancement: 'settled' });
        setIsError(false);
        setShowConfirm(false);
        navigate(`/advancements/${advancement.id}`);
      } else {
        setErrors(response.data);
      }
    } catch (error) {
      console.error('Error updating Advancement:', error);
      setIsError(true);
      if (error.response && error.response.data) {
        setErrors(error.response.data);
        console.log(error.response.data);
      } else {
        setErrors(error.message);
        console.log(error.message);
      }
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <>
      <BackToApplicationsIcon backUrl={-1} />
      {advancement && advancement.current_balance > 0 ? (
        <div className='alert alert-danger'>
          <div className={`alert text-center text-danger`} role='alert'>
            {renderErrors({
              Error: 'Current balance is not 0. Advancement can not be settled',
            })}
            {/* Display any errors that occurred during the fetch or processing */}
          </div>
        </div>
      ) : (
        <>
          {/* Confirm dialog */}
          <div className='row my-5'>
            {!showConfirm && (
              <div className='col-8 mx-auto'>
                <button
                  onClick={handleSettleClick}
                  className='btn btn-warning'
                  style={{ width: '100%' }}
                >
                  Settle Advance
                </button>
              </div>
            )}

            {showConfirm && (
              <ConfirmSettleAdvance
                onConfirm={handleConfirm}
                onCancel={handleCancel}
              />
            )}
          </div>
        </>
      )}

      {advancement && <Advancement loan={advancement} />}
      {errors && (
        <div
          className={`alert text-center ${
            isError ? 'alert-warning text-danger' : 'alert-success text-success'
          }`}
          role='alert'
        >
          {renderErrors(errors)}
        </div>
      )}
    </>
  );
};

export default SettleAdvancementComponent;
