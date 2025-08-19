// PushNotificationService.ts (modular API)
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
import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export function listenForNotifications() {
  // Foreground messages
  onMessage(messaging, async remoteMessage => {
    await saveNotification(remoteMessage);
    Alert.alert(
      remoteMessage.notification?.title ?? "Notification",
      remoteMessage.notification?.body ?? ""
    );
  });

  // When the app is opened from a notification (background)
  onNotificationOpenedApp(messaging, remoteMessage => {
    console.log("Opened from background:", remoteMessage);
  });

  // When the app is opened from a notification (quit)
  getInitialNotification(messaging).then(remoteMessage => {
    if (remoteMessage) {
      console.log("Opened from quit state:", remoteMessage);
    }
  });

  // Background handler
  setBackgroundMessageHandler(messaging, async remoteMessage => {
    console.log("Message handled in the background!", remoteMessage);
  });
}

// Function to save notification in AsyncStorage
async function saveNotification(notification: any) {
  try {
    const existing = await AsyncStorage.getItem("notifications");
    let notifications = existing ? JSON.parse(existing) : [];

    notifications.unshift({
      id: Date.now(), // unique id
      title: notification.notification?.title,
      body: notification.notification?.body,
      data: notification.data,
      read: false,
    });

    await AsyncStorage.setItem("notifications", JSON.stringify(notifications));
  } catch (err) {
    console.error("Error saving notification:", err);
  }
}
