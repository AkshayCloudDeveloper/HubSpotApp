import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import api from "../../../api/api";

type Service = {
  _id: number;
  name: string;
  description?: string;
  status: string;
  price?: string;
  notes?: string;
};

type Props = {
  onSelectService: (service: Service) => void;
  navigation?: any;
};

const ServiceListScreen = ({ onSelectService, navigation }: Props) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await api.get("/services");
      setServices(res.data);
      console.log("Fetched services:", res.data);
    } catch (err) {
      console.warn("⚠️ Using dummy data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 20 }} />;

  return (
    <View style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : services.length > 0 ? (
        <FlatList
          data={services}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => {
                onSelectService(item);
                if (navigation) navigation.goBack();
              }}
            >
              <Text style={styles.title}>{item.name}</Text>
              {item.price && <Text style={styles.price}>${item.price}</Text>}
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          No services found
        </Text>
      )}
    </View>
  );

};

export default ServiceListScreen;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: "#fff",
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: "bold" },
  price: { fontSize: 14, color: "green", marginTop: 4 },
});
