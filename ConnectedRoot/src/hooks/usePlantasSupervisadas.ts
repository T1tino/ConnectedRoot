// hooks/usePlantasSupervisadas.ts
import { useState, useEffect } from 'react';
import { PlantaSupervisada } from '../types/database';
import { mongoDBService } from '../services/mongodb';

export const usePlantasSupervisadas = () => {
  const [plantasSupervisadas, setPlantasSupervisadas] = useState<PlantaSupervisada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlantasSupervisadas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await mongoDBService.getPlantasSupervisadas();
      setPlantasSupervisadas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const addPlantaSupervisada = async (plantData: Omit<PlantaSupervisada, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newPlanta = await mongoDBService.createPlantaSupervisada(plantData);
      setPlantasSupervisadas(prev => [...prev, newPlanta]);
      return newPlanta;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando planta supervisada');
      throw err;
    }
  };

  const updatePlantaSupervisada = async (id: string, updates: Partial<PlantaSupervisada>) => {
    try {
      const updatedPlanta = await mongoDBService.updatePlantaSupervisada(id, updates);
      setPlantasSupervisadas(prev => 
        prev.map(planta => planta._id === id ? updatedPlanta : planta)
      );
      return updatedPlanta;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error actualizando planta');
      throw err;
    }
  };

  const deletePlantaSupervisada = async (id: string) => {
    try {
      const success = await mongoDBService.deletePlantaSupervisada(id);
      if (success) {
        setPlantasSupervisadas(prev => prev.filter(planta => planta._id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error eliminando planta');
      throw err;
    }
  };

  useEffect(() => {
    fetchPlantasSupervisadas();
  }, []);

  return {
    plantasSupervisadas,
    loading,
    error,
    refetch: fetchPlantasSupervisadas,
    addPlantaSupervisada,
    updatePlantaSupervisada,
    deletePlantaSupervisada,
  };
};
