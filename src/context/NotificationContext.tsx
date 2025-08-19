import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { listenForNotifications } from "../../PushNotificationService";

type Notification = {
  id: number;
  title: string;
  body: string;
  read: boolean;
};

export const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({ children }: any) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load saved notifications
    const load = async () => {
      const stored = await AsyncStorage.getItem("notifications");
      if (stored) setNotifications(JSON.parse(stored));
    };
    load();

    // Start listening
    listenForNotifications();
  }, []);

  const clearAll = async () => {
    setNotifications([]);
    await AsyncStorage.removeItem("notifications");
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, clearAll }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
