require('dotenv').config();
import { google } from 'googleapis';

export default async function handler(req, res) {
  const sheets = google.sheets('v4');

  const jwtClient = new google.auth.JWT(
    process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_SHEETS_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/spreadsheets']
  );

  jwtClient.authorize(async function (err, tokens) {
    if (err) {
      console.error('Authorization failed:', err);
      res.status(400).json({ message: 'Authentication failed' });
      return;
    }

    if (!req.body) {
      console.log('Body not found');
      res.status(400).json({ message: 'No data provided' });
    }

    const { date, url, browser } = req.body;

    console.log(`Request: ${date}, ${url}, ${browser}`);

    const request = {
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'Sheet1!A1',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [[date, url, browser]],
      },
    };

    try {
      const response = await sheets.spreadsheets.values.append({
        ...request,
        auth: jwtClient,
      });

      console.log('Data appended:', response.data);
      res.status(200).json({ message: 'Error logged successfully' });
    } catch (err) {
      console.error('Error appending data:', err);
      res.status(500).json({ message: 'Failed to log error' });
    }
  });
}
