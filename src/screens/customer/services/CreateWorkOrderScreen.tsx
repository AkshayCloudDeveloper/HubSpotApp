import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
   ActivityIndicator,
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import LinearGradient from "react-native-linear-gradient";
import api from "../../../api/api";
import ServiceListScreen from "./ServiceListScreen"; // Import your service selection component
import { Modal } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import requestPermissions from "../../../../filePermission";
// For dropdowns
import { Picker } from "@react-native-picker/picker";
import async from '../../../api/deviceApi';

const CreateWorkOrderScreen: React.FC = () => {
  const navigation = useNavigation<any>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [asset, setAsset] = useState("");
  const [notes, setNotes] = useState("");
  // add state at the top of CreateWorkOrderScreen
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showServicePicker, setShowServicePicker] = useState(false);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleCreateOrder = async () => {
    try {
      // ✅ Validate required fields
      if (!selectedService || !description) {
        Alert.alert("⚠️ Missing Fields", "Service and description are required");
        return;
      }
      setLoading(true);
      // ✅ Build FormData
      const formData = new FormData();
      formData.append("title", selectedService.name);
      formData.append("service", selectedService._id || "");
      formData.append("description", description);
      formData.append("scheduled_date", scheduledDate?.toISOString() || "");
      formData.append("asset_id", asset || "");
      formData.append("notes", notes || "");

      // ✅ Append multiple images
      attachments.forEach((image, index) => {
        // Use correct keys depending on picker
        const uri = image.uri || image.url;
        const name = image.fileName || image.filename || `photo_${index}.jpg`;
        const type = image.type || "image/jpeg";

        if (uri) {
          formData.append("attachments", {
            uri,
            type,
            name,
          } as any);
        }
      });
      // ✅ API call
      const res = await api.post("/workorders", formData, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
        // ✅ Use async storage for auth token if needed
        // Authorization: `Bearer ${await AsyncStorage.getItem("authToken")}`,
      });

      console.log("✅ Work order created:", res.data);
      Alert.alert("✅ Success", "Work order created successfully");
      navigation.navigate("CustomerTabs", {
        screen: "ServiceRequest",
      });
    } catch (err: any) {
      // ✅ Better error handling
      if (err.response) {
        console.error("❌ Backend error:", err.response.data);
        Alert.alert("❌ Error", err.response.data?.message || "Failed to create work order");
      } else if (err.request) {
        console.error("❌ No response from server:", err.request);
        Alert.alert("❌ Error", "No response from server");
      } else {
        console.error("❌ Request setup error:", err.message);
        Alert.alert("❌ Error", err.message);
      }
    } finally {
      setLoading(false); // hide loader
    }
  };


  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setScheduledDate(selectedDate);
  };

  const handlePickAttachment = async () => {
    const hasPermission = await requestPermissions();

    Alert.alert("Upload", "Choose file type", [
      { text: "📸 Camera", onPress: pickCamera },
      { text: "🖼️ Gallery", onPress: pickImage },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const pickCamera = async () => {
    const result = await launchCamera({ mediaType: "photo" });
    if (result.assets && result.assets.length > 0) {
      const newFiles = result.assets.map((file) => ({
        filename: file.fileName || "photo.jpg",
        url: file.uri,
      }));
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: "photo" });
    if (result.assets && result.assets.length > 0) {
      const newFiles = result.assets.map((file) => ({
        filename: file.fileName || "image.jpg",
        url: file.uri,
      }));
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };


  return (
    <LinearGradient colors={["#4c669f", "#415580", "#394b7d"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading && (
          <View style={styles.loadingOverlay}>
            <Text style={{ color: "#fff", fontSize: 16 }}>Submitting...</Text>
             <ActivityIndicator size="large" color="#4a90e2" />
          </View>
        )}

        {/* Title */}
        <View style={styles.card}>
          <Text style={styles.label}>Service *</Text>

          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowServicePicker(true)}
          >
            <Text>
              {selectedService
                ? selectedService.name
                : "Tap to select a service"}
            </Text>
          </TouchableOpacity>
        </View>
        {/* Description */}
        <View style={styles.card}>
          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input]}
            placeholder="Describe the issue or task"
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>


        {/* Scheduled Date */}
        <View style={styles.card}>
          <Text style={styles.label}>Scheduled Date</Text>
          <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{scheduledDate.toDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={scheduledDate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>

        {/* Asset */}
        <View style={styles.card}>
          <Text style={styles.label}>Asset (Optional)</Text>
          <Picker selectedValue={asset} onValueChange={(v) => setAsset(v)}>
            <Picker.Item label="None" value="" />
            <Picker.Item label="Air Conditioner - Unit 1" value="100" />
            <Picker.Item label="Generator - Unit 2" value="101" />
          </Picker>
        </View>

        {/* Attachments */}
        <View style={styles.card}>
          <Text style={styles.label}>Attachment (Optional)</Text>

          {/* Pick Button */}
          <TouchableOpacity style={styles.attachBtn} onPress={handlePickAttachment}>
            <Text style={styles.attachBtnText}>+ Add</Text>
          </TouchableOpacity>

          {/* Show Selected Attachments */}
          {attachments.map((file, idx) => (
            <Text key={idx} style={styles.fileText}>📎 {file.filename}</Text>
          ))}
        </View>

        {/* Notes */}
        <View style={styles.card}>
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, { minHeight: 80 }]}
            placeholder="Add any notes for the technician..."
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleCreateOrder}>
          <Text style={styles.buttonText}>Submit Work Order</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Service Picker Modal */}
      <Modal
        visible={showServicePicker}
        animationType="slide"
        onRequestClose={() => setShowServicePicker(false)} // Android back button
      >
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
          {/* Header / Close Button */}
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowServicePicker(false)}>
              <Text style={styles.closeBtn}>Close ✕</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select a Service</Text>
          </View>

          {/* Service List */}
          <ServiceListScreen
            onSelectService={(service) => {
              setSelectedService(service);
              setShowServicePicker(false);
            }}
          />
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 50 },
  pageTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  label: { fontSize: 15, fontWeight: "600", marginBottom: 6, color: "#444" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#fefefe",
    fontSize: 15,
  },
  datePicker: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: "#fefefe",
  },
  dateText: { fontSize: 15, color: "#333" },
  button: {
    backgroundColor: "#ff6f00",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000000ff",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  closeBtn: { color: "red", fontSize: 16, marginRight: 12 },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  attachBtn: {
    backgroundColor: "#4c669f",
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: "center",

  },
  attachBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  fileText: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 16,
    marginLeft: 10,
  }, loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
});

export default CreateWorkOrderScreen;
