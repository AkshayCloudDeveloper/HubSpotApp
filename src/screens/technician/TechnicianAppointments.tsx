import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TechnicianAppointments() {
  return (
    <View style={styles.container}>
      <Text>Technician Appointments</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
