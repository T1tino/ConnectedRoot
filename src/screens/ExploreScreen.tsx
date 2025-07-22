// ConnectedRoot/src/screens/ExploreScreen.tsx

import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PLANTS = [
  {
    id: '1',
    title: 'Cactus Garden',
    description: 'Low maintenance & perfect for beginners',
    image: require('../assets/cactus.png'),
  },
  {
    id: '2',
    title: 'Fiddle Leaf',
    description: 'Lush and leafy centerpiece plant',
    image: require('../assets/images/categoriesPlants/largePlants/LargeFiddleLeafFigBush/fiddle-leaf-fig-bush_large_burbank_white.webp'),
  },
  // Agrega más elementos simulados para el prototipo
];

export default function ExploreScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F2] px-4 pt-6">
      <Text className="text-3xl font-bold text-green-700 mb-6">Explore</Text>
      <FlatList
        data={PLANTS}
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
                  {item.title}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-300">
                  {item.description}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
