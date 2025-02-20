import { useEffect } from 'react';
import AnimatedWrapper from '../../../GenericFunctions/AnimationFuctions';

const ApplicationSummaryCard = ({ application, issues, setIssues }) => {
  useEffect(() => {
    if (application) {
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
  // console.log(application);
  return (
    <>
      {application && (
        <AnimatedWrapper>
          <div
            className='card text-white bg-dark mb-3 mx-auto shadow'
            style={{ maxWidth: '18rem', fontSize: '0.8rem' }}
          >
            <div className='card-header'>Application Summary</div>
            <div className='card-body'>
              <h5 className='card-title'>Application ID: {application.id}</h5>
              <p className='card-text'>
                <strong>Amount:</strong> €{application.amount}
              </p>
              <p className='card-text'>
                <strong>Date Submitted:</strong>{' '}
                {new Date(application.date_submitted).toLocaleDateString()}
              </p>
              <p className='card-text'>
                <strong>Term:</strong> {application.term} months
              </p>
              <p className='card-text'>
                <strong>Deceased:</strong> {application.deceased.first_name}{' '}
                {application.deceased.last_name}
              </p>
              <p className='card-text'>
                <strong>Dispute:</strong> {application.dispute.details}
              </p>
              <p
                className={`card-text ${
                  !application.loan_agreement_ready ? 'text-danger' : ''
                }`}
              >
                <strong>Advancement Agreement Ready:</strong>{' '}
                {application.loan_agreement_ready ? 'Yes' : 'No'}
              </p>
              <p
                className={`card-text ${
                  !application.undertaking_ready ? 'text-danger' : ''
                }`}
              >
                <strong>Undertaking Ready:</strong>{' '}
                {application.undertaking_ready ? 'Yes' : 'No'}
              </p>
              <p className='card-text'>
                <strong>Value of Estate After Expenses:</strong> €
                {application.value_of_the_estate_after_expenses}
              </p>
              <div
                className='card-group p-2 mb-2'
                style={{ border: '0.5px solid grey' }}
              >
                <h6 className='card-subtitle mb-2'>Applicants</h6>
                <ul className='list-group list-group-flush'>
                  {application.applicants.map((applicant, index) => (
                    <li
                      key={index}
                      className='list-group-item bg-dark text-white'
                    >
                      <strong>{applicant.title}:</strong> {applicant.first_name}{' '}
                      {applicant.last_name} <br />
                      <strong>PPS Number:</strong> {applicant.pps_number}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className='card-group p-2 mb-2'
                style={{ border: '0.5px solid grey' }}
              >
                <h6 className='card-subtitle mb-2'>Estates</h6>
                <ul className='list-group list-group-flush'>
                  {application.estates.map((estate, index) => (
                    <li
                      key={index}
                      className='list-group-item bg-dark text-white'
                    >
                      <strong>{estate.description}:</strong> ${estate.value}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className='card-group p-2 mb-2'
                style={{ border: '0.5px solid grey' }}
              >
                <h6 className='card-subtitle mb-2'>Documents</h6>
                <ul className='list-group list-group-flush'>
                  {application.documents.map((doc, index) => (
                    <li
                      key={index}
                      className='list-group-item bg-dark text-white'
                    >
                      {doc.original_name}
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className='card-group p-2 mb-2'
                style={{ border: '0.5px solid grey' }}
              >
                <p className='card-text'>
                  <strong>Name:</strong> {application.user.name}
                </p>
                <p className='card-text'>
                  <strong>Email:</strong> {application.user.email}
                </p>
                <p className='card-text'>
                  <strong>Phone:</strong> {application.user.phone_number}
                </p>
                <p className='card-text'>
                  <strong>Address:</strong> {application.user.address.line1},{' '}
                  {application.user.address.line2},{' '}
                  {application.user.address.town_city},{' '}
                  {application.user.address.county}
                </p>
              </div>
              {issues.length > 0 && (
                <div
                  className='card-group bg-danger p-2 mb-2'
                  style={{ border: '0.5px solid grey' }}
                >
                  <h6 className=' mb-3'>Issues</h6>
                  <ul>
                    {issues.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </AnimatedWrapper>
      )}
    </>
  );
};

export default ApplicationSummaryCard;
