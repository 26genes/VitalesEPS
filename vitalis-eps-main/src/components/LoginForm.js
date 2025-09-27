import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';

const LoginForm = ({ title, navigation, destino, rolEsperado }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const usuariosRef = collection(db, 'usuarios');
      const q = query(usuariosRef, where('cedula', '==', username.trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        Alert.alert('Error', 'Usuario no encontrado');
        return;
      }

      const doc = querySnapshot.docs[0];
      const user = doc.data();

      if (user.password !== password) {
        Alert.alert('Error', 'Contraseña incorrecta');
        return;
      }

      if (rolEsperado && user.rol !== rolEsperado) {
        Alert.alert('Error', `No tienes permisos para acceder como ${rolEsperado}`);
        return;
      }

      navigation.navigate(destino);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      Alert.alert('Error', 'Hubo un problema al iniciar sesión');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/doctor.png')} style={styles.image} />
      <Text style={styles.title}>{title}</Text>

      <TextInput
        placeholder="Cédula o correo"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Animatable.View animation="fadeInUp" duration={500} delay={300}>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </Animatable.View>

      {rolEsperado === 'medico' && (
        <Animatable.View animation="fadeInUp" duration={500} delay={500}>
          <TouchableOpacity onPress={() => navigation.navigate('Registro')}>
            <Text style={styles.link}>¿No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>
        </Animatable.View>
      )}

      <Animatable.View animation="fadeInUp" duration={500} delay={700}>
        <TouchableOpacity onPress={() => navigation.navigate('RecuperarContrasena')}>
          <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#CCECFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 18,
    borderRadius: 8,
    paddingLeft: 15,
    backgroundColor: '#fff',
    width: '80%',
    maxWidth: 400,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    width: '80%',
    maxWidth: 400,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 25,
  },
  link: {
    color: '#007AFF',
    marginTop: 12,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default LoginForm;

