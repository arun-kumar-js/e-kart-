import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { commonTextStyles } from "../../config/globalStyles";
import axios from "axios";
import { TRACK_OREDER, API_ACCESS_KEY } from "../../config/config";

const TrackOrderDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderData } = route.params;

  console.log("📋 TRACK ORDER DETAILS - Order data received:", orderData);

  // Helper function to format date from status array
  const formatStatusDate = (statusArray, statusType) => {
    if (!statusArray || !Array.isArray(statusArray)) return null;

    const statusItem = statusArray.find(
      (item) => Array.isArray(item) && item[0] === statusType
    );

    if (statusItem && statusItem[1]) {
      try {
        const date = new Date(statusItem[1]);
        if (!isNaN(date.getTime())) {
          return {
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            fullDate: statusItem[1], // Keep original format as fallback
          };
        }
      } catch (error) {
        console.log(`Error parsing date for ${statusType}:`, error);
      }
    }
    return null;
  };

  // Get formatted dates for different statuses
  const receivedDate = formatStatusDate(orderData?.status, "received");
  const cancelledDate = formatStatusDate(orderData?.status, "cancelled");
  const processedDate = formatStatusDate(orderData?.status, "processed");
  const shippedDate = formatStatusDate(orderData?.status, "shipped");
  const deliveredDate = formatStatusDate(orderData?.status, "delivered");

  // Helper function to get date from status array by index
  const getStatusDate = (index) => {
    if (orderData?.status?.[index]?.[1]) {
      try {
        const dateString = orderData.status[index][1];
        // Parse date format: "26-08-2025 01:02:26am"
        const [datePart, timePart] = dateString.split(" ");
        const [day, month, year] = datePart.split("-");

        // Create date object (month is 0-indexed in JavaScript)
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day)
        );

        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString();
        }
      } catch (error) {
        console.log(`Error parsing date at index ${index}:`, error);
      }
    }
    return "N/A";
  };

  // Helper function to get time from status array by index
  const getStatusTime = (index) => {
    if (orderData?.status?.[index]?.[1]) {
      try {
        const dateString = orderData.status[index][1];
        // Parse date format: "26-08-2025 01:02:26am"
        const [datePart, timePart] = dateString.split(" ");
        const [day, month, year] = datePart.split("-");
        const [hour, minute] = timePart
          .replace("am", "")
          .replace("pm", "")
          .split(":");

        // Create date object (month is 0-indexed in JavaScript)
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hour),
          parseInt(minute)
        );

        if (!isNaN(date.getTime())) {
          return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
        }
      } catch (error) {
        console.log(`Error parsing time at index ${index}:`, error);
      }
    }
    return "N/A";
  };

  const handleCancelOrder = () => {
    Alert.alert("Cancel Order", "Do you want to cancel this order?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          try {
            console.log("🚫 CANCEL ORDER API CALL - Starting...");

            const formData = new FormData();
            formData.append("accesskey", API_ACCESS_KEY);
            formData.append("order_id", orderData?.id);
            formData.append("status", "cancelled");
            formData.append("update_order_item_status", "1");
            formData.append("order_item_id", orderData?.items?.[0]?.id || "");

            console.log("🚫 CANCEL ORDER API REQUEST - Form data:", {
              accesskey: API_ACCESS_KEY,
              order_id: orderData?.id,
              status: "cancelled",
              update_order_item_status: "1",
              order_item_id: orderData?.items?.[0]?.id || "",
            });

            const response = await axios.post(TRACK_OREDER, formData);

            console.log(
              "🚫 CANCEL ORDER API SUCCESS - Response:",
              response.data
            );

            if (
              response.data.error === false ||
              response.data.error === "false"
            ) {
              Alert.alert(
                "✅ Order Cancelled",
                response.data.message ||
                  "Your order has been successfully cancelled.",
                [
                  {
                    text: "OK",
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } else {
              Alert.alert(
                "❌ Cancellation Failed",
                response.data.message ||
                  "Failed to cancel order. Please try again.",
                [{ text: "OK" }]
              );
            }
          } catch (error) {
            console.log("🚫 CANCEL ORDER API ERROR:", error);
            Alert.alert(
              "❌ Error",
              "Failed to cancel order. Please check your connection and try again.",
              [{ text: "OK" }]
            );
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track order</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Combined Order Details Card */}
        <View style={styles.card}>
          {/* Order Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Information</Text>
            <View style={styles.orderInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Ordered ID:</Text>
                <Text style={styles.infoValue}>{orderData?.id || "N/A"}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Order Date:</Text>
                <Text style={styles.infoValue}>
                  {orderData?.date_added || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <Text
                  style={[
                    styles.infoValue,
                    orderData?.active_status === "cancelled"
                      ? styles.cancelledStatus
                      : styles.activeStatus,
                  ]}
                >
                  {orderData?.active_status === "cancelled"
                    ? "Order Cancelled"
                    : orderData?.active_status === "received"
                    ? "Order Received"
                    : orderData?.active_status || "N/A"}
                </Text>
              </View>
            </View>
          </View>

          {/* Item Details */}
          {orderData?.items && orderData.items.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Item Details</Text>
              {orderData.items.map((product, index) => (
                <View key={index} style={styles.productItem}>
                  {product.image && (
                    <Image
                      source={{ uri: product.image }}
                      style={styles.productImage}
                    />
                  )}
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>
                      {product.name || "Product Name"}
                    </Text>
                    <Text style={styles.productQuantity}>
                      Qty. {product.quantity || "1"}
                    </Text>
                    <Text style={styles.productPrice}>
                      RM {product.price || "0.00"}
                    </Text>
                    <Text style={styles.productWeight}>
                      {product.measurement || "1"} {product.unit || "pc"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Price Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Details</Text>
            <View style={styles.priceInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Items Amount:</Text>
                <Text style={styles.infoValue}>
                  RM {orderData?.total || "0.00"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Delivery Charge:</Text>
                <Text style={styles.infoValue}>
                  RM {orderData?.delivery_charge || "0.0"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Tax:</Text>
                <Text style={styles.infoValue}>
                  + RM {orderData?.tax_amount || "0.00"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Total:</Text>
                <Text style={styles.infoValue}>
                  RM {orderData?.total || "0.00"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Grand Total:</Text>
                <Text style={[styles.infoValue, styles.grandTotal]}>
                  RM {orderData?.final_total || orderData?.total || "0.00"}
                </Text>
              </View>
            </View>
          </View>

          {/* Customer Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <View style={styles.customerInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>
                  {orderData?.user_name || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Mobile No:</Text>
                <Text style={styles.infoValue}>
                  {orderData?.mobile || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Address:</Text>
                <Text style={styles.infoValue}>
                  {orderData?.address || "Address not available"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Gmail:</Text>
                <Text style={styles.infoValue}>
                  {orderData?.user_email || "N/A"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Delivery Time:</Text>
                <Text style={styles.infoValue}>
                  {orderData?.delivery_time || "Today/Afternoon 2PM - 7PM"}
                </Text>
              </View>
            </View>
          </View>

          {/* Order Status Progress */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Status</Text>
            <View style={styles.progressContainer}>
              {/* Order Placed - Always active */}
              <View style={styles.progressStep}>
                <View style={[styles.progressCircle, styles.activeStep]}>
                  <Icon name="checkmark" size={16} color="#fff" />
                </View>
                <Text style={styles.stepLabel}>Order Placed</Text>
                <Text style={styles.stepDate}>{getStatusDate(0)}</Text>
                <Text style={styles.stepTime}>{getStatusTime(0)}</Text>
              </View>

              <View style={styles.progressLine} />

              {/* Order Processed */}
              <View style={styles.progressStep}>
                <View
                  style={[
                    styles.progressCircle,
                    orderData?.active_status === "cancelled"
                      ? styles.cancelledStep
                      : orderData?.active_status === "received"
                      ? styles.activeStep
                      : styles.inactiveStep,
                  ]}
                >
                  {orderData?.active_status === "cancelled" ? (
                    <Icon name="close" size={16} color="#fff" />
                  ) : orderData?.active_status === "received" ? (
                    <Icon name="checkmark" size={16} color="#fff" />
                  ) : (
                    <Text style={styles.stepNumber}>2</Text>
                  )}
                </View>
                <Text style={styles.stepLabel}>Order Processed</Text>
                {orderData?.active_status === "cancelled" && (
                  <Text style={styles.stepDate}>{getStatusDate(1)}</Text>
                )}
                {orderData?.active_status === "cancelled" && (
                  <Text style={styles.stepTime}>{getStatusTime(1)}</Text>
                )}
              </View>

              <View style={styles.progressLine} />

              {/* Order Shipped */}
              <View style={styles.progressStep}>
                <View
                  style={[
                    styles.progressCircle,
                    orderData?.active_status === "cancelled"
                      ? styles.cancelledStep
                      : styles.inactiveStep,
                  ]}
                >
                  {orderData?.active_status === "cancelled" ? (
                    <Icon name="close" size={16} color="#fff" />
                  ) : (
                    <Text style={styles.stepNumber}>3</Text>
                  )}
                </View>
                <Text style={styles.stepLabel}>Order Shipped</Text>
              </View>

              <View style={styles.progressLine} />

              {/* Order Delivered */}
              <View style={styles.progressStep}>
                <View
                  style={[
                    styles.progressCircle,
                    orderData?.active_status === "cancelled"
                      ? styles.cancelledStep
                      : styles.inactiveStep,
                  ]}
                >
                  {orderData?.active_status === "cancelled" ? (
                    <Icon name="close" size={16} color="#fff" />
                  ) : (
                    <Text style={styles.stepNumber}>4</Text>
                  )}
                </View>
                <Text style={styles.stepLabel}>Order Delivered</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Cancel Order Button - Only show if order is not cancelled */}
      {orderData?.active_status !== "cancelled" && (
        <View style={styles.bottomButtonContainer}>
          <TouchableOpacity
            style={styles.cancelOrderButton}
            onPress={handleCancelOrder}
          >
            <Text style={styles.cancelOrderButtonText}>CANCEL ORDER?</Text>
          </TouchableOpacity>
        </View>
      )}
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
    backgroundColor: "#EE2737",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  headerPlaceholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  section: {
    marginBottom: 25,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    fontFamily: "Poppins",
  },
  orderInfo: {
    gap: 12,
  },
  priceInfo: {
    gap: 12,
  },
  customerInfo: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Poppins",
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontFamily: "Poppins",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  grandTotal: {
    color: "#28a745",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelledStatus: {
    color: "#dc3545",
    fontWeight: "bold",
  },
  activeStatus: {
    color: "#28a745",
    fontWeight: "bold",
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
    fontFamily: "Poppins",
  },
  productQuantity: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
    fontFamily: "Poppins",
  },
  productPrice: {
    fontSize: 14,
    color: "#28a745",
    fontWeight: "bold",
    marginBottom: 3,
    fontFamily: "Poppins",
  },
  productWeight: {
    fontSize: 14,
    color: "#666",
    fontFamily: "Poppins",
  },
  cancelButton: {
    backgroundColor: "#EE2737",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  progressStep: {
    alignItems: "center",
    flex: 1,
  },
  progressCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  activeStep: {
    backgroundColor: "#28a745",
  },
  cancelledStep: {
    backgroundColor: "#dc3545",
  },
  inactiveStep: {
    backgroundColor: "#ccc",
  },
  stepNumber: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  stepLabel: {
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 4,
    fontFamily: "Poppins",
  },
  stepDate: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    fontFamily: "Poppins",
  },
  stepTime: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    fontFamily: "Poppins",
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  bottomButtonContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  cancelOrderButton: {
    backgroundColor: "#EE2737",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelOrderButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
});

export default TrackOrderDetails;
