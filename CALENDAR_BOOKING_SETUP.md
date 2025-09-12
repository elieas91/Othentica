# Calendar Booking Feature Setup

This document explains how to set up and use the calendar booking feature that has been added to the Contact Us form.

## Features

- **Date Picker**: Users can select a date for their appointment
- **Time Slots**: Predefined time slots from 9:00 AM to 6:00 PM (30-minute intervals)
- **Validation**: Business hours validation (Monday-Friday, 9 AM - 6 PM)
- **Google Calendar Integration**: Opens Google Calendar with pre-filled event details
- **Responsive Design**: Works on both desktop and mobile devices

## Components Added

### 1. CalendarBooking Component
- Location: `src/components/ui/CalendarBooking.jsx`
- Features: Modal with date/time picker, validation, and Google Calendar integration

### 2. Calendar Service
- Location: `src/services/calendarService.js`
- Features: Event creation, validation, and Google Calendar URL generation

## How It Works

1. User clicks the calendar button (green button with calendar icon)
2. A modal opens with date and time selection
3. User selects a date and time slot
4. System validates the appointment (business hours, future date, etc.)
5. Makes POST request to your Google Apps Script web app
6. Google Apps Script creates the event directly in your calendar
7. User receives confirmation that the appointment was booked

## Google Calendar Integration

The implementation now uses Google Apps Script to directly create calendar events:

### Google Apps Script Setup
1. Go to [Google Apps Script](https://script.google.com/)
2. Create a new project
3. Add the following code:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const { start, end, title } = data;
    
    // Create calendar event
    const event = CalendarApp.getDefaultCalendar().createEvent(
      title,
      new Date(start),
      new Date(end),
      {
        description: 'Scheduled appointment through website booking system',
        location: 'Amber Gem Tower, Mezzanine Floor, Sheikh Khalifa Street, Ajman, United Arab Emirates'
      }
    );
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, eventId: event.getId() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Deploy as a web app:
   - Click "Deploy" > "New deployment"
   - Choose "Web app" as the type
   - Set "Execute as" to "Me"
   - Set "Who has access" to "Anyone"
   - Click "Deploy"
   - Copy the web app URL

### How It Works
- User selects date and time
- System validates the appointment
- Makes POST request to your Google Apps Script web app
- Google Apps Script creates the event in your calendar
- User receives confirmation

## Environment Variables (Optional)

To enhance the integration, you can add these environment variables:

```env
REACT_APP_GOOGLE_CALENDAR_API_KEY=your_api_key_here
REACT_APP_GOOGLE_CALENDAR_ID=your_calendar_id_here
```

## Customization

### Time Slots
Modify the `getAvailableTimeSlots` method in `calendarService.js` to change:
- Business hours
- Time intervals
- Available days

### Event Details
Update the `formatAppointmentData` method to customize:
- Event title
- Description
- Location
- Duration
- Attendees

### Styling
The component uses Tailwind CSS classes and can be customized by modifying the className props.

## Dependencies Added

- `react-datepicker`: For date selection
- `googleapis`: For Google Calendar API integration (future use)

## Future Enhancements

1. **Server-side Integration**: Implement backend API to directly create calendar events
2. **Real-time Availability**: Check actual calendar availability
3. **Email Notifications**: Send confirmation emails
4. **Calendar Sync**: Two-way sync with your calendar
5. **Recurring Appointments**: Support for recurring bookings

## Testing

To test the feature:
1. Start the development server: `npm run dev`
2. Navigate to the Contact page
3. Click the green calendar button
4. Select a date and time
5. Click "Book Appointment"
6. Verify Google Calendar opens with correct details

## Troubleshooting

- **Date Picker Not Showing**: Ensure `react-datepicker` CSS is imported
- **Google Calendar Not Opening**: Check browser popup blockers
- **Validation Errors**: Verify business hours and date constraints
- **Styling Issues**: Check Tailwind CSS configuration

## Security Notes

- Current implementation is client-side only
- For production, implement server-side authentication
- Consider rate limiting for booking requests
- Validate all user inputs on the server side
