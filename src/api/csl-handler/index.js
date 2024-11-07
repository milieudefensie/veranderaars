import axios from 'axios';

export default async function handler(req, res) {
  const cslInfo = req.body;
  const cslUpdatedInfo = {
    ...cslInfo,
    fakeEmail: 'donotremove@formio.integration.com',
  };

  await axios
    .post(`https://api-eu1.hubapi.com/automation/v4/webhook-triggers/139720471/wNTGt4x`, cslUpdatedInfo)
    .then((response) => {
      res.status(200).json({ message: `OK. Data: ${JSON.stringify(cslUpdatedInfo)}` });
      return;
    })
    .catch((error) => {
      console.log('Error:', error);
      res.status(400).json({ message: error.message });
      return;
    });
}
