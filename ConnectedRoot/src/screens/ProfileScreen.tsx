// src/screens/ProfileScreen.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ScreenWrapper from '../components/ScreenWrapper';

type RootStackParamList = {
  Profile: undefined;
  SignUp: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  return (
    <ScreenWrapper title="Perfil">
      {/* Contenedor blanco con padding para imitar estilo previo */}
      <View className="flex-1 bg-white p-6 rounded-lg">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <Text className="text-2xl font-bold">Perfil</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text className="text-blue-600 font-semibold">Editar</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View className="items-center mb-6">
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
            className="w-32 h-32 rounded-full"
          />
        </View>

        {/* Info */}
        <View className="space-y-4">
          <View>
            <Text className="text-gray-600 font-semibold">Nombre</Text>
            <Text className="text-lg">Juan Pérez</Text>
          </View>
          <View>
            <Text className="text-gray-600 font-semibold">Email</Text>
            <Text className="text-lg">juan.perez@example.com</Text>
          </View>
          <View>
            <Text className="text-gray-600 font-semibold">Teléfono</Text>
            <Text className="text-lg">+52 123 456 7890</Text>
          </View>
        </View>

        {/* Botón para cerrar sesión */}
        <View className="mt-auto">
          <TouchableOpacity
            onPress={() => alert('Cerrar sesión')}
            className="bg-red-600 py-3 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
}
