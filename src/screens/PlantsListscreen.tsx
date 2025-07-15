import React from 'react';
import { View, Text, FlatList, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const plantsData = [
  {
    id: '1',
    name: 'Ficus Audrey',
    species: 'Ficus benghalensis',
    image: require('../assets/icons/ficus-audrey-burbank-almond_arrowhead-white-butterfly-hyde-stone_gallery_all_all_01.webp'),
    temp: '18-25°C',
    humidity: '60%',
    moisture: 'Medium',
  },
  {
    id: '2',
    name: 'Snake Plant',
    species: 'Sansevieria trifasciata',
    image: require('../assets/icons/snake-plant-laurentii-tree_gallery_small_all_all_01.webp'),
    temp: '15-27°C',
    humidity: 'Low',
    moisture: 'Low',
  },
  // Más plantas aquí
];

const StatItem = ({ iconName, label }: { iconName: string; label: string }) => (
  <View className="flex-row items-center mr-4">
    <Ionicons name={iconName} size={16} color="#60BF96" />
    <Text className="text-xs text-gray-600 ml-1">{label}</Text>
  </View>
);

const PlantsListScreen = () => {
  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Text className="text-2xl font-extrabold text-green-700 mb-6 text-center">
        Plantas Supervisadas
      </Text>

      <FlatList
        data={plantsData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View className="flex-row bg-white rounded-xl p-4 mb-5 shadow-md">
            <Image
              source={item.image}
              style={{ width: 70, height: 70, borderRadius: 35 }}
              resizeMode="cover"
            />
            <View className="flex-1 ml-4 justify-center">
              <Text className="text-lg font-semibold text-green-800">{item.name}</Text>
              <Text className="text-sm text-gray-600 mb-2 italic">{item.species}</Text>
              <View className="flex-row">
                <StatItem iconName="thermometer-outline" label={item.temp} />
                <StatItem iconName="water-outline" label={`${item.humidity} Humedad`} />
                <StatItem iconName="leaf-outline" label={`Suelo: ${item.moisture}`} />
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default PlantsListScreen;
