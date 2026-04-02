# Complete Android Chat App Architecture

## Project Overview

A production-ready real-time chat application for Android using React Native with Socket.io integration, Firebase authentication, and scalable architecture patterns.

## Technology Stack

### Frontend Framework

- **React Native 0.81.5** - Cross-platform mobile development
- **Expo SDK ~54.0.33** - Development platform and tools

### Navigation

- **React Navigation 7.x** - Screen navigation
- **Native Stack Navigator** - Performance-optimized navigation

### State Management

- **Context API + useReducer** - Global state management
- **AsyncStorage** - Local data persistence

### Authentication

- **Firebase Auth** - User authentication
- **Google Sign-In** - Social authentication

### Real-time Communication

- **Socket.io Client** - Real-time messaging
- **Socket.io Server** - Node.js backend

### Database

- **Firebase Firestore** - NoSQL database for messages
- **Firebase Storage** - File uploads

### UI/UX

- **React Native Elements** - UI component library
- **React Native Vector Icons** - Icon library

## Project Structure

```
mobile-app/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── common/          # Generic components
│   │   │   ├── Button.js
│   │   │   ├── Input.js
│   │   │   ├── Loading.js
│   │   │   └── Modal.js
│   │   ├── chat/            # Chat-specific components
│   │   │   ├── MessageBubble.js
│   │   │   ├── ChatInput.js
│   │   │   ├── TypingIndicator.js
│   │   │   └── OnlineStatus.js
│   │   └── user/            # User-related components
│   │       ├── UserAvatar.js
│   │       ├── UserList.js
│   │       └── UserProfile.js
│   ├── screens/             # Screen components
│   │   ├── auth/
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   ├── ForgotPasswordScreen.js
│   │   │   └── OnboardingScreen.js
│   │   ├── main/
│   │   │   ├── HomeScreen.js
│   │   │   ├── ChatListScreen.js
│   │   │   ├── ProfileScreen.js
│   │   │   └── SettingsScreen.js
│   │   └── chat/
│   │       ├── ChatScreen.js
│   │       ├── GroupChatScreen.js
│   │       └── SearchUsersScreen.js
│   ├── context/             # Global state context
│   │   ├── AuthContext.js
│   │   ├── ChatContext.js
│   │   ├── ThemeContext.js
│   │   └── SocketContext.js
│   ├── services/            # API and external services
│   │   ├── authService.js
│   │   ├── chatService.js
│   │   ├── socketService.js
│   │   ├── storageService.js
│   │   └── notificationService.js
│   ├── navigation/          # Navigation configuration
│   │   ├── AppNavigator.js
│   │   ├── AuthNavigator.js
│   │   └── TabNavigator.js
│   ├── utils/               # Utility functions
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── permissions.js
│   ├── hooks/               # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useSocket.js
│   │   ├── useChat.js
│   │   └── useStorage.js
│   └── styles/              # Global styles
│       ├── colors.js
│       ├── typography.js
│       ├── spacing.js
│       └── theme.js
├── server/                  # Node.js backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   ├── config/
│   └── package.json
├── assets/                  # Static assets
│   ├── images/
│   ├── icons/
│   └── fonts/
├── docs/                    # Documentation
├── tests/                   # Test files
├── App.js                   # Main app entry
├── package.json
├── babel.config.js
├── metro.config.js
└── app.json
```

## Architecture Patterns

### 1. Layered Architecture

```
Presentation Layer (Screens/Components)
    ↓
Business Logic Layer (Context/Hooks)
    ↓
Service Layer (Services/API)
    ↓
Data Layer (Storage/Database)
```

### 2. Clean Architecture Principles

- **Dependency Inversion**: High-level modules don't depend on low-level modules
- **Separation of Concerns**: Each layer has specific responsibilities
- **Testability**: Easy to unit test each layer

### 3. State Management Pattern

```javascript
// Context + Reducer Pattern
const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
```

## Core Components Implementation

### 1. Authentication Context

```javascript
// src/context/AuthContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        user: action.payload, 
        isAuthenticated: true 
      };
    case 'AUTH_FAILURE':
      return { 
        ...state, 
        loading: false, 
        error: action.payload, 
        isAuthenticated: false 
      };
    case 'AUTH_LOGOUT':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false, 
        error: null 
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        dispatch({ type: 'AUTH_SUCCESS', payload: userData });
      } else {
        await AsyncStorage.removeItem('user');
        dispatch({ type: 'AUTH_LOGOUT' });
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      throw error;
    }
  };

  const register = async (email, password, displayName) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({ displayName });
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE', payload: error.message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
```

