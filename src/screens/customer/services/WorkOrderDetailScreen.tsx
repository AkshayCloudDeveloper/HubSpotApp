// screens/WorkOrderDetailScreen.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Image,
    Modal,
    Platform,
    SafeAreaView,
    KeyboardAvoidingView,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import { launchImageLibrary } from "react-native-image-picker";
import { StackNavigationProp } from "@react-navigation/stack";
import api from "../../../api/api";
import { API_BASE_URL_IMAGE } from "@env";

// ---------- Types ----------
type RootStackParamList = {
    WorkOrderDetail: { id: string };
    WorkOrderList: undefined;
};

type WorkOrderDetailRouteProp = RouteProp<RootStackParamList, "WorkOrderDetail">;
type NavigationProp = StackNavigationProp<RootStackParamList, "WorkOrderDetail">;

interface Note {
    _id?: string;
    body: string;
    date: string;
}

interface Attachment {
    url: string;
    filename: string;
    type: string;
}

interface WorkOrder {
    _id: string;
    title: string;
    status: string;
    description?: string;
    ticket_id: string;

    scheduled_customer?: {
        date?: string;
        time?: string;
    };

    location?: {
        address_line1: string;
        address_line2?: string;
        city: string;
        state: string;
        postal_code: string;
        country: string;
    };

    notes?: Note[];
    attachments?: Attachment[];
}

const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
        case "open":
            return { backgroundColor: "#17a2b8" };
        case "in_progress":
            return { backgroundColor: "#ffc107" };
        case "completed":
            return { backgroundColor: "#28a745" };
        case "cancelled":
            return { backgroundColor: "#dc3545" };
        default:
            return { backgroundColor: "#6c757d" };
    }
};

