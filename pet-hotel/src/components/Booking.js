import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faPaw, faCheck } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { API_URL } from '../config';
import './Booking.css';

const Booking = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 3)));
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('dog');
  const [petBreed, setPetBreed] = useState('');
  const [petAge, setPetAge] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('deluxe');
  const [additionalServices, setAdditionalServices] = useState([]);
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [validated, setValidated] = useState(false);

  const handleAdditionalServiceChange = (e) => {
    const service = e.target.value;
    if (e.target.checked) {
      setAdditionalServices([...additionalServices, service]);
    } else {
      setAdditionalServices(additionalServices.filter(item => item !== service));
    }
  };

  const calculateTotalPrice = () => {
    // Calculate number of nights
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    // Base price per night based on room type
    let basePrice = 0;
    switch(selectedRoom) {
      case 'standard':
        basePrice = 35;
        break;
      case 'deluxe':
        basePrice = 50;
        break;
      case 'luxury':
        basePrice = 75;
        break;
      default:
        basePrice = 50;
    }
    
    // Calculate room cost
    const roomCost = basePrice * nights;
    
    // Calculate additional services cost
    let additionalCost = 0;
    additionalServices.forEach(service => {
      switch(service) {
        case 'basicGrooming':
          additionalCost += 25;
          break;
        case 'fullGrooming':
          additionalCost += 45;
          break;
        case 'specialDiet':
          additionalCost += 10 * nights; // $10 per day
          break;
        case 'extraPlaytime':
          additionalCost += 15;
          break;
        case 'training':
          additionalCost += 30;
          break;
        default:
          break;
      }
    });
    
    return {
      roomCost,
      additionalCost,
      totalCost: roomCost + additionalCost,
      nights
    };
  };

  const { roomCost, additionalCost, totalCost, nights } = calculateTotalPrice();

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    
    setValidated(true);
    
    // Format dates for the API
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    // Create booking data object
    const bookingData = {
      petName,
      petType,
      petBreed,
      petAge,
      ownerName,
      ownerEmail,
      ownerPhone,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      selectedRoom,
      timeSlot: selectedTimeSlot,
      additionalServices,
      specialRequirements,
      totalCost
    };
    
    // Send booking data to the backend API
    fetch(`${API_URL}/api/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Booking successful:', data);
      setShowConfirmation(true);
    })
    .catch(error => {
      console.error('Error creating booking:', error);
      alert('There was an error processing your booking. Please try again.');
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="booking-page">
      <div className="booking-header">
        <Container className="text-center py-5">
          <h1 className="display-4 fw-bold">Book Your Pet's Stay</h1>
          <p className="lead">
            Complete the form below to reserve a spot for your furry friend at our luxury pet hotel.
          </p>
        </Container>
      </div>

      <Container className="py-5">
        {showConfirmation ? (
          <div className="confirmation-section">
            <Row className="justify-content-center">
              <Col md={8}>
                <Card className="confirmation-card">
                  <Card.Body className="text-center p-5">
                    <div className="confirmation-icon">
                      <FontAwesomeIcon icon={faCheck} />
                    </div>
                    <h2 className="mt-4 mb-3">Booking Confirmed!</h2>
                    <p className="lead mb-4">Thank you for choosing PetStay Hotel. We've received your booking request.</p>
                    
                    <div className="booking-details">
                      <h4 className="mb-3">Booking Details</h4>
                      <Row className="mb-2">
                        <Col xs={6} className="text-end fw-bold">Pet Name:</Col>
                        <Col xs={6} className="text-start">{petName}</Col>
                      </Row>
                      <Row className="mb-2">
                        <Col xs={6} className="text-end fw-bold">Stay Dates:</Col>
                        <Col xs={6} className="text-start">{formatDate(startDate)} to {formatDate(endDate)}</Col>
                      </Row>
                      <Row className="mb-2">
                        <Col xs={6} className="text-end fw-bold">Room Type:</Col>
                        <Col xs={6} className="text-start">{selectedRoom.charAt(0).toUpperCase() + selectedRoom.slice(1)} Suite</Col>
                      </Row>
                      <Row className="mb-2">
                        <Col xs={6} className="text-end fw-bold">Total Cost:</Col>
                        <Col xs={6} className="text-start">${totalCost}</Col>
                      </Row>
                    </div>
                    
                    <Alert variant="info" className="mt-4">
                      A confirmation email has been sent to {ownerEmail}. We'll contact you shortly to confirm the details.
                    </Alert>
                    
                    <Button 
                      variant="primary" 
                      className="mt-4 book-again-btn"
                      onClick={() => setShowConfirmation(false)}
                    >
                      Book Another Stay
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        ) : (
          <Row>
            <Col lg={8}>
              <Card className="booking-form-card">
                <Card.Body className="p-4">
                  <h2 className="mb-4">
                    <FontAwesomeIcon icon={faPaw} className="me-2" />
                    Booking Information
                  </h2>
                  
                  <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <h4 className="mt-4 mb-3">Pet Information</h4>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="petName">
                          <Form.Label>Pet Name</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="e.g., Max, Bella, Luna" 
                            value={petName}
                            onChange={(e) => setPetName(e.target.value)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide your pet's name.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="petType">
                          <Form.Label>Pet Type</Form.Label>
                          <Form.Select 
                            value={petType}
                            onChange={(e) => setPetType(e.target.value)}
                            required
                          >
                            <option value="dog">Dog</option>
                            <option value="cat">Cat</option>
                            <option value="bird">Bird</option>
                            <option value="other">Other</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="petBreed">
                          <Form.Label>Breed</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="e.g., Labrador, Persian Cat, Cockatiel" 
                            value={petBreed}
                            onChange={(e) => setPetBreed(e.target.value)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide your pet's breed.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="petAge">
                          <Form.Label>Age</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="e.g., 2 years, 6 months" 
                            value={petAge}
                            onChange={(e) => setPetAge(e.target.value)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide your pet's age.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <h4 className="mt-4 mb-3">Owner Information</h4>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="ownerName">
                          <Form.Label>Your Name</Form.Label>
                          <Form.Control 
                            type="text" 
                            placeholder="e.g., John Smith" 
                            value={ownerName}
                            onChange={(e) => setOwnerName(e.target.value)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide your name.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="ownerEmail">
                          <Form.Label>Email</Form.Label>
                          <Form.Control 
                            type="email" 
                            placeholder="Enter your email" 
                            value={ownerEmail}
                            onChange={(e) => setOwnerEmail(e.target.value)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide a valid email.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="ownerPhone">
                          <Form.Label>Phone Number</Form.Label>
                          <Form.Control 
                            type="tel" 
                            placeholder="Enter your phone number" 
                            value={ownerPhone}
                            onChange={(e) => setOwnerPhone(e.target.value)}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            Please provide your phone number.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <h4 className="mt-4 mb-3">Booking Details</h4>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="startDate">
                          <Form.Label>Check-in Date</Form.Label>
                          <DatePicker
                            selected={startDate}
                            onChange={date => setStartDate(date)}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            minDate={new Date()}
                            className="form-control"
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="endDate">
                          <Form.Label>Check-out Date</Form.Label>
                          <DatePicker
                            selected={endDate}
                            onChange={date => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            className="form-control"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="timeSlot">
                          <Form.Label>Preferred Time Slot</Form.Label>
                          <Form.Select 
                            value={selectedTimeSlot}
                            onChange={(e) => setSelectedTimeSlot(e.target.value)}
                            required
                          >
                            <option value="">Select a time slot</option>
                            {['8:00 am', '9:30 am', '10:30 am', '12:30 pm',
                              '14:10 pm', '15:20 pm', '16:00 pm', '16:30 pm',
                              '17:50 pm', '18:00 pm', '18:30 pm', '20:00 pm',
                              '21:45 pm', '22:00 pm'].map((slot, index) => (
                              <option key={index} value={slot}>{slot}</option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            Please select a time slot.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="roomType">
                          <Form.Label>Room Type</Form.Label>
                          <Form.Select 
                            value={selectedRoom}
                            onChange={(e) => setSelectedRoom(e.target.value)}
                            required
                          >
                            <option value="standard">Standard Suite - $35/night</option>
                            <option value="deluxe">Deluxe Suite - $50/night</option>
                            <option value="luxury">Luxury Suite - $75/night</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <h4 className="mt-4 mb-3">Additional Services</h4>
                    <Row className="mb-3">
                      <Col md={12}>
                        <Form.Group>
                          <Form.Check 
                            type="checkbox" 
                            id="basicGrooming" 
                            label="Basic Grooming - $25" 
                            value="basicGrooming"
                            onChange={handleAdditionalServiceChange}
                          />
                          <Form.Check 
                            type="checkbox" 
                            id="fullGrooming" 
                            label="Full Grooming - $45" 
                            value="fullGrooming"
                            onChange={handleAdditionalServiceChange}
                          />
                          <Form.Check 
                            type="checkbox" 
                            id="specialDiet" 
                            label="Special Diet - $10/day" 
                            value="specialDiet"
                            onChange={handleAdditionalServiceChange}
                          />
                          <Form.Check 
                            type="checkbox" 
                            id="extraPlaytime" 
                            label="Extra Playtime - $15" 
                            value="extraPlaytime"
                            onChange={handleAdditionalServiceChange}
                          />
                          <Form.Check 
                            type="checkbox" 
                            id="training" 
                            label="Training Session - $30" 
                            value="training"
                            onChange={handleAdditionalServiceChange}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row className="mb-3">
                      <Col md={12}>
                        <Form.Group controlId="specialRequirements">
                          <Form.Label>Special Requirements</Form.Label>
                          <Form.Control 
                            as="textarea" 
                            rows={3} 
                            placeholder="e.g., Dietary restrictions, medications, favorite toys, or special care instructions" 
                            value={specialRequirements}
                            onChange={(e) => setSpecialRequirements(e.target.value)}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Button type="submit" className="submit-btn mt-4">
                      Complete Booking
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="booking-summary-card">
                <Card.Body className="p-4">
                  <h3 className="mb-4">Booking Summary</h3>
                  
                  <div className="summary-item">
                    <span className="summary-label">Check-in:</span>
                    <span className="summary-value">{formatDate(startDate)}</span>
                  </div>
                  
                  <div className="summary-item">
                    <span className="summary-label">Check-out:</span>
                    <span className="summary-value">{formatDate(endDate)}</span>
                  </div>
                  
                  <div className="summary-item">
                    <span className="summary-label">Duration:</span>
                    <span className="summary-value">{nights} {nights === 1 ? 'night' : 'nights'}</span>
                  </div>
                  
                  <div className="summary-item">
                    <span className="summary-label">Room Type:</span>
                    <span className="summary-value">{selectedRoom.charAt(0).toUpperCase() + selectedRoom.slice(1)} Suite</span>
                  </div>
                  
                  <div className="summary-item">
                    <span className="summary-label">Room Cost:</span>
                    <span className="summary-value">${roomCost}</span>
                  </div>
                  
                  {additionalCost > 0 && (
                    <div className="summary-item">
                      <span className="summary-label">Additional Services:</span>
                      <span className="summary-value">${additionalCost}</span>
                    </div>
                  )}
                  
                  <div className="summary-item total-row">
                    <span className="summary-label">Total:</span>
                    <span className="summary-value">${totalCost}</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Booking;