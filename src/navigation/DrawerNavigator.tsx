// src/navigation/DrawerNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabsNavigator from './BottomTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Inicio" component={BottomTabsNavigator} />
      <Drawer.Screen name="Configuración" component={SettingsScreen} />
      <Drawer.Screen name="Notificaciones" component={NotificationsScreen} />
    </Drawer.Navigator>
  );
}
