const LOCATION_KEY = 'user_location';
const LOCATION_TIMESTAMP_KEY = 'user_location_timestamp';
const EXPIRY_TIME = 24 * 60 * 60 * 1000;

export const getStoredLocation = () => {
  const loc = localStorage.getItem(LOCATION_KEY);
  const timestamp = localStorage.getItem(LOCATION_TIMESTAMP_KEY);

  if (!loc || !timestamp) return null;

  const age = Date.now() - parseInt(timestamp, 10);
  if (age > EXPIRY_TIME) {
    localStorage.removeItem(LOCATION_KEY);
    localStorage.removeItem(LOCATION_TIMESTAMP_KEY);
    return null;
  }

  return JSON.parse(loc);
};

export const askForLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation is not supported'));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        localStorage.setItem(LOCATION_KEY, JSON.stringify(coords));
        localStorage.setItem(LOCATION_TIMESTAMP_KEY, Date.now().toString());
        resolve(coords);
      },
      (error) => {
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 20000 }
    );
  });

export const getLocation = async () => {
  const stored = getStoredLocation();
  if (stored) return stored;
  return await askForLocation();
};
