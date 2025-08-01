// src/services/plantApi.ts
import axios from 'axios';

const TREFLE_API_URL = 'https://trefle.io/api/v1/plants';
const TOKEN = 'TU_TOKEN_DE_TREFLE';

export const fetchPlantsByRegion = async (region: string) => {
  try {
    const response = await axios.get(`${TREFLE_API_URL}/search`, {
      params: {
        token: TOKEN,
        q: region, // Puede ser nombre común o científico
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching plants:', error);
    return [];
  }
};
