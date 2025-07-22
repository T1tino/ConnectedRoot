import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';

const temperatureData = [22, 23, 21, 22, 24, 25, 24];
const humidityData = [45, 50, 48, 46, 55, 60, 58];
const screenWidth = Dimensions.get('window').width;

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Mis Plantas</Text>

        <View style={styles.card}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6' }}
            style={styles.plantImage}
            resizeMode="cover"
          />
          <View style={styles.info}>
            <Text style={styles.label}>Temperatura:</Text>
            <Text style={styles.value}>24 °C</Text>
            <Text style={styles.label}>Humedad:</Text>
            <Text style={styles.value}>58 %</Text>
          </View>
        </View>

        <Text style={styles.chartTitle}>Temperatura – Últimas 7 h</Text>
        <LineChart
          data={{
            labels: ['1h', '2h', '3h', '4h', '5h', '6h', '7h'],
            datasets: [{ data: temperatureData }],
          }}
          width={screenWidth - 32}
          height={200}
          yAxisSuffix="°C"
          chartConfig={chartConfig('#4caf50')}
          bezier
          style={styles.chart}
        />

        <Text style={styles.chartTitle}>Humedad – Últimas 7 h</Text>
        <LineChart
          data={{
            labels: ['1h', '2h', '3h', '4h', '5h', '6h', '7h'],
            datasets: [{ data: humidityData }],
          }}
          width={screenWidth - 32}
          height={200}
          yAxisSuffix="%"
          chartConfig={chartConfig('#2196f3')}
          bezier
          style={styles.chart}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const chartConfig = (color: string) => ({
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 0,
  color: () => color,
  labelColor: () => '#666',
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#fff',
  },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f5f9f8' },
  container: { padding: 16, paddingBottom: 32, flex:1 },
  title: { fontSize: 26, fontWeight: '700', color: '#2e7d32', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  plantImage: { width: 100, height: 100, borderRadius: 12 },
  info: { marginLeft: 20 },
  label: { fontSize: 16, color: '#555', marginTop: 4 },
  value: { fontSize: 20, fontWeight: '600', color: '#333' },
  chartTitle: { fontSize: 18, fontWeight: '600', color: '#444', marginTop: 16, marginBottom: 8 },
  chart: { borderRadius: 12, marginBottom: 16 },
});
