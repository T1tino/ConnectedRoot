// src/services/mongodb.ts
import { Plant, PlantaSupervisada, Lectura } from '../../types/database';

const API_BASE_URL = process.env.API_BASE_URL || 'http://192.168.128.196:3000/api';

export const mongoDBService = {
  // Plants
  getPlants: async (forceRefresh = false): Promise<Plant[]> => {
    const res = await fetch(`${API_BASE_URL}/plants`);
    if (!res.ok) throw new Error('Error al obtener plantas');
    return res.json();
  },

  getPlant: async (id: string): Promise<Plant> => {
    const res = await fetch(`${API_BASE_URL}/plants/${id}`);
    if (!res.ok) throw new Error('Error al obtener la planta');
    return res.json();
  },

  createPlant: async (data: Omit<Plant, '_id'>): Promise<Plant> => {
    const res = await fetch(`${API_BASE_URL}/plants`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear planta');
    return res.json();
  },

  updatePlant: async (id: string, data: Partial<Plant>): Promise<Plant> => {
    const res = await fetch(`${API_BASE_URL}/plants/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al actualizar planta');
    return res.json();
  },

  deletePlant: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/plants/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar planta');
  },

  // Supervised Plants
  getPlantasSupervisadas: async (): Promise<PlantaSupervisada[]> => {
    const res = await fetch(`${API_BASE_URL}/supervisadas`);
    if (!res.ok) throw new Error('Error al obtener plantas supervisadas');
    return res.json();
  },

  createPlantaSupervisada: async (data: Omit<PlantaSupervisada, '_id' | 'createdAt' | 'updatedAt'>): Promise<PlantaSupervisada> => {
    const res = await fetch(`${API_BASE_URL}/supervisadas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear planta supervisada');
    return res.json();
  },

  deletePlantaSupervisada: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE_URL}/supervisadas/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar planta supervisada');
  },

  // Readings
  getLecturasByPlantaSupervisada: async (plantaId: string): Promise<Lectura[]> => {
    const res = await fetch(`${API_BASE_URL}/lecturas/${plantaId}`);
    if (!res.ok) throw new Error('Error al obtener lecturas');
    return res.json();
  },

  createLectura: async (data: Omit<Lectura, '_id'>): Promise<Lectura> => {
    const res = await fetch(`${API_BASE_URL}/lecturas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Error al crear lectura');
    return res.json();
  },
};
