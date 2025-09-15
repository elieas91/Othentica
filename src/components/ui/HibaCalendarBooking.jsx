import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/solid';
import hibaCalendarService from '../../services/hibaCalendarService';

const HibaCalendarBooking = ({ className = '', showText = false }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Get available time slots from Hiba's calendar service
  const timeSlots = hibaCalendarService.getAvailableTimeSlots(selectedDate);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please select both date and time for your appointment with Hiba.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    setIsBooking(true);

    try {
      // Format the appointment data
      const appointmentData = hibaCalendarService.formatAppointmentData(selectedDate, selectedTime);
      
      // Validate the appointment time
      const validation = hibaCalendarService.validateAppointmentTime(appointmentData.startDateTime);
      if (!validation.valid) {
        Swal.fire({
          title: 'Invalid Appointment Time',
          text: validation.message,
          icon: 'warning',
          confirmButtonText: 'OK',
          confirmButtonColor: '#3b82f6',
        });
        return;
      }

      // Create the calendar event using Hiba's Google Apps Script
      const result = await hibaCalendarService.createEvent(appointmentData);

      // Check if result is a URL (fallback method) or success object
      if (typeof result === 'string' && result.startsWith('http')) {
        // Fallback to Google Calendar URL method
        window.open(result, '_blank');
        
        Swal.fire({
          title: 'Calendar Opened!',
          text: 'Google Calendar has opened in a new tab. Please add the event to your calendar.',
          icon: 'success',
          confirmButtonText: 'Great!',
          confirmButtonColor: '#3b82f6',
          timer: 5000,
          timerProgressBar: true,
        });
      } else {
        // Direct calendar event creation was successful
        Swal.fire({
          title: 'Appointment Booked!',
          text: 'Your appointment with Hiba has been successfully scheduled. You will receive a confirmation email shortly.',
          icon: 'success',
          confirmButtonText: 'Great!',
          confirmButtonColor: '#3b82f6',
          timer: 5000,
          timerProgressBar: true,
        });
      }

      setShowModal(false);
      setSelectedDate(null);
      setSelectedTime('');

    } catch (error) {
      console.error('Booking error:', error);
      
      // Check if it's a network error or API error
      const errorMessage = error.message.includes('HTTP error') 
        ? 'Unable to connect to the booking service. Please try again later.'
        : 'There was an error booking your appointment with Hiba. Please try again.';
        
      Swal.fire({
        title: 'Booking Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Try Again',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setIsBooking(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setSelectedTime('');
  };

  return (
    <>
      {/* Calendar Button */}
      <button
        onClick={openModal}
        className={`${className} ${showText ? 'rounded-lg' : 'rounded-full'} bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors shadow-lg hover:shadow-xl`}
        title="Book a Meeting with Hiba"
      >
        <CalendarIcon className="w-6 h-6" />
        {showText && (
          <span className="ml-2 font-semibold text-sm">
            Book with Hiba
          </span>
        )}
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Book with Hiba Tarazi</h3>
                  <p className="text-sm text-gray-600 mt-1">Available Monday-Thursday, 11:00 AM - 3:00 PM</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Hiba's Info */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">H</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Hiba Tarazi</h4>
                      <p className="text-sm text-gray-600">CEO & Co-founder, Othentica</p>
                      <p className="text-xs text-gray-500">M.Ed | Author | Wellness Expert</p>
                    </div>
                  </div>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CalendarIcon className="w-4 h-4 inline mr-1" />
                    Select Date
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    minDate={new Date()}
                    maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)} // 90 days from now
                    dateFormat="dd/MM/yyyy"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholderText="Choose a date"
                    showPopperArrow={false}
                  />
                </div>

                {/* Time Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ClockIcon className="w-4 h-4 inline mr-1" />
                    Select Time
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Choose a time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Selected Appointment Info */}
                {selectedDate && selectedTime && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-2">Appointment Details:</h4>
                    <p className="text-green-700">
                      <strong>Date:</strong> {selectedDate.toLocaleDateString('en-GB')}
                    </p>
                    <p className="text-green-700">
                      <strong>Time:</strong> {selectedTime}
                    </p>
                    <p className="text-green-700">
                      <strong>Duration:</strong> 45 minutes
                    </p>
                    <p className="text-green-700">
                      <strong>Type:</strong> Video Call
                    </p>
                  </div>
                )}

                {/* Meeting Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">What to Expect:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>• 45-minute consultation with Hiba Tarazi</p>
                    <p>• Available Monday to Thursday, 11:00 AM - 3:00 PM</p>
                    <p>• Discuss your wellness goals and challenges</p>
                    <p>• Learn how Othentica can support your journey</p>
                    <p>• Get personalized recommendations</p>
                    <p>• Video call link will be provided via email</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={closeModal}
                    className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBooking}
                    disabled={!selectedDate || !selectedTime || isBooking}
                    className={`flex-1 px-4 py-3 text-white rounded-lg transition-colors ${
                      !selectedDate || !selectedTime || isBooking
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-500 hover:bg-green-600'
                    }`}
                  >
                    {isBooking ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Booking...
                      </div>
                    ) : (
                      'Book with Hiba'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HibaCalendarBooking;
