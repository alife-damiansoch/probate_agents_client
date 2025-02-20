import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ActionsPart = ({
  advancement,
  showReferenceNumberPart,
  setShowReferenceNumberPart,
  markAdvancementPaidOutHandler,
  payOutReferenceNumber,
  setPayOutReferenceNumber,
}) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  return (
    <div className=' card-footer '>
      <div className=' card-header'>
        <div className='card-subtitle'>
          <h5 className=' text-center text-info-emphasis'>Actions</h5>
        </div>
      </div>
      <div className=' card-body'>
        {!advancement.is_settled ? (
          <div className=' d-flex align-items-center justify-content-evenly'>
            <button
              className=' btn btn-sm btn-outline-info shadow'
              onClick={() => {
                navigate(`/transactions/${advancement.id}`);
              }}
              disabled={!advancement.is_paid_out}
            >
              Transactions
            </button>
            <button
              className=' btn btn-sm btn-outline-info shadow'
              onClick={() => {
                navigate(`/extentions/${advancement.id}`);
              }}
              disabled={!advancement.is_paid_out}
            >
              Extentions
            </button>
            <button
              className=' btn btn-sm btn-danger shadow'
              onClick={() => {
                navigate(`/settle_advancement/${advancement.id}`);
              }}
              disabled={!advancement.is_paid_out}
            >
              Settle advancement
            </button>
          </div>
        ) : (
          <h6 className=' text-center'>
            Actions buttons are not available for settled advance
          </h6>
        )}
        {!advancement.is_paid_out && (
          <>
            <div className=' card-footer text-center text-info mt-2'>
              Actions are not available for not paid out advancement.
            </div>
            {user &&
              user.teams &&
              user.teams.some((team) => team.name === 'finance') && (
                <>
                  <button
                    className='btn btn-sm btn-danger w-100 mt-2'
                    onClick={() => {
                      setShowReferenceNumberPart(!showReferenceNumberPart);
                    }}
                    disabled={
                      advancement.needs_committee_approval &&
                      !advancement.is_committee_approved
                    }
                  >
                    {advancement.needs_committee_approval &&
                    advancement.is_committee_approved === null
                      ? 'Awaiting committee approval ...'
                      : advancement.needs_committee_approval &&
                        advancement.is_committee_approved === false
                      ? 'Advancement rejected by the committee'
                      : 'Set advancement is paid out'}
                  </button>
                  {showReferenceNumberPart && (
                    <div className='container  mt-4'>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault(); // Prevents default form submission
                          markAdvancementPaidOutHandler(); // Calls your submit function
                        }}
                      >
                        <div className='mb-3'>
                          <label htmlFor='inputField' className='form-label'>
                            Enter pay out reference number
                          </label>
                          <input
                            type='text'
                            id='inputField'
                            className='form-control form-control-sm bg-info-subtle'
                            value={payOutReferenceNumber}
                            onChange={(e) =>
                              setPayOutReferenceNumber(e.target.value)
                            }
                            placeholder='ref...'
                            required
                          />
                        </div>
                        <div className='text-end'>
                          <button
                            type='submit'
                            className='btn btn-primary btn-sm'
                          >
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </>
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActionsPart;
