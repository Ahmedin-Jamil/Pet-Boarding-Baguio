import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';
import './AdminDashboard.css';
import { useBookings } from '../context/BookingContext';
import ConfirmationDialog from './ConfirmationDialog';

// Initial empty array for bookings
const initialBookingsData = [
    {
        id: 1,
        petName: "Max",
        petType: "Dog",
        breed: "Golden Retriever",
        owner: "John Smith",
        contactNumber: "555-1234",
        checkIn: new Date(2025, 3, 29),
        checkOut: new Date(2025, 4, 3),
        status: "confirmed",
        notes: "Allergic to chicken. Needs medication twice daily."
    },
    {
        id: 2,
        petName: "Bella",
        petType: "Cat",
        breed: "Siamese",
        owner: "Emily Johnson",
        contactNumber: "555-5678",
        checkIn: new Date(2025, 3, 27),
        checkOut: new Date(2025, 3, 30),
        status: "completed",
        notes: "Prefers wet food. Very shy around other animals."
    },
    {
        id: 3,
        petName: "Charlie",
        petType: "Dog",
        breed: "Beagle",
        owner: "Michael Williams",
        contactNumber: "555-9012",
        checkIn: new Date(2025, 4, 5),
        checkOut: new Date(2025, 4, 10),
        status: "pending",
        notes: "Energetic. Needs regular walks."
    },
    {
        id: 4,
        petName: "Luna",
        petType: "Cat",
        breed: "Maine Coon",
        owner: "Sophia Brown",
        contactNumber: "555-3456",
        checkIn: new Date(2025, 4, 1),
        checkOut: new Date(2025, 4, 7),
        status: "confirmed",
        notes: "Requires special diet food. Bring own litter."
    },
    {
        id: 5,
        petName: "Cooper",
        petType: "Dog",
        breed: "Labrador",
        owner: "David Jones",
        contactNumber: "555-7890",
        checkIn: new Date(2025, 4, 2),
        checkOut: new Date(2025, 4, 8),
        status: "cancelled",
        notes: "Friendly with other dogs. Afraid of thunderstorms."
    },
    {
        id: 6,
        petName: "Coco",
        petType: "Rabbit",
        breed: "Netherland Dwarf",
        owner: "Emma Wilson",
        contactNumber: "555-2345",
        checkIn: new Date(2025, 3, 30),
        checkOut: new Date(2025, 4, 5),
        status: "confirmed",
        notes: "Needs fresh vegetables daily."
    },
    {
        id: 7,
        petName: "Rocky",
        petType: "Dog",
        breed: "German Shepherd",
        owner: "James Miller",
        contactNumber: "555-6789",
        checkIn: new Date(2025, 4, 4),
        checkOut: new Date(2025, 4, 9),
        status: "pending",
        notes: "Training in progress. Follows specific commands."
    },
    {
        id: 8,
        petName: "Milo",
        petType: "Cat",
        breed: "Persian",
        owner: "Olivia Davis",
        contactNumber: "555-0123",
        checkIn: new Date(2025, 3, 28),
        checkOut: new Date(2025, 4, 2),
        status: "completed",
        notes: "Requires daily grooming. Medication for skin condition."
    }
];

