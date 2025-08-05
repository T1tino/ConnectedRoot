// hooks/usePlants.ts - Hook adicional para manejar el catálogo de plantas
import { useState, useEffect } from 'react';
import { Plant } from '../../types/database';
import { database } from '../../types/database';

export const usePlants = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlants = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);
      const data = await database.getPlants(forceRefresh);
      setPlants(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando plantas');
    } finally {
      setLoading(false);
    }
  };

  const getPlant = async (id: string): Promise<Plant | null> => {
    try {
      return await database.getPlant(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error obteniendo planta');
      return null;
    }
  };

  const addPlant = async (plantData: Omit<Plant, '_id'>) => {
    try {
      const newPlant = await database.createPlant(plantData);
      if (!newPlant) throw new Error('No se pudo crear la planta');
      
      setPlants(prev => [...prev, newPlant]);
      return newPlant;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando planta');
      throw err;
    }
  };

  const updatePlant = async (id: string, updates: Partial<Plant>) => {
    try {
      const updatedPlant = await database.updatePlant(id, updates);
      if (!updatedPlant) throw new Error('No se pudo actualizar la planta');
      
      setPlants(prev => 
        prev.map(plant => plant._id === id ? updatedPlant : plant)
      );
      
      return updatedPlant;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando planta');
      throw err;
    }
  };

  const deletePlant = async (id: string) => {
    try {
      const success = await database.deletePlant(id);
      if (success) {
        setPlants(prev => prev.filter(plant => plant._id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando planta');
      throw err;
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
    getPlant,
    addPlant,
    updatePlant,
    deletePlant,
  };
};