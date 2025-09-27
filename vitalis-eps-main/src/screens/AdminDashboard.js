import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Avatar, Button } from 'react-native-paper';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const STORAGE_KEY = 'CITAS';
const MEDICOS_KEY = 'MEDICOS';

export default function AdminDashboard() {
  const [citas, setCitas] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [activeTab, setActiveTab] = useState('citas');

  // Cargar datos
  const loadData = async () => {
    try {
      const citasData = await AsyncStorage.getItem(STORAGE_KEY);
      const medicosData = await AsyncStorage.getItem(MEDICOS_KEY);
      setCitas(citasData ? JSON.parse(citasData) : []);
      setMedicos(medicosData ? JSON.parse(medicosData) : []);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  // Eliminar cita
  const eliminarCita = async (id) => {
    try {
      const nuevasCitas = citas.filter(c => c.id !== id);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nuevasCitas));
      setCitas(nuevasCitas);
      Alert.alert('Éxito', 'Cita eliminada correctamente.');
    } catch (error) {
      console.error('Error al eliminar la cita:', error);
    }
  };

  // Estadísticas
  const estadisticas = {
    totalCitas: citas.length,
    citasHoy: citas.filter(c => c.dia === new Date().toLocaleDateString()).length,
    citasCompletadas: citas.filter(c => c.visitado).length,
    medicosActivos: medicos.length
  };

  // Datos para gráficos
  const citasPorMedico = () => {
    const data = {};
    citas.forEach(cita => {
      if (cita.medico) {
        data[cita.medico] = (data[cita.medico] || 0) + 1;
      }
    });
    return data;
  };

  useEffect(() => {
    loadData();
  }, []);

  // Componente de tarjetas de resumen
  const StatsCard = ({ title, value, icon }) => (
    <Card style={styles.statsCard}>
      <Card.Content style={styles.statsContent}>
        <Text style={styles.statsValue}>{value}</Text>
        <Text style={styles.statsTitle}>{title}</Text>
      </Card.Content>
    </Card>
  );

  // Render item para citas
  const renderCita = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Avatar.Text size={40} label={`${item.nombre[0]}${item.apellido[0]}`} />
          <Text style={styles.cardTitle}>{item.nombre} {item.apellido}</Text>
        </View>
        <Text style={styles.cardText}>📅 Fecha: {item.dia} {item.hora}</Text>
        <Text style={styles.cardText}>🆔 Cédula: {item.cedula}</Text>
        <Text style={styles.cardText}>📧 Correo: {item.correo}</Text>
        <Text style={styles.cardText}>👨‍⚕️ Médico: {item.medico || 'No asignado'}</Text>
        <Text style={styles.cardText}>✅ Estado: {item.visitado ? 'Atendido' : 'Pendiente'}</Text>
        
        <View style={styles.cardActions}>
          <Button 
            mode="contained" 
            style={styles.deleteButton}
            onPress={() => eliminarCita(item.id)}
          >
            Eliminar
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  // Render item para médicos
  const renderMedico = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Avatar.Text size={40} label={`${item.nombre[0]}${item.apellido[0]}`} />
          <View>
            <Text style={styles.cardTitle}>Dr. {item.nombre} {item.apellido}</Text>
            <Text style={styles.specialty}>{item.especialidad}</Text>
          </View>
        </View>
        <Text style={styles.cardText}>🆔 Cédula: {item.cedula}</Text>
        <Text style={styles.cardText}>📧 Correo: {item.correo}</Text>
        <Text style={styles.cardText}>📅 Horario: {item.horario}</Text>
        <Text style={styles.cardText}>📊 Citas atendidas: {
          citas.filter(c => c.medico === `${item.nombre} ${item.apellido}`).length
        }</Text>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Dashboard Administrativo EPS</Text>
      
      {/* Tarjetas de resumen */}
      <View style={styles.statsContainer}>
        <StatsCard title="Total Citas" value={estadisticas.totalCitas} icon="calendar" />
        <StatsCard title="Citas Hoy" value={estadisticas.citasHoy} icon="calendar-today" />
        <StatsCard title="Atendidas" value={estadisticas.citasCompletadas} icon="check" />
        <StatsCard title="Médicos" value={estadisticas.medicosActivos} icon="doctor" />
      </View>

      {/* Pestañas */}
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'citas' && styles.activeTab]}
          onPress={() => setActiveTab('citas')}
        >
          <Text style={styles.tabText}>Citas</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'medicos' && styles.activeTab]}
          onPress={() => setActiveTab('medicos')}
        >
          <Text style={styles.tabText}>Médicos</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'graficos' && styles.activeTab]}
          onPress={() => setActiveTab('graficos')}
        >
          <Text style={styles.tabText}>Gráficos</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido según pestaña */}
      {activeTab === 'citas' && (
        <FlatList
          data={citas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCita}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay citas registradas.</Text>
          }
        />
      )}

      {activeTab === 'medicos' && (
        <FlatList
          data={medicos}
          keyExtractor={(item) => item.cedula}
          renderItem={renderMedico}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay médicos registrados.</Text>
          }
        />
      )}

      {activeTab === 'graficos' && (
        <View style={styles.chartsContainer}>
          <Text style={styles.chartTitle}>Citas por Médico</Text>
          <BarChart
            data={{
              labels: Object.keys(citasPorMedico()),
              datasets: [{
                data: Object.values(citasPorMedico())
              }]
            }}
            width={Dimensions.get('window').width - 30}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(30, 136, 229, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            style={styles.chart}
          />

          <Text style={styles.chartTitle}>Estado de Citas</Text>
          <PieChart
            data={[
              {
                name: 'Atendidas',
                population: estadisticas.citasCompletadas,
                color: '#4CAF50',
                legendFontColor: '#7F7F7F'
              },
              {
                name: 'Pendientes',
                population: estadisticas.totalCitas - estadisticas.citasCompletadas,
                color: '#FFC107',
                legendFontColor: '#7F7F7F'
              }
            ]}
            width={Dimensions.get('window').width - 30}
            height={200}
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(30, 136, 229, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            style={styles.chart}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f5f5f5'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center'
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20
  },
  statsCard: {
    width: '48%',
    marginBottom: 15,
    elevation: 3
  },
  statsContent: {
    alignItems: 'center',
    paddingVertical: 15
  },
  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5
  },
  statsTitle: {
    fontSize: 14,
    color: '#666'
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center'
  },
  activeTab: {
    backgroundColor: '#1e88e5'
  },
  tabText: {
    fontWeight: 'bold',
    color: '#333'
  },
  activeTabText: {
    color: '#fff'
  },
  card: {
    marginBottom: 15,
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10
  },
  specialty: {
    fontSize: 14,
    color: '#666',
    marginLeft: 10
  },
  cardText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555'
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10
  },
  deleteButton: {
    backgroundColor: '#f44336',
    borderRadius: 4
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666'
  },
  chartsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    elevation: 2,
    marginBottom: 20
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  chart: {
    borderRadius: 8,
    marginBottom: 20
  }
});