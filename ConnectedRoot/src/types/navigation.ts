// src/types/navigation.ts
import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DrawerNavigationProp } from '@react-navigation/drawer';

// =======================================
// STACK PRINCIPAL (App Level)
// =======================================
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  Home: NavigatorScreenParams<DrawerParamList>;
  BottomTabs: NavigatorScreenParams<BottomTabParamList>;
};

// =======================================
// DRAWER NAVIGATOR
// =======================================
export type DrawerParamList = {
  Inicio: NavigatorScreenParams<BottomTabParamList>;
  Configuración: undefined;
  Notificaciones: undefined;
};

// =======================================
// BOTTOM TAB NAVIGATOR
// =======================================
export type BottomTabParamList = {
  Home: undefined;
  Explore: undefined;
  Favorites: undefined;
  Profile: undefined;
  PlantInfo: { id?: string };
  PlantInfoScreen: { id?: string };
};

// =======================================
// NAVIGATION PROP TYPES
// =======================================

// Root Stack Navigation
export type RootStackNavigationProp<T extends keyof RootStackParamList> = 
  NativeStackNavigationProp<RootStackParamList, T>;

// Drawer Navigation
export type DrawerNavigationProps<T extends keyof DrawerParamList> = 
  DrawerNavigationProp<DrawerParamList, T>;

// Bottom Tab Navigation
export type BottomTabNavigationProps<T extends keyof BottomTabParamList> = 
  BottomTabNavigationProp<BottomTabParamList, T>;

// =======================================
// SPECIFIC SCREEN NAVIGATION TYPES
// =======================================

// HomeScreen Navigation
export type HomeScreenNavigationProp = BottomTabNavigationProp<
  BottomTabParamList,
  'Home'
>;

// ExploreScreen Navigation
export type ExploreScreenNavigationProp = BottomTabNavigationProp<
  BottomTabParamList,
  'Explore'
>;

// PlantInfoScreen Navigation
export type PlantInfoScreenNavigationProp = BottomTabNavigationProp<
  BottomTabParamList,
  'PlantInfo'
>;

// ProfileScreen Navigation
export type ProfileScreenNavigationProp = BottomTabNavigationProp<
  BottomTabParamList,
  'Profile'
>;

// FavoritesScreen Navigation
export type FavoritesScreenNavigationProp = BottomTabNavigationProp<
  BottomTabParamList,
  'Favorites'
>;

// =======================================
// ROUTE PROP TYPES
// =======================================
import { RouteProp } from '@react-navigation/native';

export type PlantInfoScreenRouteProp = RouteProp<
  BottomTabParamList,
  'PlantInfo'
>;

// =======================================
// COMBINED TYPES FOR SCREENS
// =======================================
export type HomeScreenProps = {
  navigation: HomeScreenNavigationProp;
};

export type ExploreScreenProps = {
  navigation: ExploreScreenNavigationProp;
};

export type PlantInfoScreenProps = {
  navigation: PlantInfoScreenNavigationProp;
  route: PlantInfoScreenRouteProp;
};

export type ProfileScreenProps = {
  navigation: ProfileScreenNavigationProp;
};

// =======================================
// DECLARACIÓN GLOBAL PARA REACT NAVIGATION
// =======================================
declare global {
  namespace ReactNavigation {
    interface RootParamList extends BottomTabParamList {}
  }
}

// =======================================
// UTILITY TYPES
// =======================================

// Para extraer parámetros de una pantalla específica
export type ScreenParams<T extends keyof BottomTabParamList> = BottomTabParamList[T];

// Para verificar si una pantalla requiere parámetros
export type RequiredParams<T extends keyof BottomTabParamList> = 
  BottomTabParamList[T] extends undefined ? false : true;

// =======================================
// NAVIGATION HELPERS
// =======================================

// Helper type para navigation.navigate calls
export type NavigateFunction = <T extends keyof BottomTabParamList>(
  screen: T,
  params?: BottomTabParamList[T]
) => void;

// Helper para type-safe navigation
export const createTypedNavigation = <T extends keyof BottomTabParamList>(
  navigation: BottomTabNavigationProp<BottomTabParamList>
) => ({
  navigate: <K extends keyof BottomTabParamList>(
    screen: K,
    params?: BottomTabParamList[K]
  ) => navigation.navigate(screen as any, params as any),
  goBack: () => navigation.goBack(),
  canGoBack: () => navigation.canGoBack(),
});

// =======================================
// EXPORT UTILITY FUNCTIONS
// =======================================

// Función para validar parámetros de navegación
export const validateNavigationParams = <T extends keyof BottomTabParamList>(
  screen: T,
  params: BottomTabParamList[T]
): boolean => {
  // Aquí puedes agregar validaciones específicas
  switch (screen) {
    case 'PlantInfoScreen':
      return params && typeof (params as any).id === 'string';
    default:
      return true;
  }
};