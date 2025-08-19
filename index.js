/**
 * @format
 */
import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";

// Get the default app instance
const app = getApp();
const messaging = getMessaging(app);

// Use modular background handler
setBackgroundMessageHandler(messaging, async remoteMessage => {
  console.log("Message handled in background:", remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
