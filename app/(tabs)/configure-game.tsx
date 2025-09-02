import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';

export default function JoinGameScreen() {
  const navigation = useNavigation();

  const [nickname, setNickname] = useState('');
  const [gameId, setGameId] = useState('');

  const isFormValid = nickname.trim().length > 0 && gameId.trim().length > 0;

  const handleJoinGame = () => {
    console.log('Joining game with:', { nickname, gameId });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
          style={styles.formContainer}
          behavior={Platform.select({ ios: 'padding', android: undefined })}
          keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })}
        >

        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>


        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.joinButton, !isFormValid && styles.joinButtonDisabled]}
            onPress={handleJoinGame}
            disabled={!isFormValid}
          >
            <Text style={styles.joinButtonText}>Join Game</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#87CEEB', 
    justifyContent: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#87CEEB',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 120, //change to 20 when remove tabs at bottom
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#C28B51',
    paddingVertical: 16,
    alignItems: 'center',
    width: 200,
    borderWidth: 4,
    borderColor: 'black',
    borderRadius: 0,    
    shadowColor: 'black',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,         
  },
  joinButtonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  joinButtonText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: '8-bit', 
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    padding: 12,
    backgroundColor: '#C28B51',
    borderWidth: 4,
    borderColor: 'black',
    borderRadius: 0,
    shadowColor: 'black',
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: '8-bit',
  }
});
