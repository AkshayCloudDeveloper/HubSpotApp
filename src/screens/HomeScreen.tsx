import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

export default function HomeScreen() {
  return (
     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Icon name="home-outline" size={50} color="blue" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 24, fontWeight: "bold" },
});
