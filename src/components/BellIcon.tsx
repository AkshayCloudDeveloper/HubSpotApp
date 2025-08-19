import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { NotificationContext } from "../context/NotificationContext";

type Notification = {
  id: string;
  title: string;
  body: string;
  read: boolean;
};

export const BellIcon = ({ navigation }: { navigation: any }) => {
  // 👇 tell TypeScript what NotificationContext contains
  const { notifications } = useContext(NotificationContext) as {
    notifications: Notification[];
  };

  const unreadCount = notifications.filter((n: Notification) => !n.read).length;

  return (
    <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
      <View style={{ position: "relative", marginRight: 20 }}>
        <Text style={{ fontSize: 24 }}>🔔</Text>
        {unreadCount > 0 && (
          <View
            style={{
              position: "absolute",
              right: -5,
              top: -5,
              backgroundColor: "red",
              borderRadius: 10,
              paddingHorizontal: 6,
              minWidth: 18,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 12 }}>{unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
