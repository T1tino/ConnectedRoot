// src/screens/ExploreScreen.tsx
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import { useTrefleSearch } from '../hooks/useTrefleSearch';

export default function ExploreScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const { plants, loading } = useTrefleSearch(search);

  return (
    <ScreenWrapper title="Explore">
      <View className="flex-1 bg-white rounded-lg p-6">
        {/* 🔍 Input de búsqueda */}
        <TextInput
          placeholder="Buscar plantas..."
          value={search}
          onChangeText={setSearch}
          className="border border-gray-300 rounded-lg px-4 py-2 mb-4"
        />

        {/* 🔄 Indicador de carga */}
        {loading && <ActivityIndicator size="large" color="#00aa00" />}

        {/* 📄 Lista de resultados */}
        <FlatList
          data={plants}
          keyExtractor={(item) => item.id?.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mb-4"
              onPress={() => navigation.navigate('PlantsCategoryItem', { item })}
            >
              <View className="flex-row items-center bg-white rounded-xl shadow-md p-4">
                <Image
                  source={{
                    uri: item.image_url || 'https://via.placeholder.com/100x100?text=No+Image',
                  }}
                  className="w-20 h-20 rounded-lg mr-4"
                />
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800">
                    {item.common_name || item.scientific_name}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {item.family_common_name || 'No description'}
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
