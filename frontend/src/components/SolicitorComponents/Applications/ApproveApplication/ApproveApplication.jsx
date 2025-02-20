import  { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  fetchData,
  postData,
} from '../../../GenericFunctions/AxiosGenericFunctions';
import ApplicationSummaryCard from './ApplicationSummaryCard';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';
import BackToApplicationsIcon from '../../../GenericComponents/BackToApplicationsIcon';

const ApproveApplication = () => {
  const { applicationId } = useParams();
  const token = Cookies.get('auth_token_agents');
  const [application, setApplication] = useState(null);
  const [issues, setIssues] = useState([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [approvingLoading, setApprovingLoanding] = useState(false);

  const [loanDetails, setLoanDetails] = useState({
    amount_agreed: 0,
    fee_agreed: 0,
    term_agreed: 0,
    approved_date: new Date().toISOString().split('T')[0], // Format today's date as "YYYY-MM-DD"
    application: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      if (applicationId) {
        const { access } = token;
        const endpoint = `/api/applications/agent_applications/${applicationId}/`;
        try {
          const response = await fetchData(access, endpoint);
          setApplication(response.data);
        } catch (error) {
          console.error('Error fetching application details:', error);
        }
      }
    };
    fetchApplication();
  }, [token, applicationId]);

  useEffect(() => {
    if (application) {
      setLoanDetails({
        amount_agreed: application.amount,
        fee_agreed: '0',
        term_agreed: application.term,
        approved_date: new Date().toISOString().split('T')[0], // Format today's date as "YYYY-MM-DD"
        application: application.id,
      });
    }
  }, [application]);

  useEffect(() => {
    if (loanDetails && (loanDetails.amount_agreed || loanDetails.term_agreed)) {
      let yearMultiplier = Math.ceil(loanDetails.term_agreed / 12);
      const calculatedFee =
        Math.round(loanDetails.amount_agreed * 0.15 * yearMultiplier * 100) /
        100;

      setLoanDetails((prevLoanDetails) => ({
        ...prevLoanDetails,
        fee_agreed: calculatedFee,
      }));

      const newIssues = [];
      if (!application.loan_agreement_ready) {
        newIssues.push('Loan agreement is not ready.');
      }
      if (!application.undertaking_ready) {
        newIssues.push('Undertaking is not ready.');
      }
      if (application.signed_documents.length === 0) {
        newIssues.push('No signed documents available.');
      }
      if (calculatedFee > loanDetails.amount_agreed) {
        newIssues.push(
          'Check the amounts. 60% of the total value after expenses is bigger than the requested advancement amount.'
        );
      }
      setIssues(newIssues);
    }
  }, [loanDetails.amount_agreed, loanDetails.term_agreed, application, loanDetails]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoanDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (issues.length > 0) {
      const confirm = window.confirm(
        `Are you sure?\n\nThere are still unresolved issues:\n\n${issues.join(
          '\n'
        )}\n\nThis action is not reversible!`
      );
      if (confirm) {
        approveApplication();
      }
    } else {
      approveApplication();
    }
  };

  const approveApplication = async () => {
    // console.log('Approving application:');
    // console.log(loanDetails);

    setIsError(false);
    setErrorMessage('');

    try {
      setApprovingLoanding(true);
      const endpoint = `/api/loans/loans/`;
      const res = await postData(token, endpoint, loanDetails);
      if (res.status === 201) {
        console.log('Application Approved:');
        setErrorMessage('Application Approved');
        // Delay execution for 2 seconds
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setApprovingLoanding(false);
        navigate(`/advancements/${res.data.id}/`);
      } else {
        setIsError(true);
        setErrorMessage(renderErrors(res.data));
        setApprovingLoanding(false);
      }
    } catch (error) {
      setIsError(true);
      if (error.response && error.response.data) {
        setErrorMessage(renderErrors(error.response.data));
      } else {
        setErrorMessage(error.message);
      }
      setApprovingLoanding(false);
      console.error('Error approving application:', error);
    }
  };

  return (
    <>
      <BackToApplicationsIcon backUrl={-1} />
      {loanDetails && loanDetails.application !== 0 ? (
        <div className='row'>
          <div className='col-8'>
            <div className='card bg-dark-subtle shadow'>
              <div className=' card-header '>
                <div className=' card-title'>
                  <h4 className=' text-info-emphasis'>
                    Approve application - {loanDetails.application}
                  </h4>
                </div>
              </div>
              <div className='card-body'>
                <form onSubmit={formSubmitHandler}>
                  <div className='mb-3'>
                    <label htmlFor='amountAgreed' className='form-label'>
                      Amount Agreed:
                    </label>
                    <input
                      type='number'
                      min='0'
                      step='0.01'
                      className='form-control shadow'
                      id='amountAgreed'
                      name='amount_agreed'
                      value={loanDetails.amount_agreed}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='feeAgreed' className='form-label'>
                      Fee Agreed:
                    </label>
                    <input
                      type='number'
                      min='0'
                      step='0.01'
                      className='form-control shadow'
                      id='feeAgreed'
                      name='fee_agreed'
                      value={loanDetails.fee_agreed}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='termAgreed' className='form-label'>
                      Term Agreed (months):
                    </label>
                    <input
                      type='number'
                      min='0'
                      className='form-control shadow'
                      id='termAgreed'
                      name='term_agreed'
                      value={loanDetails.term_agreed}
                      onChange={handleChange}
                    />
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='approvedDate' className='form-label'>
                      Approved Date:
                    </label>
                    <input
                      type='text'
                      className='form-control shadow'
                      id='approvedDate'
                      name='approved_date'
                      value={loanDetails.approved_date}
                      readOnly
                    />
                  </div>

                  <div className='row mx-0 mt-4'>
                    <button
                      type='submit'
                      className=' btn btn-outline-danger shadow'
                      disabled={approvingLoading}
                    >
                      {approvingLoading ? 'Wait ...' : 'Approve'}
                    </button>
                    {errorMessage && (
                      <div
                        className={`alert  text-center ${
                          isError ? 'alert-danger' : 'alert-success'
                        }`}
                        role='alert'
                      >
                        {errorMessage}
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className='col-4'>
            <ApplicationSummaryCard
              application={application}
              issues={issues}
              setIssues={setIssues}
            />
          </div>
        </div>
      ) : (
        <LoadingComponent />
      )}
    </>
  );
};

export default ApproveApplication;
