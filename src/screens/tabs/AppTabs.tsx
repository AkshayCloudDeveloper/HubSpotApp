import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../HomeScreen';
import MenuScreen from '../MenuScreen';
import DashboardScreen from '../DashboardScreen';
import SettingsScreen from '../SettingsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  const navigation = useNavigation();
  const headerLeft = () => (
    <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ marginLeft: 15 }}>
      <Ionicons name="menu-outline" size={26} color="#000" />
    </TouchableOpacity>
  );
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // headerLeft,
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons: Record<string, string> = {
            Main: 'home-outline',
            Menu: 'restaurant-outline',
            Dashboard: 'speedometer-outline',
            Settings: 'settings-outline',
          };

          return (
            <Ionicons
              name={icons[route.name] || 'help-circle-outline'}
              size={size}
              color={color}
            />
          );

        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Main" component={HomeScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );

};

export default AppTabs;
