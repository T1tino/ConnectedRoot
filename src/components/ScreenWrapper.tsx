// src/components/ScreenWrapper.tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';

type ScreenWrapperProps = {
  title: string;
  children: React.ReactNode;
};

export default function ScreenWrapper({ title, children }: ScreenWrapperProps) {
  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F2] px-4 pt-6">
      <Text className="text-3xl font-bold text-green-700 mb-6">{title}</Text>
      <View className="flex-1">{children}</View>
    </SafeAreaView>
  );
}
