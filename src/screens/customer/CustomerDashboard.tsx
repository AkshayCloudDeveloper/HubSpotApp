import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Define your stack's param list
type RootStackParamList = {
  CustomerDashboard: undefined;
  CreateWorkOrder: undefined;
  Appointments: undefined;
  // add other screens as needed
};

type CustomerDashboardNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CustomerDashboard',
  'Appointments'
>;

type CustomerDashboardRouteProp = RouteProp<RootStackParamList, 'CustomerDashboard'>;

type RequestItem = {
  id: string;
  title: string;
  status?: string; // optional if you plan to add this later
};


const CustomerDashboard = ({
  navigation,
}: {
  navigation: CustomerDashboardNavigationProp;
}) => {
  // Fake data for demo (replace with API data)
  const recentRequests: RequestItem[] = [
  { id: "1", title: "AC Repair" },
  { id: "2", title: "Washing Machine Service" },
  { id: "3", title: "Plumbing Work" },
];

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
        <Text style={styles.summaryText}>You have 2 upcoming appointments</Text>
        <TouchableOpacity
          style={styles.summaryBtn}
          onPress={() => navigation.navigate("Appointments")}
        >
          <Text style={styles.summaryBtnText}>View</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Requests */}
      <Text style={styles.sectionTitle}>Recent Service Requests</Text>
      <FlatList
        data={recentRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderRequest}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

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
    elevation: 4, // for Android shadow
    shadowColor: "#000", shadowOpacity: 0.2, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, // iOS shadow
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
