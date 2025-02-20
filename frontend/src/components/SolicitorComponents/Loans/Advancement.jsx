
import AssignedBadge from '../../GenericComponents/AssignedBadge';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../../GenericFunctions/HelperGenericFunctions';

const Advancement = ({ loan }) => {
  const navigate = useNavigate();
  console.log(loan);
  return (
    <div key={loan.id} className='card my-3 shadow'>
      <div
        className={`card-body ${
          loan.needs_committee_approval && loan.is_committee_approved === null
            ? 'bg-warning-subtle'
            : loan.needs_committee_approval &&
              loan.is_committee_approved === false
            ? 'bg-dark'
            : loan.is_paid_out
            ? 'bg-success-subtle'
            : 'bg-danger-subtle'
        } `}
      >
        <div className=' card-header text-center'>
          <h4
            className='card-title '
            style={{ cursor: 'pointer' }}
            onClick={() => {
              navigate(`/advancements/${loan.id}`); // Navigate to the loan details page on click
            }}
          >
            <span className='text-decoration-underline'>
              Advancement ID: {loan.id}
            </span>
            {loan.country && <sub> ({loan.country})</sub>}
          </h4>
          {loan.needs_committee_approval &&
          loan.is_committee_approved === null ? (
            <h5 className=' text-uppercase text-danger'>
              Committee approval needed
            </h5>
          ) : loan.needs_committee_approval &&
            loan.is_committee_approved === false ? (
            <h5 className=' text-uppercase text-danger'>
              Committee approval REJECTED
            </h5>
          ) : !loan.is_paid_out ? (
            <>
              {loan.is_committee_approved === true && (
                <h6 className=' text-uppercase text-success'>
                  Approved by committee
                </h6>
              )}
              <h5 className=' text-uppercase text-danger'>
                Advancement not paid out
              </h5>
            </>
          ) : (
            <>
              {loan.is_committee_approved === true && (
                <h6 className=' text-uppercase text-success'>
                  Approved by committee
                </h6>
              )}
              <h5 className=' text-success text-uppercase'>{`Advancement paid out on ${
                loan.paid_out_date
                  ? new Date(loan.paid_out_date).toISOString().split('T')[0]
                  : ''
              }`}</h5>
            </>
          )}
        </div>
        <AssignedBadge email={loan.assigned_to_email} />
        <div className='row mt-1 text-end'>
          <div className=' col-auto ms-auto'>
            <span className='badge bg-info shadow'>
              {' '}
              <strong>Approved By:</strong> {loan.approved_by_email}
            </span>
          </div>
          <div className=' col-auto'>
            <span className='badge bg-info shadow'>
              {' '}
              <strong>Last Updated By:</strong>{' '}
              {loan.last_updated_by_email ? loan.last_updated_by_email : 'N/A'}
            </span>
          </div>
          <div className=' col-auto'>
            <span
              className={`badge shadow ${
                !loan.is_settled ? 'bg-warning' : 'bg-success'
              }`}
            >
              {' '}
              <strong>Is Settled:</strong> {loan.is_settled ? 'Yes' : 'No'}
            </span>
          </div>
          <div className=' col-auto'>
            <span className='badge bg-info shadow'>
              {' '}
              <strong>Settled Date:</strong>{' '}
              {loan.settled_date ? loan.settled_date : 'N/A'}
            </span>
          </div>
        </div>
        <div className='row mt-3'>
          {/* IDs Column */}
          <div className='col-md-6'>
            <table className='table table-sm table-striped table-hover shadow'>
              <tbody>
                <tr
                  className=' link-info text-decoration-underline'
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    navigate(`/advancements/${loan.id}`); // Navigate to the loan details page on click
                  }}
                >
                  <td>
                    <strong>Advancement ID:</strong> {loan.id}
                  </td>
                </tr>
                <tr>
                  <td>
                    <Link
                      to={`/applications/${loan.application}`}
                      className='link-info text-decoration-underline'
                    >
                      <strong>Application ID:</strong> {loan.application}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Approved Date:</strong>{' '}
                    {formatDate(loan.approved_date)}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Term agreed:</strong> {loan.term_agreed}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Maturity Date:</strong>{' '}
                    {loan.maturity_date !== null ? (
                      formatDate(loan.maturity_date)
                    ) : (
                      <span className=' text-danger text-uppercase'>
                        Not paid out
                      </span>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Amounts Column */}
          <div className='col-md-6'>
            <table className='table table-sm table-striped table-hover shadow'>
              <tbody>
                <tr className=' border border-2 border-info'>
                  <td>
                    <strong>Current Balance:</strong> {loan.currency_sign}{' '}
                    {loan.current_balance}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Amount Paid:</strong> {loan.currency_sign}{' '}
                    {loan.amount_paid}
                  </td>
                </tr>
                <tr className=' border border-2 border-warning'>
                  <td>
                    <strong>Fee Agreed: </strong>
                    {loan.currency_sign} {loan.fee_agreed}
                  </td>
                </tr>
                <tr className=' border border-2 border-warning'>
                  <td>
                    <strong>Extension Fees Total: </strong> {loan.currency_sign}{' '}
                    {loan.extension_fees_total}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Amount Agreed:</strong> {loan.currency_sign}{' '}
                    {loan.amount_agreed}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advancement;
