// Do not remove commented out parts of the code.
// The functionality to make this editable is ready but i turned it off for agents.
// This can be undone only by removing comments for the code...

import  { useEffect, useState } from 'react';
// eslint-disable-next-line

import {
  fetchData,
  postData,
  deleteData,
  patchData,
} from '../../../GenericFunctions/AxiosGenericFunctions';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import Cookies from 'js-cookie';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';
import { useParams } from 'react-router-dom';
import BackToApplicationsIcon from '../../../GenericComponents/BackToApplicationsIcon';

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
    <>
      <BackToApplicationsIcon backUrl={-1} />
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <div className='my-2'>
          <div className='card mt-1 rounded bg-dark-subtle shadow'>
            <div className='card-body'>
              <div className='card-header mb-2  rounded-top py-3 '>
                <h4 className='card-subtitle text-info-emphasis'>Solicitors</h4>
              </div>
              {errors && (
                <div
                  className={`col-8 mx-auto alert text-center ${
                    isError
                      ? 'alert-warning text-danger'
                      : 'alert-success text-success'
                  }`}
                  role='alert'
                >
                  {renderErrors(errors)}
                </div>
              )}
              {solicitors.map((solicitor, index) => (
                <div
                  key={index}
                  className='mb-3 p-3 border border-dark-subtle border-2 rounded m-2 d-flex flex-wrap align-items-center justify-content-between'
                >
                  <div className='col-12 col-md-auto px-2'>
                    <label className='form-label col-12'>Title:</label>
                    <div className='input-group input-group-sm'>
                      <select
                        className={`form-control ${
                          editMode === `solicitor_${index}_title` &&
                          'bg-warning-subtle'
                        }`}
                        value={solicitor.title}
                        onChange={(e) => handleListChange(e, index, 'title')}
                        disabled={editMode !== `solicitor_${index}_title`}
                      >
                        {TITLE_CHOICES.map((choice) => (
                          <option key={choice.value} value={choice.value}>
                            {choice.label}
                          </option>
                        ))}
                      </select>
                      {/* <button
                        type='button'
                        className='btn btn-dark'
                        onClick={() => {
                          if (editMode === `solicitor_${index}_title`)
                            submitChangesHandler(index);
                          toggleEditMode(`solicitor_${index}_title`);
                        }}
                      >
                        {editMode === `solicitor_${index}_title` ? (
                          <FaSave size={20} color='red' />
                        ) : (
                          <FaEdit size={20} />
                        )}
                      </button> */}
                    </div>
                  </div>
                  <div className='col-12 col-md-auto px-2'>
                    <label className='form-label col-12'>First Name:</label>
                    <div className='input-group input-group-sm'>
                      <input
                        type='text'
                        className={`form-control ${
                          editMode === `solicitor_${index}_first_name` &&
                          'bg-warning-subtle'
                        }`}
                        value={solicitor.first_name}
                        onChange={(e) =>
                          handleListChange(e, index, 'first_name')
                        }
                        readOnly={editMode !== `solicitor_${index}_first_name`}
                      />
                      {/* <button
                        type='button'
                        className='btn btn-dark'
                        onClick={() => {
                          if (editMode === `solicitor_${index}_first_name`)
                            submitChangesHandler(index);
                          toggleEditMode(`solicitor_${index}_first_name`);
                        }}
                      >
                        {editMode === `solicitor_${index}_first_name` ? (
                          <FaSave size={20} color='red' />
                        ) : (
                          <FaEdit size={20} />
                        )}
                      </button> */}
                    </div>
                  </div>
                  <div className='col-12 col-md-auto px-2'>
                    <label className='form-label col-12'>Last Name:</label>
                    <div className='input-group input-group-sm'>
                      <input
                        type='text'
                        className={`form-control ${
                          editMode === `solicitor_${index}_last_name` &&
                          'bg-warning-subtle'
                        }`}
                        value={solicitor.last_name}
                        onChange={(e) =>
                          handleListChange(e, index, 'last_name')
                        }
                        readOnly={editMode !== `solicitor_${index}_last_name`}
                      />
                      {/* <button
                        type='button'
                        className='btn btn-dark'
                        onClick={() => {
                          if (editMode === `solicitor_${index}_last_name`)
                            submitChangesHandler(index);
                          toggleEditMode(`solicitor_${index}_last_name`);
                        }}
                      >
                        {editMode === `solicitor_${index}_last_name` ? (
                          <FaSave size={20} color='red' />
                        ) : (
                          <FaEdit size={20} />
                        )}
                      </button> */}
                    </div>
                  </div>
                  <div className='col-12 col-md-auto px-2'>
                    <label className='form-label col-12'>Email:</label>
                    <div className='input-group input-group-sm'>
                      <input
                        type='text'
                        className='form-control'
                        value={solicitor.own_email}
                        onChange={(e) =>
                          handleListChange(e, index, 'own_email')
                        }
                        readOnly={editMode !== `solicitor_${index}_own_email`}
                      />
                      {/* <button
                        type='button'
                        className='btn btn-dark'
                        onClick={() => {
                          if (editMode === `solicitor_${index}_own_email`)
                            submitChangesHandler(index);
                          toggleEditMode(`solicitor_${index}_own_email`);
                        }}
                      >
                        {editMode === `solicitor_${index}_own_email` ? (
                          <FaSave size={20} color='red' />
                        ) : (
                          <FaEdit size={20} />
                        )}
                      </button> */}
                    </div>
                  </div>
                  <div className='col-12 col-md-auto px-2'>
                    <label className='form-label col-12'>Phone Number:</label>
                    <div className='input-group input-group-sm'>
                      <input
                        type='text'
                        className='form-control'
                        value={solicitor.own_phone_number}
                        onChange={(e) =>
                          handleListChange(e, index, 'own_phone_number')
                        }
                        readOnly={
                          editMode !== `solicitor_${index}_own_phone_number`
                        }
                      />
                      {/* <button
                        type='button'
                        className='btn btn-dark'
                        onClick={() => {
                          if (
                            editMode === `solicitor_${index}_own_phone_number`
                          )
                            submitChangesHandler(index);
                          toggleEditMode(`solicitor_${index}_own_phone_number`);
                        }}
                      >
                        {editMode === `solicitor_${index}_own_phone_number` ? (
                          <FaSave size={20} color='red' />
                        ) : (
                          <FaEdit size={20} />
                        )}
                      </button> */}
                    </div>
                  </div>
                  {/* <div className='col-12 col-md-auto my-auto text-center'>
                    <button
                      type='button'
                      className='btn btn-sm btn-outline-danger mt-2 border-0'
                      onClick={() => removeItem(index)}
                    >
                      <FaTrash size={15} />
                    </button>
                  </div> */}
                </div>
              ))}
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
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Solicitors;
