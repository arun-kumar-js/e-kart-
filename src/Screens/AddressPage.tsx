import React, { useEffect, useState } from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Platform,
  StatusBar,
  Alert,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import { API_ACCESS_KEY, GET_ALL_ADDRESSES } from "../config/config";
import axios from "axios";
import { s } from "react-native-size-matters";
import Header from "../components/Header";

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  mobile: string;
}

const ChooseAddressScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<{ user_id: string } | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [refreshing, setRefreshing] = useState(false);

  console.log("User data from AsyncStorage:", user);

  const fetchAddresses = async () => {
    try {
      if (!refreshing) setLoading(true);
      const storedUser = await AsyncStorage.getItem("userData");
      console.log("🔍 Raw stored user data:", storedUser);

      if (storedUser) {
        const userObj = JSON.parse(storedUser);
        console.log("🔍 Parsed user object:", userObj);
        console.log("🔍 User ID:", userObj.user_id);
        setUser(userObj);

        console.log(
          "🏠 ADDRESS API CALL - Fetching addresses for user:",
          userObj.user_id
        );

        const formData = new FormData();
        formData.append("user_id", userObj.user_id);
        formData.append("accesskey", API_ACCESS_KEY);
        formData.append("type", "list_address");

        console.log("📤 ADDRESS API REQUEST:", {
          user_id: userObj.user_id,
          accesskey: API_ACCESS_KEY,
          type: "list_address",
          endpoint:
            "https://spiderekart.in/ec_service/api-firebase/user_addresses.php",
        });

        const response = await axios.post(GET_ALL_ADDRESSES, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("✅ ADDRESS API SUCCESS:", {
          status: response.status,
          data: response.data,
          addresses_count: response.data.data?.length || 0,
          error: response.data.error,
        });

        const fetchedAddresses = response.data.data || [];
        setAddresses(fetchedAddresses);

        // Auto-select the first address if available and no address is currently selected
        if (fetchedAddresses.length > 0 && !selectedAddressId) {
          setSelectedAddressId(fetchedAddresses[0].id);
        }
      } else {
        console.log("⚠️ ADDRESS API - No user data found in AsyncStorage");
        Alert.alert("Not Logged In", "Please login to view your addresses", [
          {
            text: "Login",
            onPress: () => navigation.navigate("Login"),
          },
          {
            text: "Cancel",
            style: "cancel",
          },
        ]);
      }
    } catch (error: any) {
      console.error("❌ ADDRESS API ERROR:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        endpoint:
          "https://spiderekart.in/ec_service/api-firebase/user_addresses.php",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Handle address changes and ensure valid selection
  useEffect(() => {
    if (addresses.length > 0) {
      // If current selection is invalid, select the first address
      if (
        !selectedAddressId ||
        !addresses.find((addr) => addr.id === selectedAddressId)
      ) {
        setSelectedAddressId(addresses[0].id);
      }
    } else {
      // No addresses available, clear selection
      setSelectedAddressId(null);
    }
  }, [addresses, selectedAddressId]);

  const deleteAddress = async (addressId: string) => {
    Alert.alert(
      "Delete Address",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const formData = new FormData();
              formData.append("id", addressId);
              formData.append("user_id", user!.user_id);
              formData.append("accesskey", API_ACCESS_KEY);
              formData.append("type", "delete_address");
              console.log("🗑️ DELETE ADDRESS API REQUEST:", {
                id: addressId,
                user_id: user!.user_id,
                accesskey: API_ACCESS_KEY,
                type: "delete_address",
              });

              const response = await axios.post(GET_ALL_ADDRESSES, formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });

              console.log("✅ DELETE ADDRESS API SUCCESS:", {
                status: response.status,
                data: response.data,
                error: response.data.error,
                message: response.data.message,
              });

              if (response.data && !response.data.error) {
                Alert.alert("Success", "Address deleted successfully");
                // Refresh addresses after deletion
                await fetchAddresses();
              } else {
                Alert.alert(
                  "Error",
                  response.data.message || "Failed to delete address"
                );
              }
            } catch (error: any) {
              console.error("❌ DELETE ADDRESS API ERROR:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
              });
              Alert.alert("Error", "Something went wrong");
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Address }) => {
    const isSelected = item.id === selectedAddressId;
    return (
      <TouchableOpacity
        style={styles.addressCard}
        onPress={() => setSelectedAddressId(item.id)}
      >
        <View style={styles.addressRow}>
          <View style={[styles.circle, isSelected && styles.selectedCircle]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.addressName}>{item.name}</Text>
            <Text style={styles.addressStreet}>
              {item.street}, {item.city}, {item.state} - {item.zip}
            </Text>
            <Text style={styles.addressPhone}>{item.mobile}</Text>
          </View>
        </View>
        <View style={styles.buttonGroupBottom}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              if (user && user.user_id) {
                navigation.navigate("AddAddress", {
                  user_id: user.user_id,
                  addressData: item,
                });
              }
            }}
          >
            <Image
              source={require("../Assets/icon/editing.png")}
              style={{ width: 16, height: 16, marginRight: 6 }}
              resizeMode="contain"
            />
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteAddress(item.id)}
          >
            <Image
              source={require("../Assets/icon/delete.png")}
              style={{ width: 16, height: 16, marginRight: 6 }}
              resizeMode="contain"
            />
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ paddingTop: hp("7%"), width: "100%" }}></View>
      <Header title="Choose Address" onBack={() => navigation.goBack()} />
      <View style={[styles.container, { marginTop: hp("2%") }]}>
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          style={{ width: "100%" }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={fetchAddresses}
            />
          }
        />

        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={[styles.bottomButton, styles.addNewButton]}
            onPress={() => {
              if (user && user.user_id) {
                navigation.navigate("AddAddress", { user_id: user.user_id });
              }
            }}
          >
            <Text style={[styles.bottomButtonText, styles.addNewButtonText]}>
              Add New Address
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => {
              if (selectedAddressId) {
                const selectedAddress = addresses.find(
                  (addr) => addr.id === selectedAddressId
                );
                navigation.navigate("Checkout", { selectedAddress });
              } else {
                Alert.alert(
                  "Select Address",
                  "Please select an address to continue"
                );
              }
            }}
          >
            <Text style={styles.bottomButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Stack = createStackNavigator();

const AddressPage: React.FC = () => {
  useEffect(() => {
    if (Platform.OS === "android") {
      StatusBar.setHidden(true, "slide");
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor("transparent");
    }
  }, []);
  return (
    <>
      {Platform.OS === "ios" && (
        <StatusBar
          hidden={true}
          translucent={true}
          backgroundColor="transparent"
          barStyle="light-content"
        />
      )}
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#EF3340",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: "#FFFFFF",
          headerTitleStyle: {
            fontWeight: "normal",
            fontSize: 20,
          },
          headerTitleAlign: "left",
          headerShown: false,
        }}
      >
        <Stack.Screen name="ChooseAddress" component={ChooseAddressScreen} />
      </Stack.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    padding: 20,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 40,
  },
  title: {
    fontSize: 18,
    color: "#333333",
    marginBottom: 25,
    fontFamily: "Poppins",
  },
  button: {
    backgroundColor: "#EF3340",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Poppins",
  },
  addressCard: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "green",
    marginRight: 12,
  },
  selectedCircle: {
    backgroundColor: "green", // changed to theme color
    borderColor: "green",
  },
  selectedAddressCard: {
    borderWidth: 2,
    borderColor: "#EF3340",
  },
  addressText: {
    fontSize: 16,
    color: "#333",
  },
  addressName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  addressStreet: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  addressPhone: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  buttonGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonGroupBottom: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#EF3340",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  editButtonText: {
    color: "#EF3340",
    fontSize: 14,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EF3340",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "#EF3340",
    fontSize: 14,
  },
  bottomButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
  },
  bottomButton: {
    flex: 1,
    backgroundColor: "#EF3340",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  bottomButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  addNewButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#EF3340",
  },
  addNewButtonText: {
    color: "#EF3340",
  },
  debugSection: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    width: "100%",
  },
  debugText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  debugButton: {
    backgroundColor: "#EF3340",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "center",
  },
  debugButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
});

export default AddressPage;
