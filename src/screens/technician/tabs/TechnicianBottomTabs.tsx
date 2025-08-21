import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native';

import TechnicianDashboard from '../TechnicianDashboard';
import TechnicianAppointments from '../TechnicianAppointments';
import WorkOrderDetails from '../WorkOrderDetails';
import { BellIcon } from '../../../components/BellIcon';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default function TechnicianBottomTabs() {
  const navigation = useNavigation<any>();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          height: 60, // decrease height (default ~80 on iOS)
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = '';

          if (route.name === 'Dashboard') iconName = 'speedometer-outline';
          if (route.name === 'Appointments') iconName = 'calendar-outline';
          if (route.name === 'WorkOrders') iconName = 'briefcase-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()} // 👈 Opens Drawer
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="menu" size={28} color="#000" />
          </TouchableOpacity>
        ),
        headerRight: () => <BellIcon navigation={navigation} />,
      })}
    >
      <Tab.Screen name="Dashboard" component={TechnicianDashboard} />
      <Tab.Screen name="Appointments" component={TechnicianAppointments} />
      <Tab.Screen name="WorkOrders" component={WorkOrderDetails} />
    </Tab.Navigator>
  );
}
