// components/PlantsList.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { usePlants } from '../hooks/usePlants';
import { Plant } from '../../types/database';

export const PlantsList: React.FC = () => {
  const { plants, loading, error, refetch } = usePlants();

  const renderPlant = ({ item }: { item: Plant }) => (
    <TouchableOpacity className="bg-white rounded-lg p-4 mb-3 shadow-sm">
      <Text className="text-xl font-bold text-green-800">{item.nombreComun}</Text>
      <Text className="text-sm italic text-gray-600">{item.nombreCientifico}</Text>
      <View className="mt-2">
        <Text className="text-sm">💧 Humedad suelo: {item.humedadSuelo}%</Text>
        <Text className="text-sm">🌫️ Humedad atmosférica: {item.humedadAtmosferica}%</Text>
        <Text className="text-sm">☀️ Luz: {item.luz}</Text>
        <Text className="text-sm">🌱 Cultivo: {item.tipoCultivo}</Text>
      </View>
      <Text className="text-sm mt-2 text-gray-700" numberOfLines={2}>
        {item.descripcion}
      </Text>
      {item.distribuciones && (
        <Text className="text-xs text-blue-600 mt-1">
          📍 {item.distribuciones.join(', ')}
        </Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="mt-2 text-gray-600">Cargando plantas...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-600 text-center mb-4">{error}</Text>
        <TouchableOpacity
          onPress={refetch}
          className="bg-green-600 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-semibold">Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={plants}
        renderItem={renderPlant}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
