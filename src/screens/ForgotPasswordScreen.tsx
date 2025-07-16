// ConnectedRoot/src/screens/ForgotPasswordScreen.tsx

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-[#F2F2F2] px-6 pt-10">
      <Text className="text-3xl font-bold text-green-700 mb-6">Forgot Password</Text>

      <Text className="text-base text-gray-700 mb-2">Enter your email to reset your password:</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        className="bg-white border border-gray-300 rounded-lg px-4 py-3 mb-6 text-base"
      />

      <TouchableOpacity
        className="bg-green-600 rounded-lg py-3 items-center"
        onPress={() => navigation.goBack()}
      >
        <Text className="text-white text-base font-medium">Send Reset Link</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()} className="mt-6 items-center">
        <Text className="text-green-700 font-medium">Back to Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
