import { useEffect, useState } from 'react';
import { patchData } from '../../GenericFunctions/AxiosGenericFunctions';
import renderErrors, {
  formatMoney,
} from '../../GenericFunctions/HelperGenericFunctions';
import ApplicantsPart from './ApplicantsPart';
import EstatesPart from './EstatesPart';

const RequiredDetailsPart = ({
  application,
  setApplication,
  id,
  refresh,
  setRefresh,
  user,
  isApplicationLocked,
}) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [editMode, setEditMode] = useState({});
  const [triggerHandleChange, setTriggerChandleChange] = useState(false);
  const [originalApplication, setOriginalApplication] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if the user is an admin
    if (user && user.is_superuser) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Initialize the original application state when the component mounts
  useEffect(() => {
    if (application) {
      setOriginalApplication(JSON.parse(JSON.stringify(application))); // Deep copy of the application state
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (application && !application.applicants) {
      setApplication({
        ...application,
        applicants: [],
      });
    }
  }, [application]);

  const getFilteredApplicationData = (application) => {
    const {
      amount,
      term,
      deceased,
      dispute,
      applicants,
      was_will_prepared_by_solicitor,
    } = application;

    return {
      amount,
      term,
      deceased: {
        first_name: deceased.first_name,
        last_name: deceased.last_name,
      },
      dispute: {
        details: dispute.details,
      },
      applicants: applicants.map(
        ({
          id,
          title,
          first_name,
          last_name,
          pps_number,
          address_line_1,
          address_line_2,
          city,
          county,
          postal_code,
          country,
          date_of_birth,
          email,
          phone_number,
        }) => ({
          id,
          title,
          first_name,
          last_name,
          pps_number,
          address_line_1,
          address_line_2,
          city,
          county,
          postal_code,
          country,
          date_of_birth,
          email,
          phone_number,
        })
      ),
      was_will_prepared_by_solicitor,
    };
  };

  const handleChange = (e, field) => {
    setApplication({
      ...application,
      [field]: e.target.value,
    });
  };

  const handleNestedChange = (e, parentField, field) => {
    setApplication({
      ...application,
      [parentField]: {
        ...application[parentField],
        [field]: e.target.value,
      },
    });
  };

  const handleListChange = (e, index, listName, field) => {
    const newList = application[listName].slice();
    newList[index][field] = e.target.value;
    setApplication({
      ...application,
      [listName]: newList,
    });
  };

  const addItem = (listName, newItem) => {
    // Ensure applicants array exists - agents can have multiple applicants
    if (listName === 'applicants') {
      setApplication({
        ...application,
        [listName]: [...(application[listName] || []), newItem],
      });
    } else {
      setApplication({
        ...application,
        [listName]: [...(application[listName] || []), newItem],
      });
    }
  };

  const removeItem = (listName, index) => {
    const newList = application[listName].slice();
    newList.splice(index, 1);
    console.log(newList);
    setApplication({
      ...application,
      [listName]: newList,
    });
    setTriggerChandleChange(!triggerHandleChange);
  };

  const toggleEditMode = (field) => {
    setEditMode({
      [field]: !editMode[field], // Toggle the current field
    });
  };

  const submitChangesHandler = async () => {
    setErrorMessage('');
    setIsError(false);

    if (application && originalApplication) {
      if (JSON.stringify(application) === JSON.stringify(originalApplication)) {
        console.log('No changes detected, skipping update.');
        return;
      }

      // Ensure dispute.details is not empty

      const filteredApplication = getFilteredApplicationData(application);
      if (filteredApplication.dispute.details.trim() === '') {
        filteredApplication.dispute.details = 'No dispute';
      }
      console.log('Application Data:', application);
      console.log('Filtered Application Data:', filteredApplication);

      try {
        const endpoint = `/api/applications/agent_applications/${id}/`;
        const response = await patchData(endpoint, filteredApplication);
        if (response.status !== 200) {
          setIsError(true);
          setErrorMessage(response.data);
        } else {
          // console.log(response);
          setErrorMessage({ Application: 'updated' });
          setIsError(false);
          setTimeout(function () {
            setErrorMessage('');
          }, 3000);
        }
      } catch (error) {
        console.error('Error updating application:', error);
        setIsError(true);
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage(error.message);
        }
      } finally {
        // Scroll to the top of the RequiredDetailsPart component instead of page top
        const requiredDetailsElement = document.getElementById(
          'required-details-part'
        );
        if (requiredDetailsElement) {
          requiredDetailsElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest',
          });
        }
        setRefresh(!refresh);
      }
    }
  };

  useEffect(() => {
    submitChangesHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerHandleChange]);

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
    <div
      className='bg-white rounded-4 p-4 mb-4'
      id='required-details-part'
      style={{
        boxShadow:
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Header */}
      <div
        className='px-4 py-4 mb-4 rounded-3'
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          color: 'white',
        }}
      >
        <div className='row align-items-center'>
          <div className='col-lg-8'>
            <h5 className='mb-0 fw-bold d-flex align-items-center gap-2'>
              <svg
                width='20'
                height='20'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                  clipRule='evenodd'
                />
              </svg>
              Application Details
            </h5>
          </div>
          <div className='col-lg-4 text-end'>
            <div
              className='d-flex align-items-center justify-content-end gap-2'
              style={{ fontSize: '0.875rem' }}
            >
              {isAdmin ? (
                <>
                  <svg
                    width='16'
                    height='16'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                  </svg>
                  Edit Mode Available
                </>
              ) : (
                <>
                  <svg
                    width='16'
                    height='16'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Read-Only Mode
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Error Messages */}
      {errorMessage && (
        <div
          className={`mb-4 p-4 rounded-3 d-flex align-items-center gap-3`}
          style={{
            backgroundColor: isError ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${isError ? '#fecaca' : '#bbf7d0'}`,
          }}
        >
          <div
            className='d-flex align-items-center justify-content-center rounded-2'
            style={{
              width: '40px',
              height: '40px',
              backgroundColor: isError ? '#dc2626' : '#059669',
              color: 'white',
            }}
          >
            {isError ? (
              <svg
                width='20'
                height='20'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            ) : (
              <svg
                width='20'
                height='20'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
            )}
          </div>
          <div>
            <h6
              className='mb-1 fw-bold'
              style={{ color: isError ? '#dc2626' : '#059669' }}
            >
              {isError ? 'Error' : 'Success'}
            </h6>
            <div
              style={{
                color: isError ? '#dc2626' : '#059669',
                fontSize: '0.875rem',
              }}
            >
              {renderErrors(errorMessage)}
            </div>
          </div>
        </div>
      )}

      {/* Basic Information Section */}
      <div className='mb-5'>
        <h6 className='fw-bold mb-4' style={{ color: '#111827' }}>
          Basic Information
        </h6>
        <div className='row g-4'>
          {/* Amount Field */}
          <div className='col-md-6'>
            <label
              className='form-label fw-semibold mb-2'
              style={{ color: '#374151', fontSize: '0.875rem' }}
            >
              Amount
            </label>
            <div className='position-relative'>
              <div
                className='position-absolute start-0 top-50 translate-middle-y ms-3'
                style={{ color: '#9ca3af', zIndex: 10 }}
              >
                {application?.currency_sign || '$'}
              </div>
              <input
                type='text'
                className='form-control ps-5 py-3 border-0 rounded-3'
                style={{
                  backgroundColor: editMode.amount ? '#fef3c7' : '#f9fafb',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  cursor: editMode.amount ? 'text' : 'not-allowed',
                }}
                value={
                  editMode.amount
                    ? application.amount
                    : formatMoney(application.amount, application.currency_sign)
                }
                onChange={(e) => handleChange(e, 'amount')}
                readOnly={!editMode.amount}
                onFocus={(e) => {
                  if (editMode.amount) {
                    e.target.style.borderColor = '#8b5cf6';
                    e.target.style.boxShadow =
                      '0 0 0 3px rgba(139, 92, 246, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type='button'
                className='position-absolute end-0 top-50 translate-middle-y me-3 btn btn-sm p-1 rounded-2'
                style={{
                  background: 'transparent',
                  border: 'none',
                  zIndex: 10,
                }}
                onClick={() => {
                  if (editMode.amount) submitChangesHandler();
                  toggleEditMode('amount');
                }}
                disabled={
                  application.approved ||
                  application.is_rejected ||
                  !isAdmin ||
                  isApplicationLocked
                }
              >
                {getEditIcon('amount')}
              </button>
            </div>
          </div>

          {/* Term Field */}
          <div className='col-md-6'>
            <label
              className='form-label fw-semibold mb-2'
              style={{ color: '#374151', fontSize: '0.875rem' }}
            >
              Term
            </label>
            <div className='position-relative'>
              <div
                className='position-absolute start-0 top-50 translate-middle-y ms-3'
                style={{ color: '#9ca3af', zIndex: 10 }}
              >
                <svg
                  width='16'
                  height='16'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <input
                type='text'
                className='form-control ps-5 py-3 border-0 rounded-3'
                style={{
                  backgroundColor: editMode.term ? '#fef3c7' : '#f9fafb',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  cursor: editMode.term ? 'text' : 'not-allowed',
                }}
                value={
                  editMode.term
                    ? application.term
                    : `${application.term} months`
                }
                onChange={(e) => handleChange(e, 'term')}
                readOnly={!editMode.term}
                onFocus={(e) => {
                  if (editMode.term) {
                    e.target.style.borderColor = '#8b5cf6';
                    e.target.style.boxShadow =
                      '0 0 0 3px rgba(139, 92, 246, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type='button'
                className='position-absolute end-0 top-50 translate-middle-y me-3 btn btn-sm p-1 rounded-2'
                style={{
                  background: 'transparent',
                  border: 'none',
                  zIndex: 10,
                }}
                onClick={() => {
                  if (editMode.term) submitChangesHandler();
                  toggleEditMode('term');
                }}
                disabled={
                  application.approved ||
                  application.is_rejected ||
                  !isAdmin ||
                  isApplicationLocked
                }
              >
                {getEditIcon('term')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Deceased Information Section */}
      <div className='mb-5'>
        <h6 className='fw-bold mb-4' style={{ color: '#111827' }}>
          Deceased Information
        </h6>
        <div className='row g-4'>
          {/* Deceased First Name */}
          <div className='col-md-6'>
            <label
              className='form-label fw-semibold mb-2'
              style={{ color: '#374151', fontSize: '0.875rem' }}
            >
              First Name
            </label>
            <div className='position-relative'>
              <div
                className='position-absolute start-0 top-50 translate-middle-y ms-3'
                style={{ color: '#9ca3af', zIndex: 10 }}
              >
                <svg
                  width='16'
                  height='16'
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
              <input
                type='text'
                className='form-control ps-5 py-3 border-0 rounded-3'
                style={{
                  backgroundColor: editMode.deceased_first_name
                    ? '#fef3c7'
                    : '#f9fafb',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  cursor: editMode.deceased_first_name ? 'text' : 'not-allowed',
                }}
                value={application.deceased.first_name}
                onChange={(e) =>
                  handleNestedChange(e, 'deceased', 'first_name')
                }
                readOnly={!editMode.deceased_first_name}
                onFocus={(e) => {
                  if (editMode.deceased_first_name) {
                    e.target.style.borderColor = '#8b5cf6';
                    e.target.style.boxShadow =
                      '0 0 0 3px rgba(139, 92, 246, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type='button'
                className='position-absolute end-0 top-50 translate-middle-y me-3 btn btn-sm p-1 rounded-2'
                style={{
                  background: 'transparent',
                  border: 'none',
                  zIndex: 10,
                }}
                onClick={() => {
                  if (editMode.deceased_first_name) submitChangesHandler();
                  toggleEditMode('deceased_first_name');
                }}
                disabled={
                  application.approved ||
                  application.is_rejected ||
                  !isAdmin ||
                  isApplicationLocked
                }
              >
                {getEditIcon('deceased_first_name')}
              </button>
            </div>
          </div>

          {/* Deceased Last Name */}
          <div className='col-md-6'>
            <label
              className='form-label fw-semibold mb-2'
              style={{ color: '#374151', fontSize: '0.875rem' }}
            >
              Last Name
            </label>
            <div className='position-relative'>
              <div
                className='position-absolute start-0 top-50 translate-middle-y ms-3'
                style={{ color: '#9ca3af', zIndex: 10 }}
              >
                <svg
                  width='16'
                  height='16'
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
              <input
                type='text'
                className='form-control ps-5 py-3 border-0 rounded-3'
                style={{
                  backgroundColor: editMode.deceased_last_name
                    ? '#fef3c7'
                    : '#f9fafb',
                  border: '1px solid #e5e7eb',
                  fontSize: '0.875rem',
                  cursor: editMode.deceased_last_name ? 'text' : 'not-allowed',
                }}
                value={application.deceased.last_name}
                onChange={(e) => handleNestedChange(e, 'deceased', 'last_name')}
                readOnly={!editMode.deceased_last_name}
                onFocus={(e) => {
                  if (editMode.deceased_last_name) {
                    e.target.style.borderColor = '#8b5cf6';
                    e.target.style.boxShadow =
                      '0 0 0 3px rgba(139, 92, 246, 0.1)';
                  }
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <button
                type='button'
                className='position-absolute end-0 top-50 translate-middle-y me-3 btn btn-sm p-1 rounded-2'
                style={{
                  background: 'transparent',
                  border: 'none',
                  zIndex: 10,
                }}
                onClick={() => {
                  if (editMode.deceased_last_name) submitChangesHandler();
                  toggleEditMode('deceased_last_name');
                }}
                disabled={
                  application.approved ||
                  application.is_rejected ||
                  !isAdmin ||
                  isApplicationLocked
                }
              >
                {getEditIcon('deceased_last_name')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Will Preparation Section */}
      <div className='mb-5'>
        <h6 className='fw-bold mb-4' style={{ color: '#111827' }}>
          Will Preparation
        </h6>
        <div
          className='p-4 rounded-3'
          style={{
            backgroundColor: application.was_will_prepared_by_solicitor
              ? '#f0fdf4'
              : '#fef2f2',
            border: `1px solid ${
              application.was_will_prepared_by_solicitor ? '#bbf7d0' : '#fecaca'
            }`,
          }}
        >
          <div className='d-flex align-items-center gap-4'>
            <div className='d-flex align-items-center gap-2'>
              <svg
                width='20'
                height='20'
                fill={
                  application.was_will_prepared_by_solicitor
                    ? '#059669'
                    : '#dc2626'
                }
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='fw-semibold' style={{ color: '#374151' }}>
                Was this will professionally prepared by a solicitor?
              </span>
            </div>
            <div className='d-flex align-items-center gap-4'>
              <div className='form-check d-flex align-items-center gap-2'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='was_will_prepared_by_solicitor'
                  id='will_prepared_yes'
                  value={true}
                  checked={!!application.was_will_prepared_by_solicitor}
                  onChange={() => {
                    setApplication({
                      ...application,
                      was_will_prepared_by_solicitor: true,
                    });
                    setTriggerChandleChange(!triggerHandleChange);
                  }}
                  disabled={
                    application.approved ||
                    application.is_rejected ||
                    !isAdmin ||
                    isApplicationLocked
                  }
                  style={{ marginTop: 0 }}
                />
                <label
                  className='form-check-label fw-semibold'
                  htmlFor='will_prepared_yes'
                  style={{ color: '#059669' }}
                >
                  Yes
                </label>
              </div>
              <div className='form-check d-flex align-items-center gap-2'>
                <input
                  className='form-check-input'
                  type='radio'
                  name='was_will_prepared_by_solicitor'
                  id='will_prepared_no'
                  value={false}
                  checked={!application.was_will_prepared_by_solicitor}
                  onChange={() => {
                    setApplication({
                      ...application,
                      was_will_prepared_by_solicitor: false,
                    });
                    setTriggerChandleChange(!triggerHandleChange);
                  }}
                  disabled={
                    application.approved ||
                    application.is_rejected ||
                    !isAdmin ||
                    isApplicationLocked
                  }
                  style={{ marginTop: 0 }}
                />
                <label
                  className='form-check-label fw-semibold'
                  htmlFor='will_prepared_no'
                  style={{ color: '#dc2626' }}
                >
                  No
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dispute Details Section */}
      <div className='mb-5'>
        <h6 className='fw-bold mb-4' style={{ color: '#111827' }}>
          Dispute Details
        </h6>
        <div className='position-relative'>
          <textarea
            className='form-control border-0 rounded-3'
            style={{
              backgroundColor: editMode.dispute_details ? '#fef3c7' : '#f9fafb',
              border: '1px solid #e5e7eb',
              fontSize: '0.875rem',
              minHeight: '120px',
              paddingRight: '50px',
              cursor: editMode.dispute_details ? 'text' : 'not-allowed',
            }}
            value={
              application.dispute.details === 'No dispute'
                ? ''
                : application.dispute.details
            }
            onChange={(e) => handleNestedChange(e, 'dispute', 'details')}
            readOnly={!editMode.dispute_details}
            placeholder={
              editMode.dispute_details
                ? 'Enter dispute details...'
                : 'No dispute details provided'
            }
            onFocus={(e) => {
              if (editMode.dispute_details) {
                e.target.style.borderColor = '#8b5cf6';
                e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = 'none';
            }}
          />
          <button
            type='button'
            className='position-absolute top-0 end-0 mt-3 me-3 btn btn-sm p-1 rounded-2'
            style={{
              background: 'transparent',
              border: 'none',
              zIndex: 10,
            }}
            onClick={() => {
              if (editMode.dispute_details) submitChangesHandler();
              toggleEditMode('dispute_details');
            }}
            disabled={
              application.approved ||
              application.is_rejected ||
              !isAdmin ||
              isApplicationLocked
            }
          >
            {getEditIcon('dispute_details')}
          </button>
        </div>
      </div>

      {/* Child Components */}
      <ApplicantsPart
        addItem={addItem}
        application={application}
        handleListChange={handleListChange}
        editMode={editMode}
        submitChangesHandler={submitChangesHandler}
        toggleEditMode={toggleEditMode}
        removeItem={removeItem}
        triggerHandleChange={triggerHandleChange}
        setTriggerChandleChange={setTriggerChandleChange}
        isAdmin={isAdmin}
        isApplicationLocked={isApplicationLocked}
      />
      <EstatesPart
        application={application}
        isAdmin={isAdmin}
        refresh={refresh}
        setRefresh={setRefresh}
        isApplicationLocked={isApplicationLocked}
      />
    </div>
  );
};

export default RequiredDetailsPart;
