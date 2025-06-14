import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicationUser from './ApplicationUser';
import Stage from './Stage';

import AssignedBadge from '../../GenericComponents/AssignedBadge';
import ApplicationMaturity from '../../GenericComponents/StageBadges/ApplicationMaturity';
import ApprovedBadge from '../../GenericComponents/StageBadges/ApprovedBadge';
import InProgressBadge from '../../GenericComponents/StageBadges/InProgressBadge';
import PaidOutBadge from '../../GenericComponents/StageBadges/PaidOutBadge';
import RejectedBadge from '../../GenericComponents/StageBadges/RejectedBadge';
import SettledBadge from '../../GenericComponents/StageBadges/SettledBadge';
import { formatMoney } from '../../GenericFunctions/HelperGenericFunctions';

const Application = ({ application }) => {
  const [formData] = useState({ ...application });
  const [rejectedInAnyStage, setRejectedInAnyStage] = useState(false);
  const [approvedInAnyStage, setApprovedInAnyStage] = useState(false);

  const navigate = useNavigate();

  const applicationClickHandler = () => {
    navigate(`/applications/${formData.id}`);
  };

  // Get header styling based on status
  const getHeaderStyles = () => {
    if (approvedInAnyStage) {
      return {
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        textColor: '#ffffff', // White text on green background
      };
    }
    if (rejectedInAnyStage) {
      return {
        background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
        textColor: '#ffffff', // White text on red background
      };
    }
    // Default/in-progress state
    return {
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      textColor: '#1e293b', // Dark text on light background
    };
  };

  const headerStyles = getHeaderStyles();

  return (
    <>
      {formData && (
        <div
          className={`application-card position-relative mb-2 overflow-hidden cursor-pointer
            ${
              approvedInAnyStage
                ? 'border-success-subtle'
                : rejectedInAnyStage
                ? 'border-danger-subtle'
                : 'border-primary-subtle'
            }`}
          style={{
            background: approvedInAnyStage
              ? 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)'
              : rejectedInAnyStage
              ? 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '16px',
            border: '1px solid',
            borderColor: approvedInAnyStage
              ? '#d1fae5'
              : rejectedInAnyStage
              ? '#fecaca'
              : '#e2e8f0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
            minHeight: '140px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
          }}
        >
          {/* Status badges - compact positioning */}
          <div
            className='position-absolute d-flex gap-1'
            style={{ top: '8px', right: '8px', zIndex: 20 }}
          >
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
          </div>

          <div
            className='p-0 position-relative'
            onClick={applicationClickHandler}
            style={{ zIndex: 10 }}
          >
            {/* Header with proper text contrast */}
            <div
              className='position-relative'
              style={{
                background: headerStyles.background,
                borderTopLeftRadius: '15px',
                borderTopRightRadius: '15px',
                padding: '12px 16px',
                minHeight: '60px',
                display: 'flex',
                alignItems: 'center',
                color: headerStyles.textColor,
              }}
            >
              <div className='row w-100 mx-0 align-items-center'>
                <div className='col-8'>
                  <h6
                    className='mb-1 fw-bold'
                    style={{
                      fontSize: '1rem',
                      lineHeight: '1.2',
                      color: headerStyles.textColor,
                    }}
                  >
                    {application.applicants.length > 0
                      ? `${application.applicants[0].title} ${application.applicants[0].first_name} ${application.applicants[0].last_name}`
                      : 'No applicants'}
                  </h6>
                  <div className='d-flex align-items-center gap-2'>
                    <span
                      className='px-2 py-1 rounded-2 fw-medium'
                      style={{
                        background:
                          headerStyles.textColor === '#ffffff'
                            ? 'rgba(255, 255, 255, 0.2)'
                            : 'rgba(30, 41, 59, 0.1)',
                        fontSize: '0.7rem',
                        color: headerStyles.textColor,
                        border:
                          headerStyles.textColor === '#ffffff'
                            ? '1px solid rgba(255, 255, 255, 0.3)'
                            : '1px solid rgba(30, 41, 59, 0.2)',
                      }}
                    >
                      #{formData.id}
                    </span>
                    {formData?.user?.country && (
                      <span
                        className='px-2 py-1 rounded-2'
                        style={{
                          background:
                            headerStyles.textColor === '#ffffff'
                              ? 'rgba(255, 255, 255, 0.15)'
                              : 'rgba(30, 41, 59, 0.08)',
                          fontSize: '0.65rem',
                          color:
                            headerStyles.textColor === '#ffffff'
                              ? 'rgba(255, 255, 255, 0.9)'
                              : 'rgba(30, 41, 59, 0.8)',
                        }}
                      >
                        {formData?.user?.country}
                      </span>
                    )}
                  </div>
                </div>

                <div className='col-4 text-end'>
                  {approvedInAnyStage &&
                    application.loan !== null &&
                    application.loan.is_paid_out &&
                    !application.loan.is_settled && (
                      <ApplicationMaturity
                        maturityDate={application.loan.maturity_date}
                      />
                    )}
                </div>
              </div>
            </div>

            {/* Super compact content area */}
            <div className='px-3 py-2'>
              {/* Single row with all info */}
              <div className='row g-2 align-items-center mb-2'>
                {/* Assignment */}
                <div className='col-lg-4 col-md-5'>
                  <AssignedBadge email={application.assigned_to_email} />
                </div>

                {/* Amount & Term inline */}
                <div className='col-lg-5 col-md-4'>
                  <div className='d-flex align-items-center gap-3'>
                    <div className='d-flex align-items-center gap-1'>
                      <span
                        className='badge fw-bold'
                        style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          fontSize: '0.65rem',
                          padding: '2px 6px',
                        }}
                      >
                        {application.currency_sign || '$'}
                      </span>
                      <span
                        className='fw-semibold'
                        style={{ fontSize: '0.85rem', color: '#1e293b' }}
                      >
                        {formatMoney(formData.amount)}
                      </span>
                    </div>
                    <div className='d-flex align-items-center gap-1'>
                      <span
                        className='badge fw-bold'
                        style={{
                          background: '#f1f5f9',
                          color: '#475569',
                          fontSize: '0.65rem',
                          padding: '2px 6px',
                        }}
                      >
                        M
                      </span>
                      <span
                        className='fw-semibold'
                        style={{ fontSize: '0.85rem', color: '#1e293b' }}
                      >
                        {formData.term}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Update info */}
                <div className='col-lg-3 col-md-3 text-end'>
                  <span
                    className='badge px-2 py-1'
                    style={{
                      background: '#f1f5f9',
                      color: '#64748b',
                      fontSize: '0.65rem',
                    }}
                  >
                    {application.last_updated_by_email?.split('@')[0] || 'N/A'}
                  </span>
                </div>
              </div>

              {/* User info - super compact */}
              <div
                className='rounded-3 px-2 py-1 mb-2'
                style={{
                  background: 'rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  fontSize: '0.8rem',
                }}
              >
                {application.user && (
                  <ApplicationUser application={application} />
                )}
              </div>

              {/* Stages - ultra compact */}
              <div
                className={`py-2 px-2 rounded-3
                  ${
                    rejectedInAnyStage
                      ? 'bg-danger-subtle'
                      : approvedInAnyStage
                      ? 'bg-success-subtle'
                      : 'bg-primary-subtle'
                  }`}
                style={{
                  background: rejectedInAnyStage
                    ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
                    : approvedInAnyStage
                    ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                    : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                  border: '1px solid',
                  borderColor: rejectedInAnyStage
                    ? '#fecaca'
                    : approvedInAnyStage
                    ? '#bbf7d0'
                    : '#bfdbfe',
                }}
              >
                <div className='row g-1'>
                  {!rejectedInAnyStage && !approvedInAnyStage && (
                    <>
                      <div className='col-lg-3 col-md-4 col-6'>
                        <Stage
                          stage='Applied'
                          completed={true}
                          rejected={formData.is_rejected}
                          advancement={formData.loan}
                          setRejectedInAnyStage={setRejectedInAnyStage}
                          setApprovedInAnyStage={setApprovedInAnyStage}
                        />
                      </div>
                      <div className='col-lg-3 col-md-4 col-6'>
                        <Stage
                          stage='Undertaking Ready'
                          completed={formData.undertaking_ready}
                          rejected={formData.is_rejected}
                          advancement={formData.loan}
                          setRejectedInAnyStage={setRejectedInAnyStage}
                          setApprovedInAnyStage={setApprovedInAnyStage}
                        />
                      </div>
                      <div className='col-lg-3 col-md-4 col-6'>
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

                  {formData.approved === false &&
                  formData.is_rejected === false ? (
                    <div className='col-lg-3 col-md-4 col-6'>
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
                    <div className='col-12'>
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
                    <div className='col-lg-3 col-md-4 col-6'>
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
          </div>
        </div>
      )}

      <style jsx>{`
        .application-card {
          will-change: transform;
        }

        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default Application;
