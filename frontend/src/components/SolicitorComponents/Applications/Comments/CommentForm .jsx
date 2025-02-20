import  { useState } from 'react';
import { postData } from '../../../GenericFunctions/AxiosGenericFunctions';

const CommentForm = ({ applicationId, refresh, setRefresh }) => {
  const [comment, setComment] = useState('');
  const token = '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const commObj = {
      text: comment,
      is_completed: false,
      is_important: false,
      application: applicationId,
    };
    try {
      const endpoint = `/api/applications/comments/`;
      await postData(token, endpoint, commObj);
      setRefresh(!refresh);
      // console.log('Comment added');
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
      console.error('Error creating new application:', error);
    } finally {
      setComment('');
    }
  };

  return (
    <form className='row' onSubmit={handleSubmit}>
      <div className='input-group mb-3 col-12'>
        <label htmlFor='commentInput' className='form-label visually-hidden'>
          Comment
        </label>
        <input
          type='text'
          className='form-control'
          id='commentInput'
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder='Enter new comment'
        />
        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
