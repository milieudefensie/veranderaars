const BUILD_HOOK = 'https://api.netlify.com/build_hooks/65b131147490661994e417e8';

export default async (req) => {
  triggerBuild();
  return undefined;
};

const triggerBuild = async () => {
  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(BUILD_HOOK, { method: 'POST' });
    console.log('Build hook response:', await response.json());
  } catch (error) {
    console.error('Error triggering build:', error);
  }
};

// Runs on every workday,
export const config = {
  // schedule: '0 */3 * * *',
  schedule: '* * * * *',
};
