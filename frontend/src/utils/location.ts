// Inside: src/utils/location.ts
import { useState } from 'react';

export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

// This custom hook provides an easy way to get the user's location in any component.
export const useGeolocation = () => {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const getCurrentLocation = (): Promise<GeoLocation> => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return Promise.reject('Geolocation not supported');
    }

    setLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setLocation(newLocation);
          setLoading(false);
          resolve(newLocation);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
          reject(err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    });
  };

  return { location, error, loading, getCurrentLocation };
};