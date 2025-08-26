import React, { useState, useCallback } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import axios from "axios";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { ABOUT, API_ACCESS_KEY } from "../../config/config";
import RenderHTML from "react-native-render-html";
import Header from "../../components/Header";

const PrivacyPolicy = () => {
  const navigation = useNavigation();
  console.log("PrivacyPolicy component mounted");
  const [apiResponse, setApiResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { width } = useWindowDimensions();

  const fetchPrivacy = async () => {
    console.log("Starting Privacy API fetch...");
    setLoading(true);
    setErrorMessage("");
    try {
      const formData = new FormData();
      formData.append("settings", "1");
      formData.append("get_privacy", "1");
      formData.append("accesskey", API_ACCESS_KEY);

      const response = await axios.post(ABOUT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("API response raw:", response);

      if (response.data && !response.data.error) {
        console.log("API response privacy:", response.data.privacy);
        setApiResponse(
          typeof response.data.privacy === "string"
            ? response.data.privacy
            : JSON.stringify(response.data.privacy)
        );
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
      console.log("Privacy page focused, triggering API fetch...");
      fetchPrivacy();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Privacy Policy"
        onBack={() => navigation.navigate("MainDrawer", { screen: "Home" })}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#EE2737" />
      ) : errorMessage ? (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Text style={styles.errorText}>{errorMessage}</Text>
        </ScrollView>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View style={styles.card}>
            <Text style={styles.heading}>Privacy Policy</Text>
            <RenderHTML source={{ html: apiResponse }} contentWidth={width} />
          </View>
        </ScrollView>
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
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Poppins",
    color: "#000",
    marginBottom: 15,
    textAlign: "center",
  },
  errorText: { fontSize: 16, color: "#000", fontFamily: "Poppins" },
});

export default PrivacyPolicy;
