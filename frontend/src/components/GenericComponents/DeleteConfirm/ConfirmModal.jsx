import { useState } from 'react';

const ConfirmModal = ({ isOpen, document, onConfirm, onCancel }) => {
  const [typedName, setTypedName] = useState('');

  if (!isOpen || !document) return null;

  const handleInputChange = (e) => {
    setTypedName(e.target.value);
  };

  const overlayStyle = {
    position: 'fixed', // Changed from 'absolute'
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalStyle = {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)',
    minWidth: '300px',
    maxWidth: '500px',
    width: '90%',
    zIndex: 1001,
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '4px',
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h4 className='text-center mb-3'>Confirm Delete</h4>

        <p className='text-center'>
          Please type the document name to confirm deletion of this document.
          <br />
          <br />
          <strong className='text-danger'>{document.original_name}</strong>
        </p>

        {document.is_signed && (
          <p className='alert alert-warning text-danger text-center'>
            <strong>Warning:</strong> <br /> This document is signed. Deleting
            it will remove all associated signatures.
          </p>
        )}

        <input
          type='text'
          value={typedName}
          onChange={handleInputChange}
          placeholder='Type document name here...'
          style={inputStyle}
        />

        <div style={buttonContainerStyle}>
          <button onClick={() => onCancel(false)} className='btn btn-secondary'>
            Cancel
          </button>
          <button
            onClick={() => onConfirm(true)}
            disabled={typedName !== document.original_name}
            className='btn btn-danger'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
