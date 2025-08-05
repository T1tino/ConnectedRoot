// src/api.ts
const API_BASE_URL = 'http://localhost:4000'; // Ajusta si usas LAN o un túnel tipo ngrok

export async function getPlantas() {
  try {
    const response = await fetch(`${API_BASE_URL}/plantas`);
    if (!response.ok) throw new Error('Error al obtener las plantas');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener plantas:', error);
    throw error;
  }
}