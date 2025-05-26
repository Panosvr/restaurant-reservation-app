import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  Platform,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../config/api";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const token = response.data.token;

      await AsyncStorage.setItem("userToken", token);

      navigation.reset({
        index: 0,
        routes: [{ name: "Main", params: { token } }],
      });
    } catch (err) {
      Alert.alert("❌ Αποτυχία", "Λανθασμένα στοιχεία");
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.overlay}>
            <Text style={styles.title}>🔐 Είσοδος Χρήστη</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              placeholder="Κωδικός"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <View style={styles.buttonContainer}>
              <Button
                title="Σύνδεση"
                onPress={handleLogin}
                color={Platform.OS === "ios" ? "#007AFF" : "#1E90FF"}
              />
            </View>

            <TouchableOpacity
              onPress={() => navigation.navigate("Register")}
              style={{ marginTop: 15 }}
            >
              <Text style={{ textAlign: "center", color: "#007AFF" }}>
                Δεν έχεις λογαριασμό; Κάνε εγγραφή
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: "rgba(255,255,255,0.85)",
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default LoginScreen;
