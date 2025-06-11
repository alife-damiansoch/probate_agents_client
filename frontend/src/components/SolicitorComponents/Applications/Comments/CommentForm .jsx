import { useState } from 'react';
import { postData } from '../../../GenericFunctions/AxiosGenericFunctions';

const CommentForm = ({ applicationId, refresh, setRefresh }) => {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const token = '';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      setError('Please enter a comment before submitting.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    const commObj = {
      text: comment.trim(),
      is_completed: false,
      is_important: false,
      application: applicationId,
    };

    try {
      const endpoint = `/api/applications/comments/`;
      await postData(token, endpoint, commObj);
      setRefresh(!refresh);
      setComment('');
      setError('');
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(error.response.data);
        setError('Failed to add comment. Please try again.');
      } else {
        console.log(error.message);
        setError('Network error. Please check your connection.');
      }
      console.error('Error creating new comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setComment(e.target.value);
    if (error) setError(''); // Clear error when user starts typing
  };

  return (
    <div style={{ paddingBottom: '50px' }}>
      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className='mb-3'>
          <div className='position-relative'>
            <div
              className='position-absolute start-0 top-50 translate-middle-y ms-3'
              style={{ color: '#9ca3af', zIndex: 10 }}
            >
              <svg
                width='16'
                height='16'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <textarea
              className='form-control ps-5 py-3 border-0 rounded-3'
              style={{
                backgroundColor: '#f9fafb',
                border: error ? '2px solid #ef4444' : '1px solid #e5e7eb',
                fontSize: '0.875rem',
                minHeight: '80px',
                resize: 'vertical',
                transition: 'all 0.2s ease',
              }}
              id='commentInput'
              value={comment}
              onChange={handleInputChange}
              placeholder='Add a comment...'
              rows={2}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = error ? '#ef4444' : '#e5e7eb';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Error message only */}
          {error && (
            <div
              className='d-flex align-items-center gap-2 mt-2'
              style={{ color: '#ef4444', fontSize: '0.75rem' }}
            >
              <svg
                width='14'
                height='14'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className='d-flex gap-3 justify-content-end'>
          <button
            type='button'
            className='btn px-4 py-2 rounded-3 fw-medium'
            style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
              fontSize: '0.875rem',
            }}
            onClick={() => {
              setComment('');
              setError('');
            }}
            disabled={!comment.trim() || isSubmitting}
            onMouseEnter={(e) => {
              if (!e.target.disabled) {
                e.target.style.backgroundColor = '#e5e7eb';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.target.disabled) {
                e.target.style.backgroundColor = '#f3f4f6';
              }
            }}
          >
            Clear
          </button>

          <button
            type='submit'
            className='btn px-4 py-2 rounded-3 fw-medium d-flex align-items-center gap-2'
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              color: 'white',
              border: 'none',
              fontSize: '0.875rem',
              minWidth: '120px',
            }}
            disabled={!comment.trim() || isSubmitting}
            onMouseEnter={(e) => {
              if (!e.target.disabled) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!e.target.disabled) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {isSubmitting ? (
              <>
                <div
                  className='spinner-border spinner-border-sm'
                  role='status'
                  style={{ width: '14px', height: '14px' }}
                >
                  <span className='visually-hidden'>Loading...</span>
                </div>
                Adding...
              </>
            ) : (
              <>
                <svg
                  width='14'
                  height='14'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
                    clipRule='evenodd'
                  />
                </svg>
                Add Comment
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
