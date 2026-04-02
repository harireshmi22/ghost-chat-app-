# Login Screen Implementation

## File: `src/screens/LoginScreen.js`

```javascript
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            // Add your actual login logic here
            console.log('Login attempt:', { email, password });
            
            // For demo, navigate to chat screen
            navigation.replace('Chat');
            setIsLoading(false);
        }, 1000);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoCapitalize="none"
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.linkText}>
                        Don't have an account? Sign Up
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    form: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputContainer: {
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkButton: {
        alignItems: 'center',
        marginTop: 20,
    },
    linkText: {
        color: '#007AFF',
        fontSize: 14,
    },
});
```

## Key Features:
- Email and password input fields
- Form validation
- Loading state
- Navigation to register page
- Clean, modern UI design
- Error handling with alerts

## Usage:
1. Add this screen to your navigation stack
2. Implement actual authentication logic
3. Add proper error handling
4. Connect to your backend API
