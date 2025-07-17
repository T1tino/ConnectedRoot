import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts'; // necesitas instalar
import * as shape from 'd3-shape';

const temperatureData = [22, 23, 21, 22, 24, 25, 24]; // temperatura simulada (°C)
const humidityData = [45, 50, 48, 46, 55, 60, 58];    // humedad simulada (%)

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Plantas</Text>

      {/* Tarjeta con temperatura y humedad */}
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6' }}
          style={styles.plantImage}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.label}>Temperatura:</Text>
          <Text style={styles.value}>24°C</Text>
          <Text style={styles.label}>Humedad:</Text>
          <Text style={styles.value}>58%</Text>
        </View>
      </View>

      {/* Gráfica de temperatura */}
      <Text style={styles.chartTitle}>Temperatura - Últimas 7 horas</Text>
      <View style={{ height: 150, flexDirection: 'row', paddingHorizontal: 10 }}>
        <YAxis
          data={temperatureData}
          contentInset={{ top: 20, bottom: 20 }}
          svg={{ fontSize: 10, fill: '#4caf50' }}
          numberOfTicks={6}
          formatLabel={(value) => `${value}°C`}
        />
        <LineChart
          style={{ flex: 1, marginLeft: 8 }}
          data={temperatureData}
          svg={{ stroke: '#4caf50', strokeWidth: 3 }}
          contentInset={{ top: 20, bottom: 20 }}
          curve={shape.curveNatural}
        >
          <Grid />
        </LineChart>
      </View>

      {/* Gráfica de humedad */}
      <Text style={styles.chartTitle}>Humedad - Últimas 7 horas</Text>
      <View style={{ height: 150, flexDirection: 'row', paddingHorizontal: 10 }}>
        <YAxis
          data={humidityData}
          contentInset={{ top: 20, bottom: 20 }}
          svg={{ fontSize: 10, fill: '#2196f3' }}
          numberOfTicks={6}
          formatLabel={(value) => `${value}%`}
        />
        <LineChart
          style={{ flex: 1, marginLeft: 8 }}
          data={humidityData}
          svg={{ stroke: '#2196f3', strokeWidth: 3 }}
          contentInset={{ top: 20, bottom: 20 }}
          curve={shape.curveNatural}
        >
          <Grid />
        </LineChart>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9f8', // inspirado en Greener: fondo suave
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2e7d32', // verde oscuro tipo Greener
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 3,
  },
  plantImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  info: {
    marginLeft: 20,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
});
