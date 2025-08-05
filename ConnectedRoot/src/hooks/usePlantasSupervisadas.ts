// src/hooks/usePlantasSupervisadas.ts
import { useState, useCallback } from 'react';
import { PlantaSupervisadaWithDetails } from '../../types/database';
import { database } from '../../types/database';

interface UsePlantasSupervisadasReturn {
  plantasSupervisadasWithDetails: PlantaSupervisadaWithDetails[];
  loading: boolean;
  error: string | null;
  fetchWithDetails: () => Promise<void>;
  refreshData: () => Promise<void>;
}

export const usePlantasSupervisadas = (): UsePlantasSupervisadasReturn => {
  const [plantasSupervisadasWithDetails, setPlantasSupervisadasWithDetails] = useState<PlantaSupervisadaWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWithDetails = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Usa el método que ya tienes en tu DatabaseManager
      const data = await database.getPlantasSupervisadasWithDetails();
      setPlantasSupervisadasWithDetails(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando plantas supervisadas';
      setError(errorMessage);
      console.error('Error fetching plantas supervisadas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async (): Promise<void> => {
    // Fuerza un refresh de los datos
    try {
      const data = await database.getPlantasSupervisadasWithDetails();
      setPlantasSupervisadasWithDetails(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error refrescando datos';
      setError(errorMessage);
    }
  }, []);

  return {
    plantasSupervisadasWithDetails,
    loading,
    error,
    fetchWithDetails,
    refreshData,
  };
};