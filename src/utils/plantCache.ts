// src/utils/plantCache.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = 'PLANT_CACHE';

export const savePlantCache = async (plants: any[]) => {
  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(plants));
};

export const getPlantCache = async () => {
  const data = await AsyncStorage.getItem(CACHE_KEY);
  return data ? JSON.parse(data) : null;
};

export const clearPlantCache = async () => {
  await AsyncStorage.removeItem(CACHE_KEY);
};
