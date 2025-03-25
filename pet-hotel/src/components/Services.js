import React, { useState, useEffect, useRef, faQuestion } from 'react';
import { Container, Row, Col, Card, Button, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faCalendarAlt, faInfoCircle, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DatePickerModal from './DatePickerModal';
import './Services.css';
import './GradientBackground.css';

const Services = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [serviceType, setServiceType] = useState('overnight');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  
  return (
    <div className="services-page">
      {/* Navigation Tabs */}
      <div className="booking-steps-nav gradient-background">
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

      {/* Overnight Stays Section */}
      <div className="gradient-background" style={{ padding: '20px 0' }}>
        <Container>
          <h3 style={{ color: '#fff', textAlign: 'center', marginBottom: '20px' }}></h3>
          
          {/* Deluxe Rooms */}
          <Card className="mb-4" style={{ backgroundColor: '#fff', borderRadius: '10px' }}>
            <Card.Body>
              <h4 className="text-center mb-3">DELUXE ROOMS</h4>
              <p className="text-center">
                (Regular Room Gated with 24/7 Pet sitter, Well Ventilated, (1) HOUR Access Play Area Daily, Morning and Evening Outdoor breaks Inclusive of Regular Bed and Food Bowls + Treats, Good for Small/Medium Sizes, Real-Time Updates)<br/>
                ***For CATS: Inclusive of Litter Boxes and Scratch Pads
              </p>
              <Row className="mt-4 text-center">
                <Col md={3}>
                  <Button 
                    className={`room-size-btn ${selectedRoom === 'deluxe' && selectedSize === 'small' ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedRoom('deluxe');
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
                    {selectedRoom === 'deluxe' && selectedSize === 'small' && (
                      <FontAwesomeIcon icon={faCheck} className="me-2" />
                    )}
                    <FontAwesomeIcon icon={faPaw} className="me-2" />
                    Small (P500/Night)
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    className={`room-size-btn ${selectedRoom === 'deluxe' && selectedSize === 'medium' ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedRoom('deluxe');
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
                    {selectedRoom === 'deluxe' && selectedSize === 'medium' && (
                      <FontAwesomeIcon icon={faCheck} className="me-2" />
                    )}
                    <FontAwesomeIcon icon={faPaw} className="me-2" />
                    Medium (P650/Night)
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    className={`room-size-btn ${selectedRoom === 'deluxe' && selectedSize === 'large' ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedRoom('deluxe');
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
                    {selectedRoom === 'deluxe' && selectedSize === 'large' && (
                      <FontAwesomeIcon icon={faCheck} className="me-2" />
                    )}
                    <FontAwesomeIcon icon={faPaw} className="me-2" />
                    Large (P750/Night)
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    className={`room-size-btn ${selectedRoom === 'deluxe' && selectedSize === 'extra-large' ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedRoom('deluxe');
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
                    {selectedRoom === 'deluxe' && selectedSize === 'extra-large' && (
                      <FontAwesomeIcon icon={faCheck} className="me-2" />
                    )}
                    <FontAwesomeIcon icon={faPaw} className="me-2" />
                    Extra-Large (P1000/Night)
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          {/* Premium Rooms */}
          <Card className="mb-4" style={{ backgroundColor: '#fff', borderRadius: '10px' }}>
            <Card.Body>
              <h4 className="text-center mb-3">PREMIUM ROOMS</h4>
              <p className="text-center">
                (Premium Gated Room with 24/7 Pet Sitter, Well Ventilated, (2) HOURS Access in our Play Area Daily, Morning and Evening Outdoor Breaks, Inclusive of Premium Bed and Ceramic Bowls + Treats, Good for Small/Medium Sizes, Real-Time Updates)<br/>
                ***For CATS: Inclusive of Litter Boxes and Scratch Pads
              </p>
              <Row className="mt-4 text-center">
                <Col md={3}>
                  <Button 
                    className={`room-size-btn ${selectedRoom === 'premium' && selectedSize === 'small' ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedRoom('premium');
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
                    {selectedRoom === 'premium' && selectedSize === 'small' && (
                      <FontAwesomeIcon icon={faCheck} className="me-2" />
                    )}
                    <FontAwesomeIcon icon={faPaw} className="me-2" />
                    Small (P650/Night)
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    className={`room-size-btn ${selectedRoom === 'premium' && selectedSize === 'medium' ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedRoom('premium');
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
                    {selectedRoom === 'premium' && selectedSize === 'medium' && (
                      <FontAwesomeIcon icon={faCheck} className="me-2" />
                    )}
                    <FontAwesomeIcon icon={faPaw} className="me-2" />
                    Medium (P800/Night)
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    className={`room-size-btn ${selectedRoom === 'premium' && selectedSize === 'large' ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedRoom('premium');
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
                    {selectedRoom === 'premium' && selectedSize === 'large' && (
                      <FontAwesomeIcon icon={faCheck} className="me-2" />
                    )}
                    <FontAwesomeIcon icon={faPaw} className="me-2" />
                    Large (P1,000/Night)
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    className={`room-size-btn ${selectedRoom === 'premium' && selectedSize === 'extra-large' ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedRoom('premium');
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
                    {selectedRoom === 'premium' && selectedSize === 'extra-large' && (
                      <FontAwesomeIcon icon={faCheck} className="me-2" />
                    )}
                    <FontAwesomeIcon icon={faPaw} className="me-2" />
                    Extra-Large (P1,500/Night)
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          {/* Executive Rooms */}
          <Card className="mb-4" style={{ backgroundColor: '#fff', borderRadius: '10px' }}>
            <Card.Body>
              <h4 className="text-center mb-3">EXECUTIVE ROOMS</h4>
              <p className="text-center">
                (Premium Full Room with 24/7 Pet Sitter, Good for SOLO or Groups, Well Ventilated with AIR PURIFIER, (2) HOURS Access to our Play Area Daily, Morning and Evening Outdoor Breaks, Inclusive of Premium Bed and Ceramic Bowls + Treats, Good for Small/Medium Sizes Real-Time Updates, Free Soft Copy Photo Shoot)<br/>
                ***For CATS: Inclusive of Litter Boxes and Scratch Pads
              </p>
              <Row className="mt-4 text-center">
                <Col md={3}>
                  <Button 
                    className={`room-size-btn ${selectedRoom === 'executive' && selectedSize === 'small' ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedRoom('executive');
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
                    {selectedRoom === 'executive' && selectedSize === 'small' && (
                      <FontAwesomeIcon icon={faCheck} className="me-2" />
                    )}
                    <FontAwesomeIcon icon={faPaw} className="me-2" />
                    Small (P650/Night)
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    className={`room-size-btn ${selectedRoom === 'executive' && selectedSize === 'medium' ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedRoom('executive');
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
                    {selectedRoom === 'executive' && selectedSize === 'medium' && (
                      <FontAwesomeIcon icon={faCheck} className="me-2" />
                    )}
                    <FontAwesomeIcon icon={faPaw} className="me-2" />
                    Medium (P850/Night)
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    className={`room-size-btn ${selectedRoom === 'executive' && selectedSize === 'large' ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedRoom('executive');
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
                    {selectedRoom === 'executive' && selectedSize === 'large' && (
                      <FontAwesomeIcon icon={faCheck} className="me-2" />
                    )}
                    <FontAwesomeIcon icon={faPaw} className="me-2" />
                    Large (P1,000/Night)
                  </Button>
                </Col>
                <Col md={3}>
                  <Button 
                    className={`room-size-btn ${selectedRoom === 'executive' && selectedSize === 'extra-large' ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedRoom('executive');
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
                    {selectedRoom === 'executive' && selectedSize === 'extra-large' && (
                      <FontAwesomeIcon icon={faCheck} className="me-2" />
                    )}
                    <FontAwesomeIcon icon={faPaw} className="me-2" />
                    Extra-Large (P1,500/Night)
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          <p className="text-center" style={{ color: '#fff' }}>+P500/night room fee (for all sizes)</p>
          
          <div className="text-center mt-4">
            <Button 
              variant="danger" 
              className="rounded-pill"
              onClick={() => {
                // Create booking data object with selected room and size
                const bookingData = {
                  selectedRoom: selectedRoom,
                  selectedSize: selectedSize,
                  roomType: selectedRoom ? `${selectedRoom.charAt(0).toUpperCase() + selectedRoom.slice(1)} Room - ${selectedSize.charAt(0).toUpperCase() + selectedSize.slice(1)}` : null
                };
                
                // Navigate to reservation page with selected room data
                navigate('/overnight-reservation', { state: bookingData });
              }}
              disabled={!selectedRoom || !selectedSize}
              style={{ 
                backgroundColor: '#FF4500', 
                borderColor: '#FF4500', 
                padding: '10px 30px' 
              }}
            >
              Book Now <FontAwesomeIcon icon={faCalendarAlt} className="ms-2" />
            </Button>
          </div>
          
          <div className="text-center mt-5">
            <img 
              src="logo192.png" 
              alt="Cat" 
              className="img-fluid" 
              style={{ maxWidth: '200px' }}
            />
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
          navigate('/services', { state: dateData });
          setShowDatePickerModal(false);
        }}
      />
    </div>
  );
};

export default Services;