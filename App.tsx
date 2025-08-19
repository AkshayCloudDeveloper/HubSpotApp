import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RNBootSplash from 'react-native-bootsplash';
import Toast from 'react-native-toast-message';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import AppDrawer from './src/navigation/AppDrawer';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { setLogoutFunction } from "./src/api/api";
import UpdateProfileScreen from './src/screens/UpdateProfileScreen';
import { StatusBar } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { requestUserPermission, listenForNotifications } from './PushNotificationService';
import { NotificationProvider } from "./src/context/NotificationContext";



export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  AppDrawer: undefined;
  UpdateProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const SetupAuth = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();

  React.useEffect(() => {
    setLogoutFunction(logout); // 👈 link API → AuthContext
  }, [logout]);

  return <>{children}</>;
};

export default function App() {

  useEffect(() => {
    requestUserPermission();
    listenForNotifications();
  }, []);

  return (
    <AuthProvider>
      <NotificationProvider>
        <SetupAuth>
          <StatusBar backgroundColor="#2f76e1ff" barStyle="light-content" />
          <NavigationContainer onReady={() => RNBootSplash.hide({ fade: true })}>
            <MainNavigator />
          </NavigationContainer>
          <Toast position="top" topOffset={60} />
        </SetupAuth>
      </NotificationProvider>
    </AuthProvider>
  );
}

function MainNavigator() {
  const { userToken, isCheckingAuth } = useAuth(); // get from context

  if (isCheckingAuth) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken ? (
        <>
          <Stack.Screen name="AppDrawer" component={AppDrawer}  />
          <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} options={({ navigation }) => ({
            title: " Update Profile",
            headerShown: true,  // 👈 re-enable header
            headerLeft: () => (
              <Ionicons
                name="arrow-back"
                size={24}
                color="#030000ff"
                onPress={() => navigation.goBack()}
              />
            ),
            headerStyle: { backgroundColor: "#ffffffff" },
            headerTintColor: "#030000ff",
          })} />
        </>

      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
