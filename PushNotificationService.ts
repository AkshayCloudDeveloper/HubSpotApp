// PushNotificationService.ts
import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
  setBackgroundMessageHandler,
  requestPermission,
  AuthorizationStatus,
} from "@react-native-firebase/messaging";
import React, { useEffect, useContext } from "react";
import { Alert } from "react-native";
import { NotificationContext } from "./src/context/NotificationContext";

const messaging = getMessaging(getApp());

export async function requestUserPermission() {
  const authStatus = await requestPermission(messaging);
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log("Authorization status:", authStatus);
  }
}

export async function getFCMToken() {
  const token = await getToken(messaging);
  console.log("FCM Token:", token);
  return token;
}

/**
 * React hook to listen for notifications in all states
 */
export function useNotificationListener() {
  const { addNotification } = useContext(NotificationContext);

  useEffect(() => {
    // Foreground
    const unsubscribe = onMessage(messaging, async (remoteMessage) => {
      if (remoteMessage?.notification) {
        addNotification({
          id: Date.now().toString(),
          title: remoteMessage.notification.title || "No Title",
          body: remoteMessage.notification.body || "No Message",
          receivedAt: new Date().toLocaleString(),
        });

        Alert.alert(
          remoteMessage.notification?.title ?? "Notification",
          remoteMessage.notification?.body ?? ""
        );
      }
    });

    // Opened from background
    const unsubscribeOpened = onNotificationOpenedApp(messaging, (remoteMessage) => {
      if (remoteMessage?.notification) {
        addNotification({
          id: Date.now().toString(),
          title: remoteMessage.notification.title || "No Title",
          body: remoteMessage.notification.body || "No Message",
          receivedAt: new Date().toLocaleString(),
        });
      }
    });

    // Opened from quit state
    getInitialNotification(messaging).then((remoteMessage) => {
      if (remoteMessage?.notification) {
        addNotification({
          id: Date.now().toString(),
          title: remoteMessage.notification.title || "No Title",
          body: remoteMessage.notification.body || "No Message",
          receivedAt: new Date().toLocaleString(),
        });
      }
    });

    // Background messages
    setBackgroundMessageHandler(messaging, async (remoteMessage) => {
      if (remoteMessage?.notification) {
        // 👇 This will run even if app is in background
        addNotification({
          id: Date.now().toString(),
          title: remoteMessage.notification.title || "No Title",
          body: remoteMessage.notification.body || "No Message",
          receivedAt: new Date().toLocaleString(),
        });
      }
      console.log("Message handled in the background!", remoteMessage);
    });

    return () => {
      unsubscribe();
      unsubscribeOpened();
    };
  }, []);
}
