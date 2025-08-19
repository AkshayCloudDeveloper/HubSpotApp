import React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import Toast from 'react-native-toast-message';

type CustomDrawerProps = {
  setUserToken: (token: string | null) => void;
};

function CustomDrawerContent(props: any & CustomDrawerProps) {
  const { setUserToken } = props;

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const refreshToken = await AsyncStorage.getItem("refreshToken");

      if (token && refreshToken) {
        const res = await api.post(
          "/auth/logout",
          { refreshToken }, // 👈 send refresh token in body
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status === 200) {
          // ✅ API returned success
          await AsyncStorage.multiRemove(["authToken", "refreshToken"]);
          setUserToken(null); // reset to login screen
          Toast.show({
            type: "success",
            text1: "Logout!!",
            text2: res.data.message || "Something went wrong",
          });
        } else {
          console.log("Logout failed:", res.data);
        }
      } else {
        // no token -> just clear and reset
        await AsyncStorage.multiRemove(["authToken", "refreshToken"]);
        setUserToken(null);
      }
    } catch (err) {
      console.log("Logout API failed", err);
    }


    // Clear tokens
    await AsyncStorage.multiRemove(["authToken", "refreshToken"]);

    // 👈 Update root state, this will switch navigator
    setUserToken(null);
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* Default Drawer items (Home, Profile, etc.) */}
      <DrawerItemList {...props} />

      {/* Custom Logout button */}
      <DrawerItem label="Logout" onPress={handleLogout} />
    </DrawerContentScrollView>
  );
}

export default CustomDrawerContent;
