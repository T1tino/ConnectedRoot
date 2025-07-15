
import React from 'react';
import { ScrollView, View } from 'react-native';
import SearchBar from '../components/home/SearchBar';
import Slider from '../components/home/Slider';
import CategoryList from '../components/home/CategoryList';
import ProductList from '../components/home/ProductList';

const HomeScreen = () => {
  return (
    <ScrollView className="flex-1 bg-gray-100 px-4 pt-4">
      <View className="flex-row justify-between items-center mb-4">
        <SearchBar />
      </View>
      <Slider />
      {/* <View className="bg-red-500 w-20 h-20" /> */}
      <CategoryList />
      <ProductList />
    </ScrollView>
  );
};

export default HomeScreen;
