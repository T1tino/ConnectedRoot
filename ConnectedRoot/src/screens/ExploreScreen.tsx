// src/screens/ExploreScreen.tsx
import React, { useState, useMemo } from 'react';
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import { PlantDetailModal } from '../components/PlantDetailModal';
import { usePlants } from '../hooks/usePlants';
import { Plant } from '../../types/database';
import { ExploreScreenNavigationProp } from '../types/navigation';

export default function ExploreScreen() {
  const navigation = useNavigation<ExploreScreenNavigationProp>();
  const { plants, loading, error, refetch } = usePlants();
  
  const [search, setSearch] = useState('');
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);
  const [showPlantModal, setShowPlantModal] = useState(false);

  // Filtrar plantas basado en la búsqueda
  const filteredPlants = useMemo(() => {
    if (!search.trim()) return plants;
    
    const searchLower = search.toLowerCase();
    return plants.filter(plant => 
      plant.nombreComun.toLowerCase().includes(searchLower) ||
      plant.nombreCientifico.toLowerCase().includes(searchLower) ||
      plant.descripcion.toLowerCase().includes(searchLower) ||
      plant.distribuciones?.some(dist => 
        dist.toLowerCase().includes(searchLower)
      )
    );
  }, [plants, search]);

  const handlePlantPress = (plant: Plant) => {
    setSelectedPlant(plant);
    setShowPlantModal(true);
  };

  const handleCloseModal = () => {
    setShowPlantModal(false);
    setSelectedPlant(null);
  };

  const getPlantIcon = (tipoCultivo: string) => {
    switch (tipoCultivo.toLowerCase()) {
      case 'interior':
        return 'home-outline';
      case 'exterior':
        return 'sunny-outline';
      case 'invernadero':
        return 'business-outline';
      default:
        return 'leaf-outline';
    }
  };

  const getLightIcon = (luz: string) => {
    switch (luz.toLowerCase()) {
      case 'baja':
        return 'moon-outline';
      case 'media':
        return 'partly-sunny-outline';
      case 'alta':
        return 'sunny-outline';
      case 'directa':
        return 'sunny';
      default:
        return 'bulb-outline';
    }
  };

  const renderPlantItem = ({ item }: { item: Plant }) => (
    <TouchableOpacity
      className="mb-4"
      onPress={() => handlePlantPress(item)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center bg-white rounded-xl shadow-md p-4 mx-2">
        {/* Icono de la planta */}
        <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mr-4">
          <Ionicons 
            name={getPlantIcon(item.tipoCultivo) as any} 
            size={24} 
            color="#10B981" 
          />
        </View>

        {/* Información de la planta */}
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800 mb-1">
            {item.nombreComun}
          </Text>
          <Text className="text-sm italic text-gray-600 mb-2">
            {item.nombreCientifico}
          </Text>
          
          {/* Información de cuidados */}
          <View className="flex-row items-center space-x-3">
            <View className="flex-row items-center">
              <Ionicons name="water-outline" size={14} color="#3B82F6" />
              <Text className="text-xs text-gray-600 ml-1">
                {item.humedadSuelo}%
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Ionicons 
                name={getLightIcon(item.luz) as any} 
                size={14} 
                color="#F59E0B" 
              />
              <Text className="text-xs text-gray-600 ml-1">
                {item.luz}
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Ionicons 
                name={getPlantIcon(item.tipoCultivo) as any} 
                size={14} 
                color="#10B981" 
              />
              <Text className="text-xs text-gray-600 ml-1">
                {item.tipoCultivo}
              </Text>
            </View>
          </View>

          {/* Distribución */}
          {item.distribuciones && item.distribuciones.length > 0 && (
            <Text className="text-xs text-blue-600 mt-1" numberOfLines={1}>
              📍 {item.distribuciones.slice(0, 2).join(', ')}
              {item.distribuciones.length > 2 && '...'}
            </Text>
          )}
        </View>

        {/* Indicador de más información */}
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-20">
      <Ionicons name="search-outline" size={64} color="#D1D5DB" />
      <Text className="text-lg text-gray-600 mt-4 text-center">
        {search.trim() ? 'No se encontraron plantas' : 'Busca plantas por nombre'}
      </Text>
      <Text className="text-sm text-gray-500 text-center mt-2 px-6">
        {search.trim() 
          ? 'Intenta con otro término de búsqueda'
          : 'Escribe en el buscador para encontrar plantas específicas'
        }
      </Text>
    </View>
  );

  if (error) {
    return (
      <ScreenWrapper title="Explorar Plantas">
        <View className="flex-1 justify-center items-center p-4">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-red-600 text-center mt-4 text-lg font-medium">
            Error al cargar plantas
          </Text>
          <Text className="text-gray-600 text-center mt-2">
            {error}
          </Text>
          <TouchableOpacity
            onPress={refetch}
            className="bg-green-500 px-6 py-3 rounded-lg mt-6"
          >
            <Text className="text-white font-medium">Reintentar</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper title="Explorar Plantas">
      <View className="flex-1 bg-white rounded-lg">
        {/* Header con búsqueda y estadísticas */}
        <View className="p-4 border-b border-gray-200">
          {/* Barra de búsqueda */}
          <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-3">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Buscar plantas por nombre, tipo o ubicación..."
              value={search}
              onChangeText={setSearch}
              className="flex-1 ml-3 text-gray-800"
              placeholderTextColor="#9CA3AF"
            />
            {search.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearch('')}
                className="ml-2"
              >
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          {/* Estadísticas */}
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-gray-600">
              {filteredPlants.length} de {plants.length} plantas
            </Text>
            {loading && (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#10B981" />
                <Text className="text-sm text-gray-600 ml-2">Cargando...</Text>
              </View>
            )}
          </View>
        </View>

        {/* Lista de plantas */}
        {loading && plants.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#10B981" />
            <Text className="text-gray-600 mt-4">Cargando catálogo de plantas...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredPlants}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24, flexGrow: 1 }}
            renderItem={renderPlantItem}
            ListEmptyComponent={renderEmptyState}
            refreshing={loading}
            onRefresh={refetch}
          />
        )}

        {/* Modal de detalles de planta */}
        <PlantDetailModal
          plant={selectedPlant}
          visible={showPlantModal}
          onClose={handleCloseModal}
        />
      </View>
    </ScreenWrapper>
  );
}