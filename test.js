const hubspot = require('@hubspot/api-client');
exports.main = async (event, callback) => {
  const hubspotClient = new hubspot.Client({
    accessToken: process.env.secretName,
  });

  const local_group = event.inputFields['local_group'];
  const enrolled_email = event.inputFields['email'];
  const enrolled_first_name = event.inputFields['first_name'];
  const enrolled_last_name = event.inputFields['last_name'];
  const enrolled_phone = event.inputFields['phone'];
  const companyId = event.inputFields['company'];

  let emails = [];

  // UPDATE: Send email to fallback if no owner/integrators founds: https://app.clickup.com/t/86b7ddb8w
  let hasOwner = false;
  let hasIntegrators = false;

  // send email to owner
  try {
    const getOwnerId = await hubspotClient.crm.companies.basicApi.getById(companyId, ['hubspot_owner_id']);

    if (getOwnerId.properties.hubspot_owner_id != '') {
      // UPDATE: Send email to fallback if no owner/integrators founds: https://app.clickup.com/t/86b7ddb8w
      hasOwner = true;

      const responseOwnerId = getOwnerId.properties.hubspot_owner_id;
      const getOwnerEmail = await hubspotClient.crm.owners.ownersApi.getById(responseOwnerId, 'id', false);
      const PublicObjectSearchRequest = {
        filterGroups: [{ filters: [{ propertyName: 'email', value: getOwnerEmail.email, operator: 'EQ' }] }],
      };
      const findUserResponse = await hubspotClient.crm.contacts.searchApi.doSearch(PublicObjectSearchRequest);

      if (findUserResponse.results[0]) {
        // get company name
        console.log(local_group);
        const getCompany = await hubspotClient.crm.companies.basicApi.getById(
          local_group,
          undefined,
          undefined,
          undefined,
          false,
          undefined
        );
        let nameLocalGroup = 'not found';
        if (getCompany) {
          console.log('company found');
          nameLocalGroup = getCompany.properties.name;
        }

        let contact_info = `${enrolled_first_name} ${enrolled_last_name}. Email: ${enrolled_email} Phone: ${enrolled_phone} Local Group: ${nameLocalGroup}`;
        let vid = findUserResponse.results[0].id;
        const newProperties = {
          properties: {
            contact_info_of_to_be_contacted: contact_info,
          },
        };
        const apiUpdateUser = await hubspotClient.crm.contacts.basicApi.update(vid, newProperties);
        console.log(`send owner email: ${getOwnerEmail.email}`);
        const sendEmail = await fetch(
          `https://api.hubapi.com/automation/v2/workflows/20207367/enrollments/contacts/${getOwnerEmail.email}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${process.env.secretName}`,
            },
            body: JSON.stringify({}),
          }
        );
      }
    }
  } catch (e) {
    e.message === 'HTTP request failed' ? console.error(JSON.stringify(e.response, null, 2)) : console.error(e);
  }

  // send email to contacts local group
  try {
    const getOwnerId = await hubspotClient.crm.companies.basicApi.getById(companyId, ['hubspot_owner_id']);
    if (getOwnerId.properties.hubspot_owner_id != '') {
      const responseOwnerId = getOwnerId.properties.hubspot_owner_id;
      const getOwnerEmail = await hubspotClient.crm.owners.ownersApi.getById(responseOwnerId, 'id', false);
      console.log(getOwnerEmail.email);
    }

    const apiResponse = await hubspotClient.crm.associations.v4.basicApi.getPage('company', local_group, 'contact');
    if (!apiResponse) {
      return;
    }
    const ids = apiResponse.results
      .filter((item) => item.associationTypes.some((type) => type.typeId === 34))
      .map((item) => item.toObjectId);

    if (ids.length == 0) {
      console.log('no contact with integratior label');
      return;
    } else {
      // UPDATE: Send email to fallback if no owner/integrators founds: https://app.clickup.com/t/86b7ddb8w
      hasIntegrators = true;
    }

    for (const id of ids) {
      const userEmail = await hubspotClient.crm.contacts.basicApi.getById(
        id,
        undefined,
        undefined,
        undefined,
        undefined
      );
      emails.push(userEmail.properties.email);
    }
  } catch (e) {
    e.message === 'HTTP request failed' ? console.error(JSON.stringify(e.response, null, 2)) : console.error(e);
  }

  // UPDATE: Send email to fallback if no owner/integrators founds: https://app.clickup.com/t/86b7ddb8w
  if (!hasOwner && !hasIntegrators) {
    const fallbackEmail = 'doe.mee@milieudefensie.nl';
    console.log(`No owner or integrator found. Sending email to fallback: ${fallbackEmail}`);
    try {
      await fetch(`https://api.hubapi.com/automation/v2/workflows/20207367/enrollments/contacts/${fallbackEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.secretName}`,
        },
        body: JSON.stringify({}),
      });
    } catch (e) {
      console.error('Error sending fallback email', e);
    }
    return;
  }

  try {
    for (const email of emails) {
      console.log('update contact information for email sending');
      // find user id
      const PublicObjectSearchRequest = {
        filterGroups: [{ filters: [{ propertyName: 'email', value: email, operator: 'EQ' }] }],
      };
      const findUserResponse = await hubspotClient.crm.contacts.searchApi.doSearch(PublicObjectSearchRequest);
      if (findUserResponse.results[0]) {
        let contact_info = `${enrolled_first_name} ${enrolled_last_name}. Email: ${enrolled_email} Phone: ${enrolled_phone}`;
        let vid = findUserResponse.results[0].id;
        const newProperties = {
          properties: {
            contact_info_of_to_be_contacted: contact_info,
          },
        };
        const apiUpdateUser = await hubspotClient.crm.contacts.basicApi.update(vid, newProperties);
      }
    }

    // send email to
    for (const email of emails) {
      console.log(`sending email to ${email}`);
      const sendEmail = await fetch(
        `https://api.hubapi.com/automation/v2/workflows/20207367/enrollments/contacts/${email}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.secretName}`,
          },
          body: JSON.stringify({}),
        }
      );
    }
  } catch (e) {
    e.message === 'HTTP request failed' ? console.error(JSON.stringify(e.response, null, 2)) : console.error(e);
  }
};
