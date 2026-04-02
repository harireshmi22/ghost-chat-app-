import { View, Text, Button, StyleSheet } from 'react-native';

export default function ChatScreen({ navigation, route }) {

  const { username } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat Screen</Text>
      <Text>Welcome {username}</Text>

      <Button 
        title="Go Back" 
        onPress={() => navigation.goBack()} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    marginBottom: 10
  }
});