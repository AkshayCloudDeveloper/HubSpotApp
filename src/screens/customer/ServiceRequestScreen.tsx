import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WorkOrderListScreen from './services/WorkOrderListScreen';


export default function ServiceRequestScreen() {
  return (
    <View style={styles.container}>
      <WorkOrderListScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
