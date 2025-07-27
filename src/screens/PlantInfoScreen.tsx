// src/screens/PlantInfoScreen.tsx
import React from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

export default function PlantInfoScreen() {
  const navigation = useNavigation()

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black px-6 pt-10">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black dark:text-white">
          Planta
        </Text>
        <View className="w-6" /> {/* Espacio para centrar el título */}
      </View>

      {/* Imagen */}
      <View className="items-center mt-2 mb-6">
        <Image
          source={require('../assets/photoPlant.png')} // Puedes cambiar por tu imagen
          className="w-40 h-40 rounded-2xl"
          resizeMode="cover"
        />
        <Text className="text-2xl font-semibold text-center mt-4 text-black dark:text-white">
          Monstera Deliciosa
        </Text>
      </View>

      {/* Información ambiental */}
      <View className="flex-row justify-between px-4 mb-8">
        <View className="items-center">
          <Feather name="droplet" size={24} color="#34d399" />
          <Text className="text-lg font-semibold text-black dark:text-white mt-1">54%</Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">Humedad</Text>
        </View>
        <View className="items-center">
          <Feather name="sun" size={24} color="#facc15" />
          <Text className="text-lg font-semibold text-black dark:text-white mt-1">22°C</Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">Temperatura</Text>
        </View>
        <View className="items-center">
          <Feather name="clock" size={24} color="#60a5fa" />
          <Text className="text-lg font-semibold text-black dark:text-white mt-1">10:30</Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400">Último riego</Text>
        </View>
      </View>

      {/* Botones de acción */}
      <View className="flex-row justify-around mb-6">
        <TouchableOpacity className="bg-green-500 p-4 rounded-2xl items-center w-[30%]">
          <MaterialCommunityIcons name="watering-can" size={24} color="white" />
          <Text className="text-white text-sm mt-1">Regar</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-yellow-400 p-4 rounded-2xl items-center w-[30%]">
          <Feather name="scissors" size={24} color="white" />
          <Text className="text-white text-sm mt-1">Podar</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-red-400 p-4 rounded-2xl items-center w-[30%]">
          <Feather name="trash-2" size={24} color="white" />
          <Text className="text-white text-sm mt-1">Eliminar</Text>
        </TouchableOpacity>
      </View>

      {/* Descripción */}
      <View>
        <Text className="text-lg font-bold text-black dark:text-white mb-2">
          Descripción
        </Text>
        <Text className="text-sm text-gray-600 dark:text-gray-300 leading-5">
          La Monstera Deliciosa es una planta tropical conocida por sus grandes hojas perforadas. Requiere luz indirecta, humedad moderada y un riego adecuado.
        </Text>
      </View>
    </ScrollView>
  )
}
