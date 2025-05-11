import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useBookings } from '../context/BookingContext';

const DatePickerModal = ({ show, onHide, serviceType, onDateSelect }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 3)));
  const [selectedTime, setSelectedTime] = useState(null);
  const [showUnavailableAlert, setShowUnavailableAlert] = useState(false);
  
  // Get unavailable dates and functions from context
  const { unavailableDates, isDateUnavailable, fetchUnavailableDates } = useBookings();
  
  // Reset dates when modal opens and fetch latest unavailable dates
  useEffect(() => {
    if (show) {
      setStartDate(new Date());
      setEndDate(new Date(new Date().setDate(new Date().getDate() + 3)));
      setSelectedTime(null);
      setShowUnavailableAlert(false);
      
      // Fetch the latest unavailable dates when modal opens
      fetchUnavailableDates();
    }
  }, [show, fetchUnavailableDates]);
  
  // Update endDate when startDate changes to ensure endDate is never before startDate
  useEffect(() => {
    if (startDate && endDate && startDate >= endDate) {
      // Set the end date to be at least one day after the start date
      const newEndDate = new Date(startDate);
      newEndDate.setDate(newEndDate.getDate() + 1);
      setEndDate(newEndDate);
    }
  }, [startDate, endDate]);

  // Filter out unavailable dates
  const filterUnavailableDates = (date) => {
    // Check if the date is unavailable - return false to disable the date
    return !isDateUnavailable(date);
  };
  
  // Handle date change with unavailable date check
  const handleStartDateChange = (date) => {
    if (isDateUnavailable(date)) {
      setShowUnavailableAlert(true);
      return;
    }
    
    setShowUnavailableAlert(false);
    setStartDate(date);
  };
  
  // Handle end date change with unavailable date check
  const handleEndDateChange = (date) => {
    if (isDateUnavailable(date)) {
      setShowUnavailableAlert(true);
      return;
    }
    
    setShowUnavailableAlert(false);
    setEndDate(date);
  };
  
  const handleConfirm = () => {
    // Validate that checkout date is not before check-in date
    if (serviceType === 'overnight' && endDate < startDate) {
      // Don't proceed if dates are invalid
      return;
    }
    
    // Check if either date is unavailable
    if (isDateUnavailable(startDate) || (serviceType === 'overnight' && isDateUnavailable(endDate))) {
      setShowUnavailableAlert(true);
      return;
    }
    
    // Pass date and time data back to parent component
    onDateSelect({
      startDate: startDate,
      endDate: serviceType === 'overnight' ? endDate : startDate,
      selectedTime: selectedTime || '09:00',
      serviceType: serviceType
    });
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="date-picker-modal"
      centered
    >
      <Modal.Header closeButton style={{ backgroundColor: '#FFA500', color: 'white' }}>
        <Modal.Title id="date-picker-modal" className="w-100 text-center">
          {serviceType === 'overnight' ? 'Select Check-in and Check-out Dates' : 'Select Grooming Date'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showUnavailableAlert && (
          <Alert variant="danger" className="mb-3">
            The selected date is not available for booking. Please choose another date.
          </Alert>
        )}
        <Row className="mt-4">
          {serviceType === 'overnight' ? (
            <>
              <Col md={6}>
                <div className="date-picker-container">
                  <h5><FontAwesomeIcon icon={faCalendarAlt} className="me-2" />Check-in Date</h5>
                  <DatePicker
                    selected={startDate}
                    onChange={handleStartDateChange}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date()}
                    filterDate={filterUnavailableDates}
                    className="form-control"
                    calendarClassName="calendar-start"
                  />
                </div>
              </Col>
              <Col md={6}>
                <div className="date-picker-container">
                  <h5><FontAwesomeIcon icon={faCalendarAlt} className="me-2" />Check-out Date</h5>
                  <DatePicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    filterDate={filterUnavailableDates}
                    className="form-control"
                    calendarClassName="calendar-end"
                  />
                </div>
              </Col>
            </>
          ) : (
            <Col md={12}>
              <div className="date-picker-container">
                <h5><FontAwesomeIcon icon={faCalendarAlt} className="me-2" />Schedule Date</h5>
                <DatePicker
                  selected={startDate}
                  onChange={handleStartDateChange}
                  minDate={new Date()}
                  filterDate={filterUnavailableDates}
                  className="form-control"
                  calendarClassName="calendar-start"
                />
              </div>
            </Col>
          )}
          
          <Col md={12} className="mt-3">
            <div className="time-picker-container">
              <h5><FontAwesomeIcon icon={faClock} className="me-2" />Select Time</h5>
              <select 
                className="form-control"
                value={selectedTime || ''}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                <option value="">Choose a time...</option>
                <option value="09:00">9:00 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="12:00">12:00 PM</option>
                <option value="13:00">1:00 PM</option>
                <option value="14:00">2:00 PM</option>
                <option value="15:00">3:00 PM</option>
                <option value="16:00">4:00 PM</option>
                <option value="17:00">5:00 PM</option>
              </select>
            </div>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        {serviceType === 'overnight' && endDate < startDate && (
          <div className="text-danger w-100 mb-2">
            <small>Check-out date cannot be earlier than check-in date.</small>
          </div>
        )}
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleConfirm}
          disabled={serviceType === 'overnight' && endDate < startDate}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DatePickerModal;