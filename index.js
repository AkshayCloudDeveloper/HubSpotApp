/**
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Get the default app instance
const app = getApp();
const messaging = getMessaging(app);

// Use modular background handler
setBackgroundMessageHandler(messaging, async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);

  if (remoteMessage?.notification) {
    const stored = await AsyncStorage.getItem('notifications');
    const existing = stored ? JSON.parse(stored) : [];

    const newNotification = {
      id: Date.now().toString(),
      title: remoteMessage.notification.title || 'No Title',
      body: remoteMessage.notification.body || 'No Message',
      receivedAt: new Date().toLocaleString(),
    };

    const updated = [newNotification, ...existing];
    await AsyncStorage.setItem('notifications', JSON.stringify(updated));
  }
});

AppRegistry.registerComponent(appName, () => App);
