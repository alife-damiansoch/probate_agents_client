import { useEffect, useState } from 'react';
import { FaTrash, FaEdit, FaSave } from 'react-icons/fa';
import AutoResizingTextarea from './AutoResizingTextarea.jsx';
import {EstateSummaryForApp} from "./EstateSummaryForApp.jsx";

const EstatesPart = ({
  addItem,
  application,
  handleListChange,
  editMode,
  submitChangesHandler,
  toggleEditMode,
  removeItem,
  triggerChandleChange,
  setTriggerChandleChange,
}) => {
  const [newEstate, setNewEstate] = useState({
    description: '',
    value: '',
  });

  const handleNewEstateChange = (e, field) => {
    setNewEstate({
      ...newEstate,
      [field]: e.target.value,
    });
  };

  const addEstate = () => {
    addItem('estates', newEstate);
    setNewEstate({
      description: '',
      value: '',
    });
    setTriggerChandleChange(!triggerChandleChange);
  };

  const isEstateFormValid = newEstate.description && newEstate.value;

  const isAnyFieldFilled = Object.values(newEstate).some(
    (value) => value !== ''
  );

  const getFieldClassName = (field) => {
    return `form-control form-control-sm ${
      !newEstate[field] && isAnyFieldFilled ? 'border-1 border-danger' : ''
    }`;
  };

  //   triggers submit change handler when button pressed
  useEffect(() => {
    submitChangesHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerChandleChange]);

  return (
    <>
      <div className='card-header mt-4 mb-2  rounded-top'>
        <h3 className='card-subtitle py-2 text-info-emphasis'>Estates</h3>
      </div>
      <div className='card rounded shadow'>
        <div className='card-body'>
          {application.estates.map((estate, index) => (
            <div
              key={index}
              className='row my-2 py-2 rounded m-1 d-flex align-items-center'
            >
              <div className='col-md-8'>
                <label className='form-label col-12'>Description:</label>
                <div className='input-group input-group-sm shadow'>
                  <AutoResizingTextarea
                    value={estate.description}
                    onChange={(e) =>
                      handleListChange(e, index, 'estates', 'description')
                    }
                    readOnly={!editMode[`estate_${index}_description`]}
                    className={`form-control ${
                      editMode[`estate_${index}_description`] &&
                      ' bg-warning-subtle'
                    }`}
                  />
                  <button
                    type='button'
                    className='btn btn-dark'
                    onClick={() => {
                      if (editMode[`estate_${index}_description`])
                        submitChangesHandler();
                      toggleEditMode(`estate_${index}_description`);
                    }}
                    disabled={application.approved || application.is_rejected}
                  >
                    {editMode[`estate_${index}_description`] ? (
                      <FaSave size={20} color='red' />
                    ) : (
                      <FaEdit size={20} />
                    )}
                  </button>
                </div>
              </div>
              <div className='col-md-3'>
                <label className='form-label col-12'>Value:</label>
                <div className='input-group input-group-sm shadow'>
                  <input
                    type='text'
                    className={`form-control ${
                      editMode[`estate_${index}_value`] && ' bg-warning-subtle'
                    }`}
                    value={
                      editMode[`estate_${index}_value`]
                        ? estate.value
                        : `${application.currency_sign} ${estate.value}`
                    }
                    onChange={(e) =>
                      handleListChange(e, index, 'estates', 'value')
                    }
                    readOnly={!editMode[`estate_${index}_value`]}
                  />
                  <button
                    type='button'
                    className='btn btn-dark'
                    onClick={() => {
                      if (editMode[`estate_${index}_value`])
                        submitChangesHandler();
                      toggleEditMode(`estate_${index}_value`);
                    }}
                    disabled={application.approved || application.is_rejected}
                  >
                    {editMode[`estate_${index}_value`] ? (
                      <FaSave size={20} color='red' />
                    ) : (
                      <FaEdit size={20} />
                    )}
                  </button>
                </div>
              </div>
              <div className='col-md-1 text-end my-auto'>
                <button
                  type='button'
                  className='btn btn-sm btn-outline-danger mt-2 border-0 icon-shadow'
                  onClick={() => removeItem('estates', index)}
                  disabled={application.approved || application.is_rejected}
                >
                  <FaTrash size={15} />
                </button>
              </div>
            </div>
          ))}
          {/* Add New Estate Form */}
          <hr />
          {!application.approved && !application.is_rejected && (
            <div className='row bg-warning rounded mx-md-5 px-md-2 shadow'>
              <div className='card-body'>
                <h4 className='card-subtitle text-black'>Add Estate</h4>
              </div>
              <div className='row mb-3'>
                <div className='col-md-8'>
                  <label className='form-label col-12'>Description:</label>
                  <AutoResizingTextarea
                    value={newEstate.description}
                    onChange={e => handleNewEstateChange(e, 'description')}
                    readOnly={false}
                    className={`shadow ${getFieldClassName('description')}`}
                  />
                </div>
                <div className='col-md-3'>
                  <label className='form-label col-12'>Value:</label>
                  <input
                    type='number'
                    step='0.01' // Allows two decimal places
                    min='0'
                    className={`shadow ${getFieldClassName('value')}`}
                    value={newEstate.value}
                    onChange={(e) => handleNewEstateChange(e, 'value')}
                    placeholder={application.currency_sign}
                  />
                </div>
                <div className='col-md-1 my-auto text-end mt-2 mt-md-auto'>
                  <button
                    type='button'
                    className='btn btn-dark'
                    onClick={addEstate}
                    disabled={!isEstateFormValid}
                  >
                    <FaSave size={20} color={isEstateFormValid && 'red'} />
                  </button>
                </div>
              </div>
            </div>
          )}
           <EstateSummaryForApp
          estates={application.estates}
          requestedAmount={application.amount}
          currency_sign={application.currency_sign}
        />
        </div>
      </div>
    </>
  );
};

export default EstatesPart;
