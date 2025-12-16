export async function getCurrentUserCity() {
  try {
    const postalCodeLocalStorage = localStorage.getItem('user_postal_code');
    if (postalCodeLocalStorage) {
      // console.log('Fetching zip code from storage. Value: ', postalCodeLocalStorage);

      const postalCodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?postalcode=${postalCodeLocalStorage}&countrycodes=NL&format=json&limit=1&accept-language=nl`,
        {
          headers: { 'Accept-Language': 'nl' },
        }
      );

      const postalCodeData = await postalCodeResponse.json();
      const postalData = postalCodeData[0];

      const latitude = postalData.lat;
      const longitude = postalData.lon;

      const reverseResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );

      const reverseData = await reverseResponse.json();
      const address = reverseData.address;

      // console.log({ address });

      return {
        city: address.city || address.town || address.village || address.municipality || '',
        latitude,
        longitude,
      };
    }

    if ('geolocation' in navigator) {
      const position = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
        })
      );

      // @ts-ignore
      const { latitude, longitude } = position.coords;

      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const geoData = await geoRes.json();

      const city =
        geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county || null;

      console.log({ position, city });

      if (city) {
        localStorage.setItem('userCity', city);
        localStorage.setItem('userLatitude', latitude);
        localStorage.setItem('userLongitude', longitude);

        return { city, latitude, longitude };
      }
    }

    // Fallback
    const ipRes = await fetch('https://ipwho.is/');
    const ipData = await ipRes.json();

    if (ipData && ipData.city) {
      localStorage.setItem('userCity', ipData.city);
      localStorage.setItem('userLatitude', ipData.latitude);
      localStorage.setItem('userLongitude', ipData.longitude);

      return {
        city: ipData.city,
        latitude: ipData.latitude,
        longitude: ipData.longitude,
      };
    }
  } catch (error) {
    console.error('Error fetching user city:', error);
  }

  return null;
}

export async function getCurrentUserCity_OLD() {
  try {
    const mockData = {
      city: 'Bovenkarspel',
      longitude: 51.3768553,
      latitude: 3.6460621,
    };

    return mockData;

    const response = await fetch('https://api.ipwho.org/me'); // https://ipapi.co/json/
    const { data } = await response.json();

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
