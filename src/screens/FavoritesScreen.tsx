// ConnectedRoot/src/screens/FavoritesScreen.tsx

import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

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
    // image: require('../assets/images/plants/peace-lily.png'),
    image: require('../assets/images/Plant.png'),

  },
];

export default function FavoritesScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F2] px-4 pt-6">
      <Text className="text-3xl font-bold text-green-700 mb-6">Favorites</Text>
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
              <Image source={item.image} className="w-20 h-20 rounded-lg mr-4" />
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800 dark:text-white">
                  {item.name}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-300">
                  {item.category}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
