import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const DashboardScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Today's Jobs */}
        <Text style={styles.sectionTitle}>Today's Jobs</Text>
        <View style={styles.jobsContainer}>
          <View style={[styles.jobCard, { backgroundColor: "#bcf3d9ff" }]}>
            <Text style={styles.jobNumber}>8</Text>
            <Text style={styles.jobLabel}>Total Jobs</Text>
          </View>
          <View style={[styles.jobCard, { backgroundColor: "#c2d7f3ff" }]}>
            <Text style={styles.jobNumber}>5</Text>
            <Text style={styles.jobLabel}>Completed</Text>
          </View>
          <View style={[styles.jobCard, { backgroundColor: "#f7e5cbff" }]}>
            <Text style={styles.jobNumber}>2</Text>
            <Text style={styles.jobLabel}>Pending</Text>
          </View>
        </View>

        {/* Next Job */}
        <Text style={styles.sectionTitle}>Next Job</Text>
        <View style={styles.jobBox}>
          <Text style={styles.jobName}>Jane Smith</Text>
          <Text style={styles.jobDetail}>🌿 Weed/Fert RN2   📍 123 Main St</Text>
          <Text style={styles.notes}>Technician Notes: Check for dandelions in the backyard</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.startBtn}>
              <Text style={styles.btnText}>Start Visit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryText}>Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryText}>All Tags</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.callBtn}>
              <Text style={styles.btnText}>Call</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.notServiceBtn}>
            <Text style={styles.notServiceText}>Mark Not serviceable</Text>
          </TouchableOpacity>
        </View>

        {/* Route/Job List */}
        <Text style={styles.sectionTitle}>Route/ Job List</Text>
        <View style={styles.jobBox}>
          <Text style={styles.jobName}>Henry F.</Text>
          <Text style={styles.jobDetail}>🌿 Weed/Fert RN2   📍 123 Main St</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.startBtn, { opacity: 0.5 }]}>
              <Text style={styles.btnText}>Start Visit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryText}>Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Text style={styles.secondaryText}>All Tags</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.callBtn}>
              <Text style={styles.btnText}>Call</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.notServiceBtn}>
            <Text style={styles.notServiceText}>Mark Not serviceable</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  headerText: { fontSize: 18, fontWeight: "bold" },
  timer: { fontSize: 16, color: "#333" },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginVertical: 10 },
  jobsContainer: { flexDirection: "row", justifyContent: "space-between" },
  jobCard: {
    flex: 1,
    margin: 5,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  jobNumber: { fontSize: 20, fontWeight: "bold" },
  jobLabel: { fontSize: 12, marginTop: 5 },
  jobBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  jobName: { fontSize: 16, fontWeight: "600" },
  jobDetail: { fontSize: 13, color: "#666", marginVertical: 4 },
  notes: { fontSize: 12, color: "#444", fontStyle: "italic", marginBottom: 10 },
  buttonRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  startBtn: {
    backgroundColor: "#3B82F6",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  callBtn: {
    backgroundColor: "#22C55E",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  secondaryBtn: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  btnText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  secondaryText: { color: "#000", fontSize: 13 },
  notServiceBtn: {
    backgroundColor: "#FEE2E2",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  notServiceText: { color: "#B91C1C", fontWeight: "600" },
});
