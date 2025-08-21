import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';

import CustomerDashboard from '../CustomerDashboard';
import CustomerAppointments from '../CustomerAppointments';
import ServiceRequestScreen from '../ServiceRequestScreen';
import { BellIcon } from '../../../components/BellIcon';
import { useNavigation } from '@react-navigation/native';



const Tab = createBottomTabNavigator();

export default function CustomerBottomTabs() {

  const navigation = useNavigation<any>();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'Dashboard') iconName = 'home-outline';
          if (route.name === 'Appointments') iconName = 'calendar-outline';
          if (route.name === 'ServiceRequest') iconName = 'construct-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerStyle: {
          height: 60, // decrease height (default ~80 on iOS)
          shadowColor: 'transparent', // remove shadow on iOS
          backgroundColor: '#4c669f', // set your desired header color
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()} // 👈 Opens Drawer
            style={{ marginLeft: 12, marginRight: 4 }}
          >
            <Ionicons name="menu" size={24} color="#f6f6f6ff" />
          </TouchableOpacity>
        ),
        headerRight: () => <BellIcon navigation={navigation} />,
      })

      }
    >
      <Tab.Screen name="Dashboard" component={CustomerDashboard} />
      <Tab.Screen name="Appointments" component={CustomerAppointments} />
      <Tab.Screen name="ServiceRequest" component={ServiceRequestScreen} options={{
        title: "Service Request",
        tabBarLabel: "Service Request",
      }} />
    </Tab.Navigator>
  );
}
