const fetch = require('node-fetch');
const BUILD_HOOK = 'https://api.netlify.com/build_hooks/65b131147490661994e417e8';

export default async (req) => {
  console.log('Scheduled function executed.');

  // triggerBuild();
  return { statusCode: 200 };
};

const triggerBuild = async () => {
  try {
    const response = await fetch(BUILD_HOOK, { method: 'POST' });
    console.log('Build hook response:', await response.json());
  } catch (error) {
    console.error('Error triggering build:', error);
  }
};

export const config = {
  schedule: '*/2 * * * *',
};
