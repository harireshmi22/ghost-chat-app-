import { View, FlatList, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import socket from '../socket';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';

export default function ChatScreen({ route }) {
  const { username } = route.params;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      user: username,
      text: message,
    };

    socket.emit("send_message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isOwn={item.user === username}
          />
        )}
      />

      <ChatInput
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 }
});