### 2. Socket Service

```javascript
// src/services/socketService.js
import io from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(userId) {
    if (this.socket && this.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      transports: ['websocket'],
      query: { userId },
    });

    this.socket.on('connect', () => {
      this.connected = true;
      console.log('Socket connected:', this.socket.id);
    });

    this.socket.on('disconnect', () => {
      this.connected = false;
      console.log('Socket disconnected');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  joinRoom(roomId) {
    if (this.socket && this.connected) {
      this.socket.emit('join_room', roomId);
    }
  }

  leaveRoom(roomId) {
    if (this.socket && this.connected) {
      this.socket.emit('leave_room', roomId);
    }
  }

  sendMessage(messageData) {
    if (this.socket && this.connected) {
      this.socket.emit('send_message', messageData);
    }
  }

  onMessage(callback) {
    if (this.socket) {
      this.socket.on('receive_message', callback);
    }
  }

  onTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  onUserOnline(callback) {
    if (this.socket) {
      this.socket.on('user_online', callback);
    }
  }

  onUserOffline(callback) {
    if (this.socket) {
      this.socket.on('user_offline', callback);
    }
  }

  emitTyping(roomId, userId) {
    if (this.socket && this.connected) {
      this.socket.emit('typing', { roomId, userId });
    }
  }

  emitStopTyping(roomId, userId) {
    if (this.socket && this.connected) {
      this.socket.emit('stop_typing', { roomId, userId });
    }
  }

  getSocket() {
    return this.socket;
  }

  isConnected() {
    return this.connected;
  }
}

export default new SocketService();
```

### 3. Chat Service

```javascript
// src/services/chatService.js
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

class ChatService {
  constructor() {
    this.db = firestore();
    this.currentUser = auth().currentUser;
  }

  // Create or get chat room
  async getOrCreateChatRoom(participantId) {
    const currentUserId = this.currentUser.uid;
    
    // Check if chat room already exists
    const chatRoomsQuery = await this.db
      .collection('chatRooms')
      .where('participants', 'array-contains', currentUserId)
      .get();

    let existingRoom = null;
    
    chatRoomsQuery.forEach(doc => {
      const roomData = doc.data();
      if (roomData.participants.includes(participantId)) {
        existingRoom = { id: doc.id, ...roomData };
      }
    });

    if (existingRoom) {
      return existingRoom;
    }

    // Create new chat room
    const newRoom = {
      participants: [currentUserId, participantId],
      createdAt: firestore.FieldValue.serverTimestamp(),
      lastMessage: null,
      lastMessageTime: firestore.FieldValue.serverTimestamp(),
    };

    const roomRef = await this.db.collection('chatRooms').add(newRoom);
    return { id: roomRef.id, ...newRoom };
  }

  // Send message
  async sendMessage(roomId, messageText, messageType = 'text') {
    const message = {
      text: messageText,
      type: messageType,
      senderId: this.currentUser.uid,
      senderName: this.currentUser.displayName,
      timestamp: firestore.FieldValue.serverTimestamp(),
      read: false,
    };

    await this.db.collection('chatRooms').doc(roomId).collection('messages').add(message);

    // Update last message in room
    await this.db.collection('chatRooms').doc(roomId).update({
      lastMessage: messageText,
      lastMessageTime: firestore.FieldValue.serverTimestamp(),
      lastMessageSender: this.currentUser.uid,
    });

    return message;
  }

  // Get messages for a room
  getMessages(roomId, limit = 50) {
    return this.db
      .collection('chatRooms')
      .doc(roomId)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .onSnapshot(snapshot => {
        const messages = [];
        snapshot.forEach(doc => {
          messages.push({ id: doc.id, ...doc.data() });
        });
        return messages.reverse();
      });
  }

  // Get user's chat rooms
  getUserChatRooms() {
    return this.db
      .collection('chatRooms')
      .where('participants', 'array-contains', this.currentUser.uid)
      .orderBy('lastMessageTime', 'desc')
      .onSnapshot(snapshot => {
        const rooms = [];
        snapshot.forEach(doc => {
          rooms.push({ id: doc.id, ...doc.data() });
        });
        return rooms;
      });
  }

  // Mark messages as read
  async markMessagesAsRead(roomId) {
    const unreadMessages = await this.db
      .collection('chatRooms')
      .doc(roomId)
      .collection('messages')
      .where('read', '==', false)
      .where('senderId', '!=', this.currentUser.uid)
      .get();

    const batch = this.db.batch();
    unreadMessages.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });

    await batch.commit();
  }

  // Search users
  async searchUsers(query) {
    const users = await this.db
      .collection('users')
      .where('displayName', '>=', query)
      .where('displayName', '<=', query + '\uf8ff')
      .limit(10)
      .get();

    return users.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Get user by ID
  async getUserById(userId) {
    const userDoc = await this.db.collection('users').doc(userId).get();
    return userDoc.exists ? { id: userDoc.id, ...userDoc.data() } : null;
  }

  // Update user profile
  async updateUserProfile(updates) {
    await this.db.collection('users').doc(this.currentUser.uid).update(updates);
  }
}

export default new ChatService();
```

