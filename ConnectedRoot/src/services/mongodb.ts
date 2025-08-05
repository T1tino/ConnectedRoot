// services/mongodb.ts
import { Plant, PlantaSupervisada, Lectura } from '../types/database';

const MONGODB_URI = 'mongodb+srv://0323105932:0323105932@rootdb.mnmbdoa.mongodb.net/RootDB';
const API_BASE_URL = 'https://tu-backend-url.com/api'; // Necesitarás crear un backend

class MongoDBService {
  // Para React Native, necesitas un backend intermedio ya que no puedes conectar directamente a MongoDB
  // Aquí tienes opciones para las llamadas HTTP

  // PLANTS COLLECTION
  async getAllPlants(): Promise<Plant[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/plants`);
      if (!response.ok) throw new Error('Error fetching plants');
      return await response.json();
    } catch (error) {
      console.error('Error getting plants:', error);
      throw error;
    }
  }

  async getPlantById(id: string): Promise<Plant> {
    try {
      const response = await fetch(`${API_BASE_URL}/plants/${id}`);
      if (!response.ok) throw new Error('Error fetching plant');
      return await response.json();
    } catch (error) {
      console.error('Error getting plant:', error);
      throw error;
    }
  }

  async searchPlants(query: string): Promise<Plant[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/plants/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Error searching plants');
      return await response.json();
    } catch (error) {
      console.error('Error searching plants:', error);
      throw error;
    }
  }

  // PLANTAS SUPERVISADAS COLLECTION
  async getPlantasSupervisadas(): Promise<PlantaSupervisada[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/plantas-supervisadas`);
      if (!response.ok) throw new Error('Error fetching supervised plants');
      return await response.json();
    } catch (error) {
      console.error('Error getting supervised plants:', error);
      throw error;
    }
  }

  async createPlantaSupervisada(data: Omit<PlantaSupervisada, '_id' | 'createdAt' | 'updatedAt'>): Promise<PlantaSupervisada> {
    try {
      const response = await fetch(`${API_BASE_URL}/plantas-supervisadas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      });
      if (!response.ok) throw new Error('Error creating supervised plant');
      return await response.json();
    } catch (error) {
      console.error('Error creating supervised plant:', error);
      throw error;
    }
  }

  async updatePlantaSupervisada(id: string, data: Partial<PlantaSupervisada>): Promise<PlantaSupervisada> {
    try {
      const response = await fetch(`${API_BASE_URL}/plantas-supervisadas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          updatedAt: new Date(),
        }),
      });
      if (!response.ok) throw new Error('Error updating supervised plant');
      return await response.json();
    } catch (error) {
      console.error('Error updating supervised plant:', error);
      throw error;
    }
  }

  async deletePlantaSupervisada(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/plantas-supervisadas/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting supervised plant:', error);
      throw error;
    }
  }

  // LECTURAS
  async getLecturasByPlantaSupervisada(plantaSupervisadaId: string): Promise<Lectura[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/lecturas/planta/${plantaSupervisadaId}`);
      if (!response.ok) throw new Error('Error fetching readings');
      return await response.json();
    } catch (error) {
      console.error('Error getting readings:', error);
      throw error;
    }
  }

  async createLectura(data: Omit<Lectura, '_id'>): Promise<Lectura> {
    try {
      const response = await fetch(`${API_BASE_URL}/lecturas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Error creating reading');
      return await response.json();
    } catch (error) {
      console.error('Error creating reading:', error);
      throw error;
    }
  }
}

export const mongoDBService = new MongoDBService();