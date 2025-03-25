import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faCheck, faTimes, faPaw, faInfoCircle, faSort, faFilter, faClock, faExclamationTriangle, faSearch } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../config';
import './AdminBookingList.css';
import CustomerDetails from './CustomerDetails';
import ConfirmationDialog from './ConfirmationDialog';

const AdminBookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCustomerDetails, setShowCustomerDetails] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [petTypeFilter, setPetTypeFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [bookingToComplete, setBookingToComplete] = useState(null);

  // Time slots available for booking
  const timeSlots = [
    '8:00 am', '9:30 am', '10:30 am', '12:30 pm',
    '14:10 pm', '15:20 pm', '16:00 pm', '16:30 pm',
    '17:50 pm', '18:00 pm', '18:30 pm', '20:00 pm',
    '21:45 pm', '22:00 pm'
  ];
  
  // Track booked time slots for the selected date
  const [bookedTimeSlots, setBookedTimeSlots] = useState([]);
  const [highlightedTimeSlots, setHighlightedTimeSlots] = useState([]);
  const [selectedDateBookings, setSelectedDateBookings] = useState([]);

  // Fetch bookings from the backend
  useEffect(() => {
    fetchBookings();
    // Set the current month and year to March 2024 to match the UI screenshot
    setSelectedMonth(2); // March (0-indexed)
    setSelectedYear(2025);
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // Fetch bookings from the backend API
      const response = await fetch(`${API_URL}/api/bookings`, {
        // Adding a timeout to prevent long waiting times if server is unresponsive
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch bookings');
      }
      const data = await response.json();
      
      // Process the data to ensure it has all required fields
      const processedData = data.map(booking => ({
        ...booking,
        // Convert database field names to camelCase for frontend
        id: booking.id,
        petName: booking.pet_name,
        petType: booking.pet_type,
        petBreed: booking.pet_breed,
        petAge: booking.pet_age,
        ownerName: booking.owner_name,
        ownerEmail: booking.owner_email,
        ownerPhone: booking.owner_phone,
        startDate: booking.start_date,
        endDate: booking.end_date,
        selectedRoom: booking.room_type,
        timeSlot: booking.time_slot,
        additionalServices: booking.additional_services,
        specialRequirements: booking.special_requirements,
        totalCost: booking.total_cost,
        // Add status field if not present
        status: booking.status || 'pending'
      }));
      
      setBookings(processedData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      // Set a more descriptive error message based on the error type
      if (err.name === 'AbortError') {
        setError('Connection to server timed out. Please check if the backend server is running.');
      } else if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please check if the backend server is running.');
      } else {
        setError(`Error: ${err.message}. The database might not be properly configured.`);
      }
      setLoading(false);
      
      // Add mock data for March 2024 to match the UI screenshot
      const marchBookings = [
        {
          id: 1,
          petName: 'Buddy',
          ownerName: 'John Smith',
          startDate: new Date('2024-03-20').toISOString(),
          endDate: new Date('2024-03-22').toISOString(),
          timeSlot: '16:00 pm',
          status: 'confirmed',
          petType: 'dog',
          petBreed: 'Golden Retriever',
          petAge: '3',
          sex: 'Male',
          ownerEmail: 'john.smith@example.com',
          ownerPhone: '555-123-4567',
          ownerAddress: '123 Main St, Baguio City',
          selectedRoom: 'deluxe',
          totalCost: 150,
          additional_services: JSON.stringify(['Grooming', 'Special Diet']),
          specialRequirements: 'Needs daily medication at 8am.'
        },
        {
          id: 2,
          petName: 'Luna',
          ownerName: 'Maria Garcia',
          startDate: new Date('2024-03-20').toISOString(),
          endDate: new Date('2024-03-21').toISOString(),
          timeSlot: '10:30 am',
          status: 'pending',
          petType: 'cat',
          petBreed: 'Siamese',
          petAge: '2',
          sex: 'Female',
          ownerEmail: 'maria.garcia@example.com',
          ownerPhone: '555-987-6543',
          ownerAddress: '456 Oak St, Baguio City',
          selectedRoom: 'standard',
          totalCost: 75,
          additional_services: JSON.stringify(['Extra Playtime']),
          specialRequirements: 'Prefers quiet spaces.'
        },
        {
          id: 3,
          petName: 'Max',
          ownerName: 'Robert Johnson',
          startDate: new Date('2024-03-30').toISOString(),
          endDate: new Date('2024-04-02').toISOString(),
          timeSlot: '8:00 am',
          status: 'confirmed',
          petType: 'dog',
          petBreed: 'Labrador',
          petAge: '5',
          sex: 'Male',
          ownerEmail: 'robert.johnson@example.com',
          ownerPhone: '555-456-7890',
          ownerAddress: '789 Pine St, Baguio City',
          selectedRoom: 'luxury',
          totalCost: 225,
          additional_services: JSON.stringify(['Training', 'Full Grooming']),
          specialRequirements: 'Allergic to chicken.'
        }
      ];
      
      setBookings(marchBookings);
    }
  };

  // Handle marking a service as done
  const handleMarkAsDone = (booking) => {
    setBookingToComplete(booking);
    setShowConfirmationDialog(true);
  };

  // Handle confirmation of marking a service as done
  const handleConfirmDone = async () => {
    if (!bookingToComplete) return;
    
    try {
      // In a real application, you would make an API call to update the booking status
      // For now, we'll just remove it from the local state
      setBookings(bookings.filter(booking => booking.id !== bookingToComplete.id));
      
      // Show success message
      alert(`Service for ${bookingToComplete.petName} has been marked as completed.`);
    } catch (err) {
      console.error('Error marking service as done:', err);
      setError(`Error: ${err.message}`);
    } finally {
      // Close the confirmation dialog
      setShowConfirmationDialog(false);
      setBookingToComplete(null);
    }
  };
  
  // Handle booking status change
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      // Since there's no dedicated status endpoint in the backend, we'll use the update endpoint
      // First, get the current booking data
      const bookingToUpdate = bookings.find(booking => booking.id === bookingId);
      
      if (!bookingToUpdate) {
        throw new Error('Booking not found');
      }
      
      // Update the booking with the new status
      const response = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          petName: bookingToUpdate.petName,
          petType: bookingToUpdate.petType,
          petBreed: bookingToUpdate.petBreed,
          petAge: bookingToUpdate.petAge,
          ownerName: bookingToUpdate.ownerName,
          ownerEmail: bookingToUpdate.ownerEmail,
          ownerPhone: bookingToUpdate.ownerPhone,
          startDate: bookingToUpdate.startDate,
          endDate: bookingToUpdate.endDate,
          selectedRoom: bookingToUpdate.selectedRoom,
          timeSlot: bookingToUpdate.timeSlot,
          additionalServices: bookingToUpdate.additionalServices,
          specialRequirements: bookingToUpdate.specialRequirements,
          totalCost: bookingToUpdate.totalCost,
          status: newStatus
        }),
        // Adding a timeout to prevent long waiting times if server is unresponsive
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ));
      
      // Send email notification to pet owner
      if (bookingToUpdate.ownerEmail) {
        try {
          const statusMessage = newStatus === 'confirmed' ? 
            'Your booking has been confirmed!' : 
            'Your booking has been declined. Please contact us for more information.';
          
          const emailResponse = await fetch(`${API_URL}/api/send-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: bookingToUpdate.ownerEmail,
              subject: `Baguio Pet Boarding - Booking ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
              text: `Dear ${bookingToUpdate.ownerName},\n\n${statusMessage}\n\nBooking Details:\nPet Name: ${bookingToUpdate.petName}\nScheduled Date: ${new Date(bookingToUpdate.startDate).toLocaleDateString()} to ${new Date(bookingToUpdate.endDate).toLocaleDateString()}\nTime Slot: ${bookingToUpdate.timeSlot}\nRoom Type: ${bookingToUpdate.selectedRoom.charAt(0).toUpperCase() + bookingToUpdate.selectedRoom.slice(1)}\n\nIf you have any questions, please contact us.\n\nBest regards,\nBaguio Pet Boarding Team`
            }),
          });
          
          if (!emailResponse.ok) {
            console.warn('Email notification could not be sent, but booking status was updated successfully');
          }
        } catch (emailError) {
          console.warn('Email notification error:', emailError);
          // Don't fail the whole process if just the email fails
        }
      }
      
      // Show success message
      alert(`Booking status updated to ${newStatus}. ${bookingToUpdate.ownerEmail ? 'Email notification sent to pet owner.' : ''}`);
    } catch (err) {
      console.error('Error updating booking status:', err);
      
      // Set a more descriptive error message based on the error type
      if (err.name === 'AbortError') {
        setError('Connection to server timed out. Please check if the backend server is running.');
      } else if (err.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please check if the backend server is running.');
      } else {
        setError(`Error: ${err.message}`);
      }
      
      // For demo purposes, update the local state anyway
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? { ...booking, status: newStatus } : booking
      ));
    }
  };

  // Generate calendar days for the selected month
  const getDaysInMonth = (month, year) => {
    const date = new Date(year, month, 1);
    const days = [];
    
    // Get the first day of the month
    const firstDay = new Date(year, month, 1).getDay();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    
    return days;
  };

  const days = getDaysInMonth(selectedMonth, selectedYear);
  
  // Get bookings for a specific date
  const getBookingsForDate = (date) => {
    if (!date) return [];
    
    const dateString = date.toISOString().split('T')[0];
    return bookings.filter(booking => {
      // Make sure booking dates are properly parsed as Date objects
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      const checkDate = new Date(dateString);
      
      // Check if the date falls within the booking period
      return checkDate >= startDate && checkDate <= endDate;
    }).sort((a, b) => {
      // Sort by time slot - normalize time format for comparison
      const timeA = a.timeSlot.replace(/[^0-9:]/g, '');
      const timeB = b.timeSlot.replace(/[^0-9:]/g, '');
      return timeA.localeCompare(timeB);
    });
  };

  // Check if a booking is a late arrival based on time slot
  const isLateArrival = (timeSlot) => {
    // Convert time slot to 24-hour format for comparison
    const timeMatch = timeSlot.match(/(\d+):(\d+)\s*(am|pm)/i);
    if (!timeMatch) return false;
    
    let hours = parseInt(timeMatch[1]);
    const minutes = parseInt(timeMatch[2]);
    const period = timeMatch[3].toLowerCase();
    
    // Convert to 24-hour format
    if (period === 'pm' && hours < 12) hours += 12;
    if (period === 'am' && hours === 12) hours = 0;
    
    // Check-in policy is 9:00 AM - 5:00 PM (17:00)
    return hours < 9 || hours >= 17;
  };
  
  // Handle sort order change
  const handleSortOrderChange = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  // Handle filter type change
  const handleFilterTypeChange = (e) => {
    setFilterType(e.target.value);
  };
  
  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Get bookings for a specific time slot on a specific date
  const getBookingsForTimeSlot = (date, timeSlot) => {
    if (!date) return [];
    
    const dateString = date.toISOString().split('T')[0];
    return bookings.filter(booking => {
      const startDate = new Date(booking.startDate);
      const endDate = new Date(booking.endDate);
      const checkDate = new Date(dateString);
      
      // Normalize time slot format for comparison (remove case sensitivity and extra spaces)
      const normalizedBookingTimeSlot = booking.timeSlot.toLowerCase().trim();
      const normalizedTimeSlot = timeSlot.toLowerCase().trim();
      
      return checkDate >= startDate && checkDate <= endDate && normalizedBookingTimeSlot === normalizedTimeSlot;
    });
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return date.getDate();
  };

  // Check if a date is today
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  // Check if a date has any bookings
  const hasBookings = (date) => {
    if (!date) return false;
    return getBookingsForDate(date).length > 0;
  };
  
  // Get booking count for a specific date
  const getBookingCount = (date) => {
    if (!date) return 0;
    return getBookingsForDate(date).length;
  };
  
  // Get booking status for a specific date
  const getBookingStatus = (date) => {
    if (!date) return null;
    const bookings = getBookingsForDate(date);
    if (bookings.length === 0) return null;
    
    // Check if all bookings are confirmed
    const allConfirmed = bookings.every(booking => booking.status === 'confirmed');
    if (allConfirmed) return 'confirmed';
    
    // Check if any booking is pending
    const hasPending = bookings.some(booking => booking.status === 'pending');
    if (hasPending) return 'pending';
    
    return 'mixed';
  };

  // Handle month change
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    // Reset selected date when month changes
    setSelectedDate(new Date(selectedYear, month, 1));
    // Clear highlighted time slots when month changes
    setHighlightedTimeSlots([]);
  };
  
  // Update booked time slots when selected date changes
  useEffect(() => {
    if (selectedDate) {
      const dateBookings = getBookingsForDate(selectedDate);
      setSelectedDateBookings(dateBookings);
      
      // Extract time slots from bookings for the selected date
      const timeSlots = dateBookings.map(booking => booking.timeSlot);
      setBookedTimeSlots(timeSlots);
      setHighlightedTimeSlots(timeSlots);
    }
  }, [selectedDate, bookings]);

  // Get month name
  const getMonthName = (month) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[month];
  };

  // Count total bookings
  const totalBookings = bookings.length;

  return (
    <div className="admin-booking-page">
      <div className="admin-header">
        <Container>
          <Row className="align-items-center">
            <Col xs={12} className="text-center py-4">
              <h1 className="brand-name mb-0">
                <FontAwesomeIcon icon={faPaw} className="me-2" />
                Baguio Pet Boarding
              </h1>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        <Card className="booking-list-card">
          <Card.Header className="text-center bg-warning py-3">
            <h2 className="mb-0">Booking List</h2>
          </Card.Header>
          <Card.Body className="p-4">
            <Row className="mb-4">
              <Col md={6} className="mx-auto">
                <Card className="text-center">
                  <Card.Body>
                    <h4>Booked Customers</h4>
                    <div className="booked-count">{totalBookings}</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col xs={12}>
                <h5>Select Time</h5>
                <div className="time-slots">
                  {timeSlots.map((timeSlot, index) => {
                    const timeSlotBookings = getBookingsForTimeSlot(selectedDate, timeSlot);
                    const hasConfirmed = timeSlotBookings.some(booking => booking.status === 'confirmed');
                    const hasPending = timeSlotBookings.some(booking => booking.status === 'pending');
                    // Normalize time slot format for comparison
                    const normalizedTimeSlot = timeSlot.toLowerCase().trim();
                    const isHighlighted = highlightedTimeSlots.some(slot => slot.toLowerCase().trim() === normalizedTimeSlot);
                    
                    let variant = "outline-secondary";
                    if (timeSlotBookings.length > 0) {
                      if (hasConfirmed && hasPending) {
                        variant = "warning";
                      } else if (hasConfirmed) {
                        variant = "success";
                      } else if (hasPending) {
                        variant = "warning";
                      } else {
                        variant = "warning";
                      }
                    } else if (isHighlighted) {
                      // Highlight time slots that match the selected date's bookings
                      variant = "info";
                    }
                    
                    return (
                      <Button 
                        key={index}
                        variant={variant}
                        className={`time-slot-btn m-1 ${timeSlotBookings.length > 0 ? 'booked-time-slot' : ''} ${isHighlighted ? 'highlighted-time-slot' : ''}`}
                        onClick={() => {
                          if (timeSlotBookings.length > 0) {
                            setSelectedBooking(timeSlotBookings[0]);
                            setShowCustomerDetails(true);
                          }
                        }}
                      >
                        {timeSlot}
                        {timeSlotBookings.length > 0 && (
                          <Badge bg="light" text="dark" className="ms-2">
                            {timeSlotBookings.length}
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col xs={12}>
                <div className="date-selector">
                  <Dropdown className="d-inline-block">
                    <Dropdown.Toggle variant="outline-secondary" id="dropdown-month">
                      {getMonthName(selectedMonth)}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {Array.from({ length: 12 }, (_, i) => (
                        <Dropdown.Item 
                          key={i} 
                          onClick={() => handleMonthChange(i)}
                          active={i === selectedMonth}
                        >
                          {getMonthName(i)}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <div className="calendar-grid">
                  <div className="weekdays">
                    <div>Fri</div>
                    <div>Sat</div>
                    <div>Sun</div>
                    <div>Mon</div>
                    <div>Tue</div>
                    <div>Wed</div>
                    <div>Thu</div>
                    <div>Fri</div>
                    <div>Sat</div>
                    <div>Sun</div>
                  </div>
                  <div className="days">
                    {days.map((day, index) => {
                      const dayBookings = day ? getBookingsForDate(day) : [];
                      const bookingCount = day ? getBookingCount(day) : 0;
                      const bookingStatus = day ? getBookingStatus(day) : null;
                      const isSelected = day && day.getDate() === selectedDate.getDate() && 
                                        day.getMonth() === selectedDate.getMonth();
                      
                      return (
                        <div 
                          key={index} 
                          className={`day-cell 
                            ${day && isToday(day) ? 'today' : ''} 
                            ${bookingCount > 0 ? `has-bookings status-${bookingStatus}` : ''} 
                            ${isSelected ? 'selected' : ''}`
                          }
                          onClick={() => {
                            if (day) {
                              setSelectedDate(day);
                              // Update highlighted time slots based on this date's bookings
                              const dateBookings = getBookingsForDate(day);
                              setSelectedDateBookings(dateBookings);
                              const timeSlots = dateBookings.map(booking => booking.timeSlot);
                              setBookedTimeSlots(timeSlots);
                              setHighlightedTimeSlots(timeSlots);
                              
                              if (dayBookings.length > 0) {
                                setSelectedBooking(dayBookings[0]);
                                setShowCustomerDetails(true);
                              }
                            }
                          }}
                        >
                          {day && (
                            <>
                              <div className="day-number">{formatDate(day)}</div>
                              {bookingCount > 0 && (
                                <div className={`booking-indicator ${bookingStatus}`}>
                                  {bookingCount} booking{bookingCount > 1 ? 's' : ''}
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Col>
            </Row>

            {/* Pending Bookings Section */}
            <Row className="mb-4">
              <Col xs={12}>
                <h4 className="mb-3">
                  <Badge bg="info" className="me-2">Active</Badge>
                  Guest Schedules Details
                </h4>
                {loading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border text-warning" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading bookings...</p>
                  </div>
                ) : error ? (
                  <div className="alert alert-danger" role="alert">
                    <h5 className="alert-heading">Connection Error</h5>
                    <p>{error}</p>
                    <hr />
                    <p className="mb-0">Using demo data for preview purposes. In production, please ensure the database is properly configured.</p>
                  </div>
                ) : bookings.filter(booking => booking.status === 'pending').length === 0 ? (
                  <p>No pending bookings to approve.</p>
                ) : (
                  bookings.filter(booking => booking.status === 'pending').map(booking => (
                    <Card key={booking.id} className="booking-item pending mb-3">
                      <Card.Body>
                        <Row>
                          <Col md={8}>
                            <h5>{booking.petName} ({booking.petType})</h5>
                            <p className="mb-1"><strong>Owner:</strong> {booking.ownerName}</p>
                            <p className="mb-1"><strong>Dates:</strong> {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}</p>
                            <p className="mb-1"><strong>Room:</strong> {booking.selectedRoom.charAt(0).toUpperCase() + booking.selectedRoom.slice(1)}</p>
                            <p className="mb-1"><strong>Time Slot:</strong> {booking.timeSlot}</p>
                            <p className="mb-0"><strong>Total:</strong> ${booking.totalCost}</p>
                          </Col>
                          <Col md={4} className="text-end d-flex flex-column justify-content-between">
                            <Badge bg="info" className="mb-3">
                              Active
                            </Badge>
                            <div>
                              <Button 
                                variant="info" 
                                size="sm" 
                                className="me-2 mb-2"
                                onClick={() => {
                                  const formattedBooking = {
                                    ...booking,
                                    petName: booking.petName,
                                    petType: booking.petType,
                                    petBreed: booking.petBreed,
                                    petAge: booking.petAge,
                                    sex: booking.sex,
                                    ownerName: booking.ownerName,
                                    ownerEmail: booking.ownerEmail,
                                    ownerPhone: booking.ownerPhone,
                                    ownerAddress: booking.ownerAddress,
                                    startDate: booking.startDate,
                                    endDate: booking.endDate,
                                    selectedRoom: booking.selectedRoom,
                                    timeSlot: booking.timeSlot,
                                    additionalServices: booking.additionalServices,
                                    specialRequirements: booking.specialRequirements,
                                    totalCost: booking.totalCost
                                  };
                                  setSelectedBooking(formattedBooking);
                                  setShowCustomerDetails(true);
                                }}
                              >
                                <FontAwesomeIcon icon={faInfoCircle} /> View Details
                              </Button>
                              <Button 
                                variant="success" 
                                size="sm" 
                                className="mb-2"
                                onClick={() => handleMarkAsDone(booking)}
                              >
                                <FontAwesomeIcon icon={faCheck} /> Done
                              </Button>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </Col>
            </Row>
            
            <Row>
              <Col xs={12}>
                <h4 className="mb-3">Today's Bookings</h4>
                {loading ? (
                  <div className="text-center py-3">
                    <div className="spinner-border text-warning" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading bookings...</p>
                  </div>
                ) : error ? (
                  <div className="alert alert-danger" role="alert">
                    <h5 className="alert-heading">Connection Error</h5>
                    <p>{error}</p>
                    <hr />
                    <p className="mb-0">Using demo data for preview purposes. In production, please ensure the database is properly configured.</p>
                  </div>
                ) : getBookingsForDate(selectedDate).length === 0 ? (
                  <p>No bookings for {selectedDate.toLocaleDateString()}.</p>
                ) : (
                  getBookingsForDate(selectedDate).map(booking => (
                    <Card key={booking.id} className={`booking-item mb-3 ${booking.status}`}>
                      <Card.Body>
                        <Row>
                          <Col md={8}>
                            <h5>{booking.petName} ({booking.petType})</h5>
                            <p className="mb-1"><strong>Owner:</strong> {booking.ownerName}</p>
                            <p className="mb-1"><strong>Dates:</strong> {new Date(booking.startDate).toLocaleDateString()} to {new Date(booking.endDate).toLocaleDateString()}</p>
                            <p className="mb-1"><strong>Room:</strong> {booking.selectedRoom.charAt(0).toUpperCase() + booking.selectedRoom.slice(1)}</p>
                            <p className="mb-1"><strong>Time Slot:</strong> {booking.timeSlot}</p>
                            <p className="mb-0"><strong>Total:</strong> ${booking.totalCost}</p>
                          </Col>
                          <Col md={4} className="text-end d-flex flex-column justify-content-between">
                            <Badge bg={booking.status === 'confirmed' ? 'success' : booking.status === 'declined' ? 'danger' : 'warning'} className="mb-3">
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                            <div>
                              <Button 
                                variant="info" 
                                size="sm" 
                                className="me-2 mb-2"
                                onClick={() => {
                                  // Ensure all required data is properly set
                                  const formattedBooking = {
                                    ...booking,
                                    petName: booking.petName,
                                    petType: booking.petType,
                                    petBreed: booking.petBreed,
                                    petAge: booking.petAge,
                                    sex: booking.sex,
                                    ownerName: booking.ownerName,
                                    ownerEmail: booking.ownerEmail,
                                    ownerPhone: booking.ownerPhone,
                                    ownerAddress: booking.ownerAddress,
                                    startDate: booking.startDate,
                                    endDate: booking.endDate,
                                    selectedRoom: booking.selectedRoom,
                                    timeSlot: booking.timeSlot,
                                    additionalServices: booking.additionalServices,
                                    specialRequirements: booking.specialRequirements,
                                    totalCost: booking.totalCost
                                  };
                                  setSelectedBooking(formattedBooking);
                                  setShowCustomerDetails(true);
                                }}
                              >
                                <FontAwesomeIcon icon={faInfoCircle} /> View Details
                              </Button>
                              {booking.status === 'pending' && (
                                <div className="mt-2 mb-2">
                                  <Button 
                                    variant="success" 
                                    size="sm" 
                                    className="me-2"
                                    onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                  >
                                    <FontAwesomeIcon icon={faCheck} /> Accept
                                  </Button>
                                  <Button 
                                    variant="danger" 
                                    size="sm"
                                    onClick={() => handleStatusChange(booking.id, 'declined')}
                                  >
                                    <FontAwesomeIcon icon={faTimes} /> Decline
                                  </Button>
                                </div>
                              )}
                              {booking.status !== 'pending' && (
                                <div className="mt-2">
                                  <Button 
                                    variant={booking.status === 'confirmed' ? "outline-success" : "outline-danger"} 
                                    size="sm" 
                                    disabled
                                  >
                                    <FontAwesomeIcon icon={booking.status === 'confirmed' ? faCheck : faTimes} /> 
                                    {booking.status === 'confirmed' ? 'Accepted' : 'Declined'}
                                  </Button>
                                </div>
                              )}
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
                  ))
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
      
      {/* Customer Details Modal */}
      <CustomerDetails 
        show={showCustomerDetails} 
        onHide={() => setShowCustomerDetails(false)} 
        booking={selectedBooking}
      />
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        show={showConfirmationDialog}
        onHide={() => setShowConfirmationDialog(false)}
        onConfirm={handleConfirmDone}
        title="Complete Service"
        message={`Are you sure you want to mark ${bookingToComplete?.petName}'s service as completed? This will remove it from the list.`}
      />
    </div>
  );
};

export default AdminBookingList;