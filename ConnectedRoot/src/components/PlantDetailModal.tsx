// components/PlantDetailModal.tsx
import React, { useState } from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Plant } from '../../types/database';
import { usePlantasSupervisadas } from '../hooks/usePlantasSupervisadas';

interface PlantDetailModalProps {
  plant: Plant | null;
  visible: boolean;
  onClose: () => void;
}

export const PlantDetailModal: React.FC<PlantDetailModalProps> = ({ plant, visible, onClose }) => {
  const { addPlantaSupervisada } = usePlantasSupervisadas();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    ubicacion: '',
    notas: ''
  });

  const handleAddToSupervised = async () => {
    if (!plant) return;
    
    try {
      await addPlantaSupervisada({
        plantId: plant._id,
        nombre: formData.nombre || plant.nombreComun,
        ubicacion: formData.ubicacion,
        notas: formData.notas,
        fechaInicio: new Date(),
        activa: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      setShowAddForm(false);
      setFormData({ nombre: '', ubicacion: '', notas: '' });
      onClose();
    } catch (error) {
      console.error('Error adding supervised plant:', error);
    }
  };

  if (!plant) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <Text className="text-xl font-bold text-green-800">Detalles de Planta</Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <Text className="text-lg text-gray-600">✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1">
          {/* Información básica */}
          <View className="p-4">
            <Text className="text-2xl font-bold text-green-800 mb-2">{plant.nombreComun}</Text>
            <Text className="text-lg italic text-gray-600 mb-4">{plant.nombreCientifico}</Text>
            
            <Text className="text-base text-gray-700 mb-4">{plant.descripcion}</Text>

            {/* Cuidados */}
            <View className="bg-green-50 rounded-lg p-4 mb-4">
              <Text className="text-lg font-bold text-green-800 mb-3">🌱 Cuidados Requeridos</Text>
              <View className="space-y-2">
                <View className="flex-row items-center">
                  <Text className="text-base">💧 Humedad del suelo: </Text>
                  <Text className="font-semibold">{plant.humedadSuelo}%</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-base">🌫️ Humedad atmosférica: </Text>
                  <Text className="font-semibold">{plant.humedadAtmosferica}%</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-base">☀️ Requerimiento de luz: </Text>
                  <Text className="font-semibold">{plant.luz}</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="text-base">🌾 Tipo de cultivo: </Text>
                  <Text className="font-semibold">{plant.tipoCultivo}</Text>
                </View>
              </View>
            </View>

            {/* Distribución */}
            {plant.distribuciones && plant.distribuciones.length > 0 && (
              <View className="bg-blue-50 rounded-lg p-4 mb-4">
                <Text className="text-lg font-bold text-blue-800 mb-2">📍 Distribución</Text>
                <Text className="text-base text-blue-700">{plant.distribuciones.join(', ')}</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Botones de acción */}
        <View className="p-4 border-t border-gray-200">
          {!showAddForm ? (
            <TouchableOpacity
              onPress={() => setShowAddForm(true)}
              className="bg-green-600 rounded-lg py-3 px-4"
            >
              <Text className="text-white text-center font-semibold">
                🔧 Agregar a Plantas Supervisadas
              </Text>
            </TouchableOpacity>
          ) : (
            <View>
              <Text className="text-lg font-bold mb-3">Configurar supervisión</Text>
              
              <TextInput
                placeholder={`Nombre (por defecto: ${plant.nombreComun})`}
                value={formData.nombre}
                onChangeText={(text) => setFormData(prev => ({ ...prev, nombre: text }))}
                className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
              />
              
              <TextInput
                placeholder="Ubicación (ej: Balcón sur, Jardín trasero)"
                value={formData.ubicacion}
                onChangeText={(text) => setFormData(prev => ({ ...prev, ubicacion: text }))}
                className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
              />
              
              <TextInput
                placeholder="Notas adicionales"
                value={formData.notas}
                onChangeText={(text) => setFormData(prev => ({ ...prev, notas: text }))}
                className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
                multiline
                numberOfLines={3}
              />
              
              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-500 rounded-lg py-2 px-4 mr-2"
                >
                  <Text className="text-white text-center">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleAddToSupervised}
                  className="flex-1 bg-green-600 rounded-lg py-2 px-4"
                >
                  <Text className="text-white text-center">Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
