import { Fragment, useEffect } from 'react';
import LoadingComponent from '../../GenericComponents/LoadingComponent';

import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { fetchUser } from '../../../store/userSlice';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';

import Advancement from './Advancement';

const Loans = ({
  allLoans,
  errors,
  pageTitle,
  totalItems,
  isFiltered,
  handleClearAllFilters,
}) => {
  const token = Cookies.get('auth_token_agents');

  // const [errors, setErrors] = useState('');
  const dispatch = useDispatch();

  // Fetch user data when the component mounts or when the token changes
  useEffect(() => {
    dispatch(fetchUser());
  }, [token, dispatch]);

  return (
    <div
      className='bg-white'
      style={{
        borderRadius: '20px',
        border: '1px solid #d1d5db',
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Clean Professional Header - Advancement Theme */}
      <div
        className='bg-white border-bottom'
        style={{
          padding: '24px 32px',
          borderBottom: '2px solid #e5e7eb',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        }}
      >
        <div className='text-center'>
          <div className='d-flex align-items-center justify-content-center gap-3 mb-3'>
            <div
              className='d-flex align-items-center justify-content-center rounded-3'
              style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                border: '2px solid #2563eb',
                color: '#ffffff',
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
              className='mb-0 fw-bold'
              style={{
                fontSize: '1.875rem',
                fontWeight: '700',
                letterSpacing: '-0.025em',
                color: '#1e40af',
              }}
              dangerouslySetInnerHTML={{
                __html: pageTitle,
              }}
            ></h1>
          </div>

          <div className='d-flex align-items-center justify-content-center gap-4'>
            <span
              className='px-4 py-2 rounded-pill fw-semibold d-flex align-items-center gap-2'
              style={{
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                border: '1px solid #93c5fd',
                fontSize: '0.875rem',
                color: '#1e40af',
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
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
              {totalItems} Advancements
            </span>

            {isFiltered && (
              <button
                className='px-4 py-2 rounded-pill fw-medium border d-flex align-items-center gap-2'
                style={{
                  backgroundColor: '#fef3c7',
                  border: '1px solid #fbbf24',
                  color: '#d97706',
                  fontSize: '0.875rem',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#fde68a';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#fef3c7';
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
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        }}
      >
        {allLoans ? (
          <>
            {allLoans.length > 0 ? (
              <div className='row g-0'>
                <div className='col-12'>
                  {allLoans.map((loan, index) => (
                    <div
                      key={loan.id}
                      style={{
                        animation: `fadeInUp 0.3s ease-out ${
                          index * 0.03
                        }s both`,
                      }}
                    >
                      <Fragment>
                        <Advancement loan={loan} />
                      </Fragment>
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
                    background:
                      'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    border: '2px solid #93c5fd',
                    color: '#3b82f6',
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
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <h4 className='fw-bold mb-2' style={{ color: '#1e40af' }}>
                  No Advancements Found
                </h4>
                <p
                  className='mb-0'
                  style={{ fontSize: '0.9rem', color: '#64748b' }}
                >
                  {isFiltered
                    ? 'Try adjusting your filters to see more results.'
                    : 'There are currently no advancements to display.'}
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

      {/* Professional Error Display - Advancement Theme */}
      {errors && (
        <div
          className='mx-4 mb-4 p-4 rounded-3 border'
          style={{
            backgroundColor: '#fefce8',
            border: '1px solid #fbbf24',
          }}
        >
          <div className='d-flex align-items-center gap-3'>
            <div
              className='d-flex align-items-center justify-content-center rounded-2 flex-shrink-0'
              style={{
                width: '36px',
                height: '36px',
                backgroundColor: '#d97706',
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
              <h6 className='fw-bold mb-1' style={{ color: '#d97706' }}>
                Error Loading Advancements
              </h6>
              <div style={{ fontSize: '0.875rem', color: '#b45309' }}>
                {renderErrors(errors)}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
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

export default Loans;
