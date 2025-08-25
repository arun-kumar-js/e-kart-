import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WALLET, API_ACCESS_KEY, GET_PAYMENT_METHODS } from "../config/config";
import { useRoute, useNavigation } from "@react-navigation/native";
import { ORDER_PROCESS } from "../config/config";

const Payment = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { totalAmount, cartItems, selectedAddress, selectedDeliveryMethod } =
    route.params || {};
  console.log("Total Amount:", totalAmount);
  console.log("Cart Items:", cartItems);
  console.log("Selected Address:", selectedAddress);
  console.log("Selected Delivery Method:", selectedDeliveryMethod);
  const [walletChecked, setWalletChecked] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [userData, setUserData] = useState(null);
  const [note, setNote] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  const showDatePicker = () => setIsDatePickerVisible(true);
  const hideDatePicker = () => setIsDatePickerVisible(false);
  const handleConfirm = (selectedDate) => {
    setDeliveryDate(selectedDate);
    hideDatePicker();
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          setUserData(JSON.parse(storedData));
        }
      } catch (error) {
        console.log("Error loading userData:", error);
      }
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        if (!userData) return;
        const user_id = userData.user_id;
        if (!user_id) return;

        const formData = new FormData();
        formData.append("accesskey", API_ACCESS_KEY);
        formData.append("get_user_data", "1");
        formData.append("user_id", user_id);

        const response = await axios.post(WALLET, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const data = response.data;
        if (data && !data.error && data.balance !== undefined) {
          setWalletBalance(data.balance);
        }
      } catch (error) {
        console.log("Error fetching wallet balance:", error);
      }
    };
    fetchWalletBalance();
  }, [userData]);

  const fetchDeliveryTimeSlots = async () => {
    try {
      const formData = new FormData();
      formData.append("get_time_slots", "1");
      formData.append("accesskey", API_ACCESS_KEY);

      const response = await axios.post(GET_PAYMENT_METHODS, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const data = response.data;
      if (data && !data.error && data.time_slots) return data.time_slots;
      return [];
    } catch (error) {
      console.log("Error fetching delivery time slots:", error);
      return [];
    }
  };

  const fetchPaymentMethods = async () => {
    try {
      const formData = new FormData();
      formData.append("accesskey", API_ACCESS_KEY);
      formData.append("settings", "1");
      formData.append("get_payment_methods", "1");

      const response = await axios.post(GET_PAYMENT_METHODS, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const paymentMethodsObj = response.data.payment_methods || {};
      const enabledMethods = Object.keys(paymentMethodsObj)
        .filter(
          (key) =>
            key.endsWith("_payment_method") &&
            (paymentMethodsObj[key] === "1" || paymentMethodsObj[key] === 1)
        )
        .map((key) => ({
          key,
          title: key.replace("_payment_method", "").toUpperCase(),
        }));

      setPaymentMethods(enabledMethods);
    } catch (error) {
      console.log("Error fetching payment methods:", error);
      setPaymentMethods([]);
    }
  };

  useEffect(() => {
    const loadTimeSlots = async () => {
      const slots = await fetchDeliveryTimeSlots();
      setTimeSlots(slots);
    };
    loadTimeSlots();
  }, []);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? hp("12%") : 0}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: hp("2%") }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View style={styles.progressStepActive}>
              <Image
                source={require("../Assets/icon/arrow4.png")}
                style={{
                  width: wp("7%"),
                  height: wp("7%"),
                  borderRadius: wp("3.5%"),
                }}
              />
              <Text style={styles.progressTextActive}>Delivery</Text>
            </View>
            <View style={styles.progressStepInactive}>
              <Image
                source={require("../Assets/icon/arrow2.png")}
                style={{
                  width: wp("7%"),
                  height: wp("7%"),
                  borderRadius: wp("3.5%"),
                }}
              />
              <Text style={styles.progressTextInactive}>Payment</Text>
            </View>
          </View>

          {/* Wallet Section */}
          <View style={styles.section}>
            <View style={[styles.row, { justifyContent: "space-between" }]}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={require("../Assets/icon/wallet.png")}
                  style={{
                    width: wp("7%"),
                    height: wp("7%"),
                    borderRadius: wp("3.5%"),
                  }}
                />
                <Text style={styles.sectionTitle}>Wallet</Text>
              </View>
              <CheckBox
                value={walletChecked}
                onValueChange={setWalletChecked}
                style={{ width: wp("5%"), height: wp("5%") }}
                tintColors={{ true: "#e53935", false: "#ccc" }}
              />
            </View>
            <Text style={styles.balanceText}>
              Total Balance: RM {walletBalance}
            </Text>
          </View>

          {/* Delivery Date & Note */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select delivery day</Text>
            <TouchableOpacity
              onPress={showDatePicker}
              style={styles.datePickerButton}
            >
              <Text style={styles.dateText}>{deliveryDate.toDateString()}</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              minimumDate={new Date()}
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />

            <View style={{ marginTop: hp("2%") }}>
              <Text style={styles.sectionTitle}>Note</Text>
              <TextInput
                style={styles.noteInput}
                placeholder="Add a note for your order..."
                placeholderTextColor="#999"
                value={note}
                onChangeText={setNote}
                multiline
              />
            </View>

            <View style={{ marginTop: hp("2%") }}>
              <Text style={styles.sectionTitle}>Select Delivery Time Slot</Text>
              {timeSlots.map((slot) => {
                const currentDate = new Date();
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const selected = new Date(deliveryDate);
                selected.setHours(0, 0, 0, 0);

                let disabled = false;
                if (selected.getTime() === today.getTime()) {
                  const currentHour = currentDate.getHours();
                  if (
                    currentHour >= 8 &&
                    slot.title.toLowerCase().includes("morning")
                  ) {
                    disabled = true;
                  }
                }

                return (
                  <TouchableOpacity
                    key={slot.id}
                    onPress={() => !disabled && setDeliveryMethod(slot.title)}
                    style={[styles.radioButton, disabled && { opacity: 0.5 }]}
                    disabled={disabled}
                  >
                    <View
                      style={
                        deliveryMethod === slot.title
                          ? styles.radioChecked
                          : styles.radioUnchecked
                      }
                    />
                    <Text style={styles.optionText}>{slot.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.key}
                onPress={() => setPaymentMethod(method.title)}
                style={styles.radioButton}
              >
                <View
                  style={
                    paymentMethod === method.title
                      ? styles.radioChecked
                      : styles.radioUnchecked
                  }
                />
                <Text style={styles.optionText}>{method.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.totalText}>Total : RM{totalAmount}</Text>
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={async () => {
              try {
                console.log("🚀 ORDER PROCESS API CALL - Processing order");

                const formData = new FormData();

                // Required parameters as specified
                formData.append("accesskey", API_ACCESS_KEY);
                formData.append("tax_amount", totalAmount * 0.08); // 8% tax
                formData.append("loyalty_Points_used", "false");
                formData.append("latitude", selectedAddress?.latitude || "0");
                formData.append("delivery_time", deliveryMethod || "");
                formData.append("total_items", cartItems?.length || 0);
                formData.append("total", totalAmount);
                formData.append(
                  "delivery_method",
                  selectedDeliveryMethod || ""
                );
                formData.append("place_order", "1");
                formData.append("payment_method", paymentMethod || "cod");
                formData.append("email", userData?.email || "");
                formData.append("longitude", selectedAddress?.longitude || "0");
                formData.append(
                  "quantity",
                  JSON.stringify(cartItems?.map((item) => item.quantity))
                );
                formData.append(
                  "address",
                  selectedAddress?.street || selectedAddress?.address || ""
                );
                formData.append(
                  "mobile",
                  selectedAddress?.mobile || userData?.mobile || ""
                );
                formData.append("wallet_balance", walletBalance);
                formData.append(
                  "delivery_state",
                  selectedAddress?.state_id || ""
                );
                formData.append("loyalty_Points", "0");
                formData.append(
                  "delivery_date",
                  deliveryDate.toISOString().split("T")[0]
                );
                formData.append("delivery_charge", 0); // Will be calculated by API
                formData.append("user_id", userData?.user_id || "");
                formData.append(
                  "final_total",
                  totalAmount + totalAmount * 0.08
                );
                formData.append("tax_percentage", "8");
                formData.append(
                  "wallet_used",
                  walletChecked ? "true" : "false"
                );
                formData.append(
                  "product_variant_id",
                  JSON.stringify(
                    cartItems?.map((item) => item.product_variant_id || item.id)
                  )
                );

                console.log("📤 ORDER PROCESS API REQUEST:", {
                  accesskey: API_ACCESS_KEY,
                  tax_amount: totalAmount * 0.08,
                  loyalty_Points_used: "false",
                  latitude: selectedAddress?.latitude || "0",
                  delivery_time: deliveryMethod || "",
                  total_items: cartItems?.length || 0,
                  total: totalAmount,
                  delivery_method: selectedDeliveryMethod || "",
                  place_order: "1",
                  payment_method: paymentMethod || "cod",
                  email: userData?.email || "",
                  longitude: selectedAddress?.longitude || "0",
                  quantity: cartItems?.map((item) => item.quantity),
                  address:
                    selectedAddress?.street || selectedAddress?.address || "",
                  mobile: selectedAddress?.mobile || userData?.mobile || "",
                  wallet_balance: walletBalance,
                  delivery_state: selectedAddress?.state_id || "",
                  loyalty_Points: "0",
                  delivery_date: deliveryDate.toISOString().split("T")[0],
                  delivery_charge: 0,
                  user_id: userData?.user_id || "",
                  final_total: totalAmount + totalAmount * 0.08,
                  tax_percentage: "8",
                  wallet_used: walletChecked ? "true" : "false",
                  product_variant_id: cartItems?.map(
                    (item) => item.product_variant_id || item.id
                  ),
                  endpoint: ORDER_PROCESS,
                });

                const response = await axios.post(ORDER_PROCESS, formData, {
                  headers: { "Content-Type": "multipart/form-data" },
                });

                console.log("✅ ORDER PROCESS API SUCCESS:", {
                  status: response.status,
                  data: response.data,
                  message: response.data?.message,
                  error: response.data?.error,
                  order_id: response.data?.order_id,
                });

                // Log complete response data for debugging
                console.log("📊 COMPLETE API RESPONSE:", {
                  status: response.status,
                  statusText: response.statusText,
                  headers: response.headers,
                  data: response.data,
                  order_id: response.data?.order_id,
                  error: response.data?.error,
                  message: response.data?.message,
                });

                if (response.data && response.data.error === "false") {
                  // Order successful - show alert for 1 second then navigate
                  Alert.alert(
                    "🎉 Order Placed Successfully!",
                    `Order ID: ${
                      response.data?.order_id || "N/A"
                    }\nTotal Amount: RM ${totalAmount}`,
                    [],
                    { cancelable: false }
                  );

                  // Navigate to OrderConfirm after 1 second
                  setTimeout(() => {
                    navigation.navigate("OrderConfirm", {
                      orderId: response.data?.order_id,
                      totalAmount: totalAmount,
                    });
                  }, 1000);
                } else {
                  Alert.alert(
                    "❌ Order Failed",
                    response.data?.message ||
                      "Failed to place order. Please try again."
                  );
                }
              } catch (error) {
                console.error("❌ ORDER PROCESS API ERROR:", {
                  message: error.message,
                  response: error.response?.data,
                  status: error.response?.status,
                  endpoint: ORDER_PROCESS,
                });
                Alert.alert(
                  "Error",
                  "Failed to place order. Please try again."
                );
              }
            }}
          >
            <Text style={styles.proceedText}>PROCEED</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  section: {
    backgroundColor: "white",
    borderRadius: wp("3%"),
    marginHorizontal: wp("4%"),
    marginVertical: hp("1%"),
    padding: wp("4%"),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: wp("2%"),
    shadowOffset: { width: 0, height: hp("0.5%") },
    elevation: 3,
  },
  sectionTitle: {
    fontSize: wp("4%"),
    color: "#e53935",
    fontWeight: "600",
    marginBottom: hp("1%"),
    paddingTop: hp("1%"),
    paddingLeft: wp("2%"),
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: hp("1%") },
  balanceText: { fontSize: wp("4%"), color: "#444", marginTop: hp("0.5%") },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("1%"),
  },
  radioChecked: {
    width: wp("5%"),
    height: wp("5%"),
    borderRadius: wp("2.5%"),
    backgroundColor: "#e53935",
    marginRight: wp("3%"),
  },
  radioUnchecked: {
    width: wp("5%"),
    height: wp("5%"),
    borderRadius: wp("2.5%"),
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: wp("3%"),
  },
  optionText: { fontSize: wp("4%"), color: "#444" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: wp("3%"),
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  totalText: { fontSize: wp("4.5%"), fontWeight: "700", color: "#333" },
  proceedButton: {
    backgroundColor: "#e53935",
    paddingHorizontal: wp("8%"),
    paddingVertical: hp("1.5%"),
    borderRadius: wp("7%"),
    shadowColor: "#e53935",
    shadowOpacity: 0.3,
    shadowRadius: wp("1%"),
    shadowOffset: { width: 0, height: hp("0.5%") },
    elevation: 2,
  },
  proceedText: { color: "#fff", fontSize: wp("4%"), fontWeight: "600" },
  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: hp("2%"),
    justifyContent: "center",
    marginHorizontal: wp("4%"),
    borderRadius: wp("3%"),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: wp("2%"),
    shadowOffset: { width: 0, height: hp("0.5%") },
    elevation: 2,
    marginVertical: hp("1.5%"),
  },
  progressStepActive: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: wp("7%"),
    gap: wp("2%"),
  },
  progressStepInactive: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
  },
  progressTextActive: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: wp("4%"),
  },
  progressTextInactive: {
    color: "#888",
    fontWeight: "bold",
    fontSize: wp("4%"),
  },
  datePickerButton: {
    padding: wp("3%"),
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: wp("3%"),
    marginVertical: hp("1%"),
    backgroundColor: "#fafafa",
  },
  dateText: { fontSize: wp("4%"), color: "#555" },
  noteInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: wp("3%"),
    padding: wp("3%"),
    fontSize: wp("4%"),
    minHeight: hp("10%"),
    textAlignVertical: "top",
    backgroundColor: "#fafafa",
    marginTop: hp("0.5%"),
  },
});

export default Payment;
