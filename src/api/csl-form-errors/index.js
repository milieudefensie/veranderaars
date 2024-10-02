require('dotenv').config();
const { google } = require('googleapis');

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
    }
    console.log('Authorization successful');

    if (!req.body) {
      res.status(400).json({ message: 'No data provided' });
    }

    const { date, url, browser } = req.body;

    const request = {
      spreadsheetId: process.env.SPREADSHEET_ID, // Replace with your spreadsheet ID
      range: 'Sheet1!A1', // Replace with your sheet name and range
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [
          [date, url, browser], // Add the data you want to append
        ],
      },
      auth: jwtClient,
    };

    try {
      const response = await sheets.spreadsheets.values.append(request);
      console.log('Data appended:', response.data);
      res.status(200).json({ message: 'Error logged successfully' });
    } catch (err) {
      console.error('Error appending data:', err);
      res.status(500).json({ message: 'Failed to log error' });
    }
  });

  // // Load client secrets from a local file.
  // const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json'); // Path to your credentials file
  // const TOKEN_PATH = path.join(__dirname, 'token.json'); // Path to your token file

  // async function authorize() {
  //   const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  //   const { client_secret, client_id, redirect_uris } = credentials.installed;
  //   const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  //   // Check if we have previously stored a token.
  //   if (fs.existsSync(TOKEN_PATH)) {
  //     const token = JSON.parse(fs.readFileSync(TOKEN_PATH));
  //     oAuth2Client.setCredentials(token);
  //   } else {
  //     // Get a new token
  //     const authUrl = oAuth2Client.generateAuthUrl({
  //       access_type: 'offline',
  //       scope: ['https://www.googleapis.com/auth/spreadsheets'],
  //     });
  //     console.log('Authorize this app by visiting this url:', authUrl);
  //     const rl = readline.createInterface({
  //       input: process.stdin,
  //       output: process.stdout,
  //     });
  //     rl.question('Enter the code from that page here: ', (code) => {
  //       rl.close();
  //       oAuth2Client.getToken(code, (err, token) => {
  //         if (err) return console.error('Error retrieving access token', err);
  //         oAuth2Client.setCredentials(token);
  //         // Store the token to disk for later program executions
  //         fs.writeFileSync(TOKEN_PATH, JSON.stringify(token));
  //         console.log('Token stored to', TOKEN_PATH);
  //       });
  //     });
  //   }
  //   return oAuth2Client;
  // }

  // async function appendData(auth) {
  //   const request = {
  //     spreadsheetId: 'your-spreadsheet-id', // Replace with your spreadsheet ID
  //     range: 'Sheet1!A1', // Replace with your sheet name and range
  //     valueInputOption: 'RAW',
  //     insertDataOption: 'INSERT_ROWS',
  //     resource: {
  //       values: [
  //         ['Column1', 'Column2', 'Column3'], // Replace with your data
  //       ],
  //     },
  //     auth: auth,
  //   };

  //   try {
  //     const response = (await sheets.spreadsheets.values.append(request)).data;
  //     console.log('Data appended:', response);
  //   } catch (err) {
  //     console.error('Error appending data:', err);
  //   }
  // }

  // authorize().then(appendData).catch(console.error);
}
