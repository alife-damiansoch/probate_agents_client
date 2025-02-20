import {Fragment, useState} from 'react';
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

const TransactionsTable = ({ transactions, advancementId }) => {
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [editedTransaction, setEditedTransaction] = useState({});
  const [showPostForm, setShowPostForm] = useState(false);
  const [newTransactionData, setNewTransactionData] = useState({
    amount: '',
    description: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const token = Cookies.get('auth_token_agents');
  const navigate = useNavigate();

  const handleEdit = (transaction) => {
    setEditingTransactionId(transaction.id);
    setEditedTransaction({ ...transaction });
  };

  const handleSave = async () => {
    const updatedTransObj = {
      amount: editedTransaction.amount,
      description: editedTransaction.description,
    };
    console.log('Updating transaction:', updatedTransObj);
    try {
      const endpoint = `/api/loans/transactions/${editingTransactionId}/`;
      const response = await patchData(endpoint, updatedTransObj);
      console.log(response);
      setErrorMessage({ Extension: 'updated' });
      setIsError(false);
      navigate(`/advancements/${advancementId}`);
    } catch (error) {
      console.error('Error updating extension:', error);
      setIsError(true);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage(error.message);
      }
    }
    setEditingTransactionId(null); // Exit edit mode
  };

  const handleDelete = async (transactionId) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this transaction?'
    );
    if (confirmDelete) {
      console.log('Deleting transaction:', transactionId);
      try {
        setIsLoading(true);
        const endpoint = `/api/loans/transactions/${transactionId}/`;
        const response = await deleteData(endpoint);
        console.log('Deleted Transaction:', response.data);
        setIsLoading(false);
        navigate(`/advancements/${advancementId}`);
      } catch (error) {
        setIsLoading(false);
        console.error('Error deleting application:', error);
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
    setEditedTransaction((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setNewTransactionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    const transactionToPost = {
      ...newTransactionData,
      loan: advancementId, // Add the loan ID
    };
    console.log('Posting new transaction:', transactionToPost);
    try {
      setIsError(false);
      setIsLoading(true);
      const endpoint = `/api/loans/transactions/`;
      await postData(token, endpoint, transactionToPost);

      console.log('New Application Created:');
      setErrorMessage('New transaction Created');
      // Delay execution for 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoading(false);
      navigate(`/advancements/${advancementId}`);
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage(error.message);
      }
      console.error('Error creating new application:', error);
    }
    setShowPostForm(false); // Hide the form after submission
    setNewTransactionData({ amount: '', description: '' }); // Clear the form
  };

  return (
    <div className='table-responsive mx-0'>
      <div className='text-end mb-2'>
        <button
          className='btn btn-sm btn-primary shadow'
          onClick={() => setShowPostForm(!showPostForm)}
          disabled={isLoading}
        >
          <FaPlus /> Post Transaction
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
        <div className='mb-4'>
          <form onSubmit={handlePostSubmit}>
            <div className='row mx-0'>
              <div className='col-md-4'>
                <input
                  type='number'
                  min={0}
                  step={0.01}
                  name='amount'
                  value={newTransactionData.amount}
                  onChange={handlePostChange}
                  className='form-control form-control-sm shadow'
                  placeholder='Amount'
                  required
                />
              </div>
              <div className='col-md-6'>
                <input
                  type='text'
                  name='description'
                  value={newTransactionData.description}
                  onChange={handlePostChange}
                  className='form-control form-control-sm shadow'
                  placeholder='Transaction reference number + description'
                  required
                />
              </div>
              <div className='col-md-2'>
                <button
                  type='submit'
                  className='btn btn-success btn-sm shadow w-100'
                  disabled={isLoading}
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      {transactions ? (
        <table className='table table-sm table-bordered table-hover shadow'>
          <thead className='thead-dark'>
            <tr>
              <th scope='col'></th>
              <th scope='col'>Amount</th>
              <th scope='col'>Date</th>
              <th scope='col'>Created By</th>
              <th scope='col'>Actions</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((transaction, index) => (
              <Fragment key={transaction.id}>
                <tr>
                  <th scope='row'>{index + 1}</th>
                  <td>
                    {editingTransactionId === transaction.id ? (
                      <input
                        type='number'
                        min={0}
                        step={0.01}
                        name='amount'
                        value={editedTransaction.amount}
                        onChange={handleChange}
                        className='form-control bg-warning-subtle'
                      />
                    ) : (
                      `${parseFloat(transaction.amount).toFixed(2)}`
                    )}
                  </td>
                  <td>
                    {new Date(transaction.transaction_date).toLocaleString()}
                  </td>
                  <td>{transaction.created_by_email}</td>
                  <td className='text-center'>
                    {editingTransactionId === transaction.id ? (
                      <button
                        className='btn btn-sm btn-success mx-1'
                        onClick={handleSave}
                        title='Save Transaction'
                        disabled={isLoading}
                      >
                        <FaSave />
                      </button>
                    ) : (
                      <>
                        <button
                          className='btn btn-sm btn-warning mx-1'
                          onClick={() => handleEdit(transaction)}
                          title='Edit Transaction'
                          disabled={isLoading}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className='btn btn-sm btn-danger mx-1'
                          onClick={() => handleDelete(transaction.id)}
                          title='Delete Transaction'
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
                  <td colSpan='3'>
                    {editingTransactionId === transaction.id ? (
                      <textarea
                        name='description'
                        value={editedTransaction.description}
                        onChange={handleChange}
                        className='form-control bg-warning-subtle'
                      />
                    ) : (
                      <>
                        <strong>Ref. No. and Desc. :</strong>{' '}
                        {transaction.description}
                      </>
                    )}
                  </td>
                  <td></td> {/* Empty cell for Actions column */}
                </tr>
                <tr>
                  <td colSpan='5' className='bg-info'></td>
                </tr>
                {/* Separator row */}
              </Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <LoadingComponent />
      )}
    </div>
  );
};

export default TransactionsTable;
