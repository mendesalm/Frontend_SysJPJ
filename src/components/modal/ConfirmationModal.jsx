import React from 'react';
import Modal from './Modal';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="confirmation-modal-content">
        <p>{message}</p>
        <div className="confirmation-modal-actions">
          <button onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button onClick={onConfirm} className="btn btn-danger">
            Confirmar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;