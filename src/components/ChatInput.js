import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ChatInput({ message, setMessage, sendMessage }) {
    return (
        <View style={styles.container}>
            <View style={styles.inputRow}>
                <TouchableOpacity style={styles.iconButton}>
                    <Icon name="emoji-emotions" size={22} color="#5555aa" />
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        placeholder="Type a message..."
                        placeholderTextColor="#4444aa"
                        style={styles.input}
                        multiline
                        maxLength={1000}
                    />
                </View>

                <TouchableOpacity style={styles.iconButton}>
                    <Icon name="attach-file" size={22} color="#5555aa" />
                </TouchableOpacity>

                {message.trim() ? (
                    <TouchableOpacity onPress={sendMessage} activeOpacity={0.8}>
                        <LinearGradient
                            colors={['#667eea', '#764ba2']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.sendButton}
                        >
                            <Icon name="send" size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.iconButton}>
                        <Icon name="mic" size={22} color="#5555aa" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 6,
        paddingHorizontal: 4,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: 8,
        marginHorizontal: 2,
    },
    inputContainer: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    input: {
        fontSize: 15,
        color: '#e0e0ff',
        maxHeight: 100,
        textAlignVertical: 'center',
    },
    sendButton: {
        width: 42,
        height: 42,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
});