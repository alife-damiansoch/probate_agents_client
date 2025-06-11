import { useState } from 'react';
import LoadingComponent from '../../GenericComponents/LoadingComponent';

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
}) => {
  const [newApplicant, setNewApplicant] = useState({
    title: '',
    first_name: '',
    last_name: '',
    pps_number: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const TITLE_CHOICES = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Ms', label: 'Ms' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Dr', label: 'Dr' },
    { value: 'Prof', label: 'Prof' },
  ];

  const handleNewApplicantChange = (e, field) => {
    const value = e.target.value;
    setNewApplicant({
      ...newApplicant,
      [field]: value,
    });
  };

  const addApplicant = () => {
    addItem('applicants', newApplicant);
    setNewApplicant({
      title: '',
      first_name: '',
      last_name: '',
      pps_number: '',
    });
    setTriggerChandleChange(!triggerHandleChange);
    setShowAddForm(false); // Hide form after adding
  };

  const isAnyFieldFilled = Object.values(newApplicant).some(
    (value) => value !== ''
  );

  // Validate forms
  const isApplicantFormValid =
    newApplicant.title &&
    newApplicant.first_name &&
    newApplicant.last_name &&
    newApplicant.pps_number;

  const getFieldClassName = (field) => {
    return `form-control border-0 rounded-3 py-2 px-3 ${
      !newApplicant[field] && isAnyFieldFilled ? 'border-1 border-danger' : ''
    }`;
  };

  const getEditIcon = (field) => {
    const isEditing = editMode[field];
    const isDisabled =
      application.approved || application.is_rejected || !isAdmin;

    if (isDisabled) {
      return (
        <svg width='16' height='16' fill='#9ca3af' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
            clipRule='evenodd'
          />
        </svg>
      );
    }

    if (isEditing) {
      return (
        <svg width='16' height='16' fill='#059669' viewBox='0 0 20 20'>
          <path
            fillRule='evenodd'
            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
            clipRule='evenodd'
          />
        </svg>
      );
    }

    return (
      <svg width='16' height='16' fill='#6b7280' viewBox='0 0 20 20'>
        <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
      </svg>
    );
  };

  return (
    <>
      {application ? (
        <div className='mb-5'>
          {/* Header */}
          <div
            className='px-4 py-4 mb-4 rounded-3'
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
            }}
          >
            <div className='row align-items-center'>
              <div className='col-lg-8'>
                <h6 className='mb-0 fw-bold d-flex align-items-center gap-2'>
                  <svg
                    width='20'
                    height='20'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Applicants ({application.applicants.length})
                </h6>
              </div>
              <div className='col-lg-4 text-end'>
                {!application.approved &&
                  !application.is_rejected &&
                  isAdmin && (
                    <button
                      className='btn px-4 py-2 fw-semibold rounded-3 d-inline-flex align-items-center gap-2'
                      style={{
                        background: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        fontSize: '0.875rem',
                      }}
                      onClick={() => setShowAddForm(!showAddForm)}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                      }}
                    >
                      <svg
                        width='16'
                        height='16'
                        fill='currentColor'
                        viewBox='0 0 20 20'
                      >
                        <path
                          fillRule='evenodd'
                          d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                          clipRule='evenodd'
                        />
                      </svg>
                      {showAddForm ? 'Cancel' : 'Add Applicant'}
                    </button>
                  )}
              </div>
            </div>
          </div>

          {/* Applicants List */}
          {application.applicants.length === 0 ? (
            <div
              className='text-center p-5 rounded-3 mb-4'
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <svg
                width='48'
                height='48'
                fill='#9ca3af'
                viewBox='0 0 20 20'
                className='mx-auto mb-3'
              >
                <path
                  fillRule='evenodd'
                  d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                  clipRule='evenodd'
                />
              </svg>
              <h6 className='fw-bold mb-2' style={{ color: '#6b7280' }}>
                No Applicants Found
              </h6>
              <p
                className='mb-0'
                style={{ color: '#9ca3af', fontSize: '0.875rem' }}
              >
                No applicants have been added to this application yet.
              </p>
            </div>
          ) : (
            <div className='mb-4'>
              {application.applicants.map((applicant, index) => (
                <div
                  key={index}
                  className='p-3 rounded-3 mb-3'
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  {/* Applicant Header */}
                  <div className='d-flex align-items-center justify-content-between mb-3'>
                    <div className='d-flex align-items-center gap-3'>
                      <div
                        className='d-flex align-items-center justify-content-center rounded-2'
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#10b981',
                          color: 'white',
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
                            d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                            clipRule='evenodd'
                          />
                        </svg>
                      </div>
                      <div>
                        <h6
                          className='mb-1 fw-bold'
                          style={{ color: '#111827', fontSize: '1rem' }}
                        >
                          {applicant.title} {applicant.first_name}{' '}
                          {applicant.last_name}
                        </h6>
                        <span
                          className='badge px-2 py-1 rounded-pill'
                          style={{
                            backgroundColor: '#d1fae5',
                            color: '#065f46',
                            fontSize: '0.75rem',
                          }}
                        >
                          Applicant #{index + 1}
                        </span>
                      </div>
                    </div>
                    {!application.approved &&
                      !application.is_rejected &&
                      isAdmin && (
                        <button
                          type='button'
                          className='btn btn-sm p-2 rounded-2'
                          style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            color: '#dc2626',
                          }}
                          onClick={() => removeItem('applicants', index)}
                          onMouseEnter={(e) => {
                            e.target.style.background = '#fee2e2';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = '#fef2f2';
                          }}
                        >
                          <svg
                            width='16'
                            height='16'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path
                              fillRule='evenodd'
                              d='M9 2a1 1 0 000 2h2a1 1 0 100-2H9z'
                              clipRule='evenodd'
                            />
                            <path
                              fillRule='evenodd'
                              d='M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 012 0v4a1 1 0 11-2 0V7zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V7a1 1 0 00-1-1z'
                              clipRule='evenodd'
                            />
                          </svg>
                        </button>
                      )}
                  </div>

                  {/* Applicant Fields - Condensed Row Layout */}
                  <div className='row g-3'>
                    {/* Title Field */}
                    <div className='col-md-3'>
                      <div className='position-relative'>
                        <label
                          className='form-label fw-semibold mb-1'
                          style={{ color: '#374151', fontSize: '0.75rem' }}
                        >
                          TITLE
                        </label>
                        <select
                          className='form-control border-0 rounded-2 py-2 px-3'
                          style={{
                            backgroundColor: editMode[
                              `applicant_${index}_title`
                            ]
                              ? '#fef3c7'
                              : '#ffffff',
                            fontSize: '0.875rem',
                            cursor: editMode[`applicant_${index}_title`]
                              ? 'pointer'
                              : 'not-allowed',
                          }}
                          value={applicant.title}
                          onChange={(e) =>
                            handleListChange(e, index, 'applicants', 'title')
                          }
                          disabled={!editMode[`applicant_${index}_title`]}
                        >
                          {TITLE_CHOICES.map((choice) => (
                            <option key={choice.value} value={choice.value}>
                              {choice.label}
                            </option>
                          ))}
                        </select>
                        <button
                          type='button'
                          className='position-absolute top-50 end-0 translate-middle-y me-2 btn btn-sm p-1 rounded-1'
                          style={{
                            background: 'transparent',
                            border: 'none',
                            zIndex: 10,
                            marginTop: '10px',
                          }}
                          onClick={() => {
                            if (editMode[`applicant_${index}_title`])
                              submitChangesHandler();
                            toggleEditMode(`applicant_${index}_title`);
                          }}
                          disabled={
                            application.approved ||
                            application.is_rejected ||
                            !isAdmin
                          }
                        >
                          {getEditIcon(`applicant_${index}_title`)}
                        </button>
                      </div>
                    </div>

                    {/* First Name Field */}
                    <div className='col-md-3'>
                      <div className='position-relative'>
                        <label
                          className='form-label fw-semibold mb-1'
                          style={{ color: '#374151', fontSize: '0.75rem' }}
                        >
                          FIRST NAME
                        </label>
                        <input
                          type='text'
                          className='form-control border-0 rounded-2 py-2 px-3'
                          style={{
                            backgroundColor: editMode[
                              `applicant_${index}_first_name`
                            ]
                              ? '#fef3c7'
                              : '#ffffff',
                            fontSize: '0.875rem',
                            cursor: editMode[`applicant_${index}_first_name`]
                              ? 'text'
                              : 'not-allowed',
                            paddingRight: '40px',
                          }}
                          value={applicant.first_name}
                          onChange={(e) =>
                            handleListChange(
                              e,
                              index,
                              'applicants',
                              'first_name'
                            )
                          }
                          readOnly={!editMode[`applicant_${index}_first_name`]}
                        />
                        <button
                          type='button'
                          className='position-absolute top-50 end-0 translate-middle-y me-2 btn btn-sm p-1 rounded-1'
                          style={{
                            background: 'transparent',
                            border: 'none',
                            zIndex: 10,
                            marginTop: '10px',
                          }}
                          onClick={() => {
                            if (editMode[`applicant_${index}_first_name`])
                              submitChangesHandler();
                            toggleEditMode(`applicant_${index}_first_name`);
                          }}
                          disabled={
                            application.approved ||
                            application.is_rejected ||
                            !isAdmin
                          }
                        >
                          {getEditIcon(`applicant_${index}_first_name`)}
                        </button>
                      </div>
                    </div>

                    {/* Last Name Field */}
                    <div className='col-md-3'>
                      <div className='position-relative'>
                        <label
                          className='form-label fw-semibold mb-1'
                          style={{ color: '#374151', fontSize: '0.75rem' }}
                        >
                          LAST NAME
                        </label>
                        <input
                          type='text'
                          className='form-control border-0 rounded-2 py-2 px-3'
                          style={{
                            backgroundColor: editMode[
                              `applicant_${index}_last_name`
                            ]
                              ? '#fef3c7'
                              : '#ffffff',
                            fontSize: '0.875rem',
                            cursor: editMode[`applicant_${index}_last_name`]
                              ? 'text'
                              : 'not-allowed',
                            paddingRight: '40px',
                          }}
                          value={applicant.last_name}
                          onChange={(e) =>
                            handleListChange(
                              e,
                              index,
                              'applicants',
                              'last_name'
                            )
                          }
                          readOnly={!editMode[`applicant_${index}_last_name`]}
                        />
                        <button
                          type='button'
                          className='position-absolute top-50 end-0 translate-middle-y me-2 btn btn-sm p-1 rounded-1'
                          style={{
                            background: 'transparent',
                            border: 'none',
                            zIndex: 10,
                            marginTop: '10px',
                          }}
                          onClick={() => {
                            if (editMode[`applicant_${index}_last_name`])
                              submitChangesHandler();
                            toggleEditMode(`applicant_${index}_last_name`);
                          }}
                          disabled={
                            application.approved ||
                            application.is_rejected ||
                            !isAdmin
                          }
                        >
                          {getEditIcon(`applicant_${index}_last_name`)}
                        </button>
                      </div>
                    </div>

                    {/* PPS Number Field */}
                    <div className='col-md-3'>
                      <div className='position-relative'>
                        <label
                          className='form-label fw-semibold mb-1'
                          style={{ color: '#374151', fontSize: '0.75rem' }}
                        >
                          PPS NUMBER
                        </label>
                        <input
                          type='text'
                          className='form-control border-0 rounded-2 py-2 px-3'
                          style={{
                            backgroundColor: editMode[
                              `applicant_${index}_pps_number`
                            ]
                              ? '#fef3c7'
                              : '#ffffff',
                            fontSize: '0.875rem',
                            cursor: editMode[`applicant_${index}_pps_number`]
                              ? 'text'
                              : 'not-allowed',
                            paddingRight: '40px',
                          }}
                          value={applicant.pps_number}
                          onChange={(e) =>
                            handleListChange(
                              e,
                              index,
                              'applicants',
                              'pps_number'
                            )
                          }
                          readOnly={!editMode[`applicant_${index}_pps_number`]}
                        />
                        <button
                          type='button'
                          className='position-absolute top-50 end-0 translate-middle-y me-2 btn btn-sm p-1 rounded-1'
                          style={{
                            background: 'transparent',
                            border: 'none',
                            zIndex: 10,
                            marginTop: '10px',
                          }}
                          onClick={() => {
                            if (editMode[`applicant_${index}_pps_number`])
                              submitChangesHandler();
                            toggleEditMode(`applicant_${index}_pps_number`);
                          }}
                          disabled={
                            application.approved ||
                            application.is_rejected ||
                            !isAdmin
                          }
                        >
                          {getEditIcon(`applicant_${index}_pps_number`)}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add New Applicant Form */}
          {showAddForm &&
            !application.approved &&
            !application.is_rejected &&
            isAdmin && (
              <div
                className='p-4 rounded-3'
                style={{
                  backgroundColor: '#fefbf3',
                  border: '1px solid #fed7aa',
                }}
              >
                <div className='d-flex align-items-center justify-content-between mb-4'>
                  <div className='d-flex align-items-center gap-2'>
                    <svg
                      width='20'
                      height='20'
                      fill='#d97706'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                        clipRule='evenodd'
                      />
                    </svg>
                    <h6 className='mb-0 fw-bold' style={{ color: '#92400e' }}>
                      Add New Applicant
                    </h6>
                  </div>
                  <button
                    type='button'
                    className='btn btn-sm p-2 rounded-2'
                    style={{
                      background: 'transparent',
                      border: '1px solid #fed7aa',
                      color: '#92400e',
                    }}
                    onClick={() => setShowAddForm(false)}
                  >
                    <svg
                      width='16'
                      height='16'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </button>
                </div>

                <div className='row g-4'>
                  <div className='col-md-3'>
                    <label
                      className='form-label fw-semibold mb-2'
                      style={{ color: '#374151', fontSize: '0.875rem' }}
                    >
                      Title
                    </label>
                    <select
                      className={getFieldClassName('title')}
                      style={{
                        backgroundColor: '#ffffff',
                        fontSize: '0.875rem',
                      }}
                      value={newApplicant.title}
                      onChange={(e) => handleNewApplicantChange(e, 'title')}
                    >
                      <option value=''>Select Title</option>
                      {TITLE_CHOICES.map((choice) => (
                        <option key={choice.value} value={choice.value}>
                          {choice.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='col-md-3'>
                    <label
                      className='form-label fw-semibold mb-2'
                      style={{ color: '#374151', fontSize: '0.875rem' }}
                    >
                      First Name
                    </label>
                    <input
                      type='text'
                      className={getFieldClassName('first_name')}
                      style={{
                        backgroundColor: '#ffffff',
                        fontSize: '0.875rem',
                      }}
                      value={newApplicant.first_name}
                      onChange={(e) =>
                        handleNewApplicantChange(e, 'first_name')
                      }
                      placeholder='Enter first name'
                    />
                  </div>
                  <div className='col-md-3'>
                    <label
                      className='form-label fw-semibold mb-2'
                      style={{ color: '#374151', fontSize: '0.875rem' }}
                    >
                      Last Name
                    </label>
                    <input
                      type='text'
                      className={getFieldClassName('last_name')}
                      style={{
                        backgroundColor: '#ffffff',
                        fontSize: '0.875rem',
                      }}
                      value={newApplicant.last_name}
                      onChange={(e) => handleNewApplicantChange(e, 'last_name')}
                      placeholder='Enter last name'
                    />
                  </div>
                  <div className='col-md-3'>
                    <label
                      className='form-label fw-semibold mb-2'
                      style={{ color: '#374151', fontSize: '0.875rem' }}
                    >
                      PPS Number
                    </label>
                    <input
                      type='text'
                      className={getFieldClassName('pps_number')}
                      style={{
                        backgroundColor: '#ffffff',
                        fontSize: '0.875rem',
                      }}
                      value={newApplicant.pps_number}
                      onChange={(e) =>
                        handleNewApplicantChange(e, 'pps_number')
                      }
                      placeholder='1234567X(X)'
                    />
                  </div>
                </div>

                <div className='d-flex justify-content-end mt-4'>
                  <button
                    type='button'
                    className='btn px-4 py-2 fw-semibold rounded-3 d-flex align-items-center gap-2'
                    style={{
                      background: isApplicantFormValid
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                      color: 'white',
                      border: 'none',
                      fontSize: '0.875rem',
                    }}
                    onClick={addApplicant}
                    disabled={!isApplicantFormValid}
                  >
                    <svg
                      width='16'
                      height='16'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Add Applicant
                  </button>
                </div>
              </div>
            )}
        </div>
      ) : (
        <div
          className='d-flex justify-content-center align-items-center'
          style={{ minHeight: '200px' }}
        >
          <LoadingComponent />
        </div>
      )}
    </>
  );
};

export default ApplicantsPart;
