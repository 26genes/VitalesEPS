import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Animatable from 'react-native-animatable';
import { db } from '../firebase/firebaseConfig'; // Ajusta la ruta si tu archivo firebaseConfig está en otro lugar
import { collection, addDoc } from 'firebase/firestore';

const Registro = ({ navigation }) => {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');

  const handleRegistro = async () => {
    if (!cedula || !password || !nombre || !correo) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const userData = {
      cedula,
      password,
      nombre,
      correo,
      rol: 'medico',
    };

    try {
      // Guarda en Firestore
      await addDoc(collection(db, 'usuarios'), userData);

      // Guarda en AsyncStorage (opcional)
      await AsyncStorage.setItem(`usuario_${cedula}`, JSON.stringify(userData));

      Alert.alert('Registro exitoso', 'Ahora puedes iniciar sesión como médico');
      navigation.goBack();
    } catch (error) {
      console.error('Error al registrar en Firebase:', error);
      Alert.alert('Error', 'No se pudo registrar el usuario en Firebase');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/doctor.png')} style={styles.image} />
      <Text style={styles.title}>Registro</Text>

      <TextInput placeholder="Cédula" value={cedula} onChangeText={setCedula} style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={styles.input} />
      <TextInput placeholder="Correo" value={correo} onChangeText={setCorreo} style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

      <Animatable.View animation="fadeInUp" duration={500} delay={300}>
        <TouchableOpacity onPress={handleRegistro} style={styles.button}>
          <Text style={styles.buttonText}>Registrarse</Text>
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
    textAlign: 'center',
    marginBottom: 20,
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
});

export default Registro;
