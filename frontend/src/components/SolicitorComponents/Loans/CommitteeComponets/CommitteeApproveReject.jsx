import  { useState } from 'react';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';
import { postData } from '../../../GenericFunctions/AxiosGenericFunctions';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import { useNavigate } from 'react-router-dom';

const CommitteeApproveReject = ({ advancement, refresh, setRefresh }) => {
  const [showRejectionMessageWindow, setShowRejectionMessageWindow] =
    useState(false);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(false);
  const [action, setAction] = useState('');
  const [errors, setErrors] = useState(null);
  const [posting, setPosting] = useState(false);

  const navigate = useNavigate();

  const renderMessage = () => {
    if (action === 'full_rejection') {
      return (
        <div className='alert alert-danger mt-3' role='alert'>
          <strong>Action Selected: Full Rejection</strong> <br />
          <br /> This action will record your response. <br />
          Until all committee members have submitted their responses, you may
          revise your decision. <br />
          Once all committee members have submitted their responses, the
          advancement will be either automatically fully rejected or approved,
          in accordance with the requirements for advancement approval.
        </div>
      );
    }
    if (action === 'refer_back') {
      return (
        <div className='alert alert-danger mt-3' role='alert'>
          <strong>Action Selected: Refer Back to Agent Assigned</strong> <br />
          <br />
          <strong className='text-danger'>WARNING!</strong> This action will
          immediately reset the advancement process. <br />
          <br />
          It will delete all committee member approvals or rejections, if any
          previously submitted. <br />
          It will also remove the advancement data and revert the application
          back to the assigned agent. <br />
          The application will return to its pre-approval state, as if it was
          never approved. <br />
          <br />
          <strong>Note:</strong> This action is irreversible and will be
          executed immediately, regardless of whether any committee members have
          already submitted their responses.
        </div>
      );
    }
    return null;
  };

  const postAproveReject = async (approved, rejection_reason = null) => {
    if (!approved && !rejection_reason) {
      setCommentError(true);
      return;
    }
    console.log(action);
    const confirm = window.confirm(
      `Are you sure that you want to ${
        approved
          ? 'approve'
          : action === 'full_rejection'
          ? 'reject'
          : 'refer back to agent assigned'
      } the advancement id: ${advancement.id}?`
    );

    if (confirm) {
      // console.log(
      //   `Posting advancement ${
      //     approved ? 'approved' : 'rejected'
      //   } with message ${rejection_reason}`
      // );
      setErrors(null); // Clear errors
      setPosting(true);

      const formData = {
        approved,
        rejection_reason,
      };
      try {
        let endpoint = `/api/loans/loans/${advancement.id}/approve_loan/`;
        if (action === 'refer_back') {
          endpoint = `/api/loans/loans/${advancement.id}/refer_back_to_agent/`;
        }
        const response = await postData('token', endpoint, formData);
        if (response.status === 200) {
          // console.log(`Advancement ${approved ? 'approved' : 'rejected'}`);
          setCommentError(false);
          setShowRejectionMessageWindow(false);
          setComment('');
          setPosting(false);

          if (action === 'refer_back') {
            navigate(`/applications/${advancement.application}`);
          } else {
            setRefresh(!refresh);
          }
        } else {
          setErrors(response.data);
          setPosting(false);
        }
      } catch (err) {
        setPosting(false);
        console.error('Error updating advancement:', err);
        setErrors(err.response.data || { error: 'An error occurred' });
      }
    }
  };

  const handleAcceptReject = (action) => {
    if (action === 'approve') {
      postAproveReject(true);
    } else {
      setShowRejectionMessageWindow(true);
    }
  };

  return (
    <>
      {advancement ? (
        <>
          <h5>
            Welcome committee member, please accept or reject the advancement
          </h5>
          {!showRejectionMessageWindow && (
            <div className='row d-flex align-items-center justify-content-evenly'>
              <div className='col-auto'>
                <button
                  className='btn btn-danger btn-sm'
                  onClick={() => setShowRejectionMessageWindow(true)}
                  disabled={posting}
                >
                  Reject
                </button>
              </div>
              <div className='col-auto'>
                <button
                  className='btn btn-success btn-sm'
                  onClick={() => handleAcceptReject('approve')}
                  disabled={posting}
                >
                  Approve
                </button>
              </div>
            </div>
          )}

          {showRejectionMessageWindow && (
            <div className='container mt-4'>
              <form>
                <div className='mb-3'>
                  {/* Action select dropdown */}
                  <label htmlFor='action' className='form-label'>
                    Action
                  </label>
                  <select
                    id='action'
                    className='form-select'
                    value={action} // Assume `action` is a state variable
                    onChange={(e) => setAction(e.target.value)} // Assume `setAction` updates the state
                  >
                    <option value=''>Select an action</option>
                    <option value='full_rejection'>Full Rejection</option>
                    <option value='refer_back'>
                      Refer Back to the Agent Assigned
                    </option>
                  </select>
                </div>

                <div className='mb-3'>
                  <label htmlFor='comment' className='form-label'>
                    Rejection reason
                  </label>
                  <textarea
                    id='comment'
                    className={`form-control ${
                      commentError ? 'is-invalid' : ''
                    }`}
                    rows='4'
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                      if (e.target.value) setCommentError(false); // Clear error if user types
                    }}
                    placeholder='Enter rejection reason'
                  ></textarea>
                  {commentError && (
                    <div className='invalid-feedback'>
                      Rejection reason is required.
                    </div>
                  )}
                </div>

                {renderMessage()}

                <div className='d-flex gap-2 align-items-center justify-content-end'>
                  <button
                    type='button'
                    className='btn btn-danger'
                    onClick={() => postAproveReject(false, comment)}
                    disabled={posting || action === ''}
                  >
                    Reject
                  </button>
                  <button
                    type='button'
                    className='btn btn-secondary'
                    onClick={() => {
                      setComment('');
                      setCommentError(false);
                      setShowRejectionMessageWindow(false);
                    }}
                    disabled={posting}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          {errors ? (
            <div className='alert alert-danger mt-2' role='alert'>
              {renderErrors(errors)}
            </div>
          ) : null}
        </>
      ) : (
        <LoadingComponent />
      )}
    </>
  );
};

export default CommitteeApproveReject;
