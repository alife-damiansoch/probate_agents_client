// StatementDisplay.jsx
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Receipt,
  TrendingUp,
} from 'lucide-react';
import { formatMoney } from '../../../../GenericFunctions/HelperGenericFunctions';

const StatementDisplay = ({ statement, advancement, onBack }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Extract the actual statement data - it's nested in statement.statement
  const statementData = statement.statement || statement;

  // Get the actual fee percentages from the loanbook data
  const initialFeePercentage = statement.initial_fee_percentage || '15.00';
  const dailyFeePercentage =
    statement.daily_fee_after_year_percentage || '1.50';
  const exitFeePercentage = statement.exit_fee_percentage || '1.50';

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color = '#667eea',
    subtext,
  }) => (
    <div
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: `2px solid ${color}20`,
        borderRadius: '16px',
        padding: '20px',
        transition: 'all 0.3s ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = `0 8px 25px ${color}20`;
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      }}
    >
      <div className='d-flex align-items-center gap-3 mb-2'>
        <div
          style={{
            background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
            borderRadius: '12px',
            padding: '8px',
            color: 'white',
          }}
        >
          <Icon size={18} />
        </div>
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: '600',
            color: '#6b7280',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {title}
        </span>
      </div>
      <div
        style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: subtext ? '4px' : '0',
        }}
      >
        {value}
      </div>
      {subtext && (
        <div style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{subtext}</div>
      )}
    </div>
  );

  const SegmentCard = ({ segment, index }) => (
    <div
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.target.style.borderColor = '#667eea';
        e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.1)';
      }}
      onMouseLeave={(e) => {
        e.target.style.borderColor = '#e5e7eb';
        e.target.style.boxShadow = 'none';
      }}
    >
      <div className='d-flex justify-content-between align-items-start mb-3'>
        <div>
          <h6
            style={{ color: '#374151', fontWeight: '600', marginBottom: '4px' }}
          >
            Period {index + 1}
          </h6>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
            {formatDate(segment.start)} → {formatDate(segment.end)}
          </p>
        </div>
        <div
          style={{
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
            borderRadius: '8px',
            padding: '4px 8px',
            fontSize: '0.75rem',
            fontWeight: '600',
            color: '#374151',
          }}
        >
          {segment.days} days
        </div>
      </div>

      <div className='row g-3'>
        <div className='col-4'>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#9ca3af',
                marginBottom: '4px',
              }}
            >
              PRINCIPAL
            </div>
            <div
              style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#374151',
              }}
            >
              {formatMoney(segment.principal, advancement.currency_sign)}
            </div>
          </div>
        </div>
        <div className='col-4'>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#9ca3af',
                marginBottom: '4px',
              }}
            >
              INTEREST
            </div>
            <div
              style={{
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#ef4444',
              }}
            >
              {formatMoney(segment.interest, advancement.currency_sign)}
            </div>
          </div>
        </div>
        <div className='col-4'>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontSize: '0.75rem',
                color: '#9ca3af',
                marginBottom: '4px',
              }}
            >
              TOTAL
            </div>
            <div
              style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: '#1f2937',
              }}
            >
              {formatMoney(segment.total, advancement.currency_sign)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const TransactionCard = ({ transaction, index }) => (
    <div
      style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        border: '1px solid #bbf7d0',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '12px',
      }}
    >
      <div className='d-flex justify-content-between align-items-center'>
        <div className='d-flex align-items-center gap-3'>
          <div
            style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              borderRadius: '8px',
              padding: '6px',
              color: 'white',
            }}
          >
            <CreditCard size={16} />
          </div>
          <div>
            <div
              style={{
                fontWeight: '600',
                color: '#166534',
                fontSize: '0.9rem',
              }}
            >
              Payment #{index + 1}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#15803d' }}>
              {transaction.description || 'Payment transaction'}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{ fontWeight: '700', color: '#166534', fontSize: '1.1rem' }}
          >
            {formatMoney(transaction.amount, advancement.currency_sign)}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#15803d' }}>
            {formatDate(transaction.date)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
        minHeight: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          padding: '24px 32px',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <div className='d-flex align-items-center gap-3 mb-3'>
          <button
            onClick={onBack}
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
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h3 className='mb-1 text-white fw-bold'>Loan Statement</h3>
            <p
              className='mb-0 text-white'
              style={{ opacity: 0.8, fontSize: '0.9rem' }}
            >
              Generated on {formatDate(statementData.date)}
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        {/* Summary Cards */}
        <div className='row g-4 mb-5'>
          <div className='col-md-3'>
            <StatCard
              title='Total Due'
              value={formatMoney(
                statementData.total_due,
                advancement.currency_sign
              )}
              icon={DollarSign}
              color='#ef4444'
              subtext='Including all fees'
            />
          </div>
          <div className='col-md-3'>
            <StatCard
              title='Initial Amount'
              value={formatMoney(
                statementData.initial_amount,
                advancement.currency_sign
              )}
              icon={TrendingUp}
              color='#3b82f6'
              subtext='Principal loan amount'
            />
          </div>
          <div className='col-md-3'>
            <StatCard
              title='Yearly Interest'
              value={formatMoney(
                statementData.yearly_interest || statementData.initial_fee || 0,
                advancement.currency_sign
              )}
              icon={FileText}
              color='#8b5cf6'
              subtext={`First year fee (${initialFeePercentage}%)`}
            />
          </div>
          <div className='col-md-3'>
            <StatCard
              title='Exit Fee'
              value={formatMoney(
                statementData.exit_fee,
                advancement.currency_sign
              )}
              icon={Receipt}
              color='#f59e0b'
              subtext={`Settlement fee (${exitFeePercentage}%)`}
            />
          </div>
        </div>

        {/* Daily Interest Card - Only show if exists */}
        {statementData.daily_interest_total &&
          parseFloat(statementData.daily_interest_total) > 0 && (
            <div className='row g-4 mb-5'>
              <div className='col-12'>
                <div
                  style={{
                    background:
                      'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    border: '2px solid #f59e0b',
                    borderRadius: '16px',
                    padding: '24px',
                  }}
                >
                  <div className='d-flex align-items-center gap-3 mb-3'>
                    <div
                      style={{
                        background:
                          'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        borderRadius: '12px',
                        padding: '8px',
                        color: 'white',
                      }}
                    >
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h5
                        style={{
                          color: '#92400e',
                          fontWeight: '700',
                          margin: 0,
                        }}
                      >
                        Compound Daily Interest (After Year 1)
                      </h5>
                      <p
                        style={{
                          color: '#a16207',
                          fontSize: '0.9rem',
                          margin: 0,
                        }}
                      >
                        {dailyFeePercentage}% compound interest per day beyond
                        first year
                      </p>
                    </div>
                  </div>

                  <div className='text-center'>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#a16207',
                        marginBottom: '4px',
                      }}
                    >
                      TOTAL COMPOUND INTEREST
                    </div>
                    <div
                      style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        color: '#92400e',
                      }}
                    >
                      {formatMoney(
                        statementData.daily_interest_total,
                        advancement.currency_sign
                      )}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#a16207' }}>
                      Compounded at {dailyFeePercentage}% per day
                    </div>
                  </div>

                  {/* Professional calculation breakdown */}
                  <div
                    style={{
                      marginTop: '20px',
                      padding: '16px',
                      background: 'rgba(255, 255, 255, 0.4)',
                      borderRadius: '8px',
                      border: '1px solid rgba(217, 119, 6, 0.2)',
                    }}
                  >
                    <h6
                      style={{
                        color: '#92400e',
                        fontWeight: '600',
                        fontSize: '0.9rem',
                        marginBottom: '8px',
                        textAlign: 'center',
                      }}
                    >
                      Total Due Calculation
                    </h6>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#a16207',
                        lineHeight: '1.4',
                        textAlign: 'center',
                      }}
                    >
                      <strong>Total Amount Due</strong> = Initial Loan Amount +
                      Yearly Interest ({initialFeePercentage}%) + Compound Daily
                      Interest + Exit Fee ({exitFeePercentage}%)
                      <br />
                      <span
                        style={{ fontSize: '0.75rem', fontStyle: 'italic' }}
                      >
                        Daily compound interest applies only after the first
                        year at {dailyFeePercentage}% per day
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        {/* Day by Day Breakdown */}
        {statementData.daily_breakdown &&
          statementData.daily_breakdown.length > 0 && (
            <div className='mb-5'>
              <div className='d-flex align-items-center gap-2 mb-4'>
                <Calendar size={20} style={{ color: '#667eea' }} />
                <h5 style={{ color: '#374151', fontWeight: '700', margin: 0 }}>
                  Day-by-Day Breakdown
                </h5>
              </div>

              <div
                style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                }}
              >
                <table className='table table-striped table-hover mb-0'>
                  <thead
                    style={{
                      background: '#f8fafc',
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                    }}
                  >
                    <tr>
                      <th
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          color: '#6b7280',
                          padding: '12px',
                        }}
                      >
                        Day
                      </th>
                      <th
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          color: '#6b7280',
                          padding: '12px',
                        }}
                      >
                        Date
                      </th>
                      <th
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          color: '#6b7280',
                          padding: '12px',
                        }}
                      >
                        Type
                      </th>
                      <th
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          color: '#6b7280',
                          padding: '12px',
                        }}
                      >
                        Rate
                      </th>
                      <th
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          color: '#6b7280',
                          padding: '12px',
                        }}
                      >
                        Interest/Payment
                      </th>
                      <th
                        style={{
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          color: '#6b7280',
                          padding: '12px',
                        }}
                      >
                        Running Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {statementData.daily_breakdown.map((day, index) => (
                      <tr
                        key={index}
                        style={{
                          backgroundColor:
                            day.type === 'Payment'
                              ? '#f0fdf4'
                              : day.type === 'Exit Fee'
                              ? '#fef2f2'
                              : day.type === 'Yearly Interest Applied'
                              ? '#eff6ff'
                              : day.type === 'Daily Compound Interest'
                              ? '#fefce8'
                              : 'transparent',
                        }}
                      >
                        <td
                          style={{
                            padding: '8px 12px',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                          }}
                        >
                          {day.day}
                        </td>
                        <td style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
                          {formatDate(day.date)}
                        </td>
                        <td style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
                          <span
                            style={{
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              backgroundColor:
                                day.type === 'Payment'
                                  ? '#dcfce7'
                                  : day.type === 'Exit Fee'
                                  ? '#fee2e2'
                                  : day.type === 'Yearly Interest Applied'
                                  ? '#dbeafe'
                                  : day.type === 'Daily Compound Interest'
                                  ? '#fef3c7'
                                  : '#f3f4f6',
                              color:
                                day.type === 'Payment'
                                  ? '#166534'
                                  : day.type === 'Exit Fee'
                                  ? '#dc2626'
                                  : day.type === 'Yearly Interest Applied'
                                  ? '#1d4ed8'
                                  : day.type === 'Daily Compound Interest'
                                  ? '#d97706'
                                  : '#6b7280',
                            }}
                          >
                            {day.type}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: '8px 12px',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                          }}
                        >
                          {day.interest_rate || 'N/A'}
                        </td>
                        <td
                          style={{
                            padding: '8px 12px',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                          }}
                        >
                          {day.payment_amount ? (
                            <span style={{ color: '#16a34a' }}>
                              -
                              {formatMoney(
                                day.payment_amount,
                                advancement.currency_sign
                              )}
                            </span>
                          ) : day.interest_amount ? (
                            <span style={{ color: '#dc2626' }}>
                              +
                              {formatMoney(
                                day.interest_amount,
                                advancement.currency_sign
                              )}
                            </span>
                          ) : (
                            <span style={{ color: '#6b7280' }}>$0.00</span>
                          )}
                        </td>
                        <td
                          style={{
                            padding: '8px 12px',
                            fontSize: '0.9rem',
                            fontWeight: '700',
                          }}
                        >
                          {formatMoney(
                            day.running_total,
                            advancement.currency_sign
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {/* Transactions Section */}
        {statementData.transactions &&
          statementData.transactions.length > 0 && (
            <div className='mb-5'>
              <div className='d-flex align-items-center gap-2 mb-4'>
                <CreditCard size={20} style={{ color: '#22c55e' }} />
                <h5 style={{ color: '#374151', fontWeight: '700', margin: 0 }}>
                  Payment History
                </h5>
              </div>
              {statementData.transactions.map((transaction, index) => (
                <TransactionCard
                  key={index}
                  transaction={transaction}
                  index={index}
                />
              ))}
            </div>
          )}

        {/* Segments Section */}
        <div>
          <div className='d-flex align-items-center gap-2 mb-4'>
            <Calendar size={20} style={{ color: '#667eea' }} />
            <h5 style={{ color: '#374151', fontWeight: '700', margin: 0 }}>
              Interest Calculation Periods
            </h5>
          </div>
          {statementData.segments && statementData.segments.length > 0 ? (
            statementData.segments.map((segment, index) => (
              <SegmentCard key={index} segment={segment} index={index} />
            ))
          ) : (
            <div
              style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                border: '1px solid #fbbf24',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
              }}
            >
              <AlertCircle
                size={24}
                style={{ color: '#d97706', marginBottom: '8px' }}
              />
              <p style={{ color: '#92400e', margin: 0, fontWeight: '500' }}>
                No calculation periods found for this date range.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatementDisplay;
