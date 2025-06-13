import { useEffect, useState } from 'react';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import {
  formatCategoryName,
  formatDate,
  getEstates,
} from '../../../GenericFunctions/HelperGenericFunctions';

const ApplicationDetailsReadOnlyPart = ({ application, assignedSolicitor }) => {
  const [estates, setEstates] = useState([]);

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
  }, [application?.estate_summary]);

  return (
    <>
      {application ? (
        <div
          className='mb-4'
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
            borderRadius: '20px',
            border: '2px solid #0ea5e9',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            className='text-center'
            style={{
              background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
              padding: '20px 32px',
              color: '#ffffff',
            }}
          >
            <div className='d-flex align-items-center justify-content-center gap-3'>
              <div
                className='d-flex align-items-center justify-content-center rounded-3'
                style={{
                  width: '44px',
                  height: '44px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <svg
                  width='22'
                  height='22'
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
                <h4 className='mb-1 fw-bold' style={{ fontSize: '1.4rem' }}>
                  Application Details
                </h4>
                <span
                  className='px-3 py-1 rounded-pill fw-bold'
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontSize: '1.1rem',
                  }}
                >
                  #{application.id}
                </span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding: '32px' }}>
            {/* Basic Information */}
            <div className='row g-4 mb-5'>
              <div className='col-md-6'>
                <div
                  className='p-4 rounded-3'
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid #0ea5e9',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <h6
                    className='fw-bold mb-3 pb-2 d-flex align-items-center gap-2'
                    style={{
                      color: '#0c4a6e',
                      borderBottom: '2px solid #0ea5e9',
                      fontSize: '1rem',
                    }}
                  >
                    <svg
                      width='18'
                      height='18'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Application Information
                  </h6>

                  <div className='d-flex flex-column gap-3'>
                    <div
                      className='d-flex justify-content-between align-items-center p-2 rounded-2'
                      style={{ background: '#f8fafc' }}
                    >
                      <span
                        className='fw-semibold'
                        style={{ color: '#374151', fontSize: '0.9rem' }}
                      >
                        Application ID:
                      </span>
                      <span
                        className='fw-bold'
                        style={{ color: '#0c4a6e', fontSize: '1rem' }}
                      >
                        {application.id}
                      </span>
                    </div>

                    <div
                      className='d-flex justify-content-between align-items-center p-2 rounded-2'
                      style={{ background: '#f8fafc' }}
                    >
                      <span
                        className='fw-semibold'
                        style={{ color: '#374151', fontSize: '0.9rem' }}
                      >
                        Amount:
                      </span>
                      <span
                        className='fw-bold'
                        style={{ color: '#0c4a6e', fontSize: '1rem' }}
                      >
                        {application.currency_sign} {application.amount}
                      </span>
                    </div>

                    <div
                      className='d-flex justify-content-between align-items-center p-2 rounded-2'
                      style={{ background: '#f8fafc' }}
                    >
                      <span
                        className='fw-semibold'
                        style={{ color: '#374151', fontSize: '0.9rem' }}
                      >
                        Term:
                      </span>
                      <span
                        className='fw-bold'
                        style={{ color: '#0c4a6e', fontSize: '1rem' }}
                      >
                        {application.term} months
                      </span>
                    </div>

                    <div
                      className='d-flex justify-content-between align-items-center p-2 rounded-2'
                      style={{ background: '#f8fafc' }}
                    >
                      <span
                        className='fw-semibold'
                        style={{ color: '#374151', fontSize: '0.9rem' }}
                      >
                        Date Submitted:
                      </span>
                      <span
                        className='fw-bold'
                        style={{ color: '#0c4a6e', fontSize: '1rem' }}
                      >
                        {formatDate(application.date_submitted)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='col-md-6'>
                <div
                  className='p-4 rounded-3'
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '2px solid #16a34a',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <h6
                    className='fw-bold mb-3 pb-2 d-flex align-items-center gap-2'
                    style={{
                      color: '#15803d',
                      borderBottom: '2px solid #16a34a',
                      fontSize: '1rem',
                    }}
                  >
                    <svg
                      width='18'
                      height='18'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Status & Legal
                  </h6>

                  <div className='d-flex flex-column gap-3'>
                    <div
                      className='d-flex justify-content-between align-items-center p-2 rounded-2'
                      style={{
                        background: application.undertaking_ready
                          ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
                          : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      }}
                    >
                      <span
                        className='fw-semibold'
                        style={{ color: '#374151', fontSize: '0.9rem' }}
                      >
                        Undertaking Ready:
                      </span>
                      <span
                        className='fw-bold'
                        style={{
                          color: application.undertaking_ready
                            ? '#16a34a'
                            : '#d97706',
                          fontSize: '1rem',
                        }}
                      >
                        {application.undertaking_ready ? 'Yes' : 'No'}
                      </span>
                    </div>

                    <div
                      className='d-flex justify-content-between align-items-center p-2 rounded-2'
                      style={{
                        background: application.loan_agreement_ready
                          ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
                          : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      }}
                    >
                      <span
                        className='fw-semibold'
                        style={{ color: '#374151', fontSize: '0.9rem' }}
                      >
                        Agreement Ready:
                      </span>
                      <span
                        className='fw-bold'
                        style={{
                          color: application.loan_agreement_ready
                            ? '#16a34a'
                            : '#d97706',
                          fontSize: '1rem',
                        }}
                      >
                        {application.loan_agreement_ready ? 'Yes' : 'No'}
                      </span>
                    </div>

                    <div
                      className='d-flex justify-content-between align-items-center p-2 rounded-2'
                      style={{ background: '#f8fafc' }}
                    >
                      <span
                        className='fw-semibold'
                        style={{ color: '#374151', fontSize: '0.9rem' }}
                      >
                        Estate Value:
                      </span>
                      <span
                        className='fw-bold'
                        style={{ color: '#16a34a', fontSize: '1rem' }}
                      >
                        {application.currency_sign}{' '}
                        {application.value_of_the_estate_after_expenses}
                      </span>
                    </div>

                    <div
                      className='p-2 rounded-2'
                      style={{ background: '#f8fafc' }}
                    >
                      <span
                        className='fw-semibold d-block mb-1'
                        style={{ color: '#374151', fontSize: '0.9rem' }}
                      >
                        Dispute Details:
                      </span>
                      <span
                        className='fw-medium'
                        style={{
                          color: '#6b7280',
                          fontSize: '0.85rem',
                          lineHeight: '1.4',
                        }}
                      >
                        {application.dispute.details}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Solicitor Information */}
            <div className='mb-5'>
              <h5
                className='fw-bold mb-3 d-flex align-items-center gap-2'
                style={{ color: '#0c4a6e', fontSize: '1.2rem' }}
              >
                <svg
                  width='20'
                  height='20'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                    clipRule='evenodd'
                  />
                </svg>
                Assigned Solicitor
              </h5>

              {assignedSolicitor ? (
                <div className='row g-4'>
                  <div className='col-md-6'>
                    <div
                      className='p-4 rounded-3'
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      <h6
                        className='fw-bold mb-3'
                        style={{ color: '#374151', fontSize: '1rem' }}
                      >
                        Personal Details
                      </h6>
                      <div className='d-flex flex-column gap-2'>
                        <div className='d-flex justify-content-between'>
                          <span
                            className='fw-semibold'
                            style={{ color: '#6b7280', fontSize: '0.9rem' }}
                          >
                            Full Name:
                          </span>
                          <span
                            className='fw-medium'
                            style={{ color: '#374151', fontSize: '0.9rem' }}
                          >
                            {assignedSolicitor.title
                              ? assignedSolicitor.title
                              : ''}{' '}
                            {assignedSolicitor.first_name
                              ? assignedSolicitor.first_name
                              : ''}{' '}
                            {assignedSolicitor.last_name
                              ? assignedSolicitor.last_name
                              : ''}
                          </span>
                        </div>
                        <div className='d-flex justify-content-between'>
                          <span
                            className='fw-semibold'
                            style={{ color: '#6b7280', fontSize: '0.9rem' }}
                          >
                            Email:
                          </span>
                          <span
                            className='fw-medium'
                            style={{ color: '#0ea5e9', fontSize: '0.9rem' }}
                          >
                            {assignedSolicitor.own_email || '-'}
                          </span>
                        </div>
                        <div className='d-flex justify-content-between'>
                          <span
                            className='fw-semibold'
                            style={{ color: '#6b7280', fontSize: '0.9rem' }}
                          >
                            Phone:
                          </span>
                          <span
                            className='fw-medium'
                            style={{ color: '#374151', fontSize: '0.9rem' }}
                          >
                            {assignedSolicitor.own_phone_number || '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='col-md-6'>
                    <div
                      className='p-4 rounded-3'
                      style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        border: '1px solid #e5e7eb',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      <h6
                        className='fw-bold mb-3'
                        style={{ color: '#374151', fontSize: '1rem' }}
                      >
                        Solicitor Firm
                      </h6>
                      <div className='d-flex flex-column gap-2'>
                        <div className='d-flex justify-content-between'>
                          <span
                            className='fw-semibold'
                            style={{ color: '#6b7280', fontSize: '0.9rem' }}
                          >
                            Firm:
                          </span>
                          <span
                            className='fw-medium'
                            style={{ color: '#374151', fontSize: '0.9rem' }}
                          >
                            {application.user.name}
                          </span>
                        </div>
                        <div className='d-flex justify-content-between'>
                          <span
                            className='fw-semibold'
                            style={{ color: '#6b7280', fontSize: '0.9rem' }}
                          >
                            Email:
                          </span>
                          <span
                            className='fw-medium'
                            style={{ color: '#0ea5e9', fontSize: '0.9rem' }}
                          >
                            {application.user.email}
                          </span>
                        </div>
                        <div className='d-flex justify-content-between'>
                          <span
                            className='fw-semibold'
                            style={{ color: '#6b7280', fontSize: '0.9rem' }}
                          >
                            Phone:
                          </span>
                          <span
                            className='fw-medium'
                            style={{ color: '#374151', fontSize: '0.9rem' }}
                          >
                            {application.user.phone_number}
                          </span>
                        </div>
                        <div className='mt-2'>
                          <span
                            className='fw-semibold d-block mb-1'
                            style={{ color: '#6b7280', fontSize: '0.9rem' }}
                          >
                            Address:
                          </span>
                          <span
                            className='fw-medium'
                            style={{
                              color: '#374151',
                              fontSize: '0.85rem',
                              lineHeight: '1.4',
                            }}
                          >
                            {application.user.address.line1},{' '}
                            {application.user.address.line2},{' '}
                            {application.user.address.town_city},{' '}
                            {application.user.address.county},{' '}
                            {application.user.address.eircode}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className='p-4 rounded-3 text-center'
                  style={{
                    background:
                      'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                    border: '2px solid #fca5a5',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <div className='d-flex align-items-center justify-content-center gap-3'>
                    <svg
                      width='24'
                      height='24'
                      fill='#dc2626'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <div>
                      <h6
                        className='fw-bold mb-1'
                        style={{ color: '#dc2626', fontSize: '1rem' }}
                      >
                        No Solicitor Assigned
                      </h6>
                      <p
                        className='mb-0'
                        style={{ color: '#991b1b', fontSize: '0.9rem' }}
                      >
                        This application does not have an assigned solicitor
                        yet.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Applicants */}
            <div className='mb-5'>
              <h5
                className='fw-bold mb-3 d-flex align-items-center gap-2'
                style={{ color: '#0c4a6e', fontSize: '1.2rem' }}
              >
                <svg
                  width='20'
                  height='20'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z' />
                  <path d='M6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3z' />
                  <path d='M4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z' />
                </svg>
                Applicants
              </h5>

              <div className='row g-3'>
                {application.applicants.map((applicant, index) => (
                  <div key={index} className='col-md-6'>
                    <div
                      className='p-3 rounded-3'
                      style={{
                        background:
                          'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                        border: '1px solid #93c5fd',
                      }}
                    >
                      <div className='d-flex align-items-center gap-3'>
                        <div
                          className='d-flex align-items-center justify-content-center rounded-2 flex-shrink-0'
                          style={{
                            width: '32px',
                            height: '32px',
                            background: '#3b82f6',
                            color: '#ffffff',
                          }}
                        >
                          <span
                            className='fw-bold'
                            style={{ fontSize: '0.8rem' }}
                          >
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <div
                            className='fw-bold'
                            style={{ color: '#1e40af', fontSize: '0.95rem' }}
                          >
                            {applicant.title} {applicant.first_name}{' '}
                            {applicant.last_name}
                          </div>
                          <div style={{ color: '#3730a3', fontSize: '0.8rem' }}>
                            PPS: {applicant.pps_number}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estates */}
            <div>
              <h5
                className='fw-bold mb-3 d-flex align-items-center gap-2'
                style={{ color: '#0c4a6e', fontSize: '1.2rem' }}
              >
                <svg
                  width='20'
                  height='20'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z'
                    clipRule='evenodd'
                  />
                  <path d='M9 8a1 1 0 012 0v2a1 1 0 11-2 0V8z' />
                  <path d='M8 9a1 1 0 000 2h4a1 1 0 100-2H8z' />
                </svg>
                Estates
              </h5>

              <div className='row g-3'>
                {estates &&
                  estates.map((estate, index) => (
                    <div key={index} className='col-md-6 col-lg-4'>
                      <div
                        className='p-3 rounded-3'
                        style={{
                          background:
                            'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                          border: '1px solid #86efac',
                        }}
                      >
                        <div className='d-flex justify-content-between align-items-center'>
                          <span
                            className='fw-bold'
                            style={{ color: '#15803d', fontSize: '0.9rem' }}
                          >
                            {formatCategoryName(estate.category)}
                          </span>
                          <span
                            className='fw-bold'
                            style={{ color: '#16a34a', fontSize: '1rem' }}
                          >
                            {application.currency_sign} {estate.value}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className='d-flex align-items-center justify-content-center'
          style={{ minHeight: '300px' }}
        >
          <LoadingComponent />
        </div>
      )}
    </>
  );
};

export default ApplicationDetailsReadOnlyPart;
