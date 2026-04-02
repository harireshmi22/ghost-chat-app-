import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, Animated, ScrollView } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    const result = await register(username.trim(), email.trim(), password);
    setIsLoading(false);

    if (!result.success) {
      if (result.message.includes('already exists')) {
        Alert.alert(
          'User Exists',
          result.message,
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Go to Login', onPress: () => navigation.navigate('Login') }
          ]
        );
      } else {
        Alert.alert('Registration Failed', result.message);
      }
    }
    // If successful, AuthContext updates and App.js switches to Home
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            {/* Logo / Brand */}
            <View style={styles.brandSection}>
              <LinearGradient
                colors={['#f093fb', '#f5576c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoContainer}
              >
                <FontAwesome name="ghost" size={32} color="#fff" />
              </LinearGradient>
              <Text style={styles.brandName}>SPECTRAL</Text>
              <Text style={styles.brandTagline}>Become a Ghost. Join the echoes.</Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Create Account</Text>
              <Text style={styles.formSubtitle}>Manifest your presence in the void.</Text>

              {/* Username Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <FontAwesome name="user" size={18} color="#f093fb" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="#4444aa"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="words"
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <FontAwesome name="envelope" size={16} color="#f093fb" />
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
                  <FontAwesome name="lock" size={18} color="#f093fb" />
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

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <View style={styles.inputIconContainer}>
                  <FontAwesome name="shield" size={18} color="#f093fb" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm password"
                  placeholderTextColor="#4444aa"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
              </View>

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthBar}>
                    <LinearGradient
                      colors={password.length < 6 ? ['#ff416c', '#ff4b2b'] : password.length < 10 ? ['#fccb90', '#d57eeb'] : ['#43e97b', '#38f9d7']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.strengthFill, { width: `${Math.min(password.length * 10, 100)}%` }]}
                    />
                  </View>
                  <Text style={styles.strengthText}>
                    {password.length < 6 ? 'Weak' : password.length < 10 ? 'Good' : 'Strong'}
                  </Text>
                </View>
              )}

              {/* Register Button */}
              <TouchableOpacity
                onPress={handleRegister}
                activeOpacity={0.8}
                disabled={isLoading}
                style={{ marginTop: 8 }}
              >
                <LinearGradient
                  colors={isLoading ? ['#444', '#555'] : ['#f093fb', '#f5576c']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.registerButton}
                >
                  <Text style={styles.registerButtonText}>
                    {isLoading ? 'Creating...' : 'ENTER THE VOID'}
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

            {/* Login Link */}
            <View style={styles.loginSection}>
              <Text style={styles.loginText}>Already a Ghost? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#f093fb',
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
    marginBottom: 24,
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
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 11,
    color: '#6666aa',
    fontWeight: '600',
    width: 45,
  },
  registerButton: {
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#f093fb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
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
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  loginText: {
    color: '#5555aa',
    fontSize: 14,
    fontWeight: '500',
  },
  loginLink: {
    color: '#f093fb',
    fontSize: 14,
    fontWeight: '700',
  },
});