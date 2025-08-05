// hooks/useLecturas.ts
import { useState, useEffect } from 'react';
import { Lectura } from '../../types/database';
import { database } from '../../types/database'; // Importamos desde el archivo database actualizado

export const useLecturas = (plantaSupervisadaId: string) => {
  const [lecturas, setLecturas] = useState<Lectura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLecturas = async () => {
    if (!plantaSupervisadaId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await database.getLecturas(plantaSupervisadaId);
      const ordenadas = data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLecturas(ordenadas);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando lecturas');
    } finally {
      setLoading(false);
    }
  };

  const fetchLecturasRecientes = async (limit = 10) => {
    if (!plantaSupervisadaId) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await database.getLecturasRecientes(plantaSupervisadaId, limit);
      setLecturas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando lecturas recientes');
    } finally {
      setLoading(false);
    }
  };

  const addLectura = async (lecturaData: Omit<Lectura, '_id'>) => {
    try {
      const newLectura = await database.createLectura(lecturaData);
      if (!newLectura) throw new Error('No se pudo crear la lectura');
      setLecturas(prev => [...prev, newLectura].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      ));
      return newLectura;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creando lectura');
      throw err;
    }
  };

  const getEstadisticas = async (dias = 7) => {
    if (!plantaSupervisadaId) return null;
    
    try {
      return await database.getEstadisticasPlanta(plantaSupervisadaId, dias);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error cargando estadísticas');
      return null;
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
    fetchLecturasRecientes,
    addLectura,
    getEstadisticas,
  };
};