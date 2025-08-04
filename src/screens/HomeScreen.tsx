// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity, View, Text, FlatList, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import axios from 'axios';

interface Plant {
  _id: string;
  nombreComun: string;
  nombreCientifico?: string;
  temperatura?: { min: number; max: number };
  humedad?: string;
  iluminacion?: string;
  cuidadosExtra?: string;
  image?: string; // URL
}

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

  const [plantsData, setPlantsData] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://localhost:4000/api/plants')
      .then(res => {
        setPlantsData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Error al cargar plantas');
        setLoading(false);
      });
  }, []);

  const handlePlantPress = (plantId: string) => {
    navigation.navigate('PlantInfo' as never, { id: plantId } as never);
  };

  const renderPlantItem = ({ item }: { item: Plant }) => (
    <TouchableOpacity
      onPress={() => handlePlantPress(item._id)}
      className="flex-row bg-white rounded-xl p-4 mb-5 shadow-md"
    >
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={{ width: 70, height: 70, borderRadius: 35 }}
          resizeMode="cover"
        />
      ) : (
        <View style={{ width: 70, height: 70, borderRadius: 35, backgroundColor: '#ddd' }} />
      )}

      <View className="flex-1 ml-4 justify-center">
        <Text className="text-lg font-semibold text-green-800">{item.nombreComun}</Text>
        <Text className="text-sm text-gray-600 mb-2 italic">{item.nombreCientifico}</Text>
        <View className="flex-row flex-wrap">
          {item.temperatura && (
            <StatItem
              iconName="thermometer-outline"
              label={`${item.temperatura.min}°C - ${item.temperatura.max}°C`}
            />
          )}
          {item.humedad && <StatItem iconName="water-outline" label={`${item.humedad} Humedad`} />}
          {item.cuidadosExtra && <StatItem iconName="leaf-outline" label={`Cuidados: ${item.cuidadosExtra}`} />}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center' }} />;
  if (error) return <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>;

  return (
    <ScreenWrapper title="Plantas Supervisadas">
      <FlatList
        data={plantsData}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={renderPlantItem}
      />
    </ScreenWrapper>
  );
};

export default HomeScreen;
