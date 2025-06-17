import { useEffect, useState } from 'react';
import { estateFieldMap, getCountyOptions } from './estateFieldConfig';

const EstateFormModal = ({
  show,
  onClose,
  onSubmit,
  estateType,
  initialData,
  currency_sign = '€',
  isAdmin = false,
  application,
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (!estateType) return;

    if (initialData) {
      setFormData(initialData);
    } else {
      // Get the proper field configuration based on user country
      const fieldConfig = getEstateFieldConfig(
        estateType,
        application?.user?.country || 'IE'
      );
      const emptyFields =
        fieldConfig?.reduce((acc, f) => {
          acc[f.name] = '';
          return acc;
        }, {}) || {};
      setFormData(emptyFields);
    }
  }, [initialData, estateType, application?.user?.country]);

  // Function to get field configuration with proper country-based options
  const getEstateFieldConfig = (estateType, userCountry) => {
    const baseConfig = estateFieldMap[estateType] || [];

    // Replace county options based on user country
    return baseConfig.map((field) => {
      if (field.name === 'county') {
        return {
          ...field,
          options: getCountyOptions(userCountry),
        };
      }
      return field;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (fieldName, optionValue, isChecked) => {
    setFormData((prev) => {
      const currentValues = prev[fieldName]
        ? prev[fieldName].split(', ').filter((v) => v)
        : [];
      let newValues;

      if (isChecked) {
        newValues = [...currentValues, optionValue];
      } else {
        newValues = currentValues.filter((v) => v !== optionValue);
      }

      return {
        ...prev,
        [fieldName]: newValues.join(', '),
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(estateType, formData);
  };

  const shouldShowField = (field) => {
    if (!field.showWhen) return true;
    return formData[field.showWhen.field] === field.showWhen.value;
  };

  const renderFormField = (field) => {
    const baseInputStyles = {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      fontFamily: 'inherit',
      backgroundColor: '#ffffff',
      transition:
        'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
      outline: 'none',
    };

    const focusStyles = `
      &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
    `;

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={true}
            style={{
              ...baseInputStyles,
              minHeight: '72px',
              resize: 'vertical',
              lineHeight: '1.4',
            }}
          />
        );

      case 'multiselect':
        const selectedValues = formData[field.name]
          ? formData[field.name].split(', ').filter((v) => v)
          : [];

        const groupedOptions = field.options?.reduce((groups, option) => {
          const category = option.category || 'Other';
          if (!groups[category]) groups[category] = [];
          groups[category].push(option);
          return groups;
        }, {});

        return (
          <div
            style={{
              padding: '12px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              backgroundColor: '#f9fafb',
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          >
            {Object.entries(groupedOptions || {}).map(([category, options]) => (
              <div key={category} style={{ marginBottom: '12px' }}>
                <div
                  style={{
                    fontWeight: '600',
                    fontSize: '13px',
                    color: '#374151',
                    marginBottom: '6px',
                    paddingBottom: '4px',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  {category}
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                    gap: '6px',
                  }}
                >
                  {options.map((option) => (
                    <label
                      key={option.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        fontSize: '13px',
                        padding: '2px 0',
                        color: '#4b5563',
                      }}
                    >
                      <input
                        type='checkbox'
                        checked={selectedValues.includes(option.value)}
                        onChange={(e) =>
                          handleMultiSelectChange(
                            field.name,
                            option.value,
                            e.target.checked
                          )
                        }
                        style={{
                          marginRight: '6px',
                          accentColor: '#3b82f6',
                        }}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            {selectedValues.length > 0 && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '8px',
                  backgroundColor: '#dbeafe',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#1e40af',
                  lineHeight: '1.3',
                }}
              >
                <strong>Selected:</strong> {selectedValues.join(', ')}
              </div>
            )}
          </div>
        );

      case 'select':
        return (
          <select
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={true}
            style={{
              ...baseInputStyles,
              cursor: 'pointer',
            }}
          >
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type='number'
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={true}
            step='0.01'
            min='0'
            style={baseInputStyles}
          />
        );

      default:
        return (
          <input
            type='text'
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleChange}
            required={true}
            style={baseInputStyles}
          />
        );
    }
  };

  if (!show || !estateType) return null;

  const estateTypeLabel = estateType
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Get the field configuration with proper country-based options
  const fieldConfig = getEstateFieldConfig(
    estateType,
    application?.user?.country || 'IE'
  );

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
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          padding: '24px',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '85vh',
          overflowY: 'auto',
          borderRadius: '12px',
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid #f3f4f6',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
            }}
          >
            {initialData ? 'Edit' : 'Add'} {estateTypeLabel}
          </h3>
          <button
            type='button'
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

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {fieldConfig?.map((field) => {
            if (!shouldShowField(field)) return null;

            return (
              <div key={field.name}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px',
                  }}
                >
                  {field.label}
                  {field.name === 'value' && (
                    <span style={{ color: '#dc2626', marginLeft: '2px' }}>
                      *
                    </span>
                  )}
                </label>
                {renderFormField(field)}
              </div>
            );
          })}

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              marginTop: '20px',
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb',
            }}
          >
            <button
              type='button'
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
                e.target.style.backgroundColor = '#f9fafb';
                e.target.style.borderColor = '#9ca3af';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#ffffff';
                e.target.style.borderColor = '#d1d5db';
              }}
            >
              Cancel
            </button>
            <button
              type='submit'
              style={{
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#ffffff',
                backgroundColor: '#3b82f6',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#2563eb')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#3b82f6')}
            >
              {initialData ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EstateFormModal;
