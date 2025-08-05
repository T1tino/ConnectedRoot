// hooks/useOfflineSync.ts - Sincronización offline
import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSync, setPendingSync] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected ?? false);
      if (state.isConnected) {
        syncPendingData();
      }
    });

    loadPendingSync();
    return unsubscribe;
  }, []);

  const loadPendingSync = async () => {
    try {
      const pending = await AsyncStorage.getItem('pending_sync');
      setPendingSync(pending ? JSON.parse(pending) : []);
    } catch (error) {
      console.error('Error loading pending sync:', error);
    }
  };

  const addToPendingSync = async (data: any) => {
    try {
      const pending = [...pendingSync, { ...data, timestamp: new Date() }];
      setPendingSync(pending);
      await AsyncStorage.setItem('pending_sync', JSON.stringify(pending));
    } catch (error) {
      console.error('Error adding to pending sync:', error);
    }
  };

  const syncPendingData = async () => {
    if (pendingSync.length === 0) return;

    try {
      for (const item of pendingSync) {
        // Enviar datos pendientes al servidor
        await fetch(`${API_BASE_URL}/${item.endpoint}`, {
          method: item.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data)
        });
      }
      
      // Limpiar datos sincronizados
      setPendingSync([]);
      await AsyncStorage.removeItem('pending_sync');
    } catch (error) {
      console.error('Error syncing pending data:', error);
    }
  };

  return {
    isOnline,
    pendingSync: pendingSync.length,
    addToPendingSync
  };
};