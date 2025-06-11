import { useEffect, useState } from 'react';
import AnimatedWrapper from '../../../GenericFunctions/AnimationFuctions';
import {
  formatCategoryName,
  getEstates,
} from '../../../GenericFunctions/HelperGenericFunctions';

const ApplicationSummaryCard = ({ application, issues, setIssues }) => {
  const [estates, setEstates] = useState([]);

  useEffect(() => {
    if (application) {
      console.log('application', application);
      if (!application.loan_agreement_ready) {
        const newIssues = [];

        if (!application.loan_agreement_ready) {
          newIssues.push('Advancement agreement is not ready.');
        }

        if (!application.undertaking_ready) {
          newIssues.push('Undertaking is not ready.');
        }

        if (application.signed_documents.length === 0) {
          newIssues.push('No signed documents available.');
        }

        if (
          application.value_of_the_estate_after_expenses * 0.6 <
          application.amount
        ) {
          newIssues.push(
            'Check the amounts. 60% of the total value after expenses is less than requested advancement amount.'
          );
        }

        // Update the issues state with any new issues found
        setIssues(newIssues);
      }
    }
  }, [application, setIssues]);

  // Fetch estates when application.estate_summary changes
  useEffect(() => {
    const fetchEstates = async () => {
      try {
        const estatesData = await getEstates(application);
        setEstates(estatesData);
      } catch (error) {
        console.error('Error fetching estates:', error);
        setEstates([]);
      }
    };

    if (application) {
      fetchEstates();
    }
  }, [application.estate_summary]);

  // Updated formatCurrency function to use application.currency_sign
  const formatCurrency = (amount) => {
    if (!application || !application.currency_sign) {
      return `$${Number(amount).toFixed(2)}`;
    }
    return `${application.currency_sign}${Number(amount).toFixed(2)}`;
  };

  const getStatusIcon = (condition) => {
    if (condition) {
      return (
        <svg width='16' height='16' fill='#059669' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
            clipRule='evenodd'
          />
        </svg>
      );
    }
    return (
      <svg width='16' height='16' fill='#dc2626' viewBox='0 0 20 20'>
        <path
          fillRule='evenodd'
          d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
          clipRule='evenodd'
        />
      </svg>
    );
  };

  return (
    <>
      {application && (
        <AnimatedWrapper>
          <div
            className='bg-white rounded-4 p-4'
            style={{
              boxShadow:
                '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            }}
          >
            {/* Header */}
            <div
              className='px-3 py-3 mb-4 rounded-3'
              style={{
                background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
                color: 'white',
              }}
            >
              <h5 className='mb-0 fw-bold d-flex align-items-center gap-2'>
                <svg
                  width='20'
                  height='20'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z'
                    clipRule='evenodd'
                  />
                </svg>
                Application Summary
              </h5>
            </div>

            {/* Application Details */}
            <div className='mb-4'>
              <h6 className='fw-bold mb-3' style={{ color: '#111827' }}>
                Application Details
              </h6>
              <div className='row g-3'>
                <div className='col-12'>
                  <div
                    className='p-3 rounded-3'
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <div className='d-flex justify-content-between align-items-center mb-2'>
                      <span
                        className='fw-semibold'
                        style={{ color: '#475569' }}
                      >
                        Application ID
                      </span>
                      <span className='fw-bold' style={{ color: '#1e293b' }}>
                        #{application.id}
                      </span>
                    </div>
                    <div className='d-flex justify-content-between align-items-center mb-2'>
                      <span
                        className='fw-semibold'
                        style={{ color: '#475569' }}
                      >
                        Amount
                      </span>
                      <span className='fw-bold' style={{ color: '#1e293b' }}>
                        {formatCurrency(application.amount)}
                      </span>
                    </div>
                    <div className='d-flex justify-content-between align-items-center mb-2'>
                      <span
                        className='fw-semibold'
                        style={{ color: '#475569' }}
                      >
                        Term
                      </span>
                      <span className='fw-bold' style={{ color: '#1e293b' }}>
                        {application.term} months
                      </span>
                    </div>
                    <div className='d-flex justify-content-between align-items-center'>
                      <span
                        className='fw-semibold'
                        style={{ color: '#475569' }}
                      >
                        Date Submitted
                      </span>
                      <span className='fw-bold' style={{ color: '#1e293b' }}>
                        {new Date(
                          application.date_submitted
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Checks */}
            <div className='mb-4'>
              <h6 className='fw-bold mb-3' style={{ color: '#111827' }}>
                Status Checks
              </h6>
              <div className='d-flex flex-column gap-2'>
                <div
                  className='d-flex align-items-center justify-content-between p-3 rounded-3'
                  style={{
                    backgroundColor: application.loan_agreement_ready
                      ? '#f0fdf4'
                      : '#fef2f2',
                    border: `1px solid ${
                      application.loan_agreement_ready ? '#bbf7d0' : '#fecaca'
                    }`,
                  }}
                >
                  <span
                    className='fw-semibold'
                    style={{
                      color: application.loan_agreement_ready
                        ? '#059669'
                        : '#dc2626',
                      fontSize: '0.875rem',
                    }}
                  >
                    Advancement Agreement
                  </span>
                  {getStatusIcon(application.loan_agreement_ready)}
                </div>
                <div
                  className='d-flex align-items-center justify-content-between p-3 rounded-3'
                  style={{
                    backgroundColor: application.undertaking_ready
                      ? '#f0fdf4'
                      : '#fef2f2',
                    border: `1px solid ${
                      application.undertaking_ready ? '#bbf7d0' : '#fecaca'
                    }`,
                  }}
                >
                  <span
                    className='fw-semibold'
                    style={{
                      color: application.undertaking_ready
                        ? '#059669'
                        : '#dc2626',
                      fontSize: '0.875rem',
                    }}
                  >
                    Undertaking
                  </span>
                  {getStatusIcon(application.undertaking_ready)}
                </div>
                <div
                  className='d-flex align-items-center justify-content-between p-3 rounded-3'
                  style={{
                    backgroundColor:
                      application?.documents?.length > 0 ||
                      application?.signed_documents?.length > 0
                        ? '#f0fdf4'
                        : '#fef2f2',
                    border: `1px solid ${
                      application?.documents?.length > 0 ||
                      application?.signed_documents?.length > 0
                        ? '#bbf7d0'
                        : '#fecaca'
                    }`,
                  }}
                >
                  <span
                    className='fw-semibold'
                    style={{
                      color:
                        application?.documents?.length > 0 ||
                        application?.signed_documents?.length > 0
                          ? '#059669'
                          : '#dc2626',
                      fontSize: '0.875rem',
                    }}
                  >
                    Documents Uploaded
                  </span>
                  {getStatusIcon(
                    application?.documents?.length > 0 ||
                      application?.signed_documents?.length > 0
                  )}
                </div>
              </div>
            </div>

            {/* Deceased Information */}
            <div className='mb-4'>
              <h6 className='fw-bold mb-3' style={{ color: '#111827' }}>
                Deceased Information
              </h6>
              <div
                className='p-3 rounded-3'
                style={{
                  backgroundColor: '#fefbf3',
                  border: '1px solid #fed7aa',
                }}
              >
                <div className='d-flex justify-content-between align-items-center mb-2'>
                  <span className='fw-semibold' style={{ color: '#92400e' }}>
                    Name
                  </span>
                  <span className='fw-bold' style={{ color: '#78350f' }}>
                    {application.deceased.first_name}{' '}
                    {application.deceased.last_name}
                  </span>
                </div>
                <div className='d-flex justify-content-between align-items-center'>
                  <span className='fw-semibold' style={{ color: '#92400e' }}>
                    Estate Value
                  </span>
                  <span className='fw-bold' style={{ color: '#78350f' }}>
                    {formatCurrency(
                      application.value_of_the_estate_after_expenses
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Dispute Details */}
            <div className='mb-4'>
              <h6 className='fw-bold mb-3' style={{ color: '#111827' }}>
                Dispute Details
              </h6>
              <div
                className='p-3 rounded-3'
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <p
                  className='mb-0'
                  style={{ color: '#475569', fontSize: '0.875rem' }}
                >
                  {application.dispute.details}
                </p>
              </div>
            </div>

            {/* Applicants */}
            <div className='mb-4'>
              <h6 className='fw-bold mb-3' style={{ color: '#111827' }}>
                Applicants ({application.applicants.length})
              </h6>
              <div className='d-flex flex-column gap-2'>
                {application.applicants.map((applicant, index) => (
                  <div
                    key={index}
                    className='p-3 rounded-3'
                    style={{
                      backgroundColor: '#f0f9ff',
                      border: '1px solid #bae6fd',
                    }}
                  >
                    <div className='d-flex justify-content-between align-items-center mb-1'>
                      <span
                        className='fw-bold'
                        style={{ color: '#0c4a6e', fontSize: '0.875rem' }}
                      >
                        {applicant.title} {applicant.first_name}{' '}
                        {applicant.last_name}
                      </span>
                    </div>
                    <div className='d-flex justify-content-between align-items-center'>
                      <span style={{ color: '#0369a1', fontSize: '0.75rem' }}>
                        PPS: {applicant.pps_number}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estates */}
            {estates && estates.length > 0 && (
              <div className='mb-4'>
                <h6 className='fw-bold mb-3' style={{ color: '#111827' }}>
                  Estate Assets ({estates.length})
                </h6>
                <div className='d-flex flex-column gap-2'>
                  {estates.map((estate, index) => (
                    <div
                      key={index}
                      className='d-flex justify-content-between align-items-center p-3 rounded-3'
                      style={{
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                      }}
                    >
                      <span
                        className='fw-semibold'
                        style={{ color: '#059669', fontSize: '0.875rem' }}
                      >
                        {formatCategoryName(estate.category)}
                      </span>
                      <span className='fw-bold' style={{ color: '#047857' }}>
                        {formatCurrency(estate.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            {(application?.documents?.length > 0 ||
              application?.signed_documents?.length > 0) && (
              <div className='mb-4'>
                <h6 className='fw-bold mb-3' style={{ color: '#111827' }}>
                  Documents (
                  {(application?.documents?.length || 0) +
                    (application?.signed_documents?.length || 0)}
                  )
                </h6>
                <div className='d-flex flex-column gap-2'>
                  {application?.documents?.map((doc, index) => (
                    <div
                      key={`doc-${index}`}
                      className='p-3 rounded-3 d-flex align-items-center gap-2'
                      style={{
                        backgroundColor: '#fefbf3',
                        border: '1px solid #fed7aa',
                      }}
                    >
                      <svg
                        width='16'
                        height='16'
                        fill='#d97706'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span style={{ color: '#92400e', fontSize: '0.875rem' }}>
                        {doc.original_name}
                      </span>
                    </div>
                  ))}
                  {application?.signed_documents?.map((doc, index) => (
                    <div
                      key={`signed-${index}`}
                      className='p-3 rounded-3 d-flex align-items-center gap-2'
                      style={{
                        backgroundColor: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                      }}
                    >
                      <svg
                        width='16'
                        height='16'
                        fill='#059669'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                          clipRule='evenodd'
                        />
                      </svg>
                      <span style={{ color: '#059669', fontSize: '0.875rem' }}>
                        {doc.original_name} (Signed)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* User Information */}
            <div className='mb-4'>
              <h6 className='fw-bold mb-3' style={{ color: '#111827' }}>
                Contact Information
              </h6>
              <div
                className='p-3 rounded-3'
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                }}
              >
                <div className='d-flex justify-content-between align-items-center mb-2'>
                  <span className='fw-semibold' style={{ color: '#475569' }}>
                    Name
                  </span>
                  <span className='fw-bold' style={{ color: '#1e293b' }}>
                    {application.user.name}
                  </span>
                </div>
                <div className='d-flex justify-content-between align-items-center mb-2'>
                  <span className='fw-semibold' style={{ color: '#475569' }}>
                    Email
                  </span>
                  <span style={{ color: '#1e293b', fontSize: '0.875rem' }}>
                    {application.user.email}
                  </span>
                </div>
                <div className='d-flex justify-content-between align-items-center mb-2'>
                  <span className='fw-semibold' style={{ color: '#475569' }}>
                    Phone
                  </span>
                  <span style={{ color: '#1e293b', fontSize: '0.875rem' }}>
                    {application.user.phone_number}
                  </span>
                </div>
                <div className='d-flex justify-content-between align-items-start'>
                  <span className='fw-semibold' style={{ color: '#475569' }}>
                    Address
                  </span>
                  <span
                    style={{
                      color: '#1e293b',
                      fontSize: '0.875rem',
                      textAlign: 'right',
                    }}
                  >
                    {application.user.address.line1},{' '}
                    {application.user.address.line2},{' '}
                    {application.user.address.town_city},{' '}
                    {application.user.address.county}
                  </span>
                </div>
              </div>
            </div>

            {/* Issues - if any */}
            {issues.length > 0 && (
              <div className='mb-0'>
                <h6 className='fw-bold mb-3' style={{ color: '#111827' }}>
                  Issues Detected ({issues.length})
                </h6>
                <div
                  className='p-4 rounded-3'
                  style={{
                    backgroundColor: '#fef2f2',
                    border: '1px solid #fecaca',
                  }}
                >
                  <div className='d-flex align-items-center gap-2 mb-3'>
                    <svg
                      width='20'
                      height='20'
                      fill='#dc2626'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <span className='fw-bold' style={{ color: '#dc2626' }}>
                      Attention Required
                    </span>
                  </div>
                  <ul className='mb-0' style={{ color: '#7f1d1d' }}>
                    {issues.map((issue, index) => (
                      <li
                        key={index}
                        style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}
                      >
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </AnimatedWrapper>
      )}
    </>
  );
};

export default ApplicationSummaryCard;
