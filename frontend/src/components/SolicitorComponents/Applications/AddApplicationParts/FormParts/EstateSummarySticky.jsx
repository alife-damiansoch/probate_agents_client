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

// Helper function to convert to number (you may need to import this from wherever it's defined)
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
}) {
  const [expandLevel, setExpandLevel] = useState(0); // 0: minimal, 1: expanded, 2: full breakdown
  const [showDetails, setShowDetails] = useState({
    lendable: false,
    nonLendable: false,
    liabilities: false,
  });

  const requested = toNumber(formData?.amount || 0);

  // Calculate estate totals using the correct properties
  const calculations = React.useMemo(() => {
    const assets = estates.filter((estate) => estate.is_asset === true);
    const liabilities = estates.filter((estate) => estate.is_asset === false);

    // Categorize assets by lendable property
    const lendableAssets = assets.filter((estate) => estate.lendable === true);
    const nonLendableAssets = assets.filter(
      (estate) => estate.lendable === false
    );

    // Calculate totals
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
    const maximumAdvance = Math.max(0, lendableIrishEstate * 0.5);

    return {
      totalAssets,
      totalLiabilities,
      totalLendableAssets,
      totalNonLendableAssets,
      netIrishEstate,
      lendableIrishEstate,
      maximumAdvance,
      lendableAssets,
      nonLendableAssets,
      liabilities,
    };
  }, [estates]);

  const formatCurrency = (amount) => {
    return `${currency_sign}${Math.abs(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

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
    if (requested > calculations.maximumAdvance) {
      return {
        type: 'danger',
        message: 'Requested amount exceeds the maximum allowed advance.',
        short: 'Amount exceeds maximum',
      };
    }
    return {
      type: 'success',
      message: 'Requested amount is within the maximum allowed advance.',
      short: 'Amount within limits',
    };
  };

  const status = getStatusMessage();

  const toggleDetails = (section) => {
    setShowDetails((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
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
      <div className='mb-3'>
        <div
          className='d-flex justify-content-between align-items-center p-2 border rounded cursor-pointer'
          onClick={() => toggleDetails(sectionKey)}
          style={{ backgroundColor: '#f8f9fa', cursor: 'pointer' }}
        >
          <div className='d-flex align-items-center'>
            <span className={`fw-bold ${colorClass}`}>{title}</span>
            <span className='ms-2 text-muted'>
              ({estatesGroup.length} items)
            </span>
          </div>
          <div className='d-flex align-items-center'>
            <span className={`fw-bold me-2 ${colorClass}`}>
              {formatCurrency(total)}
            </span>
            {showDetails[sectionKey] ? (
              <FaEyeSlash size={12} />
            ) : (
              <FaEye size={12} />
            )}
          </div>
        </div>

        {showDetails[sectionKey] && (
          <div className='mt-2 ps-3'>
            {estatesGroup.map((estate, index) => (
              <div
                key={index}
                className='d-flex justify-content-between py-1 border-bottom'
              >
                <span
                  className='text-truncate me-2'
                  style={{ maxWidth: '200px' }}
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
        return 'auto'; // Minimal
      case 1:
        return 'auto'; // Expanded
      case 2:
        return '70vh'; // Full breakdown with scrolling
      default:
        return 'auto';
    }
  };

  const getButtonText = () => {
    switch (expandLevel) {
      case 0:
        return 'Show More';
      case 1:
        return 'Show Less | Show Breakdown';
      case 2:
        return 'Hide Breakdown';
      default:
        return 'Show More';
    }
  };

  const getButtonIcon = () => {
    switch (expandLevel) {
      case 0:
        return <FaChevronUp />;
      case 1:
        return <FaExpand />;
      case 2:
        return <FaCompress />;
      default:
        return <FaChevronUp />;
    }
  };

  const handleButtonClick = () => {
    if (expandLevel === 1) {
      // At level 1, we need two buttons: Show Less and Show Breakdown
      return;
    } else {
      cycleExpandLevel();
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
        backgroundColor: 'white',
        borderTop: '2px solid #dee2e6',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
        maxHeight: getContainerHeight(),
        overflow: expandLevel === 2 ? 'auto' : 'visible',
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <div className='container-fluid p-3'>
        {/* Minimal View - Always Visible */}
        <div className='d-flex justify-content-between align-items-center'>
          <div className='d-flex align-items-center'>
            <FaInfoCircle className='text-primary me-2' />
            <div>
              <span className='fw-bold text-primary me-3'>Max Advance: </span>
              <span className='h6 mb-0 text-warning fw-bold'>
                {formatCurrency(calculations.maximumAdvance)}
              </span>
              {requested > 0 && (
                <span className='ms-3 small text-muted'>
                  Requested:{' '}
                  <span className='fw-bold'>{formatCurrency(requested)}</span>
                </span>
              )}
            </div>
          </div>

          <div className='d-flex align-items-center'>
            <div
              className={`badge bg-${
                status.type === 'danger'
                  ? 'danger'
                  : status.type === 'success'
                  ? 'success'
                  : status.type === 'warning'
                  ? 'warning'
                  : 'info'
              } me-3`}
            >
              {status.short}
            </div>
            {expandLevel === 1 ? (
              <div className='d-flex gap-2'>
                <button
                  className='btn btn-outline-secondary btn-sm'
                  onClick={() => setExpandLevel(0)}
                >
                  <FaChevronDown />
                  <span className='ms-1 d-none d-sm-inline'>Show Less</span>
                </button>
                <button
                  className='btn btn-outline-primary btn-sm'
                  onClick={() => setExpandLevel(2)}
                >
                  <FaExpand />
                  <span className='ms-1 d-none d-sm-inline'>
                    Show Breakdown
                  </span>
                </button>
              </div>
            ) : (
              <button
                className='btn btn-outline-primary btn-sm'
                onClick={cycleExpandLevel}
              >
                {getButtonIcon()}
                <span className='ms-2 d-none d-sm-inline'>
                  {getButtonText()}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Expanded View - Level 1 */}
        {expandLevel >= 1 && (
          <div className='mt-3 pt-3 border-top'>
            <div className='row g-3 mb-3'>
              <div className='col-sm-6 col-lg-3'>
                <div
                  className='text-center p-2 border rounded'
                  style={{ backgroundColor: '#e8f5e8' }}
                >
                  <div className='small text-muted mb-1'>Total Assets</div>
                  <div className='h6 text-success mb-0 fw-bold'>
                    {formatCurrency(calculations.totalAssets)}
                  </div>
                </div>
              </div>

              <div className='col-sm-6 col-lg-3'>
                <div
                  className='text-center p-2 border rounded'
                  style={{ backgroundColor: '#ffe8e8' }}
                >
                  <div className='small text-muted mb-1'>Total Liabilities</div>
                  <div className='h6 text-danger mb-0 fw-bold'>
                    {formatCurrency(calculations.totalLiabilities)}
                  </div>
                </div>
              </div>

              <div className='col-sm-6 col-lg-3'>
                <div
                  className='text-center p-2 border rounded'
                  style={{ backgroundColor: '#e3f2fd' }}
                >
                  <div className='small text-muted mb-1'>Net Irish Estate</div>
                  <div className='h6 text-primary mb-0 fw-bold'>
                    {formatCurrency(calculations.netIrishEstate)}
                  </div>
                </div>
              </div>

              <div className='col-sm-6 col-lg-3'>
                <div
                  className='text-center p-2 border rounded'
                  style={{ backgroundColor: '#f3e5f5' }}
                >
                  <div className='small text-muted mb-1'>Lendable Estate</div>
                  <div className='h6 text-purple mb-0 fw-bold'>
                    {formatCurrency(calculations.lendableIrishEstate)}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div
              className={`alert alert-${
                status.type === 'danger'
                  ? 'danger'
                  : status.type === 'success'
                  ? 'success'
                  : status.type === 'warning'
                  ? 'warning'
                  : 'info'
              } mb-0`}
            >
              <div className='d-flex align-items-start'>
                <FaInfoCircle className='me-2 mt-1' />
                <div>
                  <strong>{status.message}</strong>
                  {status.type === 'danger' && (
                    <div className='mt-1 small'>
                      The maximum advance currently offered is{' '}
                      <strong>50% of the Lendable Irish Estate</strong>.
                      <br />
                      Please adjust the requested amount or estate details.
                    </div>
                  )}
                  {status.type === 'success' && (
                    <div className='mt-1 small'>
                      You can proceed with your application.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Breakdown View - Level 2 */}
        {expandLevel >= 2 && (
          <div className='mt-3 pt-3 border-top'>
            <div className='d-flex justify-content-between align-items-center mb-3'>
              <h6 className='text-secondary mb-0'>Detailed Estate Breakdown</h6>
              <button
                className='btn btn-outline-secondary btn-sm'
                onClick={() => setExpandLevel(1)}
              >
                <FaCompress />
                <span className='ms-1 d-none d-sm-inline'>Hide Breakdown</span>
              </button>
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
              <div className='text-center text-muted py-4'>
                <FaInfoCircle size={24} className='mb-2' />
                <div>No estate items have been added yet.</div>
                <div className='small'>
                  Add estate items to see the breakdown here.
                </div>
              </div>
            )}

            {/* Footer Note */}
            <div className='border-top pt-2 mt-3'>
              <small className='text-muted d-block'>
                <sup>*</sup> Only lendable estate items are considered for
                advance calculations. This assessment may change; please consult
                your agent for more information.
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
