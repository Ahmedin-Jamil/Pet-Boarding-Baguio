import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faCalendarAlt, faInfoCircle, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Booking.css';
import './GradientBackground.css';
import GroomingAgreement from './GroomingAgreement';
import DatePickerModal from './DatePickerModal';

const GroomingReservation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for date and time
  const [startDate, setStartDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [serviceType, setServiceType] = useState('grooming');
  
  // State for selected service from GroomingServices component
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  
  // Get date, time, and service selection from location state if available
  React.useEffect(() => {
    if (location.state) {
      if (location.state.startDate) setStartDate(new Date(location.state.startDate));
      if (location.state.selectedTime) setSelectedTime(location.state.selectedTime);
      if (location.state.serviceType) setServiceType(location.state.serviceType);
      
      // Get selected service data from GroomingServices component
      if (location.state.selectedService) setSelectedService(location.state.selectedService);
      if (location.state.selectedSize) setSelectedSize(location.state.selectedSize);
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
        address: 'Not provided' // Grooming doesn't collect address
      },
      scheduledDateTime: startDate ? `${startDate.toLocaleDateString()} | ${selectedTime || '8:00 am'}` : '2025/03/22 | 8:00 am',
      services: selectedService === 'daycare' ? 'Pet Daycare' : 'Marsha\'s Tub Bath Service',
      selectedService: selectedService,
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
                onClick={() => navigate('/grooming-services')}
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
          <h2 style={{ color: '#fff' }}>Guest Information(Grooming)</h2>
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
                      placeholder="e.g., Max, Bella, Luna"
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
                <Col md={12}>
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
                label={
                  <span>
                    I agree to all{' '}
                    <span 
                      style={{ color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}
                      onClick={(e) => {
                        e.preventDefault();
                        setShowAgreement(true);
                      }}
                    >
                      Terms and Conditions
                    </span>
                  </span>
                } 
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
            </Form.Group>
            
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
      
      {/* Grooming Agreement Modal */}
      <GroomingAgreement 
        show={showAgreement} 
        onHide={() => setShowAgreement(false)} 
      />
      
      {/* Date Picker Modal */}
      <DatePickerModal 
        show={showDatePickerModal} 
        onHide={() => setShowDatePickerModal(false)} 
        serviceType={serviceType}
        onDateSelect={(dateData) => {
          // Update state with new date data
          setStartDate(new Date(dateData.startDate));
          setSelectedTime(dateData.selectedTime);
          setShowDatePickerModal(false);
        }}
      />
    </div>
  );
};

export default GroomingReservation;