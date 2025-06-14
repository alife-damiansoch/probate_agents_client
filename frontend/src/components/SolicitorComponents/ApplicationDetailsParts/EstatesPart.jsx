import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { FaBuilding, FaCog, FaFileInvoiceDollar, FaPlus } from 'react-icons/fa';
import EstateSummarySticky from '../Applications/AddApplicationParts/FormParts/EstateSummarySticky';
import EstateManagerModal from './EstatesManagerModal';
import { estateFieldMap } from './EstatesManagerModalParts/estateFieldConfig';
// Import the extracted functions
import {
  formatFieldName,
  getEstates,
} from '../../GenericFunctions/HelperGenericFunctions';

const EstatesPart = ({ application, refresh, setRefresh, isAdmin }) => {

  const [estates, setEstates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEstateModal, setShowEstateModal] = useState(false);

  console.log('Application:', application.id);

  // Fetch estates when application.estate_summary changes
  useEffect(() => {
    const fetchEstates = async () => {
      setLoading(true);
      try {
        const estatesData = await getEstates(application);
        setEstates(estatesData);
      } catch (error) {
        console.error('Error fetching estates:', error);
        setEstates([]);
      }
      setLoading(false);
    };

    fetchEstates();
  }, [application.estate_summary, refresh]);

  // Helper function to get field configuration for an estate category
  const getFieldsForCategory = (category) => {
    return estateFieldMap[category] || [];
  };

  // Helper function to render estate fields based on configuration
  const renderEstateFields = (estate) => {
    const fields = getFieldsForCategory(estate.category);

    if (fields.length === 0) {
      // Fallback to displaying all available properties if no config found
      const relevantFields = Object.entries(estate).filter(
        ([key, val]) =>
          val !== null &&
          val !== undefined &&
          val !== '' &&
          !['id', 'category', 'group_label', 'is_asset', 'value'].includes(key)
      );

      if (relevantFields.length === 0) return null;

      return (
        <div className='d-flex flex-wrap gap-3'>
          {relevantFields.slice(0, 3).map(([key, val]) => (
            <div key={key} className='d-flex align-items-center'>
              <span
                className='fw-medium text-slate-600 me-1'
                style={{ fontSize: '0.8rem' }}
              >
                {formatFieldName(key)}:
              </span>
              <span className='text-slate-500' style={{ fontSize: '0.8rem' }}>
                {val}
              </span>
            </div>
          ))}
          {relevantFields.length > 3 && (
            <div className='d-flex align-items-center'>
              <span
                className='badge rounded-pill px-2 py-1'
                style={{
                  backgroundColor: '#e5e7eb',
                  color: '#6b7280',
                  fontSize: '0.7rem',
                }}
              >
                +{relevantFields.length - 3} more
              </span>
            </div>
          )}
        </div>
      );
    }

    // Use field configuration to display structured data
    const fieldsToShow = fields.filter((field) => {
      const value = estate[field.name];
      return (
        field.name !== 'value' &&
        value !== null &&
        value !== undefined &&
        value !== ''
      );
    });

    if (fieldsToShow.length === 0) return null;

    return (
      <div className='d-flex flex-wrap gap-3'>
        {fieldsToShow.slice(0, 3).map((field) => {
          const value = estate[field.name];
          return (
            <div key={field.name} className='d-flex align-items-center'>
              <span
                className='fw-medium text-slate-600 me-1'
                style={{ fontSize: '0.8rem' }}
              >
                {field.label}:
              </span>
              <span className='text-slate-500' style={{ fontSize: '0.8rem' }}>
                {value}
              </span>
            </div>
          );
        })}
        {fieldsToShow.length > 3 && (
          <div className='d-flex align-items-center'>
            <span
              className='badge rounded-pill px-2 py-1'
              style={{
                backgroundColor: '#e5e7eb',
                color: '#6b7280',
                fontSize: '0.7rem',
              }}
            >
              +{fieldsToShow.length - 3} more
            </span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div
        className='text-center py-5'
        style={{
          background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
          borderRadius: '16px',
        }}
      >
        <div className='spinner-border text-primary mb-3' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
        <div className='fw-medium text-slate-600'>Loading estates...</div>
      </div>
    );
  }

  if (!estates || estates.length === 0) {
    return (
      <div
        className='border-0 mt-4'
        style={{
          borderRadius: '16px',
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          className='d-flex align-items-center border-0 p-4'
          style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
          }}
        >
          <div
            className='rounded-circle d-flex align-items-center justify-content-center me-3'
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <FaBuilding size={18} />
          </div>
          <h4 className='mb-0 fw-semibold'>Estates</h4>
        </div>

        {/* Content */}
        <div className='p-4' style={{ backgroundColor: '#ffffff' }}>
          <div
            className='alert border-0 text-center mb-4'
            style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              borderRadius: '12px',
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.1)',
            }}
          >
            <div className='d-flex align-items-center justify-content-center'>
              <i className='fas fa-exclamation-triangle me-2'></i>
              <span className='fw-medium'>
                No estate information available for this application.
              </span>
            </div>
          </div>

          <div className='text-end'>
            <button
              className='btn px-4 py-2 fw-medium'
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                transition: 'all 0.2s ease',
              }}
              onClick={() => setShowEstateModal(true)}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#2563eb';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#3b82f6';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <FaPlus className='me-2' size={14} />
              Manage Estates
            </button>
          </div>
        </div>

        <EstateManagerModal
          show={showEstateModal}
          onClose={() => setShowEstateModal(false)}
          estates={estates}
          applicationId={application.id}
          refreshEstates={() => setRefresh(!refresh)}
          currency_sign={application.currency_sign}
          isAdmin={isAdmin}
        />
      </div>
    );
  }

  // Group by label and separate assets from liabilities
  const grouped = estates.reduce((acc, estate) => {
    const key = estate.group_label || estate.label || estate.name || 'Unnamed';
    if (!acc[key]) acc[key] = [];
    acc[key].push(estate);
    return acc;
  }, {});

  // Separate assets and liabilities
  const assetGroups = {};
  const liabilityGroups = {};

  Object.entries(grouped).forEach(([key, estatesArray]) => {
    if (estatesArray.some((estate) => estate.is_asset === false)) {
      liabilityGroups[key] = estatesArray;
    } else {
      assetGroups[key] = estatesArray;
    }
  });

  return (
    <div
      className='border-0 mt-4'
      style={{
        borderRadius: '16px',
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        className='d-flex align-items-center border-0 p-4'
        style={{
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
        }}
      >
        <div
          className='rounded-circle d-flex align-items-center justify-content-center me-3'
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <FaBuilding size={18} />
        </div>
        <h4 className='mb-0 fw-semibold'>Estates</h4>
      </div>

      {/* Content */}
      <div className='p-4' style={{ backgroundColor: '#ffffff' }}>
        {/* Assets Section */}
        {Object.keys(assetGroups).length > 0 && (
          <>
            <div
              className='p-4 mb-4'
              style={{
                background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                border: '1px solid #3b82f6',
                borderRadius: '12px',
              }}
            >
              <div className='d-flex align-items-center mb-2'>
                <div
                  className='rounded-circle d-flex align-items-center justify-content-center me-3'
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                  }}
                >
                  <i
                    className='fas fa-chart-line'
                    style={{ fontSize: '0.875rem' }}
                  ></i>
                </div>
                <h6 className='mb-0 fw-bold' style={{ color: '#1e40af' }}>
                  ESTATE ASSETS
                </h6>
              </div>
              <p
                className='mb-0 small'
                style={{ color: '#1e3a8a', fontStyle: 'italic' }}
              >
                Property, investments, debts owed to the deceased, and other
                valuable items comprising the gross estate
              </p>
            </div>

            {Object.entries(assetGroups).map(
              ([estateName, groupedEstates], groupIndex) => (
                <div key={groupIndex} className='mb-4'>
                  <div
                    className='border-0'
                    style={{
                      borderRadius: '12px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      className='p-3'
                      style={{
                        backgroundColor: '#f8fafc',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      <h5 className='mb-0 fw-bold' style={{ color: '#3b82f6' }}>
                        {estateName}
                      </h5>
                    </div>
                    <div className='p-3' style={{ backgroundColor: '#ffffff' }}>
                      {groupedEstates.map((estate, index) => {
                        const displayName =
                          groupedEstates.length > 1
                            ? `${estateName} (${index + 1})`
                            : estateName;

                        return (
                          <div
                            key={index}
                            className={`d-flex align-items-center justify-content-between 
                            px-3 py-2 position-relative ${
                              index < groupedEstates.length - 1 ? 'mb-2' : ''
                            }`}
                            style={{
                              backgroundColor:
                                estate.is_asset === false
                                  ? '#fef2f2'
                                  : '#f8fafc',
                              borderLeft:
                                estate.is_asset === false
                                  ? '4px solid #ef4444'
                                  : '4px solid #06b6d4',
                              borderRadius: '6px',
                              minHeight: '60px',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.boxShadow =
                                '0 2px 4px rgba(0, 0, 0, 0.1)';
                              e.currentTarget.style.transform =
                                'translateX(2px)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.transform = 'translateX(0)';
                            }}
                          >
                            <div className='flex-grow-1 pe-3'>
                              <div className='d-flex align-items-center flex-wrap gap-2'>
                                {groupedEstates.length > 1 && (
                                  <span className='fw-bold text-slate-700 small'>
                                    {displayName}
                                  </span>
                                )}
                                {estate.is_asset === false && (
                                  <span
                                    className='badge rounded-pill px-2 py-1'
                                    style={{
                                      backgroundColor: '#fee2e2',
                                      color: '#dc2626',
                                      fontSize: '0.7rem',
                                    }}
                                    title='Liability'
                                  >
                                    <FaFileInvoiceDollar
                                      size={10}
                                      className='me-1'
                                    />
                                    Liability
                                  </span>
                                )}
                              </div>
                              <div className='mt-1'>
                                {renderEstateFields(estate)}
                              </div>
                            </div>

                            <div
                              className='d-flex align-items-center'
                              style={{ minWidth: '140px' }}
                            >
                              <div className='text-end w-100'>
                                <div
                                  className='small text-muted mb-1'
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  {estate.category === 'irish_debt'
                                    ? 'Amount Owed'
                                    : 'Value'}
                                </div>
                                <div
                                  className='fw-bold'
                                  style={{
                                    color:
                                      estate.is_asset === false
                                        ? '#ef4444'
                                        : '#059669',
                                    fontSize: '1rem',
                                  }}
                                >
                                  {application.currency_sign} {estate.value}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )
            )}
          </>
        )}

        {/* Liabilities Section */}
        {Object.keys(liabilityGroups).length > 0 && (
          <>
            <div
              className='p-4 mb-4'
              style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                border: '1px solid #f59e0b',
                borderRadius: '12px',
                marginTop: Object.keys(assetGroups).length > 0 ? '2rem' : '0',
              }}
            >
              <div className='d-flex align-items-center mb-2'>
                <div
                  className='rounded-circle d-flex align-items-center justify-content-center me-3'
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#f59e0b',
                    color: 'white',
                  }}
                >
                  <i
                    className='fas fa-exclamation-triangle'
                    style={{ fontSize: '0.875rem' }}
                  ></i>
                </div>
                <h6 className='mb-0 fw-bold' style={{ color: '#92400e' }}>
                  ESTATE LIABILITIES
                </h6>
              </div>
              <p
                className='mb-0 small'
                style={{ color: '#92400e', fontStyle: 'italic' }}
              >
                Debts, funeral expenses, and other obligations payable by the
                estate
              </p>
            </div>

            {Object.entries(liabilityGroups).map(
              ([estateName, groupedEstates], groupIndex) => (
                <div key={groupIndex} className='mb-4'>
                  <div
                    className='border-0'
                    style={{
                      borderRadius: '12px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      className='p-3'
                      style={{
                        backgroundColor: '#f8fafc',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      <h5 className='mb-0 fw-bold' style={{ color: '#3b82f6' }}>
                        {estateName}
                      </h5>
                    </div>
                    <div className='p-3' style={{ backgroundColor: '#ffffff' }}>
                      {groupedEstates.map((estate, index) => {
                        const displayName =
                          groupedEstates.length > 1
                            ? `${estateName} (${index + 1})`
                            : estateName;

                        return (
                          <div
                            key={index}
                            className={`d-flex align-items-center justify-content-between 
                            px-3 py-2 position-relative ${
                              index < groupedEstates.length - 1 ? 'mb-2' : ''
                            }`}
                            style={{
                              backgroundColor:
                                estate.is_asset === false
                                  ? '#fef2f2'
                                  : '#f8fafc',
                              borderLeft:
                                estate.is_asset === false
                                  ? '4px solid #ef4444'
                                  : '4px solid #06b6d4',
                              borderRadius: '6px',
                              minHeight: '60px',
                              transition: 'all 0.2s ease',
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.boxShadow =
                                '0 2px 4px rgba(0, 0, 0, 0.1)';
                              e.currentTarget.style.transform =
                                'translateX(2px)';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.boxShadow = 'none';
                              e.currentTarget.style.transform = 'translateX(0)';
                            }}
                          >
                            <div className='flex-grow-1 pe-3'>
                              <div className='d-flex align-items-center flex-wrap gap-2'>
                                {groupedEstates.length > 1 && (
                                  <span className='fw-bold text-slate-700 small'>
                                    {displayName}
                                  </span>
                                )}
                                {estate.is_asset === false && (
                                  <span
                                    className='badge rounded-pill px-2 py-1'
                                    style={{
                                      backgroundColor: '#fee2e2',
                                      color: '#dc2626',
                                      fontSize: '0.7rem',
                                    }}
                                    title='Liability'
                                  >
                                    <FaFileInvoiceDollar
                                      size={10}
                                      className='me-1'
                                    />
                                    Liability
                                  </span>
                                )}
                              </div>
                              <div className='mt-1'>
                                {renderEstateFields(estate)}
                              </div>
                            </div>

                            <div
                              className='d-flex align-items-center'
                              style={{ minWidth: '140px' }}
                            >
                              <div className='text-end w-100'>
                                <div
                                  className='small text-muted mb-1'
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  {estate.category === 'irish_debt'
                                    ? 'Amount Owed'
                                    : 'Value'}
                                </div>
                                <div
                                  className='fw-bold'
                                  style={{
                                    color:
                                      estate.is_asset === false
                                        ? '#ef4444'
                                        : '#059669',
                                    fontSize: '1rem',
                                  }}
                                >
                                  {application.currency_sign} {estate.value}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )
            )}
          </>
        )}

        {/* Manage Estates Button */}
        <div className='text-end mb-3'>
          <button
            type='button'
            className='btn px-4 py-2 fw-medium'
            style={{
              backgroundColor: 'transparent',
              color: '#3b82f6',
              border: '2px solid #3b82f6',
              borderRadius: '10px',
              transition: 'all 0.2s ease',
            }}
            onClick={() => setShowEstateModal(true)}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#3b82f6';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#3b82f6';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <FaCog className='me-2' size={14} />
            Manage Estates
          </button>
        </div>

        <EstateSummarySticky
          estates={estates}
          formData={application}
          currency_sign={application.currency_sign}
        />
      </div>

      <EstateManagerModal
        show={showEstateModal}
        onClose={() => setShowEstateModal(false)}
        estates={estates}
        applicationId={application.id}
        refreshEstates={() => setRefresh(!refresh)}
        currency_sign={application.currency_sign}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default EstatesPart;
