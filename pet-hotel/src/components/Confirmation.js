import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEdit, faQuestion, faCalendarAlt, faPaw, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../config';
import './ReservationStyles.css';
import './ReservationNew.css';
import DatePickerModal from './DatePickerModal';
import { useBookings } from '../context/BookingContext';

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
  
  // Get booking context functions
  const { addBooking } = useBookings();
  
  const handleConfirm = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Prepare booking data for submission
      const bookingPayload = {
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
        selectedRoom: bookingData.selectedRoom || 'standard',
        timeSlot: bookingData.scheduledDateTime.split(' | ')[1] || '8:00 am', // Extract time part and provide default
        additionalServices: [bookingData.services],
        specialRequirements: bookingData.additionalInfo || '',
        totalCost: bookingData.totalCost || calculateTotalCost(), // Calculate based on selected services
        status: 'pending', // Default status for new bookings
        serviceType: serviceType, // Add service type (grooming or overnight)
        selectedServiceType: bookingData.selectedServiceType || null, // Add specific grooming service type if available
        selectedSize: bookingData.selectedSize || null // Add pet size category if specified
      };
      
      // Function to calculate total cost based on selected services
      function calculateTotalCost() {
        let baseCost = 50;
        
        // Adjust cost based on room type
        if (bookingData.selectedRoom === 'deluxe') {
          baseCost = 75;
        } else if (bookingData.selectedRoom === 'luxury') {
          baseCost = 100;
        }
        
        // Adjust cost based on pet size if available
        if (bookingData.selectedSize === 'medium') {
          baseCost += 10;
        } else if (bookingData.selectedSize === 'large') {
          baseCost += 20;
        } else if (bookingData.selectedSize === 'extra-large') {
          baseCost += 30;
        }
        
        return baseCost;
      }
      
      // Use the BookingContext to add the booking
      // This will handle both API and localStorage storage
      const result = await addBooking(bookingPayload);
      
      if (result.success) {
        // Try to send email notification if we have an email
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
                text: `Dear ${bookingData.ownerDetails.name},\n\nThank you for booking with Baguio Pet Boarding!\n\nBooking Details:\nPet Name: ${bookingData.petDetails.name}\nScheduled Date/Time: ${bookingData.scheduledDateTime}\nService: ${bookingData.services}\n\nYour booking is currently pending approval. We will notify you once it's confirmed.\n\nIf you have any questions, please contact us.\n\nBest regards,\nBaguio Pet Boarding Team`
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
        
        // Simulate a short delay to make it feel like processing is happening
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Set success state
        setSubmitSuccess(true);
      } else {
        throw new Error(result.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitError(error.message || 'There was an error processing your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="step-circle completed">
            <FontAwesomeIcon icon={faInfoCircle} />
          </div>
          <div className="step-text">Reservation Details</div>
        </div>
        <div className="step">
          <div className="step-circle active">
            <FontAwesomeIcon icon={faCheck} />
          </div>
          <div className="step-text active">Confirmation</div>
        </div>
      </div>
      
      {/* Header Section */}
      <div style={{ backgroundColor: '#ff9800', padding: '20px 0', textAlign: 'center', color: 'white' }}>
        <Container>
          <h2>Booking Confirmation</h2>
          <p>Please review your booking details</p>
        </Container>
      </div>

      {/* Confirmation Content */}
      <div style={{ padding: '20px 0 40px', backgroundColor: 'white' }}>
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
              
              <Card className="mb-4" style={{ borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', border: 'none' }}>
                <div style={{ backgroundColor: '#ff9800', padding: '10px 20px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h5 className="mb-0" style={{ color: 'white' }}>Pet's Details</h5>
                  <Button 
                    variant="outline-light" 
                    size="sm"
                    onClick={() => handleEdit('pet')}
                    className="edit-btn"
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                    Edit
                  </Button>
                </div>
                
                <div className="p-4">
                  <table style={{ width: '100%' }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '8px 0', width: '50%' }}>
                          <strong>Name:</strong>
                          <div>{bookingData.petDetails.name}</div>
                        </td>
                        <td style={{ padding: '8px 0', width: '50%' }}>
                          <strong>Type:</strong>
                          <div>{bookingData.petDetails.type}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 0' }}>
                          <strong>Breed:</strong>
                          <div>{bookingData.petDetails.breed}</div>
                        </td>
                        <td style={{ padding: '8px 0' }}>
                          <strong>Sex:</strong>
                          <div>{bookingData.petDetails.sex}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 0' }}>
                          <strong>Age:</strong>
                          <div>{bookingData.petDetails.age}</div>
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
              
              <Card className="mb-4" style={{ borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', border: 'none' }}>
                <div style={{ backgroundColor: '#ff9800', padding: '10px 20px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h5 className="mb-0" style={{ color: 'white' }}>Owner's Details</h5>
                  <Button 
                    variant="outline-light" 
                    size="sm"
                    onClick={() => handleEdit('owner')}
                    className="edit-btn"
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                    Edit
                  </Button>
                </div>
                
                <div className="p-4">
                  <table style={{ width: '100%' }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '8px 0', width: '50%' }}>
                          <strong>Name:</strong>
                          <div>{bookingData.ownerDetails.name}</div>
                        </td>
                        <td style={{ padding: '8px 0', width: '50%' }}>
                          <strong>Email Address:</strong>
                          <div>{bookingData.ownerDetails.email}</div>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 0' }}>
                          <strong>Mobile Number:</strong>
                          <div>{bookingData.ownerDetails.phone}</div>
                        </td>
                        <td style={{ padding: '8px 0' }}>
                          <strong>Complete Address:</strong>
                          <div>{bookingData.ownerDetails.address}</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
              
              <Card className="mb-4" style={{ borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', border: 'none' }}>
                <div style={{ backgroundColor: '#ff9800', padding: '10px 20px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h5 className="mb-0" style={{ color: 'white' }}>Booking Details</h5>
                  <Button 
                    variant="outline-light" 
                    size="sm"
                    onClick={() => handleEdit('booking')}
                    className="edit-btn"
                  >
                    <FontAwesomeIcon icon={faEdit} className="me-1" />
                    Edit
                  </Button>
                </div>
                <div className="p-4">
                  <table style={{ width: '100%' }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '8px 0', width: '50%' }}>
                          <strong>Scheduled Date and Time:</strong>
                          <div>{bookingData.scheduledDateTime}</div>
                        </td>
                        <td style={{ padding: '8px 0', width: '50%' }}>
                          <strong>Services:</strong>
                          <div>{bookingData.services}</div>
                        </td>
                      </tr>
                      {bookingData.selectedRoom && (
                        <tr>
                          <td style={{ padding: '8px 0' }}>
                            <strong>Room Type:</strong>
                            <div>{bookingData.selectedRoom}</div>
                          </td>
                          {bookingData.selectedSize && (
                            <td style={{ padding: '8px 0' }}>
                              <strong>Size Category:</strong>
                              <div>{bookingData.selectedSize}</div>
                            </td>
                          )}
                        </tr>
                      )}
                      {bookingData.additionalInfo && (
                        <tr>
                          <td colSpan="2" style={{ padding: '8px 0' }}>
                            <strong>Additional Information:</strong>
                            <div>{bookingData.additionalInfo}</div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
              
              <div className="text-center">
                <Button 
                  variant="success" 
                  className="px-5 py-2"
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  style={{ backgroundColor: '#4CAF50', borderColor: '#4CAF50', borderRadius: '4px', fontWeight: 'normal', marginTop: '10px' }}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Reservation'}
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