import  { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {
  fetchData,
  patchData,
} from '../../../GenericFunctions/AxiosGenericFunctions';
import CommentForm from './CommentForm ';

const CommentsComponent = ({ applicationId, comments, setComments }) => {
  const [refresh, setRefresh] = useState(false);
  const token = Cookies.get('auth_token_agents');

  useEffect(() => {
    const fetchComments = async () => {
      if (applicationId) {
        const { access } = token;
        const endpoint = `/api/applications/comments/?application=${applicationId}`;
        try {
          const response = await fetchData(access, endpoint);
          // console.log(response);
          setComments(response.data);
        } catch (error) {
          console.error('Error fetching comments:', error);
        }
      }
    };

    fetchComments();
  }, [token, applicationId, setComments, refresh]);

  const handleCheckboxChange = async (commentId, field, value) => {
    const endpoint = `/api/applications/comments/${commentId}/`;
    const data = { [field]: value };
    try {
      const response = await patchData(endpoint, data);
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? { ...comment, [field]: value } : comment
        )
      );
      console.log(response);
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  return (
    <div>
      <CommentForm
        applicationId={applicationId}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      {comments != null && comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className='card mb-3'>
            <div
              className={`card-body ${
                comment.is_completed
                  ? 'bg-secondary-subtle'
                  : comment.is_important
                  ? 'bg-danger-subtle'
                  : 'bg-warning-subtle'
              }`}
            >
              <p className=' text-center text-black text fw-bold'>
                {comment.text}
              </p>
              <div className='card-footer'>
                <div className='row'>
                  <div className='col-md-4'>
                    <p className='card-text'>
                      <strong>Created On:</strong>{' '}
                      {new Date(comment.created_on).toLocaleDateString()}
                    </p>
                    <p className='card-text'>
                      <strong>Created By:</strong> {comment.created_by_email}
                    </p>
                  </div>
                  <div className='col-md-4'>
                    <p className='card-text'>
                      <strong>Updated On:</strong>{' '}
                      {new Date(comment.updated_on).toLocaleDateString()}
                    </p>
                    <p className='card-text'>
                      <strong>Updated By:</strong>{' '}
                      {comment.updated_by_email
                        ? comment.updated_by_email
                        : 'N/A'}
                    </p>
                  </div>
                  <div className='col-md-4 '>
                    <div className='form-check'>
                      <input
                        className='form-check-input '
                        type='checkbox'
                        checked={comment.is_important}
                        onChange={(e) =>
                          handleCheckboxChange(
                            comment.id,
                            'is_important',
                            e.target.checked
                          )
                        }
                        id={`important-${comment.id}`}
                      />
                      <label
                        className='form-check-label'
                        htmlFor={`important-${comment.id}`}
                      >
                        Is Important
                      </label>
                    </div>
                    <div className='form-check '>
                      <input
                        className='form-check-input '
                        type='checkbox'
                        checked={comment.is_completed}
                        onChange={(e) =>
                          handleCheckboxChange(
                            comment.id,
                            'is_completed',
                            e.target.checked
                          )
                        }
                        id={`completed-${comment.id}`}
                      />
                      <label
                        className='form-check-label'
                        htmlFor={`completed-${comment.id}`}
                      >
                        Is Completed
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <h5 className='text-info text-center my-5'>No comments added...</h5>
      )}
    </div>
  );
};

export default CommentsComponent;
