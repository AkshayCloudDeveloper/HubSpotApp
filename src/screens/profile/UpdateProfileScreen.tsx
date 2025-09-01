// screens/UpdateProfileScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
    RefreshControl
} from "react-native";
import { getProfile, updateProfile } from "../../api/user";
import { resetToLogin } from "../../api/RootNavigation";
import { useAuth } from "../../context/AuthContext";

export default function UpdateProfileScreen() {
    const { logout } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    // Reusable fetch function
    const fetchProfile = async () => {
        try {
            const res = await getProfile();
            if (res.data) {
                setName(res.data.name || "");
                setEmail(res.data.email || "");
                setPhone(res.data.phone || "");
            }
        } catch (err) {
            console.error("Profile fetch error:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Fetch on mount
    useEffect(() => {
        fetchProfile();
    }, []);

    // Refresh handler
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProfile();  // 👈 now actually updates state
    }, []);

    const handleUpdate = async () => {
        if (password && password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }
        setLoading(true);
        try {
            const res = await updateProfile({
                name,
                email,
                phone,
                ...(password ? { password } : {}), // only send password if entered
            });

            Alert.alert("Success", res.data.message || "Profile updated successfully");
            if (res.data.logoutRequired) {
                logout();
                resetToLogin();
                return;
            }
        } catch (err: any) {
            console.error("Update error:", err.response);
            Alert.alert("Error", err.response?.data?.message || "Something went wrong");
        }finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#4a90e2" />
            </View>
        );
    }

    return (

        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Name */}
            <Text style={styles.label}>Full Name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
            />

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder="Enter your email"
            />

            {/* Phone */}
            <Text style={styles.label}>Phone</Text>
            <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="Enter your phone"
            />

            {/* Change Password */}
            <Text style={styles.sectionTitle}>Change Password</Text>

            <Text style={styles.label}>New Password</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter new password"
                secureTextEntry
            />

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Save Changes</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 20 },
    heading: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginTop: 20,
        marginBottom: 10,
        color: "#444",
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 5,
        color: "#555",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: "#f9f9f9",
    },
    button: {
        backgroundColor: "#4c669f",
        padding: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
        marginBottom: 30,
    },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
