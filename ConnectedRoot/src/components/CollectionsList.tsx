// src/components/CollectionsList.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { database, PlantaSupervisadaWithDetails } from '../../types/database';

const CollectionsList = () => {
  const [supervisedPlants, setSupervisedPlants] = useState<PlantaSupervisadaWithDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar plantas supervisadas al montar el componente
  useEffect(() => {
    loadSupervisedPlants();
  }, []);

  const loadSupervisedPlants = async () => {
    setLoading(true);
    try {
      const data = await database.getPlantasSupervisadasWithDetails();
      setSupervisedPlants(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las plantas supervisadas');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await database.getPlantasSupervisadasWithDetails();
      setSupervisedPlants(data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron actualizar las plantas supervisadas');
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateSupervisedPlant = () => {
    // Aquí podrías navegar a una pantalla de creación de planta supervisada
    // Por ahora solo mostramos un alert
    Alert.alert(
      'Crear Nueva Planta',
      'Esta funcionalidad te llevará a la pantalla de selección de plantas para supervisar.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Ir', onPress: () => {
          // Navegación a pantalla de plantas disponibles
          console.log('Navegar a selección de plantas');
        }}
      ]
    );
  };

  const handleDeleteSupervisedPlant = async (id: string, nombre: string) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres dejar de supervisar "${nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const success = await database.deletePlantaSupervisada(id);
            if (success) {
              setSupervisedPlants(prev => prev.filter(p => p._id !== id));
              Alert.alert('Éxito', 'Planta eliminada de supervisión');
            } else {
              Alert.alert('Error', 'No se pudo eliminar la planta supervisada');
            }
          },
        },
      ]
    );
  };

  const handleTogglePlantStatus = async (plant: PlantaSupervisadaWithDetails) => {
    const newStatus = !plant.activa;
    const success = await database.updatePlantaSupervisada(plant._id, { activa: newStatus });
    
    if (success) {
      setSupervisedPlants(prev => 
        prev.map(p => 
          p._id === plant._id ? { ...p, activa: newStatus } : p
        )
      );
      Alert.alert(
        'Estado actualizado',
        `La planta ha sido ${newStatus ? 'activada' : 'desactivada'}`
      );
    } else {
      Alert.alert('Error', 'No se pudo actualizar el estado de la planta');
    }
  };

  const getStatusColor = (activa: boolean) => {
    return activa ? 'bg-green-100' : 'bg-gray-100';
  };

  const getStatusTextColor = (activa: boolean) => {
    return activa ? 'text-green-800' : 'text-gray-600';
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderSupervisedPlant = ({ item }: { item: PlantaSupervisadaWithDetails }) => (
    <View className={`rounded-lg shadow-sm p-4 mb-3 mx-4 ${getStatusColor(item.activa)}`}>
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">
            {item.nombre || item.plantData?.nombreComun || 'Sin nombre'}
          </Text>
          {item.plantData && (
            <Text className="text-sm text-gray-600 italic">
              {item.plantData.nombreCientifico}
            </Text>
          )}
        </View>
        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={() => handleTogglePlantStatus(item)}
            className={`px-2 py-1 rounded ${item.activa ? 'bg-yellow-100' : 'bg-green-100'}`}
          >
            <Text className={`text-xs ${item.activa ? 'text-yellow-700' : 'text-green-700'}`}>
              {item.activa ? 'Pausar' : 'Activar'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteSupervisedPlant(
              item._id, 
              item.nombre || item.plantData?.nombreComun || 'Sin nombre'
            )}
            className="bg-red-100 px-2 py-1 rounded"
          >
            <Text className="text-red-600 text-xs">Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {item.ubicacion && (
        <Text className="text-gray-600 text-sm mb-2">
          📍 {item.ubicacion}
        </Text>
      )}

      {item.notas && (
        <Text className="text-gray-600 text-sm mb-2">
          💭 {item.notas}
        </Text>
      )}

      <View className="flex-row justify-between items-center pt-2 border-t border-gray-200">
        <View>
          <Text className={`text-xs font-medium ${getStatusTextColor(item.activa)}`}>
            Estado: {item.activa ? 'Activa' : 'Inactiva'}
          </Text>
          <Text className="text-xs text-gray-500">
            Desde: {formatDate(item.fechaInicio)}
          </Text>
        </View>
        
        {item.ultimaLectura && (
          <View className="text-right">
            <Text className="text-xs text-gray-500">Última lectura:</Text>
            <Text className="text-xs text-gray-700">
              {formatDate(item.ultimaLectura.timestamp)}
            </Text>
          </View>
        )}
      </View>

      {item.ultimaLectura && (
        <View className="mt-2 pt-2 border-t border-gray-200">
          <Text className="text-xs text-gray-600 mb-1">Últimos valores:</Text>
          <View className="flex-row justify-between">
            <Text className="text-xs text-gray-700">
              🌱 Suelo: {item.ultimaLectura.humedadSuelo}%
            </Text>
            <Text className="text-xs text-gray-700">
              💧 Ambiente: {item.ultimaLectura.humedadAtmosferica}%
            </Text>
            <Text className="text-xs text-gray-700">
              🌡️ {item.ultimaLectura.temperatura}°C
            </Text>
            <Text className="text-xs text-gray-700">
              ☀️ {item.ultimaLectura.luz}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  if (loading && supervisedPlants.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600">Cargando plantas supervisadas...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="flex-row justify-between items-center p-4">
        <Text className="text-2xl font-bold text-gray-800">
          Mis Plantas Supervisadas
        </Text>
        <TouchableOpacity
          onPress={handleCreateSupervisedPlant}
          className="bg-green-500 px-4 py-2 rounded-lg"
        >
          <Text className="text-white font-medium">+ Nueva</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={supervisedPlants}
        renderItem={renderSupervisedPlant}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#10B981']}
          />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-20">
            <Text className="text-gray-600 text-center mb-2">
              No tienes plantas supervisadas
            </Text>
            <Text className="text-gray-500 text-center text-sm mb-4">
              Comienza supervisando alguna planta de tu catálogo
            </Text>
            <TouchableOpacity
              onPress={handleCreateSupervisedPlant}
              className="bg-green-500 px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-medium">Supervisar primera planta</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default CollectionsList;