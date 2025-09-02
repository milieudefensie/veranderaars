import { google } from 'googleapis';

export default async function trackRequest({ date, endpoint, body, success }) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        private_key: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDGiWNZeomg/J2S
+SgdEixQaDEQSqRu0peZ5WVn51bTzivcp+pY0jFiZ0O/3JnOTrCeDbi9s7sCsFLK
fuQYDgDPtFsjDcB14NjmX1XoXCCEDTrufB97p+RVCaFf0FNBW+owVyPtI8lmQncV
hLCk1Dxb7saDX1mTq83a8iJX2bdi+fyOp5WFABQ6ONKDc/W2CtjViN6/u9hZCncq
yRoJgF3QyDbep45ddKyy9I3Nk2odjvHpV3e+V7ATBPr6aeRQ4oN3HxAjGzSTWLNv
P3LLFJ0dWjHZJRuQBZSAVD5UtOxhVQ+iZGv8HJOAtddsEV30zMfrmfniz4O9Kc1D
TrSVEmAtAgMBAAECggEAAzMP44ZCudImEsohaBMZVAHS/ATxEJQj8if2FomSlH7z
E28cKvzXCFOmjf8f9kR08Z34/gtZTSyBZsST3wI5noz98m1iKei4thyPfJIgpbuR
a7NRzf58y/BRE97sA/syyj82ZgDvfmDQHQvyhDxaNmB9a1hHmSHFOjYwcOyP/d3i
fJaO24hpDwrwZ4+ExnvwFx5mSc8VbeNudcn9QgT7JV0U9XKzYmkcTzAgC2bMY1r5
6p4MjQAqcDLB8lEsMBCFMcjSrNNejiefZpeE827C06hz0n+3RqprFjPcwbUNLvJH
2rYp6UF+e7CgrXDZtJjXgXhzYJN+LYk/gf6Ouy/aAQKBgQDiKEUoPann2/RFntca
uh/JvLknA5InIotNSixTG3XLvLUz2B2v0wRT4ppACFCvIcvd8Wdu2kzuUsaNXZqL
AEgUSEECRCns9JBg2zYhg8pZMG2gX0szvvEG9f7LcSV4mSG6P56EvY/I3JV7qr0L
J2rn4eW2jvDBVNXUk8NR5hNBrQKBgQDgvBOKp75T1mP8ypdw/TMeJWahAOlvdllE
GymGn+7uuheBJf5TujVgDEGyVtZl1QeTAsjLuhK395DFg2Yzpu5GCooBjzg1R3p7
8Mmt6xP53CGjs6b9Ftv2aiSHvCqTHst/8dlRGjJof0ppLIvUi9+MKfzGYrjeEVhB
K9dAU3BogQKBgEfP1bXjbrIK69O3jkIUW8epP3md7qiylV0jclOpYowhDcC6nSKZ
dMRWLfirK0ORDbUZ1GgktUzvx9BXqpz8p+aY0tuvXUi6l6XJtbSKrpQHhqfn2m9B
8DLvpcpf0TAsH8OOM/2eW6vCL00neAO0roOW/WQsm1IoaAWqLdkxn2e5AoGAdDrx
hGnDNwsPxYNmFcrucC35yVV2Ze54to+xx23aHl/ininvQpBw4I8WP01IL3yhITh0
b2F6IumIV47hAd/ZJiJ3Q901veCNCaL8O9X0C+r8/vSAbi8vbl9xKz53aoWnzDFi
Kt74qTEEZCbk3vXElXJ1yIjwgfHIilRJTHybC4ECgYAuTtTlPVtiD8JskI1hvRz8
04anUv3kQ4u8l1u+GYJb7vs+I97EYe0s1AG4WSzPJbYamkevHpQgqk+7u/cg0iMl
8F5WJ6sqiG48bfB393bmtCeYIXsTsgXjioPOgNxy+/GTDy7sHPthtUsIbYlazVti
P3djHJj8ZxkA7ATLz9Q7Jg==
-----END PRIVATE KEY-----`,
        client_email: 'error-trackings@eternal-entity-469014-q5.iam.gserviceaccount.com',
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    const request = {
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: 'IP Errors!A1',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [[date, JSON.stringify(body)]],
      },
    };

    const response = await sheets.spreadsheets.values.append(request);

    console.log('Data appended successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in trackRequest:', error);
    throw new Error(`Failed to append data to Google Sheets: ${error.message}`);
  }
}
