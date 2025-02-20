import  { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { MdDoneAll } from 'react-icons/md';
import { TbFaceIdError } from 'react-icons/tb';
import DeleteApplication from './DeleteApplication';
import BackToApplicationsIcon from '../../GenericComponents/BackToApplicationsIcon';
import DocumentsUpload from './DocumentsUpload';
import ExpensesComponent from './ExpensesComponent';

import {
  fetchData,
  patchData,
} from '../../GenericFunctions/AxiosGenericFunctions';
import Cookies from 'js-cookie';
import RequiredDetailsPart from '../ApplicationDetailsParts/RequiredDetailsPart';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import OffcanvasComponent from '../../GenericComponents/OffcanvasComponent';
import renderErrors, {
  formatDate,
} from '../../GenericFunctions/HelperGenericFunctions';
import SolicitorPart from '../ApplicationDetailsParts/SolicitorPart';
import RejectionForm from '../ApplicationDetailsParts/RejectionForm';
import { useSelector } from 'react-redux';

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

  const renderInputWithIcon = (label, value, condition) => {
    if (label !== 'Rejected') {
      return (
        <div className='col-md-4 sha'>
          <label className='form-label col-10'>
            <small className=' text-nowrap text-black'>{label}</small>
            <div className='input-icon-wrapper' id='input-icon-wrapper'>
              <input
                type='text'
                id='input-field'
                className={`form-control rounded-bottom-pill text-center text-white shadow ${
                  condition ? 'bg-success' : 'bg-warning'
                }`}
                value={value}
                readOnly
              />
              {condition && (
                <MdDoneAll
                  size={30}
                  color='darkgreen'
                  className='icon'
                  id='input-icon'
                />
              )}
            </div>
          </label>
        </div>
      );
    }
    return (
      <div className='col-md-4 sha'>
        <label className='form-label col-10'>
          <small className=' text-nowrap text-black'>{label}</small>
          <div className='input-icon-wrapper' id='input-icon-wrapper'>
            <input
              type='text'
              id='input-field'
              className={`form-control rounded-bottom-pill text-center text-white shadow ${
                condition ? 'bg-danger' : 'bg-warning'
              }`}
              value={value}
              readOnly
            />
            {condition && (
              <TbFaceIdError
                size={30}
                color='darkred'
                className='icon'
                id='input-icon'
              />
            )}
          </div>
        </label>
      </div>
    );
  };

  const handleApprove = () => {
    // Check the conditions
    if (
      !application.loan_agreement_ready ||
      !application.undertaking_ready ||
      application.signed_documents.length === 0
    ) {
      // Prompt the user with a confirmation dialog
      const proceed = window.confirm(
        'This application has no signed documents, undertaking, or advancement agreement. Do you want to proceed with the approval?'
      );

      // If the user clicks "OK"
      if (proceed) {
        navigate(`/approveApplication/${application.id}`);
      }
    } else {
      navigate(`/approveApplication/${application.id}`);
    }
  };

  const handleReject = () => {
    setShowRejectionForm(true);
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

  return (
    <>
      <BackToApplicationsIcon backUrl={-1} />
      <div className='card rounded bg-dark-subtle border-0 shadow'>
        {deleteAppId !== '' && (
          <div className='card-footer'>
            <DeleteApplication
              applicationId={deleteAppId}
              setDeleteAppId={setDeleteAppId}
            />
          </div>
        )}

        <div className='card-header text-center bg-dark  rounded-top'>
          <div className='row'>
            <div className='card-title text-white col-12 col-md-10'>
              <h4>
                <span>
                  <strong>
                    Details: <br />
                    Application {application.id} ({application?.user?.country})
                  </strong>
                </span>
              </h4>

              {advancement && (
                <h6 className=' '>
                  <Link
                    className=' link link-info text-decoration-underline'
                    to={`/advancements/${advancement.id}`}
                  >
                    Advancement id: {advancement.id}
                  </Link>
                </h6>
              )}
            </div>

            <div className='col-12 col-md-2 '>
              {/* offcanvas start */}
              <OffcanvasComponent
                applicationId={application.id}
                comments={comments}
                setComments={setComments}
              />
              {/* offcanvas end */}
            </div>
          </div>
        </div>
        {(application.is_rejected || application.approved) && (
          <div className='col-10 mx-auto alert alert-danger text-center my-3'>{`Options and editing are not available because application is ${
            application.is_rejected ? 'rejected' : 'approved'
          }`}</div>
        )}
        <div className='card-footer'>
          {/* Documents part */}
          <div className='row d-flex align-items-stretch'>
            {/* <div className='col-12 col-md-6'>
              <div className='card h-md-100 shadow'>
                <div className='card-header'>
                  <div className='card-title text-center'>
                    <h5>Documents</h5>
                  </div>
                </div>
                <div className='card-body d-flex flex-column justify-content-between shadow'>
                  <div className='row my-auto mx-1'>
                    <button
                      className='btn btn-sm btn-outline-success me-3 shadow'
                      onClick={() => {
                        navigate(`/createAdvancement/${application.id}`);
                      }}
                      disabled={application.approved || application.is_rejected}
                    >
                      Create undertaking document
                    </button>
                  </div>
                </div>
              </div>
            </div> */}

            {/* steps part */}

            <div className='col-12  mt-3 mt-md-0'>
              <div className='card h-md-100 shadow'>
                <div className='card-header'>
                  <div className='card-title text-center'>
                    <h5>Step</h5>
                  </div>
                </div>
                <div className='card-body d-flex flex-column justify-content-between shadow'>
                  <div className='row mx-1'>
                    <button
                      className='btn btn-sm btn-outline-success shadow'
                      onClick={() => {
                        handleApprove();
                      }}
                      disabled={application.approved || application.is_rejected}
                    >
                      Approve for advancement
                    </button>
                    <button
                      className='btn btn-sm btn-outline-warning  my-2 shadow'
                      onClick={() => {
                        handleReject();
                      }}
                      disabled={application.approved || application.is_rejected}
                    >
                      Reject application
                    </button>
                  </div>
                  {user?.is_superuser === true && (
                    <div className='row text-end my-2 mx-1'>
                      <button
                        className='btn btn-sm btn-danger my-auto shadow'
                        onClick={() => {
                          setDeleteAppId(id);
                        }}
                        disabled={
                          application.approved || application.is_rejected
                        }
                      >
                        Delete Application
                      </button>
                    </div>
                  )}

                  <div className='row'></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showRejectionForm && (
          <RejectionForm
            rejectionReason={rejectionReason}
            setRejectionReason={setRejectionReason}
            handleRejectCancel={handleRejectCancel}
            handleRejectSubmit={handleRejectSubmit}
          />
        )}

        {errorMessage && (
          <div
            className={`alert text-center ${
              isError
                ? 'alert-warning text-danger'
                : 'alert-success text-success'
            }`}
            role='alert'
          >
            {renderErrors(errorMessage)}
          </div>
        )}
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
        />

        <DocumentsUpload
          applicationId={id}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      </div>
      <div className='card rounded bg-dark-subtle border-0 shadow mt-4 shadow'>
        <div className='card-header my-2'>
          <div className='row '>
            <h3 className='card-subtitle text-info-emphasis'>
              Optional details
            </h3>
          </div>
        </div>

        <ExpensesComponent
          application={application}
          applicationId={id}
          existingExpenses={application.expenses}
        />
      </div>

      <div className='card rounded py-3 bg-info my-3'>
        <div className='row text-center'>
          {renderInputWithIcon(
            'Date Submitted',
            formatDate(application.date_submitted),
            true
          )}
          {renderInputWithIcon(
            'Adv Agreement Ready',
            application.loan_agreement_ready ? 'Yes' : 'No',
            application.loan_agreement_ready
          )}
          {renderInputWithIcon(
            'Documents Uploaded',
            application.documents.length > 0 ||
              application.signed_documents.length > 0
              ? 'Yes'
              : 'No',
            application.documents.length > 0 ||
              application.signed_documents.length > 0
          )}
          {renderInputWithIcon(
            'Undertaking Ready',
            application.undertaking_ready ? 'Yes' : 'No',
            application.undertaking_ready
          )}
          {/* APPROVED NEW STAGES */}
          {application.approved &&
            application.loan &&
            application.loan.needs_committee_approval === false &&
            renderInputWithIcon('Approved', 'Yes', application.approved)}
          {application.approved &&
            application.loan &&
            application.loan.needs_committee_approval === true &&
            application.loan.is_committee_approved === true &&
            renderInputWithIcon(
              'Approved',
              'Approved by committee',
              application.approved
            )}

          {/* REJECTED NEW STAGES */}
          {application.is_rejected &&
            renderInputWithIcon('Rejected', 'Yes', application.is_rejected)}
          {application.approved &&
            application.loan &&
            application.loan.needs_committee_approval === true &&
            application.loan.is_committee_approved === false &&
            renderInputWithIcon('Rejected', 'Rejected by committee', true)}

          {/* AWAITIND DECISION NEW STAGES */}
          {application.is_rejected === false &&
            application.approved === false &&
            renderInputWithIcon('Status', 'Awaiting decision ...', false)}

          {application.is_rejected === false &&
            application.approved === true &&
            application.loan &&
            application.loan.needs_committee_approval === true &&
            application.loan.is_committee_approved === null &&
            renderInputWithIcon(
              'Status',
              'Awaiting committee decision ...',
              false
            )}
          {/* Reason for rejection */}
          {application.is_rejected && (
            <div className='col-12'>
              <div className='alert alert-info text-center'>
                <h4> Reason for rejection</h4>
                <p>{application.rejected_reason}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ApplicationDetails;
