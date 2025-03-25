import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faCalendarAlt, faInfoCircle, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Booking.css';
import './GradientBackground.css';
import Agreement from './Agreement';
import DatePickerModal from './DatePickerModal';

const OvernightReservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for date and time from Home component
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [serviceType, setServiceType] = useState('overnight');
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  
  // State for selected room from Services component
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [roomType, setRoomType] = useState(null);
  
  // Get date, time, and room selection from location state if available
  useEffect(() => {
    if (location.state) {
      if (location.state.startDate) setStartDate(new Date(location.state.startDate));
      if (location.state.endDate) setEndDate(new Date(location.state.endDate));
      if (location.state.selectedTime) setSelectedTime(location.state.selectedTime);
      if (location.state.serviceType) setServiceType(location.state.serviceType);
      
      // Get selected room data from Services component
      if (location.state.selectedRoom) setSelectedRoom(location.state.selectedRoom);
      if (location.state.selectedSize) setSelectedSize(location.state.selectedSize);
      if (location.state.roomType) setRoomType(location.state.roomType);
    }
  }, [location]);
  
  // State for form fields
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('');
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerAddress, setOwnerAddress] = useState('');
  
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [noAdditionalInfo, setNoAdditionalInfo] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Create booking data object to pass to confirmation page
    const bookingData = {
      petDetails: {
        name: petName,
        type: petType,
        breed: breed,
        sex: sex,
        age: dateOfBirth ? `${dateOfBirth.toLocaleDateString()}` : ''
      },
      ownerDetails: {
        name: ownerName,
        email: ownerEmail,
        phone: ownerPhone,
        address: ownerAddress || 'Not provided'
      },
      scheduledDateTime: startDate ? `${startDate.toLocaleDateString()} | ${selectedTime || '8:00 am'}` : '2025/03/22 | 8:00 am',
      services: roomType || (serviceType === 'overnight' ? 'Overnight Stay' : 'Daycare'),
      selectedRoom: selectedRoom,
      selectedSize: selectedSize,
      additionalInfo: noAdditionalInfo ? 'None' : additionalInfo
    };
    
    // Navigate to confirmation page with booking data
    navigate('/confirmation', { state: { bookingData } });
  };
  
  return (
    <div className="booking-page">
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
                className="nav-link" 
                onClick={() => navigate('/services')}
                style={{ color: '#000' }}
              >
                <FontAwesomeIcon icon={faPaw} className="me-2" />
                Select Services
              </Button>
            </Nav.Item>
            <Nav.Item>
              <Button 
                variant="link" 
                className="nav-link active" 
                style={{ color: '#000', fontWeight: 'bold' }}
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
          <h2 style={{ color: '#fff' }}>Guest Information (Overnight&Daycare)</h2>
        </Container>
      </div>

      {/* Form Section */}
      <div className="gradient-background" style={{ padding: '20px 0' }}>
        <Container>
          <Form onSubmit={handleSubmit}>
            <div className="bg-light p-4 rounded mb-4">
              <h3 className="mb-4">Pet</h3>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="petName">
                    <Form.Label>Pet's Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      placeholder="e.g., Max, Bella, Luna..."
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="petType">
                    <Form.Label>Pet's Type</Form.Label>
                    <Form.Select 
                      value={petType}
                      onChange={(e) => setPetType(e.target.value)}
                      required
                    >
                      <option value="">Select Pet Type</option>
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Rabbit">Rabbit</option>
                      <option value="Bird">Bird</option>
                      <option value="Hamster">Hamster</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="breed">
                    <Form.Label>Breed</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={breed}
                      onChange={(e) => setBreed(e.target.value)}
                      placeholder="e.g., Golden Retriever, Persian Cat"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="sex">
                    <Form.Label>Sex</Form.Label>
                    <Form.Select 
                      value={sex}
                      onChange={(e) => setSex(e.target.value)}
                      required
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group controlId="dateOfBirth">
                    <Form.Label>Date of Birth</Form.Label>
                    <DatePicker
                      selected={dateOfBirth}
                      onChange={(date) => setDateOfBirth(date)}
                      maxDate={new Date()}
                      showYearDropdown
                      scrollableYearDropdown
                      yearDropdownItemNumber={15}
                      dateFormat="MM/dd/yyyy"
                      placeholderText="Select date"
                      className="form-control"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
            
            <div className="bg-light p-4 rounded mb-4">
              <h3 className="mb-4">Owner</h3>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="ownerName">
                    <Form.Label>Owner's Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="ownerPhone">
                    <Form.Label>Owner's Phone No.</Form.Label>
                    <Form.Control 
                      type="tel" 
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      placeholder="e.g., (555) 123-4567"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="ownerEmail">
                    <Form.Label>Owner's Email Address</Form.Label>
                    <Form.Control 
                      type="email" 
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder="e.g., john.smith@email.com"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="ownerAddress">
                    <Form.Label>Complete Address</Form.Label>
                    <Form.Control 
                      type="text" 
                      value={ownerAddress}
                      onChange={(e) => setOwnerAddress(e.target.value)}
                      placeholder="e.g., 123 Main St, City, State"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div>
            
            <div className="bg-light p-4 rounded mb-4">
              <h3 className="mb-4">Additional Information</h3>
              <p>(Healthe history like Allergies, Tick and Fleas Meds, Vaccine etc)</p>
              
              <Form.Group controlId="additionalInfo" className="mb-3">
                <Form.Control 
                  as="textarea" 
                  rows={4} 
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  disabled={noAdditionalInfo}
                />
              </Form.Group>
              
              <Form.Group controlId="noAdditionalInfo" className="mb-3">
                <Form.Check 
                  type="checkbox" 
                  label="No more additional information" 
                  checked={noAdditionalInfo}
                  onChange={(e) => {
                    setNoAdditionalInfo(e.target.checked);
                    if (e.target.checked) {
                      setAdditionalInfo('');
                    }
                  }}
                />
              </Form.Group>
            </div>
            
            <Form.Group controlId="agreeTerms" className="mb-4 text-center">
              <Form.Check 
                type="checkbox" 
                label={<>
                  I agree to all <span 
                    style={{ 
                      color: '#0d6efd', 
                      textDecoration: 'underline', 
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAgreement(true);
                    }}
                  >
                    Terms and Conditions
                  </span>
                </>} 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
            </Form.Group>
            
            {/* Agreement Modal */}
            <Agreement 
              show={showAgreement} 
              onHide={() => setShowAgreement(false)} 
            />
            
            <div className="text-center">
              <Button 
                type="submit" 
                variant="success" 
                className="rounded-pill px-4 py-2"
                disabled={!agreeTerms}
              >
                Check Confirmation
              </Button>
            </div>
          </Form>
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
          // Update state with new date data
          setStartDate(new Date(dateData.startDate));
          setEndDate(new Date(dateData.endDate));
          setSelectedTime(dateData.selectedTime);
          setShowDatePickerModal(false);
        }}
      />
    </div>
  );
};

export default OvernightReservation;