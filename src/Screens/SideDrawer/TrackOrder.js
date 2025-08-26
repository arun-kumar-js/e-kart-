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
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { TRACK_OREDER, API_ACCESS_KEY } from "../../config/config";
import { commonTextStyles } from "../../config/globalStyles";
import Header from "../../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TrackOrder = ({ navigation }) => {
  console.log("TrackOrder component mounted");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const checkUserData = async () => {
    try {
      setUserLoading(true);
      const storedUser = await AsyncStorage.getItem("userData");

      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        setUser(userObj);
        return userObj;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      console.log("Error checking user data:", error);
      setUser(null);
      return null;
    } finally {
      setUserLoading(false);
    }
  };

  const fetchNotifications = async () => {
    console.log("Starting Notifications API fetch...");
    setLoading(true);
    setErrorMessage("");

    // Check if user is logged in
    const userData = await checkUserData();
    if (!userData || !userData.user_id) {
      setErrorMessage("Please login to view your orders");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("get_orders", "1");
      formData.append("accesskey", API_ACCESS_KEY);
      formData.append("user_id", userData.user_id);

      const response = await axios.post(TRACK_OREDER, formData, {
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
        setErrorMessage("No orders found");
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
      console.log("TrackOrder page focused, checking user data...");
      checkUserData().then((userData) => {
        if (userData && userData.user_id) {
          fetchNotifications();
        }
      });
    }, [])
  );

  const renderNotificationItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.notificationTitle}>Order ID: {item.id}</Text>
      <Text style={styles.notificationBody}>Status: {item.active_status}</Text>
      <Text style={styles.notificationBody}>Date: {item.date_added}</Text>
      <Text style={styles.notificationBody}>Total: RM{item.final_total}</Text>
      <Text style={styles.notificationBody}>
        Payment: {item.payment_method}
      </Text>

      {/* Show products inside this order */}
      {item.items && item.items.length > 0 && (
        <View style={{ marginTop: 10 }}>
          {item.items.map((product, idx) => (
            <View
              key={idx}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              {product.image ? (
                <Image
                  source={{ uri: product.image }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 5,
                    marginRight: 10,
                  }}
                />
              ) : null}
              <View>
                <Text style={[commonTextStyles.productName, { fontSize: 14 }]}>
                  {product.name}
                </Text>
                <Text style={[commonTextStyles.description, { fontSize: 13 }]}>
                  Qty: {product.quantity}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={{ marginTop: 10, alignItems: "flex-end" }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("TrackOrderDetails", { orderData: item })
          }
          style={{ padding: 5 }}
        >
          <Text
            style={[
              commonTextStyles.link,
              { color: "#EE2737", fontWeight: "bold" },
            ]}
          >
            View Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Track Order"
        onBack={() => navigation.navigate("MainDrawer", { screen: "Home" })}
      />
      {userLoading ? (
        <ActivityIndicator size="large" color="#EE2737" />
      ) : !user ? (
        <View style={styles.loginContainer}>
          <Text style={styles.loginMessage}>
            Please login to view your orders
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
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
                style={[
                  commonTextStyles.description,
                  { textAlign: "center", color: "#888", marginTop: 30 },
                ]}
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
  loginContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loginMessage: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    fontFamily: "Poppins",
  },
  loginButton: {
    backgroundColor: "#EE2737",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
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

export default TrackOrder;
