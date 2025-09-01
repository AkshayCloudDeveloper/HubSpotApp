import React from 'react';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';
import { getFocusedRouteNameFromRoute, RouteProp, useNavigation } from '@react-navigation/native';

import CustomerStack from './CustomerStack';
import TechnicianStack from './TechnicianStack';
import ProfileScreen from '../screens/profile/ProfileScreen';
import CustomDrawerContent from './CustomDrawerContent';
import { useAuth } from '../context/AuthContext';
import { BellIcon } from '../components/BellIcon';


type DrawerParamList = {
  Home: undefined;
  Profile: undefined;
  Customer: undefined;
  TechnicianReports: undefined;
};

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function AppDrawer() {
  const navigation = useNavigation();
  const { user } = useAuth();


  // Decide which stack to render
  const HomeStack = user?.role === 'customer' ? CustomerStack : TechnicianStack;

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props: DrawerContentComponentProps) => (
        <CustomDrawerContent {...props} />
         // 👈 drawer panel bg
      )}
      screenOptions={{
        headerShown: false,
        // headerRight: () => <BellIcon navigation={navigation} />,
        drawerStyle: {
          backgroundColor: "#576ea0ff",  // 👈 drawer panel bg
        },
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#ddd",
      }}
      

    >
      <Drawer.Screen
        name="Home"
        component={HomeStack} />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerTitle: 'Profile', headerShown: true, headerStyle: {
            backgroundColor: "#4c669f", // solid color (use LinearGradient for fancy bg)
          },
          headerTitleStyle: {
            color: "#fff",   // 👈 white text
          },
          headerTintColor: "#fff",
        }}
      />
      {/* Add this screen only for admin users */}
      {user?.role === 'customer' && (
        <Drawer.Screen
          name="Customer"
          component={ProfileScreen}
          options={{ headerTitle: 'Admin Panel' }}
        />
      )}

      {/* Add more role-based screens
      {user?.role === 'technician' && (
        <Drawer.Screen
          name="TechnicianReports"
          component={() => <></>} // replace with actual screen
          options={{ headerTitle: 'Technician Reports' }}
        />
      )} */}
    </Drawer.Navigator>
  );
}
