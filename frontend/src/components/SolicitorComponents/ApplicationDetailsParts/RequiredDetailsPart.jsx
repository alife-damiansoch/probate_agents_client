import { useEffect, useState } from 'react';
import { FaEdit, FaSave } from 'react-icons/fa';
import { patchData } from '../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';
import ApplicantsPart from './ApplicantsPart';
import EstatesPart from './EstatesPart';

const RequiredDetailsPart = ({
  application,
  setApplication,
  id,
  refresh,
  setRefresh,
  user,
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

  const getFilteredApplicationData = (application) => {
    const {
      amount,
      term,
      deceased,
      dispute,
      applicants,
      estates,
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
        ({ title, first_name, last_name, pps_number }) => ({
          title,
          first_name,
          last_name,
          pps_number,
        })
      ),
      estates: estates.map(({ description, value }) => ({
        description,
        value,
      })),
      was_will_prepared_by_solicitor, // Include this field
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
    setApplication({
      ...application,
      [listName]: [...application[listName], newItem],
    });
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
      }
      // Scroll to the top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setRefresh(!refresh);
    }
  };
  useEffect(() => {
    submitChangesHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerHandleChange]);

  return (
    <>
      {errorMessage && (
        <div
          className={` col-8 mx-auto alert text-center ${
            isError ? 'alert-warning text-danger' : 'alert-success text-success'
          }`}
          role='alert'
        >
          {renderErrors(errorMessage)}
        </div>
      )}
      <div className='card rounded border-0 bg-dark-subtle '>
        <div className='card-header  text-info-emphasis  '>
          <h3>Details</h3>
        </div>
        <div className='card-body bg-dark-subtle'>
          <form>
            <div className='card rounded  border-0 shadow'>
              <div className='card-body'>
                <div className='row mb-3'>
                  <div className='col-md-6'>
                    <label className='form-label col-12'>Amount:</label>
                    <div className='input-group input-group-sm'>
                      <input
                        type='text'
                        className={`form-control shadow ${
                          editMode.amount && ' bg-warning-subtle'
                        }`}
                        value={
                          editMode.amount
                            ? application.amount
                            : `${application.currency_sign} ${application.amount}`
                        }
                        onChange={(e) => handleChange(e, 'amount')}
                        readOnly={!editMode.amount}
                      />
                      <button
                        type='button'
                        className='btn btn-dark  shadow'
                        onClick={() => {
                          if (editMode.amount) submitChangesHandler();
                          toggleEditMode('amount');
                        }}
                        disabled={
                          application.approved ||
                          application.is_rejected ||
                          !isAdmin
                        }
                      >
                        {editMode.amount ? (
                          <FaSave size={20} color='red' />
                        ) : (
                          <FaEdit size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <label className='form-label col-12'>Term:</label>
                    <div className='input-group input-group-sm'>
                      <input
                        type='text'
                        className={`form-control  shadow ${
                          editMode.term && ' bg-warning-subtle'
                        }`}
                        value={
                          editMode.term
                            ? application.term
                            : `${application.term} months`
                        }
                        onChange={(e) => handleChange(e, 'term')}
                        readOnly={!editMode.term}
                      />
                      <button
                        type='button'
                        className='btn  btn-dark  shadow'
                        onClick={() => {
                          if (editMode.term) submitChangesHandler();
                          toggleEditMode('term');
                        }}
                        disabled={
                          application.approved ||
                          application.is_rejected ||
                          !isAdmin
                        }
                      >
                        {editMode.term ? (
                          <FaSave size={20} color='red' />
                        ) : (
                          <FaEdit size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <hr />
                <div className='row mb-3'>
                  <div className='col-md-6'>
                    <label className='form-label col-12'>
                      Deceased First Name:
                    </label>
                    <div className='input-group input-group-sm shadow'>
                      <input
                        type='text'
                        className={`form-control ${
                          editMode.deceased_first_name && ' bg-warning-subtle'
                        }`}
                        value={application.deceased.first_name}
                        onChange={(e) =>
                          handleNestedChange(e, 'deceased', 'first_name')
                        }
                        readOnly={!editMode.deceased_first_name}
                      />
                      <button
                        type='button'
                        className='btn  btn-dark'
                        onClick={() => {
                          if (editMode.deceased_first_name)
                            submitChangesHandler();
                          toggleEditMode('deceased_first_name');
                        }}
                        disabled={
                          application.approved ||
                          application.is_rejected ||
                          !isAdmin
                        }
                      >
                        {editMode.deceased_first_name ? (
                          <FaSave size={20} color='red' />
                        ) : (
                          <FaEdit size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className='col-md-6'>
                    <label className='form-label col-12'>
                      Deceased Last Name:
                    </label>
                    <div className='input-group input-group-sm  shadow'>
                      <input
                        type='text'
                        className={`form-control ${
                          editMode.deceased_last_name && ' bg-warning-subtle'
                        }`}
                        value={application.deceased.last_name}
                        onChange={(e) =>
                          handleNestedChange(e, 'deceased', 'last_name')
                        }
                        readOnly={!editMode.deceased_last_name}
                      />
                      <button
                        type='button'
                        className='btn btn-dark'
                        onClick={() => {
                          if (editMode.deceased_last_name)
                            submitChangesHandler();
                          toggleEditMode('deceased_last_name');
                        }}
                        disabled={
                          application.approved ||
                          application.is_rejected ||
                          !isAdmin
                        }
                      >
                        {editMode.deceased_last_name ? (
                          <FaSave size={20} color='red' />
                        ) : (
                          <FaEdit size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <hr />
                <div
                  className={`row mb-3 mx-2 p-2 rounded align-items-center ${
                    application.was_will_prepared_by_solicitor
                      ? 'bg-success-subtle'
                      : 'bg-danger-subtle'
                  }`}
                >
                  <div className='col-12'>
                    <div className='d-flex align-items-center gap-3'>
                      <label
                        className='form-label mb-0'
                        style={{ minWidth: 320 }}
                      >
                        Was this will professionally prepared by a solicitor?
                      </label>
                      <div className='form-check form-check-inline mb-0'>
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
                            !isAdmin
                          }
                        />
                        <label
                          className='form-check-label'
                          htmlFor='will_prepared_yes'
                          style={{
                            marginLeft: 4,
                            marginRight: 16,
                            fontWeight: 500,
                          }}
                        >
                          Yes
                        </label>
                      </div>
                      <div className='form-check form-check-inline mb-0'>
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
                            !isAdmin
                          }
                        />
                        <label
                          className='form-check-label'
                          htmlFor='will_prepared_no'
                          style={{ marginLeft: 4, fontWeight: 500 }}
                        >
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <hr />
                <div className='row '>
                  <div className='col-md-12'>
                    <label className='form-label col-12'>
                      Dispute Details:
                    </label>
                    <div className='input-group input-group-sm shadow'>
                      <textarea
                        type='text'
                        className={`form-control ${
                          editMode.dispute_details && ' bg-warning-subtle'
                        }`}
                        value={
                          application.dispute.details === 'No dispute'
                            ? ''
                            : application.dispute.details
                        }
                        onChange={(e) =>
                          handleNestedChange(e, 'dispute', 'details')
                        }
                        readOnly={!editMode.dispute_details}
                      />
                      <button
                        type='button'
                        className='btn btn-dark'
                        onClick={() => {
                          if (editMode.dispute_details) submitChangesHandler();
                          toggleEditMode('dispute_details');
                        }}
                        disabled={
                          application.approved ||
                          application.is_rejected ||
                          !isAdmin
                        }
                      >
                        {editMode.dispute_details ? (
                          <FaSave size={20} color='red' />
                        ) : (
                          <FaEdit size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
            />
            <EstatesPart
              addItem={addItem}
              application={application}
              handleListChange={handleListChange}
              editMode={editMode}
              submitChangesHandler={submitChangesHandler}
              toggleEditMode={toggleEditMode}
              removeItem={removeItem}
              triggerChandleChange={triggerHandleChange}
              setTriggerChandleChange={setTriggerChandleChange}
              isAdmin={isAdmin}
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default RequiredDetailsPart;
