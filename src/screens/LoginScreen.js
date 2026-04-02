import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setIsLoading(true);
    const result = await login(email.trim(), password);
    setIsLoading(false);

    if (!result.success) {
      Alert.alert('Login Failed', result.message);
    }
    // If successful, the AuthContext will update and App.js will switch to Home
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Logo / Brand */}
          <View style={styles.brandSection}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoContainer}
            >
              <FontAwesome name="comments" size={32} color="#fff" />
            </LinearGradient>
            <Text style={styles.brandName}>SPECTRAL</Text>
            <Text style={styles.brandTagline}>Welcome back, Ghost.</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Sign In</Text>
            <Text style={styles.formSubtitle}>Enter the void. Resume your echoes.</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <FontAwesome name="envelope" size={16} color="#667eea" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Email address"
                placeholderTextColor="#4444aa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.inputIconContainer}>
                <FontAwesome name="lock" size={18} color="#667eea" />
              </View>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#4444aa"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <FontAwesome
                  name={showPassword ? "eye" : "eye-slash"}
                  size={16}
                  color="#5555aa"
                />
              </TouchableOpacity>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotButton}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <LinearGradient
                colors={isLoading ? ['#444', '#555'] : ['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginButton}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? 'Signing In...' : 'MANIFEST PRESENCE'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login */}
            <View style={styles.socialRow}>
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome name="google" size={20} color="#ea4335" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome name="github" size={20} color="#e0e0ff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <FontAwesome name="apple" size={20} color="#e0e0ff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Link */}
          <View style={styles.registerSection}>
            <Text style={styles.registerText}>New to the void? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  brandName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#e0e0ff',
    letterSpacing: 6,
    marginBottom: 6,
  },
  brandTagline: {
    fontSize: 14,
    color: '#5555aa',
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    padding: 28,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e4e4f0',
    marginBottom: 4,
  },
  formSubtitle: {
    fontSize: 13,
    color: '#5555aa',
    marginBottom: 28,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  inputIconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 52,
    fontSize: 15,
    color: '#e0e0ff',
    paddingRight: 12,
  },
  eyeButton: {
    padding: 12,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    fontSize: 13,
    color: '#667eea',
    fontWeight: '500',
  },
  loginButton: {
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  dividerText: {
    color: '#4444aa',
    marginHorizontal: 16,
    fontSize: 12,
    fontWeight: '600',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  registerText: {
    color: '#5555aa',
    fontSize: 14,
    fontWeight: '500',
  },
  registerLink: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '700',
  },
});