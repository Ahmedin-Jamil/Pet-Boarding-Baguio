import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Nav, Tabs, Tab, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faCalendarAlt, faInfoCircle, faQuestion, faCheck, faUser, faNotesMedical } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ReservationStyles.css';
import './GradientBackground.css';
import './ReservationForm.css';
import './PetTabs.css';
import './ReservationNew.css';
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
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  
  // Get date, time, and service selection from location state if available
  React.useEffect(() => {
    if (location.state) {
      if (location.state.startDate) setStartDate(new Date(location.state.startDate));
      if (location.state.selectedTime) setSelectedTime(location.state.selectedTime);
      if (location.state.serviceType) setServiceType(location.state.serviceType);
      
      // Get selected service data from GroomingServices component
      if (location.state.selectedService) setSelectedService(location.state.selectedService);
      if (location.state.selectedServiceType) setSelectedServiceType(location.state.selectedServiceType);
      if (location.state.selectedSize) setSelectedSize(location.state.selectedSize);
    }
  }, [location]);
  
  // State for number of pets
  const [numberOfPets, setNumberOfPets] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  
  // State for multiple pets
  const [pets, setPets] = useState([{
    petName: '',
    petType: '',
    otherPetType: '',
    breed: '',
    sex: '',
    dateOfBirth: null
  }]);
  
  // Helper function to update pet information
  const updatePetInfo = (index, field, value) => {
    const updatedPets = [...pets];
    updatedPets[index] = { ...updatedPets[index], [field]: value };
    setPets(updatedPets);
  };
  
  // Handle number of pets change
  const handleNumberOfPetsChange = (e) => {
    const newNumber = parseInt(e.target.value);
    setNumberOfPets(newNumber);
    
    // Update pets array based on new number
    if (newNumber > pets.length) {
      // Add more pet forms
      const additionalPets = Array(newNumber - pets.length).fill().map(() => ({
        petName: '',
        petType: '',
        otherPetType: '',
        breed: '',
        sex: '',
        dateOfBirth: null
      }));
      setPets([...pets, ...additionalPets]);
    } else if (newNumber < pets.length) {
      // Remove excess pet forms
      setPets(pets.slice(0, newNumber));
      if (activeTab >= newNumber) {
        setActiveTab(newNumber - 1);
      }
    }
  };
  
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [noAdditionalInfo, setNoAdditionalInfo] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create pet details array from all pets
    const petDetailsArray = pets.map(pet => ({
      name: pet.petName,
      type: pet.petType === 'Others' ? `Others/${pet.otherPetType}` : pet.petType,
      breed: pet.breed,
      sex: pet.sex,
      age: pet.dateOfBirth ? `${pet.dateOfBirth.toLocaleDateString()}` : ''
    }));
    
    // Create booking data object to pass to confirmation page
    const bookingData = {
      numberOfPets: numberOfPets,
      petDetails: petDetailsArray.length === 1 ? petDetailsArray[0] : petDetailsArray[0], // For backward compatibility
      allPetDetails: petDetailsArray, // New field for multiple pets
      ownerDetails: {
        name: ownerName,
        email: ownerEmail,
        phone: ownerPhone,
        address: 'Not provided' // Grooming doesn't collect address
      },
      scheduledDateTime: startDate ? `${startDate.toLocaleDateString()} | ${selectedTime || '8:00 am'}` : '2025/03/22 | 8:00 am',
      services: selectedServiceType || (selectedService === 'daycare' ? 'Pet Daycare' : 'Marsha\'s Tub Bath Service'),
      selectedService: selectedService,
      selectedServiceType: selectedServiceType,
      selectedSize: selectedSize,
      additionalInfo: noAdditionalInfo ? 'None' : additionalInfo
    };
    
    // Navigate to confirmation page with booking data
    navigate('/confirmation', { state: { bookingData } });
  };
  
  return (
    <div className="reservation-page">
      {/* Progress Steps */}
      <div className="progress-steps">
        <div className="step">
          <div className="step-circle completed">
            <FontAwesomeIcon icon={faCalendarAlt} />
          </div>
          <div className="step-text">Select Date</div>
        </div>
        <div className="step">
          <div className="step-circle completed">
            <FontAwesomeIcon icon={faPaw} />
          </div>
          <div className="step-text">Select Services</div>
        </div>
        <div className="step">
          <div className="step-circle active">
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
          <div className="step-text active">Reservation Details</div>
        </div>
        <div className="step">
          <div className="step-circle">
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <div className="step-text">Confirmation</div>
        </div>
      </div>
      
      {/* Header Section */}
      <div className="header-section">
        <Container>
          <h2>Guest Information (Grooming)</h2>
          <p>Please provide details for your pet(s)</p>
        </Container>
      </div>

      {/* Form Section */}
      <Container>
        <Form onSubmit={handleSubmit}>
            {/* Number of Pets Selection */}
            <div className="bg-light p-4 rounded mb-4">
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group controlId="numberOfPets">
                    <Form.Label>Number of Pets</Form.Label>
                    <Form.Select 
                      value={numberOfPets}
                      onChange={handleNumberOfPetsChange}
                      className="form-control"
                      style={{ maxWidth: '200px' }}
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i+1} value={i+1}>{i+1}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </div>
            
            {/* Pet Information Tabs */}
            <div className="bg-light p-4 rounded mb-4">
              <h3 className="mb-4">Pet Information</h3>
              
              {/* Tab Navigation */}
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(parseInt(k))}
                id="pet-tabs"
                className="mb-4 pet-tabs"
              >
                {pets.map((_, index) => (
                  <Tab 
                    key={index} 
                    eventKey={index} 
                    title={
                      <span>
                        Pet {index + 1}
                        {pets[index].petName && <span> - {pets[index].petName}</span>}
                      </span>
                    }
                  />
                ))}
              </Tabs>
              
              {/* Active Pet Form */}
              {pets.map((pet, index) => (
                <div key={index} style={{ display: activeTab === index ? 'block' : 'none' }}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId={`petName-${index}`}>
                        <Form.Label>Pet's Name</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={pet.petName}
                          onChange={(e) => updatePetInfo(index, 'petName', e.target.value)}
                          placeholder="e.g., Max, Bella, Luna"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId={`petType-${index}`}>
                        <Form.Label>Pet's Type</Form.Label>
                        <div className="d-flex gap-2">
                          <Form.Select 
                            value={pet.petType || ''}
                            onChange={(e) => {
                              const selectedValue = e.target.value;
                              // Force update the pet type state
                              const updatedPets = [...pets];
                              updatedPets[index] = { ...updatedPets[index], petType: selectedValue };
                              if (selectedValue !== 'Others') {
                                updatedPets[index].otherPetType = '';
                              }
                              setPets(updatedPets);
                            }}
                            required
                            style={{ flex: 1 }}
                          >
                            <option key="default" value="">Select Pet Type</option>
                            <option key="dog" value="Dog">Dog</option>
                            <option key="cat" value="Cat">Cat</option>
                            <option key="rabbit" value="Rabbit">Rabbit</option>
                            <option key="bird" value="Bird">Bird</option>
                            <option key="hamster" value="Hamster">Hamster</option>
                            <option key="others" value="Others">Others</option>
                          </Form.Select>
                          {pet.petType === 'Others' && (
                            <Form.Control
                              type="text"
                              value={pet.otherPetType}
                              onChange={(e) => updatePetInfo(index, 'otherPetType', e.target.value)}
                              placeholder="Specify pet type"
                              required
                              style={{ flex: 1 }}
                            />
                          )}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId={`breed-${index}`}>
                        <Form.Label>Breed</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={pet.breed}
                          onChange={(e) => updatePetInfo(index, 'breed', e.target.value)}
                          placeholder="e.g., Golden Retriever, Persian Cat"
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId={`sex-${index}`}>
                        <Form.Label>Sex</Form.Label>
                        <Form.Select 
                          value={pet.sex}
                          onChange={(e) => updatePetInfo(index, 'sex', e.target.value)}
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
                      <Form.Group controlId={`dateOfBirth-${index}`}>
                        <Form.Label>Date of Birth</Form.Label>
                        <DatePicker
                          selected={pet.dateOfBirth}
                          onChange={(date) => updatePetInfo(index, 'dateOfBirth', date)}
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
                  
                  {/* Pet Navigation Buttons */}
                  <div className="d-flex justify-content-between mt-3 mb-2">
                    <Button
                      variant="outline-primary"
                      onClick={() => setActiveTab(Math.max(0, activeTab - 1))}
                      disabled={activeTab === 0}
                    >
                      Previous Pet
                    </Button>
                    <Button
                      variant="outline-primary"
                      onClick={() => setActiveTab(Math.min(numberOfPets - 1, activeTab + 1))}
                      disabled={activeTab === numberOfPets - 1}
                    >
                      Next Pet
                    </Button>
                  </div>
                  
                  {/* Pet Completion Status */}
                  <div className="pet-status mt-3">
                    <div className="d-flex justify-content-center">
                      {pets.map((_, idx) => (
                        <Badge 
                          key={idx} 
                          bg={idx === activeTab ? 'primary' : 
                             (pets[idx].petName && pets[idx].petType && pets[idx].breed && pets[idx].sex) ? 'success' : 'secondary'}
                          style={{ 
                            width: '30px', 
                            height: '30px', 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            margin: '0 5px',
                            cursor: 'pointer'
                          }}
                          onClick={() => setActiveTab(idx)}
                        >
                          {idx + 1}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="info-card">
              <h3><FontAwesomeIcon icon={faUser} className="me-2" />Owner Information</h3>
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
            
            <div className="info-card additional-info-section">
              <h3><FontAwesomeIcon icon={faNotesMedical} className="me-2" />Additional Information</h3>
              <p>(Feeding habits, medical conditions, allergies, tick and flea needs, vaccine info, etc.)</p>
              
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