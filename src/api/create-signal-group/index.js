import { buildClient } from '@datocms/cma-client-node';

export default async function handler(req, res) {
  try {
    const { name, url, email, eventSlug } = req.body;
    const client = buildClient({ apiToken: '481a25e304480d70385d3cf7957a1e' });

    const record = await client.items.create({
      item_type: { type: 'item_type', id: 'HSzzrRTYTRizxeD65hiQzA' },
      internal_name: name,
      url: url,
      email: email,
      event_slug: eventSlug,
    });
    // console.log('Record created:', record);

    res.json({ message: 'Record created successfully' });
    return;
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ message: 'Error creating record' });
  }
}
