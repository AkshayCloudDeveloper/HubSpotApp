// screens/WorkOrderListScreen.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import api from "../../../api/api";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from "react-native-linear-gradient";

type WorkOrder = {
    id: number;
    title: string;
    description?: string;
    status: string;
    priority?: string;
    scheduled_date?: string;
    assigned_technician_id?: number;
    customer_id?: number;
    asset_id?: number;
    notes?: string;
};


const dummyData: WorkOrder[] = [
    {
        id: 1,
        title: "AC Maintenance",
        status: "Pending",
        scheduled_date: "2025-08-20",
        notes: "Check gas pressure and filters."
    },
    {
        id: 2,
        title: "Electrical Wiring",
        status: "In Progress",
        scheduled_date: "2025-08-21",
        notes: "Replace damaged wires in living room."
    },
    {
        id: 3,
        title: "Plumbing Leak",
        status: "Completed",
        scheduled_date: "2025-08-15",
        notes: "Fixed pipe under kitchen sink."
    },
    {
        id: 4,
        title: "Plumbing Leak",
        status: "Completed",
        scheduled_date: "2025-08-15",
        notes: "Fixed pipe under kitchen sink."
    },
    {
        id: 5,
        title: "Plumbing Leak",
        status: "Completed",
        scheduled_date: "2025-08-15",
        notes: "Fixed pipe under kitchen sink."
    },
    {
        id: 6,
        title: "Plumbing Leak",
        status: "Completed",
        scheduled_date: "2025-08-15",
        notes: "Fixed pipe under kitchen sink."
    }
];

type RootStackParamList = {
    Home: undefined;
    CreateWorkOrder: undefined;  // no params
    // Add other screens here
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const WorkOrderListScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [orders, setOrders] = useState<WorkOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            // Temporary: use dummy data until API works
            // const res = await api.get("/workorders");
            // setOrders(res.data);
            setOrders(dummyData);
        } catch (err) {
            console.error("Error fetching work orders", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

    const handleCreateWorkOrder = () => {
        // Later navigate to create work order scree
        navigation.navigate("CreateWorkOrder");
        console.log("FAB clicked: Navigate to Create Work Order screen");
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#4c669f", "#415580ff", "#394b7dff"]}
                style={styles.container}
            >
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.orderTitle}>{item.title}</Text>
                                <Text style={styles.status}>{item.status}</Text>
                            </View>
                            <Text style={styles.date}>
                                Scheduled: {item.scheduled_date ? new Date(item.scheduled_date).toDateString() : "N/A"}
                            </Text>
                            {item.notes ? <Text style={styles.notes}>Notes: {item.notes}</Text> : null}
                        </View>
                    )}
                    contentContainerStyle={{ padding: 16 }}
                />

                {/* Floating Button */}
                <TouchableOpacity style={styles.fab} onPress={handleCreateWorkOrder}>
                    <Icon name="add" size={28} color="#fff" />
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
    },
    card: {
        backgroundColor: "#fff",
        padding: 16,
        marginHorizontal: 8,  // only tiny margin at sides
        marginBottom: 16,
        borderRadius: 16,
        elevation: 5, // Android shadow
        shadowColor: "#000", // iOS shadow
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
    cardHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    orderTitle: { fontSize: 20, fontWeight: "700", color: "#333" },
    status: { fontSize: 15, color: "#007bff", fontWeight: "500" },
    date: { fontSize: 15, color: "#555", marginTop: 6 },
    notes: { fontSize: 14, marginTop: 8, color: "#666", lineHeight: 20 },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 30,
        backgroundColor: "#ff6f00",
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        elevation: 6,
        shadowColor: "#000", shadowOpacity: 0.3, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
    }
});



export default WorkOrderListScreen;
