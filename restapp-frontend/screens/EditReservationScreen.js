import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  ScrollView,
  ImageBackground,
  Platform,
} from "react-native";
import api from "../config/api";

const EditReservationScreen = ({ route, navigation }) => {
  const { token, reservation } = route.params;
  const [date, setDate] = useState(
    new Date(reservation.date).toISOString().split("T")[0]
  );
  const [time, setTime] = useState(reservation.time);
  const [people, setPeople] = useState(reservation.people_count.toString());

  const handleUpdate = async () => {
    if (!date || !time || !people) {
      return Alert.alert("❗ Συμπλήρωσε όλα τα πεδία");
    }

    console.log(
      "Sending update to:",
      `/reservations/${reservation.reservation_id}`
    );
    console.log("Payload:", {
      date,
      time,
      people_count: parseInt(people),
    });

    try {
      await api.put(
        `/reservations/${reservation.reservation_id}`,
        {
          date,
          time,
          people_count: parseInt(people),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Alert.alert("✅ Επιτυχία", "Η κράτηση ενημερώθηκε");
      navigation.goBack();
    } catch (error) {
      console.error("Update error:", error.response?.data || error.message);
      Alert.alert(
        "❌ Σφάλμα",
        error.response?.data?.message || "Αποτυχία ενημέρωσης"
      );
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.overlay}>
          <Text style={styles.title}>✏️ Επεξεργασία Κράτησης</Text>

          <TextInput
            style={styles.input}
            placeholder="Ημερομηνία (YYYY-MM-DD)"
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
            title="Αποθήκευση Αλλαγών"
            onPress={handleUpdate}
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
    marginBottom: 20,
    textAlign: "center",
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

export default EditReservationScreen;
