import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Platform,
} from "react-native";
import api from "../config/api";

const ReservationScreen = ({ route, navigation }) => {
  const { token, restaurant } = route.params;
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [people, setPeople] = useState("");

  const handleReservation = async () => {
    if (!date || !time || !people) {
      return Alert.alert("❗ Συμπλήρωσε όλα τα πεδία");
    }

    try {
      const response = await api.post(
        "/reservations",
        {
          restaurant_id: restaurant.restaurant_id,
          date,
          time,
          people_count: parseInt(people),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert("✅ Επιτυχία", "Η κράτηση καταχωρήθηκε");
      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert(
        "❌ Σφάλμα",
        error.response?.data?.message || "Κάτι πήγε στραβά"
      );
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.overlay}>
          <Text style={styles.title}>🍽 {restaurant.name}</Text>
          <Text style={styles.info}>📍 {restaurant.location}</Text>
          <Text style={styles.info}>{restaurant.description}</Text>

          <TextInput
            style={styles.input}
            placeholder="Ημερομηνία (π.χ. 2025-05-28)"
            value={date}
            onChangeText={setDate}
          />

          <TextInput
            style={styles.input}
            placeholder="Ώρα (π.χ. 20:00)"
            value={time}
            onChangeText={setTime}
          />

          <TextInput
            style={styles.input}
            placeholder="Άτομα"
            value={people}
            onChangeText={setPeople}
            keyboardType="numeric"
          />

          <Button
            title="Κάνε Κράτηση"
            onPress={handleReservation}
            color={Platform.OS === "ios" ? "#007AFF" : undefined}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  overlay: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  info: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
    color: "#666",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
  },
});

export default ReservationScreen;
