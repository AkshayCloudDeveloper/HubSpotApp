// screens/WorkOrderListScreen.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import api from "../../../api/api";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from '@react-navigation/stack';
import LinearGradient from "react-native-linear-gradient";
import {
    responsiveWidth,
    responsiveHeight,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import Ionicons from "react-native-vector-icons/Ionicons";

type WorkOrder = {
    _id: string;
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

type RootStackParamList = {
    Home: undefined;
    CreateWorkOrder: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const WorkOrderListScreen = () => {
    const navigation = useNavigation<NavigationProp>();
    const [orders, setOrders] = useState<WorkOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await api.get("/workorders?status=pending");
            console.log("Fetched work orders:", res.data);
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching work orders", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchOrders();
    }, []);

    if (loading && !refreshing) {
        return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    }

    const handleCreateWorkOrder = () => {
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
                    keyExtractor={(item, index) => item._id ? item._id.toString() : index.toString()}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.card}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.orderTitle}>
                                        {typeof item.title === "object" ? JSON.stringify(item.title) : item.title}
                                    </Text>
                                    <Text style={styles.status}>
                                        {typeof item.status === "object" ? JSON.stringify(item.status) : item.status}
                                    </Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Ionicons name="document-text-outline" size={16} color="#333" />
                                    <Text style={styles.detailText}>
                                        {item.description || "N/A"}
                                    </Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Ionicons name="time-outline" size={16} color="#333" />
                                    <Text style={styles.detailText}>{item.scheduled_date
                                        ? new Date(item.scheduled_date).toDateString()
                                        : "N/A"}</Text>
                                </View>

                                {/* Notes Section */}
                                <View style={styles.detailRow}>
                                    <Ionicons name="clipboard-outline" size={16} color="#333" />
                                    <Text style={styles.detailText}>Notes:</Text>
                                </View>

                                {Array.isArray(item.notes) && item.notes.length > 0 ? (
                                    <View style={styles.notesContainer}>
                                        {item.notes.map((note, index) => (
                                            <Text key={note._id || index} style={styles.noteItem}>
                                                • {note.body} ({new Date(note.date).toDateString()})
                                            </Text>
                                        ))}
                                    </View>
                                ) : (
                                    <Text style={styles.noNotes}>No notes available</Text>
                                )}

                            </View>
                        );
                    }}

                    contentContainerStyle={{ padding: 16 }}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No records found</Text>
                        </View>
                    }
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
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
        padding: responsiveWidth(8),
        marginHorizontal: responsiveWidth(2),
        marginBottom: responsiveHeight(2),
        borderRadius: responsiveWidth(4),
        elevation: 5,
        shadowColor: "#000",
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
    orderTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
    status: { fontSize: 15, color: "#007bff", fontWeight: "500" },
    date: { fontSize: 15, fontWeight: "700", color: "#555", marginTop: 6 },
    description: { fontSize: 15, color: "#555", marginTop: 6 },
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
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: responsiveHeight(20),
    },
    emptyText: {
        fontSize: responsiveFontSize(2),
        color: "#fff",
        fontWeight: "600",
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },
    detailText: {
        color: "#333",
        fontSize: 14,
        marginLeft: 6,
        fontWeight: "700"
    },
    notesContainer: {
        marginTop: 4,
        marginLeft: 24, // aligns under "Notes:" label
    },
    noteItem: {
        fontSize: 14,
        color: "#555",
        marginBottom: 4,
        lineHeight: 20,
    },
    noNotes: {
        fontSize: 14,
        color: "#999",
        marginTop: 4,
        marginLeft: 24,
        fontStyle: "italic",
    },

});

export default WorkOrderListScreen;
