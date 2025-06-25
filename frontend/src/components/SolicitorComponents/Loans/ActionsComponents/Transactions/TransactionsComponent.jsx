import Cookies from 'js-cookie';
import { ArrowLeft, CreditCard, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchData } from '../../../../GenericFunctions/AxiosGenericFunctions';
import { formatMoney } from '../../../../GenericFunctions/HelperGenericFunctions';
import TransactionsTable from './TransactionsTable';

const TransactionsComponent = () => {
  const { advancementId } = useParams();
  const token = Cookies.get('auth_token_agents');
  const [transactions, setTransactions] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (token) {
        const { access } = token;
        const endpoint = `/api/loans/transactions/`;
        try {
          const response = await fetchData(access, endpoint);
          if (response.data) {
            const filteredTransactions = response.data.filter(
              (transaction) => transaction.loan === parseInt(advancementId)
            );
            setTransactions(filteredTransactions);
          }
        } catch (error) {
          console.error('Error fetching advancement details:', error);
        }
      }
    };

    fetchTransactions();
  }, [token, advancementId]);

  const totalAmount =
    transactions?.reduce(
      (sum, transaction) => sum + parseFloat(transaction.amount),
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
                  Transaction Management
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
                  <CreditCard size={16} style={{ color: '#22c55e' }} />
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.8rem',
                    }}
                  >
                    Total Transactions
                  </span>
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                  }}
                >
                  {transactions?.length || 0}
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
                  <TrendingUp size={16} style={{ color: '#3b82f6' }} />
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontSize: '0.8rem',
                    }}
                  >
                    Total Amount
                  </span>
                </div>
                <div
                  style={{
                    color: 'white',
                    fontSize: '1.2rem',
                    fontWeight: '700',
                  }}
                >
                  {formatMoney(totalAmount.toFixed(2), ' ')}
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
                    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: '12px',
                  padding: '8px',
                  color: 'white',
                }}
              >
                <CreditCard size={20} />
              </div>
              <h5 style={{ color: '#374151', fontWeight: '700', margin: 0 }}>
                Transaction History & Management
              </h5>
            </div>
          </div>

          {/* Card Body */}
          <div style={{ padding: '24px' }}>
            <TransactionsTable
              transactions={transactions}
              advancementId={advancementId}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsComponent;
