// utils/networkUtils.ts
import NetInfo from '@react-native-community/netinfo';

export const getApiBaseUrl = async () => {
  const netInfo = await NetInfo.fetch();
  const isLocalNetwork = netInfo.type === 'wifi';
  
  return isLocalNetwork 
    // ? 'http://192.168.1.100:3000/api'  // Tu IP local
    ? 'http://192.168.128.196:3000/api'  // Tu IP local
    : 'https://connectroot.com/api';
}