import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import axios from "axios";
import { API_ACCESS_KEY, GET_DELIVERY_METHODS } from "../config/config";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRoute, useNavigation } from "@react-navigation/native";

import { fetchCartItems } from "../Fuctions/CartService";
import Header from "../components/Header";

const CheckoutScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { selectedAddress, selectedDeliveryMethod: routeDeliveryMethod } =
    route.params || {};
  const [promo, setPromo] = useState("");
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(
    routeDeliveryMethod || ""
  );
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
  // State for custom order confirmation modal
  const [orderConfirmVisible, setOrderConfirmVisible] = useState(false);

  // Cart state for storing all cart data
  const [cartItems, setCartItems] = useState([]);
  console.log("Cart Items:", cartItems);
  useEffect(() => {
    const loadCart = async () => {
      try {
        const items = await fetchCartItems();
        setCartItems(items);
        console.log("Cart Items:", items);
      } catch (error) {
        console.error("Failed to fetch cart items:", error);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    console.log("Selected Address Params:", selectedAddress);
  }, [selectedAddress]);

  useEffect(() => {
    if (route.params?.selectedDeliveryMethod) {
      setSelectedDeliveryMethod(route.params.selectedDeliveryMethod);
    }
  }, [route.params?.selectedDeliveryMethod]);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const taxableAmount = subtotal;
  const deliveryCharge = selectedDeliveryMethod
    ? parseFloat(
        deliveryMethods.find((d) => d.id === selectedDeliveryMethod)?.value || 0
      )
    : 0;
  const total = subtotal + tax + deliveryCharge;

  useEffect(() => {
    const fetchDeliveryMethods = async () => {
      try {
        const formData = new FormData();
        formData.append("accesskey", API_ACCESS_KEY);

        const response = await axios.post(GET_DELIVERY_METHODS, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Delivery Methods response:", response.data);

        if (response.data && typeof response.data === "object") {
          // Only include delivery methods where value is "1"
          const deliveryArray = Object.keys(response.data)
            .filter((key) => response.data[key] === "1")
            .map((key) => ({
              id: key,
              name: key.replace(/_/g, " "),
              value: response.data[key],
            }));

          setDeliveryMethods(deliveryArray);
          console.log("Saved deliveryMethods:", deliveryArray);
        }
      } catch (error) {
        console.error("Failed to fetch delivery methods:", error);
      }
    };

    fetchDeliveryMethods();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? hp("12%") : 0}
      >
        <Header title="Checkout" onBack={() => navigation.goBack()} />
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: hp("12%") }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Progress Bar */}
          <View style={styles.progressBar}>
            <View style={styles.progressStepActive}>
              <Image
                source={require("../Assets/icon/arrow2.png")}
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
                source={require("../Assets/icon/arrow3.png")}
                style={{
                  width: wp("7%"),
                  height: wp("7%"),
                  borderRadius: wp("3.5%"),
                }}
              />
              <Text style={styles.progressTextInactive}>Payment</Text>
            </View>
          </View>
          {/* Delivery Address */}
          <View style={styles.card}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={styles.sectionTitle}>Delivery Address</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("AddressPage", {
                    selectedAddress,
                    selectedDeliveryMethod,
                  })
                }
              >
                <Icon name="edit" size={wp("6%")} color="#444" />
              </TouchableOpacity>
            </View>
            <Text style={styles.name}>
              {selectedAddress ? selectedAddress.name : "Veeramani"}
            </Text>
            <Text style={styles.info}>
              {selectedAddress
                ? selectedAddress.street +
                  ", " +
                  selectedAddress.city +
                  ", " +
                  selectedAddress.state +
                  " - " +
                  selectedAddress.zip
                : "No 23, 5th street, little mount, Saidapet, Chennai - 600015"}
            </Text>
            <Text style={styles.info}>
              Mobile: {selectedAddress ? selectedAddress.mobile : "9176123456"}
            </Text>
            <Text style={styles.info}>
              Email:{" "}
              {selectedAddress
                ? selectedAddress.email
                : "veeramani23@gmail.com"}
            </Text>
          </View>
          {/* Promo Code */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Have a Promo Code?</Text>
            <View style={styles.promoContainer}>
              <TextInput
                style={styles.promoInput}
                placeholder="Promo Code"
                value={promo}
                onChangeText={setPromo}
                placeholderTextColor="#aaa"
              />
              <TouchableOpacity style={styles.applyBtn}>
                <Text style={styles.applyBtnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Delivery Method */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Delivery Method</Text>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                borderRadius: 6,
                marginTop: hp("1%"),
              }}
              onPress={() => setDeliveryModalVisible(true)}
            >
              <Text>
                {selectedDeliveryMethod
                  ? deliveryMethods.find((d) => d.id === selectedDeliveryMethod)
                      ?.name
                  : "Select Delivery Method"}
              </Text>
            </TouchableOpacity>
            <Modal
              visible={deliveryModalVisible}
              transparent
              animationType="slide"
              onRequestClose={() => setDeliveryModalVisible(false)}
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    margin: 20,
                    borderRadius: 8,
                    padding: 20,
                  }}
                >
                  {Array.isArray(deliveryMethods) &&
                  deliveryMethods.length > 0 ? (
                    deliveryMethods.map((method) => (
                      <TouchableOpacity
                        key={method.id}
                        style={{ padding: 10 }}
                        onPress={() => {
                          setSelectedDeliveryMethod(method.id);
                          setDeliveryModalVisible(false);
                        }}
                      >
                        <Text>{method.name}</Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text
                      style={{
                        padding: 10,
                        color: "#888",
                        textAlign: "center",
                      }}
                    >
                      No delivery methods available
                    </Text>
                  )}
                  <TouchableOpacity
                    style={{ padding: 10, marginTop: 10 }}
                    onPress={() => setDeliveryModalVisible(false)}
                  >
                    <Text style={{ color: "red", textAlign: "center" }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
          {/* Order Summary */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Order Summary</Text>

            {/* Order Items Table */}
            <View style={styles.orderTable}>
              {/* Table Header */}
              <View style={styles.orderHeader}>
                <Text style={styles.orderHeaderCell}>Product</Text>
                <Text style={styles.orderHeaderCell}>Qty</Text>
                <Text style={styles.orderHeaderCell}>Price</Text>
                <Text style={styles.orderHeaderCell}>Total</Text>
              </View>

              {/* Order Items */}
              {cartItems.map((item, index) => (
                <View key={index} style={styles.orderRow}>
                  <Text style={styles.orderProductCell} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.orderCell}>{item.quantity}</Text>
                  <Text style={styles.orderCell}>RM{item.price}</Text>
                  <Text style={styles.orderCell}>
                    RM{(item.price * item.quantity).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Summary Breakdown */}
            <View style={styles.summaryBreakdown}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  RM{taxableAmount.toFixed(2)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax (8%)</Text>
                <Text style={styles.summaryValue}>RM{tax.toFixed(2)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Charge</Text>
                <Text style={styles.summaryValue}>
                  RM{deliveryCharge.toFixed(2)}
                </Text>
              </View>

              {/* Total */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>RM{total.toFixed(2)}</Text>
              </View>
            </View>
          </View>
          {/* Custom Order Confirmation Modal */}
          <Modal
            visible={orderConfirmVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setOrderConfirmVisible(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  padding: wp("5%"),
                  borderRadius: wp("2.5%"),
                  margin: wp("5%"),
                  elevation: 2,
                  shadowColor: "#ccc",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.18,
                  shadowRadius: 3,
                  width: wp("70%"),
                  maxHeight: hp("80%"),
                }}
              >
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text
                    style={{
                      color: "#E81618",
                      fontSize: wp("4%"),
                      fontWeight: "500",
                      fontFamily: "Poppins",
                      lineHeight: hp("3%"),
                      textAlign: "center",
                      marginBottom: hp("1%"),
                    }}
                  >
                    Confirm Order Amount
                  </Text>
                  <View
                    style={{
                      borderBottomColor: "#ccc",
                      borderBottomWidth: 2,
                      marginVertical: hp("1.5%"),
                    }}
                  />
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: hp("0.5%"),
                    }}
                  >
                    <Text style={styles.modalText}>Items Amount</Text>
                    <Text style={styles.modalText}>
                      <Text style={{ fontSize: wp("2.5%") }}>RM</Text>{" "}
                      {subtotal.toFixed(2)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: hp("0.5%"),
                    }}
                  >
                    <Text style={styles.modalText}>Delivery Charge</Text>
                    <Text style={styles.modalText}>
                      <Text style={{ fontSize: wp("2.5%") }}>RM</Text>{" "}
                      {deliveryCharge.toFixed(2)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: hp("0.5%"),
                    }}
                  >
                    <Text style={styles.modalText}>Tax</Text>
                    <Text style={styles.modalText}>
                      <Text style={{ fontSize: wp("2.5%") }}>RM</Text>{" "}
                      {tax.toFixed(2)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: hp("0.5%"),
                    }}
                  >
                    <Text style={styles.modalText}>Total</Text>
                    <Text style={styles.modalText}>
                      <Text style={{ fontSize: wp("2.5%") }}>RM</Text>{" "}
                      {total.toFixed(2)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: hp("1.9%"),
                      width: "100%",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        borderWidth: 2,
                        borderColor: "#ccc",
                        borderRadius: wp("2.5%"),
                        backgroundColor: "#fff",
                        paddingVertical: hp("1%"),
                        marginRight: wp("2%"),
                        alignItems: "center",
                      }}
                      onPress={() => setOrderConfirmVisible(false)}
                    >
                      <Text style={[styles.modalText, { color: "#999" }]}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flex: 1,
                        backgroundColor: "#E81618",
                        borderRadius: wp("2%"),
                        paddingVertical: hp("1%"),
                        alignItems: "center",
                      }}
                      onPress={() => {
                        setOrderConfirmVisible(false); /* Place order logic */
                      }}
                    >
                      <Text style={[styles.modalText, { color: "#fff" }]}>
                        Confirm
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </Modal>
        </ScrollView>
        <View style={styles.totalBar}>
          <Icon name="info-outline" size={wp("4.5%")} color="#aaa" />
          <Text style={styles.totalText}>
            Total : <Text style={{ fontSize: wp("2.5%") }}>RM</Text>{" "}
            {total.toFixed(2)}
          </Text>
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={() =>
              navigation.navigate("Payment", {
                totalAmount: total,
                cartItems: cartItems,
                selectedAddress: selectedAddress,
                selectedDeliveryMethod: selectedDeliveryMethod,
              })
            }
          >
            <Text style={styles.confirmBtnText}>Confirm</Text>
            <Icon name="arrow-forward" size={wp("4.5%")} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#DDDDDD",
  },
  container: {
    backgroundColor: "#DDDDDD",
    flex: 1,
    paddingTop: 0,
  },

  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 0,
    paddingVertical: hp("2%"),
    justifyContent: "center",
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
    color: "#ED1B26",
    fontWeight: "bold",
    fontSize: wp("5%"),
  },
  progressTextInactive: {
    color: "#888",
    fontWeight: "bold",
    fontSize: wp("5%"),
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: wp("4%"),
    marginVertical: hp("1%"),
    borderRadius: wp("2%"),
    padding: wp("4%"),
    elevation: 1,
    shadowColor: "#ccc",
  },
  sectionTitle: {
    color: "#ED1B26",
    fontSize: wp("5%"),
    marginBottom: hp("1%"),
    fontWeight: "bold",
  },
  name: {
    fontWeight: "bold",
    fontSize: wp("4.5%"),
    marginTop: hp("1%"),
    color: "#111",
  },
  info: {
    fontSize: wp("3.5%"),
    color: "#444",
    marginTop: hp("0.5%"),
  },
  promoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  promoInput: {
    borderWidth: 0,
    backgroundColor: "#eaeaea",
    flex: 1,
    borderRadius: wp("1%"),
    height: hp("5%"),
    paddingHorizontal: wp("4%"),
    fontSize: wp("4%"),
    color: "#444",
  },
  applyBtn: {
    backgroundColor: "#ED1B26",
    borderRadius: wp("1%"),
    marginLeft: wp("2%"),
    paddingHorizontal: wp("4.5%"),
    paddingVertical: hp("1.5%"),
  },
  applyBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: wp("4%"),
  },
  dropdown: {
    fontSize: wp("4%"),
    color: "#888",
    marginTop: hp("0.5%"),
  },
  orderTable: {
    marginTop: hp("1%"),
  },
  orderHeader: {
    flexDirection: "row",
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    paddingBottom: hp("1%"),
    marginBottom: hp("1%"),
  },
  orderHeaderCell: {
    flex: 1,
    fontSize: wp("3.5%"),
    color: "#666",
    fontWeight: "600",
    textAlign: "center",
  },
  orderRow: {
    flexDirection: "row",
    paddingVertical: hp("1%"),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
  },
  orderProductCell: {
    flex: 2,
    fontSize: wp("3.5%"),
    color: "#333",
    fontWeight: "500",
    paddingHorizontal: wp("1%"),
    textAlign: "left",
  },
  orderCell: {
    flex: 1,
    fontSize: wp("3.5%"),
    color: "#666",
    fontWeight: "500",
    textAlign: "center",
    paddingHorizontal: wp("1%"),
  },
  summaryBreakdown: {
    marginTop: hp("2%"),
    paddingTop: hp("2%"),
   // borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: hp("0.5%"),
  },
  summaryLabel: {
    fontSize: wp("4%"),
    color: "#666",
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: wp("4%"),
    color: "#333",
    fontWeight: "600",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: hp("1%"),
    marginTop: hp("1%"),
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  totalLabel: {
    fontSize: wp("4.5%"),
    color: "#111",
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: wp("4.5%"),
    color: "#ED1B26",
    fontWeight: "bold",
  },
  totalBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: wp("5%"),
    paddingTop: hp("1.5%"),
    paddingBottom: hp("3%"),
    borderTopColor: "#eee",
    borderTopWidth: 2,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 10,
  },
  totalText: {
    fontSize: wp("5%"),
    fontWeight: "bold",
    marginLeft: wp("2%"),
    flex: 1,
    color: "#111",
  },
  confirmBtn: {
    flexDirection: "row",
    backgroundColor: "#ED1B26",
    borderRadius: wp("1%"),
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("1.5%"),
    alignItems: "center",
    marginLeft: wp("2%"),
  },
  confirmBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: wp("4%"),
    marginRight: wp("1.5%"),
  },
  modalText: {
    fontFamily: "Poppins",
    fontWeight: "400",
    fontSize: wp("3%"),
    lineHeight: hp("2.5%"),
    textTransform: "capitalize",
    color: "#343434",
  },
});

export default CheckoutScreen;
