import { useState } from 'react';
import { FaEdit, FaSave, FaTrash } from 'react-icons/fa';
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
    return `form-control form-control-sm ${
      !newApplicant[field] && isAnyFieldFilled ? 'border-1 border-danger' : ''
    }`;
  };

  return (
    <>
      {application ? (
        <div className='mb-2 mt-4'>
          <div className='card-header mb-2 py-3'>
            <h3 className='card-subtitle  text-info-emphasis'>Applicants</h3>
          </div>
          <div className='card mt-1 rounded shadow'>
            <div className='card-body'>
              {application.applicants.map((applicant, index) => (
                <div
                  key={index}
                  className='row mb-3  py-2 rounded m-1 d-flex align-items-center'
                >
                  <div className='col-md-2'>
                    <label className='form-label col-12'>Title:</label>
                    <div className='input-group input-group-sm shadow'>
                      <select
                        className={`form-control ${
                          editMode[`applicant_${index}_title`] &&
                          ' bg-warning-subtle'
                        }`}
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
                        className='btn btn-dark'
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
                        {editMode[`applicant_${index}_title`] ? (
                          <FaSave size={20} color='red' />
                        ) : (
                          <FaEdit size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className='col-md-3'>
                    <label className='form-label col-12'>First Name:</label>
                    <div className='input-group input-group-sm shadow'>
                      <input
                        type='text'
                        className={`form-control ${
                          editMode[`applicant_${index}_first_name`] &&
                          ' bg-warning-subtle'
                        }`}
                        value={applicant.first_name}
                        onChange={(e) =>
                          handleListChange(e, index, 'applicants', 'first_name')
                        }
                        readOnly={!editMode[`applicant_${index}_first_name`]}
                      />
                      <button
                        type='button'
                        className='btn  btn-dark'
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
                        {editMode[`applicant_${index}_first_name`] ? (
                          <FaSave size={20} color='red' />
                        ) : (
                          <FaEdit size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className='col-md-3'>
                    <label className='form-label col-12'>Last Name:</label>
                    <div className='input-group input-group-sm shadow'>
                      <input
                        type='text'
                        className={`form-control ${
                          editMode[`applicant_${index}_last_name`] &&
                          ' bg-warning-subtle'
                        }`}
                        value={applicant.last_name}
                        onChange={(e) =>
                          handleListChange(e, index, 'applicants', 'last_name')
                        }
                        readOnly={!editMode[`applicant_${index}_last_name`]}
                      />
                      <button
                        type='button'
                        className='btn  btn-dark'
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
                        {editMode[`applicant_${index}_last_name`] ? (
                          <FaSave size={20} color='red' />
                        ) : (
                          <FaEdit size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className='col-md-3'>
                    <label className='form-label col-12'>PPS Number:</label>
                    <div className='input-group input-group-sm shadow'>
                      <input
                        type='text'
                        className={`form-control ${
                          editMode[`applicant_${index}_pps_number`] &&
                          ' bg-warning-subtle'
                        } `}
                        value={applicant.pps_number}
                        onChange={(e) =>
                          handleListChange(e, index, 'applicants', 'pps_number')
                        }
                        readOnly={!editMode[`applicant_${index}_pps_number`]}
                      />
                      <button
                        type='button'
                        className='btn  btn-dark'
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
                        {editMode[`applicant_${index}_pps_number`] ? (
                          <FaSave size={20} color='red' />
                        ) : (
                          <FaEdit size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className='col-md-1 col-12 my-auto text-end'>
                    <button
                      type='button'
                      className='btn btn-sm btn-outline-danger mt-2 border-0'
                      onClick={() => removeItem('applicants', index)}
                      disabled={
                        application.approved ||
                        application.is_rejected ||
                        !isAdmin
                      }
                    >
                      <FaTrash size={15} className='icon-shadow' />
                    </button>
                  </div>
                </div>
              ))}
              {/* Add New Applicant Form */}
              <hr />
              {!application.approved && !application.is_rejected && isAdmin && (
                <div className='row bg-warning  rounded mx-md-5 px-md-2 shadow'>
                  <div className='col-md-11   border-0 bg-warning'>
                    <div className='card-body '>
                      <h4 className='card-subtitle text-black '>
                        Add Applicant
                      </h4>

                      <div className='row my-3'>
                        <div className='col-md-2'>
                          <label className='form-label col-12'>Title:</label>
                          <select
                            className={`shadow ${getFieldClassName('title')}`}
                            value={newApplicant.title}
                            onChange={(e) =>
                              handleNewApplicantChange(e, 'title')
                            }
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
                          <label className='form-label col-12'>
                            First Name:
                          </label>
                          <input
                            type='text'
                            className={`shadow ${getFieldClassName(
                              'first_name'
                            )}`}
                            value={newApplicant.first_name}
                            onChange={(e) =>
                              handleNewApplicantChange(e, 'first_name')
                            }
                          />
                        </div>
                        <div className='col-md-3'>
                          <label className='form-label col-12'>
                            Last Name:
                          </label>
                          <input
                            type='text'
                            className={`shadow ${getFieldClassName(
                              'last_name'
                            )}`}
                            value={newApplicant.last_name}
                            onChange={(e) =>
                              handleNewApplicantChange(e, 'last_name')
                            }
                          />
                        </div>
                        <div className='col-md-3'>
                          <label className='form-label col-12'>
                            PPS Number:
                          </label>
                          <input
                            type='text'
                            className={`shadow ${getFieldClassName(
                              'pps_number'
                            )}`}
                            value={newApplicant.pps_number}
                            onChange={(e) =>
                              handleNewApplicantChange(e, 'pps_number')
                            }
                            placeholder='1234567X(X)'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-1 my-auto text-end mb-2'>
                    <button
                      type='button'
                      className='btn btn-dark'
                      onClick={addApplicant}
                      disabled={!isApplicantFormValid}
                    >
                      <FaSave size={20} color={isApplicantFormValid && 'red'} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <LoadingComponent />
      )}
    </>
  );
};

export default ApplicantsPart;
