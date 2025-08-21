// context/NotificationContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Notification {
  id: string;
  title: string;
  body: string;
  receivedAt: string;
  read?: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  clearNotification: (id: string) => void;
  clearAll: () => void;
  markAllRead: () => void;
}

export const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  clearNotification: () => {},
  clearAll: () => {},
  markAllRead: () => {},
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 🔹 Load from AsyncStorage on start
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const stored = await AsyncStorage.getItem("notifications");
        if (stored) {
          setNotifications(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load notifications", e);
      }
    };
    loadNotifications();
  }, []);

  // 🔹 Save to AsyncStorage whenever notifications change
  useEffect(() => {
    AsyncStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Notification) => {
    setNotifications((prev) => [{ ...notification, read: false }, ...prev]);
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => setNotifications([]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, clearNotification, clearAll, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
