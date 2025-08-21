import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import api from "../../../api/api";

const CreateWorkOrderScreen: React.FC = () => {
  const navigation = useNavigation<any>(); // using "any" to skip typing

  const [scheduledDate, setScheduledDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState<string>("");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

  const handleCreateOrder = async () => {
    try {
      await api.post("/workorders", {
        title: "",
        description: "",
        service_id: "",
        priority: "medium",
        scheduled_date: scheduledDate,
        notes,
      });

      Alert.alert("✅ Success", "Work order created successfully");
      navigation.navigate("WorkOrderList");
    } catch (err) {
      console.error("Error creating work order:", err);
      Alert.alert("❌ Error", "Failed to create work order");
    }
  };

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setScheduledDate(selectedDate);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>

      {/* Service Info */}
      <View style={styles.card}>
        <Text style={styles.label}>Service</Text>
        <Text style={styles.value}>{"ub"}</Text>
        <Text style={styles.subValue}>{"oj"}</Text>
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

      {/* Notes */}
      <View style={styles.card}>
        <Text style={styles.label}>Notes</Text>
        <TextInput
          style={styles.input}
          placeholder="Add any notes for the technician..."
          multiline
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleCreateOrder}>
        <Text style={styles.buttonText}>🚀 Submit Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafc", padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#222",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 6, color: "#444" },
  value: { fontSize: 16, fontWeight: "500", color: "#007bff" },
  subValue: { fontSize: 14, color: "#666", marginTop: 4 },
  datePicker: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: "#fefefe",
  },
  dateText: { fontSize: 16, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
    backgroundColor: "#fefefe",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#007bff",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 6,
  },
  buttonText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
});

export default CreateWorkOrderScreen;
