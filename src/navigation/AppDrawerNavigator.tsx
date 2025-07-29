// src/navigation/AppDrawerNavigator.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();

const AppDrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="MainTabs">
      <Drawer.Screen name="MainTabs" component={BottomTabNavigator} options={{ title: 'Inicio' }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configuración' }} />
    </Drawer.Navigator>
  );
};

export default AppDrawerNavigator;
