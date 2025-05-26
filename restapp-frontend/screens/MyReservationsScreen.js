import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import api from "../config/api";

const MyReservationsScreen = ({ route, navigation }) => {
  const { token } = route.params;
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const response = await api.get("/reservations/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReservations(response.data.reservations);
    } catch (error) {
      console.error(error);
      Alert.alert("Σφάλμα", "Αποτυχία φόρτωσης κρατήσεων");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reservationId) => {
    const confirmDelete =
      Platform.OS === "web"
        ? window.confirm("Θέλεις να διαγράψεις αυτήν την κράτηση;")
        : true;

    if (!confirmDelete) return;

    try {
      await api.delete(`/reservations/${reservationId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setReservations((prev) =>
        prev.filter((r) => r.reservation_id !== reservationId)
      );
    } catch (error) {
      console.error(error);
      Alert.alert("Σφάλμα", "Δεν διαγράφηκε η κράτηση");
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.date}>
        📅 {new Date(item.date).toLocaleDateString("el-GR")}
      </Text>
      <Text style={styles.time}>⏰ {item.time}</Text>
      <Text style={styles.people}>👥 {item.people_count} άτομα</Text>
      <Text style={styles.restaurant}>🍽 {item.restaurant_name}</Text>
      <Text style={styles.location}>📍 {item.location}</Text>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() =>
          navigation.navigate("EditReservation", {
            token,
            reservation: item,
          })
        }
      >
        <Text style={styles.editButtonText}>✏️ Επεξεργασία</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.reservation_id)}
      >
        <Text style={styles.deleteButtonText}>🗑 Διαγραφή</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={require("../assets/backround2.webp")}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.overlay}>
          <Text style={styles.title}>📄 Οι Κρατήσεις μου</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : reservations.length === 0 ? (
            <Text style={styles.noReservations}>Δεν υπάρχουν κρατήσεις.</Text>
          ) : (
            <FlatList
              data={reservations}
              keyExtractor={(item) =>
                `${item.reservation_id}-${item.date}-${item.time}`
              }
              renderItem={renderItem}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
      </ScrollView>
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
    padding: 20,
  },
  overlay: {
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  noReservations: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginTop: 10,
  },
  item: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  date: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#222",
  },
  time: {
    fontSize: 14,
    color: "#444",
  },
  people: {
    fontSize: 14,
    marginTop: 5,
  },
  restaurant: {
    fontSize: 14,
    marginTop: 5,
  },
  location: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#666",
  },
  editButton: {
    marginTop: 10,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 6,
  },
  editButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#D32F2F",
    padding: 10,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default MyReservationsScreen;
