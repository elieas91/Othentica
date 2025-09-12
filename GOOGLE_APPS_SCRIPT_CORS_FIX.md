# Google Apps Script CORS Fix

The calendar booking feature is currently falling back to the Google Calendar URL method due to CORS (Cross-Origin Resource Sharing) restrictions. Here's how to fix it:

## The Problem
Google Apps Script web apps block requests from different domains by default for security reasons. This is why you're seeing "Failed to fetch" errors.

## Solution: Enable CORS in Google Apps Script

### Step 1: Update Your Google Apps Script Code

Replace your current Google Apps Script code with this CORS-enabled version:

```javascript
function doPost(e) {
  try {
    // Enable CORS
    const response = ContentService
      .createTextOutput(JSON.stringify({ success: false, error: "Method not allowed" }))
      .setMimeType(ContentService.MimeType.JSON);
    
    // Add CORS headers
    response.setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    
    // Handle preflight OPTIONS request
    if (e.parameter && e.parameter.method === 'OPTIONS') {
      return response;
    }
    
    const data = JSON.parse(e.postData.contents);
    const { start, end, title } = data;
    
    // Create calendar event
    const event = CalendarApp.getDefaultCalendar().createEvent(
      title || "Appointment with Othentica",
      new Date(start),
      new Date(end),
      {
        description: 'Scheduled appointment through website booking system. Please arrive 10 minutes early.',
        location: 'Amber Gem Tower, Mezzanine Floor, Sheikh Khalifa Street, Ajman, United Arab Emirates'
      }
    );
    
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: true, 
        eventId: event.getId(),
        message: "Appointment successfully created"
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

// Handle OPTIONS requests for CORS preflight
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}
```

### Step 2: Redeploy Your Web App

1. Go to your Google Apps Script project
2. Click "Deploy" > "Manage deployments"
3. Click the pencil icon to edit your existing deployment
4. Click "Deploy" to update it with the new CORS-enabled code

### Step 3: Test the Integration

After redeploying:
1. Go to your website's Contact page
2. Click the green calendar button
3. Select a date and time
4. Click "Book Appointment"

The appointment should now be directly added to your Google Calendar without opening a new tab!

## Alternative: Use a Proxy Server

If CORS continues to be an issue, you can create a simple proxy server or use a service like:
- Netlify Functions
- Vercel Functions
- AWS Lambda

## Current Fallback Behavior

Until the CORS issue is fixed, the system will:
1. Try to use Google Apps Script first
2. If that fails due to CORS, fall back to opening Google Calendar in a new tab
3. Show appropriate success messages for both scenarios

This ensures the calendar booking feature works regardless of the CORS configuration.
