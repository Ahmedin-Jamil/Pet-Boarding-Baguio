import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_URL } from '../config';

// Create context
export const BookingContext = createContext();

// Create provider component
export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bookings from API and localStorage
  const fetchBookings = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to fetch from API first
      let apiBookings = [];
      try {
        const response = await fetch(`${API_URL}/api/bookings`);
        if (response.ok) {
          const data = await response.json();
          apiBookings = data.map(booking => ({
            id: booking.id,
            petName: booking.pet_name,
            petType: booking.pet_type,
            breed: booking.pet_breed,
            owner: booking.owner_name,
            contactNumber: booking.owner_phone,
            checkIn: new Date(booking.start_date),
            checkOut: new Date(booking.end_date),
            status: booking.status,
            notes: booking.special_requirements,
            serviceType: booking.service_type || 'overnight',
            selectedServiceType: booking.selected_service_type,
            selectedSize: booking.selected_size
          }));
        }
      } catch (apiError) {
        console.warn('API fetch failed, falling back to localStorage:', apiError);
      }
      
      // Get bookings from localStorage as fallback or additional source
      const localStorageBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
      const formattedLocalBookings = localStorageBookings.map(booking => {
        // Ensure dates are properly parsed from strings
        let checkInDate, checkOutDate;
        
        try {
          // Try to parse the date strings
          checkInDate = new Date(booking.startDate);
          checkOutDate = new Date(booking.endDate);
          
          // Check if dates are valid
          if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            console.warn('Invalid date format in booking:', booking);
            // Try alternative parsing if the standard method fails
            const dateParts = booking.startDate.split('/');
            if (dateParts.length === 3) {
              // Format might be YYYY/MM/DD
              // Ensure proper month indexing (0-11 in JavaScript Date)
              checkInDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
            }
            
            const endDateParts = booking.endDate ? booking.endDate.split('/') : booking.startDate.split('/');
            if (endDateParts.length === 3) {
              checkOutDate = new Date(parseInt(endDateParts[0]), parseInt(endDateParts[1]) - 1, parseInt(endDateParts[2]));
            }
          }
        } catch (error) {
          console.error('Error parsing dates:', error);
          // Fallback to current date if parsing fails
          checkInDate = new Date();
          checkOutDate = new Date();
          checkOutDate.setDate(checkOutDate.getDate() + 1);
        }
        
        return {
          id: booking.id,
          petName: booking.petName,
          petType: booking.petType,
          breed: booking.petBreed,
          owner: booking.ownerName,
          contactNumber: booking.ownerPhone,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          status: booking.status,
          notes: booking.specialRequirements,
          serviceType: booking.serviceType || 'overnight',
          selectedServiceType: booking.selectedServiceType,
          selectedSize: booking.selectedSize
        };
      });
      
      // Combine API and localStorage bookings, avoiding duplicates
      const combinedBookings = [...apiBookings];
      formattedLocalBookings.forEach(localBooking => {
        // Only add if not already in the API bookings (by ID)
        if (!apiBookings.some(apiBooking => apiBooking.id === localBooking.id)) {
          combinedBookings.push(localBooking);
        }
      });
      
      setBookings(combinedBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to load bookings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new booking
  const addBooking = async (bookingData) => {
    try {
      // Try to send to API first
      let apiSuccess = false;
      try {
        const response = await fetch(`${API_URL}/api/bookings`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        });
        
        if (response.ok) {
          apiSuccess = true;
          // Refresh bookings after successful API call
          fetchBookings();
          return { success: true, message: 'Booking created successfully' };
        }
      } catch (apiError) {
        console.warn('API booking creation failed, falling back to localStorage:', apiError);
      }
      
      // If API fails, store in localStorage
      if (!apiSuccess) {
        const existingBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
        const newBooking = {
          id: Date.now(), // Use timestamp as ID
          ...bookingData,
          createdAt: new Date().toISOString()
        };
        existingBookings.push(newBooking);
        localStorage.setItem('demoBookings', JSON.stringify(existingBookings));
        
        // Refresh bookings after localStorage update
        fetchBookings();
        return { success: true, message: 'Booking created successfully (demo mode)' };
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      return { success: false, message: 'Failed to create booking' };
    }
  };

  // Update booking status
  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      // Try to update via API first
      let apiSuccess = false;
      try {
        const response = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });
        
        if (response.ok) {
          apiSuccess = true;
          // Refresh bookings after successful API call
          fetchBookings();
          return { success: true, message: 'Booking updated successfully' };
        }
      } catch (apiError) {
        console.warn('API booking update failed, falling back to localStorage:', apiError);
      }
      
      // If API fails, update in localStorage
      if (!apiSuccess) {
        const existingBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
        const updatedBookings = existingBookings.map(booking => {
          if (booking.id === bookingId) {
            return { ...booking, status: newStatus };
          }
          return booking;
        });
        localStorage.setItem('demoBookings', JSON.stringify(updatedBookings));
        
        // Refresh bookings after localStorage update
        fetchBookings();
        return { success: true, message: 'Booking updated successfully (demo mode)' };
      }
    } catch (error) {
      console.error('Error updating booking:', error);
      return { success: false, message: 'Failed to update booking' };
    }
  };

  // Fetch unavailable dates from API or localStorage
  const fetchUnavailableDates = async () => {
    try {
      // Try to fetch from API first
      let apiUnavailableDates = [];
      try {
        const response = await fetch(`${API_URL}/api/unavailable-dates`);
        if (response.ok) {
          apiUnavailableDates = await response.json();
        }
      } catch (apiError) {
        console.warn('API fetch for unavailable dates failed, falling back to localStorage:', apiError);
      }
      
      // Get unavailable dates from localStorage as fallback
      const localStorageUnavailableDates = JSON.parse(localStorage.getItem('unavailableDates') || '[]');
      
      // Combine API and localStorage unavailable dates, ensuring they are Date objects
      const combinedUnavailableDates = [...apiUnavailableDates, ...localStorageUnavailableDates].map(dateStr => {
        const date = new Date(dateStr);
        // Normalize date by removing time component
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
      });
      
      // Remove duplicates by converting to string and back
      const uniqueDatesStr = [...new Set(combinedUnavailableDates.map(date => date.toISOString().split('T')[0]))];
      const uniqueDates = uniqueDatesStr.map(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
      });
      
      setUnavailableDates(uniqueDates);
    } catch (error) {
      console.error('Error fetching unavailable dates:', error);
    }
  };
  
  // Add a date to unavailable dates
  const addUnavailableDate = async (date) => {
    try {
      // Normalize date by removing time component
      const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      // Check if date already exists in unavailable dates
      const dateExists = unavailableDates.some(unavailableDate => 
        unavailableDate.getFullYear() === normalizedDate.getFullYear() &&
        unavailableDate.getMonth() === normalizedDate.getMonth() &&
        unavailableDate.getDate() === normalizedDate.getDate()
      );
      
      if (dateExists) {
        return { success: false, message: 'Date is already marked as unavailable' };
      }
      
      // Try to send to API first
      let apiSuccess = false;
      try {
        const response = await fetch(`${API_URL}/api/unavailable-dates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ date: normalizedDate.toISOString() }),
        });
        
        if (response.ok) {
          apiSuccess = true;
        }
      } catch (apiError) {
        console.warn('API unavailable date creation failed, falling back to localStorage:', apiError);
      }
      
      // If API fails, store in localStorage
      if (!apiSuccess) {
        const existingDates = JSON.parse(localStorage.getItem('unavailableDates') || '[]');
        existingDates.push(normalizedDate.toISOString());
        localStorage.setItem('unavailableDates', JSON.stringify(existingDates));
      }
      
      // Update state with new unavailable date
      setUnavailableDates(prevDates => [...prevDates, normalizedDate]);
      
      return { success: true, message: 'Date marked as unavailable successfully' };
    } catch (error) {
      console.error('Error adding unavailable date:', error);
      return { success: false, message: 'Failed to mark date as unavailable' };
    }
  };
  
  // Remove a date from unavailable dates
  const removeUnavailableDate = async (date) => {
    try {
      // Normalize date by removing time component
      const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      // Try to send to API first
      let apiSuccess = false;
      try {
        const response = await fetch(`${API_URL}/api/unavailable-dates/${normalizedDate.toISOString()}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          apiSuccess = true;
        }
      } catch (apiError) {
        console.warn('API unavailable date deletion failed, falling back to localStorage:', apiError);
      }
      
      // If API fails, update in localStorage
      if (!apiSuccess) {
        const existingDates = JSON.parse(localStorage.getItem('unavailableDates') || '[]');
        const updatedDates = existingDates.filter(dateStr => {
          const date = new Date(dateStr);
          return !(date.getFullYear() === normalizedDate.getFullYear() &&
                  date.getMonth() === normalizedDate.getMonth() &&
                  date.getDate() === normalizedDate.getDate());
        });
        localStorage.setItem('unavailableDates', JSON.stringify(updatedDates));
      }
      
      // Update state by removing the unavailable date
      setUnavailableDates(prevDates => prevDates.filter(date => 
        !(date.getFullYear() === normalizedDate.getFullYear() &&
          date.getMonth() === normalizedDate.getMonth() &&
          date.getDate() === normalizedDate.getDate())
      ));
      
      return { success: true, message: 'Date removed from unavailable dates successfully' };
    } catch (error) {
      console.error('Error removing unavailable date:', error);
      return { success: false, message: 'Failed to remove date from unavailable dates' };
    }
  };
  
  // Check if a date is unavailable
  const isDateUnavailable = (date) => {
    if (!date) return false;
    
    // Normalize date by removing time component
    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    return unavailableDates.some(unavailableDate => 
      unavailableDate.getFullYear() === normalizedDate.getFullYear() &&
      unavailableDate.getMonth() === normalizedDate.getMonth() &&
      unavailableDate.getDate() === normalizedDate.getDate()
    );
  };
  
  // Load bookings and unavailable dates on component mount
  useEffect(() => {
    fetchBookings();
    fetchUnavailableDates();
  }, []);

  return (
    <BookingContext.Provider value={{ 
      bookings, 
      unavailableDates,
      isLoading, 
      error, 
      fetchBookings, 
      fetchUnavailableDates,
      addBooking,
      updateBookingStatus,
      addUnavailableDate,
      removeUnavailableDate,
      isDateUnavailable
    }}>
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook to use the booking context
export const useBookings = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};