import { useEffect, useState } from 'react';
import axios from 'axios';
import { TREFLE_API_KEY, TREFLE_API_URL } from '../constants/trefle';
import * as FileSystem from 'expo-file-system';
import offlineData from '../../src/data/offlinePlants.json';

export function useTrefleSearch(query: string) {
  const [plants, setPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlants = async () => {
      if (!query) {
        // Modo "explorar sin búsqueda": muestra offline
        setPlants(offlineData);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(TREFLE_API_URL, {
          params: {
            token: TREFLE_API_KEY,
            q: query,
          },
        });
        setPlants(response.data.data);
      } catch (error) {
        console.warn('❌ Error fetching from API, usando datos offline.', error);
        setPlants(offlineData); // fallback
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [query]);

  return { plants, loading };
}
