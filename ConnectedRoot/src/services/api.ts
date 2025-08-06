// src/services/api.ts

export class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = 'http://192.168.0.254:3000/api';
    console.log('🌐 API Base URL:', this.baseURL);
  }

  // Método base para hacer llamadas a la API
  private async apiCall(endpoint: string, method: string = 'GET', data?: any): Promise<any> {
    try {
      console.log(`🚀 API Request: ${method} ${endpoint}`);
      
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log(`✅ API Response for ${endpoint}:`, result);
      return result;

    } catch (error) {
      console.error(`❌ API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // ========== PLANTAS ==========
  async getPlants(): Promise<Plant[]> {
    try {
      const result = await this.apiCall('/plantas');
      return Array.isArray(result) ? result : (result.data || []);
    } catch (error) {
      console.error('Error fetching plants:', error);
      return [];
    }
  }

  async getPlant(id: string): Promise<Plant> {
    try {
      const result = await this.apiCall(`/plantas/${id}`);
      return result.data || result;
    } catch (error) {
      console.error('Error fetching plant:', error);
      throw error;
    }
  }

  async createPlant(data: Omit<Plant, '_id'>): Promise<Plant> {
    try {
      const result = await this.apiCall('/plantas', 'POST', data);
      return result.data || result;
    } catch (error) {
      console.error('Error creating plant:', error);
      throw error;
    }
  }

  // NUEVOS MÉTODOS FALTANTES
  async updatePlant(id: string, data: Partial<Plant>): Promise<Plant> {
    try {
      const result = await this.apiCall(`/plantas/${id}`, 'PUT', data);
      return result.data || result;
    } catch (error) {
      console.error('Error updating plant:', error);
      throw error;
    }
  }

  async deletePlant(id: string): Promise<void> {
    try {
      await this.apiCall(`/plantas/${id}`, 'DELETE');
    } catch (error) {
      console.error('Error deleting plant:', error);
      throw error;
    }
  }

  // ========== PLANTAS SUPERVISADAS ==========
  // ESTE ES EL MÉTODO QUE NECESITAS ARREGLAR
  async getPlantasSupervisadas(): Promise<PlantaSupervisada[]> {
    try {
      console.log('🚀 Hook: Loading supervised plants (OPTIMIZED - no full catalog)...');
      const result = await this.apiCall('/plantasSupervisadas');
      
      // Manejo seguro de diferentes formatos de respuesta
      if (Array.isArray(result)) {
        return result;
      }
      
      if (result && typeof result === 'object') {
        // Intenta diferentes propiedades donde podría estar el array
        return result.data || result.plantasSupervisadas || result.results || [];
      }
      
      console.warn('⚠️ Unexpected response format, returning empty array');
      return [];
      
    } catch (error) {
      console.error('❌ Error fetching plantas supervisadas:', error);
      return []; // Retorna array vacío en lugar de undefined
    }
  }

  async createPlantaSupervisada(data: Omit<PlantaSupervisada, '_id' | 'createdAt' | 'updatedAt'>): Promise<PlantaSupervisada> {
    try {
      const result = await this.apiCall('/plantasSupervisadas', 'POST', data);
      return result.data || result;
    } catch (error) {
      console.error('Error creating planta supervisada:', error);
      throw error;
    }
  }

  // NUEVOS MÉTODOS FALTANTES
  async getPlantaSupervisada(id: string): Promise<PlantaSupervisada> {
    try {
      const result = await this.apiCall(`/plantasSupervisadas/${id}`);
      return result.data || result;
    } catch (error) {
      console.error('Error fetching planta supervisada:', error);
      throw error;
    }
  }

  async updatePlantaSupervisada(id: string, data: Partial<PlantaSupervisada>): Promise<PlantaSupervisada> {
    try {
      const result = await this.apiCall(`/plantasSupervisadas/${id}`, 'PUT', data);
      return result.data || result;
    } catch (error) {
      console.error('Error updating planta supervisada:', error);
      throw error;
    }
  }

  async deletePlantaSupervisada(id: string): Promise<void> {
    try {
      await this.apiCall(`/plantasSupervisadas/${id}`, 'DELETE');
    } catch (error) {
      console.error('Error deleting planta supervisada:', error);
      throw error;
    }
  }

  // ========== LECTURAS ==========
  async getLecturas(plantaSupervisadaId: string): Promise<Lectura[]> {
    try {
      const result = await this.apiCall(`/plantasSupervisadas/${plantaSupervisadaId}/lecturas`);
      return Array.isArray(result) ? result : (result.data || []);
    } catch (error) {
      console.error('Error fetching lecturas:', error);
      return [];
    }
  }

  // NUEVOS MÉTODOS FALTANTES
  async getLecturasRecientes(plantaSupervisadaId: string): Promise<Lectura[]> {
    try {
      const result = await this.apiCall(`/plantasSupervisadas/${plantaSupervisadaId}/lecturas/recientes`);
      return Array.isArray(result) ? result : (result.data || []);
    } catch (error) {
      console.error('Error fetching lecturas recientes:', error);
      return [];
    }
  }

  async createLectura(data: Omit<Lectura, '_id' | 'createdAt'>): Promise<Lectura> {
    try {
      const result = await this.apiCall('/lecturas', 'POST', data);
      return result.data || result;
    } catch (error) {
      console.error('Error creating lectura:', error);
      throw error;
    }
  }

  async getEstadisticasPlanta(plantaId: string): Promise<any> {
    try {
      const result = await this.apiCall(`/plantas/${plantaId}/estadisticas`);
      return result.data || result;
    } catch (error) {
      console.error('Error fetching estadísticas:', error);
      return null;
    }
  }

  // Método para forzar datos mock (si lo tienes)
  forceMockData(): void {
    console.log('🔄 Forcing mock data...');
    // Tu lógica de mock data aquí
  }
}

// Exporta una instancia singleton
export const api = new ApiService();