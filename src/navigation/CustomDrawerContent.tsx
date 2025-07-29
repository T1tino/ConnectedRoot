// src/navigation/CustomDrawerContent.tsx
import React from 'react';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { View, Text, Image } from 'react-native';

export default function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ alignItems: 'center', marginVertical: 20 }}>
        <Image
          source={require('../assets/avatar.png')}
          style={{ width: 80, height: 80, borderRadius: 40 }}
        />
        <Text style={{ marginTop: 10, fontWeight: 'bold' }}>Nombre del Usuario</Text>
        <Text style={{ color: 'gray' }}>correo@ejemplo.com</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
