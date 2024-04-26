const axios = require('axios');

const clientId = process.env.CSL_CLIENT_ID;
const clientSecret = process.env.CSL_CLIENT_SECRET;
const allowedOrigins = ['http://localhost:8000', 'https://veranderaars.milieudefensie.nl'];

const ERROR_MSG = {
  'has already joined event': 'je hebt je al ingeschreven voor dit evenement',
  "can't be blank": 'dit veld is verplicht',
  'is not a valid email': 'dit is geen geldig e-mailadres',
  'is not a valid postal code': 'dit is geen geldige postcode',
  'must exist': 'sss',
};

const KEY_ERROR_MSG = {
  postcode: 'Postcode',
  first_name: 'Voornaam',
  last_name: 'Achternaam',
  email: 'e-mailadres',
};

export default async function handler(req, res) {
  const origin = req.headers.origin;
  if (!allowedOrigins.includes(origin)) {
    // return res.status(403).json({ error: 'Access denied' });
  }

  const credentials = `${clientId}:${clientSecret}`;
  const encodedCredentials = Buffer.from(credentials).toString('base64');

  const tokenResponse = await axios.post(`${process.env.CSL_PATH}/oauth/token`, null, {
    headers: { Authorization: `Basic ${encodedCredentials}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    params: { grant_type: 'client_credentials' },
  });
  const accessToken = tokenResponse.data.access_token;

  try {
    const attendeeInfo = req.body;
    const { slug, firstName, lastName, email, postcode, consent_email } = attendeeInfo;
    const consentAccepted = consent_email === 'yes';

    const body = {
      attendee: {
        attending_status: 'attending',
        notification_level: 'all_messages',
        first_name: firstName,
        last_name: lastName,
        email: email,
        postcode: postcode,
        // email_opt_in_type_external_id: 'external',
        email_opt_in_type_external_id: consentAccepted ? 'hubspot_form_consent' : 'hubspot_form_no_consent',
        join_organisation: false,
      },
    };

    await axios
      .post(`${process.env.CSL_PATH}/api/v1/events/${slug}/attendees`, body, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Error');
        } else {
          if (response.data.errors) {
            const errorMessages = Object.keys(response.data.errors)
              .map((key) => {
                const rawError = response.data.errors[key].join(', ');

                if (rawError === 'must exist') return null;
                if (rawError === 'is not a valid postal code' || rawError === 'is not a valid email') {
                  return `${ERROR_MSG[rawError]}`;
                }

                return `${KEY_ERROR_MSG[key]} ${ERROR_MSG[response.data.errors[key].join(', ')]}`;
              })
              .join('; ');

            throw new Error(errorMessages);
          }
        }

        res.status(200).json({ message: 'OK' });
        return;
      });
  } catch (error) {
    console.log('error: ', error.response);
    res.status(400).json({ message: error.message });
    return;
  }
}
