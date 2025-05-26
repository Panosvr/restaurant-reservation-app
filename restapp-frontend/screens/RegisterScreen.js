import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  Alert,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../config/api";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      return Alert.alert("❗ Συμπλήρωσε όλα τα πεδία");
    }

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      const token = response.data.token;
      await AsyncStorage.setItem("userToken", token);

      navigation.reset({
        index: 0,
        routes: [{ name: "Main", params: { token } }],
      });
    } catch (err) {
      Alert.alert(
        "❌ Σφάλμα",
        err.response?.data?.message || "Αποτυχία εγγραφής"
      );
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33",
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
            <Text style={styles.title}>📝 Εγγραφή Χρήστη</Text>

            <TextInput
              style={styles.input}
              placeholder="Όνομα"
              placeholderTextColor="#999"
              value={name}
              onChangeText={setName}
            />

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
                title="Εγγραφή"
                onPress={handleRegister}
                color={Platform.OS === "ios" ? "#007AFF" : "#1E90FF"}
              />
            </View>

            <TouchableOpacity
              onPress={() => navigation.replace("Login")}
              style={{ marginTop: 15 }}
            >
              <Text style={{ textAlign: "center", color: "#007AFF" }}>
                Έχεις ήδη λογαριασμό; Σύνδεση
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

export default RegisterScreen;
