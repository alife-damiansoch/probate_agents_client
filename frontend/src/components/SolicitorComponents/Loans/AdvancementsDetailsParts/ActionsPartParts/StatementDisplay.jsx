import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  CreditCard,
  DollarSign,
  Download,
  FileDown,
  FileText,
  Printer,
  Receipt,
  TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import {
  formatDate,
  formatMoney,
} from '../../../../GenericFunctions/HelperGenericFunctions';
import { SegmentCard } from './SegmentCard';

const StatementDisplay = ({ statement, advancement, onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);

  // Extract the actual statement data - it's nested in statement.statement
  const statementData = statement.statement || statement;

  // Get the actual fee percentages from the loanbook data
  const initialFeePercentage = statement.initial_fee_percentage || '15.00';
  const dailyFeePercentage =
    statement.daily_fee_after_year_percentage || '1.50';
  const exitFeePercentage = statement.exit_fee_percentage || '1.50';

  const generatePDF = () => {
    const doc = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Advancement Statement - ID: ${
      advancement.id || 'N/A'
    } - ${formatDate(statementData.date)}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6; 
            color: #1f2937; 
            background: #ffffff;
            font-size: 14px;
        }
        .header { 
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            color: white; 
            padding: 40px 30px; 
            text-align: center;
            margin-bottom: 30px;
        }
        .logo { font-size: 32px; font-weight: 900; margin-bottom: 10px; }
        .subtitle { opacity: 0.9; font-size: 16px; }
        
        .summary-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin-bottom: 30px; 
        }
        .summary-card { 
            background: #f8fafc; 
            border: 2px solid #e2e8f0; 
            border-radius: 12px; 
            padding: 20px; 
            text-align: center;
        }
        .summary-card h4 { 
            color: #64748b; 
            font-size: 12px; 
            text-transform: uppercase; 
            margin-bottom: 8px; 
            letter-spacing: 0.5px;
        }
        .summary-card .amount { 
            font-size: 24px; 
            font-weight: 900; 
            color: #1e293b; 
        }
        .summary-card .note { 
            font-size: 11px; 
            color: #64748b; 
            margin-top: 4px;
        }
        
        .section { 
            margin-bottom: 30px; 
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .section-header { 
            background: #f8fafc; 
            padding: 15px 20px; 
            border-bottom: 2px solid #e2e8f0;
            font-weight: 700;
            color: #374151;
        }
        .section-content { padding: 20px; }
        
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 0;
        }
        th, td { 
            padding: 12px; 
            text-align: left; 
            border-bottom: 1px solid #e5e7eb; 
        }
        th { 
            background: #f8fafc; 
            font-weight: 600; 
            color: #6b7280; 
            font-size: 12px;
            text-transform: uppercase;
        }
        tr:hover { background: #f9fafb; }
        
        .breakdown-card {
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
            border: 2px solid #f59e0b;
            border-radius: 12px;
            padding: 25px;
            margin: 20px 0;
        }
        .breakdown-title {
            color: #92400e;
            font-weight: 700;
            font-size: 18px;
            margin-bottom: 15px;
            text-align: center;
        }
        .breakdown-amount {
            text-align: center;
            font-size: 28px;
            font-weight: 900;
            color: #92400e;
            margin: 10px 0;
        }
        
        .footer { 
            text-align: center; 
            padding: 30px; 
            color: #6b7280; 
            font-size: 12px;
            border-top: 2px solid #e5e7eb;
            margin-top: 40px;
        }
        .footer strong { color: #374151; }
        
        .payment-card {
            background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .payment-info { color: #166534; font-weight: 600; }
        .payment-amount { color: #166534; font-weight: 900; font-size: 16px; }
        .payment-date { color: #15803d; font-size: 12px; }
        
        @media print {
            .no-print { display: none !important; }
            body { -webkit-print-color-adjust: exact; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🏦 ADVANCEMENT STATEMENT</div>
        <div style="margin-top: 20px; font-size: 14px;">
            Advancement ID: ${advancement.id || 'N/A'}<br>
            Generated on ${formatDate(statementData.date)}
        </div>
    </div>
    
    <div class="summary-grid">
        <div class="summary-card">
            <h4>Total Due</h4>
            <div class="amount">${formatMoney(
              statementData.total_due,
              advancement.currency_sign
            )}</div>
            <div class="note">Including all fees</div>
        </div>
        <div class="summary-card">
            <h4>Initial Amount</h4>
            <div class="amount">${formatMoney(
              statementData.initial_amount,
              advancement.currency_sign
            )}</div>
            <div class="note">Principal advancement amount</div>
        </div>
        <div class="summary-card">
            <h4>Yearly Interest</h4>
            <div class="amount">${formatMoney(
              statementData.yearly_interest || 0,
              advancement.currency_sign
            )}</div>
            <div class="note">First year fee (${initialFeePercentage}%)</div>
        </div>
        <div class="summary-card">
            <h4>Exit Fee</h4>
            <div class="amount">${formatMoney(
              statementData.exit_fee,
              advancement.currency_sign
            )}</div>
            <div class="note">Settlement fee (${exitFeePercentage}%)</div>
        </div>
    </div>
    
    ${
      statementData.daily_interest_total &&
      parseFloat(statementData.daily_interest_total) > 0
        ? `
    <div class="breakdown-card">
        <div class="breakdown-title">Compound Daily Interest (After Year 1)</div>
        <div class="breakdown-amount">${formatMoney(
          statementData.daily_interest_total,
          advancement.currency_sign
        )}</div>
        <div style="text-align: center; color: #a16207; font-size: 14px;">
            Compounded at ${dailyFeePercentage}% per day beyond first year
        </div>
    </div>
    `
        : ''
    }
    
    ${
      statementData.transactions && statementData.transactions.length > 0
        ? `
    <div class="section">
        <div class="section-header">💳 Payment History</div>
        <div class="section-content">
            ${statementData.transactions
              .map(
                (transaction, index) => `
                <div class="payment-card">
                    <div>
                        <div class="payment-info">Payment #${index + 1}</div>
                        <div class="payment-date">${formatDate(
                          transaction.date
                        )}</div>
                    </div>
                    <div class="payment-amount">${formatMoney(
                      transaction.amount,
                      advancement.currency_sign
                    )}</div>
                </div>
            `
              )
              .join('')}
        </div>
    </div>
    `
        : ''
    }
    
    ${
      statementData.daily_breakdown && statementData.daily_breakdown.length > 0
        ? `
    <div class="section">
        <div class="section-header">📅 Day-by-Day Breakdown</div>
        <div class="section-content">
            <table>
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Rate</th>
                        <th>Amount</th>
                        <th>Running Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${statementData.daily_breakdown
                      .map(
                        (day) => `
                        <tr>
                            <td><strong>${day.day}</strong></td>
                            <td>${formatDate(day.date)}</td>
                            <td>${day.type}</td>
                            <td>${day.interest_rate || 'N/A'}</td>
                            <td>
                                ${
                                  day.payment_amount
                                    ? `<span style="color: #16a34a;">-${formatMoney(
                                        day.payment_amount,
                                        advancement.currency_sign
                                      )}</span>`
                                    : day.interest_amount
                                    ? `<span style="color: #dc2626;">+${formatMoney(
                                        day.interest_amount,
                                        advancement.currency_sign
                                      )}</span>`
                                    : `<span style="color: #6b7280;">${advancement.currency_sign}0.00</span>`
                                }
                            </td>
                            <td><strong>${formatMoney(
                              day.running_total,
                              advancement.currency_sign
                            )}</strong></td>
                        </tr>
                    `
                      )
                      .join('')}
                </tbody>
            </table>
        </div>
    </div>
    `
        : ''
    }
    
    <div class="footer">
        <strong>📄 Professional Advancement Statement</strong><br>
        This document contains a complete breakdown of your advancement calculations<br><br>
        <em>For questions about this statement, please contact your advancement administrator</em>
    </div>
</body>
</html>`;

    return doc;
  };

  const handleCreatePDF = async () => {
    setIsGenerating(true);
    try {
      // Generate the HTML content
      const htmlContent = generatePDF();

      // Create a new window with the PDF content
      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Auto-trigger print dialog
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };

      setPdfGenerated(true);
      setTimeout(() => setPdfGenerated(false), 3000);
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const htmlContent = generatePDF();

      // Create blob and download
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `advancement-statement-${
        advancement.id || 'unknown'
      }-${formatDate(statementData.date).replace(/[^a-zA-Z0-9]/g, '-')}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setPdfGenerated(true);
      setTimeout(() => setPdfGenerated(false), 3000);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download statement. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

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
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = `0 8px 25px ${color}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
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
                  Advancement Statement
                </h3>
                <p
                  className='mb-0 text-white'
                  style={{ opacity: 0.8, fontSize: '0.9rem' }}
                >
                  Generated on {formatDate(statementData.date)}
                </p>
              </div>
            </div>

            {/* PDF Export Actions - Always show now */}
            <div className='d-flex align-items-center gap-3'>
              {/* Secondary Actions */}
              <div className='d-flex gap-2'>
                <button
                  onClick={() => window.print()}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Printer size={16} />
                  Print
                </button>

                <button
                  onClick={handleDownloadPDF}
                  disabled={isGenerating}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    color: 'white',
                    cursor: isGenerating ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                    fontSize: '14px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    opacity: isGenerating ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isGenerating) {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isGenerating) {
                      e.currentTarget.style.background =
                        'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <Download size={16} />
                  Download
                </button>
              </div>

              {/* Main PDF Button */}
              <button
                onClick={handleCreatePDF}
                disabled={isGenerating}
                style={{
                  background: pdfGenerated
                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                    : isGenerating
                    ? 'linear-gradient(135deg, #94a3b8, #64748b)'
                    : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '12px 24px',
                  color: 'white',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: '14px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: pdfGenerated
                    ? '0 8px 25px rgba(34, 197, 94, 0.4)'
                    : isGenerating
                    ? '0 4px 15px rgba(148, 163, 184, 0.3)'
                    : '0 8px 25px rgba(99, 102, 241, 0.4)',
                  transform: isGenerating ? 'scale(0.98)' : 'scale(1)',
                  minWidth: '140px',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => {
                  if (!isGenerating && !pdfGenerated) {
                    e.currentTarget.style.transform =
                      'translateY(-2px) scale(1.02)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 35px rgba(99, 102, 241, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isGenerating && !pdfGenerated) {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow =
                      '0 8px 25px rgba(99, 102, 241, 0.4)';
                  }
                }}
              >
                {pdfGenerated ? (
                  <>
                    <CheckCircle size={18} />
                    PDF Ready!
                  </>
                ) : isGenerating ? (
                  <>
                    <div
                      style={{
                        width: '18px',
                        height: '18px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                    Creating...
                  </>
                ) : (
                  <>
                    <FileDown size={18} />
                    Export PDF
                  </>
                )}
              </button>
            </div>
          </div>

          {/* PDF Generation Status */}
          {(isGenerating || pdfGenerated) && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px 16px',
                background: pdfGenerated
                  ? 'rgba(34, 197, 94, 0.1)'
                  : 'rgba(99, 102, 241, 0.1)',
                border: `1px solid ${
                  pdfGenerated
                    ? 'rgba(34, 197, 94, 0.3)'
                    : 'rgba(99, 102, 241, 0.3)'
                }`,
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                animation: 'fadeIn 0.3s ease-in-out',
              }}
            >
              <div className='d-flex align-items-center gap-2'>
                {pdfGenerated ? (
                  <CheckCircle size={16} style={{ color: '#22c55e' }} />
                ) : (
                  <Download size={16} style={{ color: '#6366f1' }} />
                )}
                <span
                  style={{
                    color: pdfGenerated ? '#22c55e' : '#6366f1',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {pdfGenerated
                    ? '✨ PDF statement has been generated and is ready for printing!'
                    : '📄 Generating your professional PDF statement...'}
                </span>
              </div>
            </div>
          )}
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
              subtext='Principal advancement amount'
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
                      <strong>Total Amount Due</strong> = Initial Advancement
                      Amount + Yearly Interest ({initialFeePercentage}%) +
                      Compound Daily Interest + Exit Fee ({exitFeePercentage}%)
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
                              : day.type === 'LOAN SETTLED'
                              ? '#f0fdf4'
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
                                  : day.type === 'LOAN SETTLED'
                                  ? '#bbf7d0'
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
                                  : day.type === 'LOAN SETTLED'
                                  ? '#166534'
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
                            <span style={{ color: '#6b7280' }}>
                              {advancement.currency_sign}0.00
                            </span>
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
              Interest Calculation Summary
            </h5>
          </div>
          {statementData.segments && statementData.segments.length > 0 ? (
            statementData.segments.map((segment, index) => (
              <SegmentCard
                key={index}
                segment={segment}
                formatMoney={formatMoney}
                currency_sign={advancement.currency_sign}
              />
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

      <style>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
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

export default StatementDisplay;
