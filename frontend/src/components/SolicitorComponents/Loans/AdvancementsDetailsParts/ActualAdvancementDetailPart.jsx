
import { Link } from 'react-router-dom';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import { formatDate } from '../../../GenericFunctions/HelperGenericFunctions';

const ActualAdvancementDetailPart = ({
  advancement,
  isEditing,
  handleInputChange,
}) => {
  return (
    <>
      {advancement ? (
        <div className='row'>
          <div className='col-md-6'>
            <ul className='list-group shadow'>
              <li className='list-group-item bg-info-subtle'>
                <strong>Current Balance:</strong> {advancement.currency_sign}{' '}
                {advancement.current_balance}
              </li>

              <li
                className={`list-group-item ${
                  advancement.amount_paid > 0 ? 'text-success' : ''
                }`}
              >
                <strong>Amount Paid:</strong> {advancement.currency_sign}{' '}
                {advancement.amount_paid}
              </li>
              <li
                className={`list-group-item ${
                  advancement.fee_agreed > 0 ? 'text-warning' : ''
                }`}
              >
                <strong>Fee Agreed: </strong>
                {isEditing ? (
                  <input
                    type='text'
                    className='form-control bg-danger-subtle'
                    name='fee_agreed'
                    value={advancement.fee_agreed}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>
                    {advancement.currency_sign} {advancement.fee_agreed}
                  </span>
                )}
              </li>
              <li
                className={`list-group-item ${
                  advancement.extension_fees_total > 0 ? 'text-warning' : ''
                }`}
              >
                <strong>Extension Fees Total:</strong>{' '}
                {advancement.currency_sign} {advancement.extension_fees_total}
              </li>

              <li className='list-group-item'>
                <strong>Term Agreed: </strong>
                {isEditing ? (
                  <input
                    type='text'
                    className='form-control bg-danger-subtle'
                    name='term_agreed'
                    value={advancement.term_agreed}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>{advancement.term_agreed} months</span>
                )}
              </li>
              <li className='list-group-item'>
                <strong>Amount Agreed: </strong>
                {isEditing ? (
                  <input
                    type='text'
                    className='form-control bg-danger-subtle'
                    name='amount_agreed'
                    value={advancement.amount_agreed}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span>
                    {advancement.currency_sign} {advancement.amount_agreed}
                  </span>
                )}
              </li>
            </ul>
          </div>

          <div className='col-md-6'>
            <ul className='list-group shadow'>
              <li className='list-group-item'>
                <strong>Approved Date:</strong>{' '}
                {formatDate(advancement.approved_date)}
              </li>
              <li className='list-group-item'>
                <strong>Maturity Date:</strong>{' '}
                {advancement.maturity_date !== null ? (
                  formatDate(advancement.maturity_date)
                ) : (
                  <span className=' text-danger text-uppercase'>
                    Not paid out
                  </span>
                )}
              </li>
              <li
                className={`list-group-item ${
                  !advancement.is_settled ? 'text-warning' : 'text-success'
                }`}
              >
                <strong>Is Settled:</strong>{' '}
                {advancement.is_settled ? 'Yes' : 'No'}
              </li>
              {advancement.is_settled && (
                <li className='list-group-item'>
                  <strong>Settled Date:</strong>{' '}
                  {formatDate(advancement.settled_date)}
                </li>
              )}
              <li className='list-group-item'>
                <strong>Approved By:</strong> {advancement.approved_by_email}
              </li>
              <li className='list-group-item'>
                <strong>Last Updated By:</strong>{' '}
                {advancement.last_updated_by_email}
              </li>
              <li className='list-group-item'>
                <Link
                  className=' link-underline-info'
                  to={`/applications/${advancement.application}`}
                >
                  <strong>Application ID:</strong> {advancement.application}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <LoadingComponent />
      )}
    </>
  );
};

export default ActualAdvancementDetailPart;
