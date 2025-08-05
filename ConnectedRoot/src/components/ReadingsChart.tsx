// components/ReadingsChart.tsx
import React from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { useLecturas } from '../hooks/useLecturas';
import { Lectura } from '../../types/database';

interface ReadingsChartProps {
  plantaSupervisadaId: string;
}

export const ReadingsChart: React.FC<ReadingsChartProps> = ({ plantaSupervisadaId }) => {
  const { lecturas, loading, error } = useLecturas(plantaSupervisadaId);
  const screenWidth = Dimensions.get('window').width;

  const getLastNReadings = (n: number) => {
    return lecturas.slice(0, n).reverse();
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-MX', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMetricCard = (title: string, value: number, unit: string, color: string, emoji: string) => (
    <View className="bg-white rounded-lg p-4 m-2 shadow-sm" style={{ minWidth: screenWidth * 0.4 }}>
      <Text className="text-lg font-bold" style={{ color }}>{emoji} {title}</Text>
      <Text className="text-2xl font-bold text-gray-800">{value}{unit}</Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600">Cargando lecturas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-600 text-center">{error}</Text>
      </View>
    );
  }

  const latestReading = lecturas[0];
  const recentReadings = getLastNReadings(7);

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Métricas actuales */}
      <View className="p-4">
        <Text className="text-xl font-bold text-gray-800 mb-4">📊 Última Lectura</Text>
        {latestReading ? (
          <>
            <Text className="text-sm text-gray-600 mb-4">
              {formatDate(latestReading.timestamp)}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {renderMetricCard('Humedad Suelo', latestReading.humedadSuelo, '%', '#3b82f6', '💧')}
              {renderMetricCard('Humedad Aire', latestReading.humedadAtmosferica, '%', '#06b6d4', '🌫️')}
              {renderMetricCard('Temperatura', latestReading.temperatura, '°C', '#ef4444', '🌡️')}
              {renderMetricCard('Luz', latestReading.luz, '%', '#f59e0b', '☀️')}
            </ScrollView>
          </>
        ) : (
          <Text className="text-gray-600">No hay lecturas disponibles</Text>
        )}
      </View>

      {/* Historial reciente */}
      <View className="p-4">
        <Text className="text-xl font-bold text-gray-800 mb-4">📈 Historial (7 días)</Text>
        {recentReadings.map((lectura, index) => (
          <View key={lectura._id} className="bg-white rounded-lg p-4 mb-3 shadow-sm">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-semibold text-gray-800">
                Lectura #{recentReadings.length - index}
              </Text>
              <Text className="text-sm text-gray-600">
                {formatDate(lectura.timestamp)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm">💧 {lectura.humedadSuelo}%</Text>
              <Text className="text-sm">🌫️ {lectura.humedadAtmosferica}%</Text>
              <Text className="text-sm">🌡️ {lectura.temperatura}°C</Text>
              <Text className="text-sm">☀️ {lectura.luz}%</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
