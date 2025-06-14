import { formatMoney } from '../../../GenericFunctions/HelperGenericFunctions';
import { estateFieldMap } from './estateFieldConfig';

const EstateGroupManager = ({
  label,
  typeKey,
  estates,
  onAdd,
  onEdit,
  onDelete,
  currency_sign = '€',
  isAdmin = false,
}) => {
  const formatFieldName = (fieldName) => {
    return fieldName
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getFieldsForCategory = (category) => {
    return estateFieldMap[category] || [];
  };

  const renderEstateDetails = (estate) => {
    const fields = getFieldsForCategory(typeKey);

    if (fields.length === 0) {
      const keyFields = [
        'description',
        'address',
        'institution',
        'insurer',
        'debtor',
        'creditor',
      ];
      const displayField = keyFields.find((field) => estate[field]);
      return estate[displayField] || estate.label || `Entry`;
    }

    const primaryField = fields.find(
      (field) =>
        field.name !== 'value' &&
        estate[field.name] &&
        estate[field.name].toString().trim() !== ''
    );

    if (primaryField) {
      return estate[primaryField.name];
    }

    return `${label} Entry`;
  };

  const renderAllEstateFields = (estate) => {
    const fields = getFieldsForCategory(typeKey);

    if (fields.length === 0) {
      const relevantFields = Object.entries(estate).filter(
        ([key, val]) =>
          val !== null &&
          val !== undefined &&
          val !== '' &&
          !['id', 'category', 'group_label', 'is_asset'].includes(key)
      );

      if (relevantFields.length === 0) return null;

      return (
        <div
          style={{
            marginTop: '8px',
            padding: '8px',
            backgroundColor: '#f9fafb',
            borderRadius: '4px',
            fontSize: '13px',
            lineHeight: '1.4',
          }}
        >
          {relevantFields.map(([key, val]) => (
            <div key={key} style={{ display: 'flex', marginBottom: '2px' }}>
              <span
                style={{
                  fontWeight: '500',
                  color: '#374151',
                  minWidth: '80px',
                }}
              >
                {formatFieldName(key)}:
              </span>
              <span style={{ color: '#6b7280', marginLeft: '8px' }}>
                {key === 'value' ? formatMoney(val, currency_sign) : val}
              </span>
            </div>
          ))}
        </div>
      );
    }

    const fieldsToShow = fields.filter((field) => {
      const value = estate[field.name];
      return value !== null && value !== undefined && value !== '';
    });

    if (fieldsToShow.length === 0) return null;

    return (
      <div
        style={{
          marginTop: '8px',
          padding: '8px',
          backgroundColor: '#f9fafb',
          borderRadius: '4px',
          fontSize: '13px',
          lineHeight: '1.4',
        }}
      >
        {fieldsToShow.map((field) => {
          const value = estate[field.name];
          return (
            <div
              key={field.name}
              style={{ display: 'flex', marginBottom: '2px' }}
            >
              <span
                style={{
                  fontWeight: '500',
                  color: '#374151',
                  minWidth: '80px',
                }}
              >
                {field.label}:
              </span>
              <span style={{ color: '#6b7280', marginLeft: '8px' }}>
                {field.name === 'value' || field.type === 'number'
                  ? formatMoney(value, currency_sign)
                  : value}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <h4
          style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
          }}
        >
          {label}
        </h4>
        <div
          style={{ position: 'relative', display: 'inline-block' }}
          title={!isAdmin ? 'Only administrators can add estates' : ''}
        >
          <button
            type='button'
            onClick={() => onAdd(typeKey)}
            disabled={!isAdmin}
            style={{
              fontSize: '12px',
              fontWeight: '500',
              color: !isAdmin ? '#9ca3af' : '#10b981',
              backgroundColor: !isAdmin ? '#f3f4f6' : 'transparent',
              border: !isAdmin ? '1px solid #e5e7eb' : '1px solid #10b981',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: !isAdmin ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease',
              opacity: !isAdmin ? 0.6 : 1,
            }}
            onMouseOver={(e) => {
              if (isAdmin) {
                e.target.style.backgroundColor = '#10b981';
                e.target.style.color = '#ffffff';
              }
            }}
            onMouseOut={(e) => {
              if (isAdmin) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#10b981';
              }
            }}
          >
            + Add {label}
          </button>
        </div>
      </div>

      {estates.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {estates.map((estate, idx) => (
            <div
              key={estate.id || idx}
              style={{
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                backgroundColor: '#ffffff',
                transition: 'border-color 0.15s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#111827',
                      marginBottom: '4px',
                      wordBreak: 'break-word',
                    }}
                  >
                    {renderEstateDetails(estate)}
                  </div>
                  {estate.value && (
                    <div
                      style={{
                        fontSize: '13px',
                        color: '#059669',
                        fontWeight: '500',
                        marginBottom: '4px',
                      }}
                    >
                      {formatMoney(estate.value, currency_sign)}
                    </div>
                  )}
                  {renderAllEstateFields(estate)}
                </div>

                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                  <div
                    style={{ position: 'relative', display: 'inline-block' }}
                    title={
                      !isAdmin ? 'Only administrators can edit estates' : ''
                    }
                  >
                    <button
                      type='button'
                      onClick={() => onEdit(typeKey, estate)}
                      disabled={!isAdmin}
                      style={{
                        fontSize: '11px',
                        fontWeight: '500',
                        color: !isAdmin ? '#9ca3af' : '#d97706',
                        backgroundColor: !isAdmin ? '#f3f4f6' : '#fef3c7',
                        border: !isAdmin
                          ? '1px solid #e5e7eb'
                          : '1px solid #fbbf24',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: !isAdmin ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s ease',
                        opacity: !isAdmin ? 0.6 : 1,
                      }}
                      onMouseOver={(e) => {
                        if (isAdmin) {
                          e.target.style.backgroundColor = '#fbbf24';
                          e.target.style.color = '#92400e';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (isAdmin) {
                          e.target.style.backgroundColor = '#fef3c7';
                          e.target.style.color = '#d97706';
                        }
                      }}
                    >
                      Edit
                    </button>
                  </div>

                  <div
                    style={{ position: 'relative', display: 'inline-block' }}
                    title={
                      !isAdmin ? 'Only administrators can delete estates' : ''
                    }
                  >
                    <button
                      type='button'
                      onClick={() => onDelete(typeKey, estate)}
                      disabled={!isAdmin}
                      style={{
                        fontSize: '11px',
                        fontWeight: '500',
                        color: !isAdmin ? '#9ca3af' : '#dc2626',
                        backgroundColor: !isAdmin ? '#f3f4f6' : '#fee2e2',
                        border: !isAdmin
                          ? '1px solid #e5e7eb'
                          : '1px solid #f87171',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        cursor: !isAdmin ? 'not-allowed' : 'pointer',
                        transition: 'all 0.15s ease',
                        opacity: !isAdmin ? 0.6 : 1,
                      }}
                      onMouseOver={(e) => {
                        if (isAdmin) {
                          e.target.style.backgroundColor = '#f87171';
                          e.target.style.color = '#ffffff';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (isAdmin) {
                          e.target.style.backgroundColor = '#fee2e2';
                          e.target.style.color = '#dc2626';
                        }
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: '16px',
            backgroundColor: '#f9fafb',
            border: '2px dashed #d1d5db',
            borderRadius: '6px',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              color: '#6b7280',
              marginBottom: '8px',
            }}
          >
            No {label.toLowerCase()} entries yet
          </div>
          <div
            style={{ position: 'relative', display: 'inline-block' }}
            title={!isAdmin ? 'Only administrators can add estates' : ''}
          >
            <button
              type='button'
              onClick={() => onAdd(typeKey)}
              disabled={!isAdmin}
              style={{
                fontSize: '12px',
                fontWeight: '500',
                color: !isAdmin ? '#9ca3af' : '#10b981',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: !isAdmin ? 'not-allowed' : 'pointer',
                textDecoration: 'underline',
                opacity: !isAdmin ? 0.6 : 1,
                transition: 'all 0.15s ease',
              }}
            >
              Add the first {label.toLowerCase()} entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstateGroupManager;
