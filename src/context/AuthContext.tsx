// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { resetToLogin } from "../api/RootNavigation";

type AuthContextType = {
  userToken: string | null;
  setUserToken: (token: string | null) => void;
  isCheckingAuth: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const refreshToken = await AsyncStorage.getItem("refreshToken");

        if (!token || !refreshToken) {
          setUserToken(null);
          return;
        }

        // 1️⃣ Check if access token is valid
        try {
          await api.post(
            "/auth/check-token",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          console.log("token checked");
          setUserToken(token);
        } catch {
          // 2️⃣ Try refreshing the token
          try {
            const { data } = await api.post("/auth/refresh-token", { refreshToken });
            if (data?.accessToken) {
              await AsyncStorage.setItem("authToken", data.accessToken);
              console.log("token refreshed--",data.accessToken);
              setUserToken(data.accessToken);
            } else {
              await clearTokens();
              setUserToken(null);
            }
          } catch {
            await clearTokens();
            setUserToken(null);
          }
        }
      } catch (e) {
        console.error("Auth check failed:", e);
        setUserToken(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    initAuth();
  }, []);

  const clearTokens = async () => {
    await AsyncStorage.multiRemove(["authToken", "refreshToken"]);
  };

  const logout = async () => {
    try {
      await clearTokens();
      setUserToken(null);
      resetToLogin();
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, setUserToken, isCheckingAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
