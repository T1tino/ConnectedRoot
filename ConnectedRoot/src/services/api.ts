// src/services/api.ts
import axios from 'axios';

// Configura tu URL base del backend
const API_BASE_URL = 'http://localhost:3000/api'; // Cambia por tu URL de producción

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Importar tipos de database
import { Plant, PlantaSupervisada, Lectura } from '../../types/database';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Servicios de API para cada colección
export const apiService = {
  // === PLANTAS ===
  async getPlants(): Promise<Plant[]> {
    try {
      const response = await api.get<ApiResponse<Plant[]>>('/plants');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching plants:', error);
      throw error;
    }
  },

  async getPlant(id: string): Promise<Plant> {
    try {
      const response = await api.get<ApiResponse<Plant>>(`/plants/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching plant:', error);
      throw error;
    }
  },

  async createPlant(data: Omit<Plant, '_id'>): Promise<Plant> {
    try {
      const response = await api.post<ApiResponse<Plant>>('/plants', data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating plant:', error);
      throw error;
    }
  },

  async updatePlant(id: string, data: Partial<Plant>): Promise<Plant> {
    try {
      const response = await api.put<ApiResponse<Plant>>(`/plants/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating plant:', error);
      throw error;
    }
  },

  async deletePlant(id: string): Promise<void> {
    try {
      await api.delete(`/plants/${id}`);
    } catch (error) {
      console.error('Error deleting plant:', error);
      throw error;
    }
  },

  // === PLANTAS SUPERVISADAS ===
  async getPlantasSupervisadas(): Promise<PlantaSupervisada[]> {
    try {
      const response = await api.get<ApiResponse<PlantaSupervisada[]>>('/plantas-supervisadas');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching supervised plants:', error);
      throw error;
    }
  },

  async getPlantaSupervisada(id: string): Promise<PlantaSupervisada> {
    try {
      const response = await api.get<ApiResponse<PlantaSupervisada>>(`/plantas-supervisadas/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching supervised plant:', error);
      throw error;
    }
  },

  async createPlantaSupervisada(data: Omit<PlantaSupervisada, '_id' | 'createdAt' | 'updatedAt'>): Promise<PlantaSupervisada> {
    try {
      const response = await api.post<ApiResponse<PlantaSupervisada>>('/plantas-supervisadas', data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating supervised plant:', error);
      throw error;
    }
  },

  async updatePlantaSupervisada(id: string, data: Partial<PlantaSupervisada>): Promise<PlantaSupervisada> {
    try {
      const response = await api.put<ApiResponse<PlantaSupervisada>>(`/plantas-supervisadas/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating supervised plant:', error);
      throw error;
    }
  },

  async deletePlantaSupervisada(id: string): Promise<void> {
    try {
      await api.delete(`/plantas-supervisadas/${id}`);
    } catch (error) {
      console.error('Error deleting supervised plant:', error);
      throw error;
    }
  },

  // === LECTURAS ===
  async getLecturas(plantaSupervisadaId?: string): Promise<Lectura[]> {
    try {
      const url = plantaSupervisadaId 
        ? `/lecturas?plantaSupervisadaId=${plantaSupervisadaId}`
        : '/lecturas';
      const response = await api.get<ApiResponse<Lectura[]>>(url);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching readings:', error);
      throw error;
    }
  },

  async getLectura(id: string): Promise<Lectura> {
    try {
      const response = await api.get<ApiResponse<Lectura>>(`/lecturas/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching reading:', error);
      throw error;
    }
  },

  async createLectura(data: Omit<Lectura, '_id'>): Promise<Lectura> {
    try {
      const response = await api.post<ApiResponse<Lectura>>('/lecturas', data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating reading:', error);
      throw error;
    }
  },

  // Obtener lecturas recientes para una planta supervisada
  async getLecturasRecientes(plantaSupervisadaId: string, limit: number = 10): Promise<Lectura[]> {
    try {
      const response = await api.get<ApiResponse<Lectura[]>>(
        `/lecturas/recientes/${plantaSupervisadaId}?limit=${limit}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching recent readings:', error);
      throw error;
    }
  },

  // Obtener estadísticas de una planta supervisada
  async getEstadisticasPlanta(plantaSupervisadaId: string, dias: number = 7): Promise<any> {
    try {
      const response = await api.get(
        `/plantas-supervisadas/${plantaSupervisadaId}/estadisticas?dias=${dias}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching plant statistics:', error);
      throw error;
    }
  },
};

export default api;