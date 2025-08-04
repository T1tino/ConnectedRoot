// src/api/PlantApi.ts - API Client optimizada para ConnectedRoot
import React from 'react';
import { Platform } from 'react-native';

// ==============================================
// CONFIGURACIÓN DE URL BASE
// ==============================================
const getBaseUrl = () => {
  if (__DEV__) {
    // En desarrollo
    if (Platform.OS === 'android') {
      // Para Android Emulator
      return 'http://10.0.2.2:4000';
    } else if (Platform.OS === 'ios') {
      // Para iOS Simulator
      return 'http://localhost:4000';
    } else {
      // Para web o otros
      return 'http://localhost:4000';
    }
    
    // Si pruebas en dispositivo físico, descomenta y usa tu IP:
    // return 'http://192.168.1.100:4000';
  } else {
    // En producción - reemplaza con tu URL de producción
    return 'https://your-production-api.com';
  }
};

const API_BASE_URL = getBaseUrl();

// ==============================================
// INTERFACES TYPESCRIPT
// ==============================================
export interface SensorData {
  temperaturaActual?: number;
  humedadActual?: number;
  luzActual?: number;
  ultimaLectura?: string;
}

export interface Ubicacion {
  latitud?: number;
  longitud?: number;
}

export interface Plant {
  _id: string;
  nombreComun: string;
  nombreCientifico?: string;
  temperatura?: { 
    min: number; 
    max: number; 
  };
  humedad?: string;
  iluminacion?: string;
  cuidadosExtra?: string;
  image?: string;
  sensorData?: SensorData;
  isActive: boolean;
  categoria?: 'Interior' | 'Exterior' | 'Suculenta' | 'Tropical' | 'Medicinal' | 'Ornamental';
  dificultadCuidado?: 'Fácil' | 'Intermedio' | 'Difícil';
  ubicacion?: Ubicacion;
  tags?: string[];
  notas?: string;
  createdAt: string;
  updatedAt: string;
  
  // Campos virtuales
  imagenUrl?: string;
  diasDesdeCreacion?: number;
  sensorConectado?: boolean;
}

export interface CreatePlantData {
  nombreComun: string;
  nombreCientifico?: string;
  temperatura?: { min: number; max: number };
  humedad?: string;
  iluminacion?: string;
  cuidadosExtra?: string;
  image?: string;
  categoria?: 'Interior' | 'Exterior' | 'Suculenta' | 'Tropical' | 'Medicinal' | 'Ornamental';
  dificultadCuidado?: 'Fácil' | 'Intermedio' | 'Difícil';
  ubicacion?: Ubicacion;
  tags?: string[];
  notas?: string;
}

export interface UpdateSensorData {
  temperaturaActual?: number;
  humedadActual?: number;
  luzActual?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface HealthCheck {
  status: string;
  timestamp: string;
  uptime: number;
  mongodb: {
    status: string;
    host?: string;
    name?: string;
  };
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  environment: string;
}

export interface PlantStats {
  totalPlantas: number;
  plantasActivas: number;
  plantasInactivas: number;
  temperaturaPromedio?: number;
  humedadPromedio?: number;
}

// ==============================================
// CONFIGURACIÓN DE FETCH
// ==============================================
const DEFAULT_TIMEOUT = 10000; // 10 segundos

// Función para timeout de requests
const fetchWithTimeout = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const timeoutId = setTimeout(() => {
    throw new Error('Request timeout - El servidor no respondió a tiempo');
  }, DEFAULT_TIMEOUT);

