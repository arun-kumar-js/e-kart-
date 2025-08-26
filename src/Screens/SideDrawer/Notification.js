import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  Text,
  useWindowDimensions,
  View,
  FlatList,
  Image,
} from "react-native";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NOTIFICATION, API_ACCESS_KEY } from "../../config/config";
import Header from "../../components/Header";

const Notifications = () => {
  const navigation = useNavigation();
  console.log("Notifications component mounted");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchNotifications = async () => {
    console.log("Starting Notifications API fetch...");
    setLoading(true);
    setErrorMessage("");
    try {
      const formData = new FormData();
      formData.append("get-notifications", "1");
      formData.append("accesskey", API_ACCESS_KEY);

      const response = await axios.post(NOTIFICATION, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("API response raw:", response.data);

      // Expect notifications in response.data.data as an array
      if (
        response.data &&
        !response.data.error &&
        Array.isArray(response.data.data)
      ) {
        setNotifications(response.data.data);
      } else {
        console.log("API returned error or empty content", response.data);
        setErrorMessage("API returned error or empty content");
      }
    } catch (error) {
      console.log("API fetch error:", error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
      console.log("API fetch finished");
    }
  };

  useFocusEffect(
    useCallback(() => {
      console.log("Notifications page focused, triggering API fetch...");
      fetchNotifications();
    }, [])
  );

  const renderNotificationItem = ({ item }) => (
    <View style={styles.card}>
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={styles.notificationImage}
          resizeMode="cover"
        />
      ) : null}
      <Text style={styles.notificationTitle}>
        {item.name || "Notification"}
      </Text>
      <Text style={styles.notificationBody}>{item.subtitle || ""}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Notifications"
        onBack={() => navigation.navigate("MainDrawer", { screen: "Home" })}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#EE2737" />
      ) : errorMessage ? (
        <View style={{ padding: 20 }}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </View>
      ) : (
        <View style={{ flex: 1, padding: 20 }}>
          <FlatList
            data={notifications}
            keyExtractor={(item, index) =>
              item.id ? item.id.toString() : index.toString()
            }
            renderItem={renderNotificationItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text
                style={{ textAlign: "center", color: "#888", marginTop: 30 }}
              >
                No notifications found.
              </Text>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 15,
  },
  notificationImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Poppins",
    color: "#EE2737",
    marginBottom: 15,
  },
  errorText: { fontSize: 16, color: "#000", fontFamily: "Poppins" },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 5,
    fontFamily: "Poppins",
  },
  notificationBody: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Poppins",
  },
});

export default Notifications;
