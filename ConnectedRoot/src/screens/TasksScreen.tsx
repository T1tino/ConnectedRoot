// src/screens/TasksScreen.tsx
import React from 'react'
import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const tasks = [
  { id: 1, title: 'Regar planta', time: 'Hoy, 8:00 AM', icon: 'water-outline' },
  { id: 2, title: 'Revisar tierra', time: 'Hoy, 6:00 PM', icon: 'leaf-outline' },
  { id: 3, title: 'Cambiar maceta', time: 'Mañana, 10:00 AM', icon: 'flower-outline' },
]

export default function TasksScreen() {
  return (
    <View className="flex-1 bg-white px-4 pt-6">
      <Text className="text-2xl font-bold mb-4 text-green-900">Tareas programadas</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {tasks.map((task) => (
          <View
            key={task.id}
            className="flex-row items-center bg-green-100 rounded-2xl p-4 mb-3 shadow-sm"
          >
            <View className="bg-green-300 p-3 rounded-xl mr-4">
              <Ionicons name={task.icon as any} size={24} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-green-800">{task.title}</Text>
              <Text className="text-sm text-green-600">{task.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity className="bg-green-700 p-4 rounded-full absolute bottom-6 right-6 shadow-lg">
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}
