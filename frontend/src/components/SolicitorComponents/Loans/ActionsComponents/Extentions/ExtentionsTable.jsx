import React, { useState } from 'react';
import { FaEdit, FaTrash, FaSave, FaPlus } from 'react-icons/fa';
import LoadingComponent from '../../../../GenericComponents/LoadingComponent';
import Cookies from 'js-cookie';
import {
  deleteData,
  patchData,
  postData,
} from '../../../../GenericFunctions/AxiosGenericFunctions';
import { useNavigate } from 'react-router-dom';
import renderErrors from '../../../../GenericFunctions/HelperGenericFunctions';

const ExtensionsTable = ({ extensions, advancementId }) => {
  const [editingExtensionId, setEditingExtensionId] = useState(null);
  const [editedExtension, setEditedExtension] = useState({});
  const [showPostForm, setShowPostForm] = useState(false);
  const [newExtensionData, setNewExtensionData] = useState({
    extension_term_months: '',
    extension_fee: '',
    description: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = Cookies.get('auth_token_agents');
  const navigate = useNavigate();

  const handleEdit = (extension) => {
    setEditingExtensionId(extension.id);
    setEditedExtension({ ...extension });
  };

  const handleSave = async () => {
    const updatedExtObj = {
      extension_term_months: editedExtension.extension_term_months,
      extension_fee: editedExtension.extension_fee,
      description: editedExtension.description,
    };
    console.log('Updating extension:', updatedExtObj);
    try {
      setIsLoading(true);
      const endpoint = `/api/loans/loan_extensions/${editingExtensionId}/`;
      const response = await patchData(endpoint, updatedExtObj);
      console.log(response);
      setErrorMessage({ Extension: 'updated' });
      setIsError(false);
      setIsLoading(false);
      navigate(`/advancements/${advancementId}`);
    } catch (error) {
      setIsLoading(false);
      console.error('Error updating extension:', error);
      setIsError(true);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage(error.message);
      }
    }

    setEditingExtensionId(null); // Exit edit mode
  };

  const handleDelete = async (extensionId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this extension?'
    );
    if (confirmDelete) {
      setIsLoading(true);
      console.log('Deleting extension:', extensionId);
      try {
        const endpoint = `/api/loans/loan_extensions/${extensionId}/`;
        const response = await deleteData(endpoint);
        console.log('Deleted Extension:', response.data);
        setIsLoading(false);
        navigate(`/advancements/${advancementId}`);
      } catch (error) {
        setIsLoading(false);
        console.error('Error deleting extension:', error);
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage(error.message);
        }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedExtension((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setNewExtensionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    const extensionToPost = {
      ...newExtensionData,
      loan: advancementId, // Add the loan ID
    };
    console.log('Posting new extension:', extensionToPost);
    try {
      setIsError(false);
      setIsLoading(true);
      const endpoint = `/api/loans/loan_extensions/`;
      await postData(token, endpoint, extensionToPost);

      console.log('New Extension Created:');
      setErrorMessage('New extension Created');
      // Delay execution for 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoading(false);
      navigate(`/advancements/${advancementId}`);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      if (error.response && error.response.data) {
        setErrorMessage(renderErrors(error.response.data));
      } else {
        setErrorMessage(error.message);
      }
      console.error('Error creating new extension:', error);
    }
    setShowPostForm(false); // Hide the form after submission
    setNewExtensionData({
      extension_term_months: '',
      extension_fee: '',
      description: '',
    }); // Clear the form
  };

  return (
    <div className='table-responsive mx-0'>
      <div className='text-end mb-2'>
        <button
          className='btn btn-sm btn-primary shadow'
          onClick={() => setShowPostForm(!showPostForm)}
        >
          <FaPlus /> Post Extension
        </button>
        {errorMessage && (
          <div
            className={`alert  text-center ${
              isError ? 'alert-danger' : 'alert-success'
            }`}
            role='alert'
          >
            {renderErrors(errorMessage)}
          </div>
        )}
      </div>
      {showPostForm && (
        <div className='mb-4 mx-0'>
          <form onSubmit={handlePostSubmit}>
            <div className='row mx-0'>
              <div className='col-md-3'>
                <input
                  type='number'
                  min={0}
                  step={1}
                  name='extension_term_months'
                  value={newExtensionData.extension_term_months}
                  onChange={handlePostChange}
                  className='form-control form-control-sm shadow'
                  placeholder='Term (months)'
                  required
                />
              </div>
              <div className='col-md-4'>
                <input
                  type='number'
                  min={0}
                  step={0.01}
                  name='extension_fee'
                  value={newExtensionData.extension_fee}
                  onChange={handlePostChange}
                  className='form-control form-control-sm shadow'
                  placeholder='Fee'
                  required
                />
              </div>
              <div className='col-md-3'>
                <input
                  type='text'
                  name='description'
                  value={newExtensionData.description}
                  onChange={handlePostChange}
                  className='form-control form-control-sm shadow'
                  placeholder='Description'
                  required
                />
              </div>
              <div className='col-md-2'>
                <button
                  type='submit'
                  className='btn btn-success btn-sm w-100'
                  disabled={isLoading}
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {extensions ? (
        <table className='table table-sm table-bordered table-hover shadow'>
          <thead className='thead-dark'>
            <tr>
              <th scope='col'></th>
              <th scope='col'>Term (months)</th>
              <th scope='col'>Fee</th>
              <th scope='col'>Date</th>
              <th scope='col'>Created By</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>

          <tbody>
            {extensions.map((extension, index) => (
              <React.Fragment key={extension.id}>
                <tr>
                  <th scope='row'>{index + 1}</th>
                  <td>
                    {editingExtensionId === extension.id ? (
                      <input
                        type='number'
                        min={0}
                        step={1}
                        name='extension_term_months'
                        value={editedExtension.extension_term_months}
                        onChange={handleChange}
                        className='form-control bg-warning-subtle'
                      />
                    ) : (
                      `${extension.extension_term_months} months`
                    )}
                  </td>
                  <td>
                    {editingExtensionId === extension.id ? (
                      <input
                        type='number'
                        min={0}
                        step={0.01}
                        name='extension_fee'
                        value={editedExtension.extension_fee}
                        onChange={handleChange}
                        className='form-control bg-warning-subtle'
                      />
                    ) : (
                      `${parseFloat(extension.extension_fee).toFixed(2)}`
                    )}
                  </td>
                  <td>{new Date(extension.created_date).toLocaleString()}</td>
                  <td>{extension.created_by_email}</td>
                  <td className='text-center'>
                    {editingExtensionId === extension.id ? (
                      <button
                        className='btn btn-sm btn-success mx-1'
                        onClick={handleSave}
                        title='Save Extension'
                        disabled={isLoading}
                      >
                        <FaSave />
                      </button>
                    ) : (
                      <>
                        <button
                          className='btn btn-sm btn-warning mx-1'
                          onClick={() => handleEdit(extension)}
                          title='Edit Extension'
                          disabled={isLoading}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className='btn btn-sm btn-danger mx-1'
                          onClick={() => handleDelete(extension.id)}
                          title='Delete Extension'
                          disabled={isLoading}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
                <tr>
                  <td></td> {/* Empty cell for ID column */}
                  <td colSpan='4'>
                    {editingExtensionId === extension.id ? (
                      <textarea
                        name='description'
                        value={editedExtension.description}
                        onChange={handleChange}
                        className='form-control bg-warning-subtle'
                      />
                    ) : (
                      <>
                        <strong>Description:</strong> {extension.description}
                      </>
                    )}
                  </td>
                  <td></td> {/* Empty cell for Actions column */}
                </tr>
                <tr>
                  <td
                    colSpan='6'
                    className='bg-info'
                    style={{ height: '2px' }}
                  ></td>
                </tr>
                {/* Separator row */}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <LoadingComponent />
      )}
    </div>
  );
};

export default ExtensionsTable;
