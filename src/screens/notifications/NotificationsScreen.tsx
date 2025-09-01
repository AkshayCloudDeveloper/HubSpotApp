// screens/NotificationsScreen.tsx
import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { NotificationContext } from "../../context/NotificationContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";




export default function NotificationsScreen() {
  const { notifications, clearNotification, clearAll, markAllRead } =
    useContext(NotificationContext);
  const navigation = useNavigation();

  useEffect(() => {
    markAllRead();
  }, []);

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardBody}>{item.body}</Text>
        <Text style={styles.time}>{item.receivedAt}</Text>
      </View>
      <TouchableOpacity onPress={() => clearNotification(item.id)} style={styles.deleteBtn}>
        <Ionicons name="close-circle" size={22} color="#d9534f" />
      </TouchableOpacity>
    </View>
  );

  return (
    <LinearGradient
      colors={["#4c669f", "#415580ff", "#394b7dff"]}
      style={styles.container}
    >
      {/* your screen content */}

      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* Left group: back + title */}
          <View style={styles.leftGroup}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={26} color="#fdf8f8ff" />
            </TouchableOpacity>
            <Text style={styles.title}>Notifications</Text>
          </View>

          {/* Right side: Clear All */}
          {notifications.length > 0 && (
            <TouchableOpacity onPress={clearAll} style={styles.clearAllBtn}>
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Body */}
        {notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="notifications-off-outline" size={60} color="#bbb" />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: "transparent",
  },

  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    paddingRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",   // 👈 White text here
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 4,
  },
  clearAllBtn: { padding: 5 },
  clearAllText: { color: "#fcf9f9ff", fontSize: 14, fontWeight: "500" },


  // Empty state
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 16, color: "#888", marginTop: 8 },

  // Card
  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginHorizontal: 15,
    marginVertical: 6,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#fff",
    elevation: 2, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardTitle: { fontSize: 16, fontWeight: "600", marginBottom: 4, color: "#333" },
  cardBody: { fontSize: 14, color: "#555" },
  time: { fontSize: 12, color: "#999", marginTop: 6 },
  deleteBtn: { marginLeft: 10, marginTop: 4 },
});
