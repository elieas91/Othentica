// Hiba's Google Calendar API Service
// This service handles calendar integration specifically for Hiba's appointments

class HibaCalendarService {
  constructor() {
    this.apiKey = process.env.REACT_APP_GOOGLE_CALENDAR_API_KEY;
    this.calendarId = process.env.REACT_APP_GOOGLE_CALENDAR_ID || 'primary';
    // Hiba's specific Google Apps Script web app URL
    this.webAppUrl = 'https://script.google.com/macros/s/AKfycbylMU3n6Fg9jYRrP4Jb_2AyIJH8tAMrnXiKjBoPd76mKjYxcJCpAOD1k7zc6Tk19GxdBA/exec';
  }

  // Create a Google Calendar event using Hiba's Google Apps Script
  async createEvent(eventData) {
    try {
      // Use Hiba's Google Apps Script web app to create the event
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

  // Create event using Hiba's Google Apps Script web app
  async createEventWithAppsScript(eventData) {
    const { startDateTime, endDateTime, title } = eventData;
    
    try {
      const response = await fetch(this.webAppUrl, {
        method: "POST",
        mode: 'cors', // Enable CORS
        body: JSON.stringify({
          start: startDateTime.toISOString(), // ISO string: "2025-09-15T14:00:00"
          end: endDateTime.toISOString(),     // ISO string
          title: title || "Meeting with Hiba Tarazi - Othentica"
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

  // Validate appointment time (check for conflicts, business hours, etc.)
  validateAppointmentTime(dateTime) {
    const now = new Date();
    const appointmentDate = new Date(dateTime);

    // Check if appointment is in the future
    if (appointmentDate <= now) {
      return { valid: false, message: 'Appointment must be scheduled for a future date and time.' };
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

    // Check if the date is in the past
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const appointmentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (appointmentDate < today) {
      return []; // No appointments in the past
    }

    // Check if it's Monday to Thursday (1-4)
    const dayOfWeek = appointmentDate.getDay();
    if (dayOfWeek < 1 || dayOfWeek > 4) {
      return []; // No appointments on weekends or Friday
    }

    const timeSlots = [];
    
    // Generate time slots for Monday to Thursday: 11:00 AM to 3:00 PM
    // Each appointment is 45 minutes with 15-minute breaks
    // Available slots: 11:00-11:45, 12:00-12:45, 13:00-13:45, 14:00-14:45
    const startHour = 11; // 11 AM
    const endHour = 15; // 3 PM (last appointment ends at 2:45 PM)
    
    for (let hour = startHour; hour < endHour; hour++) {
      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      timeSlots.push(timeString);
    }

    return timeSlots;
  }

  // Format appointment data for Hiba's calendar
  formatAppointmentData(selectedDate, selectedTime) {
    const startDateTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 45 * 60 * 1000); // 45 minutes duration

    return {
      title: 'Meeting with Hiba Tarazi - Othentica',
      description: 'Scheduled appointment with Hiba Tarazi, CEO & Co-founder of Othentica. This is a 45-minute consultation to discuss your wellness goals and how Othentica can help you achieve them.',
      startDateTime,
      endDateTime,
      location: 'Video Call (Link will be provided)',
      attendees: ['hiba.tarazi@othentica-app.com'],
      duration: 45 // minutes
    };
  }
}

export default new HibaCalendarService();
