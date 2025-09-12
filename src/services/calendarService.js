// Google Calendar API Service
// This service handles calendar integration for booking appointments

class CalendarService {
  constructor() {
    this.apiKey = process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY;
    this.calendarId = process.env.REACT_APP_GOOGLE_CALENDAR_ID || 'primary';
    // Your Google Apps Script web app URL
    this.webAppUrl = 'https://script.google.com/macros/s/AKfycbzWVq1hWb3kFGQY_KOmQwZC4kB3NAxowamIKnYl0xPrReSmyb5Sz2AKrQ1MiJq87W21HQ/exec';
  }

  // Create a Google Calendar event using Google Apps Script
  async createEvent(eventData) {
    try {
      // Use Google Apps Script web app to create the event
      return await this.createEventWithAppsScript(eventData);
    } catch (error) {
      console.error('Error creating calendar event:', error);
      
      // If it's a CORS error, fallback to Google Calendar URL method
      if (error.message === 'CORS_ERROR') {
        return this.createGoogleCalendarUrl(eventData);
      }
      
      // For other errors, also fallback to Google Calendar URL method
      return this.createGoogleCalendarUrl(eventData);
    }
  }

  // Create event using Google Apps Script web app
  async createEventWithAppsScript(eventData) {
    const { startDateTime, endDateTime, title } = eventData;
    
    try {
      const response = await fetch(this.webAppUrl, {
        method: "POST",
        mode: 'cors', // Enable CORS
        body: JSON.stringify({
          start: startDateTime.toISOString(), // ISO string: "2025-09-15T14:00:00"
          end: endDateTime.toISOString(),     // ISO string
          title: title || "Website Meeting"
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      // If CORS fails, throw a specific error to trigger fallback
      if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
        throw new Error('CORS_ERROR');
      }
      throw error;
    }
  }

  // Create a Google Calendar URL for adding events
  createGoogleCalendarUrl(eventData) {
    const {
      title,
      description,
      startDateTime,
      endDateTime,
      location,
      attendees = []
    } = eventData;

    // Format dates for Google Calendar URL
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const start = formatDate(startDateTime);
    const end = formatDate(endDateTime);

    // Create attendees string
    const attendeesString = attendees.map(email => `&add=${email}`).join('');

    // Create the Google Calendar URL
    const baseUrl = 'https://calendar.google.com/calendar/render';
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${start}/${end}`,
      details: description,
      location: location,
      trp: 'false', // Don't show as busy
      sf: 'true', // Show as free
      output: 'xml'
    });

    return `${baseUrl}?${params.toString()}${attendeesString}`;
  }

  // Alternative method using Google Calendar API (requires server-side implementation)
  async createEventWithAPI(eventData) {
    // This would require a backend service to handle OAuth2 authentication
    // and make the actual API calls to Google Calendar
    const response = await fetch('/api/calendar/create-event', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      throw new Error('Failed to create calendar event');
    }

    return response.json();
  }

  // Validate appointment time (check for conflicts, business hours, etc.)
  validateAppointmentTime(dateTime) {
    const now = new Date();
    const appointmentDate = new Date(dateTime);

    // Check if appointment is in the future
    if (appointmentDate <= now) {
      return { valid: false, message: 'Appointment must be scheduled for a future date and time.' };
    }

    // Check if appointment is within business hours (9 AM - 6 PM, Monday-Friday)
    const dayOfWeek = appointmentDate.getDay();
    const hour = appointmentDate.getHours();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return { valid: false, message: 'Appointments are only available Monday through Friday.' };
    }

    if (hour < 9 || hour >= 18) {
      return { valid: false, message: 'Appointments are only available between 9:00 AM and 6:00 PM.' };
    }

    // Check if appointment is not more than 90 days in advance
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    if (appointmentDate > maxDate) {
      return { valid: false, message: 'Appointments can only be scheduled up to 90 days in advance.' };
    }

    return { valid: true };
  }

  // Get available time slots for a given date
  getAvailableTimeSlots(date) {
    // Validate the date parameter
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return [];
    }

    // Check if the date is a weekday (Monday-Friday)
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return []; // No appointments on weekends
    }

    // Check if the date is in the past
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const appointmentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (appointmentDate < today) {
      return []; // No appointments in the past
    }

    const timeSlots = [];
    const startHour = 9; // 9 AM
    const endHour = 18; // 6 PM

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        timeSlots.push(timeString);
      }
    }

    return timeSlots;
  }

  // Format appointment data for display
  formatAppointmentData(selectedDate, selectedTime) {
    const startDateTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // 1 hour duration

    return {
      title: 'Appointment with Othentica',
      description: 'Scheduled appointment through website booking system. Please arrive 10 minutes early.',
      startDateTime,
      endDateTime,
      location: 'Amber Gem Tower, Mezzanine Floor, Sheikh Khalifa Street, Ajman, United Arab Emirates',
      attendees: ['info@othentica-app.com'],
      duration: 60 // minutes
    };
  }
}

export default new CalendarService();
