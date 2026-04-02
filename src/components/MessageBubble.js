import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function MessageBubble({ message, isOwn }) {
  return (
    <View style={[styles.messageContainer, isOwn && styles.ownMessageContainer]}>
      {isOwn ? (
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.bubble, styles.ownBubble]}
        >
          <Text style={[styles.messageText, styles.ownMessageText]}>
            {message.text}
          </Text>
          <View style={[styles.timeContainer, styles.ownTimeContainer]}>
            <Text style={[styles.timeText, styles.ownTimeText]}>
              {message.time}
            </Text>
            <Text style={styles.checkmarks}>
              {message.read ? '✓✓' : '✓'}
            </Text>
          </View>
        </LinearGradient>
      ) : (
        <View style={[styles.bubble, styles.otherBubble]}>
          <Text style={styles.messageText}>
            {message.text}
          </Text>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>
              {message.time}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    marginVertical: 3,
    flexDirection: 'row',
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '78%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  ownBubble: {
    borderBottomRightRadius: 6,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  otherBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  messageText: {
    fontSize: 15,
    color: '#c8c8e0',
    lineHeight: 21,
  },
  ownMessageText: {
    color: '#ffffff',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ownTimeContainer: {
    justifyContent: 'flex-end',
  },
  timeText: {
    fontSize: 11,
    color: '#5555aa',
  },
  ownTimeText: {
    color: 'rgba(255, 255, 255, 0.65)',
  },
  checkmarks: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.65)',
    marginLeft: 4,
  },
});