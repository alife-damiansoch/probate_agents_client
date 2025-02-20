import  { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';
import { postData } from '../../../GenericFunctions/AxiosGenericFunctions';

const TITLE_CHOICES = ['Mr', 'Ms', 'Mrs', 'Dr', 'Prof'];

const NewApplicationForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const token = useSelector((state) => state.auth.token.access);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: '',
    term: '',
    deceased: {
      first_name: '',
      last_name: '',
    },
    dispute: {
      details: 'No dispute',
    },
    applicants: [
      {
        title: 'Mr',
        first_name: '',
        last_name: '',
        pps_number: '',
      },
    ],
    estates: [
      {
        description: '',
        value: '',
      },
    ],
  });

  const handleChange = (e, field) => {
    let value = e.target.value;
    if (field === 'amount') {
      value = value.replace(/[^0-9.]/g, ''); // Remove any non-numeric characters except for decimal points
    }
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleNestedChange = (e, parentField, field) => {
    setFormData({
      ...formData,
      [parentField]: {
        ...formData[parentField],
        [field]: e.target.value,
      },
    });
  };

  const handleListChange = (e, index, listName, field) => {
    const newList = formData[listName].slice();
    newList[index][field] = e.target.value;
    setFormData({
      ...formData,
      [listName]: newList,
    });
  };

  const addItem = (listName, newItem) => {
    setFormData({
      ...formData,
      [listName]: [...formData[listName], newItem],
    });
  };

  const removeItem = (listName, index) => {
    const newList = formData[listName].slice();
    newList.splice(index, 1);
    setFormData({
      ...formData,
      [listName]: newList,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    // Ensure dispute.details is not empty
    if (formData.dispute.details.trim() === '') {
      setFormData({
        ...formData,
        dispute: {
          ...formData.dispute,
          details: 'No dispute',
        },
      });
    }
    try {
      const endpoint = `/api/applications/agent_applications/`;
      await postData(token, endpoint, formData);

      console.log('New Application Created:');
      setErrorMessage('New Application Created');
      // Delay execution for 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));
      navigate('/applications');
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(renderErrors(error.response.data));
      } else {
        setErrorMessage(error.message);
      }
      console.error('Error creating new application:', error);
    }
  };

  return (
    <div className='card mt-5'>
      <div className='card-header text-center'>
        <div className='card-title'>
          <h1>Create New Application</h1>
        </div>
      </div>
      <div className='card-body'>
        <form onSubmit={submitHandler}>
          <h5 className='my-2'>Application</h5>
          <div className='row mb-3'>
            <div className='col-md-6'>
              <label className='form-label'>Amount</label>
              <input
                type='number'
                className='form-control'
                value={formData.amount}
                onChange={(e) => handleChange(e, 'amount')}
                min='0'
                step='0.01'
                required
              />
            </div>
            <div className='col-md-6'>
              <label className='form-label'>Term (months)</label>
              <input
                type='number'
                className='form-control'
                value={formData.term}
                onChange={(e) => handleChange(e, 'term')}
                required
              />
            </div>
          </div>
          <div className='row mb-3'>
            <div className='col-md-6'>
              <label className='form-label'>Deceased First Name</label>
              <input
                type='text'
                className='form-control'
                value={formData.deceased.first_name}
                onChange={(e) =>
                  handleNestedChange(e, 'deceased', 'first_name')
                }
                required
              />
            </div>
            <div className='col-md-6'>
              <label className='form-label'>Deceased Last Name</label>
              <input
                type='text'
                className='form-control'
                value={formData.deceased.last_name}
                onChange={(e) => handleNestedChange(e, 'deceased', 'last_name')}
                required
              />
            </div>
          </div>
          <div className='row mb-3'>
            <div className='col-md-12'>
              <label className='form-label'>Dispute Details</label>
              <textarea
                type='text'
                className='form-control'
                value={formData.dispute.details}
                onChange={(e) => handleNestedChange(e, 'dispute', 'details')}
              />
            </div>
          </div>
          <div className='mb-3'>
            <hr />
            <h5 className='my-2'>Applicants</h5>
            {formData.applicants.map((applicant, index) => (
              <div key={index} className='row mb-3'>
                <div className='col-md-2'>
                  <label className='form-label'>Title</label>
                  <select
                    className='form-control'
                    value={applicant.title}
                    onChange={(e) =>
                      handleListChange(e, index, 'applicants', 'title')
                    }
                    required
                  >
                    {TITLE_CHOICES.map((title) => (
                      <option key={title} value={title}>
                        {title}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='col-md-3'>
                  <label className='form-label'>First Name</label>
                  <input
                    type='text'
                    className='form-control'
                    value={applicant.first_name}
                    onChange={(e) =>
                      handleListChange(e, index, 'applicants', 'first_name')
                    }
                    required
                  />
                </div>
                <div className='col-md-3'>
                  <label className='form-label'>Last Name</label>
                  <input
                    type='text'
                    className='form-control'
                    value={applicant.last_name}
                    onChange={(e) =>
                      handleListChange(e, index, 'applicants', 'last_name')
                    }
                    required
                  />
                </div>
                <div className='col-md-3'>
                  <label className='form-label'>PPS Number</label>
                  <input
                    type='text'
                    className='form-control'
                    value={applicant.pps_number}
                    onChange={(e) =>
                      handleListChange(e, index, 'applicants', 'pps_number')
                    }
                    required
                  />
                </div>
                <div className='col-md-1 text-end'>
                  <button
                    type='button'
                    className='btn btn-danger mt-4'
                    onClick={() => removeItem('applicants', index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
            <button
              type='button'
              className='btn btn-primary'
              onClick={() =>
                addItem('applicants', {
                  title: 'Mr',
                  first_name: '',
                  last_name: '',
                  pps_number: '',
                })
              }
            >
              <FaPlus /> Add Applicant
            </button>
          </div>
          <div className='mb-3'>
            <hr />
            <h5 className='my-2'>Estates</h5>
            {formData.estates.map((estate, index) => (
              <div key={index} className='row mb-3'>
                <div className='col-md-5'>
                  <label className='form-label'>Description</label>
                  <input
                    type='text'
                    className='form-control'
                    value={estate.description}
                    onChange={(e) =>
                      handleListChange(e, index, 'estates', 'description')
                    }
                    required
                  />
                </div>
                <div className='col-md-5'>
                  <label className='form-label'>Value</label>
                  <input
                    type='text'
                    className='form-control'
                    value={estate.value}
                    onChange={(e) =>
                      handleListChange(e, index, 'estates', 'value')
                    }
                    required
                  />
                </div>
                <div className='col-md-2 text-end'>
                  <button
                    type='button'
                    className='btn btn-danger mt-4'
                    onClick={() => removeItem('estates', index)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
            <button
              type='button'
              className='btn btn-primary'
              onClick={() =>
                addItem('estates', {
                  description: '',
                  value: '',
                })
              }
            >
              <FaPlus /> Add Estate
            </button>
          </div>
          <div className='row'>
            <button type='submit' className='btn btn-info my-2'>
              Create Application
            </button>
            {errorMessage && (
              <div className='alert alert-danger text-center' role='alert'>
                {errorMessage}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewApplicationForm;
