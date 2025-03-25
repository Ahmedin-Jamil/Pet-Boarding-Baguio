import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faCalendarAlt, faInfoCircle, faQuestion, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DatePickerModal from './DatePickerModal';
import './Services.css';
import './ModernEffects.css';
import './GradientBackground.css';

const GroomingServices = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [serviceType, setServiceType] = useState('grooming');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  
  // No parallax or animation effects
  
  return (
    <div className="services-page" ref={containerRef}>
      {/* Navigation Tabs */}
      <div className="gradient-background">
        <Container>
          <Nav className="justify-content-between">
            <Nav.Item>
              <Button 
                variant="link" 
                className="nav-link" 
                onClick={() => setShowDatePickerModal(true)}
                style={{ color: '#000' }}
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                Select Date
              </Button>
            </Nav.Item>
            <Nav.Item>
              <Button 
                variant="link" 
                className="nav-link active" 
                style={{ color: '#000', fontWeight: 'bold' }}
              >
                <FontAwesomeIcon icon={faPaw} className="me-2" />
                Select Services
              </Button>
            </Nav.Item>
            <Nav.Item>
              <Button 
                variant="link" 
                className="nav-link" 
                style={{ color: '#000' }}
              >
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Reservation Details
              </Button>
            </Nav.Item>
            <Nav.Item>
              <Button 
                variant="link" 
                className="nav-link" 
                style={{ color: '#000' }}
              >
                Confirmation
              </Button>
            </Nav.Item>
          </Nav>
        </Container>
      </div>
      
      {/* Header Section */}
      <div className="gradient-background" style={{ padding: '20px 0', textAlign: 'center' }}>
        <Container>
          <h2 style={{ color: '#fff' }}>Rates and Services</h2>
        </Container>
      </div>

      {/* Grooming Services Section */}
      <div className="gradient-background" style={{ padding: '20px 0' }}>
        <Container>
          <Row>
            {/* Pet Daycare Section */}
            <Col md={6}>
              <Card className="mb-4" style={{ backgroundColor: '#fff', borderRadius: '10px' }}>
                <Card.Body>
                  <h3 className="text-center mb-3">PET DAYCARE</h3>
                  <div className="p-3">
                    <h5 className="mb-3">Minimum of (6) Hours</h5>
                    <Row className="mt-4 text-center">
                      <Col xs={12} className="mb-2">
                        <Button 
                          className={`room-size-btn ${selectedService === 'daycare' && selectedSize === 'small' ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedService('daycare');
                            setSelectedSize('small');
                          }}
                          style={{ 
                            width: '100%', 
                            padding: '15px',
                            backgroundColor: '#FFF8E1',
                            color: '#FF8C00',
                            border: '1px solid #FFD180',
                            borderRadius: '10px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {selectedService === 'daycare' && selectedSize === 'small' && (
                            <FontAwesomeIcon icon={faCheck} className="me-2" />
                          )}
                          <FontAwesomeIcon icon={faPaw} className="me-2" />
                          Small (P350)
                        </Button>
                      </Col>
                      <Col xs={12} className="mb-2">
                        <Button 
                          className={`room-size-btn ${selectedService === 'daycare' && selectedSize === 'medium' ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedService('daycare');
                            setSelectedSize('medium');
                          }}
                          style={{ 
                            width: '100%', 
                            padding: '15px',
                            backgroundColor: '#FFF8E1',
                            color: '#FF8C00',
                            border: '1px solid #FFD180',
                            borderRadius: '10px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {selectedService === 'daycare' && selectedSize === 'medium' && (
                            <FontAwesomeIcon icon={faCheck} className="me-2" />
                          )}
                          <FontAwesomeIcon icon={faPaw} className="me-2" />
                          Medium (P450)
                        </Button>
                      </Col>
                      <Col xs={12} className="mb-2">
                        <Button 
                          className={`room-size-btn ${selectedService === 'daycare' && selectedSize === 'large' ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedService('daycare');
                            setSelectedSize('large');
                          }}
                          style={{ 
                            width: '100%', 
                            padding: '15px',
                            backgroundColor: '#FFF8E1',
                            color: '#FF8C00',
                            border: '1px solid #FFD180',
                            borderRadius: '10px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {selectedService === 'daycare' && selectedSize === 'large' && (
                            <FontAwesomeIcon icon={faCheck} className="me-2" />
                          )}
                          <FontAwesomeIcon icon={faPaw} className="me-2" />
                          Large (P500)
                        </Button>
                      </Col>
                      <Col xs={12} className="mb-2">
                        <Button 
                          className={`room-size-btn ${selectedService === 'daycare' && selectedSize === 'extra-large' ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedService('daycare');
                            setSelectedSize('extra-large');
                          }}
                          style={{ 
                            width: '100%', 
                            padding: '15px',
                            backgroundColor: '#FFF8E1',
                            color: '#FF8C00',
                            border: '1px solid #FFD180',
                            borderRadius: '10px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {selectedService === 'daycare' && selectedSize === 'extra-large' && (
                            <FontAwesomeIcon icon={faCheck} className="me-2" />
                          )}
                          <FontAwesomeIcon icon={faPaw} className="me-2" />
                          Extra-Large (P600)
                        </Button>
                      </Col>
                    </Row>
                    <p className="mt-3 text-center">Additional P80 per hour exceeded</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            
            {/* Marsha's Tub Section */}
            <Col md={6}>
              <Card className="mb-4" style={{ backgroundColor: '#fff', borderRadius: '10px' }}>
                <Card.Body>
                  <h3 className="text-center mb-3">MARSHA'S TUB</h3>
                  <div className="p-3">
                    <h5 className="mb-3">Pet Bath and Dry Services</h5>
                    <Row className="mt-4 text-center">
                      <Col xs={12} className="mb-2">
                        <Button 
                          className={`room-size-btn ${selectedService === 'tub' && selectedSize === 'small' ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedService('tub');
                            setSelectedSize('small');
                          }}
                          style={{ 
                            width: '100%', 
                            padding: '15px',
                            backgroundColor: '#FFF8E1',
                            color: '#FF8C00',
                            border: '1px solid #FFD180',
                            borderRadius: '10px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {selectedService === 'tub' && selectedSize === 'small' && (
                            <FontAwesomeIcon icon={faCheck} className="me-2" />
                          )}
                          <FontAwesomeIcon icon={faPaw} className="me-2" />
                          Small (Dog/Cat) P350
                        </Button>
                      </Col>
                      <Col xs={12} className="mb-2">
                        <Button 
                          className={`room-size-btn ${selectedService === 'tub' && selectedSize === 'medium' ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedService('tub');
                            setSelectedSize('medium');
                          }}
                          style={{ 
                            width: '100%', 
                            padding: '15px',
                            backgroundColor: '#FFF8E1',
                            color: '#FF8C00',
                            border: '1px solid #FFD180',
                            borderRadius: '10px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {selectedService === 'tub' && selectedSize === 'medium' && (
                            <FontAwesomeIcon icon={faCheck} className="me-2" />
                          )}
                          <FontAwesomeIcon icon={faPaw} className="me-2" />
                          Medium P450
                        </Button>
                      </Col>
                      <Col xs={12} className="mb-2">
                        <Button 
                          className={`room-size-btn ${selectedService === 'tub' && selectedSize === 'large' ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedService('tub');
                            setSelectedSize('large');
                          }}
                          style={{ 
                            width: '100%', 
                            padding: '15px',
                            backgroundColor: '#FFF8E1',
                            color: '#FF8C00',
                            border: '1px solid #FFD180',
                            borderRadius: '10px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {selectedService === 'tub' && selectedSize === 'large' && (
                            <FontAwesomeIcon icon={faCheck} className="me-2" />
                          )}
                          <FontAwesomeIcon icon={faPaw} className="me-2" />
                          Large P550
                        </Button>
                      </Col>
                      <Col xs={12} className="mb-2">
                        <Button 
                          className={`room-size-btn ${selectedService === 'tub' && selectedSize === 'extra-large' ? 'selected' : ''}`}
                          onClick={() => {
                            setSelectedService('tub');
                            setSelectedSize('extra-large');
                          }}
                          style={{ 
                            width: '100%', 
                            padding: '15px',
                            backgroundColor: '#FFF8E1',
                            color: '#FF8C00',
                            border: '1px solid #FFD180',
                            borderRadius: '10px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          {selectedService === 'tub' && selectedSize === 'extra-large' && (
                            <FontAwesomeIcon icon={faCheck} className="me-2" />
                          )}
                          <FontAwesomeIcon icon={faPaw} className="me-2" />
                          Extra-Large P650
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          
          <div className="text-center mt-4">
            <Button 
              variant="danger" 
              className="rounded-pill"
              style={{ backgroundColor: '#FF4500', borderColor: '#FF4500', padding: '10px 30px' }}
              onClick={() => {
                if (selectedService && selectedSize) {
                  // Get date and time data from location state
                  const dateTimeData = location.state || {};
                  
                  // Add selected service and size to the data
                  const bookingData = {
                    ...dateTimeData,
                    selectedService: selectedService,
                    selectedSize: selectedSize,
                    serviceType: 'grooming'
                  };
                  
                  // Navigate to reservation page with the data
                  navigate('/grooming-reservation', { state: bookingData });
                } else {
                  alert('Please select a service and size before proceeding.');
                }
              }}
              disabled={!selectedService || !selectedSize}
            >
              Book now <FontAwesomeIcon icon={faCalendarAlt} className="ms-2" />
            </Button>
          </div>
        </Container>
      </div>
      
      {/* Help Button */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
        <Button 
          variant="light" 
          className="rounded-circle" 
          style={{ width: '50px', height: '50px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
        >
          <FontAwesomeIcon icon={faQuestion} />
        </Button>
      </div>
      
      {/* Date Picker Modal */}
      <DatePickerModal 
        show={showDatePickerModal} 
        onHide={() => setShowDatePickerModal(false)} 
        serviceType={serviceType}
        onDateSelect={(dateData) => {
          // Update location state with new date data
          navigate('/grooming-services', { state: dateData });
          setShowDatePickerModal(false);
        }}
      />
    </div>
  );
};

export default GroomingServices;