### 4. Navigation Structure

```javascript
// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/main/HomeScreen';
import ChatListScreen from '../screens/main/ChatListScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import ChatScreen from '../screens/chat/ChatScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const HomeTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Home') {
          iconName = 'home';
        } else if (route.name === 'Chats') {
          iconName = 'chat';
        } else if (route.name === 'Profile') {
          iconName = 'person';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Chats" component={ChatListScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeTabs" component={HomeTabs} />
    <Stack.Screen 
      name="Chat" 
      component={ChatScreen}
      options={{ presentation: 'modal' }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
```

### 5. Custom Hooks

```javascript
// src/hooks/useSocket.js
import { useEffect, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';

export const useSocket = () => {
  const socketContext = useContext(SocketContext);
  
  if (!socketContext) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  
  return socketContext;
};

// src/hooks/useChat.js
import { useState, useEffect } from 'react';
import chatService from '../services/chatService';
import { useSocket } from './useSocket';

export const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!roomId) return;

    // Join socket room
    socket.joinRoom(roomId);

    // Listen for new messages
    const unsubscribeMessages = chatService.getMessages(roomId);
    
    socket.onMessage((message) => {
      setMessages(prev => [...prev, message]);
    });

    socket.onTyping(({ userId, isTyping }) => {
      setTypingUsers(prev => {
        if (isTyping) {
          return [...prev.filter(id => id !== userId), userId];
        } else {
          return prev.filter(id => id !== userId);
        }
      });
    });

    return () => {
      socket.leaveRoom(roomId);
      if (unsubscribeMessages) {
        unsubscribeMessages();
      }
    };
  }, [roomId, socket]);

  const sendMessage = async (text) => {
    try {
      await chatService.sendMessage(roomId, text);
      socket.sendMessage({
        roomId,
        text,
        senderId: socket.getUserId(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const markAsRead = async () => {
    try {
      await chatService.markMessagesAsRead(roomId);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  return {
    messages,
    loading,
    typingUsers,
    sendMessage,
    markAsRead,
  };
};
```

## Server Architecture

### Node.js Backend Structure

```javascript
// server/src/app.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/user');
const socketHandler = require('./services/socketService');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);

// Socket handling
socketHandler(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Socket Service Implementation

```javascript
// server/src/services/socketService.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const socketHandler = (io) => {
  const connectedUsers = new Map();

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        return next(new Error('Authentication error'));
      }
      
      socket.userId = user._id.toString();
      socket.userEmail = user.email;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected`);
    connectedUsers.set(socket.userId, socket.id);

    // Join room
    socket.on('join_room', (roomId) => {
      socket.join(roomId);
      socket.to(roomId).emit('user_joined', { userId: socket.userId });
    });

    // Leave room
    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit('user_left', { userId: socket.userId });
    });

    // Send message
    socket.on('send_message', async (data) => {
      const { roomId, text, type = 'text' } = data;
      
      try {
        // Save message to database
        const message = await Message.create({
          roomId,
          senderId: socket.userId,
          text,
          type,
          timestamp: new Date(),
        });

        // Populate sender info
        await message.populate('senderId', 'displayName avatar');

        // Broadcast to room
        io.to(roomId).emit('receive_message', message);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Typing indicators
    socket.on('typing', (data) => {
      socket.to(data.roomId).emit('user_typing', {
        userId: socket.userId,
        isTyping: true,
      });
    });

    socket.on('stop_typing', (data) => {
      socket.to(data.roomId).emit('user_typing', {
        userId: socket.userId,
        isTyping: false,
      });
    });

    // Online status
    socket.on('disconnect', () => {
      console.log(`User ${socket.userId} disconnected`);
      connectedUsers.delete(socket.userId);
      
      // Notify other users
      socket.broadcast.emit('user_offline', { userId: socket.userId });
    });

    // Mark as online
    socket.broadcast.emit('user_online', { userId: socket.userId });
  });

  return io;
};

module.exports = socketHandler;
```

