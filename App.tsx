import React, { useEffect } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RNBootSplash from 'react-native-bootsplash';
import Toast from 'react-native-toast-message';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import UpdateProfileScreen from './src/screens/profile/UpdateProfileScreen';
import NotificationsScreen from "./src/screens/notifications/NotificationsScreen";

import CustomerStack from './src/navigation/CustomerStack';
import TechnicianStack from './src/navigation/TechnicianStack';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { setLogoutFunction } from "./src/api/api";
import { NotificationProvider } from "./src/context/NotificationContext";
import { useNotificationListener, requestUserPermission } from "./PushNotificationService";
import AppDrawer from "./src/navigation/AppDrawer"

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  CustomerStack: undefined;
  TechnicianStack: undefined;
  UpdateProfile: undefined;
  NotificationsScreen: undefined;
  AppDrawer: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// ---------------- Auth Setup ----------------
const SetupAuth = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  useEffect(() => {
    setLogoutFunction(logout);
  }, [logout]);
  return <>{children}</>;
};

// ---------------- Notification Setup ----------------
const SetupNotifications = ({ children }: { children: React.ReactNode }) => {
  requestUserPermission();
  useNotificationListener();
  return <>{children}</>;
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <SetupAuth>
          <SetupNotifications>
            <StatusBar backgroundColor="#4c669f" barStyle="light-content" />
            <NavigationContainer onReady={() => RNBootSplash.hide({ fade: true })}>
              <MainNavigator />
            </NavigationContainer>
            <Toast position="top" topOffset={60} />
          </SetupNotifications>
        </SetupAuth>
      </NotificationProvider>
    </AuthProvider>
  );
}

// ---------------- Main Navigator ----------------
function MainNavigator() {
  const { userToken, isCheckingAuth, user } = useAuth(); // ✅ get user role here
  console.log(user)
  if (isCheckingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!userToken ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        <>
          {/* Role-based stacks
          {user?.role === "customer" ? (
            <Stack.Screen name="CustomerStack" component={CustomerStack} />
          ) : (
            <Stack.Screen name="TechnicianStack" component={TechnicianStack} />
          )} */}
          <Stack.Screen name="AppDrawer" component={AppDrawer} />

          {/* Common screens */}
          <Stack.Screen
            name="UpdateProfile"
            component={UpdateProfileScreen}
            options={({ navigation }) => ({
              title: "Update Profile",
              headerShown: true,
              headerLeft: () => (
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color="#fff"
                  style={{ marginRight: 8 }}
                  onPress={() => navigation.goBack()}
                />
              ),
              headerTitleStyle: {
                color: "#fff",   // 👈 white text
              },
              headerTintColor: "#fff",
              headerStyle: {
                backgroundColor: "#4c669f", // solid color (use LinearGradient for fancy bg)
              },
            })}
          />
          <Stack.Screen name="NotificationsScreen" component={NotificationsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
