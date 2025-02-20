import  { useState } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

import { useSelector } from 'react-redux';
import {
  deleteData,
  postData,
} from '../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';

const ExpensesComponent = ({
  application,
  applicationId,
  existingExpenses,
}) => {
  const [expenses, setExpenses] = useState(existingExpenses);
  const [newExpense, setNewExpense] = useState({ description: '', value: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const token = useSelector((state) => state.auth.token.access);

  const handleNewExpenseChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prevExpense) => ({
      ...prevExpense,
      [name]: value,
    }));
  };

  const addNewExpense = async (e) => {
    e.preventDefault();
    setIsError(false);
    try {
      const endpoint = `/api/applications/expenses/`;
      const response = await postData(token, endpoint, {
        ...newExpense,
        application: applicationId,
      });
      setIsError(false);
      console.log('New Expense added:');
      setErrorMessage('New Expense Added');
      setExpenses((prevExpenses) => [...prevExpenses, response.data]);
    } catch (error) {
      setIsError(true);
      if (error.response && error.response.data) {
        setErrorMessage(renderErrors(error.response.data));
      } else {
        setErrorMessage(error.message);
      }
      console.error('Error creating new application:', error);
    }
  };

  const removeExpense = async (expenseId) => {
    try {
      const endpoint = `/api/applications/expenses/${expenseId}/`;
      await deleteData(endpoint);
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== expenseId)
      );
    } catch (error) {
      console.error('Error removing expense:', error);
      setErrorMessage('Failed to remove expense');
    }
  };

  return (
    <>
      <div className='card rounded bg-dark-subtle mt-4 mx-3 border-0 hsadow'>
        <div className=' card-header  bg-dark-subtle mb-2'>
          <h3 className=' text-info-emphasis  mt-3'>Expenses</h3>
        </div>
        <div className=' card-body bg-white rounded shadow mb-3'>
          <ul className='list-group mb-3'>
            {expenses.map((expense) => (
              <div key={expense.id} className='row  '>
                <div className='col-lg-8'>
                  <div className='mb-3'>
                    <label htmlFor='description' className='form-label'>
                      Description:
                    </label>
                    <input
                      type='text'
                      id='description'
                      className='form-control shadow'
                      value={expense.description}
                      readOnly
                    />
                  </div>
                </div>
                <div className='col-lg-3'>
                  <div className='mb-3'>
                    <label htmlFor='value' className='form-label'>
                      Value:
                    </label>{' '}
                    {application.currency_sign}
                    <input
                      type='text'
                      id='value'
                      className='form-control shadow'
                      value={expense.value}
                      readOnly
                    />
                  </div>
                </div>
                <div className=' col-lg-1 my-auto text-end text-lg-center'>
                  <button
                    type='button'
                    className='btn btn-outline-danger btn-sm border-0'
                    onClick={() => removeExpense(expense.id)}
                    disabled={application.approved || application.is_rejected}
                  >
                    <FaTrash size={15} className='icon-shadow' />
                  </button>
                </div>
              </div>
            ))}
          </ul>

          <hr />
          {/* Add expence part */}
          {!application.approved && !application.is_rejected && (
            <div className=' row bg-warning rounded mx-md-5 px-md-2 shadow py-2'>
              <div className='card-body'>
                <h4 className='card-subtitle text-black mb-2'>Add Expense</h4>
                <form onSubmit={addNewExpense}>
                  <div className='row  mb-3'>
                    <div className='col-md-6'>
                      <label htmlFor='description' className='form-label'>
                        Description
                      </label>
                      <input
                        type='text'
                        id='description'
                        name='description'
                        className='form-control form-control-sm'
                        value={newExpense.description}
                        onChange={handleNewExpenseChange}
                        required
                      />
                    </div>
                    <div className='col-md-3'>
                      <label htmlFor='value' className='form-label'>
                        Value
                      </label>
                      <input
                        type='number'
                        id='value'
                        name='value'
                        className='form-control form-control-sm'
                        value={newExpense.value}
                        onChange={handleNewExpenseChange}
                        required
                        placeholder={application.currency_sign}
                      />
                    </div>
                    <div className='col-md-3 mt-2 mt-md-auto text-end'>
                      <button
                        type='submit'
                        className='btn btn-sm btn-outline-primary'
                      >
                        <FaPlus /> Add Expense
                      </button>
                    </div>
                  </div>

                  {errorMessage && (
                    <div
                      className={`alert mt-3 ${
                        isError ? 'alert-danger' : 'alert-success'
                      }`}
                      role='alert'
                    >
                      {errorMessage.split('\n').map((msg, index) => (
                        <div key={index}>{msg}</div>
                      ))}
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ExpensesComponent;
