import trackRequest from '../_utils/track-request';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { date, body } = req.body;

    try {
      await trackRequest({ date, endpoint: null, body, success: false });
      return res.status(200).json({ message: 'Error tracked successfully' });
    } catch (error) {
      console.error('Error tracking request:', error);
      return res.status(500).json({ message: 'Error tracking request' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
