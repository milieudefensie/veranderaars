import axios from 'axios';
import trackRequest from '../_utils/track-request';

export default async function handler(req, res) {
  let successRequest = false;

  const cslInfo = req.body;
  const cslUpdatedInfo = {
    ...cslInfo,
    fakeEmail: 'donotremove@formio.integration.com',
  };

  await axios
    .post(`https://api-eu1.hubapi.com/automation/v4/webhook-triggers/139720471/wNTGt4x`, cslUpdatedInfo)
    .then((response) => {
      successRequest = true;
      res.status(200).json({ message: `OK. Data: ${JSON.stringify(cslUpdatedInfo)}` });
      return;
    })
    .catch((error) => {
      successRequest = false;
      console.log('Error:', error);
      res.status(400).json({ message: error.message });
      return;
    })
    .finally(async () => {
      await trackRequest({
        date: new Date().toISOString(),
        endpoint: 'CSL Handler / https://api-eu1.hubapi.com/automation/v4/webhook-triggers/139720471/wNTGt4x',
        body: cslUpdatedInfo,
        success: successRequest,
      });
    });
}
