# Vitalis EPS - App de Gestión Médica

Vitalis EPS es una aplicación hibrida desarrollada con React Native (Expo) que permite a médicos, pacientes y administradores acceder a funciones específicas dentro de un entorno de salud. Los médicos pueden registrarse, mientras que los pacientes y administradores tienen credenciales predefinidas. La autenticación y almacenamiento se realiza mediante **Firebase Firestore**.

---

## Características

- Registro de médicos con cédula, nombre, correo y contraseña.
- Inicio de sesión para médicos, pacientes y administradores.
- Validación de credenciales y roles directamente desde Firebase Firestore.
- Interfaz amigable con diseño personalizado y fondo azul celeste.
- Almacenamiento seguro de usuarios en la nube.
- Alertas animadas para retroalimentación de acciones.
- Compatible con Android, iOS y Web (opcional).

---

## Tecnologías utilizadas

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Firebase (Firestore)](https://firebase.google.com/)
- [React Navigation](https://reactnavigation.org/)
- [React Native Animatable](https://github.com/oblador/react-native-animatable)
- [AsyncStorage (temporal para pruebas locales)](https://react-native-async-storage.github.io/async-storage/)

---

## Instalación y ejecución

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu_usuario/tu_repositorio.git
   cd tu_repositorio
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Asegúrate de tener configurado tu proyecto en Firebase y haber reemplazado los valores reales en:
   ```
   /src/firebase/firebaseConfig.js
   ```

4. Inicia el proyecto:
   ```bash
   npx expo start
   ```

5. Escanea el QR con la app de Expo Go o ejecuta en emulador.

---

## Cuentas de prueba

**Administrador**
- Cédula: `1234567890`
- Contraseña: `admin123`
- Rol: `administrador`

**Paciente**
- Cédula: `0987654321`
- Contraseña: `paciente123`
- Rol: `paciente`

---

## Estructura del proyecto

```
/src
 ├── components/
 │    └── LoginForm.js
 ├── firebase/
 │    └── firebaseConfig.js
 ├── screens/
 │    ├── LoginScreen.js
 │    ├── Registro.js
 │    ├── RecuperarContrasena.js
 │    └── HomeScreens/
 └── App.js
```

---

##  Notas

- Solo los médicos pueden registrarse desde la app.
- La validación de rol se realiza desde Firestore para cada inicio de sesión.
- El ícono de la aplicación se puede personalizar en `app.json`.

---

## Contacto

¿Dudas o sugerencias? Contáctame a través del repositorio o en mi correo: [ubarnesbarriosj@gmail.com](mailto:ubarnesbarriosj@gmail.com)
