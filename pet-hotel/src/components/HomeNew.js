import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Dropdown, Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faMapMarkerAlt, faCalendarAlt, faCheck, faComments, faChevronDown, faBed, faClock, faCut, faQuestion, faMoon, faStar, faMapMarkedAlt, faInfoCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './HomeNew.css';
import baguioMapImage from '../assets/baguio-google-map.png';
import Chatbot from './Chatbot';
import ChatFrame from './ChatFrame';
import petBackground from '../assets/pet-background.svg';
import baguioLogo from '../assets/logo192.png';
import PhotoGalleryModal from './PhotoGalleryModal';
import daycare1 from '../assets/daycare1.svg';
import daycare2 from '../assets/daycare2.svg';
import daycare3 from '../assets/daycare3.svg';
import daycare4 from '../assets/daycare4.svg';
import premiumRoom1 from '../assets/premium-room1.svg';
import executiveRoom1 from '../assets/executive-room1.svg';
import beagle from '../assets/pet-daycare-beagle.svg';

const HomeNew = () => {
  const navigate = useNavigate();
  const [showGallery, setShowGallery] = useState(false);

  const daycareImages = [
    { src: beagle, alt: "Beagle in Teal Outfit", caption: "Our Adorable Beagle Mascot" },
    { src: daycare1, alt: "Indoor Play Area", caption: "Spacious Indoor Play Area" },
    { src: daycare2, alt: "Outdoor Area", caption: "Secure Outdoor Exercise Space" },
    { src: daycare3, alt: "Rest Area", caption: "Comfortable Rest Areas" },
    { src: daycare4, alt: "Feeding Area", caption: "Dedicated Feeding Station" }
  ];

  const premiumImages = [
    { src: premiumRoom1, alt: "Premium Room", caption: "Luxury Premium Suite" }
  ];

  const executiveImages = [
    { src: executiveRoom1, alt: "Executive Room", caption: "Ultimate Executive Suite" }
  ];

  const [showPremiumGallery, setShowPremiumGallery] = useState(false);
  const [showExecutiveGallery, setShowExecutiveGallery] = useState(false);
  
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 3)));
  const [chatMessage, setChatMessage] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showTimeSelector, setShowTimeSelector] = useState(false);
  const [serviceType, setServiceType] = useState('overnight'); // 'overnight' or 'grooming'
  const [showChatbot, setShowChatbot] = useState(false);
  const [showFrameChat, setShowFrameChat] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showSections, setShowSections] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    dateError: false,
    timeError: false
  });
  
  // Function to handle room selection
  const handleRoomSelection = (roomType) => {
    setSelectedRoom(roomType);
  };
  
  // Featured pet hotels data
  const featuredHotels = [
    {
      id: 1,
      name: 'Pet Day Care',
      address: '5 Arellano Corner Moran Bay Gibraltar',
      description: 'Professional pet day care service with supervised playtime, meals, and rest periods. Our facility offers a safe and fun environment for your pets while you\'re away. Minimum booking of 6 hours required.',
      rating: 4.5,
      image: petBackground
    },
    {
      id: 2,
      name: 'DELUXE ROOMS',
      address: '5 Arellano Corner Moran Bay Gibraltar',
      description: 'Regular Room Gated with 24/7 Pet sitter, Well Ventilated, (1) HOUR Access Play Area Daily, Morning and Evening Outdoor breaks Inclusive of Regular Bed and Food Bowls + Treats, Good for Small/Medium Sizes Real-Time Updates. ***For CATS: Inclusive of Litter Boxes and Scratch Pads',
      rating: 4.9,
      image: petBackground
    },
    {
      id: 3,
      name: 'PREMIUM ROOMS',
      address: '5 Arellano Corner Moran Bay Gibraltar',
      description: 'Spacious Premium Room with Enhanced Amenities, 24/7 Dedicated Pet Sitter, Climate Controlled Environment, (2) HOURS Access to Private Play Area Daily, Premium Bedding, Gourmet Meals + Special Treats, Real-Time Video Updates. ***For CATS: Luxury Cat Trees and Premium Litter Boxes',
      rating: 4.8,
      image: petBackground
    },
    {
      id: 4,
      name: 'EXECUTIVE ROOMS',
      address: '5 Arellano Corner Moran Bay Gibraltar',
      description: 'Ultimate Luxury Suite with Private Balcony, 24/7 Personal Pet Concierge, Smart Climate Control, Unlimited Access to VIP Play Area, Memory Foam Bedding, Chef-Prepared Meals + Gourmet Treats, Live HD Video Feed. ***For CATS: Designer Cat Furniture and Automated Litter Systems',
      rating: 5.0,
      image: petBackground
    }

  ];
  
  return (
    <div className="home-page-new">
      {/* Hero Section */}
      <div className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col md={12} className="text-center">
              <div className="hero-content">
                <h1>Pet Friendly Hotels in Baguio City</h1>
                <p>Explore Baguio City with your four-legged friend by your side--reserve a cozy, dog-approved stay today!</p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <Card className="search-card">
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={12} lg={4}>
                      <div className="search-field">
                        <label><FontAwesomeIcon icon={faPaw} /> Service Type</label>
                        <Form.Select 
                          onChange={(e) => setServiceType(e.target.value)}
                          value={serviceType}
                        >
                          <option value="overnight">Overnight Stay</option>
                          <option value="grooming">Grooming</option>
                        </Form.Select>
                      </div>
                    </Col>
                    <Col md={6} lg={4}>
                      <div className="search-field">
                        <label><FontAwesomeIcon icon={faCalendarAlt} /> Check-in</label>
                        <DatePicker
                          selected={startDate}
                          onChange={date => setStartDate(date)}
                          selectsStart
                          startDate={startDate}
                          endDate={endDate}
                          minDate={new Date()}
                          className="form-control"
                        />
                      </div>
                    </Col>
                    <Col md={6} lg={4}>
                      <div className="search-field">
                        <label><FontAwesomeIcon icon={faCalendarAlt} /> Check-out</label>
                        <DatePicker
                          selected={endDate}
                          onChange={date => setEndDate(date)}
                          selectsEnd
                          startDate={startDate}
                          endDate={endDate}
                          minDate={startDate}
                          className="form-control"
                        />
                        {validationErrors.dateError && (
                          <div className="text-danger mt-1">
                            <small><FontAwesomeIcon icon={faExclamationTriangle} /> Check-out date must be after check-in date</small>
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={12} lg={12} className="mt-3">
                      <div className="search-field">
                        <label><FontAwesomeIcon icon={faClock} /> Select Time</label>
                        <Form.Select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          isInvalid={validationErrors.timeError}
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
                        </Form.Select>
                        {validationErrors.timeError && (
                          <div className="text-danger mt-1">
                            <small><FontAwesomeIcon icon={faExclamationTriangle} /> Please select a time</small>
                          </div>
                        )}
                      </div>
                    </Col>
                    <Col md={12} lg={8} className="mt-3">
                      <Button 
                        variant="primary" 
                        className="check-availability-btn w-100"
                        onClick={() => {
                          // Validate inputs
                          const newValidationErrors = {
                            dateError: serviceType === 'overnight' && endDate <= startDate,
                            timeError: !selectedTime
                          };
                          
                          setValidationErrors(newValidationErrors);
                          
                          // Only proceed if there are no validation errors
                          if (!newValidationErrors.dateError && !newValidationErrors.timeError) {
                            setShowSections(true);
                            const dateTimeData = {
                              startDate: startDate,
                              endDate: endDate,
                              selectedTime: selectedTime,
                              serviceType: serviceType
                            };
                            // navigate('/services', { state: dateTimeData });
                          }
                        }}
                      >
                        CHECK AVAILABILITY
                      </Button>
                    </Col>
                    <Col md={12} lg={4} className="text-center">
                      <div className="availability-display">
                        <span className="available-rooms-badge">{serviceType === 'overnight' ? '5' : '3'} available</span>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Featured Hotels Section */}
      {showSections && (
      <div className="featured-hotels-section">
        <Container>
          <h2 className="section-title">Best Pet Friendly Hotels in Baguio City</h2>
          <Row>
            {featuredHotels.map(hotel => (
              <Col md={6} key={hotel.id} className="mb-4">
                <Card 
                  className="h-100" 
                  style={{ 
                    backgroundColor: selectedRoom === `hotel-${hotel.id}` ? '#e8f5e9' : '#fff', 
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: selectedRoom === `hotel-${hotel.id}` ? '2px solid #28a745' : '1px solid rgba(0,0,0,.125)',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleRoomSelection(`hotel-${hotel.id}`)}
                >
                  <Card.Body>
                    <h4 className="text-center mb-3">
                      {selectedRoom === `hotel-${hotel.id}` && (
                        <FontAwesomeIcon icon={faCheck} className="me-2" style={{ color: 'green' }} />
                      )}
                      {hotel.name}
                    </h4>
                    <div className="d-flex align-items-center mb-2">
                      <FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" style={{ color: '#FF8C00' }} />
                      <p className="mb-0">{hotel.address}</p>
                    </div>
                    <p className="text-center">
                      {hotel.description}
                    </p>
                    
                    {(hotel.id === 1 || hotel.id === 2) && (
                      <Row className="mt-4">
                        <Col md={12}>
                          <div className="price-info-box" style={{ 
                            backgroundColor: '#FFF8E1', 
                            padding: '20px', 
                            borderRadius: '10px',
                            border: '1px solid #FFD180'
                          }}>
                            <Row>
                              <Col md={12} className="text-center mb-4">
                                <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setShowGallery(true)}>
                                  <img 
                                    src={beagle} 
                                    alt="Beagle in Teal Outfit" 
                                    className="img-fluid" 
                                    style={{ maxHeight: '200px', marginBottom: '15px' }}
                                  />
                                  <div style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    padding: '8px 15px',
                                    borderRadius: '20px',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer'
                                  }}>
                                    <FontAwesomeIcon icon={faMapMarkedAlt} className="me-2" />
                                    View Facility Photos
                                  </div>
                                </div>
                                <PhotoGalleryModal
                                  show={showGallery}
                                  onHide={() => setShowGallery(false)}
                                  images={daycareImages}
                                  title="Pet Day Care Facility"
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col md={12}>
                                <h5 style={{ color: '#FF8C00', marginBottom: '15px' }}>
                                  <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                                  {hotel.id === 1 ? 'Daycare Pricing Information' : 'Deluxe Service Pricing Information'}
                                </h5>
                                <p style={{ fontSize: '1.1rem' }}>
                                  {hotel.id === 1 ? 'Our daycare rates are based on your pet\'s size:' : 'Our deluxe service rates are based on your pet\'s size:'}
                                </p>
                                <Row className="justify-content-center">
                                  <Col md={3} className="text-center mb-3">
                                    <div style={{ 
                                      padding: '10px', 
                                      backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                                      borderRadius: '8px',
                                      height: '100%'
                                    }}>
                                      <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                                      <p style={{ fontWeight: 'bold', margin: '0' }}>Small <span style={{ fontWeight: 'bold' }}>1-9 KG</span></p>
                                      <p>{hotel.id === 1 ? 'P350' : 'P450'}</p>
                                    </div>
                                  </Col>
                                  <Col md={3} className="text-center mb-3">
                                    <div style={{ 
                                      padding: '10px', 
                                      backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                                      borderRadius: '8px',
                                      height: '100%'
                                    }}>
                                      <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                                      <p style={{ fontWeight: 'bold', margin: '0' }}>Medium <span style={{ fontWeight: 'bold' }}>9-25 KG</span></p>
                                      <p>{hotel.id === 1 ? 'P450' : 'P550'}</p>
                                    </div>
                                  </Col>
                                  <Col md={3} className="text-center mb-3">
                                    <div style={{ 
                                      padding: '10px', 
                                      backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                                      borderRadius: '8px',
                                      height: '100%'
                                    }}>
                                      <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                                      <p style={{ fontWeight: 'bold', margin: '0' }}>Large <span style={{ fontWeight: 'bold' }}>25-40 KG</span></p>
                                      <p>{hotel.id === 1 ? 'P500' : 'P600'}</p>
                                    </div>
                                  </Col>
                                  <Col md={3} className="text-center mb-3">
                                    <div style={{ 
                                      padding: '10px', 
                                      backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                                      borderRadius: '8px',
                                      height: '100%'
                                    }}>
                                      <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                                      <p style={{ fontWeight: 'bold', margin: '0' }}>Extra-Large <span style={{ fontWeight: 'bold' }}>40+ KG</span></p>
                                      <p>{hotel.id === 1 ? 'P600' : 'P700'}</p>
                                    </div>
                                  </Col>
                                </Row>
                                <div className="mt-3 p-3" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)', borderRadius: '8px' }}>
                                  <p style={{ margin: '0', color: '#28a745' }}>
                                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                                    <strong>Note:</strong> {hotel.id === 1 ? 'Additional P80 per hour exceeded beyond the minimum 6 hours.' : 'Additional P100 per hour exceeded beyond the minimum 6 hours.'}
                                  </p>
                                </div>
                              </Col>
                            </Row>
                            <Row className="mt-4">
                              <Col md={12} className="text-center">
                                <h5 style={{ color: '#FF8C00', marginBottom: '15px' }}>
                                  <FontAwesomeIcon icon={faClock} className="me-2" />
                                  Available Services:
                                </h5>
                                <Row className="justify-content-center">
                                  <Col md={6} className="text-center mb-3">
                                    <div style={{ 
                                      padding: '15px', 
                                      backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                                      borderRadius: '8px',
                                      height: '100%'
                                    }}>
                                      <h6 style={{ fontWeight: 'bold' }}>Half Day (5 hours)</h6>
                                      <p>{hotel.id === 1 ? '₱350 (3 available)' : '₱450 (2 available)'}</p>
                                    </div>
                                  </Col>
                                  <Col md={6} className="text-center mb-3">
                                    <div style={{ 
                                      padding: '15px', 
                                      backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                                      borderRadius: '8px',
                                      height: '100%'
                                    }}>
                                      <h6 style={{ fontWeight: 'bold' }}>Full Day (8 hours)</h6>
                                      <p>{hotel.id === 1 ? '₱500 (5 available)' : '₱600 (3 available)'}</p>
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="mt-4">
                              <Col md={12} className="text-center">
                                <h5 style={{ color: '#FF8C00', marginBottom: '15px' }}>
                                  <FontAwesomeIcon icon={faCheck} className="me-2" />
                                  All Services Include:
                                </h5>
                                <Row className="justify-content-center">
                                  <Col md={6} className="text-left">
                                    <p><FontAwesomeIcon icon={faPaw} className="me-2" style={{ color: '#FF8C00' }} />{hotel.id === 1 ? 'Outdoor play area and exercise' : 'Premium play area and specialized exercise'}</p>
                                  </Col>
                                  <Col md={6} className="text-left">
                                    <p><FontAwesomeIcon icon={faClock} className="me-2" style={{ color: '#FF8C00' }} />{hotel.id === 1 ? '24/7 monitoring and care' : '24/7 personalized care and attention'}</p>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="mt-4">
                              <Col md={12} className="text-center">
                                <Button 
                                  variant="primary" 
                                  size="lg" 
                                  className="book-now-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const bookingData = {
                                      selectedRoom: 'daycare',
                                      roomType: 'Pet Daycare',
                                      serviceType: 'daycare',
                                      startDate: startDate,
                                      endDate: startDate,
                                      selectedTime: selectedTime || '08:00'
                                    };
                                    navigate('/overnight-reservation', { state: bookingData });
                                  }}
                                  style={{ 
                                    backgroundColor: '#FF8C00', 
                                    borderColor: '#FF8C00', 
                                    padding: '12px 40px',
                                    fontSize: '1.1rem',
                                    borderRadius: '30px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                  }}
                                >
                                  Book Now <FontAwesomeIcon icon={faCalendarAlt} className="ms-2" />
                                </Button>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    )}
                    
                    {(hotel.id === 3 || hotel.id === 4) && (
                      <Row className="mt-4">
                        <Col md={12}>
                          <div className="price-info-box" style={{ 
                            backgroundColor: '#FFF8E1', 
                            padding: '20px', 
                            borderRadius: '10px',
                            border: '1px solid #FFD180'
                          }}>
                            <Row>
                              <Col md={12} className="text-center mb-4">
                                <div style={{ position: 'relative', cursor: 'pointer' }} 
                                  onClick={() => hotel.id === 3 ? setShowPremiumGallery(true) : setShowExecutiveGallery(true)}>
                                  <img 
                                    src={hotel.id === 3 ? premiumRoom1 : executiveRoom1} 
                                    alt={hotel.id === 3 ? "Premium Room" : "Executive Room"} 
                                    className="img-fluid" 
                                    style={{ maxHeight: '200px', marginBottom: '15px' }}
                                  />
                                  <div style={{
                                    position: 'absolute',
                                    bottom: '20px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                    padding: '8px 15px',
                                    borderRadius: '20px',
                                    fontSize: '0.9rem',
                                    cursor: 'pointer'
                                  }}>
                                    <FontAwesomeIcon icon={faMapMarkedAlt} className="me-2" />
                                    View Room Photos
                                  </div>
                                </div>
                                <PhotoGalleryModal
                                  show={hotel.id === 3 ? showPremiumGallery : showExecutiveGallery}
                                  onHide={() => hotel.id === 3 ? setShowPremiumGallery(false) : setShowExecutiveGallery(false)}
                                  images={hotel.id === 3 ? premiumImages : executiveImages}
                                  title={hotel.id === 3 ? "Premium Room Facilities" : "Executive Room Facilities"}
                                />
                              </Col>
                            </Row>
                            <Row>
                              <Col md={12}>
                                <h5 style={{ color: '#FF8C00', marginBottom: '15px' }}>
                                  <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                                  {hotel.id === 3 ? 'Premium Service Pricing Information' : 'Executive Service Pricing Information'}
                                </h5>
                                <p style={{ fontSize: '1.1rem' }}>
                                  {hotel.id === 3 ? 'Our premium service rates are based on your pet\'s size:' : 'Our executive service rates are based on your pet\'s size:'}
                                </p>
                                <Row className="justify-content-center">
                                  <Col md={3} className="text-center mb-3">
                                    <div style={{ 
                                      padding: '10px', 
                                      backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                                      borderRadius: '8px',
                                      height: '100%'
                                    }}>
                                      <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                                      <p style={{ fontWeight: 'bold', margin: '0' }}>Small <span style={{ fontWeight: 'bold' }}>1-9 KG</span></p>
                                      <p>{hotel.id === 3 ? 'P550' : 'P650'}</p>
                                    </div>
                                  </Col>
                                  <Col md={3} className="text-center mb-3">
                                    <div style={{ 
                                      padding: '10px', 
                                      backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                                      borderRadius: '8px',
                                      height: '100%'
                                    }}>
                                      <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                                      <p style={{ fontWeight: 'bold', margin: '0' }}>Medium <span style={{ fontWeight: 'bold' }}>9-25 KG</span></p>
                                      <p>{hotel.id === 3 ? 'P650' : 'P750'}</p>
                                    </div>
                                  </Col>
                                  <Col md={3} className="text-center mb-3">
                                    <div style={{ 
                                      padding: '10px', 
                                      backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                                      borderRadius: '8px',
                                      height: '100%'
                                    }}>
                                      <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                                      <p style={{ fontWeight: 'bold', margin: '0' }}>Large <span style={{ fontWeight: 'bold' }}>25-40 KG</span></p>
                                      <p>{hotel.id === 3 ? 'P750' : 'P850'}</p>
                                    </div>
                                  </Col>
                                  <Col md={3} className="text-center mb-3">
                                    <div style={{ 
                                      padding: '10px', 
                                      backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                                      borderRadius: '8px',
                                      height: '100%'
                                    }}>
                                      <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                                      <p style={{ fontWeight: 'bold', margin: '0' }}>Extra-Large <span style={{ fontWeight: 'bold' }}>40+ KG</span></p>
                                      <p>{hotel.id === 3 ? 'P850' : 'P950'}</p>
                                    </div>
                                  </Col>
                                </Row>
                                <div className="mt-3 p-3" style={{ backgroundColor: 'rgba(40, 167, 69, 0.1)', borderRadius: '8px' }}>
                                  <p style={{ margin: '0', color: '#28a745' }}>
                                    <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                                    <strong>Note:</strong> {hotel.id === 3 ? 'Additional P120 per hour exceeded beyond the minimum 6 hours.' : 'Additional P150 per hour exceeded beyond the minimum 6 hours.'}
                                  </p>
                                </div>
                              </Col>
                            </Row>
                            <Row className="mt-4">
                              <Col md={12} className="text-center">
                                <h5 style={{ color: '#FF8C00', marginBottom: '15px' }}>
                                  <FontAwesomeIcon icon={faClock} className="me-2" />
                                  Available Services:
                                </h5>
                                <Row className="justify-content-center">
                                  <Col md={6} className="text-center mb-3">
                                    <div style={{ 
                                      padding: '15px', 
                                      backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                                      borderRadius: '8px',
                                      height: '100%'
                                    }}>
                                      <h6 style={{ fontWeight: 'bold' }}>Half Day (5 hours)</h6>
                                      <p>{hotel.id === 3 ? '₱550 (2 available)' : '₱650 (1 available)'}</p>
                                    </div>
                                  </Col>
                                  <Col md={6} className="text-center mb-3">
                                    <div style={{ 
                                      padding: '15px', 
                                      backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                                      borderRadius: '8px',
                                      height: '100%'
                                    }}>
                                      <h6 style={{ fontWeight: 'bold' }}>Full Day (8 hours)</h6>
                                      <p>{hotel.id === 3 ? '₱700 (3 available)' : '₱800 (2 available)'}</p>
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="mt-4">
                              <Col md={12} className="text-center">
                                <h5 style={{ color: '#FF8C00', marginBottom: '15px' }}>
                                  <FontAwesomeIcon icon={faCheck} className="me-2" />
                                  All Services Include:
                                </h5>
                                <Row className="justify-content-center">
                                  <Col md={6} className="text-left">
                                    <p><FontAwesomeIcon icon={faPaw} className="me-2" style={{ color: '#FF8C00' }} />{hotel.id === 3 ? 'Private play area and specialized exercise' : 'VIP play area and luxury exercise space'}</p>
                                  </Col>
                                  <Col md={6} className="text-left">
                                    <p><FontAwesomeIcon icon={faClock} className="me-2" style={{ color: '#FF8C00' }} />{hotel.id === 3 ? '24/7 dedicated care and monitoring' : '24/7 personal concierge service'}</p>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row className="mt-4">
                              <Col md={12} className="text-center">
                                <Button 
                                  variant="primary" 
                                  size="lg" 
                                  className="book-now-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const bookingData = {
                                      selectedRoom: hotel.id === 3 ? 'premium' : 'executive',
                                      roomType: hotel.id === 3 ? 'Premium Room' : 'Executive Room',
                                      serviceType: 'premium',
                                      startDate: startDate,
                                      endDate: startDate,
                                      selectedTime: selectedTime || '08:00'
                                    };
                                    navigate('/overnight-reservation', { state: bookingData });
                                  }}
                                  style={{ 
                                    backgroundColor: '#FF8C00', 
                                    borderColor: '#FF8C00', 
                                    padding: '12px 40px',
                                    fontSize: '1.1rem',
                                    borderRadius: '30px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                  }}
                                >
                                  Book Now <FontAwesomeIcon icon={faCalendarAlt} className="ms-2" />
                                </Button>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
      )}

      {/* Services Section */}
      {showSections && (
      <div className="services-section">
        <Container>
          <h2 className="section-title">Our Pet Services</h2>
          <Row>
            <Col md={12}>
              <Card className="service-card">
                <Card.Body>
                  <div className="service-icon">
                    <FontAwesomeIcon icon={faCut} />
                  </div>
                  <h3>Grooming</h3>
                  <p>Professional grooming services to keep your pets looking and feeling their best.</p>
                  
                  <div className="grooming-options">
                    <Form>
                      <Form.Group>
                        <Form.Check 
                          type="checkbox" 
                          id="premium-grooming"
                          label={<span className="service-label">Premium Grooming <span className="price-tag">₱750-1500</span> <span className="availability-tag">3 slots</span></span>}
                        />
                        <Form.Text className="text-muted">
                          Bath & Dry, Ear Cleaning, Sanitary, Paw Cleaning, Trimmer Cut
                        </Form.Text>
                      </Form.Group>
                      
                      <Form.Group className="mt-3">
                        <Form.Check 
                          type="checkbox" 
                          id="basic-bath"
                          label={<span className="service-label">Basic Bath & Dry <span className="price-tag">₱350-750</span> <span className="availability-tag">5 slots</span></span>}
                        />
                        <Form.Text className="text-muted">
                          Organic Shampoo and Conditioner, Sanitary, Perfume & Powder
                        </Form.Text>
                      </Form.Group>
                      
                      <Form.Group className="mt-3">
                        <Form.Check 
                          type="checkbox" 
                          id="special-package"
                          label={<span className="service-label">Special Package <span className="price-tag">₱550-1000</span> <span className="availability-tag">2 slots</span></span>}
                        />
                        <Form.Text className="text-muted">
                          Basic Bath and Dry, Nail Trim, Face Trim, Sanitary, Paw Pad Trim
                        </Form.Text>
                      </Form.Group>
                    </Form>
                  </div>
                  
                  <Button 
                    variant="outline-primary" 
                    className="service-btn mt-4"
                    onClick={() => {
                      const dateTimeData = {
                        startDate: startDate,
                        endDate: startDate,
                        selectedTime: '09:00',
                        serviceType: 'grooming'
                      };
                      navigate('/grooming-services', { state: dateTimeData });
                    }}
                  >
                    Book Now <span className="available-slots-badge">10 slots available</span>
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      )}

      {/* About Us Section */}
      <div className="about-section">
        <Container>
          <Row>
            <Col md={6}>
              <Card className="about-card">
                <Card.Body>
                  <h2>About Us</h2>
                  <div className="about-content">
                    <p>
                      <strong>About Baguio Pet Boarding (Martha's Pet Emporium)</strong> - where love for pets inspired the creation of a haven for your furry friends.
                    </p>
                    <p>
                      Our story began with Mimi and Marj (Martha's daughters), two friends who have recognized her special connection with pets, prompting them to extend that natural companionship to her care, leading to the establishment of Baguio Pet Boarding. As pet lovers and owners ourselves, we aim to provide an environment where your pets not only stay but feel truly at home.
                    </p>
                    <p>
                      Our team of loving pet sitters--Geri, Ate Mhen, Doc J, Kuya Marlo, Mimi, Marj, and Buff contribute their unique warmth and expertise. Together, they form a compassionate team committed to treating your pets with the utmost care and attention.
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <div className="location-section">
                <h2><FontAwesomeIcon icon={faMapMarkerAlt} className="me-2" />Location</h2>
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=186+Kenon+road+Camp+7+Baguio+City+Philippines+2600" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="location-link"
                >
                  <div className="map-container">
                    <img 
                      src={baguioMapImage} 
                      alt="Baguio Pet Boarding Location - 186 Kenon Road, Camp 7" 
                      className="img-fluid rounded"
                    />
                  </div>
                  <div className="address-container mt-3">
                    <p><strong>186 Kenon Road, Camp 7, Baguio City, Philippines, 2600</strong></p>
                  </div>
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Help Button */}
      <div className="help-section">
        <Button 
          variant="light" 
          className="help-btn rounded-circle"
          onClick={() => setShowFrameChat(!showFrameChat)}
        >
          <FontAwesomeIcon icon={faQuestion} />
        </Button>
        
        {/* Frame Chat */}
        {showFrameChat && (
          <div className="frame-chat-popup">
            <ChatFrame 
              onAskQuestions={() => setShowChatbot(true)} 
              onClose={() => setShowFrameChat(false)} 
            />
          </div>
        )}
        
        {/* Chatbot */}
        {showChatbot && (
          <div className="chatbot-popup">
            <Chatbot onClose={() => setShowChatbot(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeNew;