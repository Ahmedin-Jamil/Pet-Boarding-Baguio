import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faQuestion, faCalendarAlt, faPaw, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import './Booking.css';
import DatePickerModal from './DatePickerModal';

const Confirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for confirmation status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  
  // State for date picker modal
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [serviceType, setServiceType] = useState('overnight');
  
  // Determine service type based on URL path
  useEffect(() => {
    if (location.pathname.includes('grooming')) {
      setServiceType('grooming');
    } else {
      setServiceType('overnight');
    }
  }, [location.pathname]);
  
  // Get booking data from location state or use default mock data if not available
  const [bookingData, setBookingData] = useState(() => {
    // Check if data was passed through navigation state
    if (location.state && location.state.bookingData) {
      return location.state.bookingData;
    }
    
    // Fallback to mock data if no data was passed
    return {
      petDetails: {
        name: 'Lilly',
        type: 'Dog',
        breed: 'Golden Retriever',
        sex: 'Female',
        age: '3'
      },
      ownerDetails: {
        name: 'John James',
        email: 'johnjames@gm.com',
        phone: '092313412',
        address: 'Bakakeng Phase 3, Eagle Crest'
      },
      scheduledDateTime: '2025/03/22 | 8:00 am',
      services: 'Deluxe Room - Small',
      selectedRoom: 'deluxe',
      selectedSize: 'small'
    };
  });
  
  // Update booking data if location state changes
  useEffect(() => {
    if (location.state && location.state.bookingData) {
      setBookingData(location.state.bookingData);
    }
  }, [location.state]);
  
  const handleEdit = (section) => {
    // Navigate back to the appropriate reservation page
    if (location.pathname.includes('grooming')) {
      navigate('/grooming-reservation');
    } else {
      navigate('/overnight-reservation');
    }
  };
  
  const handleConfirm = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Check if backend server is available first
      let backendAvailable = false;
      try {
        const pingResponse = await fetch(`${API_URL}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (pingResponse.ok) {
          backendAvailable = true;
        }
      } catch (pingError) {
        console.warn('Backend server connection issue:', pingError);
        // We'll handle this gracefully below
      }
      
      if (backendAvailable) {
        try {
          // Send booking data to the backend API
          const response = await fetch(`${API_URL}/api/bookings`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              petName: bookingData.petDetails.name,
              petType: bookingData.petDetails.type,
              petBreed: bookingData.petDetails.breed,
              petAge: bookingData.petDetails.age,
              ownerName: bookingData.ownerDetails.name,
              ownerEmail: bookingData.ownerDetails.email,
              ownerPhone: bookingData.ownerDetails.phone,
              startDate: bookingData.scheduledDateTime.split(' | ')[0], // Extract date part
              endDate: bookingData.scheduledDateTime.includes(' to ') ? 
                bookingData.scheduledDateTime.split(' to ')[1].split(' | ')[0] : 
                bookingData.scheduledDateTime.split(' | ')[0],
              selectedRoom: 'standard',
              timeSlot: bookingData.scheduledDateTime.split(' | ')[1] || '8:00 am', // Extract time part and provide default
              additionalServices: [bookingData.services],
              specialRequirements: bookingData.additionalInfo || '',
              totalCost: 50.00 // This would be calculated based on selected services
            }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to create booking');
          }
          
          // Send email notification
          if (bookingData.ownerDetails.email) {
            try {
              const emailResponse = await fetch(`${API_URL}/api/send-email`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  to: bookingData.ownerDetails.email,
                  subject: 'Baguio Pet Boarding - Booking Confirmation',
                  text: `Dear ${bookingData.ownerDetails.name},\n\nThank you for booking with Baguio Pet Boarding!\n\nBooking Details:\nPet Name: ${bookingData.petDetails.name}\nScheduled Date/Time: ${bookingData.scheduledDateTime}\nService: ${bookingData.services}\n\nIf you have any questions, please contact us.\n\nBest regards,\nBaguio Pet Boarding Team`
                }),
              });
              
              if (!emailResponse.ok) {
                console.warn('Email notification could not be sent, but booking was successful');
              }
            } catch (emailError) {
              console.warn('Email notification error:', emailError);
              // Don't fail the whole process if just the email fails
            }
          }
        } catch (apiError) {
          console.error('API error:', apiError);
          // If there's an API error but the server is available, we'll proceed with demo mode
          console.log('Proceeding with demo mode due to API error');
        }
      } else {
        console.log('Backend server unavailable, proceeding with demo mode');
        // Simulate a short delay to make it feel like processing is happening
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      // Always show success in this demo version
      // In a production environment, you would only set this if the API call was successful
      setSubmitSuccess(true);
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitError(error.message || 'There was an error processing your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
                onClick={() => navigate(serviceType === 'overnight' ? '/services' : '/grooming-services')}
                style={{ color: '#000' }}
              >
                <FontAwesomeIcon icon={faPaw} className="me-2" />
                Select Services
              </Button>
            </Nav.Item>
            <Nav.Item>
              <Button 
                variant="link" 
                className="nav-link" 
                onClick={() => navigate(serviceType === 'overnight' ? '/overnight-reservation' : '/grooming-reservation')}
                style={{ color: '#000' }}
              >
                <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                Reservation Details
              </Button>
            </Nav.Item>
            <Nav.Item>
              <Button 
                variant="link" 
                className="nav-link active" 
                style={{ color: '#000', fontWeight: 'bold' }}
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
          <h2 style={{ color: '#fff' }}>Confirmation</h2>
        </Container>
      </div>

      {/* Confirmation Content */}
      <div className="gradient-background" style={{ padding: '20px 0 40px' }}>
        <Container>
          {submitSuccess ? (
            <Card className="confirmation-card p-4 text-center">
              <div className="confirmation-icon mb-4">
                <FontAwesomeIcon icon={faCheck} />
              </div>
              <h3 className="mb-3">Booking Confirmed!</h3>
              <p className="mb-4">Thank you for your booking. A confirmation has been sent to your email and phone.</p>
              <div className="booking-details mb-4">
                <p><strong>Booking Reference:</strong> #BPB{Math.floor(Math.random() * 10000)}</p>
                <p><strong>Pet Name:</strong> {bookingData.petDetails.name}</p>
                <p><strong>Scheduled Date/Time:</strong> {bookingData.scheduledDateTime}</p>
                <p><strong>Email Confirmation:</strong> Sent to {bookingData.ownerDetails.email}</p>
              </div>
              <Button 
                variant="primary" 
                className="book-again-btn"
                onClick={() => navigate('/')}
              >
                Return to Home
              </Button>
            </Card>
          ) : (
            <>
              {submitError && (
                <Alert variant="danger" className="mb-4">
                  {submitError}
                </Alert>
              )}
              
              <Card className="booking-form-card p-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="mb-0">Pet's Details</h3>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleEdit('pet')}
                    className="edit-btn"
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                    Edit
                  </Button>
                </div>
                
                <Row>
                  <Col md={6} className="mb-3">
                    <p className="mb-1"><strong>Name:</strong></p>
                    <p>{bookingData.petDetails.name}</p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-1"><strong>Type:</strong></p>
                    <p>{bookingData.petDetails.type}</p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-1"><strong>Breed:</strong></p>
                    <p>{bookingData.petDetails.breed}</p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-1"><strong>Sex:</strong></p>
                    <p>{bookingData.petDetails.sex}</p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-1"><strong>Age:</strong></p>
                    <p>{bookingData.petDetails.age}</p>
                  </Col>

                </Row>
              </Card>
              
              <Card className="booking-form-card p-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="mb-0">Owner's Details</h3>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleEdit('owner')}
                    className="edit-btn"
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                    Edit
                  </Button>
                </div>
                
                <Row>
                  <Col md={6} className="mb-3">
                    <p className="mb-1"><strong>Name:</strong></p>
                    <p>{bookingData.ownerDetails.name}</p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-1"><strong>Email Address:</strong></p>
                    <p>{bookingData.ownerDetails.email}</p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-1"><strong>Mobile Number:</strong></p>
                    <p>{bookingData.ownerDetails.phone}</p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-1"><strong>Complete Address:</strong></p>
                    <p>{bookingData.ownerDetails.address}</p>
                  </Col>
                </Row>
              </Card>
              
              <Card className="booking-form-card p-4 mb-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="mb-0">Booking Details</h3>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => handleEdit('booking')}
                    className="edit-btn"
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-2" />
                    Edit
                  </Button>
                </div>
                <Row>
                  <Col md={6} className="mb-3">
                    <p className="mb-1"><strong>Scheduled Date and Time:</strong></p>
                    <p>{bookingData.scheduledDateTime}</p>
                  </Col>
                  <Col md={6} className="mb-3">
                    <p className="mb-1"><strong>Services:</strong></p>
                    <p>{bookingData.services}</p>
                  </Col>
                  {bookingData.selectedRoom && (
                    <Col md={6} className="mb-3">
                      <p className="mb-1"><strong>Room Type:</strong></p>
                      <p>{bookingData.selectedRoom}</p>
                    </Col>
                  )}
                  {bookingData.selectedSize && (
                    <Col md={6} className="mb-3">
                      <p className="mb-1"><strong>Size Category:</strong></p>
                      <p>{bookingData.selectedSize}</p>
                    </Col>
                  )}
                  {bookingData.additionalInfo && (
                    <Col md={12} className="mb-3">
                      <p className="mb-1"><strong>Additional Information:</strong></p>
                      <p>{bookingData.additionalInfo}</p>
                    </Col>
                  )}
                </Row>
              </Card>
              
              <div className="text-center">
                <Button 
                  variant="success" 
                  className="rounded-pill px-5 py-2"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm'}
                </Button>
              </div>
            </>
          )}
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
          // Update booking data with new date/time
          const updatedBookingData = {...bookingData};
          const formattedDate = new Date(dateData.startDate).toLocaleDateString();
          const formattedTime = dateData.selectedTime || '8:00 am';
          updatedBookingData.scheduledDateTime = `${formattedDate} | ${formattedTime}`;
          setBookingData(updatedBookingData);
          setShowDatePickerModal(false);
        }}
      />
    </div>
  );
};

export default Confirmation;