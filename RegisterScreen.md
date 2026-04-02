# Register Screen Implementation

## File: `src/screens/RegisterScreen.js`

```javascript
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const validateForm = () => {
        if (!username.trim()) {
            Alert.alert('Error', 'Please enter a username');
            return false;
        }
        if (!email.trim()) {
            Alert.alert('Error', 'Please enter an email');
            return false;
        }
        if (!password.trim()) {
            Alert.alert('Error', 'Please enter a password');
            return false;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return false;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        
        // Simulate API call
        setTimeout(() => {
            // Add your actual registration logic here
            console.log('Registration attempt:', { username, email, password });
            
            // For demo, navigate to login screen
            Alert.alert('Success', 'Account created successfully!', [
                { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Sign up to get started</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="words"
                        autoCorrect={false}
                    />
                </View>

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

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        autoCapitalize="none}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.linkText}>
                        Already have an account? Sign In
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

## Key Features

- Username, email, password, and confirm password fields
- Form validation with comprehensive error checking
- Password matching validation
- Loading state during registration
- Navigation to login page
- Success feedback with alert
- Clean, modern UI design matching login screen

## Usage

1. Add this screen to your navigation stack
2. Implement actual registration logic
3. Add proper error handling
4. Connect to your backend API
5. Add email verification if needed
