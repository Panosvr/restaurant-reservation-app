import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import MyReservationsScreen from "../screens/MyReservationsScreen";
import { View, Button, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createBottomTabNavigator();

const LogoutScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 40 }}>
      <Button
        title="🚪 Αποσύνδεση"
        onPress={async () => {
          await AsyncStorage.removeItem("userToken");
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }}
        color={Platform.OS === "ios" ? "#FF3B30" : "#D32F2F"}
      />
    </View>
  );
};

const BottomTabs = ({ route }) => {
  const { token } = route.params;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#999",
        tabBarLabelStyle: {
          fontSize: 14,
        },
      }}
    >
      <Tab.Screen
        name="Αρχική"
        component={HomeScreen}
        initialParams={{ token }}
        options={{
          tabBarLabel: "🏠 Αρχική",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Κρατήσεις μου"
        component={MyReservationsScreen}
        initialParams={{ token }}
        options={{
          tabBarLabel: "📄 Κρατήσεις μου",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Αποσύνδεση"
        component={LogoutScreen}
        options={{
          tabBarLabel: "🚪 Αποσύνδεση",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="log-out" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
