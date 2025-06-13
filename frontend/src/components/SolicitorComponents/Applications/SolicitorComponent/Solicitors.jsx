// Do not remove commented out parts of the code.
// The functionality to make this editable is ready but i turned it off for agents.
// This can be undone only by removing comments for the code...

import { useEffect, useState } from 'react';
// eslint-disable-next-line

import Cookies from 'js-cookie';
import { useParams } from 'react-router-dom';
import BackToApplicationsIcon from '../../../GenericComponents/BackToApplicationsIcon';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import {
  deleteData,
  fetchData,
  patchData,
  postData,
} from '../../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';

const Solicitors = () => {
  const token = Cookies.get('auth_token_agents');
  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [solicitors, setSolicitors] = useState([]);
  const [solicitorFirmId, setSolicitorFirmId] = useState('');
  const [editMode, setEditMode] = useState(null); // Changed to null to represent no field in edit mode
  const [isError, setIsError] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [newSolicitor, setNewSolicitor] = useState({
    title: '',
    first_name: '',
    last_name: '',
    own_email: '',
    own_phone_number: '',
  });

  const TITLE_CHOICES = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Ms', label: 'Ms' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Dr', label: 'Dr' },
    { value: 'Prof', label: 'Prof' },
  ];

  const { application_id } = useParams();

  console.log(application_id);
  // fetchapplication to get the solicitor firm id
  useEffect(() => {
    const fetchApplication = async () => {
      setIsLoading(true);
      if (token && application_id) {
        const endpoint = `/api/applications/agent_applications/${application_id}/`;
        const response = await fetchData(token, endpoint);

        if (response.status === 200) {
          setSolicitorFirmId(response.data.user.id);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      }
    };

    fetchApplication();
  }, [token, refresh, application_id]);

  //fetching solifitors and filtering by the solicitor firm id
  useEffect(() => {
    const fetchSolicitors = async () => {
      setIsLoading(true);
      if (token && solicitorFirmId) {
        const endpoint = `/api/applications/solicitors/`;
        const response = await fetchData(token, endpoint);
        if (response.status === 200) {
          console.log(response.data);
          console.log(solicitorFirmId);
          const all_solicitors = response.data;
          const solicitors_for_this_firm = all_solicitors.filter(
            (s) => s.user === solicitorFirmId
          );
          setSolicitors(solicitors_for_this_firm);
          setIsLoading(false);
        } else {
          setErrors(response.data);
          setIsLoading(false);
        }
      }
    };

    fetchSolicitors();
  }, [token, refresh, solicitorFirmId]);
  // eslint-disable-next-line
  const handleNewSolicitorChange = (e, field) => {
    const value = e.target.value;
    setNewSolicitor({
      ...newSolicitor,
      [field]: value,
    });
  };
  // eslint-disable-next-line
  const addSolicitor = async () => {
    if (!isSolicitorFormValid) return;

    const endpoint = `/api/applications/solicitors/`;
    const response = await postData(token, endpoint, newSolicitor);
    if (response.status === 201) {
      setSolicitors([...solicitors, response.data]);
      setNewSolicitor({
        title: '',
        first_name: '',
        last_name: '',
        own_email: '',
        own_phone_number: '',
      });
    } else {
      setErrors(response.data);
    }
  };

  const handleListChange = (e, index, field) => {
    const updatedSolicitors = [...solicitors];
    updatedSolicitors[index][field] = e.target.value;
    setSolicitors(updatedSolicitors);
  };

  // eslint-disable-next-line
  const toggleEditMode = (field) => {
    // If the field is already in edit mode, disable it; otherwise, enable it and disable others
    setEditMode((prev) => (prev === field ? null : field));
  };

  // eslint-disable-next-line
  const submitChangesHandler = async (index) => {
    setErrors(null);
    setIsError(false);
    const solicitor = solicitors[index];
    const endpoint = `/api/applications/solicitors/${solicitor.id}/`;
    const response = await patchData(endpoint, solicitor);
    if (response.status === 200) {
      setRefresh(!refresh);
      setEditMode(null); // Exit edit mode after submitting changes
      setErrors(null);
      setIsError(false);
    } else {
      setErrors(response.data);
      setIsError(true);
    }
  };

  // eslint-disable-next-line
  const removeItem = async (index) => {
    const solicitor = solicitors[index];
    const endpoint = `/api/applications/solicitors/${solicitor.id}/`;
    const response = await deleteData(endpoint);
    if (response.status === 204) {
      setRefresh(!refresh);
      setErrors(null);
      setIsError(false);
    } else {
      setErrors(response.data);
      setIsError(true);
    }
  };

  // Update form validation to only require certain fields
  const isSolicitorFormValid =
    newSolicitor.title && newSolicitor.first_name && newSolicitor.last_name;

  // eslint-disable-next-line
  const getFieldClassName = (field, isRequired = false) => {
    // Add red border styling only to required fields when empty
    return `form-control form-control-sm ${
      isRequired &&
      !newSolicitor[field] &&
      Object.values(newSolicitor).some((value) => value !== '')
        ? 'border-1 border-danger'
        : ''
    }`;
  };

  return (
    <div className='bg-light min-vh-100' style={{ padding: '24px' }}>
      <div className='container-fluid'>
        <BackToApplicationsIcon backUrl={-1} />

        {isLoading ? (
          <div
            className='d-flex justify-content-center align-items-center'
            style={{ minHeight: '400px' }}
          >
            <LoadingComponent />
          </div>
        ) : (
          <>
            {/* Modern Header */}
            <div
              className='bg-white rounded-4 overflow-hidden mb-4'
              style={{
                boxShadow:
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            >
              <div
                className='px-4 py-4'
                style={{
                  background:
                    'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  color: 'white',
                }}
              >
                <div className='row align-items-center'>
                  <div className='col-lg-8'>
                    <h2
                      className='mb-2 fw-bold'
                      style={{ fontSize: '1.75rem' }}
                    >
                      Solicitors for this Firm
                      <span className='ms-3 badge bg-white bg-opacity-20 px-3 py-2 rounded-pill'>
                        {solicitors.length}{' '}
                        {solicitors.length === 1 ? 'Solicitor' : 'Solicitors'}
                      </span>
                    </h2>
                    <p className='mb-0 opacity-75' style={{ fontSize: '1rem' }}>
                      View and manage solicitor information
                    </p>
                  </div>
                  <div className='col-lg-4 text-end'>
                    <div
                      className='d-flex align-items-center justify-content-end gap-2'
                      style={{ fontSize: '0.875rem' }}
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
                      Read-Only View
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Error Messages */}
            {errors && (
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
                    {renderErrors(errors)}
                  </div>
                </div>
              </div>
            )}

            {/* Solicitors List */}
            <div
              className='bg-white rounded-4 p-4'
              style={{
                boxShadow:
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            >
              <h5 className='mb-4 fw-bold' style={{ color: '#111827' }}>
                Solicitor Directory
              </h5>

              {solicitors.length === 0 ? (
                <div
                  className='text-center p-5 rounded-3'
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
                    No Solicitors Found
                  </h6>
                  <p
                    className='mb-0'
                    style={{ color: '#9ca3af', fontSize: '0.875rem' }}
                  >
                    No solicitors are currently registered for this firm.
                  </p>
                </div>
              ) : (
                <div className='row g-4'>
                  {solicitors.map((solicitor, index) => (
                    <div key={index} className='col-lg-6 col-xl-4'>
                      <div
                        className='p-4 rounded-3 h-100'
                        style={{
                          backgroundColor: '#f8fafc',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        {/* Solicitor Header */}
                        <div className='d-flex align-items-center gap-3 mb-3'>
                          <div
                            className='d-flex align-items-center justify-content-center rounded-3'
                            style={{
                              width: '48px',
                              height: '48px',
                              backgroundColor: '#6366f1',
                              color: 'white',
                            }}
                          >
                            <svg
                              width='24'
                              height='24'
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
                              style={{ color: '#111827' }}
                            >
                              {solicitor.title} {solicitor.first_name}{' '}
                              {solicitor.last_name}
                            </h6>
                            <span
                              className='badge px-2 py-1 rounded-pill'
                              style={{
                                backgroundColor: '#dbeafe',
                                color: '#1e40af',
                                fontSize: '0.75rem',
                              }}
                            >
                              Solicitor
                            </span>
                          </div>
                        </div>

                        {/* Contact Information */}
                        <div className='d-flex flex-column gap-2'>
                          {/* Title Field */}
                          <div className='d-flex align-items-center gap-2'>
                            <label
                              className='fw-semibold'
                              style={{
                                color: '#6b7280',
                                fontSize: '0.75rem',
                                minWidth: '60px',
                              }}
                            >
                              TITLE:
                            </label>
                            <select
                              className='form-control border-0 rounded-2 py-1 px-2'
                              style={{
                                backgroundColor:
                                  editMode === `solicitor_${index}_title`
                                    ? '#fef3c7'
                                    : '#ffffff',
                                fontSize: '0.875rem',
                                cursor: 'not-allowed',
                              }}
                              value={solicitor.title}
                              onChange={(e) =>
                                handleListChange(e, index, 'title')
                              }
                              disabled={editMode !== `solicitor_${index}_title`}
                            >
                              {TITLE_CHOICES.map((choice) => (
                                <option key={choice.value} value={choice.value}>
                                  {choice.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* First Name Field */}
                          <div className='d-flex align-items-center gap-2'>
                            <label
                              className='fw-semibold'
                              style={{
                                color: '#6b7280',
                                fontSize: '0.75rem',
                                minWidth: '60px',
                              }}
                            >
                              FIRST:
                            </label>
                            <input
                              type='text'
                              className='form-control border-0 rounded-2 py-1 px-2'
                              style={{
                                backgroundColor:
                                  editMode === `solicitor_${index}_first_name`
                                    ? '#fef3c7'
                                    : '#ffffff',
                                fontSize: '0.875rem',
                                cursor: 'not-allowed',
                              }}
                              value={solicitor.first_name}
                              onChange={(e) =>
                                handleListChange(e, index, 'first_name')
                              }
                              readOnly={
                                editMode !== `solicitor_${index}_first_name`
                              }
                            />
                          </div>

                          {/* Last Name Field */}
                          <div className='d-flex align-items-center gap-2'>
                            <label
                              className='fw-semibold'
                              style={{
                                color: '#6b7280',
                                fontSize: '0.75rem',
                                minWidth: '60px',
                              }}
                            >
                              LAST:
                            </label>
                            <input
                              type='text'
                              className='form-control border-0 rounded-2 py-1 px-2'
                              style={{
                                backgroundColor:
                                  editMode === `solicitor_${index}_last_name`
                                    ? '#fef3c7'
                                    : '#ffffff',
                                fontSize: '0.875rem',
                                cursor: 'not-allowed',
                              }}
                              value={solicitor.last_name}
                              onChange={(e) =>
                                handleListChange(e, index, 'last_name')
                              }
                              readOnly={
                                editMode !== `solicitor_${index}_last_name`
                              }
                            />
                          </div>

                          {/* Email Field */}
                          <div className='d-flex align-items-center gap-2'>
                            <label
                              className='fw-semibold'
                              style={{
                                color: '#6b7280',
                                fontSize: '0.75rem',
                                minWidth: '60px',
                              }}
                            >
                              EMAIL:
                            </label>
                            <input
                              type='text'
                              className='form-control border-0 rounded-2 py-1 px-2'
                              style={{
                                backgroundColor: '#ffffff',
                                fontSize: '0.875rem',
                                cursor: 'not-allowed',
                              }}
                              value={solicitor.own_email || 'Not provided'}
                              onChange={(e) =>
                                handleListChange(e, index, 'own_email')
                              }
                              readOnly={
                                editMode !== `solicitor_${index}_own_email`
                              }
                            />
                          </div>

                          {/* Phone Field */}
                          <div className='d-flex align-items-center gap-2'>
                            <label
                              className='fw-semibold'
                              style={{
                                color: '#6b7280',
                                fontSize: '0.75rem',
                                minWidth: '60px',
                              }}
                            >
                              PHONE:
                            </label>
                            <input
                              type='text'
                              className='form-control border-0 rounded-2 py-1 px-2'
                              style={{
                                backgroundColor: '#ffffff',
                                fontSize: '0.875rem',
                                cursor: 'not-allowed',
                              }}
                              value={
                                solicitor.own_phone_number || 'Not provided'
                              }
                              onChange={(e) =>
                                handleListChange(e, index, 'own_phone_number')
                              }
                              readOnly={
                                editMode !==
                                `solicitor_${index}_own_phone_number`
                              }
                            />
                          </div>
                        </div>

                        {/* Footer Note */}
                        <div className='mt-3 pt-3 border-top'>
                          <small
                            style={{ color: '#6b7280', fontSize: '0.75rem' }}
                          >
                            Editing disabled for agents
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Information Notice */}
            <div
              className='mt-4 p-4 rounded-3 d-flex align-items-center gap-3'
              style={{
                backgroundColor: '#fefbf3',
                border: '1px solid #fed7aa',
              }}
            >
              <div
                className='d-flex align-items-center justify-content-center rounded-2'
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#d97706',
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
                    d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div>
                <h6 className='mb-1 fw-bold' style={{ color: '#d97706' }}>
                  Information
                </h6>
                <div style={{ color: '#92400e', fontSize: '0.875rem' }}>
                  Solicitor information is read-only for agents. Contact
                  administrators for any changes required.
                </div>
              </div>
            </div>

            {/* Add New Solicitor Form - turned off for agents */}
            {/* <hr />
              <div className='row bg-warning-subtle'>
                <div className='col-md-10 rounded border-0 bg-warning-subtle'>
                  <div className='card-body'>
                    <h4 className='card-subtitle text-dark my-2'>
                      Add Solicitor
                    </h4>
                    <div className='d-flex flex-wrap align-items-center justify-content-between mb-3'>
                      <div className='col-12 col-md-auto mx-2'>
                        <label className='form-label col-12'>Title:</label>
                        <select
                          className={getFieldClassName('title', true)} // Pass `true` for required fields
                          value={newSolicitor.title}
                          onChange={(e) => handleNewSolicitorChange(e, 'title')}
                        >
                          <option value=''>Select Title</option>
                          {TITLE_CHOICES.map((choice) => (
                            <option key={choice.value} value={choice.value}>
                              {choice.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className='col-12 col-md-auto mx-2'>
                        <label className='form-label col-12'>First Name:</label>
                        <input
                          type='text'
                          className={getFieldClassName('first_name', true)} // Pass `true` for required fields
                          value={newSolicitor.first_name}
                          onChange={(e) =>
                            handleNewSolicitorChange(e, 'first_name')
                          }
                        />
                      </div>
                      <div className='col-12 col-md-auto mx-2'>
                        <label className='form-label col-12'>Last Name:</label>
                        <input
                          type='text'
                          className={getFieldClassName('last_name', true)} // Pass `true` for required fields
                          value={newSolicitor.last_name}
                          onChange={(e) =>
                            handleNewSolicitorChange(e, 'last_name')
                          }
                        />
                      </div>
                      <div className='col-12 col-md-auto mx-2'>
                        <label className='form-label col-12'>Email:</label>
                        <input
                          type='text'
                          className={getFieldClassName('own_email')} // Optional field
                          value={newSolicitor.own_email}
                          onChange={(e) =>
                            handleNewSolicitorChange(e, 'own_email')
                          }
                        />
                      </div>
                      <div className='col-12 col-md-auto mx-2'>
                        <label className='form-label col-12'>
                          Phone Number:
                        </label>
                        <input
                          type='text'
                          className={getFieldClassName('own_phone_number')} // Optional field
                          value={newSolicitor.own_phone_number}
                          onChange={(e) =>
                            handleNewSolicitorChange(e, 'own_phone_number')
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-md-2 my-auto text-center text-md-end'>
                  <button
                    type='button'
                    className='btn btn-dark mb-2'
                    onClick={addSolicitor}
                    disabled={!isSolicitorFormValid} // Button only enabled if required fields are filled
                  >
                    <FaSave
                      size={20}
                      color={isSolicitorFormValid ? 'red' : undefined}
                    />
                  </button>
                </div>
                <div className=' card-footer text-info text-center'>
                  Email and phone number are not required. <br /> If not
                  provided the default une from the firm will be used.
                </div>
              </div> */}
          </>
        )}
      </div>
    </div>
  );
};

export default Solicitors;
