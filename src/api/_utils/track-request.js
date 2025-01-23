require('dotenv').config();
import { google } from 'googleapis';

export default async function trackRequest({ date, endpoint, body, success }) {
  const sheets = google.sheets('v4');

  // todo fix issue with env variables + netlify format
  const key = `-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC3NHUX0IeeVYmm\nYWEopad0ZNiI/JLX3EIRGNfeDmxwPVBzx+0qdpzYxgeajJsyckT1fz1WOTOlVpC+\nyyQtLMjJWWAp/S/QdghCfkAipVYOZHH1uBZWG4crXM/uhaNgnhXy4CzUBxKDyA3h\nhWjM3Wy4QrfKt4ZFFKmQU9KyblgyPajcxz/XVqzKwR/2ZLEe9vP6XCx4i7mbTKUa\nrYTx+hGV9+OjOgoTlE/E47InmlYmt5kACADS6m7xCYnQrVKWC3PMzb2NYhRmCtAF\nF3t7KTotUsV58hZB1CB491Bo7HrwzUgXUjO18wt3TZOIO5mw4MbS2WIv1CLI1NhS\npj3MuLirAgMBAAECggEAC7m5RtFrZKhf23y/Da1whsQPkdDsixFHTzXSVx2ANjzO\nYeKpXL7jsgIWqX8XTca/gCDpKZQWqJ3ePL/erF+B6FUmkPlp7oMnay4OZ8lCNUCb\nhJkIIPG5GH7jtgXqm3vytq0/YUCkoDeVH9p8hyQi2bY3ciuF1fUJFzouMYpbbbel\n0GdUKNTT7rdRKEc8W0zegIJr6/d+Inyh72mehF+SsAn88w1eqxmOJQz+eyEeLP5V\nlx7i9EySVj8LZ5Aj2uTDnqDjsQsTlQkHeEXXNhjnFvdlZ5/p/zl184ooWh8wlxNJ\n/Wi88xbneCTOSo/K2pls10zhCtOZ6LLSrMSPboABWQKBgQDiBWKCUHWe5OCtwrWW\n+FDXb1VjS2EDlv1WGjemkzBSOGZbMSi0v/h7d87BFkciqyaVt1kRT+FZ6/wPgdWb\nGSLVqf177FLttkgMS1bHmwe3qmU//aBvf6WG+4Hz/tLxNE7vc62MUlMZUDkU9fIk\n7Gx614W54WmcV+mV8qGIxz7ueQKBgQDPgTzaFIkuo5xnHmPm8VLIsS0mGtzEPRWE\nCT7p0HSK7pINbrjSsFVp4oLMQfYzI+SXaX1XnyOnQ6YE0HEoLpjRMjFuR0OpaTNe\nbI72V+4rlDNpSZTmzbBvYLSgqXqwQxO/1S//zhL1K7tzxtx1I+RLcv9pdgRvK2OX\nmeSnKdMHQwKBgQCLikGILL6BS9L+1AAiZcobR4wTEn2hpr1fRC5pc+PYTyO6Vz5H\nYWG6cHxAL03ZtIrM0fZ2PrflOVFUDZdf+wPLn/h0YrHMOsZ+eKDp+Oep19RMznwX\neloqXOqdRgzbh6zYHrXdtRHCxgmHzFQjwaczrA3OdcErGgeHYNWjyUcsGQKBgQDA\nbJJnkX+dVm+lWJNACC3CmjrKCUMMX7DiHkjPPlW0uIOMHU8bYhXy+PBeRhTvW6uR\nlWt8o8DGTX9ZG4qzvnJMHIWmREPEiB/wwi7Y1rWwh+AdFPUWC0xAHKekDUYOykU4\nMZQvXYRLAuDz/kdWAZClPuEHhT+bb9sNLNLTCX/+TQKBgD8lPrUxMuS2d5Bn3OCD\n4wyJ230mStVgAhG0xfkyuoL37zHLhgQ6zXp1hG5seJ4FnkzlhRfRSl+dj/9w0dMp\nwYFNKYbjezCrcmPed1cNqFZuoOtjgb6GzdBAkxQwCXkqHSBJbVJatRxuJ5x9Gr3T\n/PfUvOnOsaVnwegQ6HmLjSK0\n-----END PRIVATE KEY-----`;

  const jwtClient = new google.auth.JWT(process.env.GOOGLE_SHEETS_CLIENT_EMAIL, null, key, [
    'https://www.googleapis.com/auth/spreadsheets',
  ]);

  jwtClient.authorize(async function (err, tokens) {
    if (err) {
      throw new Error('Failed to authorize Google Sheets API');
    }

    const request = {
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'CSL API Errors!A1',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [[date, endpoint, JSON.stringify(body), success]],
      },
    };

    try {
      const response = await sheets.spreadsheets.values.append({
        ...request,
        auth: jwtClient,
      });

      console.log('Data appended:', response.data);
    } catch (err) {
      console.error('Error appending data:', err);
      throw new Error('Failed to append data to Google Sheets');
    }
  });
}
