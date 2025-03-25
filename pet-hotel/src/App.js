import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import components
import NavigationBar from './components/Navbar';
import Home from './components/Home';
import Services from './components/Services';
import Booking from './components/Booking';
import GroomingServices from './components/GroomingServices';
import GroomingReservation from './components/GroomingReservation';
import OvernightReservation from './components/OvernightReservation';
import Confirmation from './components/Confirmation';
import AdminBookingList from './components/AdminBookingList';
import ChatbotButton from './components/ChatbotButton';
import SplashScreen from './components/SplashScreen';

// Wrapper component to conditionally render the navbar
const AppContent = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.includes('/admin');

  return (
    <div className="App">
      {!isAdminPage && <NavigationBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/grooming-services" element={<GroomingServices />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/grooming-reservation" element={<GroomingReservation />} />
        <Route path="/overnight-reservation" element={<OvernightReservation />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/admin/bookings" element={<AdminBookingList />} />
      </Routes>
      <ChatbotButton />
    </div>
  );
};

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinished = () => {
    setShowSplash(false);
  };

  return (
    <Router>
      {showSplash ? (
        <SplashScreen onFinished={handleSplashFinished} />
      ) : (
        <AppContent />
      )}
    </Router>
  );
}

export default App;
