import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { API_URL } from '../../../baseUrls';
import {
  deleteData,
  patchData,
  postData,
} from '../../GenericFunctions/AxiosGenericFunctions';
import EstateFormModal from './EstatesManagerModalParts/EstateFormModal';
import EstateGroupManager from './EstatesManagerModalParts/EstateGroupManager';

const SIMPLE_TYPES = [
  'household_contents',
  'cars_boats',
  'business_farming',
  'business_other',
  'unpaid_purchase_money',
];

const ESTATE_ASSETS = [
  'real_and_leasehold',
  'household_contents',
  'cars_boats',
  'business_farming',
  'business_other',
  'financial_assets',
  'life_insurance',
  'debts_owing',
  'securities_quoted',
  'securities_unquoted',
  'unpaid_purchase_money',
  'other_property',
];

const ESTATE_LIABILITIES = ['irish_debts'];

const ESTATE_DISPLAY_ORDER = [...ESTATE_ASSETS, ...ESTATE_LIABILITIES];

const estateLabels = {
  real_and_leasehold: 'Real and Leasehold Property',
  household_contents: 'Household Contents',
  cars_boats: 'Cars/Boats',
  business_farming: 'Business Assets (Farming)',
  business_other: 'Business Assets (Other)',
  financial_assets: 'Assets with Financial Institutions',
  life_insurance: 'Proceeds of Life Insurance Policies',
  debts_owing: 'Debts Owing to the Deceased',
  securities_quoted: 'Stocks, Shares and Securities (Quoted)',
  securities_unquoted: 'Stocks, Shares and Securities (Unquoted)',
  unpaid_purchase_money: 'Unpaid Purchase Money',
  other_property: 'Other Property',
  irish_debts: 'Irish Debts and Funeral Expenses',
};

