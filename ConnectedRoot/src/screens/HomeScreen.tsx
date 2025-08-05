// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text, FlatList, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import { usePlantasSupervisadas } from '../hooks/usePlantasSupervisadas';
import { PlantaSupervisadaWithDetails } from '../../types/database';
import { HomeScreenNavigationProp } from '../types/navigation';

interface StatItemProps {
  iconName: string;
  label: string;
  color?: string;
}

const StatItem: React.FC<StatItemProps> = ({ iconName, label, color = "green" }) => (
  <View className="flex-row items-center mr-4">
    <Ionicons name={iconName as any} size={20} color={color} />
    <Text className="text-xs text-gray-600 ml-1">{label}</Text>
  </View>
);

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { 
    plantasSupervisadasWithDetails, 
    loading, 
    error, 
    fetchWithDetails 
  } = usePlantasSupervisadas();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Cargar plantas supervisadas con detalles al montar el componente
    fetchWithDetails();
  }, [fetchWithDetails]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchWithDetails();
    } finally {
      setRefreshing(false);
    }
  };

  const handlePlantPress = (plantId: string) => {
    navigation.navigate('PlantInfoScreen', { id: plantId });
  };

  const getPlantStatus = (plant: PlantaSupervisadaWithDetails) => {
    if (!plant.activa) return { color: '#gray', text: 'Inactiva' };
    
    if (plant.ultimaLectura) {
      const horasDesdeUltimaLectura = (Date.now() - new Date(plant.ultimaLectura.timestamp).getTime()) / (1000 * 60 * 60);
      
      if (horasDesdeUltimaLectura < 2) return { color: '#10B981', text: 'Activa' };
      if (horasDesdeUltimaLectura < 24) return { color: '#F59E0B', text: 'Datos antiguos' };
      return { color: '#EF4444', text: 'Sin datos recientes' };
    }
    
    return { color: '#6B7280', text: 'Sin lecturas' };
  };

  const formatLastReading = (timestamp: Date) => {
    const now = new Date();
    const readingTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - readingTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `Hace ${diffInDays}d`;
  };

  const renderPlantItem = ({ item }: { item: PlantaSupervisadaWithDetails }) => {
    const status = getPlantStatus(item);
    const plantName = item.nombre || item.plantData?.nombreComun || 'Sin nombre';
    const scientificName = item.plantData?.nombreCientifico || '';
    
    return (
      <TouchableOpacity
        onPress={() => handlePlantPress(item._id)}
        className="flex-row bg-white rounded-xl p-4 mb-5 shadow-md"
      >
        {/* Imagen o placeholder */}
        <View className="relative">
          <View 
            style={{ width: 70, height: 70, borderRadius: 35 }} 
            className="bg-green-100 items-center justify-center"
          >
            <Ionicons name="leaf" size={30} color="#10B981" />
          </View>
          
          {/* Indicador de estado */}
          <View 
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
            style={{ backgroundColor: status.color }}
          />
        </View>

        <View className="flex-1 ml-4 justify-center">
          {/* Nombre de la planta */}
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-lg font-semibold text-green-800 flex-1">
              {plantName}
            </Text>
            {item.ubicacion && (
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={14} color="#6B7280" />
                <Text className="text-xs text-gray-500 ml-1">{item.ubicacion}</Text>
              </View>
            )}
          </View>

          {/* Nombre científico */}
          {scientificName && (
            <Text className="text-sm text-gray-600 mb-2 italic">{scientificName}</Text>
          )}

          {/* Estadísticas basadas en última lectura */}
          <View className="flex-row flex-wrap">
            {item.ultimaLectura ? (
              <>
                <StatItem
                  iconName="thermometer-outline"
                  label={`${item.ultimaLectura.temperatura}°C`}
                />
                <StatItem
                  iconName="water-outline"
                  label={`${item.ultimaLectura.humedadSuelo}% suelo`}
                />
                <StatItem
                  iconName="cloud-outline"
                  label={`${item.ultimaLectura.humedadAtmosferica}% aire`}
                />
                <StatItem
                  iconName="sunny-outline"
                  label={`${item.ultimaLectura.luz} lux`}
                />
              </>
            ) : (
              // Mostrar datos ideales de la planta si no hay lecturas
              item.plantData && (
                <>
                  {typeof item.plantData.humedadSuelo === 'number' && (
                    <StatItem
                      iconName="water-outline"
                      label={`${item.plantData.humedadSuelo}% ideal`}
                      color="#6B7280"
                    />
                  )}
                  {typeof item.plantData.humedadAtmosferica === 'number' && (
                    <StatItem
                      iconName="cloud-outline"
                      label={`${item.plantData.humedadAtmosferica}% ideal`}
                      color="#6B7280"
                    />
                  )}
                  {item.plantData.luz && (
                    <StatItem
                      iconName="sunny-outline"
                      label={`Luz ${item.plantData.luz}`}
                      color="#6B7280"
                    />
                  )}
                </>
              )
            )}
          </View>

          {/* Estado y última lectura */}
          <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-gray-100">
            <View className="flex-row items-center">
              <View 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: status.color }}
              />
              <Text className="text-xs font-medium" style={{ color: status.color }}>
                {status.text}
              </Text>
            </View>
            
            {item.ultimaLectura && (
              <Text className="text-xs text-gray-500">
                {formatLastReading(item.ultimaLectura.timestamp)}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && plantasSupervisadasWithDetails.length === 0) {
    return (
      <ScreenWrapper title="Plantas Supervisadas">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-gray-600 mt-4">Cargando plantas supervisadas...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error) {
    return (
      <ScreenWrapper title="Plantas Supervisadas">
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-red-600 text-center mt-4 text-lg font-medium">
            Error al cargar datos
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            {error}
          </Text>
          <TouchableOpacity
            onPress={handleRefresh}
            className="bg-green-500 px-6 py-3 rounded-lg mt-6"
          >
            <Text className="text-white font-medium">Reintentar</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper title="Plantas Supervisadas">
      <FlatList
        data={plantasSupervisadasWithDetails}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={renderPlantItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#10B981']}
            tintColor="#10B981"
          />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="leaf-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-600 text-center text-lg font-medium mt-4">
              No hay plantas supervisadas
            </Text>
            <Text className="text-gray-500 text-center mt-2 px-6">
              Comienza supervisando alguna planta desde el catálogo
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('PlantInfoScreen')}
              className="bg-green-500 px-6 py-3 rounded-lg mt-6"
            >
              <Text className="text-white font-medium">Explorar catálogo</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </ScreenWrapper>
  );
};

export default HomeScreen;