// ---------- Component ----------
const WorkOrderDetailScreen: React.FC = () => {
    const route = useRoute<WorkOrderDetailRouteProp>();
    const navigation = useNavigation<NavigationProp>();
    const { id } = route.params;

    const [workOrder, setWorkOrder] = useState<WorkOrder | null>(null);
    const [loading, setLoading] = useState(true);

    // Editable fields
    const [description, setDescription] = useState("");
    const [newNote, setNewNote] = useState("");

    // Customer requested schedule
    const [customerDate, setCustomerDate] = useState<Date | null>(null);
    const [customerTime, setCustomerTime] = useState<Date | null>(null);
    const [showCustomerDatePicker, setShowCustomerDatePicker] = useState(false);
    const [showCustomerTimePicker, setShowCustomerTimePicker] = useState(false);

    // Address
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [city, setCity] = useState("");
    const [stateVal, setStateVal] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("");

    // Attachments
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // ---------- Fetch ----------
    useEffect(() => {
        fetchWorkOrder();
    }, []);

    const fetchWorkOrder = async () => {
        try {
            const res = await api.get<WorkOrder>(`/workorders/${id}`);
            const data = res.data;

            setWorkOrder(data);
            setDescription(data.description || "");
            setAttachments(Array.isArray(data.attachments) ? data.attachments : []);

            // customer schedule
            setCustomerDate(data.scheduled_customer?.date ? new Date(data.scheduled_customer.date) : null);
            setCustomerTime(parseTimeString(data.scheduled_customer?.time ? data.scheduled_customer?.time : ""));

            // location
            if (data.location) {
                setAddressLine1(data.location.address_line1 || "");
                setAddressLine2(data.location.address_line2 || "");
                setCity(data.location.city || "");
                setStateVal(data.location.state || "");
                setPostalCode(data.location.postal_code || "");
                setCountry(data.location.country || "");
            }
        } catch (err) {
            console.error("❌ Error fetching work order details:", err);
            Alert.alert("Error", "Failed to load work order details.");
        } finally {
            setLoading(false);
        }
    };

    function parseTimeString(timeStr: string): Date | null {
        if (!timeStr) return null;
        timeStr = timeStr.replace(/\u202F|\u200E/g, " ").trim();
        const match = timeStr.match(/(\d{1,2}):(\d{2})\s?(AM|PM|am|pm)/);
        if (!match) return null;
        let [_, hour, minute, period] = match;
        let h = parseInt(hour, 10);
        const m = parseInt(minute, 10);
        if (period.toLowerCase() === "pm" && h < 12) h += 12;
        if (period.toLowerCase() === "am" && h === 12) h = 0;
        return new Date(1970, 0, 1, h, m);
    }

    // ---------- Update ----------
    const handleUpdate = async () => {
        try {
            const payload: Partial<WorkOrder> & { notes?: string } = {
                description,
                attachments,
                scheduled_customer: {
                    date: customerDate ? customerDate.toISOString() : undefined,
                    time: customerTime
                        ? customerTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                        : undefined,
                },
                location: {
                    address_line1: addressLine1,
                    address_line2: addressLine2,
                    city,
                    state: stateVal,
                    postal_code: postalCode,
                    country,
                },
            };
            if (newNote.trim()) payload.notes = newNote;
            await api.put(`/workorders/${id}`, payload);
            Alert.alert("✅ Success", "Work order updated successfully");
            setNewNote("");
            fetchWorkOrder();
        } catch (err) {
            console.error("❌ Update error:", err);
            Alert.alert("Error", "Failed to update work order");
        }
    };

    // ---------- Delete ----------
    const handleDelete = async () => {
        Alert.alert("⚠️ Confirm Delete", "Are you sure you want to delete this work order?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        await api.delete(`/workorders/${id}`);
                        Alert.alert("✅ Deleted", "Work order deleted successfully");
                        navigation.goBack();
                    } catch (err) {
                        console.error("❌ Delete error:", err);
                        Alert.alert("Error", "Failed to delete work order");
                    }
                },
            },
        ]);
    };

    // ---------- Attachments ----------
    const addAttachment = async () => {
        const result = await launchImageLibrary({ mediaType: "photo" });
        if (!result.didCancel && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            const newFile: Attachment = {
                url: asset.uri ?? "",
                filename: asset.fileName || "new_image.jpg",
                type: asset.type || "image/jpeg",
            };
            setAttachments([...attachments, newFile]);
        }
    };
    const removeAttachment = (index: number) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    // ---------- UI ----------
    if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;
    if (!workOrder) {
        return (
            <View style={styles.center}>
                <Text>No details found</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 120 }} // prevent overlap
                keyboardShouldPersistTaps="handled"
            >
                {/* Title */}
                <Text style={styles.title}>{workOrder.title}</Text>
                <Text style={styles.ticketId}>Ticket ID: {workOrder.ticket_id}</Text>

                {/* Status */}
                <View style={[styles.statusBadge, getStatusStyle(workOrder.status)]}>
                    <Text style={styles.statusText}>{workOrder.status.toUpperCase()}</Text>
                </View>

                {/* Description */}
                <Text style={styles.label}>Description</Text>
                <TextInput
                    style={styles.input}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Enter description"
                    multiline
                />

                {/* Customer Requested Date */}
                <Text style={styles.label}>Requested Date</Text>
                <TouchableOpacity style={styles.dateBox} onPress={() => setShowCustomerDatePicker(true)}>
                    <Ionicons name="calendar-outline" size={18} color="#333" />
                    <Text style={styles.dateText}>
                        {customerDate ? customerDate.toDateString() : "Pick a date"}
                    </Text>
                </TouchableOpacity>
                {showCustomerDatePicker && (
                    <DateTimePicker
                        value={customerDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowCustomerDatePicker(false);
                            if (selectedDate) setCustomerDate(selectedDate);
                        }}
                    />
                )}

                {/* Customer Requested Time */}
                <Text style={styles.label}>Requested Time</Text>
                <TouchableOpacity style={styles.dateBox} onPress={() => setShowCustomerTimePicker(true)}>
                    <Ionicons name="time-outline" size={18} color="#333" />
                    <Text style={styles.dateText}>
                        {customerTime
                            ? customerTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                            : "Pick a time"}
                    </Text>
                </TouchableOpacity>
                {showCustomerTimePicker && (
                    <DateTimePicker
                        value={customerTime || new Date()}
                        mode="time"
                        display="default"
                        onChange={(event, selectedTime) => {
                            setShowCustomerTimePicker(false);
                            if (selectedTime) setCustomerTime(selectedTime);
                        }}
                    />
                )}

                {/* Address */}
                <Text style={styles.label}>Address</Text>
                <TextInput style={styles.input} placeholder="Address Line 1" value={addressLine1} onChangeText={setAddressLine1} />
                <TextInput style={styles.input} placeholder="Address Line 2" value={addressLine2} onChangeText={setAddressLine2} />
                <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
                <TextInput style={styles.input} placeholder="State" value={stateVal} onChangeText={setStateVal} />
                <TextInput style={styles.input} placeholder="Postal Code" value={postalCode} onChangeText={setPostalCode} keyboardType="numeric" />
                <TextInput style={styles.input} placeholder="Country" value={country} onChangeText={setCountry} />

                {/* Notes */}
                <Text style={styles.label}>Notes</Text>
                {workOrder.notes && workOrder.notes.length > 0 ? (
                    workOrder.notes.map((note, index) => (
                        <Text key={note._id || index} style={styles.noteItem}>
                            • {note.body} ({new Date(note.date).toDateString()})
                        </Text>
                    ))
                ) : (
                    <Text style={styles.value}>No notes available</Text>
                )}
                <TextInput
                    style={styles.input}
                    placeholder="Add a new note..."
                    value={newNote}
                    onChangeText={setNewNote}
                    multiline
                />

                {/* Attachments */}
                <Text style={styles.label}>Attachments</Text>
                {attachments.length > 0 ? (
                    attachments.map((file, idx) => {
                        const fileUrl =
                            file.url.startsWith("http") || file.url.startsWith("file://")
                                ? file.url
                                : `${API_BASE_URL_IMAGE}${file.url}`;
                        return (
                            <View key={idx} style={styles.attachmentBox}>
                                <TouchableOpacity onPress={() => setSelectedImage(fileUrl)}>
                                    {fileUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                                        <Image source={{ uri: fileUrl }} style={styles.attachmentImage} />
                                    ) : (
                                        <Text style={styles.attachmentFile}>{file.filename}</Text>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.removeBtn} onPress={() => removeAttachment(idx)}>
                                    <Ionicons name="trash" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        );
                    })
                ) : (
                    <Text style={styles.value}>No attachments available</Text>
                )}
                <TouchableOpacity style={styles.addBtn} onPress={addAttachment}>
                    <Ionicons name="add-circle" size={24} color="blue" />
                    <Text style={{ marginLeft: 6 }}>Add Attachment</Text>
                </TouchableOpacity>

                {/* Fullscreen image modal */}
                <Modal visible={!!selectedImage} transparent>
                    <View style={styles.modalBackground}>
                        <TouchableOpacity style={styles.modalClose} onPress={() => setSelectedImage(null)}>
                            <Ionicons name="close" size={30} color="white" />
                        </TouchableOpacity>
                        {selectedImage && (
                            <Image source={{ uri: selectedImage }} style={styles.fullImage} resizeMode="contain" />
                        )}
                    </View>
                </Modal>
            </ScrollView>

            {/* Fixed Action Buttons */}
            <SafeAreaView style={styles.actionRowWrapper}>
                <View style={styles.actionRow}>
                    <TouchableOpacity style={[styles.button, styles.updateBtn]} onPress={handleUpdate}>
                        <Text style={styles.buttonText}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.deleteBtn]} onPress={handleDelete}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

