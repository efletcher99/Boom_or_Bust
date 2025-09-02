// JoinerWaitingRoom.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getSocket } from "../../services/socket-service";

type Player = { id: string; nickname: string };

export default function WaitingRoom({ gameId }: { gameId: string }) {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [dotCount, setDotCount] = useState(0);

  const socket = getSocket();

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!socket) {
      console.warn("No socket found in WaitingRoom");
      return;
    }

    socket.on("playersUpdate", (updatedPlayers: Player[]) => {
      console.log("playersUpdate received:", updatedPlayers);
      setPlayers(updatedPlayers);
    });

    socket.on("gameStarted", () => {
      console.log("Game started, navigating to game screen");
      router.push(`/game?gameId=${gameId}`);
    });

    return () => {
      socket.off("playersUpdate");
      socket.off("gameStarted");
    };
  }, [socket]);

  const dots = ".".repeat(dotCount).padEnd(3, " ");

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title} numberOfLines={2}>
        Waiting for host to start the game{dots}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#87CEEB", padding: 20 },
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
    elevation: 4,
  },
  backButtonText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "8-bit",
  },
  title: {
    fontSize: 28,
    color: "white",
    fontWeight: "bold",
    marginTop: 140,
    marginBottom: 20,
    width: "100%",
    textAlign: "center",
    fontFamily: "8-bit",
    lineHeight: 40,
  },
});
