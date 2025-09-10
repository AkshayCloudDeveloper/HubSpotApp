import React, { use, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { NativeEventEmitter, NativeModules } from "react-native";

const { Proximity } = NativeModules;
const eventEmitter = new NativeEventEmitter(Proximity);



export default function TechnicianAppointments() {

  useEffect(() => {
    // Start Bluetooth proximity service
   
    }, []);
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