// ---------- Styles ----------
const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: "#fff" },
    center: { flex: 1, justifyContent: "center", alignItems: "center" },
    title: { fontSize: 22, fontWeight: "700", marginBottom: 4, color: "#333" },
    ticketId: { fontSize: 14, color: "#888", marginBottom: 10 },
    label: { fontSize: 16, fontWeight: "600", marginTop: 16, color: "#444" },
    value: { fontSize: 15, color: "#666", marginTop: 6 },
    dateBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f2f2f2",
        padding: 10,
        borderRadius: 6,
        marginTop: 6,
    },
    dateText: { marginLeft: 8, fontSize: 15, color: "#333" },
    noteItem: { fontSize: 14, color: "#555", marginTop: 4 },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 6,
        padding: 10,
        marginTop: 10,
        fontSize: 15,
        textAlignVertical: "top",
    },
    attachmentBox: { marginTop: 10, position: "relative" },
    attachmentImage: { width: 100, height: 100, borderRadius: 6 },
    attachmentFile: { fontSize: 14, color: "#555" },
    removeBtn: {
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: "red",
        borderRadius: 20,
        padding: 3,
    },
    addBtn: { flexDirection: "row", alignItems: "center", marginTop: 10 },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.9)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalClose: { position: "absolute", top: 40, right: 20 },
    fullImage: { width: "90%", height: "80%" },
    actionRowWrapper: {
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderColor: "#eee",
        padding: 10,
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },
    button: {
        flex: 1,
        padding: 14,
        borderRadius: 6,
        alignItems: "center",
        marginHorizontal: 5,
    },
    updateBtn: { backgroundColor: "#28a745" },
    deleteBtn: { backgroundColor: "#dc3545" },
    buttonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
    statusBadge: {
        alignSelf: "flex-start",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 10,
    },
    statusText: { color: "white", fontWeight: "600", fontSize: 14 },
});

export default WorkOrderDetailScreen;
