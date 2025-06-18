import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchData,
  patchData,
} from '../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';

const SolicitorPart = ({
  solicitor_id,
  application_id,
  refresh,
  setRefresh,
}) => {
  const token = Cookies.get('auth_token_agents');
  const [errors, setErrors] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [solicitors, setSolicitors] = useState(null);
  const [assignedSolicitor, setAssignedSolicitor] = useState(null);

  // useEffect to fetch all solicitors for logged-in user
  useEffect(() => {
    const fetchSolicitors = async () => {
      setIsLoading(true); // Set loading state before fetching
      if (token) {
        const endpoint = `/api/applications/solicitors/`;
        try {
          const response = await fetchData(token, endpoint);

          if (response.status === 200) {
            setSolicitors(response.data);
            setIsError(false);
          } else {
            setErrors(response.data);
            setIsError(true);
          }
        } catch (error) {
          console.error('Error fetching solicitors:', error);
          setErrors('An error occurred while fetching solicitors.');
          setIsError(true);
        } finally {
          setIsLoading(false); // Ensure loading state is turned off after fetching
        }
      }
    };

    fetchSolicitors();
  }, [token, refresh]); // Dependency on token and refresh

  // useEffect to setup selected Solicitor if any selected
  useEffect(() => {
    if (solicitors) {
      setIsLoading(true); // Start loading state for assignment setup
      const selectedSolicitor = solicitors.find(
        (solicitor) => solicitor.id === solicitor_id
      );

      if (selectedSolicitor) {
        setAssignedSolicitor(selectedSolicitor);
      } else {
        setAssignedSolicitor(null); // Reset if not found
      }

      setIsLoading(false); // End loading state
    }
  }, [solicitor_id, solicitors]);

  const updateSelectedSolicitor = async (solicitor_id) => {
    const data = {
      solicitor: solicitor_id,
    };

    try {
      const endpoint = `/api/applications/solicitor_applications/${application_id}/`;
      const response = await patchData(endpoint, data);
      if (response.status !== 200) {
        setIsError(true);
        setErrors(response.data);
      } else {
        setIsError(false);
        setRefresh(!refresh);
        setErrors({ Solicitor: 'updated' });
        setTimeout(() => {
          setErrors('');
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating application:', error);
      setIsError(true);
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors(error.message);
      }
    }
  };

  return (
    <div
      className='bg-white rounded-4 p-4 mb-4'
      style={{
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Header */}
      <div
        className='px-4 py-4 mb-4 rounded-3'
        style={{
          background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
          color: 'white',
        }}
      >
        <div className='row align-items-center'>
          <div className='col-lg-8'>
            <h5 className='mb-0 fw-bold d-flex align-items-center gap-2'>
              <svg
                width='20'
                height='20'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                  clipRule='evenodd'
                />
              </svg>
              Assigned Solicitor
            </h5>
          </div>
          <div className='col-lg-4 text-end'>
            <a
              className='btn px-4 py-2 fw-semibold rounded-3 d-inline-flex align-items-center gap-2'
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                fontSize: '0.875rem',
                textDecoration: 'none',
              }}
              href={`/communication/${application_id}`}
              target='_blank'
              rel='noopener noreferrer'
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <svg
                width='16'
                height='16'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z'
                  clipRule='evenodd'
                />
              </svg>
              Open Communication
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div
          className='d-flex align-items-center justify-content-center p-4 rounded-3'
          style={{
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            minHeight: '120px',
          }}
        >
          <div className='d-flex align-items-center gap-3'>
            <div
              className='spinner-border text-primary'
              role='status'
              style={{ width: '24px', height: '24px' }}
            >
              <span className='visually-hidden'>Loading...</span>
            </div>
            <span style={{ color: '#0369a1', fontSize: '0.875rem' }}>
              Loading solicitors...
            </span>
          </div>
        </div>
      ) : (
        <div className='row g-4'>
          <div className='col-md-6'>
            <label
              htmlFor='solicitor-select'
              className='form-label fw-semibold mb-2'
              style={{ color: '#374151', fontSize: '0.875rem' }}
            >
              Assigned Solicitor
            </label>
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
                    d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <select
                id='solicitor-select'
                className='form-control ps-5 py-3 border-0 rounded-3'
                style={{
                  backgroundColor: '#f3f4f6',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem',
                  cursor: 'not-allowed',
                }}
                onChange={(e) => updateSelectedSolicitor(e.target.value)}
                value={assignedSolicitor ? assignedSolicitor.id : ''}
                disabled
              >
                <option value='' disabled>
                  {assignedSolicitor
                    ? `${assignedSolicitor.title} ${assignedSolicitor.first_name} ${assignedSolicitor.last_name}`
                    : 'Select assigned solicitor'}
                </option>
                {solicitors &&
                  solicitors.map((solicitor) => (
                    <option
                      key={solicitor.id}
                      value={solicitor.id}
                      className={
                        solicitor.id === solicitor_id ? 'text-bg-info' : ''
                      }
                    >
                      {solicitor.title} {solicitor.first_name}{' '}
                      {solicitor.last_name}
                    </option>
                  ))}
              </select>
            </div>
            <small className='text-muted mt-1 d-block'>
              Solicitor assignment is managed by solicitors
            </small>
          </div>

          <div className='col-md-6 d-flex align-items-end'>
            <div className='w-100'>
              <Link
                className='btn w-100 py-3 fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2'
                style={{
                  background:
                    'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: 'white',
                  border: 'none',
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                }}
                to={`/solicitors/${application_id}`}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow =
                    '0 4px 12px rgba(99, 102, 241, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <svg
                  width='16'
                  height='16'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M10 12a2 2 0 100-4 2 2 0 000 4z' />
                  <path
                    fillRule='evenodd'
                    d='M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z'
                    clipRule='evenodd'
                  />
                </svg>
                View Solicitors for this Firm
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {isError && errors && (
        <div
          className='mt-4 p-4 rounded-3 d-flex align-items-center gap-3'
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
          }}
        >
          <div
            className='d-flex align-items-center justify-content-center rounded-2'
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#dc2626',
              color: 'white',
            }}
          >
            <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div>
            <h6 className='mb-1 fw-bold' style={{ color: '#dc2626' }}>
              Error
            </h6>
            <div style={{ color: '#dc2626', fontSize: '0.875rem' }}>
              {renderErrors(errors)}
            </div>
          </div>
        </div>
      )}

      {/* Info Message */}
      {!isError && (
        <div
          className='mt-4 p-4 rounded-3 d-flex align-items-center gap-3'
          style={{
            backgroundColor: '#fefbf3',
            border: '1px solid #fed7aa',
          }}
        >
          <div
            className='d-flex align-items-center justify-content-center rounded-2'
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#d97706',
              color: 'white',
            }}
          >
            <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div>
            <h6 className='mb-1 fw-bold' style={{ color: '#d97706' }}>
              Information
            </h6>
            <div style={{ color: '#92400e', fontSize: '0.875rem' }}>
              Solicitor can't be assigned or changed by the agent.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SolicitorPart;
