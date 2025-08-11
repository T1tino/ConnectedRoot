// utils/dataExport.ts - Exportar datos
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Share } from 'react-native';

// Importar la configuración de API desde el servicio
// O definir localmente si no está disponible
const getApiBaseUrl = () => {
  if (__DEV__) {
    // Para desarrollo - reemplaza con tu IP local
    return `${API_BASE_URL}`; 
  } else {
    // Para producción
    return 'https://ConnectedRoot.com/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

export const exportPlantData = async (plantaSupervisadaId: string) => {
  try {
    console.log('📊 Exporting plant data for:', plantaSupervisadaId);
    
    // Obtener datos de lecturas
    const response = await fetch(`${API_BASE_URL}/lecturas/planta/${plantaSupervisadaId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const lecturas = await response.json();
    console.log('📈 Retrieved readings:', lecturas.length);

    // Formatear datos para CSV
    const csvHeader = 'Fecha,Humedad Suelo (%),Humedad Atmosférica (%),Temperatura (°C),Luz (%)\n';
    const csvData = lecturas.map((lectura: any) =>
      `${new Date(lectura.timestamp).toISOString()},${lectura.humedadSuelo},${lectura.humedadAtmosferica},${lectura.temperatura},${lectura.luz}`
    ).join('\n');

    const csvContent = csvHeader + csvData;

    // Guardar temporalmente en AsyncStorage como respaldo
    await AsyncStorage.setItem(`plant_data_${plantaSupervisadaId}`, csvContent);

    // Compartir archivo
    await Share.share({
      message: csvContent,
      title: `Datos de Planta ${plantaSupervisadaId}`,
    });

    console.log('✅ Plant data exported successfully');

  } catch (error) {
    console.error('❌ Error exporting data:', error);
    throw error;
  }
};

// Función adicional para exportar múltiples plantas
export const exportMultiplePlantsData = async (plantaIds: string[]) => {
  try {
    console.log('📊 Exporting data for multiple plants:', plantaIds.length);
    
    const allData: any[] = [];
    
    for (const plantaId of plantaIds) {
      const response = await fetch(`${API_BASE_URL}/lecturas/planta/${plantaId}`);
      if (response.ok) {
        const lecturas = await response.json();
        allData.push({
          plantaId,
          lecturas: lecturas
        });
      }
    }

    // Formatear datos combinados
    let csvContent = 'PlantaID,Fecha,Humedad Suelo (%),Humedad Atmosférica (%),Temperatura (°C),Luz (%)\n';
    
    allData.forEach(({ plantaId, lecturas }) => {
      lecturas.forEach((lectura: any) => {
        csvContent += `${plantaId},${new Date(lectura.timestamp).toISOString()},${lectura.humedadSuelo},${lectura.humedadAtmosferica},${lectura.temperatura},${lectura.luz}\n`;
      });
    });

    await Share.share({
      message: csvContent,
      title: 'Datos de Múltiples Plantas',
    });

    console.log('✅ Multiple plants data exported successfully');

  } catch (error) {
    console.error('❌ Error exporting multiple plants data:', error);
    throw error;
  }
};

// Función para obtener datos históricos
export const getHistoricalData = async (plantaSupervisadaId: string, days: number = 30) => {
  try {
    const response = await fetch(`${API_BASE_URL}/lecturas/planta/${plantaSupervisadaId}?days=${days}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('❌ Error getting historical data:', error);
    throw error;
  }
};