// src/screens/NotificationsScreen.tsx
import React, { useContext } from "react";
import { View, Text, FlatList, Button } from "react-native";
import { NotificationContext } from "../context/NotificationContext";

export default function NotificationsScreen() {
  const { notifications, clearNotifications } = useContext(NotificationContext);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Clear All" onPress={clearNotifications} />
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ddd" }}>
            <Text style={{ fontWeight: item.read ? "normal" : "bold" }}>{item.title}</Text>
            <Text>{item.body}</Text>
          </View>
        )}
      />
    </View>
  );
}
