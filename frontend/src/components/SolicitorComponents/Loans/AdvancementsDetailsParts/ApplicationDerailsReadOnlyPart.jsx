import React, { useEffect, useState } from 'react';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import {
  formatCategoryName,
  formatDate,
  getEstates,
} from '../../../GenericFunctions/HelperGenericFunctions';

const ApplicationDerailsReadOnlyPart = ({ application, assignedSolicitor }) => {
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

    fetchEstates();
  }, [application.estate_summary]);
  return (
    <>
      {application && assignedSolicitor ? (
        <div className='card bg-info-subtle shadow'>
          <div className='card-header bg-dark-subtle text-dark text-center'>
            <h5>
              Application id -
              <span className=' text-info'>
                <strong style={{ fontSize: '1.4rem' }}>{application.id}</strong>
              </span>{' '}
              - Details:
            </h5>
          </div>
          <div className='card-body my-3'>
            <div className='row'>
              <div className='col-md-5'>
                <div className='row'>
                  <div className='col-md-6 my-auto'>
                    <strong>Application ID:</strong>
                  </div>
                  <div className='col-md-6 my-auto'>{application.id}</div>
                  <hr />

                  <div className='col-md-6 my-auto'>
                    <strong>Amount:</strong>
                  </div>
                  <div className='col-md-6 my-auto'>
                    {application.currency_sign} {application.amount}
                  </div>
                  <hr />

                  <div className='col-md-6 my-auto'>
                    <strong>Term:</strong>
                  </div>
                  <div className='col-md-6 my-auto'>
                    {application.term} months
                  </div>
                  <hr />

                  <div className='col-md-6 my-auto'>
                    <strong>Date Submitted:</strong>
                  </div>
                  <div className='col-md-6 my-auto'>
                    {formatDate(application.date_submitted)}
                  </div>
                  <hr />
                </div>
              </div>
              <div className='col-md-6 my-auto offset-md-1'>
                <div className='row'>
                  <div className='col-md-6 my-auto'>
                    <strong>Undertaking Ready:</strong>
                  </div>
                  <div className='col-md-6 my-auto'>
                    {application.undertaking_ready ? 'Yes' : 'No'}
                  </div>
                  <hr />

                  <div className='col-md-6 my-auto'>
                    <strong>Advancement Agreement Ready:</strong>
                  </div>
                  <div className='col-md-6 my-auto'>
                    {application.loan_agreement_ready ? 'Yes' : 'No'}
                  </div>
                  <hr />

                  <div className='col-md-6 my-auto'>
                    <strong>Value of Estate After Expenses:</strong>
                  </div>
                  <div className='col-md-6 my-auto'>
                    {application.currency_sign}{' '}
                    {application.value_of_the_estate_after_expenses}
                  </div>
                  <hr />

                  <div className='col-md-6 my-auto'>
                    <strong>Dispute Details:</strong>
                  </div>
                  <div className='col-md-6 my-auto'>
                    {application.dispute.details}
                  </div>
                  <hr />
                </div>
              </div>
            </div>

            {/* User */}
            <div className='mt-4'>
              <h5>Assigned solicitor:</h5>

              {assignedSolicitor && (
                <div className='row mt-2'>
                  <div className='col-md-3'>
                    <strong>Full name:</strong>
                  </div>
                  <div className='col-md-9'>
                    {assignedSolicitor.title ? assignedSolicitor.title : ''}{' '}
                    {assignedSolicitor.first_name
                      ? assignedSolicitor.first_name
                      : ''}{' '}
                    {assignedSolicitor.last_name
                      ? assignedSolicitor.last_name
                      : ''}
                  </div>

                  <div className='col-md-3'>
                    <strong>Email:</strong>
                  </div>
                  {assignedSolicitor.own_email ? (
                    <div className='col-md-9'>
                      {assignedSolicitor.own_email}
                    </div>
                  ) : (
                    <div className='col-md-9'>-</div>
                  )}
                  <div className='col-md-3'>
                    <strong>Phone:</strong>
                  </div>
                  {assignedSolicitor.own_phone_number ? (
                    <div className='col-md-9'>
                      {assignedSolicitor.own_phone_number}
                    </div>
                  ) : (
                    <div className='col-md-9'>-</div>
                  )}
                </div>
              )}
              <br />
              <h5>Solicitor firm:</h5>
              <div className='row'>
                <div className='col-md-3'>
                  <strong>User:</strong>
                </div>
                <div className='col-md-9'>{application.user.name}</div>
                <div className='col-md-3'>
                  <strong>Email:</strong>
                </div>
                <div className='col-md-9'>{application.user.email}</div>

                <div className='col-md-3'>
                  <strong>Phone:</strong>
                </div>
                <div className='col-md-9'>{application.user.phone_number}</div>

                <div className='col-md-3'>
                  <strong>Address:</strong>
                </div>
                <div className='col-md-9'>
                  {application.user.address.line1},{' '}
                  {application.user.address.line2},{' '}
                  {application.user.address.town_city},{' '}
                  {application.user.address.county},{' '}
                  {application.user.address.eircode}
                </div>
              </div>
            </div>

            {/* Applicants */}
            <div className='mt-4'>
              <h5>Applicants:</h5>
              <div className='row'>
                {application.applicants.map((applicant, index) => (
                  <React.Fragment key={index}>
                    <div className='col-md-3'>
                      <strong>Applicant:</strong>
                    </div>
                    <div className='col-md-9'>
                      {applicant.title} {applicant.first_name}{' '}
                      {applicant.last_name} - PPS Number: {applicant.pps_number}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Estates */}
            <div className='mt-4'>
              <h5>Estates:</h5>
              <div className='row'>
                {estates &&
                  estates.map((estate, index) => (
                    <React.Fragment key={index}>
                      <div>
                        {formatCategoryName(estate.category)} - Value:{' '}
                        {application.currency_sign} {estate.value}
                      </div>
                    </React.Fragment>
                  ))}
              </div>
            </div>

            {/* Expenses */}
            {/* <div className='mt-4'>
              <h5>Expenses:</h5>
              <div className='row'>
                {application.expenses.map((expense, index) => (
                  <React.Fragment key={index}>
                    <div className='col-md-3'>
                      <strong>Expense:</strong>
                    </div>
                    <div className='col-md-9'>
                      {expense.description} - Value: {application.currency_sign}{' '}
                      {expense.value}
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      ) : (
        <LoadingComponent />
      )}
    </>
  );
};

export default ApplicationDerailsReadOnlyPart;
