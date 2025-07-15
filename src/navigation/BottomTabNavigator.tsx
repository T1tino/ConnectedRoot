import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import { Ionicons } from '@expo/vector-icons';

type BottomTabParamList = {
  Home: undefined;
  Devices: undefined;
  Logs: undefined;
  Settings: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const DummyScreen = () => null;

const BottomTabNavigator = () => (
  <Tab.Navigator
    id={undefined}
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#60BF96',
      tabBarInactiveTintColor: '#999',
      tabBarStyle: {
        backgroundColor: '#fff',
        borderTopWidth: 0,
        elevation: 5,
        height: 65,
        paddingBottom: 12,
        paddingTop: 8,
      },
      tabBarIcon: ({ color, size }) => {
        const icons = {
          Home: 'home-outline',
          Devices: 'wifi-outline',
          Logs: 'stats-chart-outline',
          Settings: 'settings-outline',
          Profile: 'person-outline',
        } as const;

        return (
          <Ionicons
            name={icons[route.name] as typeof icons[keyof typeof icons]}
            size={size}
            color={color}
          />
        );
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Devices" component={DummyScreen} />
    <Tab.Screen name="Logs" component={DummyScreen} />
    <Tab.Screen name="Settings" component={DummyScreen} />
    <Tab.Screen name="Profile" component={DummyScreen} />
  </Tab.Navigator>
);

export default BottomTabNavigator;