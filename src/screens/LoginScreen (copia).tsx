// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white px-6 justify-center"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Título */}
      <View className="mb-6">
        <Text className="text-3xl font-bold text-green-600 text-center">
          Welcome back!
        </Text>
        <Text className="text-center text-gray-500 mt-2">
          Login to continue
        </Text>
      </View>

      {/* Email */}
      <View className="mb-4">
        <Text className="text-base text-gray-700 mb-1">Email</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-2"
          placeholder="you@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Password */}
      <View className="mb-2">
        <Text className="text-base text-gray-700 mb-1">Password</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-2"
          placeholder="••••••••"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Forgot password */}
      <TouchableOpacity
        className="mb-4"
        onPress={() => navigation.navigate('ForgotPassword' as never)}
      >
        <Text className="text-right text-sm text-green-600 underline">
          Forgot your password?
        </Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        className="rounded-xl overflow-hidden"
        onPress={() => navigation.navigate('Home' as never)}
      >
        <LinearGradient
          colors={['#0AC4BA', '#2BDA8E', '#FFE358']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          className="py-3 px-8 items-center"
        >
          <Text className="text-white text-base font-semibold">Login</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Register link */}
      <TouchableOpacity
        className="mt-6"
        onPress={() => navigation.navigate('Register' as never)}
      >
        <Text className="text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <Text className="text-green-600 underline">Sign up</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
