// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  SignUp: undefined;
  Profile: undefined;
  // otras pantallas si hay
};

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onSubmit = () => {
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    // Aquí iría la lógica real de registro
    alert(`Usuario registrado:\n${name}\n${email}`);
    navigation.navigate('Profile');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
        <Text className="text-3xl font-bold mb-6 text-center">Crear Cuenta</Text>

        <Text className="text-gray-700 mb-1">Nombre Completo</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Tu nombre"
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        />

        <Text className="text-gray-700 mb-1">Correo Electrónico</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="ejemplo@mail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        />

        <Text className="text-gray-700 mb-1">Contraseña</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
        />

        <Text className="text-gray-700 mb-1">Confirmar Contraseña</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="••••••••"
          secureTextEntry
          className="border border-gray-300 rounded-lg px-4 py-6 mb-6"
        />

        <TouchableOpacity
          onPress={onSubmit}
          className="bg-blue-600 py-4 rounded-lg"
        >
          <Text className="text-white font-semibold text-center text-lg">Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-4"
        >
          <Text className="text-center text-blue-600 underline">Volver al inicio de sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