  try {
    const response = await fetch(url, options);
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// ==============================================
// MANEJO DE ERRORES
// ==============================================
class ApiError extends Error {
  public status?: number;
  public code?: string;

  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

const handleApiError = (error: any): never => {
  console.error('🔴 API Error:', error);
  
  // Error de red/conexión
  if (error.name === 'TypeError' && error.message.includes('Network request failed')) {
    throw new ApiError(
      'Error de conexión. Verifica que el servidor esté ejecutándose en ' + API_BASE_URL,
      0,
      'NETWORK_ERROR'
    );
  }
  
  // Timeout
  if (error.message.includes('timeout')) {
    throw new ApiError(
      'Timeout - El servidor tardó demasiado en responder',
      408,
      'TIMEOUT_ERROR'
    );
  }
  
  // Error HTTP con respuesta del servidor
  if (error.response) {
    throw new ApiError(
      error.response.data?.message || `Error del servidor: ${error.response.status}`,
      error.response.status,
      'HTTP_ERROR'
    );
  }
  
  // Error de la petición sin respuesta
  if (error.request) {
    throw new ApiError(
      'Sin respuesta del servidor. Verifica tu conexión de red.',
      0,
      'NO_RESPONSE'
    );
  }
  
  // Error desconocido
  throw new ApiError(
    error.message || 'Error desconocido en la API',
    500,
    'UNKNOWN_ERROR'
  );
};

// ==============================================
// FUNCIÓN HELPER PARA REQUESTS
// ==============================================
const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const method = options.method || 'GET';
    
    console.log(`🔄 API Request: ${method} ${endpoint}`);
    
    const requestOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetchWithTimeout(url, requestOptions);

    // Verificar si la respuesta es exitosa
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        // Si no se puede parsear el JSON del error, usar el mensaje por defecto
      }
      
      throw new ApiError(errorMessage, response.status, 'HTTP_ERROR');
    }

    const data = await response.json();
    console.log(`✅ API Success: ${method} ${endpoint}`);
    return data;
  } catch (error) {
    console.error(`❌ API Error: ${options.method || 'GET'} ${endpoint}`, error);
    handleApiError(error);
  }
};

// ==============================================
// FUNCIONES DE LA API
// ==============================================

/**
 * Verifica si el servidor está disponible
 */
export const checkServerHealth = async (): Promise<HealthCheck> => {
  return apiRequest<HealthCheck>('/api/health');
};

/**
 * Obtiene todas las plantas activas
 */
export const getAllPlants = async (): Promise<Plant[]> => {
  return apiRequest<Plant[]>('/api/plants');
};

/**
 * Obtiene una planta específica por ID
 */
export const getPlantById = async (id: string): Promise<Plant> => {
  if (!id || id.trim().length === 0) {
    throw new ApiError('ID de planta requerido', 400, 'INVALID_ID');
  }
  return apiRequest<Plant>(`/api/plants/${id}`);
};

/**
 * Crea una nueva planta
 */
export const createPlant = async (plantData: CreatePlantData): Promise<Plant> => {
  if (!plantData.nombreComun || plantData.nombreComun.trim().length === 0) {
    throw new ApiError('El nombre común es requerido', 400, 'INVALID_DATA');
  }
  
  return apiRequest<Plant>('/api/plants', {
    method: 'POST',
    body: JSON.stringify(plantData),
  });
};

/**
 * Actualiza una planta existente
 */
export const updatePlant = async (id: string, plantData: Partial<CreatePlantData>): Promise<Plant> => {
  if (!id || id.trim().length === 0) {
    throw new ApiError('ID de planta requerido', 400, 'INVALID_ID');
  }
  
  return apiRequest<Plant>(`/api/plants/${id}`, {
    method: 'PUT',
    body: JSON.stringify(plantData),
  });
};

/**
 * Actualiza los datos del sensor de una planta
 */
export const updatePlantSensor = async (id: string, sensorData: UpdateSensorData): Promise<Plant> => {
  if (!id || id.trim().length === 0) {
    throw new ApiError('ID de planta requerido', 400, 'INVALID_ID');
  }
  
  return apiRequest<Plant>(`/api/plants/${id}/sensor`, {
    method: 'PUT',
    body: JSON.stringify(sensorData),
  });
};

/**
 * Elimina una planta (soft delete)
 */
export const deletePlant = async (id: string): Promise<{ message: string; plant: Plant }> => {
  if (!id || id.trim().length === 0) {
    throw new ApiError('ID de planta requerido', 400, 'INVALID_ID');
  }
  
  return apiRequest(`/api/plants/${id}`, {
    method: 'DELETE',
  });
};

/**
 * Restaura una planta eliminada
 */
