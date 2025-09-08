import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import api from "../../api/api";
import { useFocusEffect } from "@react-navigation/native";

type RootStackParamList = {
  CustomerDashboard: undefined;
  CreateWorkOrder: undefined;
  Appointments: undefined;
  ServiceRequest: undefined;
};

type CustomerDashboardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CustomerDashboard'
>;

type WorkOrder = {
  _id: string;
  title: string;
  description?: string;
  status: string;
  priority?: string;
  scheduled_date?: string;
  assigned_technician_id?: number;
  customer_id?: number;
  asset_id?: number;
  notes?: string;
};

type RequestItem = {
  id: string;
  title: string;
  status?: string;
};

const CustomerDashboard = ({ navigation }: { navigation: CustomerDashboardNavigationProp }) => {
  const [count, setCount] = useState("");
  const [orders, setOrders] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchConfirmedCount = async () => {
    try {
      const res = await api.get("/workorders/count/confirmed");
      setCount(res.data.confirmedCount);
    } catch (err) {
      console.error("Error fetching confirmed count", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get("/workorders?status=pending");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching work orders", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchConfirmedCount();
    fetchOrders();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchConfirmedCount();
      fetchOrders();
    }, [])
  );

  const renderRequest = ({ item }: { item: RequestItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardStatus}>{item.status ?? "Pending"}</Text>
      </View>
      <Icon name="wrench" size={32} color="#4F8EF7" />
    </View>
  );

  return (
    <LinearGradient
      colors={["#4c669f", "#415580ff", "#394b7dff"]}
      style={styles.container}
    >
      <Text style={styles.header}>Welcome Back 👋</Text>

      {/* Summary Section */}
      <View style={styles.summaryCard}>

        <Text style={styles.summaryText}>You have {count} upcoming appointments</Text>
        <TouchableOpacity
          style={styles.summaryBtn}
          onPress={() => navigation.navigate("Appointments")}
        >
          <Text style={styles.summaryBtnText}>View</Text>
        </TouchableOpacity>

      </View>

      {/* Recent Requests */}
      <View>
        <Text style={styles.sectionTitle}>Recent Service Requests</Text>

        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id)} // ✅ ensures unique string keys
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("ServiceRequest")}
              activeOpacity={0.9}
              style={{ marginBottom: 10 }}
            >
              {renderRequest({ item })}
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
            />
          }
          ListEmptyComponent={
            <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
              No pending work orders.
            </Text>
          }
        />
      </View>



      {/* Floating Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateWorkOrder")}
      >
        <Icon name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 16 },
  summaryCard: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  summaryText: { color: "#fff", fontSize: 15 },
  summaryBtn: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  summaryBtnText: { color: "#3b5998", fontWeight: "bold" },
  sectionTitle: { fontSize: 18, color: "#fff", marginBottom: 10 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000", shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
  },
  cardHeader: { flexDirection: "column" },
  cardTitle: { fontSize: 16, fontWeight: "600" },
  cardStatus: { fontSize: 14, color: "#888" },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    backgroundColor: "#ff6f00",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000", shadowOpacity: 0.3, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
  }
});

export default CustomerDashboard;
