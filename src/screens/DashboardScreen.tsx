// src/screens/DashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardScreen = ({ navigation }: any) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem('authToken');
      setToken(savedToken);
    };

    loadToken();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container} >
      <Text style={styles.title}>Welcome to the Dashboard!</Text>
      <Text style={styles.token}>Token: {token}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  token: { fontSize: 12, color: '#555', marginBottom: 20, textAlign: 'center' },
});
