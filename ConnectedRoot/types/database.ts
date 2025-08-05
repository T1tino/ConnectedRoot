// types/database.ts
import { apiService } from '../src/services/api';

// Tipos originales de la base de datos
export interface Plant {
  _id: string;
  nombreComun: string;
  nombreCientifico: string;
  humedadSuelo: number; // Asumiendo que es un porcentaje
  humedadAtmosferica: number; // Asumiendo que es un porcentaje
  luz: 'baja' | 'media' | 'alta' | 'directa'; // O el tipo que manejes
  tipoCultivo: string;
  descripcion: string;
  distribuciones: string[]; // Asumiendo array de regiones/países
}

export interface PlantaSupervisada {
  _id: string;
  plantId: string; // Referencia a Plants._id
  userId?: string; // Si manejas usuarios
  nombre?: string; // Nombre personalizado que le dio el usuario
  fechaInicio: Date;
  ubicacion?: string;
  notas?: string;
  activa: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lectura {
  _id: string;
  plantaSupervisadaId: string; // Referencia a PlantasSupervisadas._id
  humedadSuelo: number;
  humedadAtmosferica: number;
  temperatura: number;
  luz: number;
  timestamp: Date;
  // Agregar más campos según tus sensores
}

// Tipos extendidos para el manejo local
export interface PlantWithStats extends Plant {
  cantidadSupervisadas: number;
  ultimaLectura?: Date;
}

export interface PlantaSupervisadaWithDetails extends PlantaSupervisada {
  plantData?: Plant;
  ultimaLectura?: Lectura;
  promedios?: {
    humedadSuelo: number;
    humedadAtmosferica: number;
    temperatura: number;
    luz: number;
  };
}

class DatabaseManager {
  private plants: Plant[] = [];
  private plantasSupervisadas: PlantaSupervisada[] = [];
  private lecturas: Lectura[] = [];
  private isLoading = { plants: false, supervisadas: false, lecturas: false };
  private lastFetch = { plants: null as Date | null, supervisadas: null as Date | null, lecturas: null as Date | null };
  private cacheDuration = 5 * 60 * 1000; // 5 minutos en ms

  // === PLANTAS ===
  async getPlants(forceRefresh = false): Promise<Plant[]> {
    const now = new Date();
    const shouldRefresh = forceRefresh || 
      !this.lastFetch.plants || 
      (now.getTime() - this.lastFetch.plants.getTime()) > this.cacheDuration;

    if (!shouldRefresh && this.plants.length > 0) {
      return this.plants;
    }

    if (this.isLoading.plants) {
      return this.waitForLoad('plants');
    }

    try {
      this.isLoading.plants = true;
      this.plants = await apiService.getPlants();
      this.lastFetch.plants = now;
      return this.plants;
    } catch (error) {
      console.error('Error loading plants from MongoDB:', error);
      return this.getFallbackPlants();
    } finally {
      this.isLoading.plants = false;
    }
  }

  async getPlant(id: string): Promise<Plant | null> {
    try {
      return await apiService.getPlant(id);
    } catch (error) {
      console.error('Error loading plant from MongoDB:', error);
      return null;
    }
  }

  async createPlant(data: Omit<Plant, '_id'>): Promise<Plant | null> {
    try {
      const newPlant = await apiService.createPlant(data);
      this.plants.push(newPlant);
      return newPlant;
    } catch (error) {
      console.error('Error creating plant:', error);
      return null;
    }
  }

  async updatePlant(id: string, data: Partial<Plant>): Promise<Plant | null> {
    try {
      const updatedPlant = await apiService.updatePlant(id, data);
      const index = this.plants.findIndex(p => p._id === id);
      if (index !== -1) {
        this.plants[index] = updatedPlant;
      }
      return updatedPlant;
    } catch (error) {
      console.error('Error updating plant:', error);
      return null;
    }
  }

  async deletePlant(id: string): Promise<boolean> {
    try {
      await apiService.deletePlant(id);
      this.plants = this.plants.filter(p => p._id !== id);
      return true;
    } catch (error) {
      console.error('Error deleting plant:', error);
      return false;
    }
  }

  // === PLANTAS SUPERVISADAS ===
  async getPlantasSupervisadas(forceRefresh = false): Promise<PlantaSupervisada[]> {
    const now = new Date();
    const shouldRefresh = forceRefresh || 
      !this.lastFetch.supervisadas || 
      (now.getTime() - this.lastFetch.supervisadas.getTime()) > this.cacheDuration;

    if (!shouldRefresh && this.plantasSupervisadas.length > 0) {
      return this.plantasSupervisadas;
    }

    if (this.isLoading.supervisadas) {
      return this.waitForLoad('supervisadas');
    }

    try {
      this.isLoading.supervisadas = true;
      this.plantasSupervisadas = await apiService.getPlantasSupervisadas();
      this.lastFetch.supervisadas = now;
      return this.plantasSupervisadas;
    } catch (error) {
      console.error('Error loading supervised plants from MongoDB:', error);
      return [];
    } finally {
      this.isLoading.supervisadas = false;
    }
  }

