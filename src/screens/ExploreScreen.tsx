// src/screens/ExploreScreen.tsx
import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';

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
];

export default function ExploreScreen() {
  const navigation = useNavigation();

  return (
    <ScreenWrapper title="Explore">
      <View className="flex-1 bg-white rounded-lg p-6">
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
                  <Text className="text-lg font-semibold text-gray-800">
                    {item.title}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {item.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </ScreenWrapper>
  );
}
