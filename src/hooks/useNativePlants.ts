import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { TREFLE_API_KEY, TREFLE_API_URL } from '../constants/trefle';

export interface Plant {
  id: number;
  common_name: string;
  scientific_name: string;
  image_url: string;
}

export default function useNativePlants() {
  const [plants, setPlants] = useState<Plant[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.warn('Permiso de ubicación denegado');
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const geocode = await Location.reverseGeocodeAsync(location.coords);
        const countryName = geocode[0]?.country || 'Mexico';

        setCountry(countryName);

        const response = await fetch(
          `${TREFLE_API_URL}/plants?token=${TREFLE_API_KEY}&filter[native]=${encodeURIComponent(countryName)}&page_size=10`
        );

        const json = await response.json();

        if (json.data) {
          setPlants(json.data);
        }
      } catch (error) {
        console.error('Error obteniendo plantas nativas:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { plants, loading, country };
}