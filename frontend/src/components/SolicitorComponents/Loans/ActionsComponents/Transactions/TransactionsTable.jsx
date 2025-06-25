import Cookies from 'js-cookie';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  DollarSign,
  Edit3,
  FileText,
  Plus,
  Save,
  Trash2,
  User,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../../../../GenericComponents/LoadingComponent';
import {
  deleteData,
  patchData,
  postData,
} from '../../../../GenericFunctions/AxiosGenericFunctions';
import renderErrors, {
  formatMoney,
} from '../../../../GenericFunctions/HelperGenericFunctions';

const TransactionsTable = ({ transactions, advancementId, advancement }) => {
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
    setEditingTransactionId(null);
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
      loan: advancementId,
    };
    console.log('Posting new transaction:', transactionToPost);
    try {
      setIsError(false);
      setIsLoading(true);
      const endpoint = `/api/loans/transactions/`;
      await postData(token, endpoint, transactionToPost);

      console.log('New Application Created:');
      setErrorMessage('New transaction Created');
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
    setShowPostForm(false);
    setNewTransactionData({ amount: '', description: '' });
  };

  if (!transactions) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div>
      {/* Add Transaction Button */}
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <div className='d-flex align-items-center gap-2'>
          <FileText size={20} style={{ color: '#6366f1' }} />
          <span
            style={{ fontSize: '1.1rem', fontWeight: '600', color: '#374151' }}
          >
            {transactions.length} Transaction
            {transactions.length !== 1 ? 's' : ''}
          </span>
        </div>
        <button
          onClick={() => setShowPostForm(!showPostForm)}
          disabled={isLoading}
          style={{
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 20px',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '14px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow =
              '0 8px 25px rgba(34, 197, 94, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow =
              '0 4px 15px rgba(34, 197, 94, 0.3)';
          }}
        >
          <Plus size={16} />
          Add Transaction
        </button>
      </div>

      {/* Error/Success Messages */}
      {errorMessage && (
        <div
          style={{
            background: isError
              ? 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
              : 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            border: `1px solid ${isError ? '#fecaca' : '#bbf7d0'}`,
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {isError ? (
            <AlertCircle size={20} style={{ color: '#dc2626' }} />
          ) : (
            <CheckCircle size={20} style={{ color: '#16a34a' }} />
          )}
          <div
            style={{
              color: isError ? '#dc2626' : '#16a34a',
              fontWeight: '500',
            }}
          >
            {renderErrors(errorMessage)}
          </div>
        </div>
      )}

      {/* Add Transaction Form */}
      {showPostForm && (
        <div
          style={{
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            border: '1px solid #bae6fd',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <div className='d-flex align-items-center gap-2 mb-3'>
            <Plus size={20} style={{ color: '#0369a1' }} />
            <h6 style={{ color: '#0369a1', fontWeight: '700', margin: 0 }}>
              Add New Transaction
            </h6>
          </div>

          <form onSubmit={handlePostSubmit}>
            <div className='row g-3'>
              <div className='col-md-4'>
                <label
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px',
                  }}
                >
                  Amount
                </label>
                <div style={{ position: 'relative' }}>
                  {/* <DollarSign
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6b7280',
                    }}
                  /> */}
                  <input
                    type='number'
                    min={0}
                    step={0.01}
                    name='amount'
                    value={newTransactionData.amount}
                    onChange={handlePostChange}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                    }}
                    placeholder='0.00'
                    required
                  />
                </div>
              </div>
              <div className='col-md-6'>
                <label
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px',
                  }}
                >
                  Reference number
                </label>
                <input
                  type='text'
                  name='description'
                  value={newTransactionData.description}
                  onChange={handlePostChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                  }}
                  placeholder='Transaction reference number'
                  required
                />
              </div>
              <div className='col-md-2 d-flex align-items-end'>
                <button
                  type='submit'
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    background:
                      'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Transactions List */}
      {transactions.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: '16px',
            border: '2px dashed #cbd5e1',
          }}
        >
          <FileText
            size={48}
            style={{ color: '#9ca3af', marginBottom: '16px' }}
          />
          <h5
            style={{ color: '#6b7280', fontWeight: '600', marginBottom: '8px' }}
          >
            No Transactions Found
          </h5>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            Start by adding your first transaction above
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '20px',
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 8px 25px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 2px 8px rgba(0, 0, 0, 0.04)';
              }}
            >
              {/* Transaction Header */}
              <div className='d-flex justify-content-between align-items-start mb-3'>
                <div className='d-flex align-items-center gap-3'>
                  <div
                    style={{
                      background:
                        'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                      borderRadius: '12px',
                      padding: '8px',
                      color: 'white',
                    }}
                  >
                    <DollarSign size={16} />
                  </div>
                  <div>
                    <h6
                      style={{ color: '#374151', fontWeight: '700', margin: 0 }}
                    >
                      Transaction #{index + 1}
                    </h6>
                    <p
                      style={{
                        color: '#6b7280',
                        fontSize: '0.85rem',
                        margin: 0,
                      }}
                    >
                      ID: {transaction.id}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='d-flex gap-2'>
                  {editingTransactionId === transaction.id ? (
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      style={{
                        background:
                          'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Save size={12} />
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(transaction)}
                        disabled={isLoading}
                        style={{
                          background:
                            'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Edit3 size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        disabled={isLoading}
                        style={{
                          background:
                            'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Trash2 size={12} />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Transaction Details */}
              <div className='row g-3'>
                <div className='col-md-3'>
                  <div className='d-flex align-items-center gap-2 mb-1'>
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: '#6b7280',
                        fontWeight: '600',
                      }}
                    >
                      AMOUNT
                    </span>
                  </div>
                  {editingTransactionId === transaction.id ? (
                    <input
                      type='number'
                      min={0}
                      step={0.01}
                      name='amount'
                      value={editedTransaction.amount}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '2px solid #fbbf24',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: '#fef3c7',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        color: '#22c55e',
                      }}
                    >
                      {formatMoney(
                        parseFloat(transaction.amount).toFixed(2),
                        ' '
                      )}
                    </div>
                  )}
                </div>

                <div className='col-md-3'>
                  <div className='d-flex align-items-center gap-2 mb-1'>
                    <Calendar size={14} style={{ color: '#6366f1' }} />
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: '#6b7280',
                        fontWeight: '600',
                      }}
                    >
                      DATE
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: '#374151',
                      fontWeight: '500',
                    }}
                  >
                    {new Date(transaction.transaction_date).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      }
                    )}
                  </div>
                </div>

                <div className='col-md-6'>
                  <div className='d-flex align-items-center gap-2 mb-1'>
                    <User size={14} style={{ color: '#6366f1' }} />
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: '#6b7280',
                        fontWeight: '600',
                      }}
                    >
                      CREATED BY
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: '#374151',
                      fontWeight: '500',
                    }}
                  >
                    {transaction.created_by_email}
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid #f1f5f9',
                }}
              >
                <div className='d-flex align-items-center gap-2 mb-2'>
                  <FileText size={14} style={{ color: '#6366f1' }} />
                  <span
                    style={{
                      fontSize: '0.8rem',
                      color: '#6b7280',
                      fontWeight: '600',
                    }}
                  >
                    REFERENCE & DESCRIPTION
                  </span>
                </div>
                {editingTransactionId === transaction.id ? (
                  <textarea
                    name='description'
                    value={editedTransaction.description}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #fbbf24',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#fef3c7',
                      minHeight: '80px',
                      resize: 'vertical',
                    }}
                    placeholder='Transaction reference number + description'
                  />
                ) : (
                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: '#374151',
                      lineHeight: '1.5',
                      padding: '12px',
                      background: '#f8fafc',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    {transaction.description || 'No description provided'}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionsTable;
