import { View, FlatList, StyleSheet, Text, KeyboardAvoidingView, Platform, TouchableOpacity, SafeAreaView, StatusBar } from "react-native";
import { useEffect, useState, useRef } from 'react';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';

const AVATAR_GRADIENTS = [
  ['#667eea', '#764ba2'],
  ['#f093fb', '#f5576c'],
  ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'],
  ['#fa709a', '#fee140'],
  ['#a18cd1', '#fbc2eb'],
  ['#fccb90', '#d57eeb'],
];

export default function ChatScreen({ navigation, route }) {
    const { user, currentUser } = route.params;
    const gradientColors = AVATAR_GRADIENTS[user.gradientIndex % AVATAR_GRADIENTS.length] || AVATAR_GRADIENTS[0];

    const [messages, setMessages] = useState([
        { id: '1', user: user.name, text: 'Hello 👋', time: '10:30 AM', isOwn: false },
        { id: '2', user: currentUser, text: 'Hi there!', time: '10:31 AM', isOwn: true },
        { id: '3', user: user.name, text: 'How are you doing?', time: '10:32 AM', isOwn: false },
        { id: '4', user: currentUser, text: 'Great! Working on a WhatsApp clone', time: '10:33 AM', isOwn: true },
        { id: '5', user: user.name, text: 'That sounds awesome! 😊', time: '10:34 AM', isOwn: false },
    ]);
    const [message, setMessage] = useState('');
    const flatListRef = useRef(null);

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const sendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                id: Date.now().toString(),
                user: currentUser,
                text: message.trim(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: true,
            };
            setMessages(prev => [...prev, newMessage]);
            setMessage('');

            setTimeout(() => {
                const replyMessage = {
                    id: (Date.now() + 1).toString(),
                    user: user.name,
                    text: getRandomReply(),
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isOwn: false,
                };
                setMessages(prev => [...prev, replyMessage]);
            }, 1000);
        }
    };

    const getRandomReply = () => {
        const replies = [
            "That's interesting! Tell me more.",
            "I see what you mean.",
            "Absolutely! 🎉",
            "Sounds good to me!",
            "Thanks for sharing!",
            "That makes sense.",
            "Cool! 👍",
            "I agree with you."
        ];
        return replies[Math.floor(Math.random() * replies.length)];
    };

    const renderMessage = ({ item }) => (
        <MessageBubble
            message={item}
            isOwn={item.isOwn}
        />
    );

    useEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0a0a1a" />

            {/* Custom Header */}
            <LinearGradient
                colors={['#1a1a2e', '#16213e', '#0f3460']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
                    <Icon name="arrow-back" size={22} color="#e0e0ff" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.headerCenter}
                    onPress={() => navigation.navigate("Profile")}
                >
                    <LinearGradient
                        colors={gradientColors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.headerAvatar}
                    >
                        <Text style={styles.headerAvatarText}>{user.avatar}</Text>
                    </LinearGradient>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerName}>{user.name}</Text>
                        <Text style={styles.headerStatus}>
                            {user.isOnline ? '● Online' : user.lastSeen}
                        </Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.headerRightIcons}>
                    <TouchableOpacity style={styles.headerIconBtn}>
                        <Icon name="videocam" size={22} color="#e0e0ff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIconBtn}>
                        <Icon name="call" size={20} color="#e0e0ff" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <KeyboardAvoidingView
                style={styles.chatArea}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    style={styles.messagesList}
                    contentContainerStyle={styles.messagesContainer}
                    showsVerticalScrollIndicator={false}
                />

                <View style={styles.inputContainer}>
                    <ChatInput
                        message={message}
                        setMessage={setMessage}
                        sendMessage={sendMessage}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a1a',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerButton: {
        width: 38,
        height: 38,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    headerCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 12,
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerAvatarText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    headerInfo: {
        marginLeft: 12,
    },
    headerName: {
        color: '#ffffff',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    headerStatus: {
        fontSize: 12,
        fontWeight: '500',
        marginTop: 1,
        color: '#4ade80',
    },
    headerRightIcons: {
        flexDirection: 'row',
        gap: 8,
    },
    headerIconBtn: {
        width: 38,
        height: 38,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    chatArea: {
        flex: 1,
    },
    messagesList: {
        flex: 1,
    },
    messagesContainer: {
        padding: 16,
        paddingBottom: 8,
    },
    inputContainer: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.04)',
        paddingHorizontal: 8,
        paddingBottom: 8,
        paddingTop: 4,
        backgroundColor: '#0d0d20',
    },
});