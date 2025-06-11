import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import BackToApplicationsIcon from '../../GenericComponents/BackToApplicationsIcon';
import DeleteApplication from './DeleteApplication';
import DocumentsUpload from './DocumentsUpload';

import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import OffcanvasComponent from '../../GenericComponents/OffcanvasComponent';
import {
  fetchData,
  patchData,
} from '../../GenericFunctions/AxiosGenericFunctions';
import renderErrors, {
  formatDate,
} from '../../GenericFunctions/HelperGenericFunctions';
import RejectionForm from '../ApplicationDetailsParts/RejectionForm';
import RequiredDetailsPart from '../ApplicationDetailsParts/RequiredDetailsPart';
import SolicitorPart from '../ApplicationDetailsParts/SolicitorPart';

const ApplicationDetails = () => {
  const { id } = useParams();
  const token = Cookies.get('auth_token_agents');
  const [application, setApplication] = useState(null);
  const [advancement, setAdvancement] = useState(null);

  const [deleteAppId, setDeleteAppId] = useState('');
  const [refresh, setRefresh] = useState(false);

  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [comments, setComments] = useState(null);

  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchApplication = async () => {
      if (token) {
        const { access } = token;
        const endpoint = `/api/applications/agent_applications/${id}/`;
        try {
          const response = await fetchData(access, endpoint);
          setApplication(response.data);
        } catch (error) {
          console.error('Error fetching application details:', error);
        }
      }
    };

    fetchApplication();
  }, [token, id, refresh, comments]);

  useEffect(() => {
    const fetchAdvancementForApplication = async () => {
      if (token) {
        const { access } = token;
        const endpoint = `/api/loans/loans/by-application/${id}/`;
        try {
          const response = await fetchData(access, endpoint);
          if (response.status && response.status === 200) {
            setAdvancement(response.data);
          }
        } catch (error) {
          console.error('Error fetching advancement details:', error);
        }
      }
    };

    fetchAdvancementForApplication();
  }, [token, id, refresh]);

  if (!application) {
    return <LoadingComponent />;
  }

  const getStatusTheme = () => {
    if (application.is_rejected) return 'danger';
    if (application.approved) return 'success';
    return 'warning';
  };

  const getStatusIcon = (condition, isRejected = false) => {
    if (isRejected && condition) {
      return (
        <svg width='20' height='20' fill='#dc2626' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
            clipRule='evenodd'
          />
        </svg>
      );
    }
    if (condition) {
      return (
        <svg width='20' height='20' fill='#059669' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
            clipRule='evenodd'
          />
        </svg>
      );
    }
    return (
      <svg width='20' height='20' fill='#d97706' viewBox='0 0 20 20'>
        <path
          fillRule='evenodd'
          d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z'
          clipRule='evenodd'
        />
      </svg>
    );
  };

  const renderStatusCard = (label, value, condition, isRejected = false) => {
    const bgColor =
      isRejected && condition ? '#fef2f2' : condition ? '#f0fdf4' : '#fefbf3';

    const borderColor =
      isRejected && condition ? '#fecaca' : condition ? '#bbf7d0' : '#fed7aa';

    return (
      <div className='col-lg-3 col-md-4 col-sm-6 mb-3'>
        <div
          className='p-3 rounded-3 border h-100'
          style={{
            background: bgColor,
            border: `1px solid ${borderColor}`,
            minHeight: '100px',
          }}
        >
          <div className='d-flex align-items-center justify-content-between mb-2'>
            <span
              className='fw-semibold'
              style={{
                fontSize: '0.8rem',
                color: '#374151',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {label}
            </span>
            {getStatusIcon(condition, isRejected)}
          </div>
          <div
            className='fw-bold'
            style={{
              fontSize: '0.95rem',
              color:
                isRejected && condition
                  ? '#dc2626'
                  : condition
                  ? '#059669'
                  : '#d97706',
            }}
          >
            {value}
          </div>
        </div>
      </div>
    );
  };

  const handleApprove = () => {
    // Cancel other forms when approve is clicked
    setShowRejectionForm(false);
    setDeleteAppId('');
    setRejectionReason('');

    if (
      !application.loan_agreement_ready ||
      !application.undertaking_ready ||
      application.signed_documents.length === 0
    ) {
      const proceed = window.confirm(
        'This application has no signed documents, undertaking, or advancement agreement. Do you want to proceed with the approval?'
      );

      if (proceed) {
        navigate(`/approveApplication/${application.id}`);
      }
    } else {
      navigate(`/approveApplication/${application.id}`);
    }
  };

  const handleReject = () => {
    // Cancel other forms when reject is clicked
    setDeleteAppId('');
    setShowRejectionForm(true);
  };

  const handleDelete = () => {
    // Cancel other forms when delete is clicked
    setShowRejectionForm(false);
    setRejectionReason('');
    setDeleteAppId(id);
  };

  const handleRejectSubmit = async () => {
    const confirmReject = window.confirm(
      'Are you sure you want to reject this application?'
    );
    if (confirmReject) {
      try {
        const rejectData = {
          is_rejected: true,
          rejected_reason: rejectionReason,
        };
        const endpoint = `/api/applications/agent_applications/${id}/`;
        const response = await patchData(endpoint, rejectData);
        console.log('Application rejected:', response);
        setApplication((prev) => ({
          ...prev,
          is_rejected: true,
          rejected_reason: rejectionReason,
        }));
        setShowRejectionForm(false);
      } catch (error) {
        console.error('Error rejecting application:', error);
        setIsError(true);
        if (error.response && error.response.data) {
          setErrorMessage(renderErrors(error.response.data));
        } else {
          setErrorMessage(error.message);
        }
      }
    }
  };

  const handleRejectCancel = () => {
    setShowRejectionForm(false);
    setRejectionReason('');
  };

  const statusTheme = getStatusTheme();

  return (
    <div className='bg-light min-vh-100' style={{ padding: '24px' }}>
      <div className='container-fluid'>
        <BackToApplicationsIcon backUrl={-1} />

        {/* Modern Header */}
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
                statusTheme === 'success'
                  ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)'
                  : statusTheme === 'danger'
                  ? 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)'
                  : 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
              color: 'white',
            }}
          >
            <div className='row align-items-center'>
              <div className='col-lg-8'>
                <h2 className='mb-2 fw-bold' style={{ fontSize: '1.75rem' }}>
                  Application #{application.id}
                  <span className='ms-3 badge bg-white bg-opacity-20 px-3 py-2 rounded-pill'>
                    {application?.user?.country}
                  </span>
                </h2>

                {advancement && (
                  <Link
                    className='text-white text-decoration-none d-inline-flex align-items-center gap-2'
                    to={`/advancements/${advancement.id}`}
                    style={{ fontSize: '1rem' }}
                  >
                    <svg
                      width='16'
                      height='16'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Advancement #{advancement.id}
                  </Link>
                )}
              </div>

              <div className='col-lg-4 text-end'>
                <OffcanvasComponent
                  applicationId={application.id}
                  comments={comments}
                  setComments={setComments}
                />
              </div>
            </div>
          </div>

          {/* Status Alert */}
          {(application.is_rejected || application.approved) && (
            <div
              className='mx-4 mb-4 p-3 rounded-3 d-flex align-items-center gap-3'
              style={{
                backgroundColor: application.is_rejected
                  ? '#fef2f2'
                  : '#f0fdf4',
                border: `1px solid ${
                  application.is_rejected ? '#fecaca' : '#bbf7d0'
                }`,
                marginTop: '16px',
              }}
            >
              <div
                className='d-flex align-items-center justify-content-center rounded-2'
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: application.is_rejected
                    ? '#dc2626'
                    : '#059669',
                  color: 'white',
                }}
              >
                {application.is_rejected ? (
                  <svg
                    width='20'
                    height='20'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
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
                  style={{
                    color: application.is_rejected ? '#dc2626' : '#059669',
                  }}
                >
                  Application{' '}
                  {application.is_rejected ? 'Rejected' : 'Approved'}
                </h6>
                <p
                  className='mb-0'
                  style={{ fontSize: '0.875rem', color: '#6b7280' }}
                >
                  Options and editing are not available because application is{' '}
                  {application.is_rejected ? 'rejected' : 'approved'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Cards */}
        <div className='row g-4 mb-4'>
          <div className='col-lg-12'>
            <div
              className='bg-white rounded-4 p-4'
              style={{
                boxShadow:
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            >
              <h5 className='mb-4 fw-bold' style={{ color: '#111827' }}>
                Actions
              </h5>
              <div className='row g-3'>
                <div className='col-lg-4'>
                  <button
                    className='btn w-100 py-3 fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2'
                    style={{
                      background:
                        'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      fontSize: '0.875rem',
                    }}
                    onClick={handleApprove}
                    disabled={application.approved || application.is_rejected}
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
                    Approve for Advancement
                  </button>
                </div>

                <div className='col-lg-4'>
                  <button
                    className='btn w-100 py-3 fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2'
                    style={{
                      background:
                        'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: 'white',
                      border: 'none',
                      fontSize: '0.875rem',
                    }}
                    onClick={handleReject}
                    disabled={application.approved || application.is_rejected}
                  >
                    <svg
                      width='16'
                      height='16'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Reject Application
                  </button>
                </div>

                {user?.is_superuser && (
                  <div className='col-lg-4'>
                    <button
                      className='btn w-100 py-3 fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2'
                      style={{
                        background:
                          'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: 'white',
                        border: 'none',
                        fontSize: '0.875rem',
                      }}
                      onClick={handleDelete}
                      disabled={application.approved || application.is_rejected}
                    >
                      <svg
                        width='16'
                        height='16'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z'
                          clipRule='evenodd'
                        />
                        <path
                          fillRule='evenodd'
                          d='M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V7a1 1 0 00-1-1z'
                          clipRule='evenodd'
                        />
                      </svg>
                      Delete Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Forms positioned right after action buttons */}
        {showRejectionForm && (
          <div className='mb-4'>
            <RejectionForm
              rejectionReason={rejectionReason}
              setRejectionReason={setRejectionReason}
              handleRejectCancel={handleRejectCancel}
              handleRejectSubmit={handleRejectSubmit}
            />
          </div>
        )}

        {deleteAppId !== '' && (
          <div className='mb-4'>
            <DeleteApplication
              applicationId={deleteAppId}
              setDeleteAppId={setDeleteAppId}
            />
          </div>
        )}

        {/* Status Overview */}
        <div
          className='bg-white rounded-4 p-4 mb-4'
          style={{
            boxShadow:
              '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          }}
        >
          <h5 className='mb-4 fw-bold' style={{ color: '#111827' }}>
            Application Status
          </h5>
          <div className='row'>
            {renderStatusCard(
              'Date Submitted',
              formatDate(application.date_submitted),
              true
            )}
            {renderStatusCard(
              'Adv Agreement Ready',
              application.loan_agreement_ready ? 'Yes' : 'No',
              application.loan_agreement_ready
            )}
            {renderStatusCard(
              'Documents Uploaded',
              application.documents.length > 0 ||
                application.signed_documents.length > 0
                ? 'Yes'
                : 'No',
              application.documents.length > 0 ||
                application.signed_documents.length > 0
            )}
            {renderStatusCard(
              'Undertaking Ready',
              application.undertaking_ready ? 'Yes' : 'No',
              application.undertaking_ready
            )}

            {/* Approved states */}
            {application.approved &&
              application.loan &&
              application.loan.needs_committee_approval === false &&
              renderStatusCard('Approved', 'Yes', application.approved)}

            {application.approved &&
              application.loan &&
              application.loan.needs_committee_approval === true &&
              application.loan.is_committee_approved === true &&
              renderStatusCard(
                'Approved',
                'Approved by committee',
                application.approved
              )}

            {/* Rejected states */}
            {application.is_rejected &&
              renderStatusCard(
                'Rejected',
                'Yes',
                application.is_rejected,
                true
              )}

            {application.approved &&
              application.loan &&
              application.loan.needs_committee_approval === true &&
              application.loan.is_committee_approved === false &&
              renderStatusCard('Rejected', 'Rejected by committee', true, true)}

            {/* Awaiting decision states */}
            {application.is_rejected === false &&
              application.approved === false &&
              renderStatusCard('Status', 'Awaiting decision...', false)}

            {application.is_rejected === false &&
              application.approved === true &&
              application.loan &&
              application.loan.needs_committee_approval === true &&
              application.loan.is_committee_approved === null &&
              renderStatusCard(
                'Status',
                'Awaiting committee decision...',
                false
              )}
          </div>

          {/* Rejection Reason */}
          {application.is_rejected && (
            <div
              className='mt-4 p-4 rounded-3'
              style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
              }}
            >
              <h6 className='fw-bold mb-2' style={{ color: '#dc2626' }}>
                Reason for Rejection
              </h6>
              <p className='mb-0' style={{ color: '#7f1d1d' }}>
                {application.rejected_reason}
              </p>
            </div>
          )}
        </div>

        {/* Component Sections */}
        <SolicitorPart
          application_id={application.id}
          solicitor_id={application.solicitor}
          refresh={refresh}
          setRefresh={setRefresh}
        />

        <RequiredDetailsPart
          application={application}
          setApplication={setApplication}
          id={id}
          refresh={refresh}
          setRefresh={setRefresh}
          user={user}
        />

        <DocumentsUpload
          applicationId={id}
          refresh={refresh}
          setRefresh={setRefresh}
          user={user}
        />

        {/* Modals and Forms */}
        {deleteAppId !== '' && (
          <DeleteApplication
            applicationId={deleteAppId}
            setDeleteAppId={setDeleteAppId}
          />
        )}

        {showRejectionForm && (
          <RejectionForm
            rejectionReason={rejectionReason}
            setRejectionReason={setRejectionReason}
            handleRejectCancel={handleRejectCancel}
            handleRejectSubmit={handleRejectSubmit}
          />
        )}

        {/* Error Message */}
        {errorMessage && (
          <div
            className={`p-4 rounded-3 mt-4 d-flex align-items-center gap-3`}
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
            <div style={{ color: isError ? '#dc2626' : '#059669' }}>
              {renderErrors(errorMessage)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetails;
