import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Link, Stack } from "expo-router";
import React from "react";
import { useCameraPermissions } from "expo-camera";

export default function Home() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Overview", headerShown: false }} />
      <Text style={styles.title}>🎟️ Cinema Ticket Scanner 🎥</Text>
      <View style={styles.buttonContainer}>
        <Pressable onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Request Permissions</Text>
        </Pressable>
        <Link href={"/scanner"} asChild>
          <Pressable disabled={!isPermissionGranted} style={[styles.button, !isPermissionGranted && styles.disabledButton]}>
            <Text style={styles.buttonText}>Scan Ticket</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    justifyContent: "space-around",
    paddingVertical: 80,
  },
  title: {
    color: "#FF3B30",
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    gap: 20,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  disabledButton: {
    backgroundColor: "#8B0000",
    opacity: 0.6,
  },
});
