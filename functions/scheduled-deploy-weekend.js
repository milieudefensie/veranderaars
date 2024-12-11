import fetch from 'node-fetch';
const BUILD_HOOK = 'https://api.netlify.com/build_hooks/65b131147490661994e417e8';

export default async (req) => {
  triggerBuild();
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

// Runs on weekend, only 1 time per day
export const config = {
  schedule: '0 0 * * 6,7',
};
