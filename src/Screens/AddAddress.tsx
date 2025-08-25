import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  StatusBar,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Icon from "react-native-vector-icons/Ionicons";
import { commonTextStyles } from "../config/globalStyles";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ADD_NEW_ADDRESS_STATE,
  ADD_NEW_ADDRESS_CITY,
  ADD_NEW_ADDRESS,
  API_ACCESS_KEY,
} from "../config/config";

const HEADER_COLOR = "#F40612";
const BACKGROUND_COLOR = "#FFFFFF";

const AddAddress = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    area: "",
    pincode: "",
    gstNumber: "",
    landmark: "",
  });

  // State and city data
  const [states, setStates] = useState<Array<{ id: string; name: string }>>([]);
  const [cities, setCities] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedState, setSelectedState] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedCity, setSelectedCity] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Modal states
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);
  const [areaModalVisible, setAreaModalVisible] = useState(false);

  // Loading states
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // Location coordinates (you can integrate with actual GPS later)
  const [location, setLocation] = useState({
    latitude: "3.1390", // Default Kuala Lumpur coordinates
    longitude: "101.6869",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fetch states from API
  const fetchStates = async () => {
    try {
      setLoadingStates(true);
      console.log("🏛️ STATES API CALL - Fetching states list");

      const formData = new FormData();
      formData.append("accesskey", API_ACCESS_KEY);

      console.log("📤 STATES API REQUEST:", {
        accesskey: API_ACCESS_KEY,
        endpoint: ADD_NEW_ADDRESS_STATE,
      });

      const response = await axios.post(ADD_NEW_ADDRESS_STATE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ STATES API SUCCESS:", {
        status: response.status,
        data: response.data,
        states_count: response.data?.data?.length || 0,
      });

      if (response.data && response.data.data) {
        setStates(response.data.data);
      }
    } catch (error: any) {
      console.error("❌ STATES API ERROR:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        endpoint: ADD_NEW_ADDRESS_STATE,
      });
    } finally {
      setLoadingStates(false);
    }
  };

  // Fetch cities based on selected state
  const fetchCities = async (stateId: string) => {
    try {
      setLoadingCities(true);
      console.log("🏙️ CITIES API CALL - Fetching cities for state:", stateId);

      const formData = new FormData();
      formData.append("accesskey", API_ACCESS_KEY);
      formData.append("state_id", stateId);

      console.log("📤 CITIES API REQUEST:", {
        accesskey: API_ACCESS_KEY,
        state_id: stateId,
        endpoint: ADD_NEW_ADDRESS_CITY,
      });

      const response = await axios.post(ADD_NEW_ADDRESS_CITY, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ CITIES API SUCCESS:", {
        status: response.status,
        data: response.data,
        cities_count: response.data?.data?.length || 0,
      });

      if (response.data && response.data.data) {
        setCities(response.data.data);
      }
    } catch (error: any) {
      console.error("❌ CITIES API ERROR:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        endpoint: ADD_NEW_ADDRESS_CITY,
      });
    } finally {
      setLoadingCities(false);
    }
  };

  // Handle state selection
  const handleStateSelect = (state: { id: string; name: string }) => {
    console.log("🏛️ STATE SELECTED:", {
      state_id: state.id,
      state_name: state.name,
      action: "Fetching cities for this state",
    });

    setSelectedState(state);
    setFormData((prev) => ({ ...prev, state: state.name }));
    setSelectedCity(null);
    setFormData((prev) => ({ ...prev, city: "" }));
    setCities([]);
    setStateModalVisible(false);

    // Fetch cities for selected state
    fetchCities(state.id);
  };

  // Handle city selection
  const handleCitySelect = (city: { id: string; name: string }) => {
    console.log("🏙️ CITY SELECTED:", {
      city_id: city.id,
      city_name: city.name,
      selected_state: selectedState?.name,
      action: "City added to form data",
    });

    setSelectedCity(city);
    setFormData((prev) => ({ ...prev, city: city.name }));
    setCityModalVisible(false);
  };

  // Load states on component mount
  useEffect(() => {
    fetchStates();
  }, []);

  // Function to get current location (placeholder for GPS integration)
  const getCurrentLocation = () => {
    // This is a placeholder - you can integrate with react-native-geolocation
    // For now, using default coordinates
    console.log("📍 LOCATION - Using default coordinates:", location);
  };

  const handleSubmit = async () => {
    // Validate form
    if (
      !formData.name ||
      !formData.phone ||
      !formData.email ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.area ||
      !formData.pincode
    ) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    // Check if user is logged in
    const storedUser = await AsyncStorage.getItem("userData");
    if (!storedUser) {
      Alert.alert("Error", "Please login to save address");
      return;
    }

    const userData = JSON.parse(storedUser);
    if (!userData.user_id) {
      Alert.alert("Error", "User ID not found");
      return;
    }

    try {
      setLoadingSubmit(true);
      console.log("💾 SAVE ADDRESS API CALL - Saving new address");

      const formDataToSend = new FormData();
      formDataToSend.append("accesskey", API_ACCESS_KEY);
      formDataToSend.append("type", "add_address");
      formDataToSend.append("user_id", userData.user_id);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("mobile", formData.phone);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("street", formData.address);
      formDataToSend.append("pincode", formData.pincode);
      formDataToSend.append("state_id", selectedState?.id || "");
      formDataToSend.append("city_id", selectedCity?.id || "");
      formDataToSend.append("area_id", formData.area);
      formDataToSend.append("landmark", formData.landmark);
      formDataToSend.append("gst_no", formData.gstNumber);
      formDataToSend.append("latitude", location.latitude);
      formDataToSend.append("longitude", location.longitude);

      console.log("📤 SAVE ADDRESS API REQUEST:", {
        accesskey: API_ACCESS_KEY,
        type: "add_address",
        user_id: userData.user_id,
        name: formData.name,
        mobile: formData.phone,
        email: formData.email,
        street: formData.address,
        pincode: formData.pincode,
        state_id: selectedState?.id,
        city_id: selectedCity?.id,
        area_id: formData.area,
        landmark: formData.landmark,
        gst_no: formData.gstNumber,
        latitude: location.latitude,
        longitude: location.longitude,
        endpoint: ADD_NEW_ADDRESS,
      });

      const response = await axios.post(ADD_NEW_ADDRESS, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ SAVE ADDRESS API SUCCESS:", {
        status: response.status,
        data: response.data,
        message: response.data?.message,
        error: response.data?.error,
      });

      if (response.data && !response.data.error) {
        Alert.alert("Success", "Address added successfully!");
        navigation.goBack();
      } else {
        Alert.alert(
          "Error",
          response.data?.message || "Failed to save address"
        );
      }
    } catch (error: any) {
      console.error("❌ SAVE ADDRESS API ERROR:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        endpoint: ADD_NEW_ADDRESS,
      });
      Alert.alert("Error", "Failed to save address. Please try again.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={HEADER_COLOR} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Address</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Address Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              placeholder="Enter your full name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number *</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(value) => handleInputChange("phone", value)}
              placeholder="Enter phone number"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(value) => handleInputChange("email", value)}
              placeholder="Enter email address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address *</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={formData.address}
              onChangeText={(value) => handleInputChange("address", value)}
              placeholder="Enter complete address"
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>State *</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setStateModalVisible(true)}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !selectedState && styles.placeholderText,
                ]}
              >
                {selectedState ? selectedState.name : "Select State"}
              </Text>
              <Icon name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            {loadingStates && (
              <ActivityIndicator
                size="small"
                color={HEADER_COLOR}
                style={styles.loadingIndicator}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>City *</Text>
            <TouchableOpacity
              style={[
                styles.dropdownButton,
                !selectedState && styles.disabledDropdown,
              ]}
              onPress={() => selectedState && setCityModalVisible(true)}
              disabled={!selectedState}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !selectedCity && styles.placeholderText,
                ]}
              >
                {selectedCity
                  ? selectedCity.name
                  : selectedState
                  ? "Select City"
                  : "Select State First"}
              </Text>
              <Icon name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            {loadingCities && (
              <ActivityIndicator
                size="small"
                color={HEADER_COLOR}
                style={styles.loadingIndicator}
              />
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Select Area *</Text>
            <TouchableOpacity
              style={[
                styles.dropdownButton,
                !selectedCity && styles.disabledDropdown,
              ]}
              onPress={() => selectedCity && setAreaModalVisible(true)}
              disabled={!selectedCity}
            >
              <Text
                style={[
                  styles.dropdownText,
                  !formData.area && styles.placeholderText,
                ]}
              >
                {formData.area
                  ? formData.area
                  : selectedCity
                  ? "Select Area"
                  : "Select City First"}
              </Text>
              <Icon name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pincode *</Text>
            <TextInput
              style={styles.input}
              value={formData.pincode}
              onChangeText={(value) => handleInputChange("pincode", value)}
              placeholder="Enter pincode"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>GST Number (Optional)</Text>
            <TextInput
              style={styles.input}
              value={formData.gstNumber}
              onChangeText={(value) => handleInputChange("gstNumber", value)}
              placeholder="Enter GST number"
              placeholderTextColor="#999"
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Landmark (Optional)</Text>
            <TextInput
              style={styles.input}
              value={formData.landmark}
              onChangeText={(value) => handleInputChange("landmark", value)}
              placeholder="Enter nearby landmark"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            style={[
              styles.submitButton,
              loadingSubmit && styles.disabledButton,
            ]}
            onPress={handleSubmit}
            disabled={loadingSubmit}
          >
            {loadingSubmit ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                Save Address & Continue
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* State Selection Modal */}
      <Modal
        visible={stateModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setStateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select State</Text>
              <TouchableOpacity onPress={() => setStateModalVisible(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={states}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleStateSelect(item)}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* City Selection Modal */}
      <Modal
        visible={cityModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCityModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select City</Text>
              <TouchableOpacity onPress={() => setCityModalVisible(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={cities}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleCitySelect(item)}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>

      {/* Area Selection Modal */}
      <Modal
        visible={areaModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setAreaModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Area</Text>
              <TouchableOpacity onPress={() => setAreaModalVisible(false)}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={[
                { id: "1", name: "Downtown" },
                { id: "2", name: "Suburban" },
                { id: "3", name: "Industrial" },
                { id: "4", name: "Residential" },
                { id: "5", name: "Commercial" },
              ]}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    handleInputChange("area", item.name);
                    setAreaModalVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  header: {
    backgroundColor: HEADER_COLOR,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("2%"),
  },
  backButton: {
    padding: wp("2%"),
  },
  headerTitle: {
    ...commonTextStyles.h2,
    color: "#fff",
    textAlign: "center" as const,
    fontWeight: "600" as const,
  },
  placeholder: {
    width: wp("10%"),
  },
  content: {
    flex: 1,
    paddingHorizontal: wp("4%"),
  },
  formContainer: {
    paddingVertical: hp("3%"),
  },
  sectionTitle: {
    ...commonTextStyles.h3,
    color: "#333",
    marginTop: hp("3%"),
    marginBottom: hp("2%"),
    fontWeight: "500" as const,
  },
  inputGroup: {
    marginBottom: hp("2%"),
  },
  label: {
    ...commonTextStyles.body,
    color: "#333",
    marginBottom: hp("1%"),
    fontWeight: "500" as const,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: wp("3%"),
    paddingVertical: hp("1.5%"),
    fontSize: wp("4%"),
    fontFamily: commonTextStyles.body.fontFamily,
    backgroundColor: "#f9f9f9",
  },
  multilineInput: {
    minHeight: hp("8%"),
    textAlignVertical: "top",
  },
  submitButton: {
    backgroundColor: HEADER_COLOR,
    paddingVertical: hp("2%"),
    borderRadius: 8,
    alignItems: "center",
    marginTop: hp("4%"),
    marginBottom: hp("2%"),
  },
  disabledButton: {
    backgroundColor: "#CCC",
    opacity: 0.7,
  },
  submitButtonText: {
    ...commonTextStyles.h3,
    color: "#fff",
    fontWeight: "600" as const,
  },
  // Dropdown styles
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  disabledDropdown: {
    backgroundColor: "#F5F5F5",
    borderColor: "#CCC",
  },
  dropdownText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  placeholderText: {
    color: "#999",
  },
  loadingIndicator: {
    marginTop: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: "90%",
    maxHeight: "70%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    color: "#333",
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  modalItemText: {
    fontSize: 16,
    color: "#333",
  },
});

export default AddAddress;
