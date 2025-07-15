
import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SearchBar = () => {
  return (
    <View className="w-full flex-row items-center justify-between">
      <View className="flex-row items-center flex-1 bg-white rounded-xl px-4 py-2 shadow-sm">
        <Ionicons name="search" size={20} color="#C5CCD6" className="mr-2" />
        <TextInput
          placeholder="Search"
          placeholderTextColor="#C5CCD6"
          className="flex-1 text-sm text-black"
        />
      </View>
      <TouchableOpacity className="ml-4">
        <Ionicons name="notifications-outline" size={24} color="#5A5A5A" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;
