import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log('Error checking login status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username, email, password) => {
    try {
      // Check if user already exists
      const existingUsers = await AsyncStorage.getItem('registeredUsers');
      const users = existingUsers ? JSON.parse(existingUsers) : [];

      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return { success: false, message: 'User already exists. Please login.' };
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        username,
        email: email.toLowerCase(),
        password, // In real app, hash this!
        avatar: username.charAt(0).toUpperCase(),
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      await AsyncStorage.setItem('registeredUsers', JSON.stringify(users));

      // Auto-login after register
      const userData = { id: newUser.id, username: newUser.username, email: newUser.email, avatar: newUser.avatar };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (error) {
      return { success: false, message: 'Registration failed. Please try again.' };
    }
  };

  const login = async (email, password) => {
    try {
      const existingUsers = await AsyncStorage.getItem('registeredUsers');
      const users = existingUsers ? JSON.parse(existingUsers) : [];

      const foundUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!foundUser) {
        return { success: false, message: 'Invalid email or password. Please register first.' };
      }

      const userData = { id: foundUser.id, username: foundUser.username, email: foundUser.email, avatar: foundUser.avatar };
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (error) {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
