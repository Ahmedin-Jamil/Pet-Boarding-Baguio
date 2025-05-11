import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Button, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faCalendarAlt, faInfoCircle, faQuestion, faCheck } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import DatePickerModal from './DatePickerModal';
import ImportantNoticeCard from './ImportantNoticeCard';
import './Services.css';
import './ModernEffects.css';
import './GradientBackground.css';
import baguioLogo from '../assets/logo192.png';


const GroomingServices = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef(null);
  
  const [showDatePickerModal, setShowDatePickerModal] = useState(false);
  const [serviceType, setServiceType] = useState('grooming');
  const [selectedService, setSelectedService] = useState(null);
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  // We no longer need selectedSize as it will be determined at the facility
  // const [selectedSize, setSelectedSize] = useState(null);
  
  // No parallax or animation effects
  
  return (
    <div className="services-page" ref={containerRef}>
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
                className="nav-link active" 
                style={{ color: '#000', fontWeight: 'bold' }}
              >
                <FontAwesomeIcon icon={faPaw} className="me-2" />
                Select Services
              </Button>
            </Nav.Item>
            <Nav.Item>
              <Button 
                variant="link" 
                className="nav-link" 
                style={{ color: '#000' }}
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
          <h2 style={{ color: '#fff' }}>Rates and Services</h2>
        </Container>
      </div>

      {/* Grooming Services Section */}
      <div className="gradient-background" style={{ padding: '20px 0' }}>
        <Container>
          <h3 className="text-center mb-4" style={{ color: '#fff' }}>MARSHA'S TUB</h3>
          
          {/* Premium Grooming */}
          <Card 
            className="mb-4" 
            style={{ 
              backgroundColor: selectedService === 'premium' ? '#e8f5e9' : '#fff', 
              borderRadius: '10px',
              cursor: 'pointer',
              border: selectedService === 'premium' ? '2px solid #28a745' : '1px solid rgba(0,0,0,.125)',
              transition: 'all 0.3s ease'
            }}
            onClick={() => {
              setSelectedService(selectedService === 'premium' ? null : 'premium');
              setSelectedServiceType('Premium Grooming');
            }}
          >
            <Card.Body>
              <h4 className="text-center mb-3">
                {selectedService === 'premium' && (
                  <FontAwesomeIcon icon={faCheck} className="me-2" style={{ color: '#28a745' }} />
                )}
                PREMIUM GROOMING
              </h4>
              <p className="text-center">+L'beau Premium Products, Bath & Dry, Ear Cleaning, Sanitary, Paw Cleaning, Trimmer Cut, Puppy Cut or Full Shave</p>
              
              <Row className="mt-4 text-center">
                <Col md={12}>
                  <div className="price-info-box" style={{ 
                    backgroundColor: '#FFF8E1', 
                    padding: '20px', 
                    borderRadius: '10px',
                    border: '1px solid #FFD180'
                  }}>
                    <Row className="justify-content-center">
                      <Col md={2} className="text-center mb-3">
                        <div style={{ 
                          padding: '10px', 
                          backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                          borderRadius: '8px',
                          height: '100%'
                        }}>
                          <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                          <p style={{ fontWeight: 'bold', margin: '0' }}>Toy/Small <span style={{ fontWeight: 'bold' }}>1-9 KG</span></p>
                          <p>Php 750</p>
                        </div>
                      </Col>
                      <Col md={2} className="text-center mb-3">
                        <div style={{ 
                          padding: '10px', 
                          backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                          borderRadius: '8px',
                          height: '100%'
                        }}>
                          <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                          <p style={{ fontWeight: 'bold', margin: '0' }}>Medium <span style={{ fontWeight: 'bold' }}>9-25 KG</span></p>
                          <p>Php 850</p>
                        </div>
                      </Col>
                      <Col md={2} className="text-center mb-3">
                        <div style={{ 
                          padding: '10px', 
                          backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                          borderRadius: '8px',
                          height: '100%'
                        }}>
                          <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                          <p style={{ fontWeight: 'bold', margin: '0' }}>Large <span style={{ fontWeight: 'bold' }}>25-40 KG</span></p>
                          <p>Php 1,000</p>
                        </div>
                      </Col>
                      <Col md={2} className="text-center mb-3">
                        <div style={{ 
                          padding: '10px', 
                          backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                          borderRadius: '8px',
                          height: '100%'
                        }}>
                          <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                          <p style={{ fontWeight: 'bold', margin: '0' }}>Extra Large <span style={{ fontWeight: 'bold' }}>40+ KG</span></p>
                          <p>Php 1,500</p>
                        </div>
                      </Col>
                      <Col md={2} className="text-center mb-3">
                        <div style={{ 
                          padding: '10px', 
                          backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                          borderRadius: '8px',
                          height: '100%'
                        }}>
                          <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                          <p style={{ fontWeight: 'bold', margin: '0' }}>Cat</p>
                          <p>Php 950</p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          {/* Basic Bath & Dry */}
          <Card 
            className="mb-4" 
            style={{ 
              backgroundColor: selectedService === 'basic' ? '#e8f5e9' : '#fff', 
              borderRadius: '10px',
              cursor: 'pointer',
              border: selectedService === 'basic' ? '2px solid #28a745' : '1px solid rgba(0,0,0,.125)',
              transition: 'all 0.3s ease'
            }}
            onClick={() => {
              setSelectedService(selectedService === 'basic' ? null : 'basic');
              setSelectedServiceType('Basic Bath & Dry');
            }}
          >
            <Card.Body>
              <h4 className="text-center mb-3">
                {selectedService === 'basic' && (
                  <FontAwesomeIcon icon={faCheck} className="me-2" style={{ color: '#28a745' }} />
                )}
                BASIC BATH & DRY
              </h4>
              <p className="text-center">Organic Shampoo and Conditioner, Sanitary, Perfume & Powder (optional)</p>
              
              <Row className="mt-4 text-center">
                <Col md={12}>
                  <div className="price-info-box" style={{ 
                    backgroundColor: '#FFF8E1', 
                    padding: '20px', 
                    borderRadius: '10px',
                    border: '1px solid #FFD180'
                  }}>
                    <Row className="justify-content-center">
                      <Col md={2} className="text-center mb-3">
                        <div style={{ 
                          padding: '10px', 
                          backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                          borderRadius: '8px',
                          height: '100%'
                        }}>
                          <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                          <p style={{ fontWeight: 'bold', margin: '0' }}>Toy/Small <span style={{ fontWeight: 'bold' }}>1-9 KG</span></p>
                          <p>Php 350</p>
                        </div>
                      </Col>
                      <Col md={2} className="text-center mb-3">
                        <div style={{ 
                          padding: '10px', 
                          backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                          borderRadius: '8px',
                          height: '100%'
                        }}>
                          <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                          <p style={{ fontWeight: 'bold', margin: '0' }}>Medium <span style={{ fontWeight: 'bold' }}>9-25 KG</span></p>
                          <p>Php 450</p>
                        </div>
                      </Col>
                      <Col md={2} className="text-center mb-3">
                        <div style={{ 
                          padding: '10px', 
                          backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                          borderRadius: '8px',
                          height: '100%'
                        }}>
                          <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                          <p style={{ fontWeight: 'bold', margin: '0' }}>Large <span style={{ fontWeight: 'bold' }}>25-40 KG</span></p>
                          <p>Php 550</p>
                        </div>
                      </Col>
                      <Col md={2} className="text-center mb-3">
                        <div style={{ 
                          padding: '10px', 
                          backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                          borderRadius: '8px',
                          height: '100%'
                        }}>
                          <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                          <p style={{ fontWeight: 'bold', margin: '0' }}>Extra Large <span style={{ fontWeight: 'bold' }}>40+ KG</span></p>
                          <p>Php 750</p>
                        </div>
                      </Col>
                      <Col md={2} className="text-center mb-3">
                        <div style={{ 
                          padding: '10px', 
                          backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                          borderRadius: '8px',
                          height: '100%'
                        }}>
                          <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                          <p style={{ fontWeight: 'bold', margin: '0' }}>Cat</p>
                          <p>Php 500</p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          {/* Special Grooming Package */}
          <Card 
            className="mb-4" 
            style={{ 
              backgroundColor: selectedService === 'special' ? '#e8f5e9' : '#fff', 
              borderRadius: '10px',
              cursor: 'pointer',
              border: selectedService === 'special' ? '2px solid #28a745' : '1px solid rgba(0,0,0,.125)',
              transition: 'all 0.3s ease'
            }}
            onClick={() => {
              setSelectedService(selectedService === 'special' ? null : 'special');
              setSelectedServiceType('Special Grooming Package');
            }}
          >
            <Card.Body>
              <h4 className="text-center mb-3">
                {selectedService === 'special' && (
                  <FontAwesomeIcon icon={faCheck} className="me-2" style={{ color: '#28a745' }} />
                )}
                SPECIAL GROOMING PACKAGE
              </h4>
              <p className="text-center">Basic Bath and Dry, Nail Trim, Face Trim, Sanitary, Paw Pad Trim</p>
              
              <Row className="mt-4 text-center">
                <Col md={12}>
                  <div className="price-info-box" style={{ 
                    backgroundColor: '#FFF8E1', 
                    padding: '20px', 
                    borderRadius: '10px',
                    border: '1px solid #FFD180'
                  }}>
                    <Row className="justify-content-center">
                      <Col md={2} className="text-center mb-3">
                        <div style={{ 
                          padding: '10px', 
                          backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                          borderRadius: '8px',
                          height: '100%'
                        }}>
                          <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                          <p style={{ fontWeight: 'bold', margin: '0' }}>Toy/Small <span style={{ fontWeight: 'bold' }}>1-9 KG</span></p>
                          <p>Php 550</p>
                        </div>
                      </Col>
                      <Col md={2} className="text-center mb-3">
                        <div style={{ 
                          padding: '10px', 
                          backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                          borderRadius: '8px',
                          height: '100%'
                        }}>
                          <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                          <p style={{ fontWeight: 'bold', margin: '0' }}>Medium <span style={{ fontWeight: 'bold' }}>9-25 KG</span></p>
                          <p>Php 650</p>
                        </div>
                      </Col>
                      <Col md={2} className="text-center mb-3">
                        <div style={{ 
                          padding: '10px', 
                          backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                          borderRadius: '8px',
                          height: '100%'
                        }}>
                          <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                          <p style={{ fontWeight: 'bold', margin: '0' }}>Large <span style={{ fontWeight: 'bold' }}>25-40 KG</span></p>
                          <p>Php 800</p>
                        </div>
                      </Col>
                      <Col md={2} className="text-center mb-3">
                        <div style={{ 
                          padding: '10px', 
                          backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                          borderRadius: '8px',
                          height: '100%'
                        }}>
                          <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                          <p style={{ fontWeight: 'bold', margin: '0' }}>Extra Large <span style={{ fontWeight: 'bold' }}>40+ KG</span></p>
                          <p>Php 1000</p>
                        </div>
                      </Col>
                      <Col md={2} className="text-center mb-3">
                        <div style={{ 
                          padding: '10px', 
                          backgroundColor: 'rgba(255, 140, 0, 0.1)', 
                          borderRadius: '8px',
                          height: '100%'
                        }}>
                          <FontAwesomeIcon icon={faPaw} className="mb-2" style={{ fontSize: '1.5rem', color: '#FF8C00' }} />
                          <p style={{ fontWeight: 'bold', margin: '0' }}>Cat</p>
                          <p>Php 700</p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          <ImportantNoticeCard>
            <strong>Important:</strong> Your pet's size will be measured at our facility to determine the appropriate service rate. This ensures your pet gets the right care for their comfort and safety.
          </ImportantNoticeCard>
          
          <div className="text-center mt-4">
            <Button 
              variant="danger" 
              className="rounded-pill"
              style={{ backgroundColor: '#FF4500', borderColor: '#FF4500', padding: '10px 30px' }}
              onClick={() => {
                if (selectedService) {
                  // Get date and time data from location state
                  const dateTimeData = location.state || {};
                  
                  // Add selected service to the data (size will be determined at facility)
                  const bookingData = {
                    ...dateTimeData,
                    selectedService: selectedService,
                    selectedServiceType: selectedServiceType,
                    // We're not setting selectedSize as it will be determined at the facility
                    serviceType: 'grooming'
                  };
                  
                  // Navigate to reservation page with the data
                  navigate('/grooming-reservation', { state: bookingData });
                } else {
                  alert('Please select a service before proceeding.');
                }
              }}
              disabled={!selectedService}
            >
              Book now <FontAwesomeIcon icon={faCalendarAlt} className="ms-2" />
            </Button>
          </div>
        </Container>
        <div className="text-center mt-5">
            <img 
              src={baguioLogo}  
              alt="Cat" 
              className="img-fluid" 
              style={{ maxWidth: '200px' }}
            />
      </div>
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
          // Update location state with new date data
          navigate('/grooming-services', { state: dateData });
          setShowDatePickerModal(false);
        }}
      />
    </div>
  );
};

export default GroomingServices;