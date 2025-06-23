// LoanBookStatementModal.jsx
import { Calendar, FileText, TrendingUp, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fetchData } from '../../../../GenericFunctions/AxiosGenericFunctions';
import DatePicker from './DatePicker';
import StatementDisplay from './StatementDisplay';

const LoanBookStatementModal = ({ isOpen, onClose, advancement, token }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [statement, setStatement] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loanBookData, setLoanBookData] = useState(null);

  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const resetModal = () => {
    setStatement(null);
    setSelectedDate('');
    setError(null);
    setLoanBookData(null);
  };

  const generateStatement = async () => {
    if (!advancement?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const dateParam = selectedDate || getCurrentDate();
      const endpoint = `/api/loanbook/${advancement.id}/?date=${dateParam}`;

      const response = await fetchData(token, endpoint);
      console.log('LOANBOOK RESPONSE', response.data);

      if (response && response.status >= 200 && response.status < 300) {
        setStatement(response.data);
        setLoanBookData(response.data); // Store the loanbook data
      } else {
        setError('Failed to generate statement');
      }
    } catch (err) {
      setError('Error generating statement');
      console.error('Statement generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch loanbook data on modal open to get created_at
  useEffect(() => {
    if (!isOpen) {
      resetModal();
    } else if (isOpen && advancement?.id) {
      // Always fetch loanbook data when modal opens
      const fetchLoanBookData = async () => {
        try {
          const endpoint = `/api/loanbook/${advancement.id}/`;
          const response = await fetchData(token, endpoint);
          console.log('LOANBOOK DATA FOR DATE PICKER:', response.data);

          if (response && response.status >= 200 && response.status < 300) {
            setLoanBookData(response.data);
          }
        } catch (err) {
          console.error('Error fetching loanbook data:', err);
        }
      };
      fetchLoanBookData();
    }
  }, [isOpen, advancement?.id, token]);

  if (!isOpen) return null;

  return (
    <div
      className='modal-backdrop'
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.3s ease-out',
      }}
    >
      <div
        className='modal-content'
        style={{
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '24px',
          boxShadow:
            '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8)',
          maxWidth: statement ? '95vw' : '600px',
          width: '100%',
          maxHeight: '95vh',
          overflow: 'hidden',
          position: 'relative',
          animation: 'slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '24px 32px',
            borderRadius: '24px 24px 0 0',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="36" cy="24" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              opacity: 0.3,
            }}
          />

          <div className='d-flex align-items-center justify-content-between position-relative'>
            <div className='d-flex align-items-center gap-3'>
              <div className='bg-white bg-opacity-20 rounded-4 p-3'>
                <FileText size={24} color='white' />
              </div>
              <div>
                <h4 className='mb-1 text-white fw-bold'>
                  Advancement Statement
                </h4>
                <p
                  className='mb-0 text-white'
                  style={{ opacity: 0.9, fontSize: '0.9rem' }}
                >
                  Advancement #{advancement?.id}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className='btn bg-white bg-opacity-20 border-0 rounded-3 p-2 text-white'
              style={{ transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <X size={20} color={'black'} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            padding: statement ? '0' : '32px',
            maxHeight: 'calc(95vh - 120px)',
            overflowY: 'auto',
          }}
        >
          {!statement ? (
            <div style={{ padding: '32px' }}>
              {/* Date Selection Section */}
              <div className='mb-4'>
                <label className='form-label fw-semibold mb-3 d-flex align-items-center gap-2 text-dark'>
                  <Calendar size={18} style={{ color: '#667eea' }} />
                  Statement Date
                </label>

                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  placeholder='Select date for statement (leave empty for today)'
                  loanBookCreatedAt={loanBookData?.created_at}
                />

                {/* Show loading indicator while fetching loanbook data */}
                {!loanBookData && isOpen && (
                  <div className='mt-2 text-muted small'>
                    <div className='d-flex align-items-center gap-2'>
                      <div
                        className='spinner-border spinner-border-sm'
                        role='status'
                        aria-hidden='true'
                        style={{ width: '12px', height: '12px' }}
                      />
                      Loading available dates...
                    </div>
                  </div>
                )}

                <div className='mt-2 small text-muted'>
                  {selectedDate ? (
                    <span>
                      Statement will be generated for:{' '}
                      <strong>
                        {new Date(selectedDate).toLocaleDateString()}
                      </strong>
                    </span>
                  ) : (
                    <span>
                      Statement will be generated for:{' '}
                      <strong>Today ({new Date().toLocaleDateString()})</strong>
                    </span>
                  )}
                  {loanBookData?.created_at && (
                    <div className='mt-1'>
                      <span>
                        Advancement paid out:{' '}
                        {new Date(loanBookData.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                    border: '1px solid #fca5a5',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '24px',
                    color: '#dc2626',
                    fontSize: '0.9rem',
                  }}
                >
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={generateStatement}
                disabled={isLoading}
                style={{
                  background: isLoading
                    ? 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '16px 32px',
                  width: '100%',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isLoading
                    ? 'none'
                    : '0 8px 25px rgba(102, 126, 234, 0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow =
                      '0 12px 35px rgba(102, 126, 234, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow =
                      '0 8px 25px rgba(102, 126, 234, 0.4)';
                  }
                }}
              >
                <div className='d-flex align-items-center justify-content-center gap-2'>
                  {isLoading ? (
                    <>
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid rgba(255, 255, 255, 0.3)',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite',
                        }}
                      />
                      Generating Statement...
                    </>
                  ) : (
                    <>
                      <TrendingUp size={20} />
                      Generate Statement
                    </>
                  )}
                </div>
              </button>
            </div>
          ) : (
            <StatementDisplay
              statement={statement}
              advancement={advancement}
              onBack={() => setStatement(null)}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoanBookStatementModal;
