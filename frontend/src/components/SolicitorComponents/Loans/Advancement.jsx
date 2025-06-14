import { Link, useNavigate } from 'react-router-dom';
import AssignedBadge from '../../GenericComponents/AssignedBadge';
import {
  formatDate,
  formatMoney,
} from '../../GenericFunctions/HelperGenericFunctions';

const Advancement = ({ loan }) => {
  const navigate = useNavigate();
  console.log(loan);

  // Get styling based on status
  const getStatusStyles = () => {
    if (loan.needs_committee_approval && loan.is_committee_approved === null) {
      return {
        background: 'linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)',
        borderColor: '#f59e0b',
        headerBg: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        headerText: '#ffffff',
        statusColor: '#d97706',
      };
    }
    if (loan.needs_committee_approval && loan.is_committee_approved === false) {
      return {
        background: 'linear-gradient(135deg, #ffffff 0%, #fef2f2 100%)',
        borderColor: '#ef4444',
        headerBg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        headerText: '#ffffff',
        statusColor: '#dc2626',
      };
    }
    if (loan.is_paid_out) {
      return {
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
        borderColor: '#22c55e',
        headerBg: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        headerText: '#ffffff',
        statusColor: '#16a34a',
      };
    }
    return {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
      borderColor: '#3b82f6',
      headerBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
      headerText: '#ffffff',
      statusColor: '#2563eb',
    };
  };

  const statusStyles = getStatusStyles();

  return (
    <div
      key={loan.id}
      className='mb-3'
      style={{
        background: statusStyles.background,
        borderRadius: '16px',
        border: `2px solid ${statusStyles.borderColor}`,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.2s ease',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
      }}
    >
      {/* Compact Header Section */}
      <div
        className='text-center'
        style={{
          background: statusStyles.headerBg,
          padding: '12px 20px',
          color: statusStyles.headerText,
        }}
      >
        <div className='d-flex align-items-center justify-content-center gap-2 mb-1'>
          <h5
            className='mb-0 fw-bold'
            style={{
              cursor: 'pointer',
              fontSize: '1.1rem',
              color: statusStyles.headerText,
              textDecoration: 'underline',
              textDecorationColor: 'rgba(255, 255, 255, 0.5)',
            }}
            onClick={() => {
              navigate(`/advancements/${loan.id}`);
            }}
          >
            Advancement #{loan.id}
          </h5>
          {loan.country && (
            <span
              className='px-2 py-1 rounded-2'
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                fontSize: '0.7rem',
                fontWeight: '500',
              }}
            >
              {loan.country}
            </span>
          )}
        </div>

        {/* Inline Status Messages */}
        <div className='d-flex align-items-center justify-content-center gap-2 flex-wrap'>
          {loan.is_committee_approved === true && (
            <span
              className='px-2 py-1 rounded-2'
              style={{
                background: 'rgba(34, 197, 94, 0.2)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                color: '#ffffff',
                fontSize: '0.7rem',
              }}
            >
              ✓ Committee Approved
            </span>
          )}

          {loan.needs_committee_approval &&
            loan.is_committee_approved === null && (
              <span
                className='px-2 py-1 rounded-2 fw-semibold'
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '0.75rem',
                }}
              >
                COMMITTEE APPROVAL NEEDED
              </span>
            )}

          {loan.needs_committee_approval &&
            loan.is_committee_approved === false && (
              <span
                className='px-2 py-1 rounded-2 fw-semibold'
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '0.75rem',
                }}
              >
                COMMITTEE REJECTED
              </span>
            )}

          {loan.is_paid_out ? (
            <span
              className='px-2 py-1 rounded-2 fw-semibold'
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                fontSize: '0.75rem',
              }}
            >
              PAID OUT:{' '}
              {loan.paid_out_date
                ? new Date(loan.paid_out_date).toISOString().split('T')[0]
                : ''}
            </span>
          ) : (
            <span
              className='px-2 py-1 rounded-2 fw-semibold'
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                fontSize: '0.75rem',
              }}
            >
              NOT PAID OUT
            </span>
          )}
        </div>
      </div>

      {/* Compact Body Content */}
      <div style={{ padding: '16px' }}>
        {/* Assignment and Status Badges - Single Row */}
        <div className='d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3'>
          <AssignedBadge email={loan.assigned_to_email} />

          <div className='d-flex align-items-center gap-2 flex-wrap'>
            <span
              className={`px-2 py-1 rounded-pill fw-medium ${
                !loan.is_settled ? 'bg-warning' : 'bg-success'
              }`}
              style={{
                color: '#ffffff',
                fontSize: '0.7rem',
                background: !loan.is_settled
                  ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                  : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              }}
            >
              {loan.is_settled ? 'Settled' : 'Unsettled'}
            </span>

            <span
              className='px-2 py-1 rounded-pill fw-medium'
              style={{
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                color: '#1e40af',
                fontSize: '0.7rem',
              }}
            >
              By: {loan.approved_by_email?.split('@')[0] || 'N/A'}
            </span>
          </div>
        </div>

        {/* Compact Tables Section */}
        <div className='row g-3'>
          {/* IDs Column */}
          <div className='col-md-6'>
            <div
              className='p-2 rounded-3'
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              }}
            >
              <h6
                className='fw-bold mb-2 pb-1'
                style={{
                  color: statusStyles.statusColor,
                  borderBottom: `1px solid ${statusStyles.borderColor}`,
                  fontSize: '0.8rem',
                }}
              >
                Details
              </h6>
              <div className='table-responsive'>
                <table className='table table-sm table-borderless mb-0'>
                  <tbody>
                    <tr
                      className='cursor-pointer'
                      onClick={() => navigate(`/advancements/${loan.id}`)}
                    >
                      <td
                        style={{
                          padding: '4px 8px',
                          color: '#1e40af',
                          textDecoration: 'underline',
                          fontSize: '0.8rem',
                        }}
                      >
                        <strong>ID:</strong> {loan.id}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px 8px', fontSize: '0.8rem' }}>
                        <Link
                          to={`/applications/${loan.application}`}
                          style={{
                            color: '#1e40af',
                            textDecoration: 'underline',
                            fontWeight: '500',
                          }}
                        >
                          <strong>App:</strong> {loan.application}
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: '4px 8px',
                          color: '#374151',
                          fontSize: '0.8rem',
                        }}
                      >
                        <strong>Term:</strong> {loan.term_agreed}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: '4px 8px',
                          color: '#374151',
                          fontSize: '0.8rem',
                        }}
                      >
                        <strong>Maturity:</strong>{' '}
                        {loan.maturity_date !== null ? (
                          formatDate(loan.maturity_date)
                        ) : (
                          <span
                            className='px-1 rounded-1 fw-medium'
                            style={{
                              background: '#fef2f2',
                              color: '#dc2626',
                              fontSize: '0.7rem',
                            }}
                          >
                            N/A
                          </span>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Amounts Column */}
          <div className='col-md-6'>
            <div
              className='p-2 rounded-3'
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
              }}
            >
              <h6
                className='fw-bold mb-2 pb-1'
                style={{
                  color: statusStyles.statusColor,
                  borderBottom: `1px solid ${statusStyles.borderColor}`,
                  fontSize: '0.8rem',
                }}
              >
                Financials
              </h6>
              <div className='table-responsive'>
                <table className='table table-sm table-borderless mb-0'>
                  <tbody>
                    <tr
                      style={{
                        background:
                          'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                        borderRadius: '6px',
                      }}
                    >
                      <td
                        style={{
                          padding: '6px 8px',
                          fontWeight: '600',
                          color: '#1e40af',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                        }}
                      >
                        <strong>Balance:</strong>{' '}
                        {formatMoney(loan.current_balance, loan.currency_sign)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: '4px 8px',
                          color: '#374151',
                          fontSize: '0.8rem',
                        }}
                      >
                        <strong>Paid:</strong>{' '}
                        {formatMoney(loan.amount_paid, loan.currency_sign)}
                      </td>
                    </tr>
                    <tr
                      style={{
                        background:
                          'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                        borderRadius: '6px',
                      }}
                    >
                      <td
                        style={{
                          padding: '6px 8px',
                          fontWeight: '600',
                          color: '#d97706',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                        }}
                      >
                        <strong>Fee:</strong>{' '}
                        {formatMoney(loan.fee_agreed, loan.currency_sign)}
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          padding: '4px 8px',
                          color: '#374151',
                          fontSize: '0.8rem',
                        }}
                      >
                        <strong>Amount:</strong>{' '}
                        {formatMoney(loan.amount_agreed, loan.currency_sign)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Advancement;
