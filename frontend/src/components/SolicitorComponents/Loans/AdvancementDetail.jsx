import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import AssignedBadge from '../../GenericComponents/AssignedBadge';
import BackToApplicationsIcon from '../../GenericComponents/BackToApplicationsIcon';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import OffcanvasComponent from '../../GenericComponents/OffcanvasComponent';
import {
  fetchData,
  patchData,
} from '../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';
import ActionsPart from './AdvancementsDetailsParts/ActionsPart';
import ActualAdvancementDetailPart from './AdvancementsDetailsParts/ActualAdvancementDetailPart';
import ApplicationDerailsReadOnlyPart from './AdvancementsDetailsParts/ApplicationDerailsReadOnlyPart';
import PepperApprovalComponent from './AdvancementsDetailsParts/PepperApprovalComponent';
import CommitteeApproveReject from './CommitteeComponets/CommitteeApproveReject';

const AdvancementDetail = () => {
  const [advancement, setAdvancement] = useState(null);
  const [application, setApplication] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [refresh, setRefresh] = useState(true); // this is only to trigger refresh after the update
  const [comments, setComments] = useState(null);
  const [assignedSolicitorId, setAssignedSolicitorId] = useState(null);
  const [assignedSolicitor, setAssingenSolicitor] = useState(null);
  const [payOutReferenceNumber, setPayOutReferenceNumber] = useState('');
  const [showReferenceNumberPart, setShowReferenceNumberPart] = useState(false);

  const token = Cookies.get('auth_token_agents');
  const { id } = useParams();
  const user = useSelector((state) => state.user.user);

  console.log('ADVANCEMENT', advancement);

  useEffect(() => {
    const fetchAdvancementDetail = async () => {
      if (token) {
        const { access } = token;
        const endpoint = `/api/loans/loans/${id}/`;
        try {
          const response = await fetchData(access, endpoint);
          setAdvancement(response.data);
          //   console.log(response.data);
        } catch (error) {
          console.error('Error fetching advancement details:', error);
        }
      }
    };

    fetchAdvancementDetail();
  }, [token, id, refresh]);

  useEffect(() => {
    const fetchApplication = async () => {
      if (token) {
        const { access } = token;
        const endpoint = `/api/applications/agent_applications/${advancement.application}/`;
        try {
          const response = await fetchData(access, endpoint);

          console.log('Response from application fetch:', response);

          if (response.status === 200) {
            setApplication(response.data);
            if (response.data.solicitor) {
              setAssignedSolicitorId(response.data.solicitor);
            } else {
              setAssignedSolicitorId(null);
            }
          } else {
            console.error('Error fetching application details:', response);
          }

          //   console.log(response.data);
        } catch (error) {
          console.error('Error fetching application details:', error);
        }
      }
    };
    if (advancement) {
      if (advancement.application) {
        fetchApplication();
      }
    }
  }, [advancement, id, token]);

  useEffect(() => {
    const fetchSolicitor = async () => {
      if (token && assignedSolicitorId) {
        const { access } = token;
        const endpoint = `/api/applications/solicitors/${assignedSolicitorId}/`;
        try {
          const response = await fetchData(access, endpoint);
          // console.log(response);

          if (response.status === 200) {
            setAssingenSolicitor(response.data);
          } else {
            setAssingenSolicitor(null);
            console.error('Error fetching solicitor details:', response);
          }

          //   console.log(response.data);
        } catch (error) {
          console.error('Error fetching solicitor details:', error);
        }
      }
    };

    fetchSolicitor();
  }, [assignedSolicitorId, token]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdvancement((prevAdvancement) => ({
      ...prevAdvancement,
      [name]: value,
    }));
  };

  const handleSaveClick = async () => {
    const dataForUpdate = {
      amount_agreed: advancement.amount_agreed,
      fee_agreed: advancement.fee_agreed,
      term_agreed: advancement.term_agreed,
    };

    setErrorMessage('');
    setIsError(false);

    try {
      const endpoint = `/api/loans/loans/${advancement.id}/`;
      const response = await patchData(endpoint, dataForUpdate);
      console.log(response);
      setErrorMessage({ Advancement: 'updated' });
      setIsError(false);
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error updating Advancement:', error);
      setIsError(true);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
        console.log(error.response.data);
      } else {
        setErrorMessage(error.message);
        console.log(error.message);
      }
    }
    setIsEditing(false);
  };

  // handler for marking advancement is paid out
  const markAdvancementPaidOutHandler = async () => {
    const confirm = window.confirm(
      `Confirm that Advancement id: ${advancement.id} was paid out.\nThis action cannot be undone!`
    );
    if (confirm) {
      console.log(`Saving advancement ${advancement.id} as paid out`);
      const dataForUpdate = {
        is_paid_out: true,
        pay_out_reference_number: payOutReferenceNumber,
      };

      setErrorMessage('');
      setIsError(false);

      try {
        const endpoint = `/api/loans/loans/${advancement.id}/`;
        const response = await patchData(endpoint, dataForUpdate);
        if (response.status === 200) {
          setErrorMessage({ Advancement: 'updated' });
          setIsError(false);
          setRefresh(!refresh);
        } else {
          setErrorMessage(response.data);
          setIsError(true);
        }
      } catch (error) {
        console.error('Error updating Advancement:', error);
        setIsError(true);
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
          console.log(error.response.data);
        } else {
          setErrorMessage(error.message);
          console.log(error.message);
        }
      }
    }
  };

  // Get styling based on status
  const getStatusStyles = () => {
    if (
      advancement?.needs_committee_approval &&
      advancement?.is_committee_approved === null
    ) {
      return {
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        headerText: '#ffffff',
        cardBg: 'linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)',
        borderColor: '#f59e0b',
      };
    }
    if (
      advancement?.needs_committee_approval &&
      advancement?.is_committee_approved === false
    ) {
      return {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        headerText: '#ffffff',
        cardBg: 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)',
        borderColor: '#ef4444',
      };
    }
    if (advancement?.is_paid_out) {
      return {
        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        headerText: '#ffffff',
        cardBg: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
        borderColor: '#22c55e',
      };
    }
    return {
      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      headerText: '#ffffff',
      cardBg: 'linear-gradient(135deg, #ffffff 0%, #eff6ff 100%)',
      borderColor: '#3b82f6',
    };
  };

  const statusStyles = getStatusStyles();

  // console.log(advancement);
  return (
    <>
      <BackToApplicationsIcon backUrl={-1} />
      {advancement && application ? (
        <div className='container my-4'>
          {/* Advancement Details */}
          <div
            className='mb-4'
            style={{
              background: statusStyles.cardBg,
              borderRadius: '20px',
              border: `2px solid ${statusStyles.borderColor}`,
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
            }}
          >
            {/* Modern Header */}
            <div
              className='text-center'
              style={{
                background: statusStyles.background,
                padding: '24px 32px',
                color: statusStyles.headerText,
              }}
            >
              <div className='d-flex align-items-center justify-content-center gap-3 mb-3'>
                <div
                  className='d-flex align-items-center justify-content-center rounded-3'
                  style={{
                    width: '48px',
                    height: '48px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    color: statusStyles.headerText,
                  }}
                >
                  <svg
                    width='24'
                    height='24'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='text-start'>
                  <h4 className='mb-1 fw-bold' style={{ fontSize: '1.5rem' }}>
                    Advancement Details
                  </h4>
                  <div className='d-flex align-items-center gap-2'>
                    <span
                      className='px-3 py-1 rounded-pill fw-bold'
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        fontSize: '1.1rem',
                      }}
                    >
                      #{advancement.id}
                    </span>
                    {advancement.country && (
                      <span
                        className='px-2 py-1 rounded-2'
                        style={{
                          background: 'rgba(255, 255, 255, 0.15)',
                          fontSize: '0.8rem',
                        }}
                      >
                        {advancement.country}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* PEPPER APPROVAL */}
              <PepperApprovalComponent
                advancement={advancement}
                user={user}
                token={token}
                setRefresh={setRefresh}
                refresh={refresh}
              />
              {/* Status Messages */}
              {advancement.needs_committee_approval &&
                advancement.is_committee_approved === null && (
                  <div
                    className='px-4 py-3 rounded-3 mb-3'
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <h5
                      className='mb-2 fw-bold text-uppercase'
                      style={{ fontSize: '1rem' }}
                    >
                      Committee Approval Needed
                    </h5>
                    <div
                      className='p-3 rounded-2'
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: '#374151',
                        fontSize: '0.9rem',
                      }}
                      dangerouslySetInnerHTML={{
                        __html:
                          advancement.committee_approvements_status.replace(
                            /\n/g,
                            '<br />'
                          ),
                      }}
                    ></div>
                    {user &&
                      user.teams &&
                      user.teams.some(
                        (team) => team.name === 'committee_members'
                      ) && (
                        <div className='mt-3'>
                          <CommitteeApproveReject
                            advancement={advancement}
                            refresh={refresh}
                            setRefresh={setRefresh}
                          />
                        </div>
                      )}
                  </div>
                )}
              {advancement.needs_committee_approval &&
                advancement.is_committee_approved === false && (
                  <div
                    className='px-4 py-3 rounded-3 mb-3'
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <h5
                      className='mb-2 fw-bold text-uppercase'
                      style={{ fontSize: '1rem' }}
                    >
                      Committee Approval Rejected
                    </h5>
                    <div
                      className='p-3 rounded-2'
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: '#374151',
                        fontSize: '0.9rem',
                      }}
                      dangerouslySetInnerHTML={{
                        __html:
                          advancement.committee_approvements_status.replace(
                            /\n/g,
                            '<br />'
                          ),
                      }}
                    ></div>
                  </div>
                )}
              {!advancement.is_paid_out &&
                !(
                  advancement.needs_committee_approval &&
                  advancement.is_committee_approved === null
                ) &&
                !(
                  advancement.needs_committee_approval &&
                  advancement.is_committee_approved === false
                ) && (
                  <div
                    className='px-4 py-3 rounded-3 mb-3'
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    <h5
                      className='mb-0 fw-bold text-uppercase'
                      style={{ fontSize: '1rem' }}
                    >
                      Advancement Not Paid Out
                    </h5>
                    {advancement.is_committee_approved === true && (
                      <div
                        className='mt-3 p-3 rounded-2'
                        style={{
                          background: 'rgba(255, 255, 255, 0.9)',
                          color: '#374151',
                          fontSize: '0.9rem',
                        }}
                        dangerouslySetInnerHTML={{
                          __html:
                            advancement.committee_approvements_status.replace(
                              /\n/g,
                              '<br />'
                            ),
                        }}
                      ></div>
                    )}
                  </div>
                )}
              {advancement.is_paid_out && (
                <div
                  className='px-4 py-3 rounded-3 mb-3'
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                >
                  <h5
                    className='mb-2 fw-bold text-uppercase'
                    style={{ fontSize: '1rem' }}
                  >
                    Advancement Paid Out on{' '}
                    {advancement.paid_out_date
                      ? new Date(advancement.paid_out_date)
                          .toISOString()
                          .split('T')[0]
                      : ''}
                  </h5>
                  {advancement.is_committee_approved === true && (
                    <div
                      className='p-3 rounded-2'
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        color: '#374151',
                        fontSize: '0.9rem',
                      }}
                      dangerouslySetInnerHTML={{
                        __html:
                          advancement.committee_approvements_status.replace(
                            /\n/g,
                            '<br />'
                          ),
                      }}
                    ></div>
                  )}
                </div>
              )}
            </div>

            {/* Body Content */}
            <div
              style={{
                padding: '24px 32px',
                background: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              {/* Assignment and Actions Row */}
              <div className='d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3'>
                <AssignedBadge email={application.assigned_to_email} />

                <div className='d-flex align-items-center gap-3'>
                  <OffcanvasComponent
                    applicationId={application.id}
                    comments={comments}
                    setComments={setComments}
                  />
                  <a
                    className='btn btn-success btn-sm d-flex align-items-center gap-2'
                    href={`/communication/${application.id}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{
                      background:
                        'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontWeight: '500',
                    }}
                  >
                    <svg
                      width='16'
                      height='16'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Open Communication
                  </a>
                </div>
              </div>

              {/* Advancement Details */}
              <ActualAdvancementDetailPart
                advancement={advancement}
                isEditing={isEditing}
                handleInputChange={handleInputChange}
              />

              {/* Edit Controls */}
              {/* <div className='d-flex justify-content-end gap-3 mt-4'>
                <button
                  className='btn d-flex align-items-center gap-2'
                  style={{
                    background: isEditing
                      ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                      : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontWeight: '500',
                  }}
                  onClick={isEditing ? handleSaveClick : handleEditClick}
                >
                  {isEditing ? (
                    <>
                      <svg
                        width='16'
                        height='16'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                          clipRule='evenodd'
                        />
                      </svg>
                      Save
                    </>
                  ) : (
                    <>
                      <svg
                        width='16'
                        height='16'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                      </svg>
                      Edit
                    </>
                  )}
                </button>

                {isEditing && (
                  <button
                    className='btn d-flex align-items-center gap-2'
                    style={{
                      background:
                        'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 20px',
                      fontWeight: '500',
                    }}
                    onClick={() => {
                      setIsEditing(false);
                    }}
                  >
                    <svg
                      width='16'
                      height='16'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Cancel
                  </button>
                )}
              </div> */}
            </div>

            {/* Actions Part */}
            <div
              style={{
                borderTop: '1px solid rgba(59, 130, 246, 0.2)',
                background: 'rgba(248, 250, 252, 0.8)',
              }}
            >
              <ActionsPart
                advancement={advancement}
                showReferenceNumberPart={showReferenceNumberPart}
                setShowReferenceNumberPart={setShowReferenceNumberPart}
                markAdvancementPaidOutHandler={markAdvancementPaidOutHandler}
                payOutReferenceNumber={payOutReferenceNumber}
                setPayOutReferenceNumber={setPayOutReferenceNumber}
                // Add these required props
                patchData={patchData}
                setErrorMessage={setErrorMessage}
                setIsError={setIsError}
                setRefresh={setRefresh}
                refresh={refresh}
              />
            </div>
          </div>

          {/* Professional Error Display */}
          {errorMessage && (
            <div
              className='mx-0 mb-4 p-4 rounded-3 border'
              style={{
                backgroundColor: isError ? '#fefce8' : '#f0fdf4',
                border: isError ? '1px solid #fbbf24' : '1px solid #22c55e',
              }}
            >
              <div className='d-flex align-items-center gap-3'>
                <div
                  className='d-flex align-items-center justify-content-center rounded-2 flex-shrink-0'
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: isError ? '#d97706' : '#16a34a',
                    color: 'white',
                  }}
                >
                  <svg
                    width='18'
                    height='18'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    {isError ? (
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    ) : (
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    )}
                  </svg>
                </div>
                <div>
                  <h6
                    className='fw-bold mb-1'
                    style={{ color: isError ? '#d97706' : '#16a34a' }}
                  >
                    {isError ? 'Error' : 'Success'}
                  </h6>
                  <div
                    style={{
                      fontSize: '0.875rem',
                      color: isError ? '#b45309' : '#15803d',
                    }}
                  >
                    {renderErrors(errorMessage)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Application Details */}
          <ApplicationDerailsReadOnlyPart
            application={application}
            assignedSolicitor={assignedSolicitor}
          />
        </div>
      ) : (
        <div
          className='d-flex align-items-center justify-content-center'
          style={{ minHeight: '60vh' }}
        >
          <LoadingComponent />
        </div>
      )}
    </>
  );
};

export default AdvancementDetail;
