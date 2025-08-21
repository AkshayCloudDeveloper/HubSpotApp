// api/deviceApi.ts
import api from "./api"; // your axios instance
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import { getFCMToken } from "../../PushNotificationService";



export default async function registerDevice() {
  try {
    const fcmToken = await getFCMToken();
    const deviceId = await DeviceInfo.getUniqueId();

    if (!fcmToken) return;

    await api.post("/auth/save-fcm-token", {
      fcm_token: fcmToken,
      device_id: deviceId,
      platform: Platform.OS,
    });
  } catch (error) {
    console.log(error)
    console.error("Error registering device:", error);
  }
}
