import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ConfirmationDialog = ({ show, onHide, onConfirm, title, message }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      size="sm"
      aria-labelledby="confirmation-dialog"
      centered
    >
      <Modal.Header closeButton style={{ backgroundColor: '#FFA500', color: 'white' }}>
        <Modal.Title id="confirmation-dialog">
          {title || 'Confirmation'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message || 'Are you sure you want to proceed?'}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          No
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationDialog;