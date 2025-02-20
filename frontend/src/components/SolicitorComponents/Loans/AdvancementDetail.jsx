import {  useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  fetchData,
  patchData,
} from '../../GenericFunctions/AxiosGenericFunctions';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';
import OffcanvasComponent from '../../GenericComponents/OffcanvasComponent';
import BackToApplicationsIcon from '../../GenericComponents/BackToApplicationsIcon';
import AssignedBadge from '../../GenericComponents/AssignedBadge';
import { useSelector } from 'react-redux';
import CommitteeApproveReject from './CommitteeComponets/CommitteeApproveReject';
import ActionsPart from './AdvancementsDetailsParts/ActionsPart';
import ApplicationDerailsReadOnlyPart from './AdvancementsDetailsParts/ApplicationDerailsReadOnlyPart';
import ActualAdvancementDetailPart from './AdvancementsDetailsParts/ActualAdvancementDetailPart';

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
  // console.log(advancement);
  return (
    <>
      <BackToApplicationsIcon backUrl={-1} />
      {advancement && application ? (
        <div className='container my-4'>
          {/* Advancement Details */}
          <div className='card mb-4 shadow'>
            <div
              className={`card-header  text-info-emphasis text-center ${
                advancement.needs_committee_approval &&
                advancement.is_committee_approved === null
                  ? 'bg-warning-subtle'
                  : advancement.needs_committee_approval &&
                    advancement.is_committee_approved === false
                  ? ' bg-primary'
                  : advancement.is_paid_out
                  ? 'bg-success-subtle'
                  : 'bg-danger-subtle'
              }`}
            >
              <h5>
                Details: <br /> Advancement id
                <span className=' text-info'>
                  <strong style={{ fontSize: '1.4rem' }}>
                    {' '}
                    {advancement.id}
                  </strong>
                </span>{' '}
                <sub>({advancement.country})</sub>
              </h5>
              {advancement.needs_committee_approval &&
              advancement.is_committee_approved === null ? (
                <>
                  <h5 className=' text-uppercase text-danger'>
                    Committee approval needed
                  </h5>
                  <div
                    className='alert alert-info'
                    dangerouslySetInnerHTML={{
                      __html: advancement.committee_approvements_status.replace(
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
                      <CommitteeApproveReject
                        advancement={advancement}
                        refresh={refresh}
                        setRefresh={setRefresh}
                      />
                    )}
                </>
              ) : advancement.needs_committee_approval &&
                advancement.is_committee_approved === false ? (
                <>
                  <h5 className=' text-uppercase text-danger'>
                    Committee approval REJECTED
                  </h5>
                  <div
                    className='alert alert-info'
                    dangerouslySetInnerHTML={{
                      __html: advancement.committee_approvements_status.replace(
                        /\n/g,
                        '<br />'
                      ),
                    }}
                  ></div>
                </>
              ) : !advancement.is_paid_out ? (
                <>
                  <h5 className=' text-uppercase text-danger'>
                    Advancement not paid out
                  </h5>
                  {advancement.is_committee_approved === true && (
                    <div
                      className='alert alert-info'
                      dangerouslySetInnerHTML={{
                        __html:
                          advancement.committee_approvements_status.replace(
                            /\n/g,
                            '<br />'
                          ),
                      }}
                    ></div>
                  )}
                </>
              ) : (
                <>
                  <h5 className=' text-success text-uppercase'>{`Advancement paid out on ${
                    advancement.paid_out_date
                      ? new Date(advancement.paid_out_date)
                          .toISOString()
                          .split('T')[0]
                      : ''
                  }`}</h5>
                  {advancement.is_committee_approved === true && (
                    <div
                      className='alert alert-info'
                      dangerouslySetInnerHTML={{
                        __html:
                          advancement.committee_approvements_status.replace(
                            /\n/g,
                            '<br />'
                          ),
                      }}
                    ></div>
                  )}
                </>
              )}
            </div>

            <div className='card-body bg-primary-subtle'>
              <AssignedBadge email={application.assigned_to_email} />

              <div className='d-flex justify-content-center align-items-center my-2'>
                <OffcanvasComponent
                  applicationId={application.id}
                  comments={comments}
                  setComments={setComments}
                />
                <div>
                  <a
                    className='btn btn-sm btn-success'
                    href={`/communication/${application.id}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    Open Communication
                  </a>
                </div>
              </div>

              <ActualAdvancementDetailPart
                advancement={advancement}
                isEditing={isEditing}
                handleInputChange={handleInputChange}
              />
              <div className=' mt-2 text-end'>
                <button
                  className='btn btn-warning'
                  onClick={isEditing ? handleSaveClick : handleEditClick}
                >
                  {isEditing ? 'Save' : 'Edit'}
                </button>

                {isEditing && (
                  <button
                    className=' btn btn-light ms-3'
                    onClick={() => {
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            {/* Actions Part */}
            <ActionsPart
              advancement={advancement}
              showReferenceNumberPart={showReferenceNumberPart}
              setShowReferenceNumberPart={setShowReferenceNumberPart}
              markAdvancementPaidOutHandler={markAdvancementPaidOutHandler}
              payOutReferenceNumber={payOutReferenceNumber}
              setPayOutReferenceNumber={setPayOutReferenceNumber}
            />
          </div>
          {errorMessage && (
            <div
              className={`alert text-center  ${
                isError
                  ? 'alert-warning text-danger'
                  : 'alert-success text-success'
              }`}
              role='alert'
            >
              {renderErrors(errorMessage)}
            </div>
          )}

          {/* Application Details */}
          <ApplicationDerailsReadOnlyPart
            application={application}
            assignedSolicitor={assignedSolicitor}
          />
        </div>
      ) : (
        <LoadingComponent />
      )}
    </>
  );
};

export default AdvancementDetail;
