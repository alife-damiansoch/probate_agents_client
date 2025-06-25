import Cookies from 'js-cookie';
import { ArrowLeft, Calendar, Clock, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchData } from '../../../../GenericFunctions/AxiosGenericFunctions';
import ExtensionsTable from './ExtentionsTable';

const ExtentionsComponent = () => {
  const { advancementId } = useParams();
  const token = Cookies.get('auth_token_agents');
  const [extentions, setExtentions] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (advancementId && token) {
      const fetchExtentions = async () => {
        if (token) {
          const { access } = token;
          const endpoint = `/api/loans/loan_extensions/`;
          try {
            const response = await fetchData(access, endpoint);
            if (response.data) {
              const filteredExtentions = response.data.filter(
                (extention) => extention.loan === parseInt(advancementId)
              );
              setExtentions(filteredExtentions);
            }
          } catch (error) {
            console.error('Error fetching advancement details:', error);
          }
        }
      };

      fetchExtentions();
    }
  }, [advancementId, token]);

  const totalExtensionFees =
    extentions?.reduce(
      (sum, extension) => sum + parseFloat(extension.extension_fee),
      0
    ) || 0;
  const totalMonths =
    extentions?.reduce(
      (sum, extension) => sum + parseInt(extension.extension_term_months),
      0
    ) || 0;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
        minHeight: '100vh',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          padding: '24px 32px',
          borderBottom: '1px solid #e5e7eb',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative background elements */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            background:
              'linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
            borderRadius: '50%',
            zIndex: 1,
          }}
        />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className='d-flex justify-content-between align-items-start'>
            <div className='d-flex align-items-center gap-3 mb-3'>
              <button
                onClick={() => navigate(-1)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h3 className='mb-1 text-white fw-bold'>
                  Extension Management
                </h3>
                <p
                  className='mb-0 text-white'
                  style={{ opacity: 0.8, fontSize: '0.9rem' }}
                >
                  Advancement ID: {advancementId}
                </p>
              </div>
            </div>

            {/* Stats Summary */}
            <div className='d-flex gap-4'>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  textAlign: 'center',
                }}
              >
                <div className='d-flex align-items-center gap-2 mb-1'>
                  <Clock size={16} style={{ color: '#8b5cf6' }} />
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.8rem',
                    }}
                  >
                    Total Extensions
                  </span>
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                  }}
                >
                  {extentions?.length || 0}
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  textAlign: 'center',
                }}
              >
                <div className='d-flex align-items-center gap-2 mb-1'>
                  <Calendar size={16} style={{ color: '#f59e0b' }} />
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.8rem',
                    }}
                  >
                    Total Months
                  </span>
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                  }}
                >
                  {totalMonths}
                </div>
              </div>
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  textAlign: 'center',
                }}
              >
                <div className='d-flex align-items-center gap-2 mb-1'>
                  <TrendingUp size={16} style={{ color: '#22c55e' }} />
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.8rem',
                    }}
                  >
                    Total Fees
                  </span>
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                  }}
                >
                  €{totalExtensionFees.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '32px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e2e8f0',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
          }}
        >
          {/* Card Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              padding: '20px 24px',
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            <div className='d-flex align-items-center gap-3'>
              <div
                style={{
                  background:
                    'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  borderRadius: '12px',
                  padding: '8px',
                  color: 'white',
                }}
              >
                <Clock size={20} />
              </div>
              <h5 style={{ color: '#374151', fontWeight: '700', margin: 0 }}>
                Extension History & Management
              </h5>
            </div>
          </div>

          {/* Card Body */}
          <div style={{ padding: '24px' }}>
            <ExtensionsTable
              extensions={extentions}
              advancementId={advancementId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtentionsComponent;
