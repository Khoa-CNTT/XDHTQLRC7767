import { Camera, CameraView } from "expo-camera";
import { Stack, useRouter } from "expo-router";
import {
  AppState,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Alert,
  Pressable,
  Text,
  View,
} from "react-native";
import { useEffect, useRef } from "react";
import React from "react";

export default function Scanner() {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const router = useRouter();

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const sendDataToServer = async (ticketId) => {
    try {
      const response = await fetch(`http://192.168.15.108:8080/checking/${ticketId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        const result = await response.json();
        console.log(result);
        if (result.used) {
          Alert.alert("Trạng thái vé", "❌ Vé này đã được sử dụng.");
        } else {
          Alert.alert(
            "✅ Ticket is valid",
            `🎟 Booking Code: ${result.bookingCode}\n🎬 Movie: ${result.movieName}\n🕒 Showtime: ${result.showtime}\n💺 Seat(s): ${result.seatNumbers}\n🏢 Theater: ${result.theaterName}\n📧 Email: ${result.email}`
          );
          await fetch(`http://192.168.15.108:8080/update-ticketstatus/${ticketId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
      } else {
        const messages = {
          404: "❗ Ticket ID not found.",
          400: "⚠ Invalid Ticket ID format.",
          500: "🔥 Something went wrong on the server.",
        };
        Alert.alert("Error", messages[response.status] || `Unexpected error: ${response.status}`);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch data from server.");
    }
  };

  return (
    <SafeAreaView style={StyleSheet.absoluteFillObject}>
      <Stack.Screen options={{ title: "Scan QR", headerShown: false }} />
      {Platform.OS === "android" && <StatusBar hidden />}
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => {
          if (!data || qrLock.current) return;

          qrLock.current = true;
          setTimeout(async () => {
            try {
              const jsonData = JSON.parse(data);
              console.log(jsonData);
              await sendDataToServer(jsonData.idTicket);
            } catch {
              Alert.alert("Invalid QR Code", "The scanned QR is not valid JSON");
            }
            setTimeout(() => (qrLock.current = false), 2000);
          }, 500);
        }}
      />
      <View style={styles.backButtonContainer}>
        <Pressable onPress={() => router.push("/")} style={styles.backButton}>
          <Text style={styles.backButtonText}>⬅ Back to Home</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButtonContainer: {
    position: "absolute",
    bottom: 40,
    left: "50%",
    transform: [{ translateX: -75 }],
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "center",
  },
  backButton: {
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
