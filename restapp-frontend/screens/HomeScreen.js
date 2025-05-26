import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import api from "../config/api";

const HomeScreen = ({ route, navigation }) => {
  const { token } = route.params;
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRestaurants = async () => {
    try {
      const response = await api.get("/restaurants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRestaurants(response.data.restaurants);
    } catch (error) {
      console.error(error);
      Alert.alert("Σφάλμα", "Αποτυχία φόρτωσης εστιατορίων");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() =>
        navigation.navigate("Reservation", {
          token,
          restaurant: item,
        })
      }
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.location}>📍 {item.location}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <Text style={styles.cta}>📝 Κάνε Κράτηση</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={{
        uri: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.overlay}>
          <Text style={styles.title}>📍 Εστιατόρια</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" />
          ) : (
            <FlatList
              data={restaurants}
              keyExtractor={(item) => item.restaurant_id.toString()}
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  item: {
    marginBottom: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  location: {
    fontSize: 14,
    color: "#666",
  },
  description: {
    marginTop: 5,
    fontSize: 14,
    fontStyle: "italic",
  },
  cta: {
    marginTop: 10,
    fontSize: 15,
    color: "#007AFF",
    fontWeight: "bold",
    textAlign: "right",
  },
});

export default HomeScreen;