## Database Schema

### Firebase Firestore Collections

```javascript
// Users Collection
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  bio: string,
  isOnline: boolean,
  lastSeen: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}

// ChatRooms Collection
{
  participants: [string], // Array of user IDs
  createdAt: timestamp,
  lastMessage: string,
  lastMessageTime: timestamp,
  lastMessageSender: string,
  type: string, // 'direct' or 'group'
  groupName: string, // For group chats
  groupAvatar: string, // For group chats
}

// Messages Collection (Subcollection of ChatRooms)
{
  senderId: string,
  senderName: string,
  text: string,
  type: string, // 'text', 'image', 'file', 'voice'
  timestamp: timestamp,
  read: boolean,
  readBy: [string], // Array of user IDs who read the message
  replyTo: string, // Message ID being replied to
  reactions: {
    [emoji]: [string] // Array of user IDs
  }
}

// TypingIndicators Collection
{
  roomId: string,
  userId: string,
  isTyping: boolean,
  timestamp: timestamp
}
```

## Implementation Steps

### Phase 1: Setup and Foundation (2-3 days)

1. **Project Setup**

```bash
# Install dependencies
npm install @react-navigation/native @react-navigation/native-stack
npm install @react-navigation/bottom-tabs
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
npm install socket.io-client
npm install @react-native-async-storage/async-storage
npm install react-native-vector-icons
npm install react-native-elements
```

1. **Firebase Configuration**

```javascript
// firebase.js
import firebase from '@react-native-firebase/app';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;
```

1. **Create Basic Structure**
   - Set up folder structure
   - Create context providers
   - Set up navigation
   - Create basic screens

### Phase 2: Authentication System (2-3 days)

1. **Implement Auth Context**
2. **Create Login/Register Screens**
3. **Add Firebase Auth Integration**
4. **Implement Auto-login**
5. **Add Social Login (Google)**

### Phase 3: Chat Functionality (4-5 days)

1. **Set up Firestore Collections**
2. **Implement Chat Service**
3. **Create Chat UI Components**
4. **Add Real-time Messaging**
5. **Implement Typing Indicators**

### Phase 4: Socket Integration (3-4 days)

1. **Set up Node.js Server**
2. **Implement Socket Events**
3. **Connect Client to Server**
4. **Add Real-time Features**
5. **Handle Connection Issues**

### Phase 5: Advanced Features (5-7 days)

1. **User Profiles**
2. **Search Users**
3. **Group Chats**
4. **File Sharing**
5. **Push Notifications**

## Testing Strategy

### Unit Tests

```javascript
// __tests__/authContext.test.js
import { renderHook, act } from '@testing-library/react-hooks';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

test('should login user successfully', async () => {
  const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
  const { result } = renderHook(() => useAuth(), { wrapper });

  await act(async () => {
    await result.current.login('test@example.com', 'password');
  });

  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.user.email).toBe('test@example.com');
});
```

### Integration Tests

```javascript
// __tests__/chatService.test.js
import chatService from '../src/services/chatService';

test('should send message successfully', async () => {
  const roomId = 'test-room-id';
  const messageText = 'Hello, World!';
  
  const message = await chatService.sendMessage(roomId, messageText);
  
  expect(message.text).toBe(messageText);
  expect(message.senderId).toBeDefined();
});
```

## Deployment

### Android Release Build

```bash
# Generate signed APK
cd android
./gradlew assembleRelease

# Or generate AAB for Play Store
./gradlew bundleRelease
```

### Server Deployment

```bash
# Deploy to Heroku
git add .
git commit -m "Deploy chat server"
git push heroku main

# Or deploy to AWS/Google Cloud
```

## Security Considerations

1. **Authentication**
   - JWT token validation
   - Secure password storage
   - Rate limiting on auth endpoints

2. **Data Security**
   - Firestore security rules
   - Input validation
   - XSS prevention

3. **Socket Security**
   - Authentication middleware
   - Room access validation
   - Message sanitization

## Performance Optimization

1. **Client-side**
   - Message pagination
   - Image lazy loading
   - Component memoization

2. **Server-side**
   - Database indexing
   - Caching strategies
   - Load balancing

3. **Network**
   - Message compression
   - Connection pooling
   - CDN for static assets

This architecture provides a scalable, maintainable, and production-ready foundation for your Android chat application.
