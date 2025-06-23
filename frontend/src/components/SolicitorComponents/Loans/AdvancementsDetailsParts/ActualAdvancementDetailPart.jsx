import { Link } from 'react-router-dom';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import {
  formatDate,
  formatMoney,
} from '../../../GenericFunctions/HelperGenericFunctions';

const ActualAdvancementDetailPart = ({
  advancement,
  isEditing,
  handleInputChange,
}) => {
  return (
    <>
      {advancement ? (
        <div className='row g-4'>
          {/* Financial Information */}
          <div className='col-md-6'>
            <div
              className='p-4 rounded-3'
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid #3b82f6',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h6
                className='fw-bold mb-3 pb-2 d-flex align-items-center gap-2'
                style={{
                  color: '#1e40af',
                  borderBottom: '2px solid #3b82f6',
                  fontSize: '1rem',
                }}
              >
                <svg
                  width='20'
                  height='20'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path d='M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z' />
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z'
                    clipRule='evenodd'
                  />
                </svg>
                Financial Details
              </h6>

              <div className='d-flex flex-column gap-3'>
                {/* Current Balance - Highlighted */}
                <div
                  className='p-3 rounded-3'
                  style={{
                    background:
                      'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                    border: '1px solid #93c5fd',
                  }}
                >
                  <div className='d-flex align-items-center justify-content-between'>
                    <span
                      className='fw-bold'
                      style={{ color: '#1e40af', fontSize: '0.9rem' }}
                    >
                      Current Balance:
                    </span>
                    <span
                      className='fw-bold'
                      style={{ color: '#1e40af', fontSize: '1.1rem' }}
                    >
                      {formatMoney(
                        advancement?.loanbook_data?.total_due ||
                          advancement.current_balance,
                        advancement.currency_sign
                      )}
                    </span>
                  </div>
                </div>

                {/* Amount Paid */}
                <div
                  className='p-3 rounded-3'
                  style={{
                    background:
                      advancement.amount_paid > 0
                        ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
                        : 'rgba(248, 250, 252, 0.8)',
                    border:
                      advancement.amount_paid > 0
                        ? '1px solid #86efac'
                        : '1px solid #e2e8f0',
                  }}
                >
                  <div className='d-flex align-items-center justify-content-between'>
                    <span
                      className='fw-semibold'
                      style={{ color: '#374151', fontSize: '0.9rem' }}
                    >
                      Amount Paid:
                    </span>
                    <span
                      className='fw-semibold'
                      style={{
                        color:
                          advancement.amount_paid > 0 ? '#16a34a' : '#6b7280',
                        fontSize: '1rem',
                      }}
                    >
                      {formatMoney(
                        advancement.amount_paid,
                        advancement.currency_sign
                      )}
                    </span>
                  </div>
                </div>

                {/* Fee Agreed - Editable */}
                <div
                  className='p-3 rounded-3'
                  style={{
                    background:
                      advancement.fee_agreed > 0
                        ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                        : 'rgba(248, 250, 252, 0.8)',
                    border:
                      advancement.fee_agreed > 0
                        ? '1px solid #fbbf24'
                        : '1px solid #e2e8f0',
                  }}
                >
                  <div className='d-flex align-items-center justify-content-between'>
                    <span
                      className='fw-semibold'
                      style={{ color: '#374151', fontSize: '0.9rem' }}
                    >
                      Accrued Fee:
                    </span>

                    <span
                      className='fw-semibold'
                      style={{
                        color:
                          advancement.fee_agreed > 0 ? '#d97706' : '#6b7280',
                        fontSize: '1rem',
                      }}
                    >
                      {formatMoney(
                        advancement?.loanbook_data?.total_due +
                          advancement?.amount_paid -
                          advancement?.loanbook_data?.initial_amount ||
                          advancement.fee_agreed,
                        advancement.currency_sign
                      )}
                    </span>
                  </div>
                </div>

                {/* Extension Fees */}
                <div
                  className='p-3 rounded-3'
                  style={{
                    background:
                      advancement.extension_fees_total > 0
                        ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'
                        : 'rgba(248, 250, 252, 0.8)',
                    border:
                      advancement.extension_fees_total > 0
                        ? '1px solid #fbbf24'
                        : '1px solid #e2e8f0',
                  }}
                >
                  <div className='d-flex align-items-center justify-content-between'>
                    <span
                      className='fw-semibold'
                      style={{ color: '#374151', fontSize: '0.9rem' }}
                    >
                      Extension Fees:
                    </span>
                    <span
                      className='fw-semibold'
                      style={{
                        color:
                          advancement.extension_fees_total > 0
                            ? '#d97706'
                            : '#6b7280',
                        fontSize: '1rem',
                      }}
                    >
                      {formatMoney(
                        advancement.extension_fees_total,
                        advancement.currency_sign
                      )}
                    </span>
                  </div>
                </div>

                {/* Term Agreed - Editable */}
                <div
                  className='p-3 rounded-3'
                  style={{
                    background: 'rgba(248, 250, 252, 0.8)',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div className='d-flex align-items-center justify-content-between'>
                    <span
                      className='fw-semibold'
                      style={{ color: '#374151', fontSize: '0.9rem' }}
                    >
                      Term Agreed:
                    </span>

                    <span
                      className='fw-semibold'
                      style={{ color: '#374151', fontSize: '1rem' }}
                    >
                      {advancement.term_agreed} months
                    </span>
                  </div>
                </div>

                {/* Amount Agreed - Editable */}
                <div
                  className='p-3 rounded-3'
                  style={{
                    background: 'rgba(248, 250, 252, 0.8)',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div className='d-flex align-items-center justify-content-between'>
                    <span
                      className='fw-semibold'
                      style={{ color: '#374151', fontSize: '0.9rem' }}
                    >
                      Initial Amount:
                    </span>

                    <span
                      className='fw-semibold'
                      style={{ color: '#374151', fontSize: '1rem' }}
                    >
                      {formatMoney(
                        advancement?.loanbook_data?.initial_amount ||
                          advancement.amount_agreed,
                        advancement.currency_sign
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status & Administrative Information */}
          <div className='col-md-6'>
            <div
              className='p-4 rounded-3'
              style={{
                background: 'rgba(255, 255, 255, 0.9)',
                border: '2px solid #16a34a',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <h6
                className='fw-bold mb-3 pb-2 d-flex align-items-center gap-2'
                style={{
                  color: '#15803d',
                  borderBottom: '2px solid #16a34a',
                  fontSize: '1rem',
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
                    d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                    clipRule='evenodd'
                  />
                </svg>
                Status & Information
              </h6>

              <div className='d-flex flex-column gap-3'>
                {/* Approved Date */}
                <div
                  className='p-3 rounded-3'
                  style={{
                    background: 'rgba(248, 250, 252, 0.8)',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div className='d-flex align-items-center justify-content-between'>
                    <span
                      className='fw-semibold'
                      style={{ color: '#374151', fontSize: '0.9rem' }}
                    >
                      Approved Date:
                    </span>
                    <span
                      className='fw-semibold'
                      style={{ color: '#374151', fontSize: '1rem' }}
                    >
                      {formatDate(advancement.approved_date)}
                    </span>
                  </div>
                </div>

                {/* Payout Date - New */}
                {advancement.is_paid_out && (
                  <div
                    className='p-3 rounded-3'
                    style={{
                      background: advancement.paid_out_date
                        ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
                        : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                      border: advancement.paid_out_date
                        ? '1px solid #86efac'
                        : '1px solid #fca5a5',
                    }}
                  >
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='d-flex align-items-center gap-2'>
                        <svg
                          width='16'
                          height='16'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                          style={{
                            color: advancement.paid_out_date
                              ? '#16a34a'
                              : '#dc2626',
                          }}
                        >
                          <path
                            fillRule='evenodd'
                            d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span
                          className='fw-semibold'
                          style={{ color: '#374151', fontSize: '0.9rem' }}
                        >
                          Paid Out Date:
                        </span>
                      </div>
                      {advancement.paid_out_date ? (
                        <span
                          className='fw-semibold'
                          style={{ color: '#16a34a', fontSize: '1rem' }}
                        >
                          {formatDate(advancement.paid_out_date)}
                        </span>
                      ) : (
                        <span
                          className='px-2 py-1 rounded-2 fw-bold text-uppercase'
                          style={{
                            background: '#dc2626',
                            color: '#ffffff',
                            fontSize: '0.7rem',
                          }}
                        >
                          Missing Date
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Payout Reference Number - New */}
                {advancement.is_paid_out && (
                  <div
                    className='p-3 rounded-3'
                    style={{
                      background: advancement.pay_out_reference_number
                        ? 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
                        : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                      border: advancement.pay_out_reference_number
                        ? '1px solid #7dd3fc'
                        : '1px solid #fca5a5',
                    }}
                  >
                    <div className='d-flex align-items-center justify-content-between'>
                      <div className='d-flex align-items-center gap-2'>
                        <svg
                          width='16'
                          height='16'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                          style={{
                            color: advancement.pay_out_reference_number
                              ? '#0ea5e9'
                              : '#dc2626',
                          }}
                        >
                          <path
                            fillRule='evenodd'
                            d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                            clipRule='evenodd'
                          />
                        </svg>
                        <span
                          className='fw-semibold'
                          style={{ color: '#374151', fontSize: '0.9rem' }}
                        >
                          Reference Number:
                        </span>
                      </div>
                      {advancement.pay_out_reference_number ? (
                        <span
                          className='fw-semibold px-2 py-1 rounded-2'
                          style={{
                            color: '#0c4a6e',
                            fontSize: '0.9rem',
                            background: 'rgba(14, 165, 233, 0.1)',
                            border: '1px solid rgba(14, 165, 233, 0.2)',
                            fontFamily: 'monospace',
                          }}
                        >
                          {advancement.pay_out_reference_number}
                        </span>
                      ) : (
                        <span
                          className='px-2 py-1 rounded-2 fw-bold text-uppercase'
                          style={{
                            background: '#dc2626',
                            color: '#ffffff',
                            fontSize: '0.7rem',
                          }}
                        >
                          Missing Ref
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Maturity Date */}
                <div
                  className='p-3 rounded-3'
                  style={{
                    background: (() => {
                      if (!advancement.maturity_date) {
                        return 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)';
                      }
                      const today = new Date();
                      const maturity = new Date(advancement.maturity_date);
                      const diffDays = Math.ceil(
                        (maturity - today) / (1000 * 60 * 60 * 24)
                      );

                      if (diffDays < 0)
                        return 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'; // Past - danger
                      if (diffDays <= 30)
                        return 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)'; // <30 days - warning
                      return 'rgba(248, 250, 252, 0.8)'; // >30 days - normal
                    })(),
                    border: (() => {
                      if (!advancement.maturity_date) {
                        return '1px solid #fca5a5';
                      }
                      const today = new Date();
                      const maturity = new Date(advancement.maturity_date);
                      const diffDays = Math.ceil(
                        (maturity - today) / (1000 * 60 * 60 * 24)
                      );

                      if (diffDays < 0) return '2px solid #dc2626'; // Past - danger
                      if (diffDays <= 30) return '2px solid #f59e0b'; // <30 days - warning
                      return '1px solid #e2e8f0'; // >30 days - normal
                    })(),
                  }}
                >
                  <div className='d-flex align-items-center justify-content-between'>
                    <span
                      className='fw-semibold'
                      style={{ color: '#374151', fontSize: '0.9rem' }}
                    >
                      Maturity Date:
                    </span>
                    {advancement.maturity_date !== null ? (
                      <span
                        className='fw-semibold'
                        style={{ color: '#374151', fontSize: '1rem' }}
                      >
                        {formatDate(advancement.maturity_date)}
                      </span>
                    ) : (
                      <span
                        className='px-2 py-1 rounded-2 fw-bold text-uppercase'
                        style={{
                          background: '#dc2626',
                          color: '#ffffff',
                          fontSize: '0.8rem',
                        }}
                      >
                        Pay out date not set
                      </span>
                    )}
                  </div>
                </div>

                {/* Settlement Status */}
                <div
                  className='p-3 rounded-3'
                  style={{
                    background: advancement.is_settled
                      ? 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)'
                      : 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    border: advancement.is_settled
                      ? '1px solid #86efac'
                      : '1px solid #fbbf24',
                  }}
                >
                  <div className='d-flex align-items-center justify-content-between'>
                    <span
                      className='fw-semibold'
                      style={{ color: '#374151', fontSize: '0.9rem' }}
                    >
                      Settlement Status:
                    </span>
                    <span
                      className='fw-bold'
                      style={{
                        color: advancement.is_settled ? '#16a34a' : '#d97706',
                        fontSize: '1rem',
                      }}
                    >
                      {advancement.is_settled ? 'Settled' : 'Unsettled'}
                    </span>
                  </div>
                </div>

                {/* Settled Date - Only show if settled */}
                {advancement.is_settled && (
                  <div
                    className='p-3 rounded-3'
                    style={{
                      background:
                        'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                      border: '1px solid #86efac',
                    }}
                  >
                    <div className='d-flex align-items-center justify-content-between'>
                      <span
                        className='fw-semibold'
                        style={{ color: '#374151', fontSize: '0.9rem' }}
                      >
                        Settled Date:
                      </span>
                      <span
                        className='fw-semibold'
                        style={{ color: '#16a34a', fontSize: '1rem' }}
                      >
                        {formatDate(advancement.settled_date)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Approved By */}
                <div
                  className='p-3 rounded-3'
                  style={{
                    background: 'rgba(248, 250, 252, 0.8)',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div className='d-flex align-items-center justify-content-between'>
                    <span
                      className='fw-semibold'
                      style={{ color: '#374151', fontSize: '0.9rem' }}
                    >
                      Approved By:
                    </span>
                    <span
                      className='fw-medium'
                      style={{
                        color: '#1e40af',
                        fontSize: '0.9rem',
                        maxWidth: '200px',
                        textAlign: 'right',
                        wordBreak: 'break-word',
                      }}
                    >
                      {advancement.approved_by_email}
                    </span>
                  </div>
                </div>

                {/* Last Updated By */}
                <div
                  className='p-3 rounded-3'
                  style={{
                    background: 'rgba(248, 250, 252, 0.8)',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div className='d-flex align-items-center justify-content-between'>
                    <span
                      className='fw-semibold'
                      style={{ color: '#374151', fontSize: '0.9rem' }}
                    >
                      Last Updated By:
                    </span>
                    <span
                      className='fw-medium'
                      style={{
                        color: '#6b7280',
                        fontSize: '0.9rem',
                        maxWidth: '200px',
                        textAlign: 'right',
                        wordBreak: 'break-word',
                      }}
                    >
                      {advancement.last_updated_by_email || 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Application Link */}
                <div
                  className='p-3 rounded-3'
                  style={{
                    background:
                      'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                    border: '1px solid #93c5fd',
                  }}
                >
                  <div className='d-flex align-items-center justify-content-between'>
                    <span
                      className='fw-semibold'
                      style={{ color: '#374151', fontSize: '0.9rem' }}
                    >
                      Related Application:
                    </span>
                    <Link
                      to={`/applications/${advancement.application}`}
                      className='fw-bold d-flex align-items-center gap-1'
                      style={{
                        color: '#1e40af',
                        textDecoration: 'underline',
                        fontSize: '1rem',
                      }}
                    >
                      #{advancement.application}
                      <svg
                        width='14'
                        height='14'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z'
                          clipRule='evenodd'
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          className='d-flex align-items-center justify-content-center'
          style={{ minHeight: '200px' }}
        >
          <LoadingComponent />
        </div>
      )}
    </>
  );
};

export default ActualAdvancementDetailPart;
