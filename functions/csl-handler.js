import axios from 'axios';
import trackRequest from '../src/api/_utils/track-request';

const WEBHOOK_ENDPOINTS = {
  USER: 'https://api-eu1.hubapi.com/automation/v4/webhook-triggers/139720471/YfoJAHB',
  EVENT: 'https://api-eu1.hubapi.com/automation/v4/webhook-triggers/139720471/wNTGt4x',
};
const USER_CASES = [
  'user.created',
  'user.updated',
  'attendee.created',
  'attendee.updated',
  'attendee.deleted',
  'attendee.confirmed',
  'unsubscribe.created',
];
const EVENT_CASES = ['event.created', 'event.updated'];

const getWebhookEndpoint = (type) => {
  if (USER_CASES.includes(type)) return WEBHOOK_ENDPOINTS.USER;
  if (EVENT_CASES.includes(type)) return WEBHOOK_ENDPOINTS.EVENT;
  return null;
};

export default async (req, context) => {
  const { type, ...rest } = req.body;
  const webhookEndpoint = getWebhookEndpoint(type);

  if (!webhookEndpoint) {
    return new Response(
      { message: 'Invalid CSL type' },
      {
        status: 200,
      }
    );
  }

  const cslUpdatedInfo = {
    type,
    fakeEmail: 'donotremove@formio.integration.com',
    ...rest,
  };

  try {
    await axios.post(webhookEndpoint, cslUpdatedInfo);

    await trackRequest({
      date: new Date().toISOString(),
      endpoint: webhookEndpoint,
      body: cslUpdatedInfo,
      success: true,
    });

    return new Response(
      { message: `OK. Type: ${type} | Data: ${JSON.stringify(cslUpdatedInfo)}` },
      {
        status: 200,
      }
    );
  } catch (error) {
    await trackRequest({
      date: new Date().toISOString(),
      endpoint: webhookEndpoint,
      body: cslUpdatedInfo,
      success: false,
    });

    return new Response(
      { message: error.message },
      {
        status: 200,
      }
    );
  }
};
