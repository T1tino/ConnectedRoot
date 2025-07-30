// src/screens/HomeScreen.tsx
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';

const plantsData = [
  {
    id: '1',
    name: 'Ficus Audrey',
    species: 'Ficus benghalensis',
    image: require('../assets/images/categoriesPlants/largePlants/LargeFicusAudrey/ficus-audrey_burbank-white_gallery_all_all_01.webp'),
    temp: '18-25°C',
    humidity: '60%',
    moisture: 'Medium',
  },
  {
    id: '2',
    name: 'Snake Plant',
    species: 'Sansevieria trifasciata',
    image: require('../assets/images/categoriesPlants/largePlants/LargeFicusAudrey/ficus-audrey-burbank-almond_arrowhead-dracaena-marginata-pentagonal-planter_gallery_all_all_01.webp'),
    temp: '15-27°C',
    humidity: 'Low',
    moisture: 'Low',
  },
  // Puedes agregar más plantas aquí...
];

interface StatItemProps {
  iconName: string;
  label: string;
}

const StatItem: React.FC<StatItemProps> = ({ iconName, label }) => (
  <View className="flex-row items-center mr-4">
    <Ionicons name={iconName as any} size={20} color="green" />
    <Text className="text-xs text-gray-600 ml-1">{label}</Text>
  </View>
);

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const handlePlantPress = () => {
    navigation.navigate('PlantInfo' as never);
  };

  const renderPlantItem = ({ item }: { item: typeof plantsData[0] }) => (
    <TouchableOpacity
      onPress={handlePlantPress}
      className="flex-row bg-white rounded-xl p-4 mb-5 shadow-md"
    >
      <Image
        source={item.image}
        style={{ width: 70, height: 70, borderRadius: 35 }}
        resizeMode="cover"
      />
      <View className="flex-1 ml-4 justify-center">
        <Text className="text-lg font-semibold text-green-800">{item.name}</Text>
        <Text className="text-sm text-gray-600 mb-2 italic">{item.species}</Text>
        <View className="flex-row">
          <StatItem iconName="thermometer-outline" label={item.temp} />
          <StatItem iconName="water-outline" label={`${item.humidity} Humedad`} />
          <StatItem iconName="leaf-outline" label={`Suelo: ${item.moisture}`} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper title="Plantas Supervisadas">
      <FlatList
        data={plantsData}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={renderPlantItem}
      />
    </ScreenWrapper>
  );
};

export default HomeScreen;
