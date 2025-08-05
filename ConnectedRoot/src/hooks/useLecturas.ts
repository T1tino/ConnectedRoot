// hooks/useLecturas.ts
import { useState, useEffect } from 'react';
import { Lectura } from '../types/database';
import { mongoDBService } from '../services/mongodb';

export const useLecturas = (plantaSupervisadaId: string) => {
  const [lecturas, setLecturas] = useState<Lectura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLecturas = async () => {
    if (!plantaSupervisadaId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await mongoDBService.getLecturasByPlantaSupervisada(plantaSupervisadaId);
      setLecturas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando lecturas');
    } finally {
      setLoading(false);
    }
  };

  const addLectura = async (lecturaData: Omit<Lectura, '_id'>) => {
    try {
      const newLectura = await mongoDBService.createLectura(lecturaData);
      setLecturas(prev => [...prev, newLectura].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
      return newLectura;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando lectura');
      throw err;
    }
  };

  useEffect(() => {
    fetchLecturas();
  }, [plantaSupervisadaId]);

  return {
    lecturas,
    loading,
    error,
    refetch: fetchLecturas,
    addLectura,
  };
};