const axios = require('axios');

const apiKey = process.env.CSL_API_KEY;
const allowedOrigins = ['http://localhost:8000', 'https://veranderaars.milieudefensie.nl'];

const ERROR_MSG = {
  'has already joined event': 'je hebt je al ingeschreven voor dit evenement',
  "can't be blank": 'dit veld is verplicht',
  'is not a valid email': 'dit is geen geldig e-mailadres',
  'is not a valid postal code': 'dit is geen geldige postcode',
  'must exist': '',
  'is al aangemeld voor de activiteit': 'Je hebt je al aangemeld voor dit evenement',
  'Activiteit is niet beschikbaar voor aanmeldingen':
    'Deze activiteit is momenteel niet beschikbaar voor inschrijvingen.',
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

  try {
    const attendeeInfo = req.body;
    const { slug, firstName, lastName, email, postcode, phone, consent_email, waiting_list } = attendeeInfo;
    const consentAccepted = consent_email === 'yes';

    const body = {
      attendee: {
        attending_status: waiting_list ? 'waiting_list' : 'attending',
        notification_level: 'all_messages',
        first_name: firstName,
        last_name: lastName,
        email: email,
        postcode: postcode,
        email_opt_in_type_external_id: consentAccepted ? 'hubspot_form_consent' : 'hubspot_form_no_consent',
        join_organisation: true,
        locale: 'nl',
        phone_number: phone,
      },
    };

    await axios
      .post(`${process.env.CSL_PATH}/api/v1/events/${slug}/attendees`, body, {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      .then((response) => {
        if (response.status !== 200) {
          throw new Error('Error');
        } else {
          if (response.data.errors) {
            const errorMessages = Object.keys(response.data.errors)
              .map((key) => {
                if (key === 'base') {
                  return response.data.errors[key].map((msg) => ERROR_MSG[msg] || msg).join('; ');
                }

                const rawError = response.data.errors[key].join(', ');
                const k1 = KEY_ERROR_MSG[key];
                const k2 = ERROR_MSG[rawError] || rawError;
                return k1 ? `${k1} ${k2}` : k2;
              })
              .filter(Boolean)
              .join('; ');

            throw new Error(errorMessages);
          }
        }

        res.status(200).json({ message: 'OK' });
        return;
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }
}
