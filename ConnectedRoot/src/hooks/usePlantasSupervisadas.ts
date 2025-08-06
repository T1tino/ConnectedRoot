// src/hooks/usePlantasSupervisadas.ts
import { useState, useCallback } from 'react';
import { PlantaSupervisada, PlantaSupervisadaWithDetails } from '../../types/database';
import { database } from '../../types/database';

interface UsePlantasSupervisadasReturn {
  // Datos con detalles completos
  plantasSupervisadasWithDetails: PlantaSupervisadaWithDetails[];
  
  // Datos básicos (para componentes que solo necesitan info básica)
  plantasSupervisadas: PlantaSupervisada[];
  
  // Estados de carga y error
  loading: boolean;
  error: string | null;
  
  // Métodos de carga
  fetchWithDetails: () => Promise<void>;
  refreshData: () => Promise<void>;
  
  // Métodos CRUD
  addPlantaSupervisada: (data: Omit<PlantaSupervisada, '_id' | 'createdAt' | 'updatedAt'>) => Promise<PlantaSupervisada | null>;
  updatePlantaSupervisada: (id: string, data: Partial<PlantaSupervisada>) => Promise<PlantaSupervisada | null>;
  deletePlantaSupervisada: (id: string) => Promise<boolean>;
}

export const usePlantasSupervisadas = (): UsePlantasSupervisadasReturn => {
  const [plantasSupervisadasWithDetails, setPlantasSupervisadasWithDetails] = useState<PlantaSupervisadaWithDetails[]>([]);
  const [plantasSupervisadas, setPlantasSupervisadas] = useState<PlantaSupervisada[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar plantas supervisadas con detalles completos
  const fetchWithDetails = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Cargar datos con detalles (incluye info de la planta y últimas lecturas)
      const dataWithDetails = await database.getPlantasSupervisadasWithDetails();
      
      // También cargar datos básicos para compatibilidad
      const basicData = await database.getPlantasSupervisadas();
      
      setPlantasSupervisadasWithDetails(dataWithDetails);
      setPlantasSupervisadas(basicData);
      
      console.log(`✅ Loaded ${dataWithDetails.length} supervised plants with details`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando plantas supervisadas';
      setError(errorMessage);
      console.error('❌ Error fetching plantas supervisadas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Agregar nueva planta supervisada
  const addPlantaSupervisada = useCallback(async (
    data: Omit<PlantaSupervisada, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<PlantaSupervisada | null> => {
    try {
      console.log('🌱 Adding new supervised plant:', data);
      
      const newPlanta = await database.createPlantaSupervisada(data);
      
      if (newPlanta) {
        // Actualizar lista básica
        setPlantasSupervisadas(prev => [...prev, newPlanta]);
        
        // Recargar datos con detalles para mantener consistencia
        await fetchWithDetails();
        
        console.log('✅ Successfully added supervised plant:', newPlanta._id);
      }
      
      return newPlanta;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creando planta supervisada';
      setError(errorMessage);
      console.error('❌ Error adding supervised plant:', err);
      return null;
    }
  }, [fetchWithDetails]);

  // Actualizar planta supervisada
  const updatePlantaSupervisada = useCallback(async (
    id: string, 
    data: Partial<PlantaSupervisada>
  ): Promise<PlantaSupervisada | null> => {
    try {
      console.log('🔄 Updating supervised plant:', id, data);
      
      const updatedPlanta = await database.updatePlantaSupervisada(id, data);
      
      if (updatedPlanta) {
        // Actualizar en lista básica
        setPlantasSupervisadas(prev => 
          prev.map(p => p._id === id ? updatedPlanta : p)
        );
        
        // Actualizar en lista con detalles
        setPlantasSupervisadasWithDetails(prev =>
          prev.map(p => p._id === id ? { ...p, ...updatedPlanta } : p)
        );
        
        console.log('✅ Successfully updated supervised plant:', id);
      }
      
      return updatedPlanta;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando planta supervisada';
      setError(errorMessage);
      console.error('❌ Error updating supervised plant:', err);
      return null;
    }
  }, []);

  // Eliminar planta supervisada
  const deletePlantaSupervisada = useCallback(async (id: string): Promise<boolean> => {
    try {
      console.log('🗑️ Deleting supervised plant:', id);
      
      const success = await database.deletePlantaSupervisada(id);
      
      if (success) {
        // Remover de ambas listas
        setPlantasSupervisadas(prev => prev.filter(p => p._id !== id));
        setPlantasSupervisadasWithDetails(prev => prev.filter(p => p._id !== id));
        
        console.log('✅ Successfully deleted supervised plant:', id);
      }
      
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error eliminando planta supervisada';
      setError(errorMessage);
      console.error('❌ Error deleting supervised plant:', err);
      return false;
    }
  }, []);

  // Refrescar todos los datos
  const refreshData = useCallback(async (): Promise<void> => {
    console.log('🔄 Refreshing supervised plants data...');
    await fetchWithDetails();
  }, [fetchWithDetails]);

  return {
    // Datos
    plantasSupervisadasWithDetails,
    plantasSupervisadas,
    
    // Estados
    loading,
    error,
    
    // Métodos de carga
    fetchWithDetails,
    refreshData,
    
    // Métodos CRUD
    addPlantaSupervisada,
    updatePlantaSupervisada,
    deletePlantaSupervisada,
  };
};