import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { NotificationContext } from "../context/NotificationContext";
import Ionicons from 'react-native-vector-icons/Ionicons';


interface BellIconProps {
  navigation: any;
}

export const BellIcon: React.FC<BellIconProps> = ({ navigation }) => {
  const { notifications } = useContext(NotificationContext); // ✅ useContext

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <TouchableOpacity onPress={() => navigation.navigate("NotificationsScreen")}>
      <View style={{ position: "relative", marginRight: 20 }}>
       <Ionicons name="notifications-outline" size={27} color="#f4f1f1ff" />

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
            <Text style={{ color: "white", fontSize: 12, fontWeight: "bold" }}>
              {unreadCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
