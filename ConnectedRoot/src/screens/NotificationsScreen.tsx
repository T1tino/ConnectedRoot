import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Bell } from 'lucide-react-native';

const notifications = [
  { id: 1, title: 'Sensor A', message: 'Humedad baja detectada.', time: 'Hace 2 horas' },
  { id: 2, title: 'Sistema', message: 'Actualización completada.', time: 'Ayer' },
  { id: 3, title: 'Sensor B', message: 'Temperatura fuera de rango.', time: 'Hace 3 días' },
];

export default function NotificationsScreen() {
  return (
    <ScrollView className="flex-1 bg-white px-4 pt-6">
      <Text className="text-xl font-bold mb-4">Notificaciones</Text>

      {notifications.map(notif => (
        <View key={notif.id} className="flex-row items-start mb-4 bg-gray-100 rounded-xl p-3">
          <Bell size={24} className="mr-3 mt-1 text-green-600" />
          <View className="flex-1">
            <Text className="font-semibold">{notif.title}</Text>
            <Text className="text-gray-700">{notif.message}</Text>
            <Text className="text-xs text-gray-400 mt-1">{notif.time}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
