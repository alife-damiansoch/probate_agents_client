import React, { useState } from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaCompress,
  FaExpand,
  FaEye,
  FaEyeSlash,
  FaInfoCircle,
} from 'react-icons/fa';
import { formatMoney } from '../../../../GenericFunctions/HelperGenericFunctions';

// Helper function to convert to number
const toNumber = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.-]/g, '');
    return parseFloat(cleaned) || 0;
  }
  return 0;
};

export default function EstateSummarySticky({
  estates,
  formData,
  currency_sign,
  onStatusChange, // NEW: Callback to pass status to parent
  isAmountWithinLimits,
  setIsAmountWithinLimits,
}) {
  const [expandLevel, setExpandLevel] = useState(0);
  const [showDetails, setShowDetails] = useState({
    lendable: false,
    nonLendable: false,
    liabilities: false,
  });

  // NEW: State to track if amount is within limits

  const requested = toNumber(formData?.amount || 0);

  const calculations = React.useMemo(() => {
    const assets = estates.filter((estate) => estate.is_asset === true);
    const liabilities = estates.filter((estate) => estate.is_asset === false);

    const lendableAssets = assets.filter((estate) => estate.lendable === true);
    const nonLendableAssets = assets.filter(
      (estate) => estate.lendable === false
    );

    const totalAssets = assets.reduce(
      (sum, estate) => sum + toNumber(estate.value),
      0
    );
    const totalLiabilities = liabilities.reduce(
      (sum, estate) => sum + toNumber(estate.value),
      0
    );
    const totalLendableAssets = lendableAssets.reduce(
      (sum, estate) => sum + toNumber(estate.value),
      0
    );
    const totalNonLendableAssets = nonLendableAssets.reduce(
      (sum, estate) => sum + toNumber(estate.value),
      0
    );

    const netIrishEstate = totalAssets - totalLiabilities;
    const lendableIrishEstate = totalLendableAssets - totalLiabilities;

    // 50% advance (without fees)
    const maximumAdvance = Math.max(0, lendableIrishEstate * 0.5);

    // 55% advance (with fees included)
    const maximumAdvanceWithFees = Math.max(0, lendableIrishEstate * 0.55);

    return {
      totalAssets,
      totalLiabilities,
      totalLendableAssets,
      totalNonLendableAssets,
      netIrishEstate,
      lendableIrishEstate,
      maximumAdvance,
      maximumAdvanceWithFees,
      lendableAssets,
      nonLendableAssets,
      liabilities,
    };
  }, [estates]);

  const formatCurrency = (amount) => formatMoney(amount, currency_sign);

  const getStatusMessage = () => {
    if (calculations.lendableIrishEstate <= 0) {
      return {
        type: 'warning',
        message:
          'Please enter estate details to calculate advance eligibility.',
        short: 'Enter estate details',
      };
    }
    if (requested <= 0) {
      return {
        type: 'info',
        message: 'Please enter the requested advance amount above.',
        short: 'Enter requested amount',
      };
    }
    if (requested > calculations.maximumAdvanceWithFees) {
      return {
        type: 'danger',
        message:
          'Requested amount exceeds the maximum allowed advance with fees.',
        short: 'Amount exceeds maximum',
      };
    }
    return {
      type: 'success',
      message:
        'Requested amount is within the maximum allowed advance with fees.',
      short: 'Amount within limits',
    };
  };

  const status = getStatusMessage();

  // NEW: Update state and notify parent when status changes
  React.useEffect(() => {
    const withinLimits =
      status.type === 'success' && status.short === 'Amount within limits';
    setIsAmountWithinLimits(withinLimits);

    // Call parent callback if provided
    if (onStatusChange) {
      onStatusChange({
        isAmountWithinLimits: withinLimits,
        status: status,
        maxAdvance: calculations.maximumAdvance,
        maxAdvanceWithFees: calculations.maximumAdvanceWithFees,
        requestedAmount: requested,
      });
    }
  }, [
    status.type,
    status.short,
    calculations.maximumAdvance,
    calculations.maximumAdvanceWithFees,
    requested,
    onStatusChange,
  ]);

  const toggleDetails = (section) => {
    setShowDetails((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const cycleExpandLevel = () => {
    setExpandLevel((prev) => (prev + 1) % 3);
  };

  const renderEstateGroup = (estatesGroup, title, colorClass) => {
    if (estatesGroup.length === 0) return null;

    const total = estatesGroup.reduce(
      (sum, estate) => sum + toNumber(estate.value),
      0
    );
    const sectionKey = title.toLowerCase().replace(/\s+/g, '');

    return (
      <div className='mb-2'>
        <div
          className='d-flex justify-content-between align-items-center p-2 rounded-3 cursor-pointer'
          onClick={() => toggleDetails(sectionKey)}
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,249,250,0.9) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <div className='d-flex align-items-center'>
            <span className={`fw-bold ${colorClass} small`}>{title}</span>
            <span className='ms-2 text-muted' style={{ fontSize: '0.75rem' }}>
              ({estatesGroup.length})
            </span>
          </div>
          <div className='d-flex align-items-center'>
            <span className={`fw-bold me-2 ${colorClass} small`}>
              {formatCurrency(total)}
            </span>
            {showDetails[sectionKey] ? (
              <FaEyeSlash size={10} />
            ) : (
              <FaEye size={10} />
            )}
          </div>
        </div>

        {showDetails[sectionKey] && (
          <div className='mt-1 ps-3'>
            {estatesGroup.map((estate, index) => (
              <div
                key={index}
                className='d-flex justify-content-between py-1 border-bottom'
                style={{ fontSize: '0.75rem' }}
              >
                <span
                  className='text-truncate me-2'
                  style={{ maxWidth: '180px' }}
                >
                  {estate.group_label || estate.name || 'Unnamed'}
                </span>
                <span className='text-nowrap'>
                  {formatCurrency(estate.value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getContainerHeight = () => {
    switch (expandLevel) {
      case 0:
        return '60px';
      case 1:
        return 'auto';
      case 2:
        return '60vh';
      default:
        return '60px';
    }
  };

  return (
    <div
      className='estate-summary-sticky'
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1050,
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.98) 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.3)',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.1), 0 -2px 10px rgba(0,0,0,0.05)',
        maxHeight: getContainerHeight(),
        overflow: expandLevel === 2 ? 'auto' : 'visible',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className='container-fluid' style={{ padding: '12px 16px' }}>
        {/* Ultra Minimal View */}
        <div className='d-flex justify-content-between align-items-center'>
          <div className='d-flex align-items-center gap-3'>
            <div
              className='d-flex align-items-center justify-content-center rounded-circle'
              style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              }}
            >
              <FaInfoCircle className='text-white' size={14} />
            </div>

            <div className='d-flex flex-column' style={{ lineHeight: '1.2' }}>
              <div className='d-flex align-items-center gap-3'>
                <div>
                  <span className='text-muted small me-2'>Max Advance:</span>
                  <span
                    className='fw-bold text-primary'
                    style={{ fontSize: '0.9rem' }}
                  >
                    {formatCurrency(calculations.maximumAdvance)}
                  </span>
                </div>
                <div>
                  <span className='text-muted small me-2'>
                    With Fees (55%):
                  </span>
                  <span
                    className='fw-bold text-success'
                    style={{ fontSize: '0.9rem' }}
                  >
                    {formatCurrency(calculations.maximumAdvanceWithFees)}
                  </span>
                </div>
                {requested > 0 && (
                  <div>
                    <span className='text-muted small me-2'>Requested:</span>
                    <span
                      className='fw-bold text-dark'
                      style={{ fontSize: '0.9rem' }}
                    >
                      {formatCurrency(requested)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='d-flex align-items-center gap-2'>
            <div
              className={`badge rounded-pill px-3 py-1 ${
                status.type === 'danger'
                  ? 'bg-danger'
                  : status.type === 'success'
                  ? 'bg-success'
                  : status.type === 'warning'
                  ? 'bg-warning text-dark'
                  : 'bg-info'
              }`}
              style={{ fontSize: '0.7rem', fontWeight: '600' }}
            >
              {status.short}
            </div>

            {expandLevel === 1 ? (
              <div className='d-flex gap-1'>
                <button
                  className='btn btn-outline-secondary btn-sm rounded-pill px-2 py-1'
                  onClick={() => setExpandLevel(0)}
                  style={{ fontSize: '0.7rem', lineHeight: '1' }}
                >
                  <FaChevronDown size={10} />
                </button>
                <button
                  className='btn btn-outline-primary btn-sm rounded-pill px-2 py-1'
                  onClick={() => setExpandLevel(2)}
                  style={{ fontSize: '0.7rem', lineHeight: '1' }}
                >
                  <FaExpand size={10} />
                </button>
              </div>
            ) : (
              <button
                className='btn btn-outline-primary btn-sm rounded-pill px-2 py-1'
                onClick={cycleExpandLevel}
                style={{ fontSize: '0.7rem', lineHeight: '1' }}
              >
                {expandLevel === 0 ? (
                  <FaChevronUp size={10} />
                ) : (
                  <FaCompress size={10} />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Expanded View */}
        {expandLevel >= 1 && (
          <div
            className='mt-3 pt-3'
            style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}
          >
            <div className='row g-2 mb-3'>
              <div className='col-3'>
                <div
                  className='text-center p-2 rounded-3'
                  style={{
                    background:
                      'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                  }}
                >
                  <div
                    className='small text-muted mb-1'
                    style={{ fontSize: '0.7rem' }}
                  >
                    Total Assets
                  </div>
                  <div
                    className='fw-bold text-success mb-0'
                    style={{ fontSize: '0.8rem' }}
                  >
                    {formatCurrency(calculations.totalAssets)}
                  </div>
                </div>
              </div>
              <div className='col-3'>
                <div
                  className='text-center p-2 rounded-3'
                  style={{
                    background:
                      'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
                  }}
                >
                  <div
                    className='small text-muted mb-1'
                    style={{ fontSize: '0.7rem' }}
                  >
                    Liabilities
                  </div>
                  <div
                    className='fw-bold text-danger mb-0'
                    style={{ fontSize: '0.8rem' }}
                  >
                    {formatCurrency(calculations.totalLiabilities)}
                  </div>
                </div>
              </div>
              <div className='col-3'>
                <div
                  className='text-center p-2 rounded-3'
                  style={{
                    background:
                      'linear-gradient(135deg, #cce5ff 0%, #b3d9ff 100%)',
                  }}
                >
                  <div
                    className='small text-muted mb-1'
                    style={{ fontSize: '0.7rem' }}
                  >
                    Net Estate
                  </div>
                  <div
                    className='fw-bold text-primary mb-0'
                    style={{ fontSize: '0.8rem' }}
                  >
                    {formatCurrency(calculations.netIrishEstate)}
                  </div>
                </div>
              </div>
              <div className='col-3'>
                <div
                  className='text-center p-2 rounded-3'
                  style={{
                    background:
                      'linear-gradient(135deg, #e2e3ff 0%, #d1d3ff 100%)',
                  }}
                >
                  <div
                    className='small text-muted mb-1'
                    style={{ fontSize: '0.7rem' }}
                  >
                    Lendable
                  </div>
                  <div
                    className='fw-bold text-purple mb-0'
                    style={{ fontSize: '0.8rem' }}
                  >
                    {formatCurrency(calculations.lendableIrishEstate)}
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`alert mb-0 py-2 px-3 rounded-3 alert-${
                status.type === 'danger'
                  ? 'danger'
                  : status.type === 'success'
                  ? 'success'
                  : status.type === 'warning'
                  ? 'warning'
                  : 'info'
              }`}
              style={{ fontSize: '0.8rem' }}
            >
              <div className='d-flex align-items-start'>
                <FaInfoCircle className='me-2 mt-1' size={12} />
                <div>
                  <strong>{status.message}</strong>
                  {status.type === 'success' && (
                    <div className='mt-1 small'>
                      This amount is within the 55% advance limit (includes
                      fees). You can proceed.
                    </div>
                  )}
                  {status.type === 'danger' && (
                    <div className='mt-1 small'>
                      Maximum 55% of lendable estate (includes fees). Please
                      adjust the amount.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Breakdown */}
        {expandLevel >= 2 && (
          <div
            className='mt-3 pt-3'
            style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }}
          >
            <div className='d-flex justify-content-between align-items-center mb-2'>
              <h6
                className='text-secondary mb-0'
                style={{ fontSize: '0.9rem' }}
              >
                Estate Breakdown
              </h6>
            </div>

            {renderEstateGroup(
              calculations.lendableAssets,
              'Lendable Assets',
              'text-success'
            )}
            {renderEstateGroup(
              calculations.nonLendableAssets,
              'Non-Lendable Assets',
              'text-warning'
            )}
            {renderEstateGroup(
              calculations.liabilities,
              'Liabilities',
              'text-danger'
            )}

            {estates.length === 0 && (
              <div className='text-center text-muted py-3'>
                <FaInfoCircle size={20} className='mb-2' />
                <div style={{ fontSize: '0.8rem' }}>
                  No estate items added yet
                </div>
              </div>
            )}

            <div className='border-top pt-2 mt-2'>
              <small className='text-muted' style={{ fontSize: '0.65rem' }}>
                <sup>*</sup> 50% advance (standard) vs 55% advance (includes
                fees). Only lendable assets considered.
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
