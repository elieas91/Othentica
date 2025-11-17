import React, { useState } from 'react';
import DatePickerWrapper from './DatePickerWrapper';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/solid';
import calendarService from '../../services/calendarService';

const CalendarBooking = ({ className = '', showText = false }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Get available time slots from calendar service
  const timeSlots = calendarService.getAvailableTimeSlots(selectedDate);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please select both date and time for your appointment.',
        icon: 'warning',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    setIsBooking(true);

    try {
      // Format the appointment data
      const appointmentData = calendarService.formatAppointmentData(
        selectedDate,
        selectedTime
      );

      // Validate the appointment time
      const validation = calendarService.validateAppointmentTime(
        appointmentData.startDateTime
      );
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

      // Create the calendar event using Google Apps Script
      const result = await calendarService.createEvent(appointmentData);

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
          text: 'Your appointment has been successfully added to our calendar. You will receive a confirmation email shortly.',
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
        : 'There was an error booking your appointment. Please try again.';

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
        className={`${className} ${
          showText ? 'rounded-lg' : 'rounded-full'
        } bg-orange-500 text-white flex items-center justify-center transition-colors shadow-lg hover:shadow-xl`}
        title="Book an Appointment"
      >
        <CalendarIcon className="w-6 h-6" />
        {showText && (
          <span className="ml-2 font-semibold text-sm">Book Meeting</span>
        )}
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full h-fit max-w-4xl max-h-[95vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  Book an Appointment
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Date Picker */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <CalendarIcon className="w-4 h-4 inline mr-1" />
                    Select Date
                  </label>
                  <DatePickerWrapper
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
                    <h4 className="font-semibold text-green-800 mb-2">
                      Appointment Details:
                    </h4>
                    <p className="text-green-700">
                      <strong>Date:</strong>{' '}
                      {selectedDate.toLocaleDateString('en-GB')}
                    </p>
                    <p className="text-green-700">
                      <strong>Time:</strong> {selectedTime}
                    </p>
                    <p className="text-green-700">
                      <strong>Duration:</strong> 1 hour
                    </p>
                  </div>
                )}

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
                      'Book Appointment'
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

export default CalendarBooking;
