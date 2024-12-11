const BUILD_HOOK = 'https://api.netlify.com/build_hooks/65b131147490661994e417e8';

export default async (req) => {
  const now = new Date();
  const currentHour = now.getUTCHours();
  const currentDay = now.getUTCDay();

  // Weekdays
  if (currentDay >= 1 && currentDay <= 5) {
    if (currentHour % 2 === 0) {
      await triggerBuild();
    }
  } else {
    // Saturday and sunday
    if (currentHour === 12) {
      await triggerBuild();
    }
  }
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

export const config = {
  schedule: '@hourly',
};