  async getPlantaSupervisada(id: string): Promise<PlantaSupervisada | null> {
    try {
      return await apiService.getPlantaSupervisada(id);
    } catch (error) {
      console.error('Error loading supervised plant from MongoDB:', error);
      return null;
    }
  }

  async createPlantaSupervisada(data: Omit<PlantaSupervisada, '_id' | 'createdAt' | 'updatedAt'>): Promise<PlantaSupervisada | null> {
    try {
      const newPlanta = await apiService.createPlantaSupervisada(data);
      this.plantasSupervisadas.push(newPlanta);
      return newPlanta;
    } catch (error) {
      console.error('Error creating supervised plant:', error);
      return null;
    }
  }

  async updatePlantaSupervisada(id: string, data: Partial<PlantaSupervisada>): Promise<PlantaSupervisada | null> {
    try {
      const updatedPlanta = await apiService.updatePlantaSupervisada(id, data);
      const index = this.plantasSupervisadas.findIndex(p => p._id === id);
      if (index !== -1) {
        this.plantasSupervisadas[index] = updatedPlanta;
      }
      return updatedPlanta;
    } catch (error) {
      console.error('Error updating supervised plant:', error);
      return null;
    }
  }

  async deletePlantaSupervisada(id: string): Promise<boolean> {
    try {
      await apiService.deletePlantaSupervisada(id);
      this.plantasSupervisadas = this.plantasSupervisadas.filter(p => p._id !== id);
      return true;
    } catch (error) {
      console.error('Error deleting supervised plant:', error);
      return false;
    }
  }

  // === LECTURAS ===
  async getLecturas(plantaSupervisadaId?: string, forceRefresh = false): Promise<Lectura[]> {
    try {
      return await apiService.getLecturas(plantaSupervisadaId);
    } catch (error) {
      console.error('Error loading readings from MongoDB:', error);
      return [];
    }
  }

  async getLecturasRecientes(plantaSupervisadaId: string, limit = 10): Promise<Lectura[]> {
    try {
      return await apiService.getLecturasRecientes(plantaSupervisadaId, limit);
    } catch (error) {
      console.error('Error loading recent readings:', error);
      return [];
    }
  }

  async createLectura(data: Omit<Lectura, '_id'>): Promise<Lectura | null> {
    try {
      const newLectura = await apiService.createLectura(data);
      return newLectura;
    } catch (error) {
      console.error('Error creating reading:', error);
      return null;
    }
  }

  // === MÉTODOS COMBINADOS ===
  async getPlantasSupervisadasWithDetails(): Promise<PlantaSupervisadaWithDetails[]> {
    try {
      const supervisadas = await this.getPlantasSupervisadas();
      const plants = await this.getPlants();
      
      const result: PlantaSupervisadaWithDetails[] = [];
      
      for (const supervisada of supervisadas) {
        const plantData = plants.find(p => p._id === supervisada.plantId);
        const lecturasRecientes = await this.getLecturasRecientes(supervisada._id, 1);
        
        result.push({
          ...supervisada,
          plantData,
          ultimaLectura: lecturasRecientes[0],
        });
      }
      
      return result;
    } catch (error) {
      console.error('Error loading supervised plants with details:', error);
      return [];
    }
  }

  async getEstadisticasPlanta(plantaSupervisadaId: string, dias = 7): Promise<any> {
    try {
      return await apiService.getEstadisticasPlanta(plantaSupervisadaId, dias);
    } catch (error) {
      console.error('Error loading plant statistics:', error);
      return null;
    }
  }

  // === UTILIDADES ===
  private async waitForLoad(type: 'plants' | 'supervisadas' | 'lecturas'): Promise<any[]> {
    return new Promise((resolve) => {
      const checkLoading = () => {
        if (!this.isLoading[type]) {
          switch (type) {
            case 'plants':
              resolve(this.plants);
              break;
            case 'supervisadas':
              resolve(this.plantasSupervisadas);
              break;
            case 'lecturas':
              resolve(this.lecturas);
              break;
          }
        } else {
          setTimeout(checkLoading, 100);
        }
      };
      checkLoading();
    });
  }

  clearCache(): void {
    this.plants = [];
    this.plantasSupervisadas = [];
    this.lecturas = [];
    this.lastFetch = { plants: null, supervisadas: null, lecturas: null };
  }

  async checkConnection(): Promise<boolean> {
    try {
      await apiService.getPlants();
      return true;
    } catch (error) {
      return false;
    }
  }

  private getFallbackPlants(): Plant[] {
    return [
      {
        _id: 'fallback-1',
        nombreComun: 'Rosa',
        nombreCientifico: 'Rosa gallica',
        humedadSuelo: 60,
        humedadAtmosferica: 50,
        luz: 'alta',
        tipoCultivo: 'Exterior',
        descripcion: 'Planta ornamental con flores aromáticas',
        distribuciones: ['Europa', 'Asia'],
      },
    ];
  }
}

// Exportar instancia singleton
export const database = new DatabaseManager();
export default database;