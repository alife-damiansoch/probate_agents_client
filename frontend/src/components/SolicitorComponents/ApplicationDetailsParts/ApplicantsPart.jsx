import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import { getCountyOptions } from '../ApplicationDetailsParts/EstatesManagerModalParts/estateFieldConfig';

const ApplicantsPart = ({
  addItem,
  application,
  handleListChange,
  editMode,
  submitChangesHandler,
  toggleEditMode,
  removeItem,
  triggerHandleChange,
  setTriggerChandleChange,
  isAdmin = false,
  isApplicationLocked,
}) => {
  const [newApplicant, setNewApplicant] = useState({
    title: '',
    first_name: '',
    last_name: '',
    pps_number: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    county: '',
    postal_code: '',
    country: 'Ireland',
    date_of_birth: '',
    email: '',
    phone_number: '',
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const TITLE_CHOICES = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Ms', label: 'Ms' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Dr', label: 'Dr' },
    { value: 'Prof', label: 'Prof' },
  ];

  const idNumberArray = JSON.parse(Cookies.get('id_number') || '["PPS"]');

  const getCountyOptionsForUser = () => {
    const userCountry = application?.user?.country;
    return getCountyOptions(userCountry);
  };

  const requiredFields = [
    'title',
    'first_name',
    'last_name',
    'pps_number',
    'address_line_1',
    'city',
    'county',
    'postal_code',
    'date_of_birth',
    'email',
    'phone_number',
    'country',
  ];

  const isFormValid = requiredFields.every(
    (field) =>
      newApplicant[field] && newApplicant[field].toString().trim() !== ''
  );

  const handleNewApplicantChange = (e, field) => {
    setNewApplicant({ ...newApplicant, [field]: e.target.value });
  };

  const addApplicant = () => {
    addItem('applicants', newApplicant);
    resetForm();
    setTriggerChandleChange(!triggerHandleChange);
    setShowAddForm(false);
  };

  const resetForm = () => {
    setNewApplicant({
      title: '',
      first_name: '',
      last_name: '',
      pps_number: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      county: '',
      postal_code: '',
      country: 'Ireland',
      date_of_birth: '',
      email: '',
      phone_number: '',
    });
  };

  const getEditButton = (field) => {
    const isEditing = editMode[field];
    const isDisabled =
      application.approved ||
      application.is_rejected ||
      !isAdmin ||
      isApplicationLocked;

    if (isDisabled) {
      return (
        <div
          className='d-flex align-items-center justify-content-center'
          style={{
            width: '32px',
            height: '24px',
            background: 'linear-gradient(145deg, #f1f5f9, #e2e8f0)',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1)',
            cursor: 'not-allowed',
          }}
        >
          <span style={{ fontSize: '0.7rem' }}>🔒</span>
        </div>
      );
    }

    if (isEditing) {
      return (
        <div
          className='d-flex align-items-center justify-content-center'
          style={{
            width: '32px',
            height: '24px',
            background: 'linear-gradient(145deg, #10b981, #059669)',
            borderRadius: '8px',
            border: '1px solid #047857',
            boxShadow:
              '0 2px 8px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow =
              '0 4px 12px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow =
              '0 2px 8px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)';
          }}
        >
          <span
            style={{ fontSize: '0.7rem', color: 'white', fontWeight: 'bold' }}
          >
            💾
          </span>
        </div>
      );
    }

    return (
      <div
        className='d-flex align-items-center justify-content-center'
        style={{
          width: '32px',
          height: '24px',
          background: 'linear-gradient(145deg, #3b82f6, #2563eb)',
          borderRadius: '8px',
          border: '1px solid #1d4ed8',
          boxShadow:
            '0 2px 8px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow =
            '0 4px 12px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow =
            '0 2px 8px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255,255,255,0.2)';
        }}
      >
        <span
          style={{ fontSize: '0.7rem', color: 'white', fontWeight: 'bold' }}
        >
          ✎
        </span>
      </div>
    );
  };

  const validateField = (applicant, field) => {
    if (requiredFields.includes(field)) {
      return applicant[field] && applicant[field].toString().trim() !== '';
    }
    return true;
  };

  // Fixed EditableField with local state to prevent re-renders
  const EditableField = ({
    applicant,
    index,
    field,
    label,
    type = 'text',
    options = null,
    cols = 4,
  }) => {
    const [localValue, setLocalValue] = useState(applicant[field] || '');
    const editKey = `applicant_${index}_${field}`;
    const isEditing = editMode[editKey];
    const fieldOptions =
      field === 'county' ? getCountyOptionsForUser() : options;

    // Update local value when applicant data changes from outside
    useEffect(() => {
      setLocalValue(applicant[field] || '');
    }, [applicant[field]]);

    // Handle field changes with local state only
    const handleFieldChange = (e) => {
      setLocalValue(e.target.value); // Only update local state
    };

    // Handle save button click
    const handleSaveClick = () => {
      const isFieldValid = requiredFields.includes(field)
        ? localValue && localValue.toString().trim() !== ''
        : true;

      if (isEditing && !isFieldValid) {
        alert(`${label} is required`);
        return;
      }

      if (isEditing) {
        // Now update parent state and save
        const fakeEvent = { target: { value: localValue } };
        handleListChange(fakeEvent, index, 'applicants', field);
        submitChangesHandler();
      }
      toggleEditMode(editKey);
    };

    // Use localValue when editing, applicant[field] when not editing
    const displayValue = isEditing ? localValue : applicant[field] || '';

    return (
      <div className={`col-md-${cols}`} style={{ marginBottom: '1rem' }}>
        <div
          className='position-relative'
          style={{
            background: isEditing
              ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '12px',
            border:
              isEditing && !validateField({ [field]: localValue }, field)
                ? '2px solid #ef4444'
                : isEditing
                ? '2px solid #3b82f6'
                : '1px solid #e2e8f0',
            transition: 'all 0.3s ease',
            height: '42px',
            overflow: 'hidden',
            boxShadow: isEditing
              ? '0 4px 12px rgba(59, 130, 246, 0.15)'
              : '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <label
            className='position-absolute'
            style={{
              top: '4px',
              left: '12px',
              fontSize: '0.7rem',
              color: isEditing ? '#3b82f6' : '#6b7280',
              fontWeight: '600',
              lineHeight: '1',
              zIndex: 2,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {label}
          </label>

          {fieldOptions ? (
            <select
              className='form-control border-0'
              style={{
                background: 'transparent',
                fontSize: '0.85rem',
                padding: '16px 50px 6px 12px',
                height: '42px',
                appearance: 'none',
                cursor: isEditing ? 'pointer' : 'default',
                fontWeight: '500',
              }}
              value={displayValue}
              onChange={handleFieldChange}
              disabled={!isEditing}
            >
              {fieldOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              className='form-control border-0'
              style={{
                background: 'transparent',
                fontSize: '0.85rem',
                padding: '16px 50px 6px 12px',
                height: '42px',
                cursor: isEditing ? 'text' : 'default',
                fontWeight: '500',
              }}
              value={displayValue}
              onChange={handleFieldChange}
              readOnly={!isEditing}
            />
          )}

          <button
            type='button'
            className='position-absolute'
            style={{
              top: '50%',
              right: '8px',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              transition: 'all 0.2s ease',
            }}
            onClick={handleSaveClick}
            disabled={
              application.approved || application.is_rejected || !isAdmin
            }
          >
            {getEditButton(editKey)}
          </button>
        </div>
      </div>
    );
  };

  // Enhanced form field with better visibility
  const FormField = ({
    field,
    label,
    type = 'text',
    cols = 4,
    options = null,
  }) => {
    const isRequired = requiredFields.includes(field);
    const hasError = !newApplicant[field] && isRequired;
    const hasValue = Object.values(newApplicant).some((val) => val !== '');
    const fieldOptions =
      field === 'county' ? getCountyOptionsForUser() : options;

    return (
      <div className={`col-md-${cols}`} style={{ marginBottom: '1rem' }}>
        <div
          className='position-relative'
          style={{
            background:
              hasError && hasValue
                ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '12px',
            border:
              hasError && hasValue ? '2px solid #ef4444' : '1px solid #e2e8f0',
            height: '42px',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          <label
            className='position-absolute'
            style={{
              top: '4px',
              left: '12px',
              fontSize: '0.7rem',
              color: hasError && hasValue ? '#ef4444' : '#6b7280',
              fontWeight: '600',
              lineHeight: '1',
              zIndex: 2,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            {label} {isRequired && <span style={{ color: '#ef4444' }}>*</span>}
          </label>

          {fieldOptions ? (
            <select
              className='form-control border-0'
              style={{
                background: 'transparent',
                fontSize: '0.85rem',
                padding: '16px 12px 6px 12px',
                height: '42px',
                appearance: 'none',
                fontWeight: '500',
              }}
              value={newApplicant[field]}
              onChange={(e) => handleNewApplicantChange(e, field)}
              onFocus={(e) => {
                e.target.parentElement.style.borderColor = '#3b82f6';
                e.target.parentElement.style.boxShadow =
                  '0 4px 12px rgba(59, 130, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.parentElement.style.borderColor = '#e2e8f0';
                e.target.parentElement.style.boxShadow =
                  '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            >
              {fieldOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={type}
              className='form-control border-0'
              style={{
                background: 'transparent',
                fontSize: '0.85rem',
                padding: '16px 12px 6px 12px',
                height: '42px',
                fontWeight: '500',
              }}
              value={newApplicant[field]}
              onChange={(e) => handleNewApplicantChange(e, field)}
              placeholder=' '
              onFocus={(e) => {
                e.target.parentElement.style.borderColor = '#3b82f6';
                e.target.parentElement.style.boxShadow =
                  '0 4px 12px rgba(59, 130, 246, 0.15)';
              }}
              onBlur={(e) => {
                e.target.parentElement.style.borderColor = '#e2e8f0';
                e.target.parentElement.style.boxShadow =
                  '0 1px 3px rgba(0, 0, 0, 0.1)';
              }}
            />
          )}
        </div>
      </div>
    );
  };

  if (!application) return <LoadingComponent />;

  const hasApplicant = application.applicants?.length > 0;

  return (
    <div
      className='mt-3'
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        borderRadius: '16px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Enhanced header */}
      <div
        className='d-flex align-items-center justify-content-between px-4 py-3'
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div className='d-flex align-items-center'>
          <div
            className='me-3'
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            }}
          >
            <svg width='16' height='16' fill='white' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div>
            <h6
              className='mb-0'
              style={{ fontSize: '1rem', color: 'white', fontWeight: '700' }}
            >
              Applicant Information
            </h6>
            <small
              style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}
            >
              Single applicant required
            </small>
          </div>
        </div>
        <div
          className='px-3 py-2'
          style={{
            background: hasApplicant
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: 'white',
            borderRadius: '8px',
            fontSize: '0.75rem',
            fontWeight: '700',
            boxShadow: hasApplicant
              ? '0 2px 8px rgba(16, 185, 129, 0.3)'
              : '0 2px 8px rgba(239, 68, 68, 0.3)',
          }}
        >
          {hasApplicant ? '✓ Complete' : '⚠ Required'}
        </div>
      </div>

      <div className='p-4'>
        {/* Warning */}
        {!hasApplicant && (
          <div
            className='text-center mb-3 py-3'
            style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              borderRadius: '10px',
              fontSize: '0.9rem',
              color: '#92400e',
              fontWeight: '600',
              border: '1px solid #f59e0b',
            }}
          >
            ⚠️ Applicant information is required to proceed
          </div>
        )}

        {/* Existing Applicant */}
        {application.applicants?.map((applicant, index) => (
          <div key={applicant.id || index}>
            {/* Basic Info Section */}
            <div
              className='mb-4 p-4'
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              }}
            >
              <div
                className='mb-3'
                style={{
                  fontSize: '0.8rem',
                  color: '#3b82f6',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                👤 Personal Details
              </div>
              <div className='row g-3'>
                <EditableField
                  applicant={applicant}
                  index={index}
                  field='title'
                  label='Title'
                  options={TITLE_CHOICES}
                  cols={3}
                />
                <EditableField
                  applicant={applicant}
                  index={index}
                  field='first_name'
                  label='First Name'
                  cols={3}
                />
                <EditableField
                  applicant={applicant}
                  index={index}
                  field='last_name'
                  label='Last Name'
                  cols={3}
                />
                <EditableField
                  applicant={applicant}
                  index={index}
                  field='pps_number'
                  label={idNumberArray[0]}
                  cols={3}
                />
                <EditableField
                  applicant={applicant}
                  index={index}
                  field='date_of_birth'
                  label='Date of Birth'
                  type='date'
                  cols={6}
                />
              </div>
            </div>

            {/* Contact & Address Sections */}
            <div className='row g-3'>
              <div className='col-md-6'>
                <div
                  className='p-4'
                  style={{
                    background:
                      'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                    borderRadius: '12px',
                    border: '1px solid #bbf7d0',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div
                    className='mb-3'
                    style={{
                      fontSize: '0.8rem',
                      color: '#059669',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    📞 Contact Information
                  </div>
                  <div className='row g-3'>
                    <EditableField
                      applicant={applicant}
                      index={index}
                      field='email'
                      label='Email Address'
                      type='email'
                      cols={12}
                    />
                    <EditableField
                      applicant={applicant}
                      index={index}
                      field='phone_number'
                      label='Phone Number'
                      type='tel'
                      cols={12}
                    />
                  </div>
                </div>
              </div>

              <div className='col-md-6'>
                <div
                  className='p-4'
                  style={{
                    background:
                      'linear-gradient(135deg, #fef7ff 0%, #fae8ff 100%)',
                    borderRadius: '12px',
                    border: '1px solid #e9d5ff',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div
                    className='mb-3'
                    style={{
                      fontSize: '0.8rem',
                      color: '#7c3aed',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    🏠 Address Details
                  </div>
                  <div className='row g-3'>
                    <EditableField
                      applicant={applicant}
                      index={index}
                      field='address_line_1'
                      label='Address Line 1'
                      cols={12}
                    />
                    <EditableField
                      applicant={applicant}
                      index={index}
                      field='address_line_2'
                      label='Address Line 2'
                      cols={12}
                    />
                    <EditableField
                      applicant={applicant}
                      index={index}
                      field='city'
                      label='City'
                      cols={6}
                    />
                    <EditableField
                      applicant={applicant}
                      index={index}
                      field='county'
                      label='County'
                      cols={6}
                    />
                    <EditableField
                      applicant={applicant}
                      index={index}
                      field='postal_code'
                      label='Postal Code'
                      cols={6}
                    />
                    <EditableField
                      applicant={applicant}
                      index={index}
                      field='country'
                      label='Country'
                      cols={6}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Form and remaining components stay the same */}
        {!hasApplicant &&
          !application.approved &&
          !application.is_rejected &&
          isAdmin && (
            <>
              {showAddForm ? (
                <div
                  className='p-4'
                  style={{
                    background:
                      'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)',
                    borderRadius: '12px',
                    border: '2px solid #3b82f6',
                    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)',
                  }}
                >
                  <div className='d-flex justify-content-between align-items-center mb-4'>
                    <span
                      style={{
                        fontSize: '1rem',
                        color: '#3b82f6',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}
                    >
                      ➕ Add New Applicant
                    </span>
                    <button
                      className='btn'
                      style={{
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '0.8rem',
                        padding: '6px 12px',
                        fontWeight: '600',
                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                      }}
                      onClick={() => {
                        setShowAddForm(false);
                        resetForm();
                      }}
                    >
                      ✕ Cancel
                    </button>
                  </div>

                  {!isFormValid &&
                    Object.values(newApplicant).some((val) => val !== '') && (
                      <div
                        className='text-center mb-3 py-2'
                        style={{
                          background:
                            'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                          color: '#1d4ed8',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          border: '1px solid #3b82f6',
                        }}
                      >
                        ℹ️ Please complete all required fields marked with *
                      </div>
                    )}

                  {/* Personal Details */}
                  <div className='mb-4'>
                    <div
                      className='mb-3'
                      style={{
                        fontSize: '0.8rem',
                        color: '#3b82f6',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}
                    >
                      👤 Personal Details
                    </div>
                    <div className='row g-3'>
                      <FormField
                        field='title'
                        label='Title'
                        cols={3}
                        options={TITLE_CHOICES}
                      />
                      <FormField
                        field='first_name'
                        label='First Name'
                        cols={3}
                      />
                      <FormField field='last_name' label='Last Name' cols={3} />
                      <FormField
                        field='pps_number'
                        label={idNumberArray[0]}
                        cols={3}
                      />
                      <FormField
                        field='date_of_birth'
                        label='Date of Birth'
                        type='date'
                        cols={6}
                      />
                    </div>
                  </div>

                  {/* Contact & Address */}
                  <div className='row g-3 mb-4'>
                    <div className='col-md-6'>
                      <div
                        className='mb-3'
                        style={{
                          fontSize: '0.8rem',
                          color: '#059669',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                        }}
                      >
                        📞 Contact Information
                      </div>
                      <div className='row g-3'>
                        <FormField
                          field='email'
                          label='Email Address'
                          type='email'
                          cols={12}
                        />
                        <FormField
                          field='phone_number'
                          label='Phone Number'
                          type='tel'
                          cols={12}
                        />
                      </div>
                    </div>
                    <div className='col-md-6'>
                      <div
                        className='mb-3'
                        style={{
                          fontSize: '0.8rem',
                          color: '#7c3aed',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                        }}
                      >
                        🏠 Address Details
                      </div>
                      <div className='row g-3'>
                        <FormField
                          field='address_line_1'
                          label='Address Line 1'
                          cols={12}
                        />
                        <FormField
                          field='address_line_2'
                          label='Address Line 2'
                          cols={12}
                        />
                        <FormField field='city' label='City' cols={6} />
                        <FormField field='county' label='County' cols={6} />
                        <FormField
                          field='postal_code'
                          label='Postal Code'
                          cols={6}
                        />
                        <FormField field='country' label='Country' cols={6} />
                      </div>
                    </div>
                  </div>

                  <div className='d-flex gap-3 justify-content-end'>
                    <button
                      className='btn'
                      style={{
                        background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                        color: 'white',
                        borderRadius: '10px',
                        border: 'none',
                        fontSize: '0.9rem',
                        padding: '8px 20px',
                        fontWeight: '600',
                        boxShadow: '0 2px 8px rgba(107, 114, 128, 0.3)',
                      }}
                      onClick={() => {
                        setShowAddForm(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className='btn'
                      onClick={addApplicant}
                      disabled={!isFormValid}
                      style={{
                        background: isFormValid
                          ? 'linear-gradient(135deg, #10b981, #059669)'
                          : 'linear-gradient(135deg, #9ca3af, #6b7280)',
                        color: 'white',
                        borderRadius: '10px',
                        border: 'none',
                        fontSize: '0.9rem',
                        padding: '8px 20px',
                        cursor: isFormValid ? 'pointer' : 'not-allowed',
                        fontWeight: '600',
                        boxShadow: isFormValid
                          ? '0 2px 8px rgba(16, 185, 129, 0.3)'
                          : '0 2px 8px rgba(156, 163, 175, 0.3)',
                      }}
                      onMouseOver={(e) => {
                        if (isFormValid) {
                          e.target.style.transform = 'scale(1.02)';
                          e.target.style.boxShadow =
                            '0 4px 12px rgba(16, 185, 129, 0.4)';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (isFormValid) {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow =
                            '0 2px 8px rgba(16, 185, 129, 0.3)';
                        }
                      }}
                    >
                      💾 Save Applicant
                    </button>
                  </div>
                </div>
              ) : (
                <div className='text-center py-4'>
                  <button
                    className='btn'
                    style={{
                      background:
                        'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      padding: '12px 32px',
                      fontWeight: '700',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                    onClick={() => setShowAddForm(true)}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow =
                        '0 6px 16px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow =
                        '0 4px 12px rgba(59, 130, 246, 0.3)';
                    }}
                  >
                    ➕ Add Applicant
                  </button>
                </div>
              )}
            </>
          )}

        {/* Success Message */}
        {hasApplicant && (
          <div
            className='text-center py-3'
            style={{
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              borderRadius: '10px',
              fontSize: '0.9rem',
              color: '#059669',
              fontWeight: '700',
              border: '1px solid #bbf7d0',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
            }}
          >
            ✅ Applicant information has been completed successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsPart;
