// services/notificationService.ts - Sistema de notificaciones
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Plant, Lectura, PlantaSupervisada } from '../../types/database';

interface AlertRule {
  id: string;
  plantaSupervisadaId: string;
  type: 'humidity_low' | 'humidity_high' | 'temperature_high' | 'temperature_low';
  threshold: number;
  enabled: boolean;
}

class NotificationService {
  private readonly ALERTS_STORAGE_KEY = 'plant_alerts';
  private readonly RULES_STORAGE_KEY = 'alert_rules';

  async saveAlertRule(rule: AlertRule): Promise<void> {
    try {
      const existingRules = await this.getAlertRules();
      const updatedRules = existingRules.filter(r => r.id !== rule.id);
      updatedRules.push(rule);
      await AsyncStorage.setItem(this.RULES_STORAGE_KEY, JSON.stringify(updatedRules));
    } catch (error) {
      console.error('Error saving alert rule:', error);
    }
  }

  async getAlertRules(): Promise<AlertRule[]> {
    try {
      const rules = await AsyncStorage.getItem(this.RULES_STORAGE_KEY);
      return rules ? JSON.parse(rules) : [];
    } catch (error) {
      console.error('Error getting alert rules:', error);
      return [];
    }
  }

  async checkForAlerts(lectura: Lectura, planta: PlantaSupervisada, plantInfo: Plant): Promise<void> {
    const rules = await this.getAlertRules();
    const plantRules = rules.filter(r => r.plantaSupervisadaId === planta._id && r.enabled);

    for (const rule of plantRules) {
      let shouldAlert = false;
      let message = '';

      switch (rule.type) {
        case 'humidity_low':
          shouldAlert = lectura.humedadSuelo < rule.threshold;
          message = `${planta.nombre}: Humedad del suelo muy baja (${lectura.humedadSuelo}%)`;
          break;
        case 'humidity_high':
          shouldAlert = lectura.humedadSuelo > rule.threshold;
          message = `${planta.nombre}: Humedad del suelo muy alta (${lectura.humedadSuelo}%)`;
          break;
        case 'temperature_high':
          shouldAlert = lectura.temperatura > rule.threshold;
          message = `${planta.nombre}: Temperatura muy alta (${lectura.temperatura}°C)`;
          break;
        case 'temperature_low':
          shouldAlert = lectura.temperatura < rule.threshold;
          message = `${planta.nombre}: Temperatura muy baja (${lectura.temperatura}°C)`;
          break;
      }

      if (shouldAlert) {
        await this.createAlert({
          id: `${rule.id}_${Date.now()}`,
          plantaSupervisadaId: planta._id,
          type: rule.type,
          message,
          timestamp: new Date(),
          acknowledged: false
        });
      }
    }
  }

  async createAlert(alert: any): Promise<void> {
    try {
      const existingAlerts = await this.getAlerts();
      existingAlerts.unshift(alert);
      // Mantener solo las últimas 50 alertas
      const trimmedAlerts = existingAlerts.slice(0, 50);
      await AsyncStorage.setItem(this.ALERTS_STORAGE_KEY, JSON.stringify(trimmedAlerts));
      
      // Aquí podrías integrar con react-native-push-notification
      console.log('🚨 Nueva alerta:', alert.message);
    } catch (error) {
      console.error('Error creating alert:', error);
    }
  }

  async getAlerts(): Promise<any[]> {
    try {
      const alerts = await AsyncStorage.getItem(this.ALERTS_STORAGE_KEY);
      return alerts ? JSON.parse(alerts) : [];
    } catch (error) {
      console.error('Error getting alerts:', error);
      return [];
    }
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    try {
      const alerts = await this.getAlerts();
      const updatedAlerts = alerts.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      );
      await AsyncStorage.setItem(this.ALERTS_STORAGE_KEY, JSON.stringify(updatedAlerts));
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  }
}

export const notificationService = new NotificationService();