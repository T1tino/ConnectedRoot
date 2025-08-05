// src/types/navigation.ts
import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Tipos para el Stack Principal (AppNavigator)
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  BottomTabs: NavigatorScreenParams<BottomTabParamList>;
};

// Tipos para Bottom Tab Navigator (necesitarás completar esto según tus tabs)
export type BottomTabParamList = {
  Home: undefined;
  PlantCatalog: undefined;
  PlantInfoScreen: { id: string };
  // Agrega aquí tus otros tabs
  Profile?: undefined;
  Settings?: undefined;
};

// Tipos de navegación para HomeScreen
// Como HomeScreen probablemente está dentro del BottomTabNavigator
export type HomeScreenNavigationProp = BottomTabNavigationProp<
  BottomTabParamList,
  'Home'
>;

// Tipos para otras pantallas que puedas necesitar
export type PlantCatalogNavigationProp = BottomTabNavigationProp<
  BottomTabParamList,
  'PlantCatalog'
>;

export type PlantInfoScreenNavigationProp = BottomTabNavigationProp<
  BottomTabParamList,
  'PlantInfoScreen'
>;

// Declaración global para React Navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends BottomTabParamList {}
  }
}