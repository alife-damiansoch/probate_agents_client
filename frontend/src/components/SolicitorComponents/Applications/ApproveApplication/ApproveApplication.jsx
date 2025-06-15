import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BackToApplicationsIcon from '../../../GenericComponents/BackToApplicationsIcon';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import {
  fetchData,
  postData,
} from '../../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';
import ApplicationSummaryCard from './ApplicationSummaryCard';

const ApproveApplication = () => {
  const { applicationId } = useParams();
  const token = Cookies.get('auth_token_agents');
  const [application, setApplication] = useState(null);
  const [issues, setIssues] = useState([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [approvingLoading, setApprovingLoading] = useState(false);

  const [loanDetails, setLoanDetails] = useState({
    amount_agreed: 0,
    fee_agreed: 0,
    term_agreed: 0,
    approved_date: new Date().toISOString().split('T')[0],
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
        approved_date: new Date().toISOString().split('T')[0],
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

      if (calculatedFee !== loanDetails.fee_agreed) {
        setLoanDetails((prevLoanDetails) => ({
          ...prevLoanDetails,
          fee_agreed: calculatedFee,
        }));
      }

      const newIssues = [];
      if (application && !application.loan_agreement_ready) {
        newIssues.push('Loan agreement is not ready.');
      }
      if (application && !application.undertaking_ready) {
        newIssues.push('Undertaking is not ready.');
      }
      if (application && application.signed_documents.length === 0) {
        newIssues.push('No signed documents available.');
      }
      if (calculatedFee > loanDetails.amount_agreed) {
        newIssues.push(
          'Check the amounts. 60% of the total value after expenses is bigger than the requested advancement amount.'
        );
      }

      if (JSON.stringify(newIssues) !== JSON.stringify(issues)) {
        setIssues(newIssues);
      }
    }
  }, [loanDetails.amount_agreed, loanDetails.term_agreed, application]);

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
    setIsError(false);
    setErrorMessage('');

    try {
      setApprovingLoading(true);
      const endpoint = `/api/loans/loans/`;
      const res = await postData(token, endpoint, loanDetails);
      if (res.status === 201) {
        console.log('Application Approved:');
        setErrorMessage('Application Approved');
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setApprovingLoading(false);
        navigate(`/advancements/${res.data.id}/`);
      } else {
        setIsError(true);
        setErrorMessage(renderErrors(res.data));
        setApprovingLoading(false);
      }
    } catch (error) {
      setIsError(true);
      if (error.response && error.response.data) {
        setErrorMessage(renderErrors(error.response.data));
      } else {
        setErrorMessage(error.message);
      }
      setApprovingLoading(false);
      console.error('Error approving application:', error);
    }
  };

  // Updated formatCurrency function to use application.currency_sign
  const formatCurrency = (amount) => {
    if (!application || !application.currency_sign) {
      return `$${Number(amount).toFixed(2)}`;
    }
    return `${application.currency_sign}${Number(amount).toFixed(2)}`;
  };

  return (
    <div className='bg-light min-vh-100' style={{ padding: '24px' }}>
      <div className='container-fluid'>
        <BackToApplicationsIcon backUrl={-1} />

        {loanDetails && loanDetails.application !== 0 ? (
          <>
            {/* Modern Header - matching ApplicationDetails style */}
            <div
              className='bg-white rounded-4 overflow-hidden mb-4'
              style={{
                boxShadow:
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            >
              <div
                className='px-4 py-4'
                style={{
                  background:
                    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                }}
              >
                <div className='row align-items-center'>
                  <div className='col-lg-8'>
                    <h2
                      className='mb-2 fw-bold'
                      style={{ fontSize: '1.75rem' }}
                    >
                      Approve Application #{loanDetails.application}
                      <span className='ms-3 badge bg-white bg-opacity-20 px-3 py-2 rounded-pill'>
                        {application?.user?.country}
                      </span>
                    </h2>
                    <p className='mb-0 opacity-75' style={{ fontSize: '1rem' }}>
                      Review and finalize advancement details
                    </p>
                  </div>
                  <div className='col-lg-4 text-end'>
                    {issues.length>0 ? (
                        <div
                            className='d-flex align-items-center justify-content-end gap-2'
                            style={{fontSize: '0.875rem'}}
                        >

                          <svg
                              width='16'
                              height='16'
                              fill='#dc2626'
                              viewBox='0 0 20 20'
                          >
                            <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                                clipRule='evenodd'
                            />
                          </svg>

                          Not ready for Approval
                        </div>
                    ) : (
                        <div
                            className='d-flex align-items-center justify-content-end gap-2'
                            style={{fontSize: '0.875rem'}}
                        >

                          <svg
                              width='16'
                              height='16'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                          >
                            <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                            />
                          </svg>

                          Ready for Approval
                        </div>
                    )}

                  </div>
                </div>
              </div>
            </div>

            <div className='row g-4'>
              {/* Main Form */}
              <div className='col-lg-8'>
                <div
                    className='bg-white rounded-4 p-4'
                    style={{
                      boxShadow:
                          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    }}
                >
                  <h5 className='mb-4 fw-bold' style={{color: '#111827'}}>
                    Advancement Details
                  </h5>

                  <form onSubmit={formSubmitHandler}>
                    <div className='row g-4'>
                      {/* Amount Agreed */}
                      <div className='col-md-6'>
                        <label
                            htmlFor='amountAgreed'
                          className='form-label fw-semibold mb-2'
                          style={{ color: '#374151', fontSize: '0.875rem' }}
                        >
                          Amount Agreed
                        </label>
                        <div className='position-relative'>
                          <div
                            className='position-absolute start-0 top-50 translate-middle-y ms-3'
                            style={{ color: '#9ca3af', zIndex: 10 }}
                          >
                            {application?.currency_sign || '$'}
                          </div>
                          <input
                            type='number'
                            min='0'
                            step='0.01'
                            className='form-control ps-5 py-3 border-0 rounded-3'
                            style={{
                              backgroundColor: '#f9fafb',
                              border: '1px solid #e5e7eb',
                              fontSize: '0.875rem',
                            }}
                            id='amountAgreed'
                            name='amount_agreed'
                            value={loanDetails.amount_agreed}
                            onChange={handleChange}
                            placeholder='0.00'
                            required
                            onFocus={(e) => {
                              e.target.style.borderColor = '#10b981';
                              e.target.style.boxShadow =
                                '0 0 0 3px rgba(16, 185, 129, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#e5e7eb';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                        <small className='text-muted mt-1 d-block'>
                          Formatted:{' '}
                          {formatCurrency(loanDetails.amount_agreed || 0)}
                        </small>
                      </div>

                      {/* Fee Agreed */}
                      <div className='col-md-6'>
                        <label
                          htmlFor='feeAgreed'
                          className='form-label fw-semibold mb-2'
                          style={{ color: '#374151', fontSize: '0.875rem' }}
                        >
                          Fee Agreed
                        </label>
                        <div className='position-relative'>
                          <div
                            className='position-absolute start-0 top-50 translate-middle-y ms-3'
                            style={{ color: '#9ca3af', zIndex: 10 }}
                          >
                            {application?.currency_sign || '$'}
                          </div>
                          <input
                            type='number'
                            min='0'
                            step='0.01'
                            className='form-control ps-5 py-3 border-0 rounded-3'
                            style={{
                              backgroundColor: '#f9fafb',
                              border: '1px solid #e5e7eb',
                              fontSize: '0.875rem',
                            }}
                            id='feeAgreed'
                            name='fee_agreed'
                            value={loanDetails.fee_agreed}
                            onChange={handleChange}
                            placeholder='0.00'
                            required
                            onFocus={(e) => {
                              e.target.style.borderColor = '#10b981';
                              e.target.style.boxShadow =
                                '0 0 0 3px rgba(16, 185, 129, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#e5e7eb';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                        <small className='text-muted mt-1 d-block'>
                          Formatted:{' '}
                          {formatCurrency(loanDetails.fee_agreed || 0)}
                        </small>
                      </div>

                      {/* Term Agreed */}
                      <div className='col-md-6'>
                        <label
                          htmlFor='termAgreed'
                          className='form-label fw-semibold mb-2'
                          style={{ color: '#374151', fontSize: '0.875rem' }}
                        >
                          Term Agreed (months)
                        </label>
                        <div className='position-relative'>
                          <div
                            className='position-absolute start-0 top-50 translate-middle-y ms-3'
                            style={{ color: '#9ca3af', zIndex: 10 }}
                          >
                            <svg
                              width='16'
                              height='16'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </div>
                          <input
                            type='number'
                            min='0'
                            className='form-control ps-5 py-3 border-0 rounded-3'
                            style={{
                              backgroundColor: '#f9fafb',
                              border: '1px solid #e5e7eb',
                              fontSize: '0.875rem',
                            }}
                            id='termAgreed'
                            name='term_agreed'
                            value={loanDetails.term_agreed}
                            onChange={handleChange}
                            placeholder='12'
                            onFocus={(e) => {
                              e.target.style.borderColor = '#10b981';
                              e.target.style.boxShadow =
                                '0 0 0 3px rgba(16, 185, 129, 0.1)';
                            }}
                            onBlur={(e) => {
                              e.target.style.borderColor = '#e5e7eb';
                              e.target.style.boxShadow = 'none';
                            }}
                          />
                        </div>
                        <small className='text-muted mt-1 d-block'>
                          Duration:{' '}
                          {Math.round(
                            ((loanDetails.term_agreed || 0) / 12) * 10
                          ) / 10}{' '}
                          years
                        </small>
                      </div>

                      {/* Approved Date */}
                      <div className='col-md-6'>
                        <label
                          htmlFor='approvedDate'
                          className='form-label fw-semibold mb-2'
                          style={{ color: '#374151', fontSize: '0.875rem' }}
                        >
                          Approved Date
                        </label>
                        <div className='position-relative'>
                          <div
                            className='position-absolute start-0 top-50 translate-middle-y ms-3'
                            style={{ color: '#9ca3af', zIndex: 10 }}
                          >
                            <svg
                              width='16'
                              height='16'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </div>
                          <input
                            type='text'
                            className='form-control ps-5 py-3 border-0 rounded-3'
                            style={{
                              backgroundColor: '#f3f4f6',
                              border: '1px solid #d1d5db',
                              fontSize: '0.875rem',
                              cursor: 'not-allowed',
                            }}
                            id='approvedDate'
                            name='approved_date'
                            value={loanDetails.approved_date}
                            readOnly
                          />
                        </div>
                        <small className='text-muted mt-1 d-block'>
                          Today's date (read-only)
                        </small>
                      </div>
                    </div>

                    {/* Submit Section - matching ApplicationDetails button style */}
                    <div className='mt-5 pt-4 border-top'>
                      <div className='d-flex align-items-center justify-content-between'>
                        <div>
                          <h6
                            className='fw-bold mb-1'
                            style={{ color: '#111827' }}
                          >
                            Ready to approve?
                          </h6>
                          <p
                            className='mb-0 text-muted'
                            style={{ fontSize: '0.875rem' }}
                          >
                            {issues.length > 0
                              ? `${issues.length} issue(s) detected - review summary panel`
                              : 'All requirements met - ready for approval'}
                          </p>
                        </div>

                        <button
                          type='submit'
                          className='btn px-5 py-3 fw-semibold rounded-3 d-flex align-items-center gap-2'
                          style={{
                            background: approvingLoading
                              ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                              : issues.length > 0
                              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                              : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: 'white',
                            border: 'none',
                            fontSize: '0.875rem',
                            minWidth: '180px',
                          }}
                          disabled={approvingLoading}
                        >
                          {approvingLoading ? (
                            <>
                              <div
                                className='spinner-border spinner-border-sm'
                                role='status'
                                style={{ width: '16px', height: '16px' }}
                              >
                                <span className='visually-hidden'>
                                  Loading...
                                </span>
                              </div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <svg
                                width='16'
                                height='16'
                                fill='currentColor'
                                viewBox='0 0 20 20'
                              >
                                <path
                                  fillRule='evenodd'
                                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                  clipRule='evenodd'
                                />
                              </svg>
                              {issues.length > 0
                                ? 'Approve with Issues'
                                : 'Approve Application'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Summary Panel */}
              <div className='col-lg-4'>
                <ApplicationSummaryCard
                  application={application}
                  issues={issues}
                  setIssues={setIssues}
                />
              </div>
            </div>

            {/* Status Message - matching ApplicationDetails error style */}
            {errorMessage && (
              <div
                className={`mt-4 p-4 rounded-3 d-flex align-items-center gap-3`}
                style={{
                  backgroundColor: isError ? '#fef2f2' : '#f0fdf4',
                  border: `1px solid ${isError ? '#fecaca' : '#bbf7d0'}`,
                }}
              >
                <div
                  className='d-flex align-items-center justify-content-center rounded-2'
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: isError ? '#dc2626' : '#059669',
                    color: 'white',
                  }}
                >
                  {isError ? (
                    <svg
                      width='20'
                      height='20'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                  ) : (
                    <svg
                      width='20'
                      height='20'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clipRule='evenodd'
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <h6
                    className='mb-1 fw-bold'
                    style={{ color: isError ? '#dc2626' : '#059669' }}
                  >
                    {isError ? 'Approval Failed' : 'Success!'}
                  </h6>
                  <div style={{ color: isError ? '#dc2626' : '#059669' }}>
                    {errorMessage}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div
            className='d-flex justify-content-center align-items-center'
            style={{ minHeight: '400px' }}
          >
            <LoadingComponent />
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveApplication;
