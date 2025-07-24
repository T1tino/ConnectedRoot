// src/screens/FavoritesScreen.tsx
import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';

const FAVORITES = [
  {
    id: '1',
    name: 'Snake Plant',
    category: 'Air Purifier',
    image: require('../assets/images/categoriesPlants/lowLightTolerant/LargeSnakeLaurentii/snake-plant-laurentii_large_burbank_white.webp'),
  },
  {
    id: '2',
    name: 'Peace Lily',
    category: 'Flowering Plant',
    image: require('../assets/images/Plant.png'),
  },
];

export default function FavoritesScreen() {
  const navigation = useNavigation();

  return (
    <ScreenWrapper title="Favorites">
      {/* Contenedor blanco con padding y bordes redondeados */}
      <View className="flex-1 bg-white rounded-lg p-6">
        <FlatList
          data={FAVORITES}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mb-4"
              onPress={() => navigation.navigate('PlantsCategoryItem', { item })}
            >
              <View className="flex-row items-center bg-white rounded-xl shadow-md p-4">
                <Image
                  source={item.image}
                  className="w-20 h-20 rounded-lg mr-4"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </Text>
                  <Text className="text-sm text-gray-500">{item.category}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScreenWrapper>
  );
}
