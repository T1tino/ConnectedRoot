// src/services/api.ts
import axios from 'axios';


// Opción 1: Configuración automática por entorno
const getApiBaseUrl = () => {
  if (__DEV__) {
    // 🔄 CAMBIA ESTA IP POR LA IP DE TU COMPUTADORA LOCAL
    // Para encontrar tu IP: Windows = ipconfig, Mac/Linux = ifconfig
    return 'http://192.168.0.11:3000/api'; // ⚠️ REEMPLAZA 192.168.1.100 con tu IP real
  } else {
    // En producción usarías tu servidor real
    return 'https://tu-servidor-produccion.com/api';
  }
};

// Opción 2: Configuración manual (descomenta para usar)
const API_BASE_URL = 'http:192.168.0.11:3000/api'; // Ejemplo: http://192.168.1.105:3000/api

// const API_BASE_URL = getApiBaseUrl();

console.log('🌐 API Base URL:', API_BASE_URL); // Para debugging

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejo de errores mejorado
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.error('❌ Error de Red - Verifica:');
      console.error('1. ¿Tu servidor está corriendo?');
      console.error('2. ¿Usas IP local en lugar de localhost?');
      console.error('3. ¿Mismo WiFi en teléfono y computadora?');
      console.error('4. URL actual:', API_BASE_URL);
    }
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Interceptor para debugging de requests
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
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
      const response = await api.get<ApiResponse<PlantaSupervisada[]>>('/plantasSupervisadas');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching supervised plants:', error);
      throw error;
    }
  },

  async getPlantaSupervisada(id: string): Promise<PlantaSupervisada> {
    try {
      const response = await api.get<ApiResponse<PlantaSupervisada>>(`/plantasSupervisadas/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching supervised plant:', error);
      throw error;
    }
  },

  async createPlantaSupervisada(data: Omit<PlantaSupervisada, '_id' | 'createdAt' | 'updatedAt'>): Promise<PlantaSupervisada> {
    try {
      const response = await api.post<ApiResponse<PlantaSupervisada>>('/plantasSupervisadas', data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating supervised plant:', error);
      throw error;
    }
  },

  async updatePlantaSupervisada(id: string, data: Partial<PlantaSupervisada>): Promise<PlantaSupervisada> {
    try {
      const response = await api.put<ApiResponse<PlantaSupervisada>>(`/plantasSupervisadas/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating supervised plant:', error);
      throw error;
    }
  },

  async deletePlantaSupervisada(id: string): Promise<void> {
    try {
      await api.delete(`/plantasSupervisadas/${id}`);
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
        `/plantasSupervisadas/${plantaSupervisadaId}/estadisticas?dias=${dias}`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching plant statistics:', error);
      throw error;
    }
  },

  // Método para probar la conexión
  async testConnection(): Promise<boolean> {
    try {
      await api.get('/health'); // Asume que tienes un endpoint de health check
      return true;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  },
};

export default api;