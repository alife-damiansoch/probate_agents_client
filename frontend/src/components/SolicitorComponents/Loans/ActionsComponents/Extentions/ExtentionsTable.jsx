import Cookies from 'js-cookie';
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
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
    setEditingExtensionId(null);
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
      loan: advancementId,
    };
    console.log('Posting new extension:', extensionToPost);
    try {
      setIsError(false);
      setIsLoading(true);
      const endpoint = `/api/loans/loan_extensions/`;
      await postData(token, endpoint, extensionToPost);

      console.log('New Extension Created:');
      setErrorMessage('New extension Created');
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
    setShowPostForm(false);
    setNewExtensionData({
      extension_term_months: '',
      extension_fee: '',
      description: '',
    });
  };

  if (!extensions) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div>
      {/* Add Extension Button */}
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <div className='d-flex align-items-center gap-2'>
          <Clock size={20} style={{ color: '#8b5cf6' }} />
          <span
            style={{ fontSize: '1.1rem', fontWeight: '600', color: '#374151' }}
          >
            {extensions.length} Extension{extensions.length !== 1 ? 's' : ''}
          </span>
        </div>
        <button
          onClick={() => setShowPostForm(!showPostForm)}
          disabled={isLoading}
          style={{
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
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
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow =
              '0 8px 25px rgba(139, 92, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow =
              '0 4px 15px rgba(139, 92, 246, 0.3)';
          }}
        >
          <Plus size={16} />
          Add Extension
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

      {/* Add Extension Form */}
      {showPostForm && (
        <div
          style={{
            background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
            border: '1px solid #e9d5ff',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <div className='d-flex align-items-center gap-2 mb-3'>
            <Plus size={20} style={{ color: '#8b5cf6' }} />
            <h6 style={{ color: '#8b5cf6', fontWeight: '700', margin: 0 }}>
              Add New Extension
            </h6>
          </div>

          <form onSubmit={handlePostSubmit}>
            <div className='row g-3'>
              <div className='col-md-3'>
                <label
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px',
                  }}
                >
                  Term (Months)
                </label>
                <div style={{ position: 'relative' }}>
                  <Calendar
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6b7280',
                    }}
                  />
                  <input
                    type='number'
                    min={0}
                    step={1}
                    name='extension_term_months'
                    value={newExtensionData.extension_term_months}
                    onChange={handlePostChange}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: 'white',
                    }}
                    placeholder='12'
                    required
                  />
                </div>
              </div>
              <div className='col-md-3'>
                <label
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px',
                  }}
                >
                  Extension Fee (€)
                </label>
                <div style={{ position: 'relative' }}>
                  <DollarSign
                    size={16}
                    style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6b7280',
                    }}
                  />
                  <input
                    type='number'
                    min={0}
                    step={0.01}
                    name='extension_fee'
                    value={newExtensionData.extension_fee}
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
              <div className='col-md-4'>
                <label
                  style={{
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px',
                  }}
                >
                  Description
                </label>
                <input
                  type='text'
                  name='description'
                  value={newExtensionData.description}
                  onChange={handlePostChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    backgroundColor: 'white',
                  }}
                  placeholder='Extension description'
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

      {/* Extensions List */}
      {extensions.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: '16px',
            border: '2px dashed #cbd5e1',
          }}
        >
          <Clock size={48} style={{ color: '#9ca3af', marginBottom: '16px' }} />
          <h5
            style={{ color: '#6b7280', fontWeight: '600', marginBottom: '8px' }}
          >
            No Extensions Found
          </h5>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            Start by adding your first extension above
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {extensions.map((extension, index) => (
            <div
              key={extension.id}
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
              {/* Extension Header */}
              <div className='d-flex justify-content-between align-items-start mb-3'>
                <div className='d-flex align-items-center gap-3'>
                  <div
                    style={{
                      background:
                        'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                      borderRadius: '12px',
                      padding: '8px',
                      color: 'white',
                    }}
                  >
                    <Clock size={16} />
                  </div>
                  <div>
                    <h6
                      style={{ color: '#374151', fontWeight: '700', margin: 0 }}
                    >
                      Extension #{index + 1}
                    </h6>
                    <p
                      style={{
                        color: '#6b7280',
                        fontSize: '0.85rem',
                        margin: 0,
                      }}
                    >
                      ID: {extension.id}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='d-flex gap-2'>
                  {editingExtensionId === extension.id ? (
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
                        onClick={() => handleEdit(extension)}
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
                        onClick={() => handleDelete(extension.id)}
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

              {/* Extension Details */}
              <div className='row g-3'>
                <div className='col-md-3'>
                  <div className='d-flex align-items-center gap-2 mb-1'>
                    <Calendar size={14} style={{ color: '#8b5cf6' }} />
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: '#6b7280',
                        fontWeight: '600',
                      }}
                    >
                      TERM
                    </span>
                  </div>
                  {editingExtensionId === extension.id ? (
                    <input
                      type='number'
                      min={0}
                      step={1}
                      name='extension_term_months'
                      value={editedExtension.extension_term_months}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '2px solid #a855f7',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: '#faf5ff',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        fontSize: '1.2rem',
                        fontWeight: '700',
                        color: '#8b5cf6',
                      }}
                    >
                      {extension.extension_term_months} months
                    </div>
                  )}
                </div>

                <div className='col-md-3'>
                  <div className='d-flex align-items-center gap-2 mb-1'>
                    <DollarSign size={14} style={{ color: '#22c55e' }} />
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: '#6b7280',
                        fontWeight: '600',
                      }}
                    >
                      FEE
                    </span>
                  </div>
                  {editingExtensionId === extension.id ? (
                    <input
                      type='number'
                      min={0}
                      step={0.01}
                      name='extension_fee'
                      value={editedExtension.extension_fee}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '2px solid #a855f7',
                        borderRadius: '8px',
                        fontSize: '14px',
                        backgroundColor: '#faf5ff',
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
                      €{parseFloat(extension.extension_fee).toFixed(2)}
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
                    {new Date(extension.created_date).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      }
                    )}
                  </div>
                </div>

                <div className='col-md-3'>
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
                    {extension.created_by_email}
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
                    DESCRIPTION
                  </span>
                </div>
                {editingExtensionId === extension.id ? (
                  <textarea
                    name='description'
                    value={editedExtension.description}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #a855f7',
                      borderRadius: '8px',
                      fontSize: '14px',
                      backgroundColor: '#faf5ff',
                      minHeight: '80px',
                      resize: 'vertical',
                    }}
                    placeholder='Extension description'
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
                    {extension.description || 'No description provided'}
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

export default ExtensionsTable;
