// utils/plantUtils.ts
export const getLightLevelColor = (lightLevel: string): string => {
  switch (lightLevel.toLowerCase()) {
    case 'baja': return '#6b7280';
    case 'media': return '#f59e0b';
    case 'alta': return '#eab308';
    case 'directa': return '#dc2626';
    default: return '#6b7280';
  }
};

export const getHumidityColor = (humidity: number): string => {
  if (humidity < 30) return '#dc2626'; // Rojo - muy seco
  if (humidity < 50) return '#f59e0b'; // Amarillo - seco
  if (humidity < 70) return '#10b981'; // Verde - óptimo
  if (humidity < 85) return '#3b82f6'; // Azul - húmedo
  return '#6366f1'; // Índigo - muy húmedo
};

export const getPlantHealthStatus = (
  currentHumidity: number, 
  optimalHumidity: number, 
  tolerance: number = 10
): { status: 'excellent' | 'good' | 'warning' | 'danger', message: string } => {
  const diff = Math.abs(currentHumidity - optimalHumidity);
  
  if (diff <= tolerance * 0.5) {
    return { status: 'excellent', message: 'Condiciones óptimas' };
  } else if (diff <= tolerance) {
    return { status: 'good', message: 'Condiciones buenas' };
  } else if (diff <= tolerance * 1.5) {
    return { status: 'warning', message: 'Requiere atención' };
  } else {
    return { status: 'danger', message: 'Condiciones críticas' };
  }
};