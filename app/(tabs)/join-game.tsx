import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { getSocket } from "../../services/socket-service";

export default function JoinGameScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [gameId, setGameId] = useState("");
  const socket = getSocket();

  const isFormValid = nickname.trim() && gameId.trim();

  const handleJoin = () => {
    socket?.emit("joinGame", { nickname, gameId });
  };

  useEffect(() => {
  if (!socket) return; // wait for socket to be ready

  const handleJoinSuccess = () => {
    router.push(`/waiting-room?gameId=${gameId}&nickname=${nickname}`);
  };

  socket.on("joinSuccess", handleJoinSuccess);

  return () => {
    socket.off("joinSuccess", handleJoinSuccess);
  };
}, [gameId, socket]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.formContainer}
        behavior={Platform.select({ ios: "padding", android: undefined })}
        keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })}
      >

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>

        <View style={styles.form}>
          <Text style={styles.label}>Nickname</Text>
          <TextInput style={styles.input} value={nickname} onChangeText={setNickname} autoCapitalize="none" autoCorrect={false} />
          <Text style={styles.label}>Game ID</Text>
          <TextInput style={styles.input} value={gameId} onChangeText={setGameId} autoCapitalize="none" autoCorrect={false} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.joinButton, !isFormValid && styles.joinButtonDisabled]}
            onPress={handleJoin}
            disabled={!isFormValid}
          >
            <Text style={styles.joinButtonText}>Join</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  formContainer: { 
    flex: 1, 
    justifyContent: "center", 
    paddingHorizontal: 20, 
    backgroundColor: "#87CEEB" 
  },
  backButton: { 
    position: "absolute", 
    top: 60, 
    left: 20, 
    padding: 12, 
    backgroundColor: "#C28B51", 
    borderWidth: 4, 
    borderColor: "black", 
    borderRadius: 0, 
    shadowColor: "black", 
    shadowOffset: { width: 3, height: 3 }, 
    shadowOpacity: 1, 
    shadowRadius: 0, 
    elevation: 4 
  },
  backButtonText: { 
    color: "white", 
    fontSize: 24, 
    fontWeight: "bold", 
    fontFamily: "8-bit" 
  },
  form: { 
    alignItems: "center" 
  },
  label: { 
    fontSize: 32, 
    marginBottom: 8, 
    fontWeight: "bold", 
    color: "white", 
    textAlign: "center", 
    width: "100%", 
    fontFamily: "8-bit" 
  },
  input: { 
    backgroundColor: "#C28B51", 
    padding: 12, 
    marginBottom: 20, 
    fontSize: 32, 
    color: "white", 
    width: 250, 
    textAlign: "center", 
    fontFamily: "8-bit", 
    borderWidth: 4, 
    borderColor: "black", 
    borderRadius: 0, 
    shadowColor: "black", 
    shadowOffset: { width: 4, height: 4 }, 
    shadowOpacity: 1, 
    shadowRadius: 0, 
    elevation: 4 
  },
  buttonContainer: { 
    position: "absolute",
    alignItems: "center",
    marginBottom: 20, 
    justifyContent: "flex-end",
    bottom: 120, //lower once the nav bar is gone
    alignSelf: "center", 
  },
  joinButton: { 
    backgroundColor: "#C28B51", 
    paddingVertical: 16, 
    alignItems: "center", 
    width: 200, 
    borderWidth: 4, 
    borderColor: "black", 
    borderRadius: 0, 
    shadowColor: "black", 
    shadowOffset: { width: 4, height: 4 }, 
    shadowOpacity: 1, 
    shadowRadius: 0, 
    elevation: 4 
  },
  joinButtonDisabled: { 
    backgroundColor: "#a0a0a0" 
  },
  joinButtonText: { 
    color: "white", 
    fontSize: 28, 
    fontWeight: "bold", 
    fontFamily: "8-bit" 
  },
});
