export async function getCurrentUserCity() {
  try {
    const response = await fetch('https://ipwho.is/'); // https://ipapi.co/json/
    const data = await response.json();

    console.log({ data });

    // Set in storage
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('userCity', data.city);
      localStorage.setItem('userLatitude', data.latitude);
      localStorage.setItem('userLongitude', data.longitude);
    }

    return {
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
    };
  } catch (error) {
    console.error('Error fetching user city:', error);

    // Get from storage
    if (
      typeof window !== 'undefined' &&
      typeof localStorage !== 'undefined' &&
      localStorage.getItem('userCity') &&
      localStorage.getItem('userLatitude') &&
      localStorage.getItem('userLongitude')
    ) {
      return {
        city: localStorage.getItem('userCity'),
        latitude: localStorage.getItem('userLatitude'),
        longitude: localStorage.getItem('userLongitude'),
      };
    }

    return null;
  }
}

export const distanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
