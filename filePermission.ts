import { PermissionsAndroid, Platform, Alert } from "react-native";

const requestPermissions = async () => {
  if (Platform.OS === "android") {
    try {
      const permissions = [];

      // Camera permission
      permissions.push(PermissionsAndroid.PERMISSIONS.CAMERA);

      if (Platform.Version >= 33) {
        // Android 13+ separate permissions
        permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES);
      } else {
        // Android 12 and below
        permissions.push(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
      }

      const granted = await PermissionsAndroid.requestMultiple(permissions);

      return (
        granted[PermissionsAndroid.PERMISSIONS.CAMERA] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        (granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
          PermissionsAndroid.RESULTS.GRANTED ||
          granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] ===
            PermissionsAndroid.RESULTS.GRANTED)
      );
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  return true; // iOS handles in Info.plist
};

export default requestPermissions;

