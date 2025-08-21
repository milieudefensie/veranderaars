import { buildClient } from '@datocms/cma-client-node';
const client = buildClient({ apiToken: '481a25e304480d70385d3cf7957a1e' });

export default async function handler(req, res) {
  try {
    const { name } = req.body;
    console.log({ name });

    const records = await client.items.list({
      filter: {
        type: 'HSzzrRTYTRizxeD65hiQzA',
        fields: {
          internal_name: {
            in: [name],
          },
        },
      },
    });

    res.json({
      message: 'Record found successfully',
      data: records.map((r) => ({
        internal_name: r.internal_name,
        url: r.url,
      })),
    });
    return;
  } catch (error) {
    console.error('Error finding record:', error);
    res.status(500).json({ message: 'Error finding record' });
  }
}
