import { useEffect } from 'react';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import Application from './Application';

import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../../../store/userSlice';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';

const Applications = ({
  applicationsAll,
  errors,
  setRefresh,
  pageTitle,
  totalItems,
  isFiltered,
  handleClearAllFilters,
}) => {
  const token = Cookies.get('auth_token_agents');
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser); // Fetch user data
  }, [token, dispatch]);

  return (
    <div
      className='bg-white'
      style={{
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Clean Professional Header */}
      <div
        className='bg-white border-bottom'
        style={{
          padding: '24px 32px',
          borderBottom: '2px solid #f3f4f6',
        }}
      >
        <div className='text-center'>
          <div className='d-flex align-items-center justify-content-center gap-3 mb-3'>
            <div
              className='d-flex align-items-center justify-content-center rounded-3'
              style={{
                width: '40px',
                height: '40px',
                background: '#f8fafc',
                border: '2px solid #e5e7eb',
                color: '#374151',
              }}
            >
              <svg
                width='20'
                height='20'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <h1
              className='mb-0 fw-bold text-dark'
              style={{
                fontSize: '1.875rem',
                fontWeight: '700',
                letterSpacing: '-0.025em',
                color: '#111827',
              }}
              dangerouslySetInnerHTML={{
                __html: pageTitle,
              }}
            ></h1>
          </div>

          <div className='d-flex align-items-center justify-content-center gap-4'>
            <span
              className='px-4 py-2 rounded-pill fw-semibold d-flex align-items-center gap-2 bg-light'
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e5e7eb',
                fontSize: '0.875rem',
                color: '#374151',
              }}
            >
              <svg
                width='14'
                height='14'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                  clipRule='evenodd'
                />
              </svg>
              {totalItems} Applications
            </span>

            {isFiltered && (
              <button
                className='px-4 py-2 rounded-pill fw-medium border d-flex align-items-center gap-2 bg-light'
                style={{
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#dc2626',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#fee2e2';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fef2f2';
                }}
                onClick={handleClearAllFilters}
              >
                <svg
                  width='12'
                  height='12'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Clean Content Area */}
      <div
        className='bg-white'
        style={{
          padding: '24px',
          minHeight: '400px',
        }}
      >
        {applicationsAll ? (
          <>
            {applicationsAll.length > 0 ? (
              <div className='row g-0'>
                <div className='col-12'>
                  {applicationsAll.map((application, index) => (
                    <div
                      key={application.id}
                      style={{
                        animation: `fadeInUp 0.3s ease-out ${
                          index * 0.03
                        }s both`,
                      }}
                    >
                      <Application
                        application={application}
                        onDelete={() => setRefresh((prev) => !prev)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className='d-flex flex-column align-items-center justify-content-center text-center'
                style={{ minHeight: '300px' }}
              >
                <div
                  className='d-flex align-items-center justify-content-center rounded-3 mb-4'
                  style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#f9fafb',
                    border: '2px solid #e5e7eb',
                    color: '#9ca3af',
                  }}
                >
                  <svg
                    width='32'
                    height='32'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <h4 className='fw-bold mb-2' style={{ color: '#374151' }}>
                  No Applications Found
                </h4>
                <p
                  className='mb-0'
                  style={{ fontSize: '0.9rem', color: '#6b7280' }}
                >
                  {isFiltered
                    ? 'Try adjusting your filters to see more results.'
                    : 'There are currently no applications to display.'}
                </p>
              </div>
            )}
          </>
        ) : (
          <div
            className='d-flex align-items-center justify-content-center'
            style={{ minHeight: '300px' }}
          >
            <LoadingComponent />
          </div>
        )}
      </div>

      {/* Professional Error Display */}
      {errors && (
        <div
          className='mx-4 mb-4 p-4 rounded-3 border'
          style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
          }}
        >
          <div className='d-flex align-items-center gap-3'>
            <div
              className='d-flex align-items-center justify-content-center rounded-2 flex-shrink-0'
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#dc2626',
                color: 'white',
              }}
            >
              <svg
                width='18'
                height='18'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div>
              <h6 className='fw-bold mb-1' style={{ color: '#dc2626' }}>
                Error Loading Applications
              </h6>
              <div style={{ fontSize: '0.875rem', color: '#b91c1c' }}>
                {renderErrors(errors)}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Applications;
