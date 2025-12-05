import { buildClient } from '@datocms/cma-client-node';
import axios from 'axios';

export default async function handler(req, res) {
  try {
    const { name, url, email, eventSlug } = req.body;
    const client = buildClient({ apiToken: process.env.DATO_API_INSERT_TOKEN });

    const record = await client.items.create({
      item_type: { type: 'item_type', id: 'RJaNJAHpTris-8CkYRkbmQ' },
      internal_name: name,
      url: url,
      email: email,
      event_slug: eventSlug,
    });

    // Send email notification
    await axios.post('https://hook.eu2.make.com/fiya7w62jdc7h4p22kew76x5vqsc8q5o', {
      email,
      url,
    });

    res.json({ message: 'Record created successfully' });
    return;
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ message: 'Error creating record' });
  }
}
