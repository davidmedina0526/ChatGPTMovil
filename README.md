# David Medina - ChatGPT

Este proyecto se basa en una aplicación de chat impulsada por IA, construida con **React Native**, **Expo**, **TypeScript** y **Firebase**. Permite a los usuarios crear cuentas, iniciar sesión, gestionar sus conversaciones y recibir respuestas de un modelo de lenguaje, más concretamente de la API de Google Gemini.

---

## Características principales

1. **Autenticación de usuarios**: Registro e inicio de sesión con Firebase Authentication.  
2. **Gestión de chats**: Crear, listar y eliminar conversaciones por usuario.  
3. **Persistencia de mensajes**: Los mensajes se almacenan en Firestore, asociados a cada usuario por separado.  
4. **Contextos globales**:  
   - **AuthContext** para manejar la autenticación del usuario.  
   - **DataContext** para realizar operaciones CRUD con chats y mensajes.

---

## Estructura de carpetas

1. **app**: Contiene todos los archivos de funcionalidad de la aplicación. Allí se encuentran:
   - *_layout.tsx*: Componente raíz de navegación y proveedores de contexto.
   - *chatScreen.tsx*: Pantalla principal del chat.
   - *index.tsx*: Pantalla de bienvenida al usuario. Contiene información de la aplicación.
   - *loginScreen.tsx*: Pantalla de inicio de sesión del usuario.
   - *signupScreen.tsx*: Pantalla de registro de nueva cuenta de usuario.
2. **assets**: Contiene los recursos estáticos que usa la aplicación (imágenes, fuente de texto, etc.).
3. **context**: Contiene los archivos de lógica de la aplicación. Allí se encuentran:
   - *AuthContext.tsx*: Contiene la lógica de autenticación y manejo de estado del usuario utilizando Firebase Authentication.
   - *DataContext.tsx*: Contiene la lógica para las operaciones de chat usando Firestore Database.
4. **interfaces**: Guarda en su interior los archivos:
   - *AppInterfaces.ts*: Interfaces para mensajes, contenido, etc.
   - *Responses.ts*: Interfaces específicas para las respuestas de la API.
5. **utils**: Contiene funciones específicas de configuración de la aplicación:
   - *chatService.ts*: Funciones CRUD para Firestore (creación, obtención y eliminación de chats).
   - *FirebaseConfig.ts*: Archivo de configuración de Firebase.
  
---

## Guía de uso

**Paso 1.** Clonar el repositorio en tu máquina local.
**Paso 2.** Instalar las dependencias usando:

npm install

**Paso 3.** Iniciar la aplicación usando el comando:

npm start

o el comando:

npx expo start
