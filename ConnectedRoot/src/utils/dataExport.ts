// utils/dataExport.ts - Exportar datos
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Share } from 'react-native';

export const exportPlantData = async (plantaSupervisadaId: string) => {
  try {
    // Obtener datos de lecturas
    const response = await fetch(`${API_BASE_URL}/lecturas/planta/${plantaSupervisadaId}`);
    const lecturas = await response.json();
    
    // Formatear datos para CSV
    const csvHeader = 'Fecha,Humedad Suelo (%),Humedad Atmosférica (%),Temperatura (°C),Luz (%)\n';
    const csvData = lecturas.map((lectura: any) => 
      `${new Date(lectura.timestamp).toISOString()},${lectura.humedadSuelo},${lectura.humedadAtmosferica},${lectura.temperatura},${lectura.luz}`
    ).join('\n');
    
    const csvContent = csvHeader + csvData;
    
    // Compartir archivo
    await Share.share({
      message: csvContent,
      title: 'Datos de Planta',
    });
    
  } catch (error) {
    console.error('Error exporting data:', error);
  }
};