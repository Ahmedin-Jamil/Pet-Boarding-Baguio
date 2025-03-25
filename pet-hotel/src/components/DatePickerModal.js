import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DatePickerModal = ({ show, onHide, serviceType, onDateSelect }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 3)));
  const [selectedTime, setSelectedTime] = useState(null);
  
  // Reset dates when modal opens
  useEffect(() => {
    if (show) {
      setStartDate(new Date());
      setEndDate(new Date(new Date().setDate(new Date().getDate() + 3)));
      setSelectedTime(null);
    }
  }, [show]);

  const handleConfirm = () => {
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
        <Row className="mt-4">
          {serviceType === 'overnight' ? (
            <>
              <Col md={6}>
                <div className="date-picker-container">
                  <h5><FontAwesomeIcon icon={faCalendarAlt} className="me-2" />Check-in Date</h5>
                  <DatePicker
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date()}
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
                    onChange={date => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
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
                  onChange={date => setStartDate(date)}
                  minDate={new Date()}
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
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DatePickerModal;