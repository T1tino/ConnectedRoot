import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';

const products = [
  {
    id: '1',
    title: 'Money Tree Plant',
    label: 'Best Seller',
    price: '$64 - 66',
    image: require('../../assets/images/categoriesPlants/BestForBeginners/MoneyTreePlant/money-tree_small_bryant-cream.webp'),
  },
  {
    id: '2',
    title: 'Rhipsalis',
    label: 'New Arrival',
    price: '$52',
    image: require('../../assets/images/categoriesPlants/BestForBeginners/Rhipsalis/rhipsalis_small_upcycled_cream.webp'),
  },
];

const ProductCard = ({ title, label, price, image }) => (
  <TouchableOpacity className="mr-4 w-36 bg-white rounded-xl overflow-hidden shadow">
    <Image source={image} className="w-full h-32" resizeMode="cover" />
    <View className="px-2 py-2">
      <Text className="text-xs text-gray-500 mb-1">{label}</Text>
      <Text className="text-sm font-medium text-gray-800" numberOfLines={1}>{title}</Text>
      <View className="flex-row justify-between items-center mt-1">
        <Text className="text-xs text-gray-700">{price}</Text>
        <Text className="text-xs underline text-gray-600">Show More</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const ProductList = () => {
  return (
    <View className="mt-6 mb-10">
      <Text className="text-xl font-semibold text-gray-800 mb-3">Best Plants</Text>
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard {...item} />}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      />
    </View>
  );
};

export default ProductList;
