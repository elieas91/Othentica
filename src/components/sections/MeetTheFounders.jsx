import { teamData } from '../../data/teamData';
import LinkedInIcon from '../../assets/img/linkedin_icon.webp';
import WhatsappIcon from '../../assets/img/whatsapp_icon.webp';
import EmailIcon from '../../assets/img/email_icon.webp';
import WhatsAppButton from '../ui/WhatsappButton';
import AnimateOnScroll from '../ui/AnimateOnScroll';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Swal from 'sweetalert2';
import { CalendarIcon, ClockIcon } from '@heroicons/react/24/solid';
import hibaCalendarService from '../../services/hibaCalendarService';

const MeetTheFounders = () => {
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

    // Double-check that the selected date is Monday-Thursday
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek < 1 || dayOfWeek > 4) {
      Swal.fire({
        title: 'Invalid Day',
        text: 'Appointments with Hiba are only available Monday through Thursday.',
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

  // Filter function to only allow Monday-Thursday
  const isWeekday = (date) => {
    const day = date.getDay();
    return day >= 1 && day <= 4; // Monday = 1, Thursday = 4
  };

  return (
    <section className="pt-20 px-0" id="meet">
      <div className="max-w-[90%] w-full mx-auto">
        <AnimateOnScroll animation="fadeInUp" delay={100}>
          <div className="text-center mb-16">
            <h2 className="text-6xl font-bold text-primary dark:text-neutral mb-4">
              Meet the Founders
            </h2>
          </div>
        </AnimateOnScroll>

        {/* Team Members */}
        {teamData.map((member, index) => (
          <AnimateOnScroll 
            key={member.id}
            animation={index % 2 === 0 ? "fadeInLeft" : "fadeInRight"} 
            delay={200 + (index * 200)}
            duration={800}
          >
            <div
              className={`flex flex-col md:flex-row items-center gap-10 px-4 mx-auto pt-10 ${
                index % 2 !== 0 ? 'p-0' : 'pt-20'
              } ${
                index % 2 === 0 ? ' bg-white mb-16 p-4' : 'bg-white'
              } rounded-2xl `}
            >
            {/* Text Content - Position changes based on flipped property */}
            <div
              className={`flex flex-col w-full md:w-1/2 ${
                member.flipped ? 'order-1 md:order-2' : 'order-2 md:order-1'
              }`}
            >
              <h3 className="text-5xl text-center md:text-left font-bold font-poppins capitalize text-secondary dark:text-neutral mb-6">
                {member.subtitle}
              </h3>
              {/* Name in outlined box */}
              <div className="self-center md:self-start border-2 border-primary dark:border-neutral rounded-lg px-4 py-2 mb-6">
                <span className="text-xl font-bold text-primary dark:text-neutral">
                  {member.name}
                </span>
              </div>
              <h1 className="text-xl font-normal text-primary font-sans dark:text-neutral mb-6">
                {Array.isArray(member.description) &&
                  member.description.map((paragraph, index) => (
                    <p key={index} className={index === 0 ? '' : 'mt-3'}>
                      {paragraph}
                    </p>
                  ))}

                {/* Name and role */}
                <p className="mt-6 font-bold">{member.name}</p>
                {Array.isArray(member.role) ? (
                  member.role.map((role, idx) => (
                    <p key={idx} className="font-bold">
                      {role}
                    </p>
                  ))
                ) : (
                  <p className="font-bold">{member.role}</p>
                )}
              </h1>
            </div>

            {/* Image Section - Position changes based on flipped property */}
            <div className={`w-full md:w-1/2 ${member.flipped ? 'order-1' : 'order-2'}`}>
              <div className="relative h-fit overflow-visible rounded-lg flex justify-center items-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-2/3 object-cover"
                  style={{
                    WebkitMaskImage: `
                      radial-gradient(ellipse 80% 80% at center, black 60%, transparent 70%),
                      linear-gradient(to bottom, black 90%, transparent 100%)
                    `,
                    WebkitMaskComposite: 'destination-in', // keeps the intersection
                    maskComposite: 'intersect', // for standard syntax
                  }}
                />
                {/* Social Media Buttons */}
                <div
                  className={`absolute top-1/2 transform -translate-y-1/2 space-y-3 ${
                    member.flipped 
                      ? 'left-0 md:left-[10%] -translate-x-2 md:translate-x-0' 
                      : 'right-0 -translate-x-2 md:translate-x-1/2'
                  }`}
                >
                  {/* Book a Meeting Button - Only for first founder (Hiba Tarazi) */}
                  {index === 0 && (
                    <button
                      onClick={openModal}
                      className="w-28 md:w-36 h-10 md:h-12 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-start cursor-pointer hover:scale-105 transition-transform shadow-lg px-2 gap-x-1 md:gap-x-2"
                      title="Book a Meeting with Hiba"
                    >
                      <CalendarIcon className="w-6 h-6" />
                      <span className="ml-2 font-semibold text-sm">
                        Book with Hiba
                      </span>
                    </button>
                  )}

                  {/* LinkedIn Button */}
                  <a
                    href={member.socialMedia.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-28 md:w-36 h-10 md:h-12 bg-[#007ebb] rounded-lg flex items-center justify-start cursor-pointer hover:scale-105 transition-transform shadow-lg px-2 gap-x-1 md:gap-x-2"
                  >
                    <img src={LinkedInIcon} className="w-6 md:w-8" />
                    <span className="text-white font-semibold text-xs md:text-sm">
                      LinkedIn
                    </span>
                  </a>

                  <WhatsAppButton type="rectangle" />

                  {/* Email Button */}
                  <a
                    href={`mailto:${member.socialMedia.email}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-28 md:w-36 h-10 md:h-12 bg-[#d77644] rounded-lg flex items-center justify-start cursor-pointer hover:scale-105 transition-transform shadow-lg px-2 gap-x-1 md:gap-x-2"
                  >
                    <img src={EmailIcon} className="w-6 md:w-8" />
                    <span className="text-white font-semibold text-xs md:text-sm">
                      Email
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          </AnimateOnScroll>
        ))}
      </div>

      {/* Full-Screen Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999] p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white w-full h-full flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h3 className="text-3xl font-bold text-gray-800">Book with Hiba Tarazi</h3>
                <p className="text-sm text-gray-600 mt-1">Available Monday-Thursday, 11:00 AM - 3:00 PM</p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-4xl font-bold"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Side - Form */}
                  <div className="space-y-8">
                    {/* Hiba's Info */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-2xl">H</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-semibold text-gray-800">Hiba Tarazi</h4>
                          <p className="text-gray-600">CEO & Co-founder, Othentica</p>
                          <p className="text-sm text-gray-500">M.Ed | Author | Wellness Expert</p>
                        </div>
                      </div>
                    </div>

                    {/* Date Picker */}
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-4">
                        <CalendarIcon className="w-6 h-6 inline mr-2" />
                        Select Date
                      </label>
                      <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        minDate={new Date()}
                        maxDate={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)} // 90 days from now
                        filterDate={isWeekday} // Only allow Monday-Thursday
                        dateFormat="dd/MM/yyyy"
                        className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                        placeholderText="Choose a date (Mon-Thu only)"
                        showPopperArrow={false}
                      />
                    </div>

                    {/* Time Picker */}
                    <div>
                      <label className="block text-lg font-medium text-gray-700 mb-4">
                        <ClockIcon className="w-6 h-6 inline mr-2" />
                        Select Time
                      </label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
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
                      <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                        <h4 className="text-xl font-semibold text-green-800 mb-4">Appointment Details:</h4>
                        <div className="space-y-2">
                          <p className="text-lg text-green-700">
                            <strong>Date:</strong> {selectedDate.toLocaleDateString('en-GB')}
                          </p>
                          <p className="text-lg text-green-700">
                            <strong>Time:</strong> {selectedTime}
                          </p>
                          <p className="text-lg text-green-700">
                            <strong>Duration:</strong> 45 minutes
                          </p>
                          <p className="text-lg text-green-700">
                            <strong>Type:</strong> Video Call
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Side - Additional Info */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">What to Expect:</h4>
                    <div className="space-y-4 text-gray-600">
                      <p>• 45-minute consultation with Hiba Tarazi</p>
                      <p>• Available Monday to Thursday, 11:00 AM - 3:00 PM</p>
                      <p>• Discuss your wellness goals and challenges</p>
                      <p>• Learn how Othentica can support your journey</p>
                      <p>• Get personalized recommendations</p>
                      <p>• Video call link will be provided via email</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex gap-4 justify-end">
                <button
                  onClick={closeModal}
                  className="px-8 py-3 text-gray-600 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBooking}
                  disabled={!selectedDate || !selectedTime || isBooking}
                  className={`px-8 py-3 text-white rounded-lg transition-colors text-lg font-medium ${
                    !selectedDate || !selectedTime || isBooking
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isBooking ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2"
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
        </div>,
        document.body
      )}
    </section>
  );
};

export default MeetTheFounders;
