/ hooks/usePlants.ts
import { useState, useEffect } from 'react';
import { Plant } from '../types/database';
import { mongoDBService } from '../services/mongodb';

export const usePlants = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mongoDBService.getAllPlants();
      setPlants(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  return {
    plants,
    loading,
    error,
    refetch: fetchPlants,
  };
};