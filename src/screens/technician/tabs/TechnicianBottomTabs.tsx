import React, { useEffect, useState, useCallback } from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';

import TechnicianDashboard from '../TechnicianDashboard';
import TechnicianAppointments from '../TechnicianAppointments';
import WorkOrderDetails from '../WorkOrderDetails';
import { BellIcon } from '../../../components/BellIcon';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import TwilioVoiceScreen from "../TwilioVoiceScreen";

const Tab = createBottomTabNavigator();

export default function TechnicianBottomTabs() {
  const navigation = useNavigation<any>();
  const [user, setUser] = useState("Technician");

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser); // ✅ parse JSON
        setUser(user.name || "Technician"); // Use user name or default to "Technician"
      } else {
        console.log("No user found in storage");
        return null;
      }
    } catch (error) {
      console.error("Error loading user:", error);
      return null;
    }
  };

  // Usage
  useEffect(() => {
    loadUser();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          shadowColor: 'transparent',
          backgroundColor: '#4c669f',
          borderBottomRightRadius: 20,
        },
        headerTintColor: '#fff',
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'Dashboard') iconName = 'speedometer-outline';
          if (route.name === 'Appointments') iconName = 'calendar-outline';
          if (route.name === 'WorkOrders') iconName = 'briefcase-outline';
          if (route.name === 'TwilioVoiceScreen') iconName = 'call-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()} // 👈 Opens Drawer
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="menu" size={28} color="#f6f6f6ff" />
          </TouchableOpacity>
        ),
        headerRight: () => <BellIcon navigation={navigation} />,
      })}
    >
      <Tab.Screen name="Dashboard" component={TechnicianDashboard} options={{
        title: "Hello, " + user, headerTitleStyle: {
          fontStyle: "italic", // italic text
        },
        tabBarLabel: "Dashboard",
      }} />
      <Tab.Screen name="Appointments" component={TechnicianAppointments} />
      <Tab.Screen name="TwilioVoiceScreen" component={TwilioVoiceScreen} />
    </Tab.Navigator>
  );
}
