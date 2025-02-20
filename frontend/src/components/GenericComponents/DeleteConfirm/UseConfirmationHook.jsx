import { useState } from 'react';

export const useConfirmation = () => {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    document: null, // Store the document object
    resolve: null,
  });

  const requestConfirmation = (document) => {
    return new Promise((resolve) => {
      setConfirmState({ isOpen: true, document, resolve });
    });
  };

  const handleConfirm = (result) => {
    if (confirmState.resolve) {
      confirmState.resolve(result);
      setConfirmState({ isOpen: false, document: null, resolve: null });
    }
  };

  return { confirmState, requestConfirmation, handleConfirm };
};
