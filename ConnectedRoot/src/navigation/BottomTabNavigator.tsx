// src/navigation/BottomTabNavigator.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Pressable } from 'react-native';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  RectangleGroupIcon,
  UserCircleIcon
} from 'react-native-heroicons/outline';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import ExploreScreen from '../screens/ExploreScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import PlantInfoScreen from '../screens/PlantInfoScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-row justify-around bg-white border-t border-gray-200"
      style={{ paddingBottom: insets.bottom, paddingTop: 10 }}
    >
      {state.routes.map((route, index) => {
        // Excluir tab visible de PlantInfo
        if (route.name === 'PlantInfo') return null;

        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const icons = {
          Home: <HomeIcon size={24} color={isFocused ? '#22c55e' : '#64748b'} />,
          Explore: <MagnifyingGlassIcon size={24} color={isFocused ? '#22c55e' : '#64748b'} />,
          Favorites: <HeartIcon size={24} color={isFocused ? '#22c55e' : '#64748b'} />,
          Plants: <RectangleGroupIcon size={24} color={isFocused ? '#22c55e' : '#64748b'} />,
          Profile: <UserCircleIcon size={24} color={isFocused ? '#22c55e' : '#64748b'} />,
        };

        return (
          <Pressable key={route.key} onPress={onPress} className="items-center flex-1">
            {icons[route.name]}
            <Text className={`text-xs ${isFocused ? 'text-green-500' : 'text-slate-500'}`}>
              {route.name}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      
      <Tab.Screen name="Profile" component={ProfileScreen} />

      {/* PlantInfo: disponible pero no visible en los tabs */}
      <Tab.Screen
        name="PlantInfo"
        component={PlantInfoScreen}
        options={{
          tabBarButton: () => null, // oculta el botón del tab
          tabBarStyle: { display: 'none' }, // oculta la barra si estás dentro
        }}
      />
    </Tab.Navigator>
  );
}
