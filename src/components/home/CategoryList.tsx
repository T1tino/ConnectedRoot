import React from 'react';
import { View, Text, FlatList, Image } from 'react-native';

const categories = [
  { id: '1', name: 'Plants', icon: require('../../assets/icons/plants.png') },
  { id: '2', name: 'Planters', icon: require('../../assets/icons/pots.png') },
  { id: '3', name: 'Plant Care', icon: require('../../assets/icons/fertilizers.png') },
  { id: '4', name: 'Decor', icon: require('../../assets/icons/flowers.png') },
];

const CategoryCard = ({ name, icon }) => (
  <View className="items-center mr-4 w-20">
    <View className="bg-green-100 rounded-xl w-16 h-16 justify-center items-center mb-1">
      <Image source={icon} className="w-8 h-8" resizeMode="contain" />
    </View>
    <Text className="text-xs font-medium text-gray-800 text-center">{name}</Text>
  </View>
);

const CategoryList = () => {
  return (
    <View className="mt-6">
      <Text className="text-xl font-semibold text-gray-800 mb-3">Categories</Text>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CategoryCard {...item} />}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
};

export default CategoryList;
