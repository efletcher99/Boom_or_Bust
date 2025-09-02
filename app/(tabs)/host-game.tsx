import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NetworkInfo } from "react-native-network-info";
import { getSocket, initSocket } from "../../services/socket-service";

//const socket = io("http://192.168.40.53:3001");

type Player = { id: string; nickname: string };

export default function HostGameScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ gameId?: string }>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameId, setGameId] = useState("");
  const [hostIp, setHostIp] = useState<string | null>(null);

  useEffect(() => {
    const id = params.gameId || Math.floor(100000 + Math.random() * 900000).toString();
    setGameId(id);

    NetworkInfo.getIPV4Address().then((ip) => {
      if (!ip) {
        console.error("Could not get host IP");
        return;
      }

      console.log("Host IP:", ip);

      const socket = initSocket(ip); // ip is now guaranteed to be a string
      socket.emit("createGame", { gameId: id });

      socket.on("playersUpdate", setPlayers);
      socket.on("gameStarted", () => router.push(`/game?gameId=${id}`));
    });

    return () => {
      const socket = getSocket();
      socket?.off("playersUpdate");
      socket?.off("gameStarted");
      socket?.disconnect();
    };
  }, []);

  const handleStartGame = () => {
    getSocket()?.emit("startGame", gameId);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
      keyboardVerticalOffset={Platform.select({ ios: 60, android: 0 })}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.gameIdHeader}>Game ID:</Text>
      <Text style={styles.gameIdText}>{gameId}</Text>

      <View style={styles.playersContainer}>
        <Text style={styles.playersTitle}>Players Joined:</Text>
        <FlatList
          data={players}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Text style={styles.playerName}>{item.nickname}</Text>}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.startButton, players.length === 0 && styles.startButtonDisabled]}
          onPress={handleStartGame}
          disabled={players.length === 0}
        >
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#87CEEB", 
    paddingHorizontal: 20 
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
  gameIdHeader: { 
    fontSize: 32, 
    fontWeight: "bold", 
    color: "white", 
    marginTop: 150, 
    textAlign: "center", 
    fontFamily: "8-bit", 
    marginBottom: 10, 
  },
  gameIdText: { 
    fontSize: 32, 
    fontFamily: "8-bit",  
    width: 250, 
    alignSelf: "center", 
    textAlign: "center", 
    color: "white", 
    padding: 12, 
    backgroundColor: "#C28B51", 
    borderWidth: 4, 
    borderColor: "black", 
    borderRadius: 0, 
    shadowColor: "black", 
    shadowOffset: { width: 4, height: 4 }, 
    shadowOpacity: 1, 
    shadowRadius: 0, 
    elevation: 4  
  },
  playersContainer: { 
    marginTop: 40, 
    flex: 1 
  },
  playersTitle: { 
    fontSize: 32, 
    fontWeight: "bold", 
    color: "white", 
    marginBottom: 10, 
    fontFamily: "8-bit", 
    marginTop: 20 
  },
  playerName: { 
    fontSize: 32, 
    fontWeight: "bold", 
    color: "white", 
    fontFamily: "8-bit"  
  },
  buttonContainer: { 
    marginBottom: 120, //lower once the nav bar is gone
    alignItems: "center" 
  },
  startButton: { 
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
  startButtonDisabled: { 
    backgroundColor: "#a0a0a0" 
  },
  startButtonText: { 
    color: "white", 
    fontSize: 28, 
    fontWeight: "bold", fontFamily: "8-bit" 
  },
});