const EstateManagerModal = ({
  show,
  onClose,
  estates,
  applicationId,
  refreshEstates,
  currency_sign = '€',
  isAdmin = false,
}) => {
  if (!show) return null;

  const token = Cookies.get('auth_token')?.access;

  const grouped = ESTATE_DISPLAY_ORDER.reduce((acc, key) => {
    acc[key] = estates.filter((e) => e.category === key);
    return acc;
  }, {});

  const [simpleValues, setSimpleValues] = useState(() => {
    const initial = {};
    SIMPLE_TYPES.forEach((type) => {
      initial[type] = grouped[type]?.[0]?.value || '';
    });
    return initial;
  });

  const [pendingChanges, setPendingChanges] = useState(new Set());
  const [savingStates, setSavingStates] = useState({});
  const [formState, setFormState] = useState({
    show: false,
    mode: 'add',
    estateType: null,
    initialData: null,
  });

  useEffect(() => {
    const newValues = {};
    SIMPLE_TYPES.forEach((type) => {
      newValues[type] = grouped[type]?.[0]?.value || '';
    });
    setSimpleValues(newValues);
    setPendingChanges(new Set());
  }, [estates]);

  const openForm = (type, estate = null) => {
    setFormState({
      show: true,
      mode: estate ? 'edit' : 'add',
      estateType: type,
      initialData: estate,
    });
  };

  const closeForm = () => {
    setFormState({
      show: false,
      mode: 'add',
      estateType: null,
      initialData: null,
    });
  };

  const handleFormSubmit = async (type, data) => {
    if (!type) {
      console.error('Estate type is required for form submission');
      return;
    }

    const baseUrl = `${API_URL}/api/estates/${type}/`;
    const body = { ...data, application: applicationId };

    try {
      if (formState.mode === 'add') {
        await postData(token, baseUrl, body);
      } else if (data.id) {
        await patchData(`${baseUrl}${data.id}/`, body);
      } else {
        throw new Error('Estate ID is required for editing');
      }
      closeForm();
      refreshEstates();
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save estate. Please try again.');
    }
  };

  const handleDelete = async (type, estate) => {
    if (!type || !estate?.id) {
      console.error('Estate type and ID are required for deletion');
      return;
    }

    if (!confirm('Are you sure you want to delete this estate?')) {
      return;
    }

    try {
      const deleteEndpoint = `${API_URL}/api/estates/${type}/${estate.id}/`;
      await deleteData(deleteEndpoint);
      refreshEstates();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete estate. Please try again.');
    }
  };

  const handleSimpleChange = (e, type) => {
    const newValue = e.target.value;
    setSimpleValues((prev) => ({ ...prev, [type]: newValue }));
    setPendingChanges((prev) => new Set([...prev, type]));
  };

  const handleSimpleSave = async (type) => {
    if (!type) {
      console.error('Estate type is required for saving');
      return;
    }

    setSavingStates((prev) => ({ ...prev, [type]: true }));

    try {
      const value = simpleValues[type];
      const existing = grouped[type]?.[0];

      if (existing?.id) {
        const updateEndpoint = `${API_URL}/api/estates/${type}/${existing.id}/`;
        await patchData(updateEndpoint, {
          value,
          application: applicationId,
        });
      } else if (value !== '' && value !== null && value !== undefined) {
        const createEndpoint = `${API_URL}/api/estates/${type}/`;
        await postData(token, createEndpoint, {
          value,
          application: applicationId,
        });
      }

      setPendingChanges((prev) => {
        const newSet = new Set(prev);
        newSet.delete(type);
        return newSet;
      });

      refreshEstates();
    } catch (err) {
      console.error('Save error for', type, ':', err);
      alert(`Failed to save ${estateLabels[type]}. Please try again.`);
    } finally {
      setSavingStates((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleSimpleDelete = async (type) => {
    const existing = grouped[type]?.[0];

    if (!existing?.id) {
      setSimpleValues((prev) => ({ ...prev, [type]: '' }));
      setPendingChanges((prev) => {
        const newSet = new Set(prev);
        newSet.delete(type);
        return newSet;
      });
      return;
    }

    if (!confirm(`Are you sure you want to delete ${estateLabels[type]}?`)) {
      return;
    }

    setSavingStates((prev) => ({ ...prev, [type]: true }));

    try {
      const deleteEndpoint = `${API_URL}/api/estates/${type}/${existing.id}/`;
      await deleteData(deleteEndpoint);

      setSimpleValues((prev) => ({ ...prev, [type]: '' }));
      setPendingChanges((prev) => {
        const newSet = new Set(prev);
        newSet.delete(type);
        return newSet;
      });

      refreshEstates();
    } catch (err) {
      console.error('Delete error for', type, ':', err);
      alert(`Failed to delete ${estateLabels[type]}. Please try again.`);
    } finally {
      setSavingStates((prev) => ({ ...prev, [type]: false }));
    }
  };

  const renderSectionHeader = (title, description, isLiability = false) => (
    <div
      style={{
        padding: '12px 16px',
        marginBottom: '16px',
        backgroundColor: isLiability ? '#fef3c7' : '#dbeafe',
        border: `1px solid ${isLiability ? '#f59e0b' : '#3b82f6'}`,
        borderRadius: '6px',
        borderLeft: `4px solid ${isLiability ? '#f59e0b' : '#3b82f6'}`,
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: '15px',
          fontWeight: '600',
          color: isLiability ? '#92400e' : '#1e40af',
          marginBottom: description ? '4px' : 0,
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            margin: 0,
            fontSize: '12px',
            color: '#6b7280',
            lineHeight: '1.4',
          }}
        >
          {description}
        </p>
      )}
    </div>
  );

  const renderSimpleEstateInput = (type, isLiability = false) => {
    const hasPendingChanges = pendingChanges.has(type);
    const isSaving = savingStates[type];
    const hasExistingValue = grouped[type].length > 0;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', minWidth: '200px' }}
        >
          <label
            htmlFor={`value-${type}`}
            style={{
              fontSize: '13px',
              fontWeight: '500',
              color: '#374151',
              marginRight: '8px',
              minWidth: '45px',
            }}
          >
            {isLiability ? 'Amount:' : 'Value:'}
          </label>
          <input
            id={`value-${type}`}
            type='number'
            value={simpleValues[type]}
            onChange={(e) => handleSimpleChange(e, type)}
            placeholder={isLiability ? 'Enter amount owed' : 'Enter value'}
            disabled={isSaving}
            style={{
              width: '140px',
              padding: '6px 8px',
              fontSize: '13px',
              border: `1px solid ${hasPendingChanges ? '#f59e0b' : '#d1d5db'}`,
              borderRadius: '4px',
              backgroundColor: isSaving ? '#f9fafb' : '#ffffff',
              outline: 'none',
              transition: 'border-color 0.15s ease',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          {hasPendingChanges && (
            <div
              style={{ position: 'relative', display: 'inline-block' }}
              title={!isAdmin ? 'Only administrators can save estates' : ''}
            >
              <button
                onClick={() => handleSimpleSave(type)}
                disabled={isSaving || !isAdmin}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: '500',
                  color: !isAdmin ? '#9ca3af' : '#ffffff',
                  backgroundColor: isSaving
                    ? '#9ca3af'
                    : !isAdmin
                    ? '#f3f4f6'
                    : '#10b981',
                  border: !isAdmin ? '1px solid #e5e7eb' : 'none',
                  borderRadius: '4px',
                  cursor: isSaving
                    ? 'not-allowed'
                    : !isAdmin
                    ? 'not-allowed'
                    : 'pointer',
                  transition: 'all 0.15s ease',
                  opacity: !isAdmin ? 0.6 : 1,
                }}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}

          {(hasExistingValue || simpleValues[type]) && (
            <div
              style={{ position: 'relative', display: 'inline-block' }}
              title={!isAdmin ? 'Only administrators can delete estates' : ''}
            >
              <button
                type='button'
                onClick={() => handleSimpleDelete(type)}
                disabled={isSaving || !isAdmin}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontWeight: '500',
                  color: !isAdmin ? '#9ca3af' : '#ffffff',
                  backgroundColor: isSaving
                    ? '#9ca3af'
                    : !isAdmin
                    ? '#f3f4f6'
                    : '#dc2626',
                  border: !isAdmin ? '1px solid #e5e7eb' : 'none',
                  borderRadius: '4px',
                  cursor: isSaving
                    ? 'not-allowed'
                    : !isAdmin
                    ? 'not-allowed'
                    : 'pointer',
                  transition: 'all 0.15s ease',
                  opacity: !isAdmin ? 0.6 : 1,
                }}
              >
                {isSaving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(2px)',
        zIndex: 1050,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          width: '100%',
          maxWidth: '900px',
          height: '90vh',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid #e5e7eb',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f9fafb',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
            }}
          >
            Estate Assets and Liabilities
          </h2>
          <button
            onClick={onClose}
            style={{
              padding: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              color: '#6b7280',
              fontSize: '18px',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div
          style={{
            flex: 1,
            padding: '20px',
            overflowY: 'auto',
            backgroundColor: '#f9fafb',
          }}
        >
          {/* Assets Section */}
          {renderSectionHeader(
            'ESTATE ASSETS',
            'Property, investments, debts owed to the deceased, and other valuable items comprising the gross estate'
          )}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '32px',
            }}
          >
            {ESTATE_ASSETS.map((type) => {
              const label = estateLabels[type];
              const entries = grouped[type];
              const isSimple = SIMPLE_TYPES.includes(type);
              const isRequired = type === 'real_and_leasehold';
              const hasEntries = entries.length > 0;
              const isRequiredAndEmpty = isRequired && !hasEntries;

              return (
                <div
                  key={type}
                  style={{
                    backgroundColor: '#ffffff',
                    border: `1px solid ${
                      isRequiredAndEmpty ? '#dc2626' : '#e5e7eb'
                    }`,
                    borderRadius: '6px',
                    padding: '12px 16px',
                    transition: 'border-color 0.15s ease',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: isRequiredAndEmpty ? '#dc2626' : '#3b82f6',
                      marginBottom: isSimple ? '8px' : '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {label}
                    {isRequired && (
                      <span style={{ color: '#dc2626', fontSize: '14px' }}>
                        *
                      </span>
                    )}
                    {isRequiredAndEmpty && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '500',
                          color: '#dc2626',
                          backgroundColor: '#fee2e2',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          marginLeft: '8px',
                        }}
                      >
                        Required
                      </span>
                    )}
                  </div>

                  {isSimple ? (
                    renderSimpleEstateInput(type, false)
                  ) : (
                    <EstateGroupManager
                      typeKey={type}
                      label={label}
                      estates={entries}
                      onAdd={openForm}
                      onEdit={openForm}
                      onDelete={handleDelete}
                      currency_sign={currency_sign}
                      isAdmin={isAdmin}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Liabilities Section */}
          {renderSectionHeader(
            'ESTATE LIABILITIES',
            'Debts, funeral expenses, and other obligations payable by the estate',
            true
          )}

          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {ESTATE_LIABILITIES.map((type) => {
              const label = estateLabels[type];
              const entries = grouped[type];
              const isSimple = SIMPLE_TYPES.includes(type);

              return (
                <div
                  key={type}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #f59e0b',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    transition: 'border-color 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#d97706',
                      marginBottom: isSimple ? '8px' : '12px',
                    }}
                  >
                    {label}
                  </div>

                  {isSimple ? (
                    renderSimpleEstateInput(type, true)
                  ) : (
                    <EstateGroupManager
                      typeKey={type}
                      label={label}
                      estates={entries}
                      onAdd={openForm}
                      onEdit={openForm}
                      onDelete={handleDelete}
                      currency_sign={currency_sign}
                      isAdmin={isAdmin}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 20px',
            borderTop: '1px solid #e5e7eb',
            display: 'flex',
            justifyContent: 'flex-end',
            backgroundColor: '#f9fafb',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              backgroundColor: '#ffffff',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#f3f4f6';
              e.target.style.borderColor = '#9ca3af';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#ffffff';
              e.target.style.borderColor = '#d1d5db';
            }}
          >
            Close
          </button>
        </div>
      </div>

      <EstateFormModal
        show={formState.show}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        estateType={formState.estateType}
        initialData={formState.initialData}
        currency_sign={currency_sign}
        isAdmin={isAdmin}
      />
    </div>
  );
};

export default EstateManagerModal;
