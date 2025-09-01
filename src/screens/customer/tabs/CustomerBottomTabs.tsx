import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity, Dimensions, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

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
        tabBarIcon: ({ color }) => {
          let iconName = '';

          if (route.name === 'Dashboard') iconName = 'home-outline';
          if (route.name === 'Appointments') iconName = 'calendar-outline';
          if (route.name === 'ServiceRequest') iconName = 'construct-outline';

          return <Ionicons name={iconName} size={RFValue(20)} color={color} />;
        },
        headerStyle: {
          shadowColor: 'transparent',
          backgroundColor: '#4c669f',
        },

        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: RFValue(18),
          textShadowColor: 'rgba(0, 0, 0, 0.5)',
          textShadowOffset: { width: -1, height: 1 },
          textShadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: RFValue(10),
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: RFValue(12), marginRight: RFValue(4) }}
          >
            <Ionicons name="menu" size={RFValue(22)} color="#f6f6f6ff" />
          </TouchableOpacity>
        ),
        headerRight: () => <BellIcon navigation={navigation} />,
      })}
    >
      <Tab.Screen name="Dashboard" component={CustomerDashboard} />
      <Tab.Screen name="Appointments" component={CustomerAppointments} />
      <Tab.Screen
        name="ServiceRequest"
        component={ServiceRequestScreen}
        options={{
          title: "Service Request",
          tabBarLabel: "Service Request",
        }}
      />
    </Tab.Navigator>
  );
}
