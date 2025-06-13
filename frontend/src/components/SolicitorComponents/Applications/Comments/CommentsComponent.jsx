import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
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

  const getCommentStyle = (comment) => {
    if (comment.is_completed) {
      return {
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        border: '1px solid #bbf7d0',
        iconColor: '#059669',
        icon: (
          <svg width='20' height='20' fill='#059669' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
              clipRule='evenodd'
            />
          </svg>
        ),
        badgeText: 'Completed',
        badgeStyle: { backgroundColor: '#059669', color: 'white' },
      };
    }
    if (comment.is_important) {
      return {
        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
        border: '1px solid #fecaca',
        iconColor: '#dc2626',
        icon: (
          <svg width='20' height='20' fill='#dc2626' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
              clipRule='evenodd'
            />
          </svg>
        ),
        badgeText: 'Important',
        badgeStyle: { backgroundColor: '#dc2626', color: 'white' },
      };
    }
    return {
      background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      border: '1px solid #fed7aa',
      iconColor: '#d97706',
      icon: (
        <svg width='20' height='20' fill='#d97706' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
            clipRule='evenodd'
          />
        </svg>
      ),
      badgeText: 'Pending',
      badgeStyle: { backgroundColor: '#d97706', color: 'white' },
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      {/* Modern Comment Form */}
      <div
        className='bg-white rounded-4 p-4 mb-4'
        style={{
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
        }}
      >
        <CommentForm
          applicationId={applicationId}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      </div>

      {/* Comments List */}
      {comments != null && comments.length > 0 ? (
        <div className='space-y-4'>
          {comments.map((comment) => {
            const style = getCommentStyle(comment);

            return (
              <div
                key={comment.id}
                className='rounded-4 overflow-hidden'
                style={{
                  background: style.background,
                  border: style.border,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  marginBottom: '16px',
                }}
              >
                {/* Comment Header */}
                <div
                  className='px-4 py-3 border-bottom'
                  style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}
                >
                  <div className='d-flex align-items-center justify-content-between'>
                    <div className='d-flex align-items-center gap-3'>
                      <div
                        className='d-flex align-items-center justify-content-center rounded-2'
                        style={{
                          width: '32px',
                          height: '32px',
                          backgroundColor: style.iconColor + '20',
                          color: style.iconColor,
                        }}
                      >
                        {style.icon}
                      </div>
                      <span
                        className='badge px-3 py-2 rounded-pill fw-semibold'
                        style={{
                          ...style.badgeStyle,
                          fontSize: '0.75rem',
                        }}
                      >
                        {style.badgeText}
                      </span>
                    </div>

                    <div className='text-muted' style={{ fontSize: '0.8rem' }}>
                      #{comment.id}
                    </div>
                  </div>
                </div>

                {/* Comment Content */}
                <div className='px-4 py-4'>
                  <p
                    className='mb-4 fw-medium'
                    style={{
                      fontSize: '1rem',
                      lineHeight: '1.6',
                      color: '#111827',
                    }}
                  >
                    {comment.text}
                  </p>

                  {/* Comment Footer */}
                  <div className='row g-4'>
                    {/* Creation Info */}
                    <div className='col-lg-4'>
                      <div
                        className='p-3 rounded-3'
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        <h6
                          className='fw-bold mb-2'
                          style={{ fontSize: '0.8rem', color: '#374151' }}
                        >
                          Created
                        </h6>
                        <p
                          className='mb-1'
                          style={{ fontSize: '0.875rem', color: '#111827' }}
                        >
                          {formatDate(comment.created_on)}
                        </p>
                        <p
                          className='mb-0 text-muted'
                          style={{ fontSize: '0.75rem' }}
                        >
                          by {comment.created_by_email}
                        </p>
                      </div>
                    </div>

                    {/* Update Info */}
                    <div className='col-lg-4'>
                      <div
                        className='p-3 rounded-3'
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        <h6
                          className='fw-bold mb-2'
                          style={{ fontSize: '0.8rem', color: '#374151' }}
                        >
                          Last Updated
                        </h6>
                        <p
                          className='mb-1'
                          style={{ fontSize: '0.875rem', color: '#111827' }}
                        >
                          {formatDate(comment.updated_on)}
                        </p>
                        <p
                          className='mb-0 text-muted'
                          style={{ fontSize: '0.75rem' }}
                        >
                          by {comment.updated_by_email || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Status Controls */}
                    <div className='col-lg-4'>
                      <div
                        className='p-3 rounded-3'
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
                      >
                        <h6
                          className='fw-bold mb-3'
                          style={{ fontSize: '0.8rem', color: '#374151' }}
                        >
                          Status
                        </h6>

                        {/* Modern Toggle Switches */}
                        <div className='d-flex flex-column gap-3'>
                          {/* Important Toggle */}
                          <div className='d-flex align-items-center gap-3'>
                            <div className='position-relative'>
                              <input
                                className='position-absolute opacity-0'
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
                                style={{
                                  width: '44px',
                                  height: '24px',
                                  cursor: 'pointer',
                                  zIndex: 2,
                                }}
                              />
                              <div
                                className='rounded-pill position-relative d-flex align-items-center'
                                style={{
                                  width: '44px',
                                  height: '24px',
                                  background: comment.is_important
                                    ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
                                    : 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
                                  transition: 'all 0.3s ease',
                                  cursor: 'pointer',
                                }}
                              >
                                <div
                                  className='position-absolute bg-white rounded-circle'
                                  style={{
                                    width: '18px',
                                    height: '18px',
                                    left: comment.is_important ? '23px' : '3px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                                  }}
                                ></div>
                              </div>
                            </div>
                            <label
                              className='mb-0 fw-medium user-select-none'
                              htmlFor={`important-${comment.id}`}
                              style={{
                                fontSize: '0.8rem',
                                color: '#374151',
                                cursor: 'pointer',
                              }}
                            >
                              Important
                            </label>
                          </div>

                          {/* Completed Toggle */}
                          <div className='d-flex align-items-center gap-3'>
                            <div className='position-relative'>
                              <input
                                className='position-absolute opacity-0'
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
                                style={{
                                  width: '44px',
                                  height: '24px',
                                  cursor: 'pointer',
                                  zIndex: 2,
                                }}
                              />
                              <div
                                className='rounded-pill position-relative d-flex align-items-center'
                                style={{
                                  width: '44px',
                                  height: '24px',
                                  background: comment.is_completed
                                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                    : 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
                                  transition: 'all 0.3s ease',
                                  cursor: 'pointer',
                                }}
                              >
                                <div
                                  className='position-absolute bg-white rounded-circle'
                                  style={{
                                    width: '18px',
                                    height: '18px',
                                    left: comment.is_completed ? '23px' : '3px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
                                  }}
                                ></div>
                              </div>
                            </div>
                            <label
                              className='mb-0 fw-medium user-select-none'
                              htmlFor={`completed-${comment.id}`}
                              style={{
                                fontSize: '0.8rem',
                                color: '#374151',
                                cursor: 'pointer',
                              }}
                            >
                              Completed
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className='bg-white rounded-4 p-5 text-center'
          style={{
            boxShadow:
              '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e5e7eb',
          }}
        >
          <div
            className='d-flex align-items-center justify-content-center rounded-3 mx-auto mb-3'
            style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#f3f4f6',
              color: '#9ca3af',
            }}
          >
            <svg width='32' height='32' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <h5 className='fw-bold mb-2' style={{ color: '#374151' }}>
            No Comments Yet
          </h5>
          <p className='mb-0 text-muted' style={{ fontSize: '0.9rem' }}>
            Add the first comment to start the conversation about this
            application.
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentsComponent;
