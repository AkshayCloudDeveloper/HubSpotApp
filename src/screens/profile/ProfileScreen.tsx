import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import api from "../../api/api";
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  console.log(user)
  const navigation = useNavigation();

  const fetchUser = async () => {
    try {
      const res = await api.get("/me");

      setUser(res.data);
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Session Logout',
      });
      console.error("Failed to fetch user details", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUser();
  }, []);

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {user ? (
        <View style={styles.card}>
          <Text style={styles.title}>👤 Profile</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{user.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{user.phone || "N/A"}</Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("UpdateProfile" as never)}
          >
            <Text style={styles.buttonText}>Update Details</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.text}>No user data found</Text>
      )}

      {/* Technician Card */}
      {/* {user?.role === "technician" && user.technician && ( */}
        <View style={styles.card}>
          <Text style={styles.title}>Technician Details</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Technician ID:</Text>
            <Text style={styles.value}></Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Territory:</Text>
            <Text style={styles.value}></Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Skills:</Text>
            <Text style={styles.value}>
             
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Availability:</Text>
            <Text style={styles.value}>
              
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Operating Hours:</Text>
            <Text style={styles.value}>
              
            </Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("UpdateTechnician" as never)}
          >
            <Text style={styles.buttonText}>Update Technician Details</Text>
          </TouchableOpacity>
        </View>
      {/* )} */}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f6fa",
    padding: 20,
  },
  card: {
    marginTop: "10%",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  label: {
    fontWeight: "600",
    width: 80,
  },
  value: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4c669f",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  text: {
    fontSize: 18,
    color: "#555",
  },
});