// Calendar Component
function Calendar({ 
    currentDate, 
    selectedDate, 
    onDateSelect, 
    onChangeMonth, 
    hasBookings, 
    countBookings,
    formatDate,
    onToggleUnavailableDate,
    isDateUnavailable
}) {
    // Generate days for the calendar
    const generateCalendarDays = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // First day of the month
        const firstDay = new Date(year, month, 1);
        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);
        
        // Day of the week for the first day (0 = Sunday, 6 = Saturday)
        const firstDayOfWeek = firstDay.getDay();
        
        // Array to hold all calendar days
        const calendarDays = [];
        
        // Add days from previous month
        const daysFromPrevMonth = firstDayOfWeek;
        for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
            const prevMonthDay = new Date(year, month, -i);
            calendarDays.push({
                date: prevMonthDay,
                isCurrentMonth: false
            });
        }
        
        // Add days from current month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const currentDay = new Date(year, month, day);
            calendarDays.push({
                date: currentDay,
                isCurrentMonth: true
            });
        }
        
        // Add days from next month to complete the grid
        const totalDaysToShow = 42; // 6 rows x 7 days
        const daysFromNextMonth = totalDaysToShow - calendarDays.length;
        for (let day = 1; day <= daysFromNextMonth; day++) {
            const nextMonthDay = new Date(year, month + 1, day);
            calendarDays.push({
                date: nextMonthDay,
                isCurrentMonth: false
            });
        }
        
        return calendarDays;
    };
    
    const calendarDays = generateCalendarDays();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isToday = (date) => {
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };
    
    const isSelected = (date) => {
        return date.getDate() === selectedDate.getDate() &&
               date.getMonth() === selectedDate.getMonth() &&
               date.getFullYear() === selectedDate.getFullYear();
    };
    
    // Check if a date is unavailable
    const isUnavailable = (date) => {
        return isDateUnavailable(date);
    };
    
    return (
        <div className="calendar">
            <div className="calendar-header">
                <h2>{formatDate(currentDate)}</h2>
                <div className="calendar-nav">
                    <button onClick={() => onChangeMonth(-1)}>←</button>
                    <button onClick={() => onChangeMonth(1)}>→</button>
                </div>
            </div>
            
            <div className="calendar-day-names">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName, index) => (
                    <div key={index} className="day-name">{dayName}</div>
                ))}
            </div>
            
            <div className="calendar-grid">
                {calendarDays.map((day, index) => {
                    const dayClasses = [
                        'calendar-day',
                        day.isCurrentMonth ? '' : 'other-month',
                        isToday(day.date) ? 'today' : '',
                        isSelected(day.date) ? 'selected' : '',
                        hasBookings(day.date) ? 'has-bookings' : '',
                        isUnavailable(day.date) ? 'unavailable' : ''
                    ].filter(Boolean).join(' ');
                    
                    return (
                        <div 
                            key={index} 
                            className={dayClasses}
                            onClick={() => onDateSelect(day.date)}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                onToggleUnavailableDate(day.date);
                            }}
                        >
                            <div className="day-number">{day.date.getDate()}</div>
                            {hasBookings(day.date) && (
                                <div className="booking-count">
                                    {countBookings(day.date)} booking{countBookings(day.date) !== 1 && 's'}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// BookingsList Component
function BookingsList({ bookings, formatDateRange, selectedDate, onStatusChange, showHistoryFilter }) {
    if (bookings.length === 0) {
        return (
            <div className="no-bookings">
                {showHistoryFilter ? 
                    "No historical bookings found with the current filters." : 
                    `No bookings found for ${new Intl.DateTimeFormat('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                    }).format(selectedDate)}`
                }
            </div>
        );
    }
    
    return (
        <div className="bookings-list">
            {bookings.map(booking => (
                <BookingItem
                    key={booking.id}
                    booking={booking}
                    formatDateRange={formatDateRange}
                    onStatusChange={onStatusChange}
                />
            ))}
        </div>
    );
}

// BookingItem Component
function BookingItem({ booking, formatDateRange, onStatusChange }) {
    const [expanded, setExpanded] = useState(false);
    
    const statusClass = `booking-status status-${booking.status}`;
    const statusText = booking.status.charAt(0).toUpperCase() + booking.status.slice(1);
    
    const petInitial = booking.petName.charAt(0).toUpperCase();
    
    // Format service type for display
    const getServiceTypeDisplay = () => {
        if (booking.serviceType === 'grooming') {
            return 'Grooming';
        } else {
            return 'Overnight Stay';
        }
    };
    
    // Get service type badge class
    const serviceTypeBadgeClass = booking.serviceType === 'grooming' ? 'service-grooming' : 'service-overnight';
    
    // Handle status change with confirmation
    const handleStatusChange = (newStatus, event) => {
        // Prevent the click from toggling the expanded state
        event.stopPropagation();
        onStatusChange(booking.id, newStatus);
    };
    
    return (
        <div 
            className={`booking-item ${expanded ? 'selected' : ''}`}
            onClick={() => setExpanded(!expanded)}
        >
            <div className="booking-header">
                <span className="pet-name">{booking.petName}</span>
                <div className="booking-badges">
                    <span className={`service-type-badge ${serviceTypeBadgeClass}`}>
                        {booking.serviceType === 'grooming' ? 'Grooming' : 'Overnight'}
                    </span>
                    <span className={statusClass}>{statusText}</span>
                </div>
            </div>
            <div className="booking-dates">
                {formatDateRange(booking.checkIn, booking.checkOut)}
            </div>
            
            <div className="booking-details">
                <div className="pet-avatar">{petInitial}</div>
                <div className="booking-info">
                    <div>{booking.petType} - {booking.breed}</div>
                    <div className="owner-info">Owner: {booking.owner} • {booking.contactNumber}</div>
                    <div className="service-info">{getServiceTypeDisplay()}{booking.selectedSize ? ` - ${booking.selectedSize.charAt(0).toUpperCase() + booking.selectedSize.slice(1)} Size` : ''}</div>
                </div>
            </div>
            
            {expanded && (
                <div className="expanded-content">
                    <div className="notes-section">
                        <p><strong>Notes:</strong> {booking.notes || 'No additional notes'}</p>
                    </div>
                    
                    <div className="booking-actions">
                        {booking.status === 'pending' && (
                            <>
                                <button className="btn btn-success" onClick={(e) => handleStatusChange('confirmed', e)}>Confirm</button>
                                <button className="btn btn-danger" onClick={(e) => handleStatusChange('cancelled', e)}>Cancel</button>
                            </>
                        )}
                        {booking.status === 'confirmed' && (
                            <>
                                <button className="btn btn-primary" onClick={(e) => handleStatusChange('completed', e)}>Mark as Completed</button>
                                <button className="btn btn-danger" onClick={(e) => handleStatusChange('cancelled', e)}>Cancel</button>
                            </>
                        )}
                        {(booking.status === 'completed' || booking.status === 'cancelled') && (
                            <p>This booking is {booking.status}. No further actions available.</p>
                        )}
                    </div>
                    
                    {booking.feedback && (
                        <div className="feedback-section mt-3">
                            <p><strong>Customer Feedback:</strong> {booking.feedback.rating}/5</p>
                            <p>{booking.feedback.comment || 'No comment provided.'}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// Main AdminDashboard Component
function AdminDashboard() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [statusFilter, setStatusFilter] = useState('all');
    const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showHistoryFilter, setShowHistoryFilter] = useState(false);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [confirmationAction, setConfirmationAction] = useState({ bookingId: null, newStatus: null });
    const [showFeedbackPanel, setShowFeedbackPanel] = useState(false);
    const [showUnavailableDateDialog, setShowUnavailableDateDialog] = useState(false);
    const [dateToToggle, setDateToToggle] = useState(null);
    const [isAddingUnavailableDate, setIsAddingUnavailableDate] = useState(false);
    
    // Use the booking context to access booking data and functions
    const { 
        bookings, 
        unavailableDates,
        isLoading, 
        error, 
        fetchBookings, 
        updateBookingStatus,
        addUnavailableDate,
        removeUnavailableDate,
        isDateUnavailable
    } = useBookings();
    
    // Fetch bookings when component mounts
    useEffect(() => {
        // The fetchBookings function is now provided by the context
        fetchBookings();
    }, [fetchBookings]);
    
    // Filter bookings based on selected date, status, service type, search query, and history filter
    const filteredBookings = bookings.filter(booking => {
        const bookingStart = new Date(booking.checkIn);
        const bookingEnd = new Date(booking.checkOut);
        
        // Date matching logic - if history filter is on, show all past bookings
        const isDateMatch = showHistoryFilter ? 
            (bookingEnd < new Date()) : // For history, show bookings that have ended
            (selectedDate >= bookingStart && selectedDate <= bookingEnd); // Normal date filtering
        
        // Status matching
        const isStatusMatch = statusFilter === 'all' || booking.status === statusFilter;
        
        // Service type matching
        const isServiceTypeMatch = serviceTypeFilter === 'all' || booking.serviceType === serviceTypeFilter;
        
        // Search query matching - check if owner name contains the search query (case insensitive)
        const isSearchMatch = searchQuery === '' || 
            booking.owner.toLowerCase().includes(searchQuery.toLowerCase());
        
        return isDateMatch && isStatusMatch && isServiceTypeMatch && isSearchMatch;
    });
    
    // Function to handle month navigation
    const changeMonth = (amount) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + amount);
        setCurrentDate(newDate);
    };
    
    // Check if a date has bookings
    const hasBookings = (date) => {
        return bookings.some(booking => {
            const bookingStart = new Date(booking.checkIn);
            const bookingEnd = new Date(booking.checkOut);
            
            // Normalize dates for comparison by setting time to midnight
            const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const normalizedStart = new Date(bookingStart.getFullYear(), bookingStart.getMonth(), bookingStart.getDate());
            const normalizedEnd = new Date(bookingEnd.getFullYear(), bookingEnd.getMonth(), bookingEnd.getDate());
            
            return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
        });
    };
    
    // Count bookings for a specific date
    const countBookings = (date) => {
        return bookings.filter(booking => {
            const bookingStart = new Date(booking.checkIn);
            const bookingEnd = new Date(booking.checkOut);
            
            // Normalize dates for comparison by setting time to midnight
            const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const normalizedStart = new Date(bookingStart.getFullYear(), bookingStart.getMonth(), bookingStart.getDate());
            const normalizedEnd = new Date(bookingEnd.getFullYear(), bookingEnd.getMonth(), bookingEnd.getDate());
            
            return normalizedDate >= normalizedStart && normalizedDate <= normalizedEnd;
        }).length;
    };
    
    // Format date for display
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'long',
            year: 'numeric'
        }).format(date);
    };
    
    // Format date range for bookings
    const formatDateRange = (start, end) => {
        const startStr = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric'
        }).format(start);
        
        const endStr = new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric'
        }).format(end);
        
        return `${startStr} - ${endStr}`;
    };
    
    // Show confirmation dialog before changing status
    const promptStatusChange = (bookingId, newStatus) => {
        setConfirmationAction({ bookingId, newStatus });
        setShowConfirmationDialog(true);
    };
    
    // Handle booking status changes after confirmation
    const handleStatusChange = async () => {
        try {
            const { bookingId, newStatus } = confirmationAction;
            const result = await updateBookingStatus(bookingId, newStatus);
            if (result.success) {
                // Refresh bookings after status update
                fetchBookings();
            } else {
                alert(result.message || 'Failed to update booking status');
            }
        } catch (error) {
            console.error('Error updating booking status:', error);
            alert('An error occurred while updating the booking status');
        } finally {
            setShowConfirmationDialog(false);
        }
    };
    
    // Cancel the status change
    const cancelStatusChange = () => {
        setShowConfirmationDialog(false);
        setConfirmationAction({ bookingId: null, newStatus: null });
    };
    
    // Handle toggling a date's availability
    const handleToggleUnavailableDate = (date) => {
        setDateToToggle(date);
        setIsAddingUnavailableDate(!isDateUnavailable(date));
        setShowUnavailableDateDialog(true);
    };
    
    // Confirm toggling a date's availability
    const confirmToggleUnavailableDate = async () => {
        if (isAddingUnavailableDate) {
            await addUnavailableDate(dateToToggle);
        } else {
            await removeUnavailableDate(dateToToggle);
        }
        setShowUnavailableDateDialog(false);
    };
    
    // Cancel toggling a date's availability
    const cancelToggleUnavailableDate = () => {
        setShowUnavailableDateDialog(false);
        setDateToToggle(null);
    };
    
    return (
        <div className="app-container">
            <header>
                <h1>Pet Hotel Admin Dashboard</h1>
                <div className="user-info">
                    <span>Admin</span>
                    <div className="user-avatar">A</div>
                </div>
            </header>
            
            {/* Booking Status Confirmation Dialog */}
            {showConfirmationDialog && (
                <div className="confirmation-dialog-overlay">
                    <div className="confirmation-dialog">
                        <h3>Confirmation</h3>
                        <p>Are you sure you want to change this booking's status?</p>
                        <div className="confirmation-buttons">
                            <button className="btn btn-secondary" onClick={cancelStatusChange}>No</button>
                            <button className="btn btn-primary" onClick={handleStatusChange}>Yes</button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* Unavailable Date Confirmation Dialog */}
            {showUnavailableDateDialog && (
                <ConfirmationDialog
                    show={showUnavailableDateDialog}
                    onHide={cancelToggleUnavailableDate}
                    onConfirm={confirmToggleUnavailableDate}
                    title="Date Availability"
                    message={isAddingUnavailableDate ? 
                        "Do you want to mark this date as unavailable? Users will not be able to book on this date." : 
                        "Do you want to make this date available again? Users will be able to book on this date."}
                />
            )}
            
            <div className="dashboard">
                {/* Calendar section */}
                <div className="calendar-container">
                    <Calendar 
                        currentDate={currentDate}
                        selectedDate={selectedDate}
                        onDateSelect={setSelectedDate}
                        onChangeMonth={changeMonth}
                        hasBookings={hasBookings}
                        countBookings={countBookings}
                        formatDate={formatDate}
                        onToggleUnavailableDate={handleToggleUnavailableDate}
                        isDateUnavailable={isDateUnavailable}
                    />
                    
                    <div className="calendar-instructions mt-3">
                        <p><small>Right-click on a date to mark it as unavailable/available.</small></p>
                        <div className="calendar-legend">
                            <span className="legend-item"><span className="legend-color has-bookings-legend"></span> Has Bookings</span>
                            <span className="legend-item"><span className="legend-color unavailable-legend"></span> Unavailable</span>
                        </div>
                    </div>
                </div>
                
                {/* Bookings section */}
                <div className="bookings-container">
                    <div className="bookings-header">
                        <h2>Bookings</h2>
                        <button className="add-booking-btn">
                            + Add Booking
                        </button>
                    </div>
                    
                    <div className="filter-container">
                        <div className="search-bar-container mb-3">
                            <input
                                type="text"
                                className="search-bar"
                                placeholder="Search by pet owner name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <div className="filters-row">
                            <select 
                                className="filter-dropdown"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                style={{ marginRight: '10px' }}
                            >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="history">History</option>
                            </select>
                            
                            <select
                                className="filter-dropdown"
                                value={serviceTypeFilter}
                                onChange={(e) => setServiceTypeFilter(e.target.value)}
                                style={{ marginRight: '10px' }}
                            >
                                <option value="all">All Services</option>
                                <option value="overnight">Overnight & Daycare</option>
                                <option value="grooming">Grooming</option>
                            </select>
                            
                            <div className="history-filter-toggle">
                                <label className="toggle-label">
                                    <input
                                        type="checkbox"
                                        checked={showHistoryFilter}
                                        onChange={() => setShowHistoryFilter(!showHistoryFilter)}
                                    />
                                    <span className="ml-2">Show History</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <BookingsList 
                        bookings={filteredBookings} 
                        formatDateRange={formatDateRange}
                        selectedDate={selectedDate}
                        onStatusChange={promptStatusChange}
                        showHistoryFilter={showHistoryFilter}
                    />
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;