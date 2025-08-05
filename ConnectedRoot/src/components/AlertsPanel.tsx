// components/AlertsPanel.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { notificationService } from '../services/notificationService';
import { formatRelativeTime } from '../utils/dateUtils';

export const AlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadAlerts = async () => {
    const alertsList = await notificationService.getAlerts();
    setAlerts(alertsList);
  };

  const handleAcknowledge = async (alertId: string) => {
    await notificationService.acknowledgeAlert(alertId);
    loadAlerts();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAlerts();
    setRefreshing(false);
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'humidity_low': return 'border-red-500 bg-red-50';
      case 'humidity_high': return 'border-blue-500 bg-blue-50';
      case 'temperature_high': return 'border-orange-500 bg-orange-50';
      case 'temperature_low': return 'border-purple-500 bg-purple-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'humidity_low': return '💧';
      case 'humidity_high': return '🌊';
      case 'temperature_high': return '🔥';
      case 'temperature_low': return '❄️';
      default: return '⚠️';
    }
  };

  const renderAlert = ({ item }: { item: any }) => (
    <View className={`border-l-4 p-4 mb-3 rounded-r-lg ${getAlertColor(item.type)} ${item.acknowledged ? 'opacity-50' : ''}`}>
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="font-semibold text-gray-800">
            {getAlertIcon(item.type)} {item.message}
          </Text>
          <Text className="text-xs text-gray-600 mt-1">
            {formatRelativeTime(item.timestamp)}
          </Text>
        </View>
        {!item.acknowledged && (
          <TouchableOpacity
            onPress={() => handleAcknowledge(item.id)}
            className="bg-green-500 px-3 py-1 rounded"
          >
            <Text className="text-white text-xs">Visto</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged).length;

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-xl font-bold text-gray-800">
          🚨 Alertas {unacknowledgedCount > 0 && `(${unacknowledgedCount})`}
        </Text>
      </View>
      
      <FlatList
        data={alerts}
        renderItem={renderAlert}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-12">
            <Text className="text-6xl mb-4">🌱</Text>
            <Text className="text-lg text-gray-600">¡Todo en orden!</Text>
            <Text className="text-sm text-gray-500">No hay alertas pendientes</Text>
          </View>
        }
      />
    </View>
  );
};
