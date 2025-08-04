// useTrefleSearch.ts
import { useState, useEffect } from 'react';
import axios from 'axios';
import { TREFLE_API_KEY } from '../constants/trefle';

const API_URL = 'https://trefle.io/api/v1/species/search';

export const useTrefleSearch = (query: string) => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;

    const fetchPlants = async () => {
      setLoading(true);
      try {
        const response = await axios.get(API_URL, {
          params: {
            token: TREFLE_API_KEY,
            q: query,
          },
        });

        setPlants(response.data.data || []);
      } catch (error) {
        console.error('Error fetching plants:', error);
        setPlants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [query]);

  return { plants, loading };
};