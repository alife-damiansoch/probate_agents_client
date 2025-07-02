import {
  ArrowRight,
  BarChart3,
  Calculator,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Percent,
  Receipt,
  Target,
  TrendingUp,
} from 'lucide-react';
import {
  formatDate,
  formatMoney,
} from '../../../../GenericFunctions/HelperGenericFunctions';

export const SegmentCard = ({ segment, formatMoney, currency_sign }) => {
  const formatCurrency = (amount) => {
    return formatMoney(amount, currency_sign);
  };

  // Calculate total obligation and remaining balance
  const totalObligation =
    segment.principal +
    segment.first_year_interest +
    segment.daily_interest_accumulated +
    segment.exit_fee;
  const remainingBalance = totalObligation - segment.total_payments_made;
  // Consider loan paid off if remaining balance is less than 1 cent
  const isFullyPaid = remainingBalance <= 0.01;

  console.log('Debug:', {
    totalObligation,
    totalPayments: segment.total_payments_made,
    remainingBalance,
    isFullyPaid,
  });

  return (
    <div
      style={{
        background:
          'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        borderRadius: '24px',
        padding: '3px',
        marginBottom: '32px',
        boxShadow:
          '0 25px 50px rgba(15, 23, 42, 0.4), 0 0 0 1px rgba(148, 163, 184, 0.1)',
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
            'linear-gradient(135deg, transparent 0%, rgba(99, 102, 241, 0.1) 50%, transparent 100%)',
          animation: 'shimmer 3s ease-in-out infinite',
        }}
      />

      <div
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderRadius: '21px',
          padding: '40px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div className='d-flex justify-content-between align-items-start mb-5'>
          <div className='d-flex align-items-center gap-4'>
            <div
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)',
              }}
            >
              <BarChart3 size={24} color='white' />
            </div>
            <div>
              <h4
                style={{
                  background: 'linear-gradient(135deg, #1e293b, #475569)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: '800',
                  fontSize: '24px',
                  margin: 0,
                  letterSpacing: '-0.03em',
                }}
              >
                Interest vs Payment Calculator
              </h4>
              <div className='d-flex align-items-center gap-2 mt-1'>
                <Clock size={14} style={{ color: '#64748b' }} />
                <span
                  style={{
                    color: '#64748b',
                    fontSize: '15px',
                    fontWeight: '600',
                  }}
                >
                  {formatDate(segment.start)} → {formatDate(segment.end)} (
                  {segment.days} days)
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='row g-5'>
          {/* Left Side - Interest Calculation Timeline */}
          <div className='col-lg-6'>
            <div
              style={{
                background: 'linear-gradient(135deg, #fef7f0 0%, #fed7aa 100%)',
                borderRadius: '20px',
                padding: '32px',
                border: '2px solid #fb923c',
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
                  height: '4px',
                  background: 'linear-gradient(90deg, #f59e0b, #ea580c)',
                }}
              />

              <h5
                style={{
                  color: '#ea580c',
                  fontWeight: '800',
                  marginBottom: '32px',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <Calculator size={20} />
                Interest Calculation Timeline
              </h5>

              {/* Timeline Steps */}
              <div style={{ position: 'relative' }}>
                {/* Timeline Line */}
                <div
                  style={{
                    position: 'absolute',
                    left: '24px',
                    top: '24px',
                    bottom: '24px',
                    width: '3px',
                    background: 'linear-gradient(180deg, #f59e0b, #ea580c)',
                    borderRadius: '2px',
                  }}
                />

                {/* Step 1: Principal */}
                <div
                  className='d-flex align-items-center mb-4'
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      borderRadius: '50%',
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '20px',
                      boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                    }}
                  >
                    <DollarSign size={20} color='white' />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#1d4ed8',
                        marginBottom: '4px',
                      }}
                    >
                      1. Principal Amount
                    </div>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '900',
                        color: '#1e3a8a',
                      }}
                    >
                      {formatCurrency(segment.principal)}
                    </div>
                  </div>
                </div>

                <ArrowRight
                  size={16}
                  style={{
                    color: '#ea580c',
                    marginLeft: '24px',
                    marginBottom: '16px',
                  }}
                />

                {/* Step 2: First Year Interest */}
                <div
                  className='d-flex align-items-center mb-4'
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      borderRadius: '50%',
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '20px',
                      boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
                    }}
                  >
                    <Percent size={20} color='white' />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#d97706',
                        marginBottom: '4px',
                      }}
                    >
                      2. First Year (15%)
                    </div>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '900',
                        color: '#92400e',
                      }}
                    >
                      +{formatCurrency(segment.first_year_interest)}
                    </div>
                  </div>
                </div>

                <ArrowRight
                  size={16}
                  style={{
                    color: '#ea580c',
                    marginLeft: '24px',
                    marginBottom: '16px',
                  }}
                />

                {/* Step 3: Daily Interest */}
                <div
                  className='d-flex align-items-center mb-4'
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #a855f7, #9333ea)',
                      borderRadius: '50%',
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '20px',
                      boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)',
                    }}
                  >
                    <TrendingUp size={20} color='white' />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#9333ea',
                        marginBottom: '4px',
                      }}
                    >
                      3. Daily Simple (0.07%)
                    </div>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '900',
                        color: '#7c2d12',
                      }}
                    >
                      +{formatCurrency(segment.daily_interest_accumulated)}
                    </div>
                  </div>
                </div>

                <ArrowRight
                  size={16}
                  style={{
                    color: '#ea580c',
                    marginLeft: '24px',
                    marginBottom: '16px',
                  }}
                />

                {/* Step 4: Exit Fee */}
                <div
                  className='d-flex align-items-center mb-4'
                  style={{ position: 'relative', zIndex: 2 }}
                >
                  <div
                    style={{
                      background: 'linear-gradient(135deg, #ec4899, #db2777)',
                      borderRadius: '50%',
                      width: '48px',
                      height: '48px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '20px',
                      boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)',
                    }}
                  >
                    <Receipt size={20} color='white' />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#db2777',
                        marginBottom: '4px',
                      }}
                    >
                      4. Exit Fee (1.5%)
                    </div>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '900',
                        color: '#be185d',
                      }}
                    >
                      +{formatCurrency(segment.exit_fee)}
                    </div>
                  </div>
                </div>

                <ArrowRight
                  size={16}
                  style={{
                    color: '#ea580c',
                    marginLeft: '24px',
                    marginBottom: '16px',
                  }}
                />

                {/* Total Obligation */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, #ea580c, #dc2626)',
                    borderRadius: '16px',
                    padding: '24px',
                    textAlign: 'center',
                    color: 'white',
                    marginLeft: '68px',
                    boxShadow: '0 8px 25px rgba(234, 88, 12, 0.4)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      opacity: 0.9,
                    }}
                  >
                    TOTAL OBLIGATION
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: '900' }}>
                    {formatCurrency(totalObligation)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Payment Tracking */}
          <div className='col-lg-6'>
            <div
              style={{
                background: 'linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%)',
                borderRadius: '20px',
                padding: '32px',
                border: '2px solid #22c55e',
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
                  height: '4px',
                  background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                }}
              />

              <h5
                style={{
                  color: '#16a34a',
                  fontWeight: '800',
                  marginBottom: '32px',
                  fontSize: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <CreditCard size={20} />
                Payment Progress
              </h5>

              {/* Payment Summary */}
              <div
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '32px',
                  marginBottom: '32px',
                  border: '1px solid #d1fae5',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    borderRadius: '50%',
                    width: '64px',
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)',
                  }}
                >
                  <CreditCard size={28} color='white' />
                </div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#16a34a',
                    marginBottom: '8px',
                  }}
                >
                  TOTAL PAYMENTS MADE
                </div>
                <div
                  style={{
                    fontSize: '36px',
                    fontWeight: '900',
                    color: '#15803d',
                  }}
                >
                  {formatCurrency(segment.total_payments_made)}
                </div>
              </div>

              {/* Progress Bar */}
              <div style={{ marginBottom: '32px' }}>
                <div className='d-flex justify-content-between align-items-center mb-2'>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#16a34a',
                    }}
                  >
                    Payment Progress
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: '#15803d',
                    }}
                  >
                    {Math.min(
                      100,
                      Math.round(
                        (segment.total_payments_made / totalObligation) * 100
                      )
                    )}
                    %
                  </span>
                </div>
                <div
                  style={{
                    background: '#e5e7eb',
                    borderRadius: '12px',
                    height: '16px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                      height: '100%',
                      width: `${Math.min(
                        100,
                        (segment.total_payments_made / totalObligation) * 100
                      )}%`,
                      borderRadius: '12px',
                      transition: 'width 0.5s ease',
                    }}
                  />
                </div>
              </div>

              {/* Remaining Balance */}
              <div
                style={{
                  background: isFullyPaid
                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                    : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  color: 'white',
                  boxShadow: isFullyPaid
                    ? '0 8px 25px rgba(34, 197, 94, 0.4)'
                    : '0 8px 25px rgba(251, 191, 36, 0.4)',
                }}
              >
                <div className='d-flex align-items-center justify-content-center gap-2 mb-2'>
                  {isFullyPaid ? (
                    <CheckCircle size={24} />
                  ) : (
                    <Clock size={20} />
                  )}
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      opacity: 0.9,
                    }}
                  >
                    {isFullyPaid ? '🎉 CONGRATULATIONS!' : 'REMAINING BALANCE'}
                  </div>
                </div>
                {isFullyPaid ? (
                  <div>
                    <div
                      style={{
                        fontSize: '20px',
                        fontWeight: '800',
                        marginBottom: '4px',
                      }}
                    >
                      ADVANCEMENT FULLY PAID!
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.9 }}>
                      All obligations settled ✨
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '28px', fontWeight: '900' }}>
                    {formatCurrency(remainingBalance)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Comparison Section */}
        <div
          style={{
            marginTop: '40px',
            background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
            borderRadius: '20px',
            padding: '32px',
            border: '2px solid #e2e8f0',
          }}
        >
          <h5
            style={{
              color: '#1e293b',
              fontWeight: '800',
              marginBottom: '32px',
              fontSize: '20px',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
            }}
          >
            <Target size={20} />
            Financial Comparison Analysis
          </h5>

          <div className='row g-4'>
            <div className='col-md-4'>
              <div
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  border: '2px solid #ea580c',
                  boxShadow: '0 4px 15px rgba(234, 88, 12, 0.1)',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#ea580c',
                    marginBottom: '8px',
                  }}
                >
                  TOTAL OBLIGATION
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: '900',
                    color: '#dc2626',
                  }}
                >
                  {formatCurrency(totalObligation)}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#78716c',
                    marginTop: '4px',
                  }}
                >
                  Principal + All Interest
                </div>
              </div>
            </div>

            <div className='col-md-4'>
              <div
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  border: '2px solid #22c55e',
                  boxShadow: '0 4px 15px rgba(34, 197, 94, 0.1)',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#22c55e',
                    marginBottom: '8px',
                  }}
                >
                  PAYMENTS MADE
                </div>
                <div
                  style={{
                    fontSize: '24px',
                    fontWeight: '900',
                    color: '#16a34a',
                  }}
                >
                  {formatCurrency(segment.total_payments_made)}
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    color: '#78716c',
                    marginTop: '4px',
                  }}
                >
                  Amount Paid So Far
                </div>
              </div>
            </div>

            <div className='col-md-4'>
              <div
                style={{
                  background: isFullyPaid ? '#dcfce7' : '#fef3c7',
                  borderRadius: '16px',
                  padding: '24px',
                  textAlign: 'center',
                  border: isFullyPaid
                    ? '2px solid #22c55e'
                    : '2px solid #f59e0b',
                  boxShadow: isFullyPaid
                    ? '0 4px 15px rgba(34, 197, 94, 0.1)'
                    : '0 4px 15px rgba(245, 158, 11, 0.1)',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: isFullyPaid ? '#22c55e' : '#f59e0b',
                    marginBottom: '8px',
                  }}
                >
                  {isFullyPaid ? '✅ SETTLEMENT COMPLETE' : 'STILL OWED'}
                </div>
                {isFullyPaid ? (
                  <div>
                    <div
                      style={{
                        fontSize: '18px',
                        fontWeight: '800',
                        color: '#16a34a',
                        marginBottom: '4px',
                      }}
                    >
                      DEBT CLEARED
                    </div>
                    <div style={{ fontSize: '12px', color: '#059669' }}>
                      Zero Balance Achieved! 🎯
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '900',
                        color: '#d97706',
                      }}
                    >
                      {formatCurrency(remainingBalance)}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#78716c',
                        marginTop: '4px',
                      }}
                    >
                      Outstanding Balance
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Final Result Display */}
          <div
            style={{
              marginTop: '24px',
              background: isFullyPaid
                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                : 'linear-gradient(135deg, #1e293b, #334155)',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              color: 'white',
            }}
          >
            <div className='d-flex align-items-center justify-content-center gap-3'>
              {isFullyPaid ? <CheckCircle size={28} /> : <Clock size={24} />}
              <div>
                <div
                  style={{ fontSize: '16px', fontWeight: '600', opacity: 0.9 }}
                >
                  {isFullyPaid
                    ? '🏆 ADVANCEMENT STATUS: SUCCESSFULLY COMPLETED'
                    : 'CURRENT BALANCE DUE'}
                </div>
                {isFullyPaid ? (
                  <div>
                    <div
                      style={{
                        fontSize: '24px',
                        fontWeight: '900',
                        marginTop: '4px',
                      }}
                    >
                      MISSION ACCOMPLISHED!
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        opacity: 0.9,
                        marginTop: '4px',
                      }}
                    >
                      All financial obligations have been met ⭐
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '28px', fontWeight: '900' }}>
                    {formatCurrency(remainingBalance)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
};

// Demo component with sample data
const SegmentDisplay = () => {
  const sampleSegment = {
    start: '2024-01-15',
    end: '2024-06-23',
    principal: 100000.0,
    days: 160,
    first_year_interest: 15000.0,
    daily_interest_accumulated: 2500.0,
    exit_fee: 1500.0,
    total_interest: 19000.0,
    total_payments_made: 119000.0, // Made this higher than total obligation to test
    total: 0.0,
  };

  return (
    <div
      style={{
        padding: '40px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        minHeight: '100vh',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <SegmentCard
          segment={sampleSegment}
          formatMoney={formatMoney}
          currency_sign='$'
        />
      </div>
    </div>
  );
};

export default SegmentDisplay;
