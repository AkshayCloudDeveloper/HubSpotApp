import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from "react-native-vector-icons/Ionicons";
import api from "../../api/api"; // adjust path if needed
import { useFocusEffect } from "@react-navigation/native";


// ---- 1. Appointment item type ----
type AppointmentItem = {
  id: string;
  service: string;
  customerDate: string;
  customerTime: string;
  technicianDate: string;
  technicianTime: string;
  technician: string;
  status: "Confirmed" | "InProgress";
  ticket_id: string;
};

// ---- 2. Status color mapping ----
const statusColors: Record<AppointmentItem["status"], string> = {
  Confirmed: "#81c784", // soft green
  InProgress: "#ffd67dff", // soft blue
};

// ---- 3. Render each appointment card ----
const renderAppointment = ({ item }: { item: AppointmentItem }) => (
  <LinearGradient
    colors={["#f6f9fbff", "#eff5ffff"]}
    style={styles.card}
  >
    <View>
      <Text style={styles.ticketId}>#: {item.ticket_id}</Text>
    </View>

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

    {/* Technician Scheduled */}
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Technician Scheduled</Text>
      <View style={styles.detailRow}>
        <Ionicons name="calendar-outline" size={16} color="#333" />
        <Text style={styles.detailText}>{item.technicianDate}</Text>
      </View>
      <View style={styles.detailRow}>
        <Ionicons name="time-outline" size={16} color="#333" />
        <Text style={styles.detailText}>{item.technicianTime}</Text>
      </View>
    </View>

    {/* Assigned Technician */}
    <View style={styles.detailRow}>
      <Ionicons name="person-outline" size={16} color="#333" />
      <Text style={styles.detailText}>{item.technician}</Text>
    </View>
  </LinearGradient>
);

// ---- 4. Main Component ----
export default function AppointmentsScreen() {
  const [orders, setOrders] = useState<AppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/workorders?status=confirmed,in_progress");

      const mapped: AppointmentItem[] = res.data.map((order: any) => ({
        id: order._id,
        ticket_id: order.ticket_id,
        service: order.service?.name || "Unknown Service",


        // Technician schedule
        technicianDate: order.scheduled_technician?.date
          ? new Date(order.scheduled_technician.date).toLocaleDateString(
            "en-US",
            { month: "short", day: "numeric", year: "numeric" }
          )
          : "Not Scheduled",
        technicianTime: order.scheduled_technician?.time || "Not Scheduled",

        technician: order.assigned_technician?.name || "Unassigned",
        status:
          order.status === "in_progress"
            ? "InProgress"
            : ("Confirmed" as AppointmentItem["status"]),
      }));

      setOrders(mapped);
    } catch (err) {
      console.error("Error fetching work orders", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [fetchOrders])
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#4c669f", "#415580ff", "#394b7dff"]}
        style={styles.container}
      >
        <FlatList
          data={orders}
          renderItem={renderAppointment}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchOrders} />
          }
          ListEmptyComponent={() =>
            loading ? null : (
              <Text style={{ color: "white", textAlign: "center", marginTop: 50 }}>
                No appointments found
              </Text>
            )
          }
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

// ---- 5. Styles ----
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderRadius: 40,
  },
  statusText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "600",
  },
  section: {
    marginTop: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  detailText: {
    color: "#333",
    fontSize: 14,
    marginLeft: 6,
  },
  ticketId: {
    fontSize: 14,
    fontWeight: "700",
    color: "#222",
    marginBottom: 2,
  }
});
