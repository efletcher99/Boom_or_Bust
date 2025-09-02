import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {

  const router = useRouter();

  const startGame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    console.log("Start Game pressed");
    router.push('/host-game') //relpace with '/configure-game' when configurations are implemented
    //router.push('/configure-game')
    // Logic to start a game can be added here
  };

  const joinGame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); 
    console.log("Join Game pressed");
    router.push('/join-game');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Boom or Bust</Text>
      </View>

      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.button} onPress={startGame}>
          <Text style={styles.buttonText}>Host</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={joinGame}>
          <Text style={styles.buttonText}>Join</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', 
  },
  header: {
    alignItems: 'center',
    paddingTop: 150, 
  },
  headerText: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: '8-bit',
    color: 'white',
  },
  buttonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#C28B51', 
    paddingVertical: 12,
    marginVertical: 10,
    width: 250,
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'black',
    borderRadius: 0,    
    shadowColor: 'black',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4, 
  },
  buttonText: {
    color: 'white',
    fontSize: 32,
    fontFamily: '8-bit',
    fontWeight: 'bold'
  },
});
