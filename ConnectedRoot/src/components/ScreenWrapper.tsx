// src/components/ScreenWrapper.tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

type ScreenWrapperProps = {
  title: string;
  children: React.ReactNode;
};

export default function ScreenWrapper({ title, children }: ScreenWrapperProps) {
  const navigation = useNavigation<DrawerNavigationProp<any>>();

  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F2] px-4 pt-6">
      <View className="flex-row items-center mb-6">
        <TouchableOpacity onPress={() => navigation.openDrawer()} className="mr-4">
          <Ionicons name="menu" size={28} color="#166534" />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-green-700">{title}</Text>
      </View>

      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
}
