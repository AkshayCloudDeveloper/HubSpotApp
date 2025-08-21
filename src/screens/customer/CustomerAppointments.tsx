import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";

// ---- 1. Appointment item type ----
type AppointmentItem = {
  id: string;
  service: string;
  date: string;
  time: string;
  technician: string;
  status: "Confirmed" | "Pending" | "Completed";
};

// ---- 2. Dummy Data ----
const CustomerAppointments: AppointmentItem[] = [
  {
    id: "1",
    service: "AC Repair",
    date: "Aug 22, 2025",
    time: "10:00 AM",
    technician: "John Doe",
    status: "Confirmed",
  },
  {
    id: "2",
    service: "Washing Machine Service",
    date: "Aug 24, 2025",
    time: "3:30 PM",
    technician: "Alice Smith",
    status: "Pending",
  },
  {
    id: "3",
    service: "Plumbing Work",
    date: "Aug 28, 2025",
    time: "1:00 PM",
    technician: "David Lee",
    status: "Completed",
  },
];

// ---- 3. Status color mapping ----
const statusColors: Record<AppointmentItem["status"], string> = {
  Confirmed: "#81c784", // soft green
  Pending: "#ffeb3b",   // soft yellow
  Completed: "#64b5f6", // soft blue
};

// ---- 4. Render each appointment card ----
const renderAppointment = ({ item }: { item: AppointmentItem }) => (
  <LinearGradient
    colors={["#f6f9fbff", "#eff5ffff"]} // light blue → white
    style={styles.card}
  >
    <View style={styles.cardHeader}>
      <Text style={styles.serviceText}>{item.service}</Text>
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: statusColors[item.status] },
        ]}
      >
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </View>

    <View style={styles.detailRow}>
      <Ionicons name="calendar-outline" size={16} color="#333" />
      <Text style={styles.detailText}>{item.date}</Text>
    </View>
    <View style={styles.detailRow}>
      <Ionicons name="time-outline" size={16} color="#333" />
      <Text style={styles.detailText}>{item.time}</Text>
    </View>
    <View style={styles.detailRow}>
      <Ionicons name="person-outline" size={16} color="#333" />
      <Text style={styles.detailText}>{item.technician}</Text>
    </View>
  </LinearGradient>
);

// ---- 5. Main Component ----
export default function AppointmentsScreen() {
  return (

    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#4c669f", "#415580ff", "#394b7dff"]}
        style={styles.container}
      >
        <FlatList
          data={CustomerAppointments}
          renderItem={renderAppointment}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        />
      </LinearGradient>

    </SafeAreaView>
  );
}

// ---- 6. Styles ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  headerTitle: {
    color: "#0d47a1",
    fontSize: 22,
    fontWeight: "700",
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  serviceText: {
    color: "#0d47a1",
    fontSize: 18,
    fontWeight: "700",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "600",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  detailText: {
    color: "#333",
    fontSize: 14,
    marginLeft: 6,
  },
});
