import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Platform,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { WALLET, API_ACCESS_KEY } from "../config/config";

const Profile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    city: "",
    area: "",
    zipCode: "",
    address: "",
    location: "",
    dateOfBirth: "",
  });

  // Address management state
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  // Get addresses from AsyncStorage
  const getAddresses = async () => {
    try {
      const addressesString = await AsyncStorage.getItem("userAddresses");
      if (addressesString) {
        const parsedAddresses = JSON.parse(addressesString);
        setAddresses(parsedAddresses);
        console.log("📱 PROFILE - Addresses loaded:", parsedAddresses);

        // Set the first address as default if available
        if (parsedAddresses.length > 0) {
          updateFormDataWithAddress(parsedAddresses[0]);
        }
      }
    } catch (error) {
      console.error("📱 PROFILE - Error loading addresses:", error);
    }
  };

  // Update form data with address information
  const updateFormDataWithAddress = (address) => {
    setFormData((prev) => ({
      ...prev,
      city: address.city_name || address.city || "",
      area: address.area_name || address.area || "",
      zipCode: address.pincode || address.zipCode || "",
      address: address.street || address.address || "",
      location: `${address.area_name || ""}, ${address.city_name || ""}, ${
        address.pincode || ""
      }`,
    }));
  };

  // Create user address object from user data
  const createUserAddress = (userData) => {
    return {
      id: userData.user_id,
      street: userData.address || userData.street || "",
      city_name: userData.city_name || "",
      area_name: userData.area_name || userData.area_id || "",
      pincode: userData.pincode || "",
      city_id: userData.city_id || "",
      area_id: userData.area_id || "",
      latitude: userData.latitude || "",
      longitude: userData.longitude || "",
      is_default: true,
    };
  };

  // Fetch fresh user data from API
  const fetchUserDataFromAPI = async () => {
    try {
      const userDataString = await AsyncStorage.getItem("userData");
      if (!userDataString) {
        console.log(
          "📱 PROFILE - No user data in AsyncStorage to fetch from API"
        );
        return null;
      }

      const currentUserData = JSON.parse(userDataString);
      const user_id = currentUserData.user_id;

      if (!user_id) {
        console.log("📱 PROFILE - No user_id found in current user data");
        return null;
      }

      // Prepare form data for API call
      const formDataToSend = new FormData();
      formDataToSend.append("accesskey", API_ACCESS_KEY);
      formDataToSend.append("get_user_data", "1");
      formDataToSend.append("user_id", user_id);

      console.log("📱 PROFILE - Fetching user data from API:");
      console.log("URL:", WALLET);
      console.log("accesskey:", API_ACCESS_KEY);
      console.log("get_user_data:", "1");
      console.log("user_id:", user_id);

      // Make API call to get fresh user data
      const response = await axios.post(WALLET, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("📱 PROFILE - API Response Status:", response.status);
      console.log("📱 PROFILE - API Response Data:", response.data);

      if (response.data && response.data.error === false) {
        const freshUserData = response.data.data || response.data;
        console.log("📱 PROFILE - Fresh user data received:", freshUserData);

        // Update AsyncStorage with fresh data
        await AsyncStorage.setItem("userData", JSON.stringify(freshUserData));

        return freshUserData;
      } else {
        console.log("📱 PROFILE - API returned error:", response.data?.message);
        return null;
      }
    } catch (error) {
      console.error("📱 PROFILE - Error fetching user data from API:", error);
      if (error.response) {
        console.log("📱 PROFILE - Server error:", error.response.data);
      } else if (error.request) {
        console.log("📱 PROFILE - Network error");
      }
      return null;
    }
  };

  // Get user data from navigation params, API, or AsyncStorage
  const getUserData = async () => {
    try {
      setLoading(true);

      // First check if user data was passed via navigation
      const navigationUserData = route.params?.userData;

      if (navigationUserData) {
        setUserData(navigationUserData);
        setFormData({
          name: navigationUserData.name || navigationUserData.user_name || "",
          email:
            navigationUserData.email || navigationUserData.user_email || "",
          mobile: navigationUserData.mobile || navigationUserData.phone || "",
          city: navigationUserData.city_name || navigationUserData.city || "",
          area:
            navigationUserData.area_name ||
            navigationUserData.area_id ||
            navigationUserData.area ||
            "",
          zipCode:
            navigationUserData.pincode || navigationUserData.zipCode || "",
          address:
            navigationUserData.address || navigationUserData.street || "",
          location:
            navigationUserData.location ||
            `${navigationUserData.area_name || ""}, ${
              navigationUserData.city_name || ""
            }, ${navigationUserData.pincode || ""}`,
          dateOfBirth:
            navigationUserData.dob || navigationUserData.dateOfBirth || "",
        });

        // Create and save user address to AsyncStorage
        const userAddress = createUserAddress(navigationUserData);
        await AsyncStorage.setItem(
          "userAddresses",
          JSON.stringify([userAddress])
        );
        setAddresses([userAddress]);
        console.log(
          "📱 PROFILE - User data received from navigation:",
          navigationUserData
        );
        setLoading(false);
        return;
      }

      // Fallback to AsyncStorage if no navigation data
      const userDataString = await AsyncStorage.getItem("userData");
      const userToken = await AsyncStorage.getItem("userToken");

      if (userDataString) {
        const parsedUserData = JSON.parse(userDataString);
        setUserData(parsedUserData);
        setFormData({
          name: parsedUserData.name || parsedUserData.user_name || "",
          email: parsedUserData.email || parsedUserData.user_email || "",
          mobile: parsedUserData.mobile || parsedUserData.phone || "",
          city: parsedUserData.city_name || parsedUserData.city || "",
          area:
            parsedUserData.area_name ||
            parsedUserData.area_id ||
            parsedUserData.area ||
            "",
          zipCode: parsedUserData.pincode || parsedUserData.zipCode || "",
          address: parsedUserData.address || parsedUserData.street || "",
          location:
            parsedUserData.location ||
            `${parsedUserData.area_name || ""}, ${
              parsedUserData.city_name || ""
            }, ${parsedUserData.pincode || ""}`,
          dateOfBirth: parsedUserData.dob || parsedUserData.dateOfBirth || "",
        });

        // Create and save user address to AsyncStorage if not already saved
        const userAddress = createUserAddress(parsedUserData);
        const existingAddresses = await AsyncStorage.getItem("userAddresses");
        if (!existingAddresses) {
          await AsyncStorage.setItem(
            "userAddresses",
            JSON.stringify([userAddress])
          );
          setAddresses([userAddress]);
        }
        console.log(
          "📱 PROFILE - User data loaded from AsyncStorage:",
          parsedUserData
        );
      } else {
        console.log("📱 PROFILE - No user data found in AsyncStorage");
        setUserData(null);
      }
    } catch (error) {
      console.error("📱 PROFILE - Error loading user data:", error);
      Alert.alert("Error", "Failed to load user profile data");
    } finally {
      setLoading(false);
    }
  };

  // Refresh profile data
  const onRefresh = async () => {
    setRefreshing(true);
    await getUserData();
    setRefreshing(false);
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle update profile
  const handleUpdateProfile = () => {
    Alert.alert(
      "Update Profile",
      "Are you sure you want to update your profile?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Update",
          onPress: () => {
            // Here you would typically make an API call to update the profile
            console.log("📱 PROFILE - Updating profile with data:", formData);
            setIsEditing(false);
            Alert.alert("Success", "Profile updated successfully!");
          },
        },
      ]
    );
  };

  // Logout function
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("userData");
            await AsyncStorage.removeItem("userToken");
            setUserData(null);
            console.log("📱 PROFILE - User logged out successfully");
            navigation.navigate("Login");
          } catch (error) {
            console.error("📱 PROFILE - Error during logout:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  // Load user data on component mount
  useEffect(() => {
    getUserData();
    getAddresses();
  }, []);

  // Handle address selection
  const handleAddressSelect = (address, index) => {
    setSelectedAddressIndex(index);
    updateFormDataWithAddress(address);
    setIsEditing(false); // Exit edit mode when address changes
  };

  // Save address changes to AsyncStorage
  const saveAddressChanges = async () => {
    try {
      if (addresses.length > 0) {
        const updatedAddresses = [...addresses];
        const currentAddress = updatedAddresses[selectedAddressIndex];

        // Update the selected address with form data
        updatedAddresses[selectedAddressIndex] = {
          ...currentAddress,
          state_name: formData.state,
          city_name: formData.city,
          area_name: formData.area,
          pincode: formData.zipCode,
          street: formData.address,
        };

        // Also update the main userData in AsyncStorage
        if (userData) {
          const updatedUserData = {
            ...userData,
            state_name: formData.state,
            city_name: formData.city,
            area_name: formData.area,
            pincode: formData.zipCode,
            address: formData.address,
            street: formData.address,
          };
          await AsyncStorage.setItem(
            "userData",
            JSON.stringify(updatedUserData)
          );
          setUserData(updatedUserData);
        }

        // Save to AsyncStorage
        await AsyncStorage.setItem(
          "userAddresses",
          JSON.stringify(updatedAddresses)
        );
        setAddresses(updatedAddresses);

        Alert.alert("Success", "Address updated successfully!");
        setIsEditing(false);
      }
    } catch (error) {
      console.error("📱 PROFILE - Error saving address:", error);
      Alert.alert("Error", "Failed to save address changes");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading Profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!userData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.noDataContainer}>
          <Icon name="person-outline" size={80} color="#ccc" />
          <Text style={styles.noDataTitle}>No Profile Data</Text>
          <Text style={styles.noDataSubtitle}>
            Please login to view your profile
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.loginButtonText}>Go to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="log-out-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Profile Avatar Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {userData.profile_image ? (
              <Image
                source={{ uri: userData.profile_image }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.defaultProfileImage}>
                <Text style={styles.profileInitial}>
                  {(userData.name || userData.user_name || "U")
                    .charAt(0)
                    .toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.userRole}>
            {userData.name || userData.user_name || "User"}
          </Text>
        </View>

        {/* Profile Form */}
        <View style={styles.formContainer}>
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={[styles.textInput, !isEditing && styles.disabledInput]}
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
                editable={isEditing}
                placeholder="Enter your name"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={[styles.textInput, !isEditing && styles.disabledInput]}
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                editable={isEditing}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Mobile No</Text>
              <TextInput
                style={[styles.textInput, !isEditing && styles.disabledInput]}
                value={formData.mobile}
                onChangeText={(text) => handleInputChange("mobile", text)}
                editable={isEditing}
                placeholder="Enter your mobile number"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Address Information</Text>

            {/* Address Selector */}
            {addresses.length > 0 && (
              <View style={styles.addressSelectorContainer}>
                <Text style={styles.inputLabel}>Select Address</Text>
                <View style={styles.addressSelector}>
                  {addresses.map((address, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.addressOption,
                        selectedAddressIndex === index &&
                          styles.selectedAddressOption,
                      ]}
                      onPress={() => handleAddressSelect(address, index)}
                    >
                      <Text
                        style={[
                          styles.addressOptionText,
                          selectedAddressIndex === index &&
                            styles.selectedAddressOptionText,
                        ]}
                      >
                        {address.street || `Address ${index + 1}`}
                      </Text>
                      <Text style={styles.addressOptionSubtext}>
                        {address.city_name || address.city},{" "}
                        {address.state_name || address.state}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select State</Text>
              <View
                style={[
                  styles.dropdownInput,
                  !isEditing && styles.disabledInput,
                ]}
              >
                <Text style={styles.dropdownText}>{formData.state}</Text>
                {isEditing && (
                  <Icon name="chevron-down" size={20} color="#666" />
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select City</Text>
              <View
                style={[
                  styles.dropdownInput,
                  !isEditing && styles.disabledInput,
                ]}
              >
                <Text style={styles.dropdownText}>{formData.city}</Text>
                {isEditing && (
                  <Icon name="chevron-down" size={20} color="#666" />
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Select Area</Text>
              <View
                style={[
                  styles.dropdownInput,
                  !isEditing && styles.disabledInput,
                ]}
              >
                <Text style={styles.dropdownText}>{formData.area}</Text>
                {isEditing && (
                  <Icon name="chevron-down" size={20} color="#666" />
                )}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Zip Code</Text>
              <TextInput
                style={[styles.textInput, !isEditing && styles.disabledInput]}
                value={formData.zipCode}
                onChangeText={(text) => handleInputChange("zipCode", text)}
                editable={isEditing}
                placeholder="Enter zip code"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={[
                  styles.textAreaInput,
                  !isEditing && styles.disabledInput,
                ]}
                value={formData.address}
                onChangeText={(text) => handleInputChange("address", text)}
                editable={isEditing}
                placeholder="Enter your address"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={[
                  styles.textAreaInput,
                  !isEditing && styles.disabledInput,
                ]}
                value={formData.location}
                onChangeText={(text) => handleInputChange("location", text)}
                editable={isEditing}
                placeholder="Enter your location"
                multiline
                numberOfLines={2}
              />
            </View>
          </View>

          {/* Map Section */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Location Map</Text>
            <View style={styles.mapContainer}>
              <View style={styles.mapPlaceholder}>
                <Icon name="map-outline" size={40} color="#ccc" />
                <Text style={styles.mapPlaceholderText}>Map View</Text>
                <Text style={styles.mapPlaceholderSubtext}>
                  Location: {formData.location}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Additional Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date Of Birth (Optional)</Text>
              <TextInput
                style={[styles.textInput, !isEditing && styles.disabledInput]}
                value={formData.dateOfBirth}
                onChangeText={(text) => handleInputChange("dateOfBirth", text)}
                editable={isEditing}
                placeholder="DD/MM/YYYY"
              />
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {isEditing ? (
            <View style={styles.editActionButtons}>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleUpdateProfile}
              >
                <Text style={styles.updateButtonText}>UPDATE PROFILE</Text>
              </TouchableOpacity>
              {addresses.length > 0 && (
                <TouchableOpacity
                  style={styles.updateAddressButton}
                  onPress={saveAddressChanges}
                >
                  <Text style={styles.updateAddressButtonText}>
                    UPDATE ADDRESS
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate("EditProfile", { userData: userData })
              }
            >
              <Text style={styles.editButtonText}>EDIT PROFILE</Text>
            </TouchableOpacity>
          )}
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
  logoutButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  noDataTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  noDataSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 30,
    paddingVertical: 20,
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#FF0000",
  },
  defaultProfileImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: "#FF0000",
    justifyContent: "center",
    alignItems: "center",
  },
  userRole: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },
  formContainer: {
    marginBottom: 30,
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
  dropdownInput: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
  },
  disabledInput: {
    backgroundColor: "#f8f9fa",
    color: "#666",
  },
  mapContainer: {
    height: 200,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginTop: 10,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 5,
    textAlign: "center",
  },
  actionSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  updateButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 15,
    minWidth: 200,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  editButton: {
    backgroundColor: "#FF0000",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 15,
    minWidth: 200,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  addressSelectorContainer: {
    marginBottom: 20,
  },
  addressSelector: {
    gap: 10,
  },
  addressOption: {
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  selectedAddressOption: {
    borderWidth: 0,
  },
  addressOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  selectedAddressOptionText: {
    color: "#333",
  },
  addressOptionSubtext: {
    fontSize: 12,
    color: "#666",
  },
  editActionButtons: {
    gap: 15,
    marginBottom: 15,
  },
  updateAddressButton: {
    backgroundColor: "#28a745",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    minWidth: 200,
  },
  updateAddressButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Profile;
