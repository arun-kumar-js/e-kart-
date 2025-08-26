import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { GET_ALL_ADDRESSES, API_ACCESS_KEY } from "../config/config";

const EditProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    state: "",
    city: "",
    area: "",
    zipCode: "",
    address: "",
    location: "",
    dateOfBirth: "",
  });

  // Load user data from navigation params
  useEffect(() => {
    const userData = route.params?.userData;
    if (userData) {
      setFormData({
        name: userData.name || userData.user_name || "",
        email: userData.email || userData.user_email || "",
        mobile: userData.mobile || userData.phone || "",
        state: userData.state_name || userData.state || "",
        city: userData.city_name || userData.city || "",
        area: userData.area_name || userData.area_id || userData.area || "",
        zipCode: userData.pincode || userData.zipCode || "",
        address: userData.address || userData.street || "",
        location:
          userData.location ||
          `${userData.area_name || ""}, ${userData.city_name || ""}, ${
            userData.state_name || ""
          }, ${userData.pincode || ""}`,
        dateOfBirth: userData.dob || userData.dateOfBirth || "",
      });
    }
  }, [route.params]);

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle save profile
  const handleSaveProfile = async () => {
    try {
      setLoading(true);

      // Get current user data from AsyncStorage
      const userDataString = await AsyncStorage.getItem("userData");
      if (userDataString) {
        const currentUserData = JSON.parse(userDataString);

        // Prepare form data for API call
        const formData = new FormData();
        formData.append("accesskey", API_ACCESS_KEY);
        formData.append("pincode", formData.zipCode);
        formData.append("latitude", currentUserData.latitude || "");
        formData.append("mobile", formData.mobile);
        formData.append("type", "edit-profile");
        formData.append("user_id", currentUserData.user_id);
        formData.append("area_id", currentUserData.area_id || "");
        formData.append("street", formData.address);
        formData.append("dob", formData.dateOfBirth);
        formData.append("name", formData.name);
        formData.append("id", currentUserData.user_id);
        formData.append("state_id", currentUserData.state_id || "");
        formData.append("email", formData.email);
        formData.append("fcm_id", currentUserData.fcm_id || "");
        formData.append("city_id", currentUserData.city_id || "");
        formData.append("longitude", currentUserData.longitude || "");

        // Console log the FormData being sent
        console.log("📱 EDIT PROFILE - FormData being sent:");
        console.log("URL:", GET_ALL_ADDRESSES);
        console.log("FormData contents:");
        console.log("accesskey:", API_ACCESS_KEY);
        console.log("pincode:", formData.zipCode);
        console.log("latitude:", currentUserData.latitude || "");
        console.log("mobile:", formData.mobile);
        console.log("type:", "edit-profile");
        console.log("user_id:", currentUserData.user_id);
        console.log("area_id:", currentUserData.area_id || "");
        console.log("street:", formData.address);
        console.log("dob:", formData.dateOfBirth);
        console.log("name:", formData.name);
        console.log("id:", currentUserData.user_id);
        console.log("state_id:", currentUserData.state_id || "");
        console.log("email:", formData.email);
        console.log("fcm_id:", currentUserData.fcm_id || "");
        console.log("city_id:", currentUserData.city_id || "");
        console.log("longitude:", currentUserData.longitude || "");
        console.log("Current user data:", currentUserData);

        // Make API call to update profile
        const response = await axios.post(GET_ALL_ADDRESSES, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("📱 EDIT PROFILE - API Response Status:", response.status);
        //l; console.log(
        //   "📱 EDIT PROFILE - API Response Headers:",
        //   response.headers
        // );
        console.log("📱 EDIT PROFILE - API Response Data:", response.data);
        //console.log("📱 EDIT PROFILE - Full Response Object:", response);

        // Check if API call was successful
        if (response.data && response.data.error === false) {
          // Update user data with form values
          const updatedUserData = {
            ...currentUserData,
            name: formData.name,
            email: formData.email,
            mobile: formData.mobile,
            state_name: formData.state,
            city_name: formData.city,
            area_name: formData.area,
            pincode: formData.zipCode,
            address: formData.address,
            street: formData.address,
            dob: formData.dateOfBirth,
          };

          // Save updated user data to AsyncStorage
          await AsyncStorage.setItem(
            "userData",
            JSON.stringify(updatedUserData)
          );

          // Also update addresses if they exist
          const addressesString = await AsyncStorage.getItem("userAddresses");
          if (addressesString) {
            const addresses = JSON.parse(addressesString);
            if (addresses.length > 0) {
              // Update the first address (assuming it's the main user address)
              addresses[0] = {
                ...addresses[0],
                street: formData.address,
                city_name: formData.city,
                state_name: formData.state,
                area_name: formData.area,
                pincode: formData.zipCode,
              };
              await AsyncStorage.setItem(
                "userAddresses",
                JSON.stringify(addresses)
              );
            }
          }

          Alert.alert("Success", "Profile updated successfully!", [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]);
        } else {
          // API returned an error
          const errorMessage =
            response.data?.message || "Failed to update profile";
          Alert.alert("Error", errorMessage);
        }
      }
    } catch (error) {
      console.error("📱 EDIT PROFILE - Error saving profile:", error);
      if (error.response) {
        // Server responded with error
        const errorMessage =
          error.response.data?.message || "Server error occurred";
        Alert.alert("Error", errorMessage);
      } else if (error.request) {
        // Network error
        Alert.alert("Error", "Network error. Please check your connection.");
      } else {
        // Other error
        Alert.alert("Error", "Failed to save profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveProfile}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Personal Information */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.textInput}
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
              placeholder="Enter your name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mobile No</Text>
            <TextInput
              style={styles.textInput}
              value={formData.mobile}
              onChangeText={(text) => handleInputChange("mobile", text)}
              placeholder="Enter your mobile number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Address Information */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Address Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>State</Text>
            <TextInput
              style={styles.textInput}
              value={formData.state}
              onChangeText={(text) => handleInputChange("state", text)}
              placeholder="Enter your state"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>City</Text>
            <TextInput
              style={styles.textInput}
              value={formData.city}
              onChangeText={(text) => handleInputChange("city", text)}
              placeholder="Enter your city"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Area</Text>
            <TextInput
              style={styles.textInput}
              value={formData.area}
              onChangeText={(text) => handleInputChange("area", text)}
              placeholder="Enter your area"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Zip Code</Text>
            <TextInput
              style={styles.textInput}
              value={formData.zipCode}
              onChangeText={(text) => handleInputChange("zipCode", text)}
              placeholder="Enter zip code"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              style={styles.textAreaInput}
              value={formData.address}
              onChangeText={(text) => handleInputChange("address", text)}
              placeholder="Enter your address"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Additional Information */}
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Additional Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date Of Birth (Optional)</Text>
            <TextInput
              style={styles.textInput}
              value={formData.dateOfBirth}
              onChangeText={(text) => handleInputChange("dateOfBirth", text)}
              placeholder="DD/MM/YYYY"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#FF0000",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  saveButton: {
    backgroundColor: "#28a745",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  formSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
  textAreaInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
    minHeight: 80,
    textAlignVertical: "top",
  },
});

export default EditProfile;
