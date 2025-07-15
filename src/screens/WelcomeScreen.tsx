import React from 'react';
import { View, Text, Image, TouchableOpacity, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const slides = [
  { id: '1', image: require('../assets/images/Plant.png') },
  { id: '2', image: require('../assets/images/Plant2.png') },
  { id: '3', image: require('../assets/images/Plant3.png') },
];

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-white pt-20">
      {/* Header con título */}
      <View className="flex-row justify-center items-center mb-2">
        <Text className="text-3xl font-bold text-green-600">
          ConnectedRoot.
        </Text>
      </View>

      <Text className="text-gray-400 text-lg text-center mb-4">Enjoy the experience</Text>

      {/* Carrusel de imágenes */}
      <FlatList
        data={slides}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Image source={item.image} className="w-screen h-[400px] resize-contain" />
        )}
      />

      {/* Botón Login */}
      <TouchableOpacity
        className="mx-12 mt-6"
        onPress={() => navigation.navigate('Login' as never)}
      >
        <LinearGradient
          colors={['#0AC4BA', '#2BDA8E', '#FFE358']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          className="rounded-xl py-3 px-8 items-center"
        >
          <Text className="text-white text-base font-medium">Login</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Botón Sign up */}
      <TouchableOpacity
        className="mx-12 mt-4 bg-white rounded-xl py-3 px-8 items-center shadow"
        onPress={() => navigation.navigate('SignUp' as never)}
      >
        <Text className="text-base text-gray-800 font-medium">Sign up</Text>
      </TouchableOpacity>

      {/* Link a términos */}
      <TouchableOpacity className="mt-4 items-center">
        <Text className="text-xs text-gray-400 underline">Terms of service</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;
