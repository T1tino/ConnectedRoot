import { View, Text, Switch, ScrollView } from 'react-native'
import { useState } from 'react'
import { useColorScheme } from 'nativewind'
import { Ionicons } from '@expo/vector-icons'

export default function SettingsScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme()
  const [notifications, setNotifications] = useState(true)
  const [autoUpdate, setAutoUpdate] = useState(false)

  return (
    <ScrollView className="flex-1 bg-white dark:bg-black px-6 pt-10">
      <Text className="text-2xl font-bold text-black dark:text-white mb-6">Settings</Text>

      {/* General Section */}
      <Text className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">General</Text>
      <View className="flex-row items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-4">
        <View className="flex-row items-center space-x-3">
          <Ionicons name="moon" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className="text-base text-black dark:text-white">Dark Mode</Text>
        </View>
        <Switch value={colorScheme === 'dark'} onValueChange={toggleColorScheme} />
      </View>

      <View className="flex-row items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-xl mb-4">
        <View className="flex-row items-center space-x-3">
          <Ionicons name="notifications" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className="text-base text-black dark:text-white">Notifications</Text>
        </View>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      {/* System Updates */}
      <Text className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">System</Text>
      <View className="flex-row items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-xl">
        <View className="flex-row items-center space-x-3">
          <Ionicons name="cloud-download" size={24} color={colorScheme === 'dark' ? 'white' : 'black'} />
          <Text className="text-base text-black dark:text-white">Auto-update</Text>
        </View>
        <Switch value={autoUpdate} onValueChange={setAutoUpdate} />
      </View>
    </ScrollView>
  )
}
