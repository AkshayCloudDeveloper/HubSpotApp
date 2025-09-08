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
import api from "../../api/api";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import LinearGradient from "react-native-linear-gradient";
import {
    responsiveWidth,
    responsiveHeight,
    responsiveFontSize,
} from "react-native-responsive-dimensions";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";

type WorkOrder = {
    _id: string;
    ticket_id: string;
    title: string;
    description?: string;
    status: string;
    priority?: string;
    scheduled_customer?: {
        date?: string;
        time?: string;
    };
    location?: {
        address_line1?: string;
        address_line2?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        country?: string;
    };
};

type RootStackParamList = {
    Home: undefined;
    CreateWorkOrder: undefined;
    WorkOrderDetail: { id: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const CompletedWorkOrders = () => {
    const navigation = useNavigation<NavigationProp>();
    const [orders, setOrders] = useState<WorkOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [])
    );

    const fetchOrders = async () => {
        try {
            const res = await api.get("/workorders?status=completed");
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
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#4c669f", "#415580ff", "#394b7dff"]}
                style={styles.container}
            >
                <FlatList
                    data={orders}
                    keyExtractor={(item, index) =>
                        item.ticket_id ? item.ticket_id.toString() : index.toString()
                    }
                    renderItem={({ item }) => {
                        const formattedDate = item.scheduled_customer?.date
                            ? new Date(item.scheduled_customer.date).toDateString()
                            : "N/A";
                        const formattedTime = item.scheduled_customer?.time || "N/A";

                        const fullAddress = item.location
                            ? `${item.location.address_line1 || ""} ${
                                  item.location.address_line2 || ""
                              } ${item.location.city || ""} ${item.location.state || ""} ${
                                  item.location.postal_code || ""
                              } ${item.location.country || ""}`.trim()
                            : "No address available";

                        return (
                            // <TouchableOpacity
                            //     onPress={() =>
                            //         navigation.navigate("WorkOrderDetail", { id: item._id })
                            //     }
                            //     activeOpacity={0.9}
                            // >
                                <View style={styles.card}>
                                    {/* ✅ Ticket ID */}
                                    <Text style={styles.ticketId}>#: {item.ticket_id}</Text>

                                    {/* ✅ Date & Time (separate line) */}
                                    <Text style={styles.dateText}>
                                        {formattedDate} at {formattedTime}
                                    </Text>

                                    {/* Title + Status */}
                                    <View style={styles.titleRow}>
                                        <Text style={styles.orderTitle}>{item.title}</Text>
                                        <Text style={styles.status}>{item.status}</Text>
                                    </View>

                                    {/* Description */}
                                    <View style={styles.detailRow}>
                                        <Ionicons
                                            name="document-text-outline"
                                            size={16}
                                            color="#333"
                                        />
                                        <Text style={styles.detailText}>
                                            {item.description || "No description"}
                                        </Text>
                                    </View>

                                    {/* Address */}
                                    <View style={styles.detailRow}>
                                        <Ionicons
                                            name="location-outline"
                                            size={16}
                                            color="#333"
                                        />
                                        <Text style={styles.detailText}>{fullAddress}</Text>
                                    </View>
                                </View>
                            // </TouchableOpacity>
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
        padding: responsiveWidth(5),
        marginBottom: responsiveHeight(2),
        borderRadius: responsiveWidth(4),
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
    },
    ticketId: {
        fontSize: 14,
        fontWeight: "700",
        color: "#222",
        marginBottom: 2,
    },
    dateText: {
        fontSize: 13,
        color: "#666",
        marginBottom: 8,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    orderTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
        flex: 1,
        marginRight: 8,
    },
    status: {
        fontSize: 14,
        color: "#007bff",
        fontWeight: "500",
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
        flexShrink: 1,
    },
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
});

export default CompletedWorkOrders;
