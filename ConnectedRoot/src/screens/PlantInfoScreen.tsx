// src/screens/PlantInfoScreen.tsx
import React, { useEffect, useState } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { usePlantasSupervisadas } from '../hooks/usePlantasSupervisadas'
import { PlantaSupervisadaWithDetails } from '../../types/database'
import { PlantInfoScreenRouteProp } from '../types/navigation'

export default function PlantInfoScreen() {
  const navigation = useNavigation()
  const route = useRoute<PlantInfoScreenRouteProp>()
  const { id } = route.params || {}
  
  const { plantasSupervisadasWithDetails, loading, fetchWithDetails } = usePlantasSupervisadas()
  const [plantData, setPlantData] = useState<PlantaSupervisadaWithDetails | null>(null)
  const [loadingPlant, setLoadingPlant] = useState(true)

  useEffect(() => {
    const loadPlantData = async () => {
      if (id) {
        // Si tenemos un ID, buscar la planta específica
        await fetchWithDetails()
        const foundPlant = plantasSupervisadasWithDetails.find(plant => plant._id === id)
        setPlantData(foundPlant || null)
      }
      setLoadingPlant(false)
    }

    loadPlantData()
  }, [id, fetchWithDetails])

  // Actualizar plantData cuando cambien las plantas supervisadas
  useEffect(() => {
    if (id && plantasSupervisadasWithDetails.length > 0) {
      const foundPlant = plantasSupervisadasWithDetails.find(plant => plant._id === id)
      setPlantData(foundPlant || null)
    }
  }, [id, plantasSupervisadasWithDetails])

  const getPlantStatus = (plant: PlantaSupervisadaWithDetails) => {
    if (!plant.activa) return { color: '#gray', text: 'Inactiva' }
    
    if (plant.ultimaLectura) {
      const horasDesdeUltimaLectura = (Date.now() - new Date(plant.ultimaLectura.timestamp).getTime()) / (1000 * 60 * 60)
      
      if (horasDesdeUltimaLectura < 2) return { color: '#10B981', text: 'Activa' }
      if (horasDesdeUltimaLectura < 24) return { color: '#F59E0B', text: 'Datos antiguos' }
      return { color: '#EF4444', text: 'Sin datos recientes' }
    }
    
    return { color: '#6B7280', text: 'Sin lecturas' }
  }

  const formatLastReading = (timestamp: Date) => {
    const now = new Date()
    const readingTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - readingTime.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Ahora'
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `Hace ${diffInHours}h`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `Hace ${diffInDays}d`
  }

  const handleDeletePlant = () => {
    Alert.alert(
      "Eliminar planta",
      "¿Estás seguro de que deseas eliminar esta planta del seguimiento?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            // Aquí implementarías la lógica para eliminar la planta
            console.log("Eliminando planta:", plantData?._id)
            navigation.goBack()
          }
        }
      ]
    )
  }

  if (loadingPlant || loading) {
    return (
      <View className="flex-1 bg-white">
        <View className="flex-row items-center justify-between px-6 pt-10 mb-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">Planta</Text>
          <View style={{ width: 24 }} />
        </View>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-gray-600 mt-4">Cargando información de la planta...</Text>
        </View>
      </View>
    )
  }

  if (!plantData) {
    return (
      <View className="flex-1 bg-white">
        <View className="flex-row items-center justify-between px-6 pt-10 mb-4">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">Planta</Text>
          <View style={{ width: 24 }} />
        </View>
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="leaf-outline" size={64} color="#D1D5DB" />
          <Text className="text-gray-600 text-center text-lg font-medium mt-4">
            Planta no encontrada
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            La planta que buscas no está disponible
          </Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-green-500 px-6 py-3 rounded-lg mt-6"
          >
            <Text className="text-white font-medium">Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const status = getPlantStatus(plantData)
  const plantName = plantData.nombre || plantData.plantData?.nombreComun || 'Sin nombre'
  const scientificName = plantData.plantData?.nombreCientifico || ''

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-10">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black">
          {plantName}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Imagen de la planta */}
      <View className="items-center mt-2 mb-6">
        <View 
          style={{ width: 160, height: 160 }} 
          className="bg-green-100 rounded-2xl items-center justify-center mb-4"
        >
          <Ionicons name="leaf" size={80} color="#10B981" />
        </View>
        
        <Text className="text-2xl font-semibold text-center text-black">
          {plantName}
        </Text>
        
        {scientificName && (
          <Text className="text-lg text-gray-600 italic text-center mt-1">
            {scientificName}
          </Text>
        )}

        {/* Estado de la planta */}
        <View className="flex-row items-center mt-3">
          <View 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: status.color }}
          />
          <Text className="text-sm font-medium" style={{ color: status.color }}>
            {status.text}
          </Text>
        </View>

        {/* Ubicación */}
        {plantData.ubicacion && (
          <View className="flex-row items-center mt-2">
            <Ionicons name="location-outline" size={16} color="#6B7280" />
            <Text className="text-sm text-gray-600 ml-1">{plantData.ubicacion}</Text>
          </View>
        )}
      </View>

      {/* Información ambiental actual */}
      {plantData.ultimaLectura ? (
        <View className="flex-row justify-between px-4 mb-8">
          <View className="items-center">
            <Feather name="droplet" size={24} color="#34d399" />
            <Text className="text-lg font-semibold text-black mt-1">
              {plantData.ultimaLectura.humedadSuelo}%
            </Text>
            <Text className="text-xs text-gray-500">
              Humedad Suelo
            </Text>
          </View>
          <View className="items-center">
            <Feather name="sun" size={24} color="#facc15" />
            <Text className="text-lg font-semibold text-black mt-1">
              {plantData.ultimaLectura.temperatura}°C
            </Text>
            <Text className="text-xs text-gray-500">
              Temperatura
            </Text>
          </View>
          <View className="items-center">
            <Ionicons name="water-outline" size={24} color="#60a5fa" />
            <Text className="text-lg font-semibold text-black mt-1">
              {plantData.ultimaLectura.humedadAtmosferica}%
            </Text>
            <Text className="text-xs text-gray-500">
              Humedad Aire
            </Text>
          </View>
          <View className="items-center">
            <Feather name="sun" size={24} color="#f59e0b" />
            <Text className="text-lg font-semibold text-black mt-1">
              {plantData.ultimaLectura.luz}
            </Text>
            <Text className="text-xs text-gray-500">
              Luz (lux)
            </Text>
          </View>
        </View>
      ) : (
        <View className="bg-gray-100 rounded-lg p-4 mb-6">
          <Text className="text-center text-gray-600">
            No hay lecturas disponibles para esta planta
          </Text>
        </View>
      )}

      {/* Última actualización y comparación con recomendaciones */}
      {plantData.ultimaLectura && (
        <View className="bg-gray-50 rounded-lg p-3 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Feather name="clock" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-700 ml-2 font-medium">
                Última lectura: {formatLastReading(plantData.ultimaLectura.timestamp)}
              </Text>
            </View>
            <View className="flex-row items-center">
              <View 
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: status.color }}
              />
              <Text className="text-xs" style={{ color: status.color }}>
                {status.text}
              </Text>
            </View>
          </View>

          {/* Comparación con recomendaciones si están disponibles */}
          {plantData.plantData && (
            <View className="space-y-2">
              {plantData.plantData.humedadSuelo && plantData.plantData.humedadSuelo !== '' && plantData.plantData.humedadSuelo !== null && (
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs text-gray-600">Humedad suelo vs recomendado:</Text>
                  <Text className="text-xs text-gray-700">
                    {plantData.ultimaLectura.humedadSuelo}% / {plantData.plantData.humedadSuelo}%
                    {Math.abs(Number(plantData.ultimaLectura.humedadSuelo) - Number(plantData.plantData.humedadSuelo)) <= 5 && (
                      <Text className="text-green-600"> ✓</Text>
                    )}
                  </Text>
                </View>
              )}
              
              {plantData.plantData.humedadAtmosferica && plantData.plantData.humedadAtmosferica !== '' && plantData.plantData.humedadAtmosferica !== null && (
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs text-gray-600">Humedad aire vs recomendado:</Text>
                  <Text className="text-xs text-gray-700">
                    {plantData.ultimaLectura.humedadAtmosferica}% / {plantData.plantData.humedadAtmosferica}%
                    {Math.abs(Number(plantData.ultimaLectura.humedadAtmosferica) - Number(plantData.plantData.humedadAtmosferica)) <= 5 && (
                      <Text className="text-green-600"> ✓</Text>
                    )}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      )}

      {/* Valores ideales/recomendaciones de la planta */}
      {plantData.plantData && (
        <View className="mb-6">
          <Text className="text-lg font-bold text-black mb-3">
            Recomendaciones de Cultivo
          </Text>
          <View className="bg-green-50 rounded-lg p-4">
            {/* Mostrar recomendaciones cuando estén disponibles */}
            <View className="space-y-3">
              {plantData.plantData.humedadSuelo && plantData.plantData.humedadSuelo !== '' && plantData.plantData.humedadSuelo !== null && (
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Feather name="droplet" size={16} color="#059669" />
                    <Text className="text-sm text-green-800 ml-2">Humedad del Suelo</Text>
                  </View>
                  <Text className="text-sm text-green-700 font-medium">{plantData.plantData.humedadSuelo}%</Text>
                </View>
              )}
              
              {plantData.plantData.humedadAtmosferica && plantData.plantData.humedadAtmosferica !== '' && plantData.plantData.humedadAtmosferica !== null && (
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="water-outline" size={16} color="#059669" />
                    <Text className="text-sm text-green-800 ml-2">Humedad Ambiental</Text>
                  </View>
                  <Text className="text-sm text-green-700 font-medium">{plantData.plantData.humedadAtmosferica}%</Text>
                </View>
              )}
              
              {plantData.plantData.luz && plantData.plantData.luz !== '' && plantData.plantData.luz !== null && (
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Feather name="sun" size={16} color="#059669" />
                    <Text className="text-sm text-green-800 ml-2">Requerimiento de Luz</Text>
                  </View>
                  <Text className="text-sm text-green-700 font-medium capitalize">{plantData.plantData.luz}</Text>
                </View>
              )}
              
              {plantData.plantData.tipoCultivo && plantData.plantData.tipoCultivo !== '' && plantData.plantData.tipoCultivo !== null && (
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons name="leaf-outline" size={16} color="#059669" />
                    <Text className="text-sm text-green-800 ml-2">Tipo de Cultivo</Text>
                  </View>
                  <Text className="text-sm text-green-700 font-medium">{plantData.plantData.tipoCultivo}</Text>
                </View>
              )}
              
              {/* Mostrar mensaje cuando no hay recomendaciones */}
              {(!plantData.plantData.humedadSuelo || plantData.plantData.humedadSuelo === '' || plantData.plantData.humedadSuelo === null) &&
               (!plantData.plantData.humedadAtmosferica || plantData.plantData.humedadAtmosferica === '' || plantData.plantData.humedadAtmosferica === null) &&
               (!plantData.plantData.luz || plantData.plantData.luz === '' || plantData.plantData.luz === null) &&
               (!plantData.plantData.tipoCultivo || plantData.plantData.tipoCultivo === '' || plantData.plantData.tipoCultivo === null) && (
                <View className="items-center py-4">
                  <Ionicons name="information-circle-outline" size={24} color="#6B7280" />
                  <Text className="text-center text-gray-600 mt-2 text-sm">
                    No hay recomendaciones específicas disponibles para esta planta
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Botones de acción */}
      <View className="flex-row justify-around mb-6">
        <TouchableOpacity 
          className="bg-green-500 p-4 rounded-2xl items-center" 
          style={{ width: '30%' }}
        >
          <MaterialCommunityIcons name="watering-can" size={24} color="white" />
          <Text className="text-white text-sm mt-1">
            Regar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-yellow-400 p-4 rounded-2xl items-center" 
          style={{ width: '30%' }}
        >
          <Feather name="scissors" size={24} color="white" />
          <Text className="text-white text-sm mt-1">
            Podar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-red-400 p-4 rounded-2xl items-center" 
          style={{ width: '30%' }}
          onPress={handleDeletePlant}
        >
          <Feather name="trash-2" size={24} color="white" />
          <Text className="text-white text-sm mt-1">
            Eliminar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Descripción */}
      <View className="mb-6">
        <Text className="text-lg font-bold text-black mb-2">
          Descripción
        </Text>
        <Text className="text-sm text-gray-600 leading-5">
          {plantData.plantData?.descripcion && plantData.plantData.descripcion !== '' && plantData.plantData.descripcion !== null
           ? plantData.plantData.descripcion 
           : `${plantName} es una planta ${scientificName ? `(${scientificName}) ` : ''}que requiere cuidados específicos. Mantén un seguimiento regular de sus condiciones para asegurar un crecimiento saludable. Las recomendaciones específicas aparecerán cuando estén disponibles en la base de datos.`}
        </Text>
      </View>

      {/* Información adicional de la planta supervisada */}
      <View className="mb-8">
        <Text className="text-lg font-bold text-black mb-3">
          Información Personal
        </Text>
        <View className="bg-blue-50 rounded-lg p-4 space-y-3">
          {/* Fecha de inicio del seguimiento */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Feather name="calendar" size={16} color="#2563EB" />
              <Text className="text-sm text-blue-800 ml-2">Supervisada desde</Text>
            </View>
            <Text className="text-sm text-blue-700 font-medium">
              {new Date(plantData.fechaInicio).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })}
            </Text>
          </View>

          {plantData.ubicacion && (
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="location-outline" size={16} color="#2563EB" />
                <Text className="text-sm text-blue-800 ml-2">Ubicación</Text>
              </View>
              <Text className="text-sm text-blue-700 font-medium">{plantData.ubicacion}</Text>
            </View>
          )}

          {plantData.notas && (
            <View>
              <View className="flex-row items-center mb-2">
                <Feather name="file-text" size={16} color="#2563EB" />
                <Text className="text-sm text-blue-800 ml-2 font-medium">Notas</Text>
              </View>
              <Text className="text-sm text-blue-700 ml-6">{plantData.notas}</Text>
            </View>
          )}

          {/* Estado del seguimiento */}
          <View className="flex-row items-center justify-between pt-2 border-t border-blue-200">
            <View className="flex-row items-center">
              <Ionicons name={plantData.activa ? "checkmark-circle" : "pause-circle"} size={16} color={plantData.activa ? "#10B981" : "#F59E0B"} />
              <Text className="text-sm text-blue-800 ml-2">Estado del seguimiento</Text>
            </View>
            <Text className={`text-sm font-medium ${plantData.activa ? 'text-green-600' : 'text-yellow-600'}`}>
              {plantData.activa ? 'Activo' : 'Pausado'}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}