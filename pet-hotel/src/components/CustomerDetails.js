import React from 'react';
import { Modal, Button, Row, Col, Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import './AdminBookingList.css';

const CustomerDetails = ({ show, onHide, booking }) => {
  // If no booking is provided, return null
  if (!booking) return null;
  
  // Parse additional services if it's a string
  const additionalServices = booking.additionalServices ? 
    (typeof booking.additionalServices === 'string' ? 
      JSON.parse(booking.additionalServices) : booking.additionalServices) : 
    [];

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="customer-details-modal"
      centered
    >
      <Modal.Header closeButton style={{ backgroundColor: '#FFA500', color: 'white' }}>
        <Modal.Title id="customer-details-modal">
          <FontAwesomeIcon icon={faPaw} className="me-2" />
          Customer Information
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="date-time-info text-center mb-4">
          <h5>{new Date(booking.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h5>
          <p className="text-muted">{booking.timeSlot}</p>
        </div>

        <Row>
          <Col md={6}>
            <Card className="mb-3">
              <Card.Header style={{ backgroundColor: '#f8f9fa' }}>
                <h5 className="mb-0">Pet's Details</h5>
              </Card.Header>
              <Card.Body>
                <Row className="mb-2">
                  <Col xs={4}><strong>Name:</strong></Col>
                  <Col xs={8}>{booking.petName}</Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={4}><strong>Type:</strong></Col>
                  <Col xs={8}>{booking.petType}</Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={4}><strong>Breed:</strong></Col>
                  <Col xs={8}>{booking.petBreed || 'Golden Retriever'}</Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={4}><strong>Sex:</strong></Col>
                  <Col xs={8}>{booking.sex || 'Female'}</Col>
                </Row>
                <Row>
                  <Col xs={4}><strong>Age:</strong></Col>
                  <Col xs={8}>{booking.petAge || '3'}</Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card>
              <Card.Header style={{ backgroundColor: '#f8f9fa' }}>
                <h5 className="mb-0">Owner's Details</h5>
              </Card.Header>
              <Card.Body>
                <Row className="mb-2">
                  <Col xs={4}><strong>Name:</strong></Col>
                  <Col xs={8}>{booking.ownerName}</Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={12}>
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faEnvelope} className="me-2 text-muted" />
                      <a href={`mailto:${booking.ownerEmail || 'johnjames@gm.com'}`}>{booking.ownerEmail || 'johnjames@gm.com'}</a>
                    </div>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={12}>
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faPhone} className="me-2 text-muted" />
                      <a href={`tel:${booking.ownerPhone || '092313412'}`}>{booking.ownerPhone || '092313412'}</a>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <div className="d-flex align-items-start">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2 text-muted mt-1" />
                      <span>{booking.ownerAddress || 'Choco Nabaldian, Loakan Street'}</span>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col xs={12}>
            <Card>
              <Card.Header style={{ backgroundColor: '#f8f9fa' }}>
                <h5 className="mb-0">Booking Details</h5>
              </Card.Header>
              <Card.Body>
                <Row className="mb-2">
                  <Col xs={4}><strong>Service:</strong></Col>
                  <Col xs={8}>{booking.selectedRoom ? `${booking.selectedRoom.charAt(0).toUpperCase() + booking.selectedRoom.slice(1)} Room` : 'Deluxe Room'}</Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={4}><strong>Check-in:</strong></Col>
                  <Col xs={8}>{new Date(booking.startDate).toLocaleDateString()}</Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={4}><strong>Check-out:</strong></Col>
                  <Col xs={8}>{new Date(booking.endDate).toLocaleDateString()}</Col>
                </Row>
                <Row className="mb-2">
                  <Col xs={4}><strong>Total Cost:</strong></Col>
                  <Col xs={8}>${booking.totalCost || '150'}</Col>
                </Row>
                {additionalServices && additionalServices.length > 0 && (
                  <Row className="mb-2">
                    <Col xs={4}><strong>Additional Services:</strong></Col>
                    <Col xs={8}>
                      <ul className="ps-3 mb-0">
                        {additionalServices.map((service, index) => (
                          <li key={index}>{service}</li>
                        ))}
                      </ul>
                    </Col>
                  </Row>
                )}
                {booking.specialRequirements && (
                  <Row>
                    <Col xs={4}><strong>Special Requirements:</strong></Col>
                    <Col xs={8}>{booking.specialRequirements}</Col>
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomerDetails;