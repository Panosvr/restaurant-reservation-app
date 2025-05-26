import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import ReservationScreen from "../screens/ReservationScreen";
import BottomTabs from "./BottomTabs";
import LoadingScreen from "../screens/LoadingScreen";
import EditReservationScreen from "../screens/EditReservationScreen";
import RegisterScreen from "../screens/RegisterScreen";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        {/* 1. Έλεγχος για token */}
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{ headerShown: false }}
        />

        {/* 2. Είσοδος χρήστη */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        {/* 3. Κύριες καρτέλες */}
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />

        {/* 4. Κράτηση */}
        <Stack.Screen
          name="Reservation"
          component={ReservationScreen}
          options={{ title: "Κράτηση" }}
        />
        <Stack.Screen
          name="EditReservation"
          component={EditReservationScreen}
          options={{ title: "Επεξεργασία Κράτησης" }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;
