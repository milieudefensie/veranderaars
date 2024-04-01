const axios = require('axios');

const clientId = process.env.CSL_CLIENT_ID; 
const clientSecret = process.env.CSL_CLIENT_SECRET;

export default async function handler(req, res) {
  const credentials = `${clientId}:${clientSecret}`;
  const encodedCredentials = Buffer.from(credentials).toString('base64');

  const tokenResponse = await axios.post(`${process.env.CSL_PATH}/oauth/token`, null, {
    headers: { Authorization: `Basic ${encodedCredentials}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    params: { grant_type: 'client_credentials' },
  });
  const accessToken = tokenResponse.data.access_token;

  try{
    const attendeeInfo = req.body;
    const { name, email, slug, postcode } = attendeeInfo;
    const body = {
      "attendee": {
        "attending_status": "attending",
        "notification_level": "all_messages",
        "first_name": name,
        "last_name": "fef2",
        "email": email,
        "postcode": postcode,
        "email_opt_in_type_external_id": "external",
        "join_organisation": true
            
        }
    }
    await axios.post(
      `${process.env.CSL_PATH}/api/v1/events/${slug}/attendees`,
      body,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
    .then((response) => {
      
      if(response.status !== 200){
        throw new Error('Error');
      }else{
        if(response.data.errors){
          throw new Error('User already registered');
        }
      }
      res.json({ status: 200, message: 'OK' });
      return;
    })
  } catch (error) {
    res.json({ status: 500, message: error.message})
    return;
  }

}
