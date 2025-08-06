// src/hooks/usePlantasSupervisadas.ts - OPTIMIZADO para no cargar todo el catálogo
import { useState, useCallback } from 'react';
import { PlantaSupervisada, PlantaSupervisadaWithDetails } from '../../types/database';
import { api } from '../services/api';

interface UsePlantasSupervisadasReturn {
  // Datos con detalles completos (lo que usa tu HomeScreen)
  plantasSupervisadasWithDetails: PlantaSupervisadaWithDetails[];
  
  // Datos básicos (para compatibilidad)
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

  // 🚀 OPTIMIZACIÓN PRINCIPAL: No cargar todo el catálogo
  const fetchWithDetails = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      console.log('🚀 Hook: Loading supervised plants (OPTIMIZED - no full catalog)...');
      
      // PASO 1: Solo cargar plantas supervisadas
      const supervisadas = await api.getPlantasSupervisadas();
      setPlantasSupervisadas(supervisadas);
      console.log(`📋 Loaded ${supervisadas.length} supervised plants`);
      
      if (supervisadas.length === 0) {
        console.log('📭 No supervised plants found');
        setPlantasSupervisadasWithDetails([]);
        return;
      }

      // PASO 2: Para cada planta supervisada, cargar SOLO sus datos específicos
      const dataWithDetails: PlantaSupervisadaWithDetails[] = [];
      
      for (const supervisada of supervisadas) {
        try {
          console.log(`🌱 Loading details for supervised plant: ${supervisada._id}`);
          
          // Solo cargar la planta específica (no todo el catálogo)
          const plantData = supervisada.plantId ? 
            await api.getPlant(supervisada.plantId) : 
            null;
          
          // Solo cargar la lectura más reciente de esta planta
          const lecturasRecientes = await api.getLecturasRecientes(supervisada._id, 1);
          
          dataWithDetails.push({
            ...supervisada,
            plantData: plantData || undefined,
            ultimaLectura: lecturasRecientes[0] || undefined,
          });
          
          console.log(`✅ Loaded details for: ${supervisada.nombre || plantData?.nombreComun || 'Unknown'}`);
          
        } catch (detailError) {
          console.warn(`⚠️ Could not load full details for supervised plant ${supervisada._id}:`, detailError);
          
          // Agregar sin detalles completos si hay error con una planta específica
          dataWithDetails.push({
            ...supervisada,
            plantData: undefined,
            ultimaLectura: undefined,
          });
        }
      }
      
      setPlantasSupervisadasWithDetails(dataWithDetails);
      console.log(`✅ Successfully loaded ${dataWithDetails.length} supervised plants with details (OPTIMIZED)`);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error cargando plantas supervisadas';
      setError(errorMessage);
      console.error('❌ Error fetching plantas supervisadas:', err);
      
      // En caso de error total, limpiar datos
      setPlantasSupervisadasWithDetails([]);
      setPlantasSupervisadas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Agregar nueva planta supervisada
  const addPlantaSupervisada = useCallback(async (
    data: Omit<PlantaSupervisada, '_id' | 'createdAt' | 'updatedAt'>
  ): Promise<PlantaSupervisada | null> => {
    try {
      console.log('🌱 Adding new supervised plant:', data.nombre);
      
      const newPlanta = await api.createPlantaSupervisada(data);
      
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
      
      const updatedPlanta = await api.updatePlantaSupervisada(id, data);
      
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
      
      const success = await api.deletePlantaSupervisada(id);
      
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