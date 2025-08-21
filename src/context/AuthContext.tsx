// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";
import { resetToLogin } from "../api/RootNavigation";

type UserType = {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role: "customer" | "technician";
};

type AuthContextType = {
  userToken: string | null;
  user: UserType | null;           // ✅ added user
  setUserToken: (token: string | null) => void;
  setUser: (user: UserType | null) => void; // ✅ setter for user
  isCheckingAuth: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null); // ✅ user state
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        const storedUser = await AsyncStorage.getItem("user"); // ✅ user from storage

        if (!token || !refreshToken) {
          setUserToken(null);
          setUser(null);
          return;
        }

        if (storedUser) setUser(JSON.parse(storedUser));

        try {
          // 1️⃣ Check if access token is valid
          await api.post("/auth/check-token", {}, { headers: { Authorization: `Bearer ${token}` } });
          setUserToken(token);
        } catch {
          // 2️⃣ Try refreshing the token
          try {
            const { data } = await api.post("/auth/refresh-token", { refreshToken });
            if (data?.accessToken) {
              await AsyncStorage.setItem("authToken", data.accessToken);
              setUserToken(data.accessToken);
            } else {
              await clearTokens();
              setUserToken(null);
              setUser(null);
            }
          } catch {
            await clearTokens();
            setUserToken(null);
            setUser(null);
          }
        }
      } catch (e) {
        console.error("Auth check failed:", e);
        setUserToken(null);
        setUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    initAuth();
  }, []);

  const clearTokens = async () => {
    await AsyncStorage.multiRemove(["authToken", "refreshToken", "user"]);
  };

  const logout = async () => {
    try {
      await clearTokens();
      setUserToken(null);
      setUser(null);
      resetToLogin();
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ userToken, user, setUserToken, setUser, isCheckingAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
