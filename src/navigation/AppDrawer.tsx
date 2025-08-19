import React, { useState, useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AppTabs from '../screens/AppTabs'; // 👈 include tabs here
import ProfileScreen from '../screens/ProfileScreen';
import CustomDrawerContent from "./CustomDrawerContent";
import { useAuth } from '../context/AuthContext';
import { BellIcon } from "../components/BellIcon";
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';


const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  const { setUserToken } = useAuth();
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} setUserToken={setUserToken} />} // 👈 use custom drawer
    >
      <Drawer.Screen name="Home" component={AppTabs} options={({ route, navigation }) => {
        // detect current tab name
        const routeName = getFocusedRouteNameFromRoute(route) ?? "Main";

        return {
          headerTitle: routeName, // 👈 Show current tab name in header
          headerRight: () => <BellIcon navigation={navigation} />,
        };
      }} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
};