export const restorePlant = async (id: string): Promise<{ message: string; plant: Plant }> => {
  if (!id || id.trim().length === 0) {
    throw new ApiError('ID de planta requerido', 400, 'INVALID_ID');
  }
  
  return apiRequest(`/api/plants/${id}/restore`, {
    method: 'POST',
  });
};

/**
 * Obtiene estadísticas generales de las plantas
 */
export const getPlantStats = async (): Promise<PlantStats> => {
  return apiRequest<PlantStats>('/api/plants/stats/summary');
};

/**
 * Busca plantas por nombre
 */
export const searchPlants = async (query: string): Promise<Plant[]> => {
  if (!query || query.trim().length === 0) {
    return getAllPlants();
  }
  
  const allPlants = await getAllPlants();
  const searchTerm = query.toLowerCase().trim();
  
  return allPlants.filter(plant => 
    plant.nombreComun.toLowerCase().includes(searchTerm) ||
    plant.nombreCientifico?.toLowerCase().includes(searchTerm) ||
    plant.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

/**
 * Obtiene plantas por categoría
 */
export const getPlantsByCategory = async (categoria: string): Promise<Plant[]> => {
  const allPlants = await getAllPlants();
  return allPlants.filter(plant => plant.categoria === categoria);
};

/**
 * Obtiene plantas que necesitan atención
 */
export const getPlantsNeedingAttention = async (): Promise<Plant[]> => {
  const allPlants = await getAllPlants();
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  return allPlants.filter(plant => {
    // Plantas con humedad baja
    if (plant.sensorData?.humedadActual && plant.sensorData.humedadActual < 30) {
      return true;
    }
    
    // Plantas sin lecturas recientes
    if (plant.sensorData?.ultimaLectura) {
      const lastReading = new Date(plant.sensorData.ultimaLectura);
      if (lastReading < oneDayAgo) {
        return true;
      }
    }
    
    return false;
  });
};

// ==============================================
// FUNCIONES DE COMPATIBILIDAD (para código existente)
// ==============================================

/**
 * Función de compatibilidad con el código existente en HomeScreen
 */
export const getPlantas = getAllPlants;

/**
 * Función de compatibilidad con api.ts existente
 */
export const getPlantasLegacy = getAllPlants;

// ==============================================
// UTILIDADES
// ==============================================

/**
 * Verifica si el servidor está disponible sin lanzar errores
 */
export const isServerAvailable = async (): Promise<boolean> => {
  try {
    await checkServerHealth();
    return true;
  } catch (error) {
    console.log('🔴 Servidor no disponible:', error.message);
    return false;
  }
};

/**
 * Obtiene la URL base de la API
 */
export const getApiBaseUrl = (): string => {
  return API_BASE_URL;
};

/**
 * Obtiene información de conexión para debugging
 */
export const getConnectionInfo = () => {
  return {
    baseUrl: API_BASE_URL,
    platform: Platform.OS,
    isDev: __DEV__,
    endpoints: {
      health: `${API_BASE_URL}/api/health`,
      plants: `${API_BASE_URL}/api/plants`,
      stats: `${API_BASE_URL}/api/plants/stats/summary`
    }
  };
};

// ==============================================
// HOOK PERSONALIZADO PARA REACT NATIVE
// ==============================================
export const usePlantApi = () => {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const executeRequest = async <T>(request: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await request();
      return result;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('API Request failed:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    executeRequest,
    clearError: () => setError(null)
  };
};

// ==============================================
// EXPORTACIONES
// ==============================================
export default {
  // Operaciones principales
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  updatePlantSensor,
  deletePlant,
  restorePlant,
  
  // Búsqueda y filtrado
  searchPlants,
  getPlantsByCategory,
  getPlantsNeedingAttention,
  
  // Estadísticas y salud
  getPlantStats,
  checkServerHealth,
  isServerAvailable,
  
  // Compatibilidad
  getPlantas,
  getPlantasLegacy,
  
  // Utilidades
  getApiBaseUrl,
  getConnectionInfo,
  
  // Clases y tipos
  ApiError,
};