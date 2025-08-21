import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import api from "../../../api/api"; // your axios instance

// Define service type
type Service = {
  id: number;
  name: string;
  description?: string;
  status: string;
  price?: string;
  notes?: string;
};

// Define Root Stack Params
type RootStackParamList = {
  ServiceList: undefined;
  ServiceDetail: { id: number };
};

// Props type for this screen
type ServiceListScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, "ServiceList">;
  route: RouteProp<RootStackParamList, "ServiceList">;
};

const ServiceListScreen: React.FC<ServiceListScreenProps> = ({ navigation }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      setServices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 16,
              backgroundColor: "#f5f5f5",
              marginBottom: 10,
              borderRadius: 8,
            }}
            onPress={() => navigation.navigate("ServiceDetail", { id: item.id })}
          >
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>Status: {item.status}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ServiceListScreen;
