import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import HomeScreen from './src/screens/HomeScreens';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const Stack = createNativeStackNavigator();

function LoadingScreen() {
  return (
    <View style={loadingStyles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={loadingStyles.logo}
      >
        <Text style={loadingStyles.logoText}>S</Text>
      </LinearGradient>
      <Text style={loadingStyles.brandText}>SPECTRAL</Text>
      <ActivityIndicator size="small" color="#667eea" style={{ marginTop: 24 }} />
    </View>
  );
}

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
  },
  brandText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#e0e0ff',
    letterSpacing: 6,
  },
});

function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: '#0a0a1a' },
        }}
      >
        {user ? (
          // User is logged in — show main app
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        ) : (
          // User is not logged in — show auth screens
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ animation: 'fade' }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ animation: 'slide_from_right' }}
            />
          </>
        )}
      </Stack.Navigator>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
