import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { collection, setDoc, doc, getDoc } from 'firebase/firestore';
import { db } from './src/firebase/firebaseConfig'; // Asegúrate de que esta ruta sea correcta

// Pantallas - Importación optimizada
const screens = {
  LoginScreen: require('./src/screens/LoginScreen').default,
  LoginMedico: require('./src/screens/LoginMedico').default,
  LoginPaciente: require('./src/screens/LoginPaciente').default,
  LoginAdmin: require('./src/screens/LoginAdmin').default,
  HomeScreen: require('./src/screens/HomeScreen').default,
  AdminDashboard: require('./src/screens/AdminDashboard').default,
  MedicoDashboard: require('./src/screens/MedicoDashboard').default,
  PacienteDashboard: require('./src/screens/PacienteDashboard').default,
  Registro: require('./src/screens/Registro').default,
  RecuperarTemp: require('./src/screens/RecuperarTemp').default,
  Solicitarcita: require('./src/screens/Solicitarcita').default,
  ResultadosMe: require('./src/screens/ResultadosMe').default,
  Optometria: require('./src/screens/Optometria').default,
  Odontologia: require('./src/screens/Odontologia').default,
  Pediatria: require('./src/screens/Pediatria').default,
  HistorialMedico: require('./src/screens/HistorialMedico').default,
};

const Stack = createStackNavigator();

// ✅ Función para precargar usuarios en Firestore
const precargarUsuarios = async () => {
  try {
    // Verificar si el administrador ya existe
    const adminRef = doc(collection(db, 'usuarios'), '100000001');
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {
      // Administrador
      await setDoc(adminRef, {
        cedula: '100000001',
        password: 'adminpass',
        nombre: 'Administrador Principal',
        correo: 'admin@vitalis.com',
        rol: 'admin',
      });

      // Paciente 1
      await setDoc(doc(collection(db, 'usuarios'), '100000002'), {
        cedula: '100000002',
        password: 'paciente123',
        nombre: 'Juan Paciente',
        correo: 'juan@paciente.com',
        rol: 'paciente',
      });

      // Paciente 2
      await setDoc(doc(collection(db, 'usuarios'), '100000003'), {
        cedula: '100000003',
        password: 'paciente456',
        nombre: 'Ana Paciente',
        correo: 'ana@paciente.com',
        rol: 'paciente',
      });

      console.log('✅ Usuarios precargados con éxito en Firestore');
    } else {
      console.log('ℹ️ Los usuarios ya están precargados en Firestore');
    }
  } catch (error) {
    console.error('❌ Error al precargar usuarios:', error);
  }
};

export default function App() {
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepararApp = async () => {
      await precargarUsuarios();
      setAppReady(true);
    };

    prepararApp();
  }, []);

  if (!appReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007bff',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTitleAlign: 'center',
        }}
      >
        {/* Grupo de autenticación */}
        <Stack.Group>
          <Stack.Screen
            name="Login"
            component={screens.LoginScreen}
            options={{ title: 'Inicio de Sesión' }}
          />
          <Stack.Screen
            name="LoginMedico"
            component={screens.LoginMedico}
            options={{ title: 'Médico - Login' }}
          />
          <Stack.Screen
            name="LoginPaciente"
            component={screens.LoginPaciente}
            options={{ title: 'Paciente - Login' }}
          />
          <Stack.Screen
            name="LoginAdmin"
            component={screens.LoginAdmin}
            options={{ title: 'Admin - Login' }}
          />
        </Stack.Group>

        {/* Grupo de registro y recuperación */}
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            name="Registro"
            component={screens.Registro}
            options={{ title: 'Registro de Usuario' }}
          />
          <Stack.Screen
            name="RecuperarContrasena"
            component={screens.RecuperarTemp}
            options={{ title: 'Recuperar Contraseña' }}
          />
        </Stack.Group>

        {/* Dashboards */}
        <Stack.Group>
          <Stack.Screen
            name="AdminDashboard"
            component={screens.AdminDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MedicoDashboard"
            component={screens.MedicoDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PacienteDashboard"
            component={screens.PacienteDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="HistorialMedico"
            component={screens.HistorialMedico}
            options={{ headerShown: false }}
          />
        </Stack.Group>

        {/* Servicios médicos */}
        <Stack.Group>
          <Stack.Screen
            name="Home"
            component={screens.HomeScreen}
            options={{ title: 'Inicio' }}
          />
          <Stack.Screen
            name="Solicitarcita"
            component={screens.Solicitarcita}
            options={{ title: 'Solicitar Cita' }}
          />
          <Stack.Screen
            name="ResultadosMe"
            component={screens.ResultadosMe}
            options={{ title: 'Resultados Médicos' }}
          />
          <Stack.Screen
            name="Optometria"
            component={screens.Optometria}
            options={{ title: 'Servicio de Optometría' }}
          />
          <Stack.Screen
            name="Odontologia"
            component={screens.Odontologia}
            options={{ title: 'Servicio de Odontología' }}
          />
          <Stack.Screen
            name="Pediatria"
            component={screens.Pediatria}
            options={{ title: 'Servicio de Pediatría' }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
