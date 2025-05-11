import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BookingProvider } from './context/BookingContext';

// Import components
import NavigationBar from './components/Navbar';
import HomeNew from './components/HomeNew';
import Services from './components/Services';
// Booking component removed as requested
import GroomingServices from './components/GroomingServices';
import GroomingReservation from './components/GroomingReservation';
import OvernightReservation from './components/OvernightReservation';
import Confirmation from './components/Confirmation';
import AdminDashboard from './components/AdminDashboard';
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
        <Route path="/" element={<HomeNew />} />
        <Route path="/services" element={<Services />} />
        <Route path="/grooming-services" element={<GroomingServices />} />
        {/* Booking route removed as requested */}
        <Route path="/grooming-reservation" element={<GroomingReservation />} />
        <Route path="/overnight-reservation" element={<OvernightReservation />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/admin" element={<AdminDashboard />} />
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
    <BookingProvider>
      <Router>
        {showSplash ? (
          <SplashScreen onFinished={handleSplashFinished} />
        ) : (
          <AppContent />
        )}
      </Router>
    </BookingProvider>
  );
}

export default App;
