// components/SupervisedPlants.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { usePlantasSupervisadas } from '../hooks/usePlantasSupervisadas';
import { PlantaSupervisada } from '../../types/database';

export const SupervisedPlants: React.FC = () => {
  const {
    plantasSupervisadas,
    loading,
    error,
    addPlantaSupervisada,
    updatePlantaSupervisada,
    deletePlantaSupervisada
  } = usePlantasSupervisadas();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newPlantData, setNewPlantData] = useState({
    plantId: '',
    nombre: '',
    ubicacion: '',
    notas: ''
  });

  const handleAddPlant = async () => {
    try {
      // Solo pasar las propiedades que NO están excluidas en el tipo Omit
      await addPlantaSupervisada({
        plantId: newPlantData.plantId,
        nombre: newPlantData.nombre,
        ubicacion: newPlantData.ubicacion,
        notas: newPlantData.notas,
        fechaInicio: new Date(),
        activa: true
        // NO incluir createdAt ni updatedAt, ya que están excluidos del tipo
      });
      setShowAddModal(false);
      setNewPlantData({ plantId: '', nombre: '', ubicacion: '', notas: '' });
    } catch (error) {
      Alert.alert('Error', 'No se pudo agregar la planta supervisada');
    }
  };

  const handleDeletePlant = (planta: PlantaSupervisada) => {
    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que quieres eliminar "${planta.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deletePlantaSupervisada(planta._id)
        }
      ]
    );
  };

  const renderSupervisedPlant = ({ item }: { item: PlantaSupervisada }) => (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-lg font-bold text-green-800">{item.nombre}</Text>
          <Text className="text-sm text-gray-600">ID Planta: {item.plantId}</Text>
          {item.ubicacion && (
            <Text className="text-sm text-blue-600">📍 {item.ubicacion}</Text>
          )}
          <Text className="text-xs text-gray-500 mt-1">
            Iniciado: {new Date(item.fechaInicio).toLocaleDateString()}
          </Text>
        </View>
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => handleDeletePlant(item)}
            className="bg-red-500 px-3 py-1 rounded ml-2"
          >
            <Text className="text-white text-xs">Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
      {item.notas && (
        <Text className="text-sm text-gray-700 mt-2" numberOfLines={2}>
          💭 {item.notas}
        </Text>
      )}
      <View className="flex-row justify-between items-center mt-2">
        <Text className={`text-sm font-semibold ${item.activa ? 'text-green-600' : 'text-red-600'}`}>
          {item.activa ? '🟢 Activa' : '🔴 Inactiva'}
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4">
        <TouchableOpacity
          onPress={() => setShowAddModal(true)}
          className="bg-green-600 px-4 py-3 rounded-lg mb-4"
        >
          <Text className="text-white font-semibold text-center">+ Agregar Planta Supervisada</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={plantasSupervisadas}
        renderItem={renderSupervisedPlant}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal para agregar nueva planta supervisada */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg p-6 w-11/12 max-w-md">
            <Text className="text-lg font-bold mb-4">Nueva Planta Supervisada</Text>

            <TextInput
              placeholder="ID de la planta"
              value={newPlantData.plantId}
              onChangeText={(text) => setNewPlantData(prev => ({ ...prev, plantId: text }))}
              className="border border-gray-300 rounded px-3 py-2 mb-3"
            />

            <TextInput
              placeholder="Nombre personalizado"
              value={newPlantData.nombre}
              onChangeText={(text) => setNewPlantData(prev => ({ ...prev, nombre: text }))}
              className="border border-gray-300 rounded px-3 py-2 mb-3"
            />

            <TextInput
              placeholder="Ubicación"
              value={newPlantData.ubicacion}
              onChangeText={(text) => setNewPlantData(prev => ({ ...prev, ubicacion: text }))}
              className="border border-gray-300 rounded px-3 py-2 mb-3"
            />

            <TextInput
              placeholder="Notas"
              value={newPlantData.notas}
              onChangeText={(text) => setNewPlantData(prev => ({ ...prev, notas: text }))}
              className="border border-gray-300 rounded px-3 py-2 mb-4"
              multiline
              numberOfLines={3}
            />

            <View className="flex-row justify-end">
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                className="bg-gray-500 px-4 py-2 rounded mr-2"
              >
                <Text className="text-white">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAddPlant}
                className="bg-green-600 px-4 py-2 rounded"
              >
                <Text className="text-white">Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};