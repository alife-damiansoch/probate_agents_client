import  { useState } from 'react';
import Stage from './Stage';

import { useNavigate } from 'react-router-dom';
import ApplicationUser from './ApplicationUser';

import RejectedBadge from '../../GenericComponents/StageBadges/RejectedBadge';
import PaidOutBadge from '../../GenericComponents/StageBadges/PaidOutBadge';
import SettledBadge from '../../GenericComponents/StageBadges/SettledBadge';
import ApprovedBadge from '../../GenericComponents/StageBadges/ApprovedBadge';
import InProgressBadge from '../../GenericComponents/StageBadges/InProgressBadge';
import AssignedBadge from '../../GenericComponents/AssignedBadge';
import ApplicationMaturity from '../../GenericComponents/StageBadges/ApplicationMaturity';

const Application = ({ application }) => {
  const [formData] = useState({ ...application });
  const [rejectedInAnyStage, setRejectedInAnyStage] = useState(false);
  const [approvedInAnyStage, setApprovedInAnyStage] = useState(false);

  const navigate = useNavigate();

  const applicationClickHandler = () => {
    navigate(`/applications/${formData.id}`);
  };
  // console.log(formData);
  return (
    <>
      {formData && (
        <div
          className={`application-card card shadow-lg bg-dark-subtle mb-3 position-relative border-3  rounded ${
            approvedInAnyStage
              ? 'border-success-subtle'
              : rejectedInAnyStage
              ? 'border-danger-subtle'
              : 'border-dark-subtle'
          }`}
        >
          <div className='card-body p-2' onClick={applicationClickHandler}>
            {rejectedInAnyStage && <RejectedBadge />}
            {approvedInAnyStage &&
              application.loan !== null &&
              application.loan.is_paid_out &&
              !application.loan.is_settled && <PaidOutBadge />}
            {approvedInAnyStage &&
              application.loan !== null &&
              application.loan.is_paid_out &&
              application.loan.is_settled && <SettledBadge />}
            {approvedInAnyStage &&
              application.loan !== null &&
              !application.loan.is_paid_out && <ApprovedBadge />}
            {!approvedInAnyStage && !rejectedInAnyStage && <InProgressBadge />}
            <div className='card-header bg-dark rounded text-white  py-2'>
              <div className=' row mx-0'>
                <h4 className=' card-subtitle mt-4 mt-lg-0 mb-1 col-6'>
                  {application.applicants.length > 0
                    ? `${application.applicants[0].title} ${application.applicants[0].first_name} ${application.applicants[0].last_name} `
                    : 'No applicants added'}{' '}
                </h4>
                {approvedInAnyStage &&
                  application.loan !== null &&
                  application.loan.is_paid_out &&
                  !application.loan.is_settled && (
                    <ApplicationMaturity
                      maturityDate={application.loan.maturity_date}
                    />
                  )}
              </div>

              <h5 className=' card-subtitle mt-4 mt-lg-0 text-center'>
                Application id: {formData.id}{' '}
                {formData?.user?.country && (
                  <sub>({formData?.user?.country})</sub>
                )}
              </h5>
            </div>

            <AssignedBadge email={application.assigned_to_email} />
            <div className='row mt-1 text-end'>
              <div className='col-auto ms-auto'>
                <span className='badge bg-info shadow'>
                  <strong>Last Updated By:</strong>{' '}
                  {application.last_updated_by_email || 'N/A'}
                </span>
              </div>
            </div>
            <div className='card shadow rounded bg-info-subtle mt-2 mx-4'>
              <div className='card-body p-2'>
                {application.user && (
                  <ApplicationUser application={application} />
                )}
              </div>
            </div>

            <form className='mt-2'>
              <div className='row mb-2'>
                <div className='col-md-6'>
                  <label className='form-label col-12 text-black'>
                    Amount:
                    <div className='input-group input-group-sm '>
                      <span className='input-group-text bg-dark-subtle pe-1'>
                        {application.currency_sign && (
                          <strong>{application.currency_sign} </strong>
                        )}
                      </span>
                      <input
                        type='text'
                        className='form-control rounded shadow'
                        name='amount'
                        value={formData.amount}
                        readOnly
                      />
                    </div>
                  </label>
                </div>
                <div className='col-md-6'>
                  <label className='form-label col-12 text-black'>
                    Term:
                    <div className='input-group input-group-sm '>
                      <span className='input-group-text bg-dark-subtle pe-1'>
                        Months:
                      </span>
                      <input
                        type='text'
                        className='form-control rounded shadow'
                        name='term'
                        value={formData.term}
                        readOnly
                      />
                    </div>
                  </label>
                </div>
              </div>
            </form>

            {/* stages part */}
            <div
              className={`d-flex flex-wrap align-items-center justify-content-evenly  pt-2 rounded shadow ${
                rejectedInAnyStage
                  ? 'border bg-danger-subtle border-2 border-danger'
                  : approvedInAnyStage
                  ? 'border bg-success-subtle border-2 border-success'
                  : 'bg-info-subtle'
              }`.trim()}
            >
              {!rejectedInAnyStage && !approvedInAnyStage && (
                <>
                  <div className='col-lg-3 col-md-4 col-sm-6 mb-2'>
                    <Stage
                      stage='Applied'
                      completed={true}
                      rejected={formData.is_rejected}
                      advancement={formData.loan}
                      setRejectedInAnyStage={setRejectedInAnyStage}
                      setApprovedInAnyStage={setApprovedInAnyStage}
                    />
                  </div>
                  <div className='col-lg-3 col-md-4 col-sm-6 mb-2'>
                    <Stage
                      stage='Undertaking Ready'
                      completed={formData.undertaking_ready}
                      rejected={formData.is_rejected}
                      advancement={formData.loan}
                      setRejectedInAnyStage={setRejectedInAnyStage}
                      setApprovedInAnyStage={setApprovedInAnyStage}
                    />
                  </div>
                  <div className='col-lg-3 col-md-4 col-sm-6 mb-2'>
                    <Stage
                      stage='Advancement Agreement Ready'
                      completed={formData.loan_agreement_ready}
                      rejected={formData.is_rejected}
                      advancement={formData.loan}
                      setRejectedInAnyStage={setRejectedInAnyStage}
                      setApprovedInAnyStage={setApprovedInAnyStage}
                    />
                  </div>
                </>
              )}

              {formData.approved === false && formData.is_rejected === false ? (
                <div className='col-lg-3 col-md-4 col-sm-6 mb-2'>
                  <Stage
                    key={`${formData.id}-${formData.loan?.is_committee_approved}`}
                    stage='Approved'
                    completed={formData.approved}
                    rejected={formData.is_rejected}
                    advancement={formData.loan}
                    setRejectedInAnyStage={setRejectedInAnyStage}
                    setApprovedInAnyStage={setApprovedInAnyStage}
                  />
                </div>
              ) : formData.is_rejected === true ? (
                <div className=' col-12 mb-2'>
                  <Stage
                    key={`${formData.id}-${formData.loan?.is_committee_approved}`}
                    stage='Approved'
                    completed={formData.approved}
                    rejected={formData.is_rejected}
                    advancement={formData.loan}
                    setRejectedInAnyStage={setRejectedInAnyStage}
                    setApprovedInAnyStage={setApprovedInAnyStage}
                  />
                </div>
              ) : formData.approved === true && formData.loan !== null ? (
                <div className=' col-lg-3 col-md-4 col-sm-6 mb-2'>
                  <Stage
                    key={`${formData.id}-${formData.loan?.is_committee_approved}`}
                    stage='Approved'
                    completed={formData.approved}
                    rejected={formData.is_rejected}
                    advancement={formData.loan}
                    setRejectedInAnyStage={setRejectedInAnyStage}
                    setApprovedInAnyStage={setApprovedInAnyStage}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Application